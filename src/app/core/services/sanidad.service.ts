import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface ReglaSanitaria {
    id: number;
    nombre_tarea: string;
    dias_target: number;
    evento_origen: 'parto' | 'inicio_lote' | 'destete' | 'servicio';
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

        // 3. Fetch Active Cerdas with Cycles
        const { data: cerdas, error: errCerdas } = await this.supabase.client
            .from('cerdas')
            .select('*, ciclos_reproductivos(*)')
            .eq('activa', true)
            // Fix: 'activo' does not exist, use 'estado' = 'abierto' (or filtering in application if inner join behavior is tricky)
            // However, Supabase inner join filtering works if column exists. 
            // We'll filter for active cycles.
            .eq('ciclos_reproductivos.estado', 'abierto');

        if (errCerdas) throw errCerdas;

        const tareas: TareaSanitaria[] = [];

        // 4. Calculate Tasks

        // A. Lote Tasks
        for (const lote of lotes) {
            const fechaInicio = new Date(lote.fecha_inicio);

            const reglasLote = reglas.filter(r => r.tipo_aplicacion === 'lote' && r.evento_origen === 'inicio_lote');

            for (const regla of reglasLote) {
                const fechaTarea = new Date(fechaInicio);
                fechaTarea.setDate(fechaTarea.getDate() + regla.dias_target);
                fechaTarea.setHours(0, 0, 0, 0);

                // Filter logic
                if (fechaTarea <= limiteProximo) {
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
            const ciclo = cerda.ciclos_reproductivos?.[0]; // Assuming array is returned, even if size 1
            if (!ciclo) continue;

            // Rules based on 'servicio' (Insemination)
            const reglasServicio = reglas.filter(r => r.evento_origen === 'servicio');
            if (ciclo.fecha_inseminacion) {
                const fechaInsem = new Date(ciclo.fecha_inseminacion);
                for (const regla of reglasServicio) {
                    const fechaTarea = new Date(fechaInsem);
                    fechaTarea.setDate(fechaTarea.getDate() + regla.dias_target);
                    fechaTarea.setHours(0, 0, 0, 0);

                    if (fechaTarea <= limiteProximo) {
                        tareas.push(this.crearTarea(cerda.id, cerda.chapeta, regla.tipo_aplicacion, regla.nombre_tarea, fechaTarea, hoy));
                    }
                }
            }

            // Rules based on 'parto'
            const reglasParto = reglas.filter(r => r.evento_origen === 'parto');
            if (ciclo.fecha_parto_real) { // Use fecha_parto_real for actual events
                const fechaParto = new Date(ciclo.fecha_parto_real);
                for (const regla of reglasParto) {
                    const fechaTarea = new Date(fechaParto);
                    fechaTarea.setDate(fechaTarea.getDate() + regla.dias_target);
                    fechaTarea.setHours(0, 0, 0, 0);

                    if (fechaTarea <= limiteProximo) {
                        tareas.push(this.crearTarea(cerda.id, cerda.chapeta, regla.tipo_aplicacion, regla.nombre_tarea, fechaTarea, hoy));
                    }
                }
            }

            // Rules based on 'destete' (Assuming date is set when weaned)
            const reglasDestete = reglas.filter(r => r.evento_origen === 'destete');
            if (ciclo.fecha_destete) {
                const fechaDestete = new Date(ciclo.fecha_destete);
                for (const regla of reglasDestete) {
                    const fechaTarea = new Date(fechaDestete);
                    fechaTarea.setDate(fechaTarea.getDate() + regla.dias_target);
                    fechaTarea.setHours(0, 0, 0, 0);

                    if (fechaTarea <= limiteProximo) {
                        tareas.push(this.crearTarea(cerda.id, cerda.chapeta, regla.tipo_aplicacion, regla.nombre_tarea, fechaTarea, hoy));
                    }
                }
            }
        }

        // 5. Sort filters
        return tareas.sort((a, b) => a.fecha_programada.getTime() - b.fecha_programada.getTime());
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
