import webpush from "npm:web-push@3.6.7";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const CLERK_ISSUER = Deno.env.get("HABITFLOW_CLERK_ISSUER") || "https://pumped-chimp-81.clerk.accounts.dev";
const CLERK_SECRET_KEY = Deno.env.get("HABITFLOW_CLERK_SECRET_KEY") || Deno.env.get("CLERK_SECRET_KEY") || "";
const CREATOR_EMAIL = (Deno.env.get("HABITFLOW_CREATOR_EMAIL") || "ventasdeeproots09@gmail.com").trim().toLowerCase();
const CREATOR_USER_ID = (Deno.env.get("HABITFLOW_CREATOR_USER_ID") || "").trim();
const VAPID_PUBLIC_KEY = Deno.env.get("HABITFLOW_VAPID_PUBLIC_KEY") || "";
const VAPID_PRIVATE_KEY = Deno.env.get("HABITFLOW_VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT = Deno.env.get("HABITFLOW_VAPID_SUBJECT") || "mailto:ventasdeeproots09@gmail.com";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://habitflow-public.pages.dev",
  "https://habit-flow-personal.netlify.app",
  "http://127.0.0.1:8080",
  "http://localhost:8080"
];
const ALLOWED_ORIGINS = (Deno.env.get("HABITFLOW_ALLOWED_ORIGINS") || DEFAULT_ALLOWED_ORIGINS.join(","))
  .split(",")
  .map(value => value.trim())
  .filter(Boolean);
const jwks = createRemoteJWKSet(new URL(`${CLERK_ISSUER}/.well-known/jwks.json`));

const corsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : "https://habitflow-public.pages.dev";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin"
  };
};

const jsonResponse = (body: Record<string, unknown>, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json; charset=utf-8" }
  });

const supabaseFetch = async (path: string, options: RequestInit = {}) => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase no está configurado en el servidor.");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || data?.error || `Supabase respondió ${response.status}.`);
  return data;
};

const getPrimaryEmail = (user: any) => {
  const primary = (user?.email_addresses || []).find((item: any) => item.id === user?.primary_email_address_id)
    || user?.email_addresses?.[0];
  return String(primary?.email_address || "").trim().toLowerCase();
};

const getClerkUser = async (userId: string) => {
  if (!CLERK_SECRET_KEY) throw new Error("Falta HABITFLOW_CLERK_SECRET_KEY.");
  const response = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.errors?.[0]?.message || "No se pudo validar el usuario de Clerk.");
  return data;
};

const authenticateCreator = async (request: Request) => {
  const origin = request.headers.get("Origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return { ok: false as const, status: 403, error: "Origen no autorizado.", origin };
  }

  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!token) return { ok: false as const, status: 401, error: "Debes iniciar sesión.", origin };

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: CLERK_ISSUER,
      algorithms: ["RS256"]
    });
    const userId = String(payload.sub || "");
    if (!userId) return { ok: false as const, status: 401, error: "La sesión no contiene un usuario válido.", origin };
    if (payload.azp && !ALLOWED_ORIGINS.includes(String(payload.azp))) {
      return { ok: false as const, status: 403, error: "La sesión proviene de una aplicación no autorizada.", origin };
    }

    if (CREATOR_USER_ID && userId === CREATOR_USER_ID) {
      return { ok: true as const, userId, email: CREATOR_EMAIL, origin };
    }

    const clerkUser = await getClerkUser(userId);
    const email = getPrimaryEmail(clerkUser);
    if (email !== CREATOR_EMAIL) {
      return { ok: false as const, status: 403, error: "Este usuario no tiene permisos de creador.", origin };
    }
    return { ok: true as const, userId, email, origin };
  } catch (error: any) {
    return {
      ok: false as const,
      status: String(error?.message || "").includes("HABITFLOW_CLERK_SECRET_KEY") ? 503 : 401,
      error: error?.message || "No se pudo verificar la sesión.",
      origin
    };
  }
};

const listUsersFromClerk = async () => {
  if (!CLERK_SECRET_KEY) return [];
  const response = await fetch("https://api.clerk.com/v1/users?limit=100&order_by=-created_at", {
    headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` }
  });
  const users = await response.json().catch(() => []);
  if (!response.ok) throw new Error(users?.errors?.[0]?.message || "No se pudo consultar la lista de Clerk.");
  return Array.isArray(users) ? users : users?.data || [];
};

const cloudRowsToUsers = (rows: any[]) => (rows || []).map((row: any) => ({
    id: row.user_id,
    first_name: row.data?.user?.clerkName || row.data?.user?.name || "Usuario",
    last_name: "",
    image_url: row.data?.user?.clerkImageUrl || "",
    primary_email_address_id: "cloud-email",
    email_addresses: [{ id: "cloud-email", email_address: row.data?.user?.clerkEmail || "" }]
  }));

const listClients = async (creator: { userId: string; email: string }) => {
  const [clerkUsers, subscriptions, cloudRows] = await Promise.all([
    listUsersFromClerk(),
    supabaseFetch("habitflow_push_subscriptions?select=user_id,enabled"),
    supabaseFetch("habitflow_user_data?select=user_id,data")
  ]);
  const mergedUsers = new Map<string, any>();
  (subscriptions || []).forEach((subscription: any) => {
    if (!subscription?.user_id) return;
    mergedUsers.set(subscription.user_id, {
      id: subscription.user_id,
      first_name: "Usuario",
      last_name: "",
      image_url: "",
      email_addresses: []
    });
  });
  cloudRowsToUsers(cloudRows || []).forEach((user: any) => {
    if (!user?.id) return;
    mergedUsers.set(user.id, { ...(mergedUsers.get(user.id) || {}), ...user });
  });
  (clerkUsers || []).forEach((user: any) => {
    if (!user?.id) return;
    mergedUsers.set(user.id, { ...(mergedUsers.get(user.id) || {}), ...user });
  });
  if (!mergedUsers.has(creator.userId)) {
    mergedUsers.set(creator.userId, {
      id: creator.userId,
      first_name: "Daniel Zuluaga",
      last_name: "",
      image_url: "",
      primary_email_address_id: "creator-email",
      email_addresses: [{ id: "creator-email", email_address: creator.email }]
    });
  }

  const deviceCounts = new Map<string, number>();
  (subscriptions || []).forEach((subscription: any) => {
    if (subscription.enabled === false) return;
    deviceCounts.set(subscription.user_id, (deviceCounts.get(subscription.user_id) || 0) + 1);
  });
  const notificationPreferences = new Map<string, boolean>();
  (cloudRows || []).forEach((row: any) => {
    notificationPreferences.set(row.user_id, row.data?.user?.notificationsEnabled !== false);
  });

  const users = [...mergedUsers.values()].map((user: any) => {
    const email = getPrimaryEmail(user);
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ")
      || user.username
      || email.split("@")[0]
      || "Usuario";
    return {
      id: user.id,
      name,
      email,
      imageUrl: user.image_url || "",
      devices: deviceCounts.get(user.id) || 0,
      notificationsEnabled: notificationPreferences.get(user.id) !== false,
      isCreator: email === CREATOR_EMAIL || (CREATOR_USER_ID && user.id === CREATOR_USER_ID)
    };
  });
  users.sort((left, right) => {
    const deviceDifference = Number(right.devices || 0) - Number(left.devices || 0);
    if (deviceDifference !== 0) return deviceDifference;
    return String(left.name || "").localeCompare(String(right.name || ""), "es");
  });
  return {
    users,
    sources: {
      clerk: clerkUsers.length,
      cloud: cloudRows?.length || 0,
      subscriptions: new Set((subscriptions || []).map((item: any) => item.user_id)).size
    }
  };
};

const deleteExpiredSubscription = async (endpoint: string) => {
  await supabaseFetch(`habitflow_push_subscriptions?endpoint=eq.${encodeURIComponent(endpoint)}`, {
    method: "DELETE"
  }).catch(() => null);
};

const sendCreatorNotification = async (input: any, creatorUserId: string) => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) throw new Error("Las llaves VAPID no están configuradas.");
  const title = String(input?.title || "").trim().slice(0, 80);
  const body = String(input?.body || "").trim().slice(0, 300);
  if (!title || !body) throw new Error("El título y el mensaje son obligatorios.");

  const audience = input?.audience === "all" ? "all" : "selected";
  const requestedUserIds = [...new Set((Array.isArray(input?.userIds) ? input.userIds : []).map(String).filter(Boolean))].slice(0, 500);
  if (audience === "selected" && requestedUserIds.length === 0) throw new Error("Selecciona al menos un destinatario.");

  const targetView = ["dashboard", "habits", "agenda", "finance", "health", "settings"].includes(input?.targetView)
    ? input.targetView
    : "dashboard";
  const filter = audience === "all"
    ? "enabled=eq.true"
    : `enabled=eq.true&user_id=in.(${requestedUserIds.map(id => `"${id.replaceAll('"', "")}"`).join(",")})`;
  const subscriptions = await supabaseFetch(`habitflow_push_subscriptions?select=user_id,endpoint,subscription&${filter}`);
  const recipientIds = [...new Set((subscriptions || []).map((item: any) => item.user_id))];

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  const messageId = crypto.randomUUID();
  const payload = JSON.stringify({
    title,
    body,
    tag: `habitflow-creator-${messageId}`,
    renotify: true,
    requireInteraction: Boolean(input?.requireInteraction),
    data: { view: targetView, source: "creator", messageId }
  });

  let sent = 0;
  let failed = 0;
  await Promise.all((subscriptions || []).map(async (subscription: any) => {
    try {
      await webpush.sendNotification(subscription.subscription, payload, { TTL: 86400, urgency: "high" });
      sent += 1;
    } catch (error: any) {
      failed += 1;
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await deleteExpiredSubscription(subscription.endpoint);
      }
    }
  }));

  await supabaseFetch("habitflow_creator_messages", {
    method: "POST",
    body: JSON.stringify({
      id: messageId,
      creator_user_id: creatorUserId,
      audience,
      target_user_ids: audience === "all" ? [] : requestedUserIds,
      title,
      body,
      target_view: targetView,
      sent_count: sent,
      failed_count: failed
    })
  }).catch(error => console.warn("No se pudo registrar el historial del creador:", error?.message || error));

  return { ok: true, messageId, recipients: recipientIds.length, devices: subscriptions?.length || 0, sent, failed };
};

Deno.serve(async request => {
  const origin = request.headers.get("Origin");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST") return jsonResponse({ ok: false, error: "Método no permitido." }, 405, origin);

  const creator = await authenticateCreator(request);
  if (!creator.ok) return jsonResponse({ ok: false, error: creator.error }, creator.status, creator.origin);

  try {
    const input = await request.json().catch(() => ({}));
    if (input?.action === "list_users") {
      const clientList = await listClients(creator);
      return jsonResponse({
        ok: true,
        creator: { id: creator.userId, email: creator.email },
        users: clientList.users,
        sources: clientList.sources,
        message: clientList.users.length === 0
          ? "Todavía no hay usuarios registrados en Clerk, la nube o las suscripciones push."
          : ""
      }, 200, creator.origin);
    }
    if (input?.action === "send_notification") {
      const result = await sendCreatorNotification(input, creator.userId);
      return jsonResponse(result, 200, creator.origin);
    }
    return jsonResponse({ ok: false, error: "Acción no válida." }, 400, creator.origin);
  } catch (error: any) {
    console.error("HabitFlow creator notifications:", error);
    return jsonResponse({ ok: false, error: error?.message || "Error interno del servidor." }, 500, creator.origin);
  }
});
