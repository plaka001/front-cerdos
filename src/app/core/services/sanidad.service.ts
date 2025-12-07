import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface ReglaSanitaria {
    id: number;
    nombre_tarea: string;
    dias_target: number;
    evento_origen: 'parto' | 'inicio_lote' | 'destete' | 'servicio' | 'nacimiento';
    tipo_aplicacion: 'camada' | 'lote' | 'madre';
    obligatorio: boolean;
}

export interface TareaSanitaria {
    id_referencia: number; // ID of Cerda or Lote
    codigo_referencia: string; // Chapeta or Lote Code
    tipo_aplicacion: 'camada' | 'lote' | 'madre';
    nombre_tarea: string;
    fecha_programada: Date;
    estado: 'atrasado' | 'hoy' | 'proximo';
    dias_vencimiento: number; // Negative = overdue
}

@Injectable({
    providedIn: 'root'
})
export class SanidadService {
    private supabase = inject(SupabaseService);

    async getAgendaSanitaria(): Promise<TareaSanitaria[]> {
        const hoy = new Date();
        const limiteProximo = new Date();
        limiteProximo.setDate(hoy.getDate() + 7);
        hoy.setHours(0, 0, 0, 0);
        limiteProximo.setHours(23, 59, 59, 999);

        // Maximum days overdue to consider a task relevant (strict for initial launch)
        const MAX_DIAS_ATRASO = 7;

        // 1. Fetch Active Rules
        const { data: reglas, error: errReglas } = await this.supabase.client
            .from('reglas_sanitarias')
            .select('*')
            .eq('activo', true);

        if (errReglas) throw errReglas;

        // 2. Fetch Active Lotes
        const { data: lotes, error: errLotes } = await this.supabase.client
            .from('lotes')
            .select('*')
            .eq('estado', 'activo');

        if (errLotes) throw errLotes;

        // 3. Fetch ALL Active Cerdas (including those without cycles for replacement vaccinations)
        const { data: cerdas, error: errCerdas } = await this.supabase.client
            .from('cerdas')
            .select('*, ciclos_reproductivos(*)')
            .eq('activa', true);

        if (errCerdas) throw errCerdas;

        // 4. Fetch Today's Sanitary Events for Filtering
        const hoyString = hoy.toISOString().split('T')[0];
        const { data: eventosHoy, error: errEventos } = await this.supabase.client
            .from('eventos_sanitarios')
            .select('*')
            .eq('fecha', hoyString);

        if (errEventos) {
            console.error('Error fetching daily events:', errEventos);
            // Optionally throw or continue without filtering
        }

        const tareas: TareaSanitaria[] = [];

        // 5. Calculate Tasks

        // A. Lote Tasks
        for (const lote of lotes) {
            const fechaInicio = new Date(lote.fecha_inicio);
            const reglasLote = reglas.filter(r => r.tipo_aplicacion === 'lote' && r.evento_origen === 'inicio_lote');

            for (const regla of reglasLote) {
                const fechaTarea = new Date(fechaInicio);
                fechaTarea.setDate(fechaTarea.getDate() + regla.dias_target);
                fechaTarea.setHours(0, 0, 0, 0);

                // Calculate days difference for temporal filter
                const diffTime = fechaTarea.getTime() - hoy.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Only add if within time window (not too old, not too far in future)
                if (fechaTarea <= limiteProximo && diffDays >= -MAX_DIAS_ATRASO) {
                    tareas.push(this.crearTarea(
                        lote.id,
                        lote.codigo,
                        'lote',
                        regla.nombre_tarea,
                        fechaTarea,
                        hoy
                    ));
                }
            }
        }

        // B. Cerda/Camada Tasks
        for (const cerda of cerdas) {
            const ciclo = cerda.ciclos_reproductivos?.[0];
            const esReemplazo = cerda.partos_acumulados === 0 && cerda.estado === 'vacia';
            const esPrimeriza = cerda.partos_acumulados === 0;
            const esMultipara = cerda.partos_acumulados > 0;

            // Birth-based rules (for replacement gilts)
            if (cerda.fecha_nacimiento) {
                const reglasNacimiento = reglas.filter(r => r.evento_origen === 'nacimiento');
                const fechaNacimiento = new Date(cerda.fecha_nacimiento);

                for (const regla of reglasNacimiento) {
                    // Filter by sow type
                    const nombreLower = regla.nombre_tarea.toLowerCase();
                    const esReglaPrimeriza = nombreLower.includes('primeriza');
                    const esReglaMultipara = nombreLower.includes('multípara') || nombreLower.includes('multipara');
                    const esReglaReemplazo = nombreLower.includes('reemplazo');

                    // Skip if rule doesn't match sow type
                    if (esReglaReemplazo && !esReemplazo) continue;
                    if (esReglaPrimeriza && !esPrimeriza) continue;
                    if (esReglaMultipara && !esMultipara) continue;

                    const fechaTarea = new Date(fechaNacimiento);
                    fechaTarea.setDate(fechaTarea.getDate() + regla.dias_target);
                    fechaTarea.setHours(0, 0, 0, 0);

                    // Calculate days difference for temporal filter
                    const diffTime = fechaTarea.getTime() - hoy.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    // Only add if within time window (not too old, not too far in future)
                    if (fechaTarea <= limiteProximo && diffDays >= -MAX_DIAS_ATRASO) {
                        tareas.push(this.crearTarea(cerda.id, cerda.chapeta, regla.tipo_aplicacion, regla.nombre_tarea, fechaTarea, hoy));
                    }
                }
            }

            // Cycle-based rules (only if cerda has an active cycle)
            if (!ciclo) continue;

            const reglasServicio = reglas.filter(r => r.evento_origen === 'servicio');
            if (ciclo.fecha_inseminacion) {
                const fechaInsem = new Date(ciclo.fecha_inseminacion);
                for (const regla of reglasServicio) {
                    // Filter by sow type
                    const nombreLower = regla.nombre_tarea.toLowerCase();
                    const esReglaPrimeriza = nombreLower.includes('primeriza');
                    const esReglaMultipara = nombreLower.includes('multípara') || nombreLower.includes('multipara');

                    if (esReglaPrimeriza && !esPrimeriza) continue;
                    if (esReglaMultipara && !esMultipara) continue;

                    const fechaTarea = new Date(fechaInsem);
                    fechaTarea.setDate(fechaTarea.getDate() + regla.dias_target);
                    fechaTarea.setHours(0, 0, 0, 0);

                    // Calculate days difference for temporal filter
                    const diffTime = fechaTarea.getTime() - hoy.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    // Only add if within time window
                    if (fechaTarea <= limiteProximo && diffDays >= -MAX_DIAS_ATRASO) {
                        tareas.push(this.crearTarea(cerda.id, cerda.chapeta, regla.tipo_aplicacion, regla.nombre_tarea, fechaTarea, hoy));
                    }
                }
            }

            const reglasParto = reglas.filter(r => r.evento_origen === 'parto');
            if (ciclo.fecha_parto_real) {
                const fechaParto = new Date(ciclo.fecha_parto_real);
                for (const regla of reglasParto) {
                    // Filter by sow type
                    const nombreLower = regla.nombre_tarea.toLowerCase();
                    const esReglaPrimeriza = nombreLower.includes('primeriza');
                    const esReglaMultipara = nombreLower.includes('multípara') || nombreLower.includes('multipara');

                    if (esReglaPrimeriza && !esPrimeriza) continue;
                    if (esReglaMultipara && !esMultipara) continue;

                    const fechaTarea = new Date(fechaParto);
                    fechaTarea.setDate(fechaTarea.getDate() + regla.dias_target);
                    fechaTarea.setHours(0, 0, 0, 0);

                    // Calculate days difference for temporal filter
                    const diffTime = fechaTarea.getTime() - hoy.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    // Only add if within time window
                    if (fechaTarea <= limiteProximo && diffDays >= -MAX_DIAS_ATRASO) {
                        tareas.push(this.crearTarea(cerda.id, cerda.chapeta, regla.tipo_aplicacion, regla.nombre_tarea, fechaTarea, hoy));
                    }
                }
            }

            const reglasDestete = reglas.filter(r => r.evento_origen === 'destete');
            if (ciclo.fecha_destete) {
                const fechaDestete = new Date(ciclo.fecha_destete);
                for (const regla of reglasDestete) {
                    // Filter by sow type
                    const nombreLower = regla.nombre_tarea.toLowerCase();
                    const esReglaPrimeriza = nombreLower.includes('primeriza');
                    const esReglaMultipara = nombreLower.includes('multípara') || nombreLower.includes('multipara');

                    if (esReglaPrimeriza && !esPrimeriza) continue;
                    if (esReglaMultipara && !esMultipara) continue;

                    const fechaTarea = new Date(fechaDestete);
                    fechaTarea.setDate(fechaTarea.getDate() + regla.dias_target);
                    fechaTarea.setHours(0, 0, 0, 0);

                    // Calculate days difference for temporal filter
                    const diffTime = fechaTarea.getTime() - hoy.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    // Only add if within time window
                    if (fechaTarea <= limiteProximo && diffDays >= -MAX_DIAS_ATRASO) {
                        tareas.push(this.crearTarea(cerda.id, cerda.chapeta, regla.tipo_aplicacion, regla.nombre_tarea, fechaTarea, hoy));
                    }
                }
            }
        }

        // 6. Filter Completed Tasks Logic
        // Remove task if an event exists today for the same reference ID and containing task name in observations
        console.log('Tareas generadas (antes de filtrar):', tareas);

        const tareasFiltradas = tareas.filter(t => {
            const yaRealizada = eventosHoy?.some(e => {
                const mismoDestino = (t.tipo_aplicacion === 'lote' && e.lote_id === t.id_referencia) ||
                    (t.tipo_aplicacion !== 'lote' && e.cerda_id === t.id_referencia);

                // Flexible matching: check if observation includes the task name
                const coincidenciaTema = e.observacion && e.observacion.toLowerCase().includes(t.nombre_tarea.toLowerCase());

                return mismoDestino && coincidenciaTema;
            });

            return !yaRealizada; // Keep only if not realized
        });

        // 7. Sort
        return tareasFiltradas.sort((a, b) => a.fecha_programada.getTime() - b.fecha_programada.getTime());
    }

    private crearTarea(id: number, codigo: string, tipo: 'camada' | 'lote' | 'madre', nombre: string, fecha: Date, hoy: Date): TareaSanitaria {
        const diffTime = fecha.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let estado: 'atrasado' | 'hoy' | 'proximo' = 'proximo';
        if (diffDays < 0) estado = 'atrasado';
        else if (diffDays === 0) estado = 'hoy';

        return {
            id_referencia: id,
            codigo_referencia: codigo,
            tipo_aplicacion: tipo,
            nombre_tarea: nombre,
            fecha_programada: fecha,
            estado: estado,
            dias_vencimiento: diffDays
        };
    }
}
