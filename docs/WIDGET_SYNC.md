# Sincronización multidispositivo de widgets diarios

## Arquitectura

- Identidad: Clerk. El `sub` del JWT se usa como `user_id` en Supabase.
- Base de datos: Supabase Postgres con RLS por `auth.jwt()->>'sub'`.
- Tiempo real: Supabase Realtime sobre `habitflow_widget_state`.
- Cliente: `widget-sync-core.js` implementa mutaciones idempotentes, cola offline y resolución last-write-wins.
- Push: cada navegador guarda su Web Push subscription en `habitflow_push_subscriptions`.
- Programación: `habitflow-push-cron` se ejecuta cada minuto desde Netlify; la Edge Function de Supabase mantiene la misma lógica como alternativa segura.

## Tablas

### `habitflow_widget_state`

Una fila por usuario y widget (`hydration` o `brushing`). Guarda el estado JSON, `updated_at`, `mutation_id` y `device_id`. La restricción única `(user_id, widget_key)` evita duplicados.

### `habitflow_widget_mutations`

Registro idempotente de mutaciones. `mutation_id` es clave primaria; reenviar el mismo cambio no incrementa agua ni cepillados dos veces.

### `habitflow_push_subscriptions`

Una suscripción por endpoint y dispositivo. Incluye `device_id`, nombre, plataforma, zona horaria, última actividad y los indicadores `enabled`/`active`.

## Conflictos y modo offline

La interfaz cambia de inmediato. Cada mutación recibe UUID y fecha ISO. La función `habitflow_apply_widget_mutation` aplica únicamente el estado con `updated_at` más reciente; si las fechas empatan, usa `mutation_id` como desempate determinista. Los fallos de red permanecen en una cola local deduplicada y se reintentan al recuperar conexión o foco. Un error definitivo revierte la mutación si ningún cambio posterior la reemplazó.

`localStorage` conserva solo el respaldo de arranque, la caché offline, el identificador del dispositivo, la marca de migración y la cola pendiente. Supabase es la fuente principal cuando hay sesión autenticada.

## Migración

Al iniciar sesión, el cliente consulta primero Supabase. Si el usuario todavía no tiene filas de widgets, sube los valores heredados de `localStorage`, espera confirmación y marca `habitflow_widget_sync_v2:<userId>:legacy-migrated`. Las claves antiguas no se eliminan, por lo que siguen siendo respaldo hasta que la migración se confirma.

## Despliegue

1. Ejecutar `supabase-habitflow-cloud.sql` en el proyecto Supabase enlazado a Clerk.
2. Desplegar `supabase/functions/habitflow-push-cron` si se usa el cron de Supabase, o publicar la función Netlify ya programada en `netlify.toml`.
3. Mantener en el entorno seguro del backend: `HABITFLOW_SUPABASE_SERVICE_ROLE_KEY`, `HABITFLOW_VAPID_PRIVATE_KEY`, `HABITFLOW_VAPID_PUBLIC_KEY` y `HABITFLOW_VAPID_SUBJECT`.
4. Nunca copiar la service-role key ni la clave VAPID privada a `index.html` o `HabitTrackerApp.jsx`.

## Verificación local

```powershell
pnpm install
pnpm run build
pnpm run test
pnpm run dev
```

Abrir `http://127.0.0.1:8080/index.html?dev-preview=1` para la prueba visual local. Las pruebas de dos dispositivos y entrega push real requieren que el SQL y la función programada estén desplegados en el entorno remoto.
