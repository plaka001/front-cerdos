-- Borramos la vista anterior si quedó mal creada
DROP VIEW IF EXISTS reporte_costos_maternidad;

CREATE OR REPLACE VIEW reporte_costos_maternidad AS
WITH gastos_mensuales AS (
    -- 1. Calculamos cuánto comieron las cerdas por mes
    SELECT 
        TO_CHAR(fecha, 'YYYY-MM') as mes,
        COALESCE(SUM(costo_total_salida), 0) as total_gastos
    FROM salidas_insumos
    WHERE destino_tipo = 'cerda'
    GROUP BY TO_CHAR(fecha, 'YYYY-MM')
),
produccion_mensual AS (
    -- 2. Calculamos cuántos lechones se destetaron por mes
    SELECT 
        TO_CHAR(fecha_destete, 'YYYY-MM') as mes,
        COALESCE(SUM(lechones_destetados), 0) as total_lechones
    FROM ciclos_reproductivos
    WHERE fecha_destete IS NOT NULL
    GROUP BY TO_CHAR(fecha_destete, 'YYYY-MM')
)
-- 3. Unimos las dos tablas virtuales
SELECT 
    COALESCE(g.mes, p.mes) as mes, -- Toma el mes de cualquiera de los dos lados
    COALESCE(g.total_gastos, 0) as total_gastos_madres,
    COALESCE(p.total_lechones, 0) as total_lechones_producidos,
    -- Calculamos el Costo Unitario
    CASE 
        WHEN COALESCE(p.total_lechones, 0) > 0 
        THEN COALESCE(g.total_gastos, 0) / p.total_lechones
        ELSE 0 
    END as costo_por_lechon
FROM gastos_mensuales g
FULL OUTER JOIN produccion_mensual p ON g.mes = p.mes
ORDER BY 1 DESC;

GRANT SELECT ON reporte_costos_maternidad TO anon, authenticated, service_role;
