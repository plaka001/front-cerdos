--
-- PostgreSQL database dump
--

\restrict abGNKu8c5xZJbzWCgLOYl302CoiNweQieHqc8XIaBgWzcbzJWVgD711cMU7htFn

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
8	Paridera 1	paridera	1	t	2025-12-14 23:59:40.658957+00
9	Paridera 2	paridera	1	t	2025-12-14 23:59:50.839279+00
1	Gestacion 1	gestacion	12	t	2025-12-14 03:25:19.553498+00
10	Paridera 3	paridera	1	t	2025-12-15 00:01:03.112561+00
7	Corral 5	precebo	18	t	2025-12-14 23:59:09.617016+00
11	Corra	engorde	20	t	2026-01-27 23:25:30.620505+00
\.


--
-- Data for Name: cerdas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cerdas (id, chapeta, fecha_nacimiento, raza, estado, partos_acumulados, activa, notas, created_at, corral_id) FROM stdin;
8	07	2025-06-15	F1	vacia	0	t	\N	2025-12-07 01:48:20.569372+00	1
6	Juana	2025-07-19	F1	vacia	0	t	\N	2025-12-07 01:41:21.818891+00	1
7	Sol	2025-07-19	F1	vacia	0	t	\N	2025-12-07 01:41:45.996026+00	1
5	La brava	2024-06-06	F1	gestante	0	t	\N	2025-12-07 01:34:20.480166+00	1
3	Roci	2024-06-06	F1	gestante	0	t	\N	2025-12-07 01:33:20.78016+00	1
4	La flaca	2024-06-06	F1	descarte	1	f	\N	2025-12-07 01:33:21.343612+00	1
1	La mona	2024-06-06	large white	gestante	1	t	\N	2025-12-07 01:31:00.681173+00	1
9	08	2025-06-15	F1	gestante	0	t	\N	2025-12-07 01:48:33.880781+00	1
2	La jardineña	2024-06-06	F1	lactante	1	t	\N	2025-12-07 01:31:02.308943+00	8
\.


--
-- Data for Name: ciclos_reproductivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciclos_reproductivos (id, cerda_id, fecha_inseminacion, padre_semen, costo_servicio, fecha_parto_probable, fecha_parto_real, nacidos_vivos, nacidos_muertos, momias, fecha_destete, lechones_destetados, peso_promedio_destete, estado, created_at, observaciones) FROM stdin;
3	5	2025-12-02	Semen	0	\N	\N	0	0	0	\N	0	\N	abierto	2025-12-11 05:35:17.306189+00	Inseminacion
4	3	2025-11-18	Duroc	0	\N	\N	0	0	0	\N	0	\N	abierto	2025-12-14 01:56:51.642067+00	\N
2	4	2025-12-03	Semen 	0	\N	2025-12-14	10	0	0	2025-12-14	10	15	cerrado	2025-12-11 05:34:34.489341+00	\N
6	4	2025-12-03	semen	0	\N	\N	0	0	0	\N	0	\N	abierto	2025-12-14 02:51:57.386614+00	\N
1	1	2025-08-21	Semen 	0	\N	2025-12-11	15	0	0	2026-01-02	15	8	cerrado	2025-12-11 05:32:20.531263+00	Precebo 15
7	1	2026-01-09	Semen 	120000	\N	\N	0	0	0	\N	0	\N	abierto	2026-01-10 13:34:30.492173+00	Semen 
8	9	2026-01-14	pic 410	120000	\N	\N	0	0	0	\N	0	\N	abierto	2026-01-15 23:04:31.725834+00	inseminacion 
5	2	2025-09-29	410	0	\N	2026-01-21	16	2	0	\N	0	\N	abierto	2025-12-14 02:05:13.074701+00	Parto 18 animales
\.


--
-- Data for Name: insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insumos (id, nombre, tipo, unidad_medida, presentacion_compra, stock_actual, costo_promedio, stock_minimo, activo, created_at) FROM stdin;
10	Baycox (Toltrazuril)	medicamento	ml	250	0	0	20	t	2025-12-07 01:57:30.571465+00
11	Complejo B / Vitaminas	medicamento	ml	500	0	0	50	t	2025-12-07 01:57:30.571465+00
12	Vacuna Eri-Parvo-Lepto	biologico	dosis	50	0	0	10	t	2025-12-07 01:57:30.571465+00
13	Purgante Oral (Fenbendazol)	medicamento	ml	1000	0	0	100	t	2025-12-07 01:57:30.571465+00
14	Hierro Dextrano	medicamento	ml	100	0	0	50	t	2025-12-07 01:57:30.571465+00
15	Vacuna E. Coli	biologico	dosis	25	0	0	10	t	2025-12-07 01:57:30.571465+00
3	Pre-Inicio Fase 1	alimento	kg	40	0	2050.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
5	Medicamento viejo	medicamento	ml	2000	1981	0.00000000000000000000	0	t	2025-12-07 01:23:09.044215+00
7	Transicion	alimento	kg	40	0	2425.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
4	Pre-Inicio	alimento	kg	40	0	3250.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
1	Gestacion	alimento	kg	40	40	2075.0000000000000000	200	t	2025-12-07 01:23:09.044215+00
9	Finalizador	alimento	kg	40	80	2250.0000000000000000	100	t	2025-12-07 01:57:30.571465+00
2	Lactancia	alimento	kg	40	80	2275.0000000000000000	150	t	2025-12-07 01:23:09.044215+00
16	Reemplazo	alimento	kg	40	40	2075.0000000000000000	5	t	2025-12-14 02:36:17+00
6	Iniciación 	alimento	kg	40	80	2925.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
8	lechon 337	alimento	kg	40	80	2325.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
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
8	2025-12-19	7	Arley 	1	40	92000	2300.0000000000000000	\N	2025-12-27 17:41:00.462447+00
9	2025-12-19	1	\N	3	120	249000	2075.0000000000000000	\N	2025-12-27 17:41:54.777086+00
10	2025-12-19	2	Arley 	1	40	90000	2250.0000000000000000	\N	2025-12-27 17:42:21.377656+00
11	2025-12-19	6	Arley 	1	40	118000	2950.0000000000000000	\N	2025-12-27 17:44:39.977428+00
12	2025-12-24	8	Arley 	1	40	92000	2300.0000000000000000	\N	2025-12-27 17:45:55.400647+00
13	2025-12-27	16	Arley 	2	80	170000	2125.0000000000000000	\N	2025-12-27 17:48:35.410354+00
14	2025-12-27	8	\N	2	80	184000	2300.0000000000000000	\N	2025-12-27 17:49:13.041414+00
15	2025-12-27	2	Arley 	1	40	83000	2075.0000000000000000	\N	2025-12-27 17:49:52.730986+00
16	2025-12-27	3	Arley 	1	40	82000	2050.0000000000000000	\N	2025-12-27 17:51:59.151479+00
17	2026-01-07	7	Arley	1	40	90000	2250.0000000000000000	\N	2026-01-07 01:59:41.325775+00
18	2026-01-07	8	Arley	2	80	180000	2250.0000000000000000	\N	2026-01-07 02:01:11.58443+00
19	2026-01-07	1	Arley	2	80	166000	2075.0000000000000000	\N	2026-01-07 02:02:16.225733+00
20	2026-01-07	16	Arley	2	80	170000	2125.0000000000000000	\N	2026-01-07 02:03:23.770313+00
21	2026-01-15	8	Arley	1	40	90000	2250.0000000000000000	\N	2026-01-15 23:18:32.19151+00
22	2026-01-15	7	arley	1	40	97000	2425.0000000000000000	\N	2026-01-15 23:19:06.968578+00
23	2026-01-15	1	Arley	2	80	164000	2050.0000000000000000	\N	2026-01-15 23:19:39.104523+00
24	2026-01-15	16	arley	1	40	85000	2125.0000000000000000	\N	2026-01-15 23:20:01.815398+00
25	2026-01-15	4	Arley	1	40	130000	3250.0000000000000000	\N	2026-01-15 23:21:37.615465+00
26	2026-01-15	9	Arley	1	40	90000	2250.0000000000000000	\N	2026-01-15 23:35:56.54132+00
27	2026-01-27	2	Arley	1	40	91000	2275.0000000000000000	\N	2026-01-27 23:36:52.019755+00
28	2026-01-27	1	Arley	1	40	83000	2075.0000000000000000	\N	2026-01-27 23:37:17.243789+00
29	2026-01-27	9	arley	1	40	90000	2250.0000000000000000	\N	2026-01-27 23:37:43.834462+00
30	2026-01-27	6	Arley	1	40	117000	2925.0000000000000000	\N	2026-01-27 23:38:01.700228+00
31	2026-01-27	8	Arley	1	40	93000	2325.0000000000000000	\N	2026-01-27 23:38:30.986437+00
32	2026-01-27	9	Arley	1	40	90000	2250.0000000000000000	\N	2026-01-27 23:38:56.884164+00
33	2026-01-27	2	Arley	1	40	91000	2275.0000000000000000	\N	2026-01-27 23:40:00.057711+00
34	2026-01-27	16	Arley	1	40	83000	2075.0000000000000000	\N	2026-01-27 23:40:31.651269+00
35	2026-01-27	6	arley	1	40	117000	2925.0000000000000000	\N	2026-01-27 23:41:03.640482+00
36	2026-01-27	8	Arley	1	40	93000	2325.0000000000000000	\N	2026-01-27 23:41:22.880241+00
\.


--
-- Data for Name: lotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lotes (id, codigo, fecha_inicio, fecha_cierre, ubicacion, cantidad_inicial, cantidad_actual, costo_inicial_lote, estado, created_at, peso_promedio_inicial, observaciones, peso_promedio_actual, corral_id, etapa) FROM stdin;
2	L-2026-177	2026-01-02	\N	Corral de Precebo	15	15	0	activo	2026-01-07 01:45:53.935409+00	8	\N	15	11	engorde
1	L-2025-86	2025-12-14	\N	precebo	10	6	0	activo	2025-12-14 02:49:40.94955+00	15	\N	0	3	engorde
\.


--
-- Data for Name: eventos_sanitarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos_sanitarios (id, fecha, tipo, lote_id, cerda_id, cantidad_afectada, observacion, created_at) FROM stdin;
5	2025-12-15	tratamiento	\N	7	1	Reemplazo: Circovirus + Mycoplasma (Dosis 1)	2025-12-15 00:16:54.408592+00
6	2025-12-15	tratamiento	\N	6	1	Reemplazo: Circovirus + Mycoplasma (Dosis 1)	2025-12-15 00:28:57.092453+00
9	2025-12-23	muerte	1	\N	1	Muerte enfermedad 	2025-12-26 21:30:17.388205+00
10	2026-01-07	tratamiento	\N	6	1	Reemplazo: Circovirus + Mycoplasma (Dosis 2)	2026-01-07 01:36:38.098283+00
11	2026-01-07	tratamiento	\N	7	1	Reemplazo: Circovirus + Mycoplasma (Dosis 2)	2026-01-07 01:36:43.478323+00
12	2026-01-07	tratamiento	\N	1	1	Vacuna Mycoplasma + Circovirus	2026-01-07 01:36:50.147411+00
13	2026-01-07	tratamiento	\N	2	1	Primeriza: Vacuna E. Coli (Dosis 2)	2026-01-07 01:37:02.753848+00
14	2026-01-07	tratamiento	\N	4	1	Vacuna Mycoplasma + Circovirus	2026-01-07 01:37:13.401726+00
15	2026-01-02	enfermedad	1	\N	1	Enfermedad 	2026-01-07 02:14:03.184967+00
16	2026-01-10	tratamiento	\N	9	1	Reemplazo: Eri-Parvo-Lepto (Dosis 2)	2026-01-10 13:40:40.713885+00
17	2026-01-10	tratamiento	\N	8	1	Reemplazo: Eri-Parvo-Lepto (Dosis 2)	2026-01-10 13:40:47.582826+00
18	2026-01-15	tratamiento	\N	2	1	Purga General (Antes del parto)	2026-01-15 23:42:44.318067+00
19	2026-01-15	tratamiento	\N	1	1	Purga y Vitaminas (Precebo)	2026-01-15 23:43:52.980074+00
20	2026-01-27	tratamiento	\N	2	1	Manejo: Descole, Castración + HIERRO	2026-01-27 23:19:28.318162+00
21	2026-01-27	tratamiento	\N	2	1	Aplicar Baycox (Anticoccidial)	2026-01-27 23:20:55.452657+00
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
10	2025-12-19	egreso	4	92000	Compra alimento 	efectivo	\N	\N	2025-12-27 17:41:00.14457+00
11	2025-12-19	egreso	4	249000	Gestación 	efectivo	\N	\N	2025-12-27 17:41:54.536776+00
12	2025-12-19	egreso	4	90000	Lactancia 	efectivo	\N	\N	2025-12-27 17:42:21.169071+00
13	2025-12-19	egreso	4	118000	Iniciación 	efectivo	\N	\N	2025-12-27 17:44:39.721582+00
14	2025-12-24	egreso	4	92000	Finalizador 	efectivo	\N	\N	2025-12-27 17:45:55.164869+00
15	2025-12-27	egreso	4	170000	Reemplazo 	efectivo	\N	\N	2025-12-27 17:48:34.802098+00
16	2025-12-27	egreso	4	184000	Finalizador 	efectivo	\N	\N	2025-12-27 17:49:12.476817+00
17	2025-12-27	egreso	4	83000	Lactancia 	efectivo	\N	\N	2025-12-27 17:49:52.538064+00
18	2025-12-27	egreso	4	82000	Medio bulto de pre inicio 	efectivo	\N	\N	2025-12-27 17:51:58.800188+00
19	2025-12-28	egreso	7	740400	Compra materiales corral 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766952200123_129.jpg	2025-12-28 20:03:24.041278+00
20	2025-12-28	egreso	7	53900	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766952761343_273.jpg	2025-12-28 20:12:44.679117+00
21	2025-12-28	egreso	7	33600	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955103244_837.jpg	2025-12-28 20:51:44.660381+00
22	2025-12-28	egreso	7	12800	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955165546_426.jpg	2025-12-28 20:52:47.738994+00
23	2025-12-28	egreso	7	5200	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955256506_389.jpg	2025-12-28 20:54:18.133742+00
24	2025-12-28	egreso	7	12900	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955289702_518.jpg	2025-12-28 20:54:51.344719+00
25	2025-12-28	egreso	7	37600	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955341991_234.jpg	2025-12-28 20:55:43.110228+00
26	2025-12-29	egreso	8	260000	Pago oficial 	efectivo	\N	\N	2025-12-29 00:34:41.498088+00
27	2025-12-31	ingreso	2	550000	Venta Descarte - Cerda ID 4 - Chorizos	efectivo	\N	\N	2026-01-07 01:48:18.090152+00
28	2025-12-31	egreso	7	2000000	Compra jaulas gestación 	efectivo	\N	\N	2026-01-07 01:49:08.09176+00
29	2026-01-07	egreso	4	90000	Compra transición 	efectivo	\N	\N	2026-01-07 01:59:41.164565+00
30	2026-01-07	egreso	4	180000	Compra finalizador	efectivo	\N	\N	2026-01-07 02:01:11.295653+00
31	2026-01-07	egreso	4	166000	Compra gestacion	efectivo	\N	\N	2026-01-07 02:02:16.025904+00
32	2026-01-07	egreso	4	170000	Compra reemplazo cuido	efectivo	\N	\N	2026-01-07 02:03:23.598711+00
33	2026-01-09	egreso	6	120000	Inseminación Cerda La mona - Semen 	efectivo	\N	\N	2026-01-10 13:34:31.251732+00
34	2026-01-10	egreso	5	30000	Inyecciones parvo 0708	efectivo	\N	\N	2026-01-10 13:41:53.881961+00
35	2026-01-14	egreso	6	120000	Inseminación Cerda 08 - pic 410	efectivo	\N	\N	2026-01-15 23:04:32.455205+00
36	2026-01-15	egreso	8	40000	Inseminación cerdas 08 y la mona	efectivo	\N	\N	2026-01-15 23:04:59.738707+00
37	2026-01-15	egreso	8	130000	Pago oficial: reforzo parideras, revoco corrales 	efectivo	\N	\N	2026-01-15 23:06:58.050454+00
38	2026-01-15	egreso	7	167500	Reforzada parideras 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1768518528785_434.png	2026-01-15 23:08:49.128525+00
39	2026-01-15	egreso	4	90000	Compra lechon 337 	efectivo	\N	\N	2026-01-15 23:18:31.804556+00
40	2026-01-15	egreso	4	97000	compra transición 	efectivo	\N	\N	2026-01-15 23:19:06.816734+00
41	2026-01-15	egreso	4	164000	Compra gestacion	efectivo	\N	\N	2026-01-15 23:19:38.956262+00
42	2026-01-15	egreso	4	85000	compra reemplazo 	efectivo	\N	\N	2026-01-15 23:20:01.644767+00
43	2026-01-15	egreso	4	130000	compra preinicio	efectivo	\N	\N	2026-01-15 23:21:37.460724+00
44	2026-01-15	egreso	18	1959500	Ajuste saldo en cartera 	efectivo	\N	\N	2026-01-15 23:32:48.592356+00
45	2026-01-15	egreso	4	90000	Compra finalizador	efectivo	\N	\N	2026-01-15 23:35:56.396324+00
46	2026-01-27	egreso	4	91000	compra lactancia	efectivo	\N	\N	2026-01-27 23:36:51.815852+00
47	2026-01-27	egreso	4	83000	compra 1 bulto de gestacion	efectivo	\N	\N	2026-01-27 23:37:17.078502+00
48	2026-01-27	egreso	4	90000	Compra un bulto finalizador	efectivo	\N	\N	2026-01-27 23:37:43.683622+00
49	2026-01-27	egreso	4	117000	compra bulto iniciacion	efectivo	\N	\N	2026-01-27 23:38:01.565126+00
50	2026-01-27	egreso	4	93000	Compra bulto lechon 	efectivo	\N	\N	2026-01-27 23:38:30.828087+00
51	2026-01-27	egreso	4	90000	Compra bulto finalizador	efectivo	\N	\N	2026-01-27 23:38:56.748384+00
52	2026-01-27	egreso	4	91000	compra bulto lactancia	efectivo	\N	\N	2026-01-27 23:39:59.871638+00
53	2026-01-27	egreso	4	83000	compra bulto reemplazo	efectivo	\N	\N	2026-01-27 23:40:31.497639+00
54	2026-01-27	egreso	4	117000	compra bulto iniciación 	efectivo	\N	\N	2026-01-27 23:41:03.493765+00
55	2026-01-27	egreso	4	93000	compra bulto lechon	efectivo	\N	\N	2026-01-27 23:41:22.734445+00
56	2026-02-04	ingreso	1	1624000	Venta Lote L-2025-86 - Yeison	efectivo	1	\N	2026-02-04 14:29:28.762195+00
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
18	2025-12-27	6	20	lote	1	\N	2950	\N	2025-12-27 17:54:21.652704+00
19	2025-12-27	7	80	lote	1	\N	2312.5	\N	2025-12-27 17:55:09.876248+00
20	2025-12-27	2	60	cerda	\N	\N	1572.7272727272727	Alimentación Grupal - Lactancia	2025-12-27 17:56:05.914949+00
21	2025-12-27	8	40	lote	1	\N	2300	\N	2025-12-27 17:57:11.917982+00
22	2025-12-27	16	40	cerda	\N	\N	2125	Alimentación Grupal - Gestación	2025-12-27 17:58:27.134888+00
23	2025-12-27	1	180	cerda	\N	\N	2075	Alimentación Grupal - Gestación	2025-12-27 18:00:49.007223+00
24	2026-01-07	5	1	cerda	\N	6	0	Sanidad Cerda 6. Reemplazo: Circovirus + Mycoplasma (Dosis 2)	2026-01-07 01:36:37.895963+00
25	2026-01-07	5	1	cerda	\N	7	0	Sanidad Cerda 7. Reemplazo: Circovirus + Mycoplasma (Dosis 2)	2026-01-07 01:36:43.358899+00
26	2026-01-07	5	1	cerda	\N	1	0	Sanidad Cerda 1. Vacuna Mycoplasma + Circovirus	2026-01-07 01:36:50.015561+00
27	2026-01-07	5	1	cerda	\N	2	0	Sanidad Cerda 2. Primeriza: Vacuna E. Coli (Dosis 2)	2026-01-07 01:37:02.601565+00
28	2026-01-07	5	1	cerda	\N	4	0	Sanidad Cerda 4. Vacuna Mycoplasma + Circovirus	2026-01-07 01:37:13.26441+00
29	2026-01-01	1	20	cerda	\N	\N	2075	Alimentación Grupal - Gestación	2026-01-07 01:52:05.607837+00
30	2026-01-07	3	30	lote	2	\N	2050	\N	2026-01-07 01:54:08.1019+00
31	2026-01-02	2	40	cerda	\N	\N	1572.7272727272727	Alimentación Grupal - Lactancia	2026-01-07 01:55:37.39819+00
32	2026-01-01	8	80	lote	1	\N	2300	\N	2026-01-07 01:56:56.865074+00
33	2026-01-01	16	80	cerda	\N	\N	2125	Alimentación Grupal - Gestación	2026-01-07 01:57:36.126966+00
34	2026-01-07	6	20	lote	2	\N	2950	\N	2026-01-07 02:04:12.301938+00
35	2026-01-10	5	1	cerda	\N	9	0	Sanidad Cerda 9. Reemplazo: Eri-Parvo-Lepto (Dosis 2)	2026-01-10 13:40:40.516806+00
36	2026-01-10	5	1	cerda	\N	8	0	Sanidad Cerda 8. Reemplazo: Eri-Parvo-Lepto (Dosis 2)	2026-01-10 13:40:47.457159+00
37	2026-01-15	2	10	cerda	\N	\N	1572.7272727272727	Alimentación Grupal - Lactancia	2026-01-15 23:13:20.787141+00
38	2026-01-15	3	10	lote	2	\N	2050	\N	2026-01-15 23:13:51.392116+00
39	2026-01-15	7	40	lote	1	\N	2250	\N	2026-01-15 23:14:15.252149+00
40	2026-01-15	8	80	lote	1	\N	2250	\N	2026-01-15 23:14:31.446897+00
41	2026-01-15	1	80	cerda	\N	\N	2075	Alimentación Grupal - Gestación	2026-01-15 23:14:46.844574+00
42	2026-01-15	16	80	cerda	\N	\N	2125	Alimentación Grupal - Lactancia	2026-01-15 23:15:02.35463+00
43	2026-01-15	5	1	cerda	\N	2	0	Sanidad Cerda 2. Purga General (Antes del parto)	2026-01-15 23:42:44.135147+00
44	2026-01-15	5	1	cerda	\N	1	0	Sanidad Cerda 1. Purga y Vitaminas (Precebo)	2026-01-15 23:43:52.780854+00
45	2026-01-27	5	1	cerda	\N	2	0	Sanidad Cerda 2. Manejo: Descole, Castración + HIERRO	2026-01-27 23:19:28.131481+00
46	2026-01-27	5	1	cerda	\N	2	0	Sanidad Cerda 2. Aplicar Baycox (Anticoccidial)	2026-01-27 23:20:55.305228+00
47	2026-01-27	16	40	cerda	\N	\N	2125	Alimentación Grupal - Gestación	2026-01-27 23:32:50.880617+00
48	2026-01-27	7	40	lote	1	\N	2425	\N	2026-01-27 23:33:31.234438+00
49	2026-01-27	4	40	lote	2	\N	3250	\N	2026-01-27 23:33:59.907192+00
50	2026-01-27	9	40	lote	1	\N	2250	\N	2026-01-27 23:34:18.724075+00
51	2026-01-27	8	40	lote	1	\N	2250	\N	2026-01-27 23:34:40.546271+00
52	2026-01-27	1	80	cerda	\N	\N	2050	Alimentación Grupal - Gestación	2026-01-27 23:35:01.248984+00
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

SELECT pg_catalog.setval('public.ciclos_reproductivos_id_seq', 8, true);


--
-- Name: compras_insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compras_insumos_id_seq', 36, true);


--
-- Name: corrales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.corrales_id_seq', 11, true);


--
-- Name: eventos_sanitarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_sanitarios_id_seq', 21, true);


--
-- Name: insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insumos_id_seq', 9, true);


--
-- Name: lote_origen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lote_origen_id_seq', 1, false);


--
-- Name: lotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lotes_id_seq', 2, true);


--
-- Name: movimientos_caja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_caja_id_seq', 56, true);


--
-- Name: reglas_sanitarias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reglas_sanitarias_id_seq', 1, false);


--
-- Name: salidas_insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salidas_insumos_id_seq', 52, true);


--
-- PostgreSQL database dump complete
--

\unrestrict abGNKu8c5xZJbzWCgLOYl302CoiNweQieHqc8XIaBgWzcbzJWVgD711cMU7htFn

