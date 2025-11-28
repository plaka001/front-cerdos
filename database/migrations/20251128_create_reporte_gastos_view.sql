-- Vista para el reporte de Gastos por Categoría y Mes
CREATE OR REPLACE VIEW reporte_gastos_categoria AS
SELECT 
    TO_CHAR(m.fecha, 'YYYY-MM') as mes,
    c.nombre as categoria_nombre,
    c.tipo_flujo, -- 'operativo', 'administrativo', 'inversion'
    SUM(m.monto) as total_gastado,
    COUNT(m.id) as cantidad_movimientos
FROM movimientos_caja m
JOIN categorias_financieras c ON m.categoria_id = c.id
WHERE m.tipo = 'egreso' -- Solo gastos
GROUP BY 1, 2, 3
ORDER BY 1 DESC, 4 DESC;

-- Dar permisos
GRANT SELECT ON reporte_gastos_categoria TO anon, authenticated, service_role;
