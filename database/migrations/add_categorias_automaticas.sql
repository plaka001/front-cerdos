-- ========================================
-- SCRIPT: Agregar Control de Categorías Automáticas
-- Fecha: 2025-11-25
-- Propósito: Diferenciar categorías automáticas (usadas por el sistema)
--            de categorías manuales (seleccionables por el usuario)
-- ========================================

-- 1. Agregar columna para controlar visibilidad
ALTER TABLE categorias_financieras 
ADD COLUMN es_automatica boolean DEFAULT false;

-- 2. Marcar las categorías que NO deben salir en el formulario manual
-- (Estas solo las usa el sistema internamente cuando vendes desde Lotes)
UPDATE categorias_financieras 
SET es_automatica = true 
WHERE nombre IN ('Venta de Cerdos', 'Venta de Lechones', 'Compra Alimento', 'Medicamentos');

-- 3. Crear categorías manuales seguras (si no existen)
INSERT INTO categorias_financieras (nombre, tipo, descripcion, es_automatica) 
VALUES
  ('Venta de Abono/Porquinaza', 'operativo', 'Venta de residuos orgánicos', false),
  ('Venta de Costales/Chatarra', 'operativo', 'Venta de material reciclable', false),
  ('Aportes de Capital', 'operativo', 'Dinero ingresado por socios', false),
  ('Prestamos Bancarios', 'operativo', 'Ingreso por deuda bancaria', false),
ON CONFLICT (nombre) DO NOTHING;

-- 4. Verificar resultados
SELECT id, nombre, tipo, es_automatica 
FROM categorias_financieras 
ORDER BY es_automatica DESC, tipo, nombre;

-- ========================================
-- NOTAS DE IMPLEMENTACIÓN
-- ========================================
-- Categorías Automáticas (es_automatica = true):
--   - Venta de Cerdos: Usada cuando vendes un lote completo
--   - Venta de Lechones: Usada cuando vendes lechones de un lote
--   - Compra Alimento: Usada para compras de alimento que impactan inventario
--   - Medicamentos: Usada para compras de medicamentos que impactan inventario
--
-- Categorías Manuales (es_automatica = false):
--   - Todas las demás categorías pueden ser seleccionadas manualmente
--   - Incluye las nuevas categorías de ingresos operativos
--
-- Frontend debe filtrar:
--   filteredCategorias = categorias.filter(c => !c.es_automatica)
-- ========================================
