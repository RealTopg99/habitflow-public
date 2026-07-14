# Comparación visual Mobile/Tablet V2

Fecha de verificación: 14 de julio de 2026.

## Método

- Se compararon individualmente las 23 imágenes de `01_REFERENCIAS_OBJETIVO` contra la implementación local.
- Se generaron capturas finales en `390x844`, `430x932`, `820x1180` y `1024x1366`.
- Se generó una regresión de escritorio en `1440x900`.
- En cada breakpoint compacto se verificó: un solo shell V2, cero nodos legacy y cero scroll horizontal.

## Resultado por referencia

| # | Pantalla | Archivo final | Resultado |
|---|---|---|---|
| 01 | Inicio | `390x844/01_INICIO.png` | Estructura, jerarquía, accesos, tarjetas y navegación V2 verificados. |
| 02 | Hábitos | `390x844/02_HABITOS.png` | Métricas, semana, estados y widget de hidratación verificados. |
| 03 | Pomodoro | `390x844/03_POMODORO.png` | Modos, temporizador, controles, alerta, notas y pendientes verificados. |
| 04 | Agenda semana | `390x844/04_AGENDA_SEMANA.png` | Cabecera, selector, calendario semanal y resumen verificados. |
| 05 | Agenda mes | `390x844/05_AGENDA_MES.png` | Mes, indicadores, métricas y próximos eventos verificados. |
| 06 | Agenda lista | `390x844/06_AGENDA_LISTA.png` | Filtros rápidos y agrupación de eventos verificados. |
| 07 | Agenda filtros | `390x844/07_AGENDA_FILTROS.png` | Hoja modal, categorías y acciones verificadas. |
| 08 | Próximos eventos | `390x844/08_AGENDA_PROXIMOS.png` | Selector temporal, resumen y lista verificados. |
| 09 | Entreno hoy | `390x844/09_ENTRENO_HOY.png` | Resumen, rutina activa y biblioteca real verificados. |
| 10 | Rutinas | `390x844/10_ENTRENO_RUTINAS.png` | Listado, estados vacíos reales y acciones verificadas. |
| 11 | Biblioteca | `390x844/11_ENTRENO_BIBLIOTECA.png` | Dataset real, miniaturas y carga diferida verificadas. |
| 12 | Progreso | `390x844/12_ENTRENO_PROGRESO.png` | Métricas, gráfica y cumplimiento verificados. |
| 13 | Sesión activa | `390x844/13_ENTRENO_SESION.png` | Ejercicio real, imagen, descanso y series verificadas. |
| 14 | Metas activas | `390x844/14_METAS_ACTIVAS.png` | Tarjetas, avance y aportes verificados. |
| 15 | Metas completadas | `390x844/15_METAS_COMPLETADAS.png` | Filtrado real por estado completado verificado. |
| 16 | Sueños | `390x844/16_METAS_SUENOS.png` | Resumen y conversión a meta verificados. |
| 17 | Wallet resumen | `390x844/17_WALLET_RESUMEN.png` | Saldo, acciones, gráfica y movimientos verificados. |
| 18 | Wallet agregar | `390x844/18_WALLET_AGREGAR.png` | Formulario real y guardado verificados. |
| 19 | Wallet cuentas | `390x844/19_WALLET_CUENTAS.png` | Resumen y cuentas reales verificadas. |
| 20 | Wallet movimientos | `390x844/20_WALLET_MOVIMIENTOS.png` | Búsqueda, filtros y movimientos reales verificados. |
| 21 | Wallet categorías | `390x844/21_WALLET_CATEGORIAS.png` | Grupos, edición y alta verificadas. |
| 22 | Wallet exportar | `390x844/22_WALLET_EXPORTAR.png` | Formatos, rango, opciones y exportación verificados. |
| 23 | Salud | `390x844/23_SALUD.png` | Hidratación, cepillado, sueño, peso y medicación verificados. |

## Correcciones derivadas de la comparación

- Se sustituyó el logotipo compacto heredado por la marca V2 roja.
- Se aisló la tipografía compacta para impedir que estilos serif del escritorio contaminaran V2.
- Se eliminó la navegación móvil antigua y el árbol desktop dejó de montarse en `<=1180px`.
- Se corrigió el render de Progreso de Entreno y el icono de Cepillado en Salud.
- Finanzas usa una sola navegación inferior específica y el resto de secciones una sola navegación global.
- La sesión activa carga medios del dataset mediante `gifUrl`/`gif_url` bajo demanda.
- Los estados sin datos muestran vacíos reales; no se inventaron registros definitivos para rellenar capturas.

## Matriz de regresión

| Tamaño | Shell V2 | DOM legacy | Scroll horizontal |
|---|---:|---:|---:|
| 390×844 | 1 | 0 | No |
| 430×932 | 1 | 0 | No |
| 820×1180 | 1 | 0 | No |
| 1024×1366 | 1 | 0 | No |
| 1440×900 | 0 | 0 | No |

La captura de escritorio está en `desktop/desktop-regression.png` y conserva el shell desktop existente.
