/* 
================================================================================
   SCRIPT MAESTRO DE SEMILLA DE DATOS (seed.sql)
   
   Propósito: Inicializar la base de datos con TODOS los datos críticos
   que el código Angular necesita para funcionar correctamente.
   
   Características:
   - IDEMPOTENTE: Se puede ejecutar múltiples veces sin duplicar datos
   - COMPLETO: Incluye categorías, insumos y reglas sanitarias
   - ROBUSTO: Repara datos huérfanos existentes
   
   Uso: Ejecutar después de crear el esquema de base de datos
================================================================================
*/

-- ============================================================================
-- 1. CATEGORÍAS FINANCIERAS (CRÍTICO PARA EL CÓDIGO)
-- ============================================================================

-- El código Angular busca estos nombres EXACTOS. Si no existen, genera errores.

-- A. CATEGORÍAS AUTOMÁTICAS (Usadas internamente por el sistema)
-- ============================================================================

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Venta de Cerdos', 'operativo', 'Venta de animales de engorde (automática)', true
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Venta de Cerdos');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Venta de Cerda Descarte', 'operativo', 'Ingreso por venta de cerdas de descarte (automática)', true
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Venta de Cerda Descarte');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Venta de Lechones', 'operativo', 'Venta de destetes (automática)', true
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Venta de Lechones');

-- B. CATEGORÍAS OPERATIVAS (Visibles para gastos manuales)
-- ============================================================================

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Compra Alimento', 'operativo', 'Concentrados y materia prima', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Compra Alimento');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Medicamentos', 'operativo', 'Insumos veterinarios y vacunas', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Medicamentos');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Compra de Semen/Genética', 'operativo', 'Pago por pajillas o servicios de monta', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Compra de Semen/Genética');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Compra Materiales/Insumos', 'operativo', 'Agujas, desinfectantes, herramientas', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Compra Materiales/Insumos');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Nomina', 'operativo', 'Pago de personal', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Nomina');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Mantenimiento', 'operativo', 'Reparaciones locativas y equipos', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Mantenimiento');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Transporte', 'operativo', 'Fletes y movilización de animales', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Transporte');

-- C. CATEGORÍAS DE INVERSIÓN
-- ============================================================================

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Compra de Pie de Cría', 'inversion', 'Compra de cerdas madres o verracos', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Compra de Pie de Cría');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Infraestructura', 'inversion', 'Construcción de corrales y bodegas', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Infraestructura');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Maquinaria y Equipo', 'inversion', 'Herramientas de larga duración', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Maquinaria y Equipo');

-- D. CATEGORÍAS ADMINISTRATIVAS
-- ============================================================================

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Servicios Publicos', 'administrativo', 'Luz, Agua, Gas, Internet', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Servicios Publicos');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Impuestos y Legal', 'administrativo', 'Gastos bancarios y legales', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Impuestos y Legal');

-- E. INGRESOS VARIOS (Manuales)
-- ============================================================================

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Venta de Abono/Porquinaza', 'operativo', 'Subproductos', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Venta de Abono/Porquinaza');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Venta de Costales', 'operativo', 'Reciclaje', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Venta de Costales');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Prestamos / Aportes', 'operativo', 'Dinero externo o socios', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Prestamos / Aportes');

-- ============================================================================
-- 2. INSUMOS MAESTROS (PERSONALIZADO A TU GRANJA)
-- ============================================================================

-- A. ALIMENTOS (Tus referencias específicas - Sacos de 40kg)
-- ============================================================================

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Gestación', 'alimento', 'kg', 40, 200
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Gestación');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Lactancia', 'alimento', 'kg', 40, 150
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Lactancia');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Pre-Inicio Fase 1', 'alimento', 'kg', 40, 100
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Pre-Inicio Fase 1');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Pre-Inicio', 'alimento', 'kg', 40, 100
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Pre-Inicio');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Inicio', 'alimento', 'kg', 40, 200
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Inicio');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Lechón Transición', 'alimento', 'kg', 40, 200
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Lechón Transición');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Lechón 337', 'alimento', 'kg', 40, 300
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Lechón 337');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Finalizador 337', 'alimento', 'kg', 40, 500
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Finalizador 337');

-- B. MEDICAMENTOS Y VACUNAS (Alineados con tu Plan Sanitario)
-- ============================================================================

-- Hierro y Anticoccidial (Para lechones día 3)
INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Hierro Dextrano', 'medicamento', 'ml', 100, 50
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Hierro Dextrano');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Baycox (Toltrazuril)', 'medicamento', 'ml', 250, 20
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Baycox (Toltrazuril)');

-- Vacunas (Para cumplir las alertas de Reemplazo, Madres y Lotes)
INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Vacuna Circovirus + Mycoplasma', 'biologico', 'dosis', 50, 10
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Vacuna Circovirus + Mycoplasma');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Vacuna E. Coli', 'biologico', 'dosis', 25, 10
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Vacuna E. Coli');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Vacuna Eri-Parvo-Lepto', 'biologico', 'dosis', 50, 10
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Vacuna Eri-Parvo-Lepto');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Vacuna Peste Porcina (PPC)', 'biologico', 'dosis', 50, 10
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Vacuna Peste Porcina (PPC)');

-- Purgas y Vitaminas
INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Ivermectina 1%', 'medicamento', 'ml', 500, 50
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Ivermectina 1%');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Purgante Oral (Fenbendazol)', 'medicamento', 'ml', 1000, 100
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Purgante Oral (Fenbendazol)');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Vitaminas AD3E', 'medicamento', 'ml', 250, 20
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Vitaminas AD3E');

-- Materiales
INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Agujas', 'material', 'unidad', 100, 50
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Agujas');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Yodo', 'material', 'ml', 1000, 200
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Yodo');

-- ============================================================================
-- 3. REGLAS SANITARIAS (PLAN DE VACUNACIÓN COMPLETO)
-- ============================================================================

-- IMPORTANTE: Estas reglas se usan para generar alertas automáticas en la Agenda Veterinaria

-- A. PLAN PARA LECHONES (Origen: 'parto' - desde el nacimiento)
-- ============================================================================

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Aplicar Hierro + Anticoccidial', 3, 'parto', 'camada', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Aplicar Hierro + Anticoccidial' AND evento_origen = 'parto');

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Vacuna Mycoplasma (Dosis 1)', 7, 'parto', 'camada', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Vacuna Mycoplasma (Dosis 1)' AND evento_origen = 'parto');

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Vacuna Circovirus + Myco (D2)', 21, 'parto', 'camada', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Vacuna Circovirus + Myco (D2)' AND evento_origen = 'parto');

-- B. PLAN PARA REEMPLAZOS (Origen: 'nacimiento' - basado en edad del animal)
-- ============================================================================

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Reemplazo: Vacuna Circovirus (145 días)', 145, 'nacimiento', 'madre', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Reemplazo: Vacuna Circovirus (145 días)' AND evento_origen = 'nacimiento');

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Reemplazo: Vacuna Parvo/Lepto (155 días)', 155, 'nacimiento', 'madre', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Reemplazo: Vacuna Parvo/Lepto (155 días)' AND evento_origen = 'nacimiento');

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Reemplazo: Refuerzo Parvo/Lepto (175 días)', 175, 'nacimiento', 'madre', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Reemplazo: Refuerzo Parvo/Lepto (175 días)' AND evento_origen = 'nacimiento');

-- C. PLAN PARA MADRES PRIMERIZAS (Origen: 'servicio' - desde inseminación)
-- ============================================================================

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Primeriza: Vacuna E.Coli (75 días gestación)', 75, 'servicio', 'madre', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Primeriza: Vacuna E.Coli (75 días gestación)' AND evento_origen = 'servicio');

-- D. PLAN PARA MADRES MULTÍPARAS (Origen: 'servicio' - desde inseminación)
-- ============================================================================

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Multípara: Vacuna E.Coli (90 días gestación)', 90, 'servicio', 'madre', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Multípara: Vacuna E.Coli (90 días gestación)' AND evento_origen = 'servicio');

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Purga Pre-Parto (Ivermectina)', 100, 'servicio', 'madre', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Purga Pre-Parto (Ivermectina)' AND evento_origen = 'servicio');

-- E. PLAN POST-DESTETE (Origen: 'destete')
-- ============================================================================

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Vitaminas AD3E Post-Lactancia', 1, 'destete', 'madre', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Vitaminas AD3E Post-Lactancia' AND evento_origen = 'destete');

-- F. PLAN PARA LOTES DE ENGORDE (Origen: 'inicio_lote')
-- ============================================================================

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Choque Vitamínico Llegada', 1, 'inicio_lote', 'lote', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Choque Vitamínico Llegada' AND evento_origen = 'inicio_lote');

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Purga General (Vermífugo)', 15, 'inicio_lote', 'lote', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Purga General (Vermífugo)' AND evento_origen = 'inicio_lote');

INSERT INTO reglas_sanitarias (nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo)
SELECT 'Vacuna Peste Porcina (PPC)', 50, 'inicio_lote', 'lote', true, true
WHERE NOT EXISTS (SELECT 1 FROM reglas_sanitarias WHERE nombre_tarea = 'Vacuna Peste Porcina (PPC)' AND evento_origen = 'inicio_lote');

-- ============================================================================
-- 4. REPARACIÓN DE DATOS HUÉRFANOS (Por si ya existen datos con problemas)
-- ============================================================================

-- Arreglar compras de cerdas que quedaron sin categoría
UPDATE movimientos_caja
SET categoria_id = (SELECT id FROM categorias_financieras WHERE nombre = 'Compra de Pie de Cría' LIMIT 1)
WHERE categoria_id IS NULL 
  AND (descripcion ILIKE '%cerda%' OR descripcion ILIKE '%marrana%' OR descripcion ILIKE '%pie de cría%');

-- Arreglar ventas de lotes que quedaron sin categoría
UPDATE movimientos_caja
SET categoria_id = (SELECT id FROM categorias_financieras WHERE nombre = 'Venta de Cerdos' LIMIT 1)
WHERE categoria_id IS NULL 
  AND (descripcion ILIKE '%venta lote%' OR descripcion ILIKE '%venta cerdo%');

-- Arreglar ventas de descarte que quedaron sin categoría
UPDATE movimientos_caja
SET categoria_id = (SELECT id FROM categorias_financieras WHERE nombre = 'Venta de Cerda Descarte' LIMIT 1)
WHERE categoria_id IS NULL 
  AND (descripcion ILIKE '%descarte%' OR descripcion ILIKE '%venta cerda%');

-- ============================================================================
-- 5. VERIFICACIÓN FINAL
-- ============================================================================

-- Mostrar resumen de lo que se insertó
DO $$
BEGIN
    RAISE NOTICE '=== SEED DATA APLICADO CORRECTAMENTE ===';
    RAISE NOTICE 'Categorías Financieras: % registros', (SELECT COUNT(*) FROM categorias_financieras);
    RAISE NOTICE 'Insumos: % registros', (SELECT COUNT(*) FROM insumos);
    RAISE NOTICE 'Reglas Sanitarias: % registros', (SELECT COUNT(*) FROM reglas_sanitarias);
    RAISE NOTICE '=========================================';
END $$;
