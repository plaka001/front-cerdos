--
-- PostgreSQL database dump
--

\restrict 5LvD9VPYBJdcg6pnRuoUjZg8i6V0xktxPCUS2l3fGcPJTtz6m06qy4BgBcAoLCV

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
-- Data for Name: corrales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.corrales (id, nombre, tipo, capacidad_maxima, activo, created_at) FROM stdin;
3	Corral 1	engorde	7	t	2025-12-14 03:31:19.0992+00
4	Corral 2	engorde	7	t	2025-12-14 23:58:35.009091+00
5	Corral 3	engorde	6	t	2025-12-14 23:58:46.717474+00
6	Corral 4	engorde	6	t	2025-12-14 23:58:58.148602+00
7	Corral 5	engorde	18	t	2025-12-14 23:59:09.617016+00
8	Paridera 1	paridera	1	t	2025-12-14 23:59:40.658957+00
9	Paridera 2	paridera	1	t	2025-12-14 23:59:50.839279+00
1	Gestacion 1	gestacion	12	t	2025-12-14 03:25:19.553498+00
10	Paridera 3	paridera	1	t	2025-12-15 00:01:03.112561+00
\.


--
-- Data for Name: cerdas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cerdas (id, chapeta, fecha_nacimiento, raza, estado, partos_acumulados, activa, notas, created_at, corral_id) FROM stdin;
9	08	2025-06-15	F1	vacia	0	t	\N	2025-12-07 01:48:33.880781+00	1
8	07	2025-06-15	F1	vacia	0	t	\N	2025-12-07 01:48:20.569372+00	1
6	Juana	2025-07-19	F1	vacia	0	t	\N	2025-12-07 01:41:21.818891+00	1
7	Sol	2025-07-19	F1	vacia	0	t	\N	2025-12-07 01:41:45.996026+00	1
5	La brava	2024-06-06	F1	gestante	0	t	\N	2025-12-07 01:34:20.480166+00	1
3	Roci	2024-06-06	F1	gestante	0	t	\N	2025-12-07 01:33:20.78016+00	1
2	La jardineña	2024-06-06	F1	gestante	0	t	\N	2025-12-07 01:31:02.308943+00	1
4	La flaca	2024-06-06	F1	gestante	1	t	\N	2025-12-07 01:33:21.343612+00	1
1	La mona	2024-06-06	large white	lactante	1	t	\N	2025-12-07 01:31:00.681173+00	8
\.


--
-- Data for Name: ciclos_reproductivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciclos_reproductivos (id, cerda_id, fecha_inseminacion, padre_semen, costo_servicio, fecha_parto_probable, fecha_parto_real, nacidos_vivos, nacidos_muertos, momias, fecha_destete, lechones_destetados, peso_promedio_destete, estado, created_at, observaciones) FROM stdin;
1	1	2025-08-21	Semen 	0	\N	2025-12-11	15	0	0	\N	0	\N	abierto	2025-12-11 05:32:20.531263+00	15 vivos
3	5	2025-12-02	Semen	0	\N	\N	0	0	0	\N	0	\N	abierto	2025-12-11 05:35:17.306189+00	Inseminacion
4	3	2025-11-18	Duroc	0	\N	\N	0	0	0	\N	0	\N	abierto	2025-12-14 01:56:51.642067+00	\N
5	2	2025-09-29	410	0	\N	\N	0	0	0	\N	0	\N	abierto	2025-12-14 02:05:13.074701+00	\N
2	4	2025-12-03	Semen 	0	\N	2025-12-14	10	0	0	2025-12-14	10	15	cerrado	2025-12-11 05:34:34.489341+00	\N
6	4	2025-12-03	semen	0	\N	\N	0	0	0	\N	0	\N	abierto	2025-12-14 02:51:57.386614+00	\N
\.


--
-- Data for Name: insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insumos (id, nombre, tipo, unidad_medida, presentacion_compra, stock_actual, costo_promedio, stock_minimo, activo, created_at) FROM stdin;
8	Finalizador 337	alimento	kg	40	0	0	500	t	2025-12-07 01:23:09.044215+00
9	Vacuna Circovirus + Mycoplasma	biologico	dosis	50	0	0	20	t	2025-12-07 01:57:30.571465+00
10	Baycox (Toltrazuril)	medicamento	ml	250	0	0	20	t	2025-12-07 01:57:30.571465+00
11	Complejo B / Vitaminas	medicamento	ml	500	0	0	50	t	2025-12-07 01:57:30.571465+00
12	Vacuna Eri-Parvo-Lepto	biologico	dosis	50	0	0	10	t	2025-12-07 01:57:30.571465+00
13	Purgante Oral (Fenbendazol)	medicamento	ml	1000	0	0	100	t	2025-12-07 01:57:30.571465+00
14	Hierro Dextrano	medicamento	ml	100	0	0	50	t	2025-12-07 01:57:30.571465+00
15	Vacuna E. Coli	biologico	dosis	25	0	0	10	t	2025-12-07 01:57:30.571465+00
1	Gestacion	alimento	kg	40	80	2075.0000000000000000	200	t	2025-12-07 01:23:09.044215+00
16	Reemplazo	alimento	kg	40	40	2125.0000000000000000	5	t	2025-12-14 02:36:17+00
6	Lechón Transición	alimento	kg	40	0	0	200	t	2025-12-07 01:23:09.044215+00
7	Lechón 337	alimento	kg	40	40	2325.0000000000000000	300	t	2025-12-07 01:23:09.044215+00
2	Lactancia	alimento	kg	40	10030	0	150	t	2025-12-07 01:23:09.044215+00
3	Pre-Inicio Fase 1	alimento	kg	40	10000	0	100	t	2025-12-07 01:23:09.044215+00
4	Pre-Inicio	alimento	kg	40	10000	0	100	t	2025-12-07 01:23:09.044215+00
5	Medicamento viejo	medicamento	ml	2000	1992	0.00000000000000000000	0	t	2025-12-07 01:23:09.044215+00
\.


--
-- Data for Name: compras_insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compras_insumos (id, fecha, insumo_id, proveedor, cantidad_comprada, cantidad_real_ingresada, precio_total_factura, precio_unitario_final, numero_factura, created_at) FROM stdin;
1	2025-12-13	2	Arley	2	80	182000	2275.0000000000000000	\N	2025-12-14 02:29:48.749598+00
2	2025-12-14	1	Arley	8	320	664000	2075.0000000000000000	\N	2025-12-14 02:31:19.351418+00
3	2025-12-14	7	Arley	4	160	372000	2325.0000000000000000	\N	2025-12-14 02:32:20.018371+00
4	2025-12-14	5	Arley	2	80	236000	2950.0000000000000000	\N	2025-12-14 02:33:10.356366+00
5	2025-12-14	4	Arley	1	40	140000	3500.0000000000000000	\N	2025-12-14 02:34:48.304331+00
6	2025-12-14	16	Arley	3	120	255000	2125.0000000000000000	\N	2025-12-14 02:36:54.876118+00
7	2025-12-15	5		1	2000	0	0.00000000000000000000	\N	2025-12-15 00:15:05.13401+00
\.


--
-- Data for Name: lotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lotes (id, codigo, fecha_inicio, fecha_cierre, ubicacion, cantidad_inicial, cantidad_actual, costo_inicial_lote, estado, created_at, peso_promedio_inicial, observaciones, peso_promedio_actual, corral_id, etapa) FROM stdin;
1	L-2025-86	2025-12-14	\N	precebo	10	10	0	activo	2025-12-14 02:49:40.94955+00	15	\N	0	3	engorde
\.


--
-- Data for Name: eventos_sanitarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos_sanitarios (id, fecha, tipo, lote_id, cerda_id, cantidad_afectada, observacion, created_at) FROM stdin;
5	2025-12-15	tratamiento	\N	7	1	Reemplazo: Circovirus + Mycoplasma (Dosis 1)	2025-12-15 00:16:54.408592+00
6	2025-12-15	tratamiento	\N	6	1	Reemplazo: Circovirus + Mycoplasma (Dosis 1)	2025-12-15 00:28:57.092453+00
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
1	2025-12-11	ingreso	18	10037200	Saldo Inicial de Caja (Dinero anterior)	efectivo	\N	\N	2025-12-11 05:31:23.838043+00
2	2025-12-13	egreso	4	182000	Compra lactancia 	efectivo	\N	\N	2025-12-14 02:29:48.503332+00
3	2025-12-14	egreso	4	664000	Gestación	efectivo	\N	\N	2025-12-14 02:31:19.073476+00
4	2025-12-14	egreso	4	372000	Lechon	efectivo	\N	\N	2025-12-14 02:32:19.883285+00
5	2025-12-14	egreso	4	236000	Inicio	efectivo	\N	\N	2025-12-14 02:33:10.221717+00
6	2025-12-14	egreso	4	140000	Pre inicio	efectivo	\N	\N	2025-12-14 02:34:48.164371+00
7	2025-12-14	egreso	4	255000	Compra	efectivo	\N	\N	2025-12-14 02:36:54.730729+00
8	2025-12-14	egreso	8	120000	Pago oficial	efectivo	\N	\N	2025-12-14 23:51:38.294988+00
9	2025-12-15	egreso	5	0	Medicamento prueba	efectivo	\N	\N	2025-12-15 00:15:04.983978+00
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
10	Purga General (Antes del parto)	105	servicio	madre	t	t
12	Aplicar Baycox (Anticoccidial)	5	parto	camada	t	t
13	Vacuna Mycoplasma + Circovirus	21	parto	camada	t	t
14	Purga y Vitaminas (Precebo)	35	parto	camada	t	t
8	Multípara: Vacuna E. Coli (Refuerzo)	90	servicio	madre	t	t
9	Multípara: Eri-Parvo-Lepto	7	parto	madre	t	t
11	Manejo: Descole, Castración + HIERRO	3	parto	camada	t	t
\.


--
-- Data for Name: salidas_insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salidas_insumos (id, fecha, insumo_id, cantidad, destino_tipo, lote_id, cerda_id, costo_unitario_momento, notas, created_at) FROM stdin;
2	2025-12-14	7	80	lote	1	\N	2325	\N	2025-12-14 02:52:55.802403+00
3	2025-12-14	5	60	lote	1	\N	2950	\N	2025-12-14 02:54:51.928235+00
4	2025-12-14	4	20	lote	1	\N	3500	\N	2025-12-14 02:55:14.558625+00
5	2025-12-14	4	20	lote	1	\N	3500	\N	2025-12-14 02:56:26.478182+00
7	2025-12-14	7	40	lote	1	\N	2325	\N	2025-12-14 02:59:42.086879+00
9	2025-12-14	5	20	lote	1	\N	2950	\N	2025-12-14 23:52:53.602615+00
8	2025-12-14	2	50	cerda	\N	\N	2275	Alimentación Grupal - Lactancia	2025-12-14 03:02:07.410556+00
6	2025-12-14	16	80	cerda	\N	\N	2125	Alimentación Grupal - Gestación	2025-12-14 02:58:46.3964+00
1	2025-12-14	1	240	cerda	\N	\N	2075	Alimentación Grupal - Gestación	2025-12-14 02:43:35.728318+00
16	2025-12-15	5	1	cerda	\N	6	0	Sanidad Cerda 6. Reemplazo: Circovirus + Mycoplasma (Dosis 1)	2025-12-15 00:35:30.357566+00
17	2025-12-15	5	1	cerda	\N	7	0	Sanidad Cerda 7. Reemplazo: Circovirus + Mycoplasma (Dosis 1)	2025-12-15 00:35:35.595284+00
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

SELECT pg_catalog.setval('public.ciclos_reproductivos_id_seq', 6, true);


--
-- Name: compras_insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compras_insumos_id_seq', 7, true);


--
-- Name: corrales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.corrales_id_seq', 10, true);


--
-- Name: eventos_sanitarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_sanitarios_id_seq', 8, true);


--
-- Name: insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insumos_id_seq', 5, true);


--
-- Name: lote_origen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lote_origen_id_seq', 1, false);


--
-- Name: lotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lotes_id_seq', 1, true);


--
-- Name: movimientos_caja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_caja_id_seq', 9, true);


--
-- Name: reglas_sanitarias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reglas_sanitarias_id_seq', 1, false);


--
-- Name: salidas_insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salidas_insumos_id_seq', 17, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 5LvD9VPYBJdcg6pnRuoUjZg8i6V0xktxPCUS2l3fGcPJTtz6m06qy4BgBcAoLCV

