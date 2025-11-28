-- Corrección de datos del lote L-PRUEBA-FINAL
-- Bug: La venta parcial estaba dejando cantidad en 0 en lugar de restar correctamente

UPDATE lotes 
SET 
    cantidad_actual = 19, 
    estado = 'activo',
    fecha_cierre = NULL  -- Remover fecha de cierre si existe
WHERE codigo = 'L-PRUEBA-FINAL';

-- Verificar resultado
SELECT id, codigo, cantidad_inicial, cantidad_actual, estado, fecha_cierre 
FROM lotes 
WHERE codigo = 'L-PRUEBA-FINAL';
