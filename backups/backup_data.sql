--
-- PostgreSQL database dump
--

\restrict g4Kh5EIKoaejDIJAiCsuiwFkkpvswudXjoWQ3zW3gj5awVRcwpsO5NCskR2WkIj

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10 (Ubuntu 17.10-1.pgdg24.04+1)

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
19	Prestamos	administrativo	Prestamos	2026-03-19 00:36:03.807911+00	f
20	Abono Deuda Proveedor	operativo	Pagos parciales a deudas de cuido/insumos con proveedores	2026-06-11 02:17:21.056804+00	t
21	Transferencia entre Cajas	administrativo	Movimiento interno de plata entre cuentas propias (no es gasto ni ingreso real)	2026-06-11 02:17:21.056804+00	t
22	Ajuste de Caja	administrativo	Ajustes contables por descuadres de caja (no es gasto operativo)	2026-06-11 05:42:21.902011+00	t
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
11	Corra	engorde	20	t	2026-01-27 23:25:30.620505+00
7	Corral 5	precebo	70	t	2025-12-14 23:59:09.617016+00
\.


--
-- Data for Name: cerdas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cerdas (id, chapeta, fecha_nacimiento, raza, estado, partos_acumulados, activa, notas, created_at, corral_id) FROM stdin;
7	Sol	2025-07-19	F1	gestante	0	t	\N	2025-12-07 01:41:45.996026+00	1
2	La jardineña	2024-06-06	F1	gestante	1	t	\N	2025-12-07 01:31:02.308943+00	1
5	La brava	2024-06-06	F1	gestante	1	t	\N	2025-12-07 01:34:20.480166+00	1
8	07	2025-06-15	F1	lactante	1	t	\N	2025-12-07 01:48:20.569372+00	8
9	08	2025-06-15	F1	gestante	1	t	\N	2025-12-07 01:48:33.880781+00	1
1	La mona	2024-06-06	large white	vacia	2	t	\N	2025-12-07 01:31:00.681173+00	1
4	La flaca	2024-06-06	F1	descarte	1	f	\N	2025-12-07 01:33:21.343612+00	1
6	Juana	2025-07-19	F1	gestante	0	t	\N	2025-12-07 01:41:21.818891+00	1
3	Roci	2024-06-06	F1	gestante	1	t	\N	2025-12-07 01:33:20.78016+00	1
\.


--
-- Data for Name: ciclos_reproductivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ciclos_reproductivos (id, cerda_id, fecha_inseminacion, padre_semen, costo_servicio, fecha_parto_probable, fecha_parto_real, nacidos_vivos, nacidos_muertos, momias, fecha_destete, lechones_destetados, peso_promedio_destete, estado, created_at, observaciones) FROM stdin;
2	4	2025-12-03	Semen 	0	\N	2025-12-14	10	0	0	2025-12-14	10	15	cerrado	2025-12-11 05:34:34.489341+00	\N
6	4	2025-12-03	semen	0	\N	\N	0	0	0	\N	0	\N	abierto	2025-12-14 02:51:57.386614+00	\N
1	1	2025-08-21	Semen 	0	\N	2025-12-11	15	0	0	2026-01-02	15	8	cerrado	2025-12-11 05:32:20.531263+00	Precebo 15
5	2	2025-09-29	410	0	\N	2026-01-21	16	2	0	2026-02-18	16	8	cerrado	2025-12-14 02:05:13.074701+00	\N
11	6	2026-03-03	410	100000	\N	\N	0	0	0	\N	0	\N	abierto	2026-03-03 17:59:47.503181+00	\N
4	3	2025-11-18	Duroc	0	\N	2026-03-11	15	3	0	2026-04-03	15	8	cerrado	2025-12-14 01:56:51.642067+00	\N
12	3	2026-04-09	semen duroc	100000	\N	\N	0	0	0	\N	0	\N	abierto	2026-04-08 22:15:59.170645+00	\N
10	2	2026-02-17	Semen	240000	\N	\N	0	0	0	\N	0	\N	fallido	2026-02-18 00:09:22.6012+00	FALLA: sin celo
3	5	2025-12-02	Semen	0	\N	2026-03-25	13	0	0	2026-04-14	13	8	cerrado	2025-12-11 05:35:17.306189+00	Destete brava
13	7	2026-04-16	Semen	100000	\N	\N	0	0	0	\N	0	\N	abierto	2026-04-19 00:40:22.978371+00	\N
14	2	2026-04-26	Guror	100000	\N	\N	0	0	0	\N	0	\N	abierto	2026-04-30 20:13:24.313707+00	Nada
15	5	2026-04-23	410	100000	\N	\N	0	0	0	\N	0	\N	abierto	2026-04-30 20:14:39.845683+00	No
9	8	2026-02-05	Pig 410	0	\N	2026-05-28	14	0	0	\N	0	\N	abierto	2026-02-16 15:02:54.399679+00	11 am 
8	9	2026-01-14	pic 410	120000	\N	2026-05-06	15	0	0	2026-06-10	15	8	cerrado	2026-01-15 23:04:31.725834+00	Precebo
16	9	2026-06-01	Semen 	100000	\N	\N	0	0	0	\N	0	\N	abierto	2026-06-10 23:47:13.182856+00	\N
7	1	2026-01-09	Semen 	120000	\N	2026-05-02	12	0	0	2026-05-19	12	8	cerrado	2026-01-10 13:34:30.492173+00	dESTETE
\.


--
-- Data for Name: insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insumos (id, nombre, tipo, unidad_medida, presentacion_compra, stock_actual, costo_promedio, stock_minimo, activo, created_at) FROM stdin;
11	Complejo B / Vitaminas	medicamento	ml	500	0	0	50	t	2025-12-07 01:57:30.571465+00
12	Vacuna Eri-Parvo-Lepto	biologico	dosis	50	0	0	10	t	2025-12-07 01:57:30.571465+00
13	Purgante Oral (Fenbendazol)	medicamento	ml	1000	0	0	100	t	2025-12-07 01:57:30.571465+00
14	Hierro Dextrano	medicamento	ml	100	0	0	50	t	2025-12-07 01:57:30.571465+00
15	Vacuna E. Coli	biologico	dosis	25	0	0	10	t	2025-12-07 01:57:30.571465+00
10	Fostera 	medicamento	dosis	1	0	10000.0000000000000000	0	t	2025-12-07 01:57:30.571465+00
3	Pre-Inicio Fase 1	alimento	kg	40	0	4175.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
5	Medicamento viejo	medicamento	ml	2000	1981	0.00000000000000000000	0	t	2025-12-07 01:23:09.044215+00
7	Transicion	alimento	kg	40	0	2425.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
8	lechon 337	alimento	kg	40	0	2300.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
4	Pre-Inicio	alimento	kg	40	40	3650.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
16	Reemplazo	alimento	kg	40	0	2075.0000000000000000	5	t	2025-12-14 02:36:17+00
2	Lactancia	alimento	kg	40	40	2250.0000000000000000	150	t	2025-12-07 01:23:09.044215+00
6	Iniciación 	alimento	kg	40	40	2900.0000000000000000	100	t	2025-12-07 01:23:09.044215+00
9	Finalizador	alimento	kg	40	640	2225.0000000000000000	100	t	2025-12-07 01:57:30.571465+00
1	Gestacion	alimento	kg	40	120	2050	200	t	2025-12-07 01:23:09.044215+00
\.


--
-- Data for Name: proveedores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proveedores (id, nombre, telefono, activo, created_at) FROM stdin;
1	Arley	\N	t	2026-06-11 02:17:21.056804+00
\.


--
-- Data for Name: compras_insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compras_insumos (id, fecha, insumo_id, proveedor, cantidad_comprada, cantidad_real_ingresada, precio_total_factura, precio_unitario_final, numero_factura, created_at, forma_pago, proveedor_id) FROM stdin;
1	2025-12-13	2	Arley	2	80	182000	2275.0000000000000000	\N	2025-12-14 02:29:48.749598+00	contado	\N
2	2025-12-14	1	Arley	8	320	664000	2075.0000000000000000	\N	2025-12-14 02:31:19.351418+00	contado	\N
3	2025-12-14	7	Arley	4	160	372000	2325.0000000000000000	\N	2025-12-14 02:32:20.018371+00	contado	\N
4	2025-12-14	5	Arley	2	80	236000	2950.0000000000000000	\N	2025-12-14 02:33:10.356366+00	contado	\N
5	2025-12-14	4	Arley	1	40	140000	3500.0000000000000000	\N	2025-12-14 02:34:48.304331+00	contado	\N
6	2025-12-14	16	Arley	3	120	255000	2125.0000000000000000	\N	2025-12-14 02:36:54.876118+00	contado	\N
7	2025-12-15	5		1	2000	0	0.00000000000000000000	\N	2025-12-15 00:15:05.13401+00	contado	\N
8	2025-12-19	7	Arley 	1	40	92000	2300.0000000000000000	\N	2025-12-27 17:41:00.462447+00	contado	\N
9	2025-12-19	1	\N	3	120	249000	2075.0000000000000000	\N	2025-12-27 17:41:54.777086+00	contado	\N
10	2025-12-19	2	Arley 	1	40	90000	2250.0000000000000000	\N	2025-12-27 17:42:21.377656+00	contado	\N
11	2025-12-19	6	Arley 	1	40	118000	2950.0000000000000000	\N	2025-12-27 17:44:39.977428+00	contado	\N
12	2025-12-24	8	Arley 	1	40	92000	2300.0000000000000000	\N	2025-12-27 17:45:55.400647+00	contado	\N
13	2025-12-27	16	Arley 	2	80	170000	2125.0000000000000000	\N	2025-12-27 17:48:35.410354+00	contado	\N
14	2025-12-27	8	\N	2	80	184000	2300.0000000000000000	\N	2025-12-27 17:49:13.041414+00	contado	\N
15	2025-12-27	2	Arley 	1	40	83000	2075.0000000000000000	\N	2025-12-27 17:49:52.730986+00	contado	\N
16	2025-12-27	3	Arley 	1	40	82000	2050.0000000000000000	\N	2025-12-27 17:51:59.151479+00	contado	\N
17	2026-01-07	7	Arley	1	40	90000	2250.0000000000000000	\N	2026-01-07 01:59:41.325775+00	contado	\N
18	2026-01-07	8	Arley	2	80	180000	2250.0000000000000000	\N	2026-01-07 02:01:11.58443+00	contado	\N
19	2026-01-07	1	Arley	2	80	166000	2075.0000000000000000	\N	2026-01-07 02:02:16.225733+00	contado	\N
20	2026-01-07	16	Arley	2	80	170000	2125.0000000000000000	\N	2026-01-07 02:03:23.770313+00	contado	\N
21	2026-01-15	8	Arley	1	40	90000	2250.0000000000000000	\N	2026-01-15 23:18:32.19151+00	contado	\N
22	2026-01-15	7	arley	1	40	97000	2425.0000000000000000	\N	2026-01-15 23:19:06.968578+00	contado	\N
23	2026-01-15	1	Arley	2	80	164000	2050.0000000000000000	\N	2026-01-15 23:19:39.104523+00	contado	\N
24	2026-01-15	16	arley	1	40	85000	2125.0000000000000000	\N	2026-01-15 23:20:01.815398+00	contado	\N
25	2026-01-15	4	Arley	1	40	130000	3250.0000000000000000	\N	2026-01-15 23:21:37.615465+00	contado	\N
26	2026-01-15	9	Arley	1	40	90000	2250.0000000000000000	\N	2026-01-15 23:35:56.54132+00	contado	\N
27	2026-01-27	2	Arley	1	40	91000	2275.0000000000000000	\N	2026-01-27 23:36:52.019755+00	contado	\N
28	2026-01-27	1	Arley	1	40	83000	2075.0000000000000000	\N	2026-01-27 23:37:17.243789+00	contado	\N
29	2026-01-27	9	arley	1	40	90000	2250.0000000000000000	\N	2026-01-27 23:37:43.834462+00	contado	\N
30	2026-01-27	6	Arley	1	40	117000	2925.0000000000000000	\N	2026-01-27 23:38:01.700228+00	contado	\N
31	2026-01-27	8	Arley	1	40	93000	2325.0000000000000000	\N	2026-01-27 23:38:30.986437+00	contado	\N
32	2026-01-27	9	Arley	1	40	90000	2250.0000000000000000	\N	2026-01-27 23:38:56.884164+00	contado	\N
33	2026-01-27	2	Arley	1	40	91000	2275.0000000000000000	\N	2026-01-27 23:40:00.057711+00	contado	\N
34	2026-01-27	16	Arley	1	40	83000	2075.0000000000000000	\N	2026-01-27 23:40:31.651269+00	contado	\N
35	2026-01-27	6	arley	1	40	117000	2925.0000000000000000	\N	2026-01-27 23:41:03.640482+00	contado	\N
36	2026-01-27	8	Arley	1	40	93000	2325.0000000000000000	\N	2026-01-27 23:41:22.880241+00	contado	\N
37	2026-02-18	10	Granja	15	15	150000	10000.0000000000000000	\N	2026-02-18 00:16:04.878076+00	contado	\N
38	2026-02-24	1	Arley	1	40	83000	2075.0000000000000000	\N	2026-02-24 23:27:36.158076+00	contado	\N
39	2026-02-24	8	Arley	1	40	93000	2325.0000000000000000	\N	2026-02-24 23:28:40.836652+00	contado	\N
40	2026-02-24	6	Arley	1	40	117000	2925.0000000000000000	\N	2026-02-24 23:29:14.059541+00	contado	\N
41	2026-02-24	1	Arley	1	40	83000	2075.0000000000000000	\N	2026-02-24 23:29:41.704796+00	contado	\N
42	2026-02-24	7	Arley	1	40	98000	2450.0000000000000000	\N	2026-02-24 23:30:13.646583+00	contado	\N
43	2026-02-24	8	Arley	1	40	93000	2325.0000000000000000	\N	2026-02-24 23:30:40.36152+00	contado	\N
44	2026-02-24	1	Arley	8	320	664000	2075.0000000000000000	\N	2026-02-24 23:31:24.902802+00	contado	\N
45	2026-02-24	7	Arley	6	240	588000	2450.0000000000000000	\N	2026-02-24 23:31:59.178408+00	contado	\N
46	2026-02-24	8	Arley	3	120	279000	2325.0000000000000000	\N	2026-02-24 23:32:36.802922+00	contado	\N
47	2026-02-24	9	Arley	3	120	270000	2250.0000000000000000	\N	2026-02-24 23:33:13.824048+00	contado	\N
48	2026-02-24	3	Arley	1	40	83000	2075.0000000000000000	\N	2026-02-24 23:33:46.234038+00	contado	\N
49	2026-02-24	4	Arley	1	40	148000	3700.0000000000000000	\N	2026-02-24 23:34:20.974867+00	contado	\N
50	2026-02-24	6	Arley	3	120	249000	2075.0000000000000000	\N	2026-02-24 23:35:22.550925+00	contado	\N
51	2026-02-24	6	Arley	1	40	117000	2925.0000000000000000	\N	2026-02-24 23:35:53.155579+00	contado	\N
52	2026-03-19	8	Arley	10	400	920000	2300.0000000000000000	\N	2026-03-19 00:23:37.237652+00	contado	\N
53	2026-03-19	6	Arley	2	80	232000	2900.0000000000000000	\N	2026-03-19 00:24:24.334522+00	contado	\N
54	2026-03-19	1	Arley	8	320	656000	2050.0000000000000000	\N	2026-03-19 00:25:12.024282+00	contado	\N
55	2026-03-19	2	Arley 	3	120	270000	2250.0000000000000000	\N	2026-03-19 00:25:35.497966+00	contado	\N
56	2026-03-19	9	arley	2	80	178000	2225.0000000000000000	\N	2026-03-19 00:26:00.322701+00	contado	\N
57	2026-04-08	9	Arley	1	40	89000	2225.0000000000000000	\N	2026-04-08 22:29:14.113973+00	contado	\N
58	2026-04-08	6	Arley	1	40	116000	2900.0000000000000000	\N	2026-04-08 22:29:39.712091+00	contado	\N
59	2026-04-08	8	Arley	1	40	92000	2300.0000000000000000	\N	2026-04-08 22:30:39.047619+00	contado	\N
60	2026-04-08	9	arley	2	80	178000	2225.0000000000000000	\N	2026-04-08 22:31:13.169824+00	contado	\N
61	2026-04-08	9	ARLEY	14	560	1246000	2225.0000000000000000	\N	2026-04-08 22:31:49.88989+00	contado	\N
62	2026-04-08	1	arley	6	240	492000	2050.0000000000000000	\N	2026-04-08 22:32:34.289178+00	contado	\N
63	2026-04-08	6	arley	2	80	232000	2900.0000000000000000	\N	2026-04-08 22:32:59.801645+00	contado	\N
64	2026-04-08	2	arley	2	80	180000	2250.0000000000000000	\N	2026-04-08 22:33:18.593807+00	contado	\N
65	2026-04-19	3	Arley	1	40	167000	4175.0000000000000000	\N	2026-04-19 00:23:43.393912+00	contado	\N
66	2026-04-19	7	Arley	1	40	97000	2425.0000000000000000	\N	2026-04-19 00:24:11.297767+00	contado	\N
67	2026-04-19	7	Arley	1	40	97000	2425.0000000000000000	\N	2026-04-19 00:24:57.32395+00	contado	\N
68	2026-04-19	9	Arley	12	480	1068000	2225.0000000000000000	\N	2026-04-19 00:25:49.730564+00	contado	\N
69	2026-04-19	7	Arley	2	80	194000	2425.0000000000000000	\N	2026-04-19 00:27:01.319777+00	contado	\N
70	2026-04-19	8	Arley	2	80	184000	2300.0000000000000000	\N	2026-04-19 00:27:51.139608+00	contado	\N
71	2026-04-19	1	ARLEY	3	120	246000	2050.0000000000000000	\N	2026-04-19 00:28:20.630645+00	contado	\N
72	2026-04-19	2	Arley	1	40	90000	2250.0000000000000000	\N	2026-04-19 00:28:41.732173+00	contado	\N
73	2026-05-07	1	Arley	1	40	82000	2050.0000000000000000	\N	2026-05-07 00:17:39.26997+00	contado	\N
74	2026-05-07	6	Arley	2	80	232000	2900.0000000000000000	\N	2026-05-07 00:18:19.142001+00	contado	\N
75	2026-05-07	2	Arley	2	80	180000	2250.0000000000000000	\N	2026-05-07 00:18:46.146852+00	contado	\N
76	2026-05-07	8	Arley	5	200	460000	2300.0000000000000000	\N	2026-05-07 00:19:16.663895+00	contado	\N
77	2026-05-07	9	Arley	6	240	534000	2225.0000000000000000	\N	2026-05-07 00:19:54.794737+00	contado	\N
78	2026-05-07	6	Arley	2	80	232000	2900.0000000000000000	\N	2026-05-07 00:20:19.721126+00	contado	\N
79	2026-05-07	1	Arley	1	40	82000	2050.0000000000000000	\N	2026-05-07 00:20:39.494049+00	contado	\N
80	2026-05-07	6	Arley	1	40	116000	2900.0000000000000000	\N	2026-05-07 00:21:12.712199+00	contado	\N
81	2026-05-07	6	Arrley	3	120	348000	2900.0000000000000000	\N	2026-05-07 00:21:59.158232+00	contado	\N
82	2026-05-07	1	arley	6	240	492000	2050.0000000000000000	\N	2026-05-07 00:22:23.62363+00	contado	\N
83	2026-05-07	9	Arley	10	400	890000	2225.0000000000000000	\N	2026-05-07 00:22:49.004199+00	contado	\N
84	2026-05-07	8	Arley	10	400	920000	2300.0000000000000000	\N	2026-05-07 00:23:31.684577+00	contado	\N
85	2026-05-07	7	arley	3	120	291000	2425.0000000000000000	\N	2026-05-07 00:23:55.22537+00	contado	\N
86	2026-05-07	2	Arleyy	3	120	270000	2250.0000000000000000	\N	2026-05-07 00:24:22.36487+00	contado	\N
87	2026-05-25	8	Arley	10	400	920000	2300.0000000000000000	\N	2026-05-25 23:54:18.568186+00	contado	\N
88	2026-05-25	9	Arley	11	440	979000	2225.0000000000000000	\N	2026-05-25 23:54:47.874682+00	contado	\N
89	2026-05-25	1	Arley	6	240	492000	2050.0000000000000000	\N	2026-05-25 23:55:15.060031+00	contado	\N
90	2026-05-25	2	Arley	2	80	180000	2250.0000000000000000	\N	2026-05-25 23:55:39.26459+00	contado	\N
91	2026-05-25	8	Arley	3	120	276000	2300.0000000000000000	\N	2026-05-25 23:56:07.446297+00	contado	\N
92	2026-06-11	4	Arleyy	1	40	146000	3650.0000000000000000	\N	2026-06-11 00:03:54.114007+00	contado	\N
93	2026-06-11	1	Arley	3	120	246000	2050.0000000000000000	\N	2026-06-11 00:04:38.481735+00	contado	\N
94	2026-06-11	2	Arley	1	40	90000	2250.0000000000000000	\N	2026-06-11 00:04:56.498034+00	contado	\N
95	2026-06-11	6	Arley	1	40	116000	2900.0000000000000000	\N	2026-06-11 00:05:18.661047+00	contado	\N
96	2026-06-11	9	Arley	16	640	1424000	2225.0000000000000000	\N	2026-06-11 00:05:45.683054+00	contado	\N
\.


--
-- Data for Name: cuentas_caja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuentas_caja (id, nombre, saldo_inicial, fecha_corte, activa, created_at) FROM stdin;
1	Cuenta Malon	7819000	2026-06-10	t	2026-06-11 02:17:21.056804+00
2	Efectivo Yeison	5165700	2026-06-10	t	2026-06-11 02:17:21.056804+00
\.


--
-- Data for Name: lotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lotes (id, codigo, fecha_inicio, fecha_cierre, ubicacion, cantidad_inicial, cantidad_actual, costo_inicial_lote, estado, created_at, peso_promedio_inicial, observaciones, peso_promedio_actual, corral_id, etapa) FROM stdin;
1	L-2025-86	2025-12-14	2026-04-19	precebo	10	0	0	cerrado_vendido	2025-12-14 02:49:40.94955+00	15	\N	0	3	engorde
5	L-2026-429	2026-04-14	\N	Corral de Precebo	13	2	0	activo	2026-04-19 00:39:12.317886+00	8	\N	0	7	precebo
4	L-2026-360	2026-04-03	\N	Corral de Precebo	15	12	0	activo	2026-04-08 22:15:30.071768+00	8	\N	0	7	precebo
6	L-08-2026-780	2026-06-10	\N	Corral de Precebo	15	15	0	activo	2026-06-10 23:44:35.707391+00	8	\N	0	7	precebo
2	L-2026-177	2026-01-02	\N	Corral de Precebo	15	1	0	activo	2026-01-07 01:45:53.935409+00	8	\N	15	11	engorde
3	L-2026-42	2026-02-18	\N	Corral de Precebo	16	9	0	activo	2026-02-18 00:07:22.673749+00	8	\N	50	11	engorde
7	L-La mona-2026-242	2026-05-19	2026-06-11	Corral de Precebo	12	0	0	cerrado_vendido	2026-06-10 23:49:05.540985+00	8	\N	0	7	precebo
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
22	2026-02-18	muerte	2	\N	2	Se murieron por infarto	2026-02-18 00:06:14.065371+00
23	2026-02-18	tratamiento	\N	2	1	Vacuna Mycoplasma + Circovirus	2026-02-18 00:16:42.369455+00
\.


--
-- Data for Name: lote_origen; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lote_origen (id, lote_id, ciclo_id, cantidad_aportada, created_at) FROM stdin;
1	1	2	10	2026-05-26 03:10:57.700923+00
2	2	1	15	2026-05-26 03:10:57.700923+00
3	3	5	16	2026-05-26 03:10:57.700923+00
4	4	4	15	2026-05-26 03:10:57.700923+00
5	5	3	13	2026-05-26 03:10:57.700923+00
6	6	8	15	2026-06-10 23:44:35.853111+00
7	7	7	12	2026-06-10 23:49:05.677957+00
\.


--
-- Data for Name: movimientos_caja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimientos_caja (id, fecha, tipo, categoria_id, monto, descripcion, metodo_pago, lote_relacionado_id, url_comprobante, created_at, cuenta_id) FROM stdin;
1	2025-12-11	ingreso	18	10037200	Saldo Inicial de Caja (Dinero anterior)	efectivo	\N	\N	2025-12-11 05:31:23.838043+00	\N
2	2025-12-13	egreso	4	182000	Compra lactancia 	efectivo	\N	\N	2025-12-14 02:29:48.503332+00	\N
3	2025-12-14	egreso	4	664000	Gestación	efectivo	\N	\N	2025-12-14 02:31:19.073476+00	\N
4	2025-12-14	egreso	4	372000	Lechon	efectivo	\N	\N	2025-12-14 02:32:19.883285+00	\N
5	2025-12-14	egreso	4	236000	Inicio	efectivo	\N	\N	2025-12-14 02:33:10.221717+00	\N
6	2025-12-14	egreso	4	140000	Pre inicio	efectivo	\N	\N	2025-12-14 02:34:48.164371+00	\N
7	2025-12-14	egreso	4	255000	Compra	efectivo	\N	\N	2025-12-14 02:36:54.730729+00	\N
8	2025-12-14	egreso	8	120000	Pago oficial	efectivo	\N	\N	2025-12-14 23:51:38.294988+00	\N
9	2025-12-15	egreso	5	0	Medicamento prueba	efectivo	\N	\N	2025-12-15 00:15:04.983978+00	\N
10	2025-12-19	egreso	4	92000	Compra alimento 	efectivo	\N	\N	2025-12-27 17:41:00.14457+00	\N
11	2025-12-19	egreso	4	249000	Gestación 	efectivo	\N	\N	2025-12-27 17:41:54.536776+00	\N
12	2025-12-19	egreso	4	90000	Lactancia 	efectivo	\N	\N	2025-12-27 17:42:21.169071+00	\N
13	2025-12-19	egreso	4	118000	Iniciación 	efectivo	\N	\N	2025-12-27 17:44:39.721582+00	\N
14	2025-12-24	egreso	4	92000	Finalizador 	efectivo	\N	\N	2025-12-27 17:45:55.164869+00	\N
15	2025-12-27	egreso	4	170000	Reemplazo 	efectivo	\N	\N	2025-12-27 17:48:34.802098+00	\N
16	2025-12-27	egreso	4	184000	Finalizador 	efectivo	\N	\N	2025-12-27 17:49:12.476817+00	\N
17	2025-12-27	egreso	4	83000	Lactancia 	efectivo	\N	\N	2025-12-27 17:49:52.538064+00	\N
18	2025-12-27	egreso	4	82000	Medio bulto de pre inicio 	efectivo	\N	\N	2025-12-27 17:51:58.800188+00	\N
19	2025-12-28	egreso	7	740400	Compra materiales corral 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766952200123_129.jpg	2025-12-28 20:03:24.041278+00	\N
20	2025-12-28	egreso	7	53900	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766952761343_273.jpg	2025-12-28 20:12:44.679117+00	\N
21	2025-12-28	egreso	7	33600	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955103244_837.jpg	2025-12-28 20:51:44.660381+00	\N
22	2025-12-28	egreso	7	12800	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955165546_426.jpg	2025-12-28 20:52:47.738994+00	\N
23	2025-12-28	egreso	7	5200	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955256506_389.jpg	2025-12-28 20:54:18.133742+00	\N
24	2025-12-28	egreso	7	12900	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955289702_518.jpg	2025-12-28 20:54:51.344719+00	\N
25	2025-12-28	egreso	7	37600	Compra materiales 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1766955341991_234.jpg	2025-12-28 20:55:43.110228+00	\N
26	2025-12-29	egreso	8	260000	Pago oficial 	efectivo	\N	\N	2025-12-29 00:34:41.498088+00	\N
27	2025-12-31	ingreso	2	550000	Venta Descarte - Cerda ID 4 - Chorizos	efectivo	\N	\N	2026-01-07 01:48:18.090152+00	\N
28	2025-12-31	egreso	7	2000000	Compra jaulas gestación 	efectivo	\N	\N	2026-01-07 01:49:08.09176+00	\N
29	2026-01-07	egreso	4	90000	Compra transición 	efectivo	\N	\N	2026-01-07 01:59:41.164565+00	\N
30	2026-01-07	egreso	4	180000	Compra finalizador	efectivo	\N	\N	2026-01-07 02:01:11.295653+00	\N
31	2026-01-07	egreso	4	166000	Compra gestacion	efectivo	\N	\N	2026-01-07 02:02:16.025904+00	\N
32	2026-01-07	egreso	4	170000	Compra reemplazo cuido	efectivo	\N	\N	2026-01-07 02:03:23.598711+00	\N
33	2026-01-09	egreso	6	120000	Inseminación Cerda La mona - Semen 	efectivo	\N	\N	2026-01-10 13:34:31.251732+00	\N
34	2026-01-10	egreso	5	30000	Inyecciones parvo 0708	efectivo	\N	\N	2026-01-10 13:41:53.881961+00	\N
35	2026-01-14	egreso	6	120000	Inseminación Cerda 08 - pic 410	efectivo	\N	\N	2026-01-15 23:04:32.455205+00	\N
36	2026-01-15	egreso	8	40000	Inseminación cerdas 08 y la mona	efectivo	\N	\N	2026-01-15 23:04:59.738707+00	\N
37	2026-01-15	egreso	8	130000	Pago oficial: reforzo parideras, revoco corrales 	efectivo	\N	\N	2026-01-15 23:06:58.050454+00	\N
38	2026-01-15	egreso	7	167500	Reforzada parideras 	efectivo	\N	https://spoxpbhhjcchwebnpdix.supabase.co/storage/v1/object/public/comprobantes/comprobantes_movimientos/1768518528785_434.png	2026-01-15 23:08:49.128525+00	\N
39	2026-01-15	egreso	4	90000	Compra lechon 337 	efectivo	\N	\N	2026-01-15 23:18:31.804556+00	\N
40	2026-01-15	egreso	4	97000	compra transición 	efectivo	\N	\N	2026-01-15 23:19:06.816734+00	\N
41	2026-01-15	egreso	4	164000	Compra gestacion	efectivo	\N	\N	2026-01-15 23:19:38.956262+00	\N
42	2026-01-15	egreso	4	85000	compra reemplazo 	efectivo	\N	\N	2026-01-15 23:20:01.644767+00	\N
43	2026-01-15	egreso	4	130000	compra preinicio	efectivo	\N	\N	2026-01-15 23:21:37.460724+00	\N
44	2026-01-15	egreso	18	1959500	Ajuste saldo en cartera 	efectivo	\N	\N	2026-01-15 23:32:48.592356+00	\N
45	2026-01-15	egreso	4	90000	Compra finalizador	efectivo	\N	\N	2026-01-15 23:35:56.396324+00	\N
46	2026-01-27	egreso	4	91000	compra lactancia	efectivo	\N	\N	2026-01-27 23:36:51.815852+00	\N
47	2026-01-27	egreso	4	83000	compra 1 bulto de gestacion	efectivo	\N	\N	2026-01-27 23:37:17.078502+00	\N
48	2026-01-27	egreso	4	90000	Compra un bulto finalizador	efectivo	\N	\N	2026-01-27 23:37:43.683622+00	\N
49	2026-01-27	egreso	4	117000	compra bulto iniciacion	efectivo	\N	\N	2026-01-27 23:38:01.565126+00	\N
50	2026-01-27	egreso	4	93000	Compra bulto lechon 	efectivo	\N	\N	2026-01-27 23:38:30.828087+00	\N
51	2026-01-27	egreso	4	90000	Compra bulto finalizador	efectivo	\N	\N	2026-01-27 23:38:56.748384+00	\N
52	2026-01-27	egreso	4	91000	compra bulto lactancia	efectivo	\N	\N	2026-01-27 23:39:59.871638+00	\N
53	2026-01-27	egreso	4	83000	compra bulto reemplazo	efectivo	\N	\N	2026-01-27 23:40:31.497639+00	\N
54	2026-01-27	egreso	4	117000	compra bulto iniciación 	efectivo	\N	\N	2026-01-27 23:41:03.493765+00	\N
55	2026-01-27	egreso	4	93000	compra bulto lechon	efectivo	\N	\N	2026-01-27 23:41:22.734445+00	\N
56	2026-02-04	ingreso	1	1624000	Venta Lote L-2025-86 - Yeison	efectivo	1	\N	2026-02-04 14:29:28.762195+00	\N
57	2026-02-17	ingreso	1	810000	Venta Lote L-2025-86 - Claudia	efectivo	1	\N	2026-02-17 23:44:41.75855+00	\N
58	2026-02-17	ingreso	1	776000	Venta Lote L-2025-86 - Yeison	efectivo	1	\N	2026-02-17 23:45:14.300792+00	\N
59	2026-02-17	egreso	6	240000	Inseminación Cerda La jardineña - Semen	efectivo	\N	\N	2026-02-18 00:09:23.162381+00	\N
60	2026-02-18	egreso	5	150000	Compra fostera	efectivo	\N	\N	2026-02-18 00:16:04.681787+00	\N
61	2026-02-24	egreso	4	83000	1 de gestacion 	efectivo	\N	\N	2026-02-24 23:27:35.907014+00	\N
62	2026-02-24	egreso	4	93000	Compra bulto lechon	efectivo	\N	\N	2026-02-24 23:28:40.665003+00	\N
63	2026-02-24	egreso	4	117000	compra iniciacion	efectivo	\N	\N	2026-02-24 23:29:13.901848+00	\N
64	2026-02-24	egreso	4	83000	Compra bulto gestacion 	efectivo	\N	\N	2026-02-24 23:29:41.528509+00	\N
65	2026-02-24	egreso	4	98000	Compra transicion 1 bulto	efectivo	\N	\N	2026-02-24 23:30:13.481089+00	\N
66	2026-02-24	egreso	4	93000	Compra bulto lechon	efectivo	\N	\N	2026-02-24 23:30:40.203639+00	\N
67	2026-02-24	egreso	4	664000	Compra 8 bultos de gestacion	efectivo	\N	\N	2026-02-24 23:31:24.745167+00	\N
68	2026-02-24	egreso	4	588000	Compra 6 bultos transicion	efectivo	\N	\N	2026-02-24 23:31:59.003631+00	\N
69	2026-02-24	egreso	4	279000	compra 3 bultos lechones 	efectivo	\N	\N	2026-02-24 23:32:36.638691+00	\N
70	2026-02-24	egreso	4	270000	Compra 3 bultos finalizador 	efectivo	\N	\N	2026-02-24 23:33:13.582802+00	\N
71	2026-02-24	egreso	4	83000	medio bulto fase 1 	efectivo	\N	\N	2026-02-24 23:33:46.071099+00	\N
72	2026-02-24	egreso	4	148000	Pre inicio compra bulto	efectivo	\N	\N	2026-02-24 23:34:20.751012+00	\N
74	2026-02-24	egreso	4	117000	Compra iniciacion 	efectivo	\N	\N	2026-02-24 23:35:52.975214+00	\N
75	2026-02-24	egreso	8	130000	pago oficial 	efectivo	\N	\N	2026-02-25 00:00:04.458207+00	\N
76	2026-02-25	ingreso	1	1050000	Venta Lote L-2026-42 - Suegro del yeison	efectivo	3	\N	2026-02-25 00:03:40.010216+00	\N
77	2026-03-03	egreso	6	100000	Inseminación Cerda Juana - 410	efectivo	\N	\N	2026-03-03 17:59:49.561363+00	\N
78	2026-03-06	egreso	10	55000	Trasnporte concentrado	efectivo	\N	\N	2026-03-06 00:04:59.869151+00	\N
79	2026-03-19	egreso	4	920000	Compra 10 bultos lechon	efectivo	\N	\N	2026-03-19 00:23:37.002798+00	\N
80	2026-03-19	egreso	4	232000	combra 2 bultos inicio	efectivo	\N	\N	2026-03-19 00:24:24.182514+00	\N
81	2026-03-19	egreso	4	656000	compra 8 bultos gestacion	efectivo	\N	\N	2026-03-19 00:25:11.888043+00	\N
82	2026-03-19	egreso	4	270000	compra 3 bultos lactancia 	efectivo	\N	\N	2026-03-19 00:25:35.341406+00	\N
83	2026-03-19	egreso	4	178000	compra 2 finalisador	efectivo	\N	\N	2026-03-19 00:26:00.165306+00	\N
85	2026-03-19	egreso	7	1265000	Compra 11 tejas 	efectivo	\N	\N	2026-03-19 00:39:45.746407+00	\N
86	2026-03-19	egreso	7	21000	amarras	efectivo	\N	\N	2026-03-19 00:40:03.580139+00	\N
87	2026-03-19	egreso	10	130000	tejas transporte 	efectivo	\N	\N	2026-03-19 00:40:23.747249+00	\N
88	2026-03-19	egreso	8	336000	jornal aguas  + accesorios 	efectivo	\N	\N	2026-03-19 00:41:35.838512+00	\N
89	2026-03-19	egreso	7	320700	compora cemento y materiales  y tejas de sim	efectivo	\N	\N	2026-03-19 00:43:18.709989+00	\N
90	2026-03-19	egreso	5	82000	Compra flumicina y tripen y guantes	efectivo	\N	\N	2026-03-19 00:44:43.583329+00	\N
91	2026-03-19	egreso	7	400000	compra parideras 	efectivo	\N	\N	2026-03-19 00:45:16.140731+00	\N
84	2026-03-19	ingreso	19	20500000	Credito cfa 22 millones	efectivo	\N	\N	2026-03-19 00:36:43.93225+00	\N
73	2026-02-24	egreso	4	166000	Compra 2 bultos gestacion	efectivo	\N	\N	2026-02-24 23:35:22.393884+00	\N
93	2026-03-02	egreso	4	184000	Compra 2 bultos lechones	efectivo	\N	\N	2026-03-24 15:59:41.718237+00	\N
94	2026-02-17	egreso	4	592000	Compra 4 bultos preinicio faltantes	efectivo	\N	\N	2026-03-24 15:59:41.718237+00	\N
95	2026-04-09	egreso	6	100000	Inseminación Cerda Roci - semen duroc	efectivo	\N	\N	2026-04-08 22:15:59.844482+00	\N
96	2026-04-08	egreso	4	89000	1 bulto finalizador 	efectivo	\N	\N	2026-04-08 22:29:13.937592+00	\N
97	2026-04-08	egreso	4	116000	1 bulto de iniciacion	efectivo	\N	\N	2026-04-08 22:29:39.538984+00	\N
98	2026-04-08	egreso	4	92000	compra 1 bulto lechon 	efectivo	\N	\N	2026-04-08 22:30:38.880946+00	\N
99	2026-04-08	egreso	4	178000	2 bultos finalizador 	efectivo	\N	\N	2026-04-08 22:31:12.982186+00	\N
100	2026-04-08	egreso	4	1246000	14 bultos finalizador 	efectivo	\N	\N	2026-04-08 22:31:49.734189+00	\N
101	2026-04-08	egreso	4	492000	6 BULTOS DE GESTACION	efectivo	\N	\N	2026-04-08 22:32:34.12155+00	\N
102	2026-04-08	egreso	4	232000	2 bultos iniciacion	efectivo	\N	\N	2026-04-08 22:32:59.642465+00	\N
103	2026-04-08	egreso	4	180000	dos bultos lactancia 	efectivo	\N	\N	2026-04-08 22:33:18.450778+00	\N
104	2026-04-08	egreso	5	58000	compra decomoton	efectivo	\N	\N	2026-04-08 22:35:19.703946+00	\N
105	2026-04-08	egreso	5	196200	compra varias medicamentos	efectivo	\N	\N	2026-04-08 22:39:40.885063+00	\N
106	2026-04-08	egreso	5	488834	tarro de micoplasma 	efectivo	\N	\N	2026-04-08 22:41:04.541427+00	\N
107	2026-04-08	egreso	5	59000	hierro	efectivo	\N	\N	2026-04-08 22:41:35.834164+00	\N
108	2026-04-08	egreso	10	50000	flete cuido	efectivo	\N	\N	2026-04-08 22:42:24.28166+00	\N
109	2026-04-08	egreso	5	20000	inyecciones parvo virus	efectivo	\N	\N	2026-04-08 22:43:28.22769+00	\N
110	2026-04-08	ingreso	1	2680000	Venta Lote L-2025-86 - El yeison	efectivo	1	\N	2026-04-08 22:46:02.487709+00	\N
111	2026-04-10	egreso	7	759450	compra materiales pago ferreteria	efectivo	\N	\N	2026-04-10 14:52:04.376301+00	\N
112	2026-04-19	egreso	4	167000	1 bulto Compra fase 1 	efectivo	\N	\N	2026-04-19 00:23:43.143751+00	\N
113	2026-04-19	egreso	4	97000	Compra 1 bulto de transicion	efectivo	\N	\N	2026-04-19 00:24:11.124327+00	\N
114	2026-04-19	egreso	4	97000	Compra un bulto de transicion	efectivo	\N	\N	2026-04-19 00:24:57.178149+00	\N
115	2026-04-19	egreso	4	1068000	compra finalizar	efectivo	\N	\N	2026-04-19 00:25:49.575566+00	\N
116	2026-04-19	egreso	4	194000	Compra dos bultos de transicion	efectivo	\N	\N	2026-04-19 00:27:01.177053+00	\N
117	2026-04-19	egreso	4	184000	Compra de dos bultos lechones 	efectivo	\N	\N	2026-04-19 00:27:50.993968+00	\N
118	2026-04-19	egreso	4	246000	3 Bultos de gestacion	efectivo	\N	\N	2026-04-19 00:28:20.506018+00	\N
119	2026-04-19	egreso	4	90000	Compra bulto lactancia	efectivo	\N	\N	2026-04-19 00:28:41.602366+00	\N
120	2026-04-19	ingreso	1	752000	Venta Lote L-2025-86 - Yeison	efectivo	1	\N	2026-04-19 00:33:18.696111+00	\N
121	2026-04-19	ingreso	1	1240000	Venta Lote L-2026-177 - Yeison	efectivo	2	\N	2026-04-19 00:34:18.210991+00	\N
122	2026-04-19	ingreso	1	655500	Venta Lote L-2026-177 - Claudia	efectivo	2	\N	2026-04-19 00:34:53.816228+00	\N
123	2026-04-19	ingreso	1	752000	Venta Lote L-2026-177 - Yeison	efectivo	2	\N	2026-04-19 00:37:03.751358+00	\N
124	2026-04-16	egreso	6	100000	Inseminación Cerda Sol - Semen	efectivo	\N	\N	2026-04-19 00:40:23.549784+00	\N
125	2026-04-19	egreso	8	260000	Pago oficial	efectivo	\N	\N	2026-04-19 00:40:56.321881+00	\N
126	2026-04-26	egreso	6	100000	Inseminación Cerda La jardineña - Guror	efectivo	\N	\N	2026-04-30 20:13:25.739845+00	\N
127	2026-04-23	egreso	6	100000	Inseminación Cerda La brava - 410	efectivo	\N	\N	2026-04-30 20:14:41.059916+00	\N
128	2026-05-07	egreso	4	82000	Compra bulto gestion 	efectivo	\N	\N	2026-05-07 00:17:39.067521+00	\N
129	2026-05-07	egreso	4	232000	Compra 2 bultos iniciacion	efectivo	\N	\N	2026-05-07 00:18:18.959399+00	\N
130	2026-05-07	egreso	4	180000	Compra 2 bultos lactancia	efectivo	\N	\N	2026-05-07 00:18:45.99914+00	\N
131	2026-05-07	egreso	4	460000	Compra 5 bultos lechones 	efectivo	\N	\N	2026-05-07 00:19:16.520484+00	\N
132	2026-05-07	egreso	4	534000	Compra 6 bultos de finalizador 	efectivo	\N	\N	2026-05-07 00:19:54.648924+00	\N
133	2026-05-07	egreso	4	232000	compra dos bultos iniciacion	efectivo	\N	\N	2026-05-07 00:20:19.557679+00	\N
134	2026-05-07	egreso	4	82000	Compra 1 bulto gestacion	efectivo	\N	\N	2026-05-07 00:20:39.292052+00	\N
135	2026-05-07	egreso	4	116000	Compra un bulto iniciacion	efectivo	\N	\N	2026-05-07 00:21:12.422538+00	\N
136	2026-05-07	egreso	4	348000	Compra 3 bultos de iniciacion	efectivo	\N	\N	2026-05-07 00:21:58.969126+00	\N
137	2026-05-07	egreso	4	492000	compra 6 bultos de gestacion	efectivo	\N	\N	2026-05-07 00:22:23.441726+00	\N
138	2026-05-07	egreso	4	890000	compra 10 bultos de finalizador	efectivo	\N	\N	2026-05-07 00:22:48.826896+00	\N
139	2026-05-07	egreso	4	920000	Compra 10 bultos de lechones 	efectivo	\N	\N	2026-05-07 00:23:31.498663+00	\N
140	2026-05-07	egreso	4	291000	compra 3 bultos transicion	efectivo	\N	\N	2026-05-07 00:23:55.037449+00	\N
141	2026-05-07	egreso	4	270000	compra 3 bultos de lactancia 	efectivo	\N	\N	2026-05-07 00:24:22.21573+00	\N
142	2026-05-07	ingreso	1	912000	Venta Lote L-2026-177 - Yeison	efectivo	2	\N	2026-05-07 00:29:34.91637+00	\N
143	2026-05-07	ingreso	1	728000	Venta Lote L-2026-177 - Hispania	efectivo	2	\N	2026-05-07 00:30:18.685524+00	\N
144	2026-05-07	ingreso	1	1652400	Venta Lote L-2026-429 - Hispania	efectivo	5	\N	2026-05-07 00:35:19.175081+00	\N
145	2026-05-07	ingreso	1	450000	Venta Lote L-2026-360 - hispania	efectivo	4	\N	2026-05-07 00:35:48.93037+00	\N
146	2026-05-07	egreso	5	72000	Compra tripen y inflacor	efectivo	\N	\N	2026-05-07 00:43:05.265153+00	\N
147	2026-05-07	egreso	10	150000	transporte cuido  	efectivo	\N	\N	2026-05-07 00:43:55.575184+00	\N
148	2026-05-07	egreso	8	25000	pago capador	efectivo	\N	\N	2026-05-07 00:45:19.737622+00	\N
149	2026-05-07	egreso	18	1906000	Pago cuota credito	efectivo	\N	\N	2026-05-07 00:49:46.55578+00	\N
150	2026-05-25	egreso	4	614000	Cuadre cuido 	efectivo	\N	\N	2026-05-25 23:53:29.967311+00	\N
151	2026-05-25	egreso	4	920000	Compra 10 bultos lechon	efectivo	\N	\N	2026-05-25 23:54:18.346221+00	\N
152	2026-05-25	egreso	4	979000	Compra 11 bultos finalizador	efectivo	\N	\N	2026-05-25 23:54:47.712145+00	\N
153	2026-05-25	egreso	4	492000	Compra 6 bultos de gestacion	efectivo	\N	\N	2026-05-25 23:55:14.921001+00	\N
154	2026-05-25	egreso	4	180000	compra dos bultos de lactancia 	efectivo	\N	\N	2026-05-25 23:55:39.113395+00	\N
155	2026-05-25	egreso	4	276000	Compra 3 bultos de lechones 	efectivo	\N	\N	2026-05-25 23:56:07.283412+00	\N
156	2026-05-26	ingreso	1	854000	Venta Lote L-2026-177 - Claudia	efectivo	2	\N	2026-05-26 00:01:25.853529+00	\N
157	2026-05-26	ingreso	1	1928000	Venta Lote L-2026-177 - Yeison	efectivo	2	\N	2026-05-26 00:03:08.890311+00	\N
158	2026-05-26	egreso	5	125300	Compra de flumixina 	efectivo	\N	\N	2026-05-26 00:10:06.83583+00	\N
159	2026-06-01	egreso	6	100000	Inseminación Cerda 08 - Semen 	efectivo	\N	\N	2026-06-10 23:47:14.082294+00	\N
160	2026-06-10	ingreso	1	1	Venta Lote L-2026-177 - YEISON	efectivo	2	\N	2026-06-10 23:58:33.76023+00	\N
161	2026-06-11	egreso	4	146000	1 bulto preinicio	efectivo	\N	\N	2026-06-11 00:03:53.937243+00	\N
162	2026-06-11	egreso	4	246000	3 bultos de gestacion	efectivo	\N	\N	2026-06-11 00:04:38.323943+00	\N
163	2026-06-11	egreso	4	90000	Compra de lactancia 	efectivo	\N	\N	2026-06-11 00:04:56.35673+00	\N
164	2026-06-11	egreso	4	116000	compra bulto de inicio	efectivo	\N	\N	2026-06-11 00:05:18.507071+00	\N
165	2026-06-11	egreso	4	1424000	16 bultos de finalizador	efectivo	\N	\N	2026-06-11 00:05:45.023549+00	\N
166	2026-06-11	ingreso	1	861000	Venta Lote L-2026-177 - claudia	efectivo	2	\N	2026-06-11 00:07:31.820061+00	\N
167	2026-06-11	ingreso	1	976000	Venta Lote L-2026-177 - Yeison	efectivo	2	\N	2026-06-11 00:07:54.091185+00	\N
168	2026-06-11	ingreso	1	768000	Venta Lote L-2026-42 - Yeison	efectivo	3	\N	2026-06-11 00:08:50.383522+00	\N
169	2026-06-11	egreso	8	20000	pago enseminador	efectivo	\N	\N	2026-06-11 00:12:00.242493+00	\N
170	2026-06-11	egreso	5	30000	compra dos vacunas parvo y ecoli	efectivo	\N	\N	2026-06-11 00:12:24.205213+00	\N
171	2026-06-11	egreso	10	50000	flete cuido	efectivo	\N	\N	2026-06-11 00:13:04.148814+00	\N
172	2026-06-11	egreso	10	1000000	Arreglo moto	efectivo	\N	\N	2026-06-11 00:13:29.050104+00	\N
173	2026-06-11	ingreso	1	1440000	Venta Lote L-La mona-2026-242 - Bolivar y darien	efectivo	7	\N	2026-06-11 00:27:44.86641+00	\N
179	2026-06-11	ingreso	22	2116517	Reposición faltante cuadre jun-2026 - asumido por Malon en su cuenta	efectivo	\N	\N	2026-06-11 05:51:31.799861+00	1
\.


--
-- Data for Name: movimientos_proveedor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimientos_proveedor (id, proveedor_id, fecha, tipo, monto, descripcion, compra_id, movimiento_caja_id, created_at) FROM stdin;
1	1	2026-06-10	saldo_inicial	4461000	Saldo inicial deuda cuido según cuaderno (corte 10-jun-2026)	\N	\N	2026-06-11 02:17:21.056804+00
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
53	2026-02-17	1	40	cerda	\N	\N	2075	Alimentación Grupal - Gestación	2026-02-17 23:46:41.634847+00
54	2026-02-17	16	40	cerda	\N	\N	2075	Alimentación Grupal - Gestación	2026-02-17 23:46:57.820218+00
55	2026-02-17	8	80	lote	1	\N	2325	\N	2026-02-17 23:47:25.111874+00
56	2026-02-17	2	80	cerda	\N	\N	2275	Alimentación Grupal - Lactancia	2026-02-17 23:47:38.581088+00
57	2026-02-17	9	80	lote	1	\N	2250	\N	2026-02-17 23:48:09.902565+00
58	2026-02-17	6	80	lote	2	\N	2925	\N	2026-02-17 23:48:24.417907+00
59	2026-02-18	10	15	cerda	\N	2	10000	Sanidad Cerda 2. Vacuna Mycoplasma + Circovirus	2026-02-18 00:16:42.233345+00
60	2026-02-24	1	240	cerda	\N	\N	2075	Alimentación Grupal - Gestación	2026-02-24 23:37:43.581031+00
61	2026-02-24	7	240	lote	2	\N	2450	\N	2026-02-24 23:39:53.243587+00
62	2026-02-24	8	160	lote	1	\N	2325	\N	2026-02-24 23:41:18.38236+00
63	2026-02-24	6	160	lote	2	\N	2415	\N	2026-02-24 23:42:34.346229+00
64	2026-02-24	4	40	lote	3	\N	3700	\N	2026-02-24 23:45:27.925241+00
65	2026-03-05	8	40	lote	2	\N	2325	\N	2026-03-05 23:58:32.905076+00
66	2026-03-05	7	40	lote	2	\N	2450	\N	2026-03-05 23:58:41.112531+00
67	2026-03-05	3	40	lote	3	\N	2075	\N	2026-03-05 23:59:21.8302+00
68	2026-03-06	9	80	lote	1	\N	2250	\N	2026-03-06 00:00:53.340328+00
69	2026-03-06	1	120	cerda	\N	\N	2075	Alimentación Grupal - Gestación	2026-03-06 00:01:32.800916+00
70	2026-03-19	6	40	lote	3	\N	2415	\N	2026-03-19 00:20:26.266514+00
71	2026-03-19	9	40	lote	1	\N	2250	\N	2026-03-19 00:20:45.587577+00
72	2026-03-19	1	40	cerda	\N	\N	2075	Alimentación Grupal - Gestación	2026-03-19 00:20:59.330759+00
73	2026-03-19	9	80	lote	1	\N	2225	\N	2026-03-19 00:58:20.86376+00
74	2026-03-19	8	400	lote	2	\N	2300	\N	2026-03-19 00:59:53.447719+00
75	2026-03-19	6	80	lote	3	\N	2900	\N	2026-03-19 01:00:56.95903+00
76	2026-03-19	1	200	cerda	\N	\N	2050	Alimentación Grupal - Gestación	2026-03-19 01:05:06.137613+00
77	2026-03-19	2	40	cerda	\N	\N	2250	Alimentación Grupal - Lactancia	2026-03-19 01:05:31.360843+00
78	2026-04-08	2	80	cerda	\N	\N	2250	Alimentación Grupal - Lactancia	2026-04-08 22:25:19.370889+00
79	2026-04-08	1	120	cerda	\N	\N	2050	Alimentación Grupal - Gestación	2026-04-08 22:25:28.990403+00
80	2026-04-19	8	40	lote	3	\N	2300	\N	2026-04-19 00:10:30.456818+00
81	2026-04-19	2	80	cerda	\N	\N	2250	Alimentación Grupal - Lactancia	2026-04-19 00:11:01.252455+00
82	2026-04-19	6	120	lote	3	\N	2900	\N	2026-04-19 00:11:45.558107+00
83	2026-04-19	1	240	cerda	\N	\N	2050	Alimentación Grupal - Gestación	2026-04-19 00:11:58.269613+00
84	2026-04-19	9	500	lote	2	\N	2225	\N	2026-04-19 00:12:18.666047+00
85	2026-04-19	9	180	lote	1	\N	2225	\N	2026-04-19 00:12:28.768486+00
86	2026-05-07	2	40	cerda	\N	\N	2250	Alimentación Grupal - Lactancia	2026-05-07 00:12:54.052186+00
87	2026-05-07	3	40	lote	4	\N	4175	\N	2026-05-07 00:14:35.584662+00
88	2026-05-07	8	80	lote	3	\N	2300	\N	2026-05-07 00:14:51.913052+00
89	2026-05-07	1	120	cerda	\N	\N	2050	Alimentación Grupal - Gestación	2026-05-07 00:15:07.234569+00
90	2026-05-07	7	160	lote	2	\N	2425	\N	2026-05-07 00:15:38.813456+00
91	2026-05-07	9	480	lote	2	\N	2225	\N	2026-05-07 00:15:56.882258+00
92	2026-05-25	7	120	lote	4	\N	2425	\N	2026-05-25 23:48:41.300843+00
93	2026-05-25	2	200	cerda	\N	\N	2250	Alimentación Grupal - Lactancia	2026-05-25 23:48:58.492059+00
94	2026-05-25	6	320	lote	4	\N	2900	\N	2026-05-25 23:49:25.685326+00
95	2026-05-25	8	400	lote	3	\N	2300	\N	2026-05-25 23:51:07.018527+00
96	2026-05-25	8	200	lote	4	\N	2300	\N	2026-05-25 23:51:16.054983+00
97	2026-05-25	9	640	lote	2	\N	2225	\N	2026-05-25 23:51:58.53056+00
98	2026-05-25	1	320	cerda	\N	\N	2050	Alimentación Grupal - Maternidad	2026-05-25 23:52:14.68479+00
99	2026-06-10	1	240	cerda	\N	\N	2050	Alimentación Grupal - Gestación	2026-06-10 23:50:17.22112+00
100	2026-06-10	9	150	lote	2	\N	2225	\N	2026-06-10 23:59:10.292554+00
101	2026-06-10	9	290	lote	3	\N	2225	\N	2026-06-10 23:59:18.219344+00
102	2026-06-11	8	200	lote	5	\N	2300	\N	2026-06-11 00:01:00.809676+00
103	2026-06-11	8	320	lote	4	\N	2300	\N	2026-06-11 00:01:11.304296+00
104	2026-06-11	2	80	cerda	\N	\N	2250	Alimentación Grupal - Lactancia	2026-06-11 00:01:28.162224+00
\.


--
-- Name: categorias_financieras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_financieras_id_seq', 22, true);


--
-- Name: cerdas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cerdas_id_seq', 1, false);


--
-- Name: ciclos_reproductivos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciclos_reproductivos_id_seq', 16, true);


--
-- Name: compras_insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compras_insumos_id_seq', 97, true);


--
-- Name: corrales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.corrales_id_seq', 11, true);


--
-- Name: cuentas_caja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuentas_caja_id_seq', 2, true);


--
-- Name: eventos_sanitarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_sanitarios_id_seq', 23, true);


--
-- Name: insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insumos_id_seq', 10, true);


--
-- Name: lote_origen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lote_origen_id_seq', 7, true);


--
-- Name: lotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lotes_id_seq', 7, true);


--
-- Name: movimientos_caja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_caja_id_seq', 179, true);


--
-- Name: movimientos_proveedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_proveedor_id_seq', 3, true);


--
-- Name: proveedores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proveedores_id_seq', 2, true);


--
-- Name: reglas_sanitarias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reglas_sanitarias_id_seq', 1, false);


--
-- Name: salidas_insumos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salidas_insumos_id_seq', 104, true);


--
-- PostgreSQL database dump complete
--

\unrestrict g4Kh5EIKoaejDIJAiCsuiwFkkpvswudXjoWQ3zW3gj5awVRcwpsO5NCskR2WkIj

