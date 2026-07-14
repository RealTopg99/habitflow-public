# Entreno y dataset de ejercicios

## Fuente

La sección Entreno integra una copia reproducible de
[`hasaneyldrm/exercises-dataset`](https://github.com/hasaneyldrm/exercises-dataset),
sin depender de su repositorio en tiempo de ejecución. La versión importada se
registra en `public/exercises-dataset/data/meta.json` y puede actualizarse con:

```sh
npm run sync:exercises -- <ruta-al-clon-del-dataset>
```

El script valida que cada ejercicio tenga su detalle, miniatura JPG y animación
GIF antes de reemplazar el catálogo público.

## Carga de medios

- El catálogo inicial contiene metadatos y rutas, no GIF descargados por React.
- La biblioteca pagina en grupos de 12, 24 o 48 elementos.
- Las tarjetas usan JPG con `loading="lazy"` y `decoding="async"`.
- Solo se reproduce un GIF a la vez y únicamente después de una acción del
  usuario.
- El detalle individual se solicita desde `data/details/<id>.json` bajo demanda.

## Atribución

Los medios conservan la atribución incluida por el dataset: **© Gym visual —
https://gymvisual.com/**. La interfaz muestra `© Gym visual` sin exponer una URL
ni convertirla en enlace; los avisos originales se copian a `public/exercises-dataset/NOTICE` y
`public/exercises-dataset/LICENSE`.

Los nombres visibles se cargan desde `data/translations.es.json`. El nombre
original en inglés se conserva internamente como `name_en`, por lo que las
búsquedas funcionan en ambos idiomas. Las traducciones se pueden regenerar con
`npm run translate:exercises` sin realizar llamadas desde el navegador.

La sincronización del dataset no concede derechos adicionales. Antes de una
distribución comercial debe verificarse que el uso previsto cumple los términos
del dataset y del proveedor de los medios.

## Datos personales y sincronización

Rutinas, favoritos, ejercicios personalizados, sesiones activas e historial se
guardan dentro de `workoutData` en el documento `habitflow_user_data` del usuario
autenticado. Cada cambio actualiza `updatedAt`, se guarda primero en la interfaz
y se replica mediante Supabase. La suscripción Realtime aplica únicamente una
versión remota más reciente; el botón Sincronizar ofrece una conciliación manual
con la misma regla.

La sesión activa utiliza marcas de tiempo, de modo que puede recuperarse después
de recargar o continuar en otro dispositivo. El almacenamiento local existente
se conserva como caché y respaldo offline dentro del mecanismo global de
HabitFlow, no como fuente autoritativa.

## Pruebas

`npm run test:entreno` comprueba la integridad de los 1.324 registros, la
existencia de sus 1.324 miniaturas y 1.324 GIF, la atribución, la carga bajo
demanda, la persistencia de la sesión y la integración de sincronización.
