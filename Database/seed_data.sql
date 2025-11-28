/* 

================================================================================

   SCRIPT MAESTRO DE CONFIGURACIÓN INICIAL (SEMILLA)

   Garantiza que existan todas las categorías e insumos necesarios para el código.

   No borra datos existentes.

================================================================================

*/

-- 1. ASEGURAR CATEGORÍAS FINANCIERAS (CRÍTICO PARA EL CÓDIGO)

-- El código Angular busca estos nombres exactos. Si no están, crea errores.

-- A. Categorías AUTOMÁTICAS (Bloqueadas en manual, usadas por el sistema internamente)

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Venta de Cerdos', 'operativo', 'Venta de animales de engorde', true
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Venta de Cerdos');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Venta de Lechones', 'operativo', 'Venta de destetes', true
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Venta de Lechones');

-- B. Categorías OPERATIVAS (Visibles en Gastos)

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Compra Alimento', 'operativo', 'Concentrados y materia prima', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Compra Alimento');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Medicamentos', 'operativo', 'Insumos veterinarios', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Medicamentos');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Nomina', 'operativo', 'Pago de personal', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Nomina');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Mantenimiento', 'operativo', 'Reparaciones locativas y equipos', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Mantenimiento');

-- C. Categorías de INVERSIÓN (Aquí falló tu código antes, esto lo arregla)

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Compra de Pie de Cría', 'inversion', 'Compra de cerdas madres o verracos', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Compra de Pie de Cría');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Infraestructura', 'inversion', 'Construcción de corrales y bodegas', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Infraestructura');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Maquinaria y Equipo', 'inversion', 'Herramientas de larga duración', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Maquinaria y Equipo');

-- D. Categorías ADMINISTRATIVAS

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Servicios Publicos', 'administrativo', 'Luz, Agua, Gas, Internet', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Servicios Publicos');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Impuestos y Legal', 'administrativo', 'Gastos bancarios y legales', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Impuestos y Legal');

-- E. Categorías de INGRESOS MANUALES (Ventas varias)

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Venta de Abono/Porquinaza', 'operativo', 'Subproductos', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Venta de Abono/Porquinaza');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Venta de Costales', 'operativo', 'Reciclaje', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Venta de Costales');

INSERT INTO categorias_financieras (nombre, tipo_flujo, descripcion, es_automatica)
SELECT 'Prestamos / Aportes', 'operativo', 'Dinero externo o socios', false
WHERE NOT EXISTS (SELECT 1 FROM categorias_financieras WHERE nombre = 'Prestamos / Aportes');

-- 2. ASEGURAR INSUMOS BÁSICOS (ESTÁNDAR COLOMBIANO)

-- Para que los selectores de "Alimentar" no salgan vacíos al iniciar.

-- Alimentos (Sacos de 40kg es el estándar)

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Pre-Iniciador', 'alimento', 'kg', 40, 100
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Pre-Iniciador');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Iniciación', 'alimento', 'kg', 40, 200
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Iniciación');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Levante', 'alimento', 'kg', 40, 300
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Levante');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Engorde', 'alimento', 'kg', 40, 500
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Engorde');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Gestación', 'alimento', 'kg', 40, 200
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Gestación');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Lactancia', 'alimento', 'kg', 40, 150
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Lactancia');

-- Medicamentos Básicos

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Ivermectina', 'medicamento', 'ml', 500, 50
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Ivermectina');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Hierro', 'medicamento', 'ml', 100, 20
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Hierro');

INSERT INTO insumos (nombre, tipo, unidad_medida, presentacion_compra, stock_minimo)
SELECT 'Yodo', 'medicamento', 'ml', 1000, 200
WHERE NOT EXISTS (SELECT 1 FROM insumos WHERE nombre = 'Yodo');

-- 3. REPARACIÓN DE DATOS HUÉRFANOS (Por si ya tenías errores)

-- Si hay gastos sin categoría, los asigna a 'Otros' o a la categoría por defecto que acabamos de crear.

-- Arreglar compras de cerdas que quedaron en NULL

UPDATE movimientos_caja
SET categoria_id = (SELECT id FROM categorias_financieras WHERE nombre = 'Compra de Pie de Cría' LIMIT 1)
WHERE categoria_id IS NULL AND (descripcion ILIKE '%cerda%' OR descripcion ILIKE '%marrana%');

-- Arreglar ventas de lotes que quedaron en NULL

UPDATE movimientos_caja
SET categoria_id = (SELECT id FROM categorias_financieras WHERE nombre = 'Venta de Cerdos' LIMIT 1)
WHERE categoria_id IS NULL AND (descripcion ILIKE '%venta lote%' OR descripcion ILIKE '%venta cerdo%');

