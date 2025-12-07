--
-- PostgreSQL database dump
--

\restrict tbZErbYYkd2KGFDUiCtgoG5eUlgOUvLk6Ixi3VafeMoLvPj3qV2U0U5DpmlnnNj

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-3.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categorias_financieras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias_financieras (id, nombre, tipo_flujo, descripcion, created_at, es_automatica) FROM stdin;
1	Venta de Cerdos	operativo	Venta de animales de engorde (automática)	2025-12-07 20:18:37.627452+00	t
2	Venta de Cerda Descarte	operativo	Ingreso por venta de cerdas de descarte (automática)	2025-12-07 20:18:37.627452+00	t
3	Venta de Lechones	operativo	Venta de destetes (automática)	2025-12-07 20:18:37.627452+00	t
4	Compra Alimento	operativo	Concentrados y materia prima	2025-12-07 20:18:37.627452+00	f
5	Medicamentos	operativo	Insumos veterinarios y vacunas	2025-12-07 20:18:37.627452+00	f
6	Compra de Semen/Genética	operativo	Pago por pajillas o servicios de monta	2025-12-07 20:18:37.627452+00	f
7	Compra Materiales/Insumos	operativo	Agujas, desinfectantes, herramientas	2025-12-07 20:18:37.627452+00	f
8	Nomina	operativo	Pago de personal	2025-12-07 20:18:37.627452+00	f
9	Mantenimiento	operativo	Reparaciones locativas y equipos	2025-12-07 20:18:37.627452+00	f
10	Transporte	operativo	Fletes y movilización de animales	2025-12-07 20:18:37.627452+00	f
11	Compra de Pie de Cría	inversion	Compra de cerdas madres o verracos	2025-12-07 20:18:37.627452+00	f
12	Infraestructura	inversion	Construcción de corrales y bodegas	2025-12-07 20:18:37.627452+00	f
13	Maquinaria y Equipo	inversion	Herramientas de larga duración	2025-12-07 20:18:37.627452+00	f
14	Servicios Publicos	administrativo	Luz, Agua, Gas, Internet	2025-12-07 20:18:37.627452+00	f
15	Impuestos y Legal	administrativo	Gastos bancarios y legales	2025-12-07 20:18:37.627452+00	f
16	Venta de Abono/Porquinaza	operativo	Subproductos	2025-12-07 20:18:37.627452+00	f
17	Venta de Costales	operativo	Reciclaje	2025-12-07 20:18:37.627452+00	f
18	Prestamos / Aportes	operativo	Dinero externo o socios	2025-12-07 20:18:37.627452+00	f
\.


--
-- Data for Name: cerdas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cerdas (id, chapeta, fecha_nacimiento, raza, estado, partos_acumulados, activa, notas, created_at) FROM stdin;
9	08	2025-06-15	F1	vacia	0	t	\N	2025-12-07 01:48:33.880781+00
8	07	2025-06-15	F1	vacia	0	t	\N	2025-12-07 01:48:20.569372+00
1	La mona	2024-06-06	large white	vacia	1	t	\N	2025-12-07 01:31:00.681173+00
3	Roci	2024-06-06	F1	vacia	1	t	\N	2025-12-07 01:33:20.78016+00
4	La flaca	2024-06-06	F1	vacia	1	t	\N	2025-12-07 01:33:21.343612+00
5	La brava	2024-06-06	F1	vacia	1	t	\N	2025-12-07 01:34:20.480166+00
6	Juana	2025-07-19	F1	vacia	1	t	\N	2025-12-07 01:41:21.818891+00
7	Sol	2025-07-19	F1	vacia	1	t	\N	2025-12-07 01:41:45.996026+00
2	La jardineña	2024-06-06	F1	vacia	1	t	\N	2025-12-07 01:31:02.308943+00
\.


--
-- Data for Name: ciclos_reproductivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciclos_reproductivos (id, cerda_id, fecha_inseminacion, padre_semen, costo_servicio, fecha_parto_probable, fecha_parto_real, nacidos_vivos, nacidos_muertos, momias, fecha_destete, lechones_destetados, peso_promedio_destete, estado, created_at, observaciones) FROM stdin;
\.


--
-- Data for Name: insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insumos (id, nombre, tipo, unidad_medida, presentacion_compra, stock_actual, costo_promedio, stock_minimo, activo, created_at) FROM stdin;
2	Lactancia	alimento	kg	40	0	0	150	t	2025-12-07 01:23:09.044215+00
3	Pre-Inicio Fase 1	alimento	kg	40	0	0	100	t	2025-12-07 01:23:09.044215+00
4	Pre-Inicio	alimento	kg	40	0	0	100	t	2025-12-07 01:23:09.044215+00
5	Inicio	alimento	kg	40	0	0	200	t	2025-12-07 01:23:09.044215+00
6	Lech\\u00f3n Transici\\u00f3n	alimento	kg	40	0	0	200	t	2025-12-07 01:23:09.044215+00
7	Lech\\u00f3n 337	alimento	kg	40	0	0	300	t	2025-12-07 01:23:09.044215+00
8	Finalizador 337	alimento	kg	40	0	0	500	t	2025-12-07 01:23:09.044215+00
9	Vacuna Circovirus + Mycoplasma	biologico	dosis	50	0	0	20	t	2025-12-07 01:57:30.571465+00
10	Baycox (Toltrazuril)	medicamento	ml	250	0	0	20	t	2025-12-07 01:57:30.571465+00
11	Complejo B / Vitaminas	medicamento	ml	500	0	0	50	t	2025-12-07 01:57:30.571465+00
12	Vacuna Eri-Parvo-Lepto	biologico	dosis	50	0	0	10	t	2025-12-07 01:57:30.571465+00
13	Purgante Oral (Fenbendazol)	medicamento	ml	1000	0	0	100	t	2025-12-07 01:57:30.571465+00
14	Hierro Dextrano	medicamento	ml	100	0	0	50	t	2025-12-07 01:57:30.571465+00
15	Vacuna E. Coli	biologico	dosis	25	0	0	10	t	2025-12-07 01:57:30.571465+00
1	Gestacion	alimento	kg	40	0	0	200	t	2025-12-07 01:23:09.044215+00
\.


--
-- Data for Name: compras_insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compras_insumos (id, fecha, insumo_id, proveedor, cantidad_comprada, cantidad_real_ingresada, precio_total_factura, precio_unitario_final, numero_factura, created_at) FROM stdin;
\.


--
-- Data for Name: lotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lotes (id, codigo, fecha_inicio, fecha_cierre, ubicacion, cantidad_inicial, cantidad_actual, costo_inicial_lote, estado, created_at, peso_promedio_inicial, observaciones, peso_promedio_actual) FROM stdin;
\.


--
-- Data for Name: eventos_sanitarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos_sanitarios (id, fecha, tipo, lote_id, cerda_id, cantidad_afectada, observacion, created_at) FROM stdin;
\.


--
-- Data for Name: lote_origen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lote_origen (id, lote_id, ciclo_id, cantidad_aportada, created_at) FROM stdin;
\.


--
-- Data for Name: movimientos_caja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimientos_caja (id, fecha, tipo, categoria_id, monto, descripcion, metodo_pago, lote_relacionado_id, url_comprobante, created_at) FROM stdin;
\.


--
-- Data for Name: reglas_sanitarias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reglas_sanitarias (id, nombre_tarea, dias_target, evento_origen, tipo_aplicacion, obligatorio, activo) FROM stdin;
1	Reemplazo: Circovirus + Mycoplasma (Dosis 1)	145	nacimiento	madre	t	t
2	Reemplazo: Vacuna E. Coli	155	nacimiento	madre	t	t
3	Reemplazo: Circovirus + Mycoplasma (Dosis 2)	165	nacimiento	madre	t	t
4	Reemplazo: Eri-Parvo-Lepto (Dosis 1)	175	nacimiento	madre	t	t
5	Reemplazo: Eri-Parvo-Lepto (Dosis 2)	210	nacimiento	madre	t	t
6	Primeriza: Vacuna E. Coli (Dosis 1)	75	servicio	madre	t	t
7	Primeriza: Vacuna E. Coli (Dosis 2)	95	servicio	madre	t	t
8	Mult\\u00edpara: Vacuna E. Coli (Refuerzo)	90	servicio	madre	t	t
9	Mult\\u00edpara: Eri-Parvo-Lepto	7	parto	madre	t	t
10	Purga General (Antes del parto)	105	servicio	madre	t	t
11	Manejo: Descole, Castraci\\u00f3n + HIERRO	3	parto	camada	t	t
12	Aplicar Baycox (Anticoccidial)	5	parto	camada	t	t
13	Vacuna Mycoplasma + Circovirus	21	parto	camada	t	t
14	Purga y Vitaminas (Precebo)	35	parto	camada	t	t
\.


--
-- Data for Name: salidas_insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salidas_insumos (id, fecha, insumo_id, cantidad, destino_tipo, lote_id, cerda_id, costo_unitario_momento, notas, created_at) FROM stdin;
\.


--
-- Name: categorias_financieras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_financieras_id_seq', 18, true);


--
-- Name: cerdas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cerdas_id_seq', 1, false);


--
-- Name: ciclos_reproductivos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciclos_reproductivos_id_seq', 1, false);


--
-- Name: compras_insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compras_insumos_id_seq', 1, false);


--
-- Name: eventos_sanitarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_sanitarios_id_seq', 1, false);


--
-- Name: insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insumos_id_seq', 1, true);


--
-- Name: lote_origen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lote_origen_id_seq', 1, false);


--
-- Name: lotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lotes_id_seq', 1, false);


--
-- Name: movimientos_caja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_caja_id_seq', 1, false);


--
-- Name: reglas_sanitarias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reglas_sanitarias_id_seq', 1, false);


--
-- Name: salidas_insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salidas_insumos_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict tbZErbYYkd2KGFDUiCtgoG5eUlgOUvLk6Ixi3VafeMoLvPj3qV2U0U5DpmlnnNj

