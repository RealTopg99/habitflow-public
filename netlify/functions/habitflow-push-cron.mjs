import webpush from 'web-push';

export const config = {
  schedule: '* * * * *'
};

const SUPABASE_URL = process.env.HABITFLOW_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.HABITFLOW_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const VAPID_PUBLIC_KEY = process.env.HABITFLOW_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.HABITFLOW_VAPID_PRIVATE_KEY || process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.HABITFLOW_VAPID_SUBJECT || process.env.VAPID_SUBJECT || 'mailto:admin@habitflow.app';
const DEFAULT_TIME_ZONE = process.env.HABITFLOW_TIME_ZONE || 'America/Bogota';

const supabaseFetch = async (path, options = {}) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase ${response.status}: ${text}`);
  }
  if (response.status === 204) return null;
  return response.json();
};

const toYYYYMMDD = (date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const addDaysToDateString = (dateStr, days) => {
  const date = new Date(`${dateStr}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toYYYYMMDD(date);
};

const getZonedNow = (now, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(now).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
  const hour = Number(parts.hour === '24' ? '00' : parts.hour);
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    msOfDay: ((hour * 60 + Number(parts.minute)) * 60 + Number(parts.second)) * 1000
  };
};

const parseTimeToMinutes = (value) => {
  const [hours, minutes] = String(value || '').split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
};

const generateRecurrenceDates = (task, fromDate, count = 8) => {
  if (!task.recurrence || task.recurrence === 'none') return [];
  const dates = [];
  const start = new Date(`${fromDate}T12:00:00Z`);
  for (let i = 0; i < count; i += 1) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const ds = toYYYYMMDD(d);
    const day = d.getUTCDay();
    if (task.recurrence === 'daily') dates.push(ds);
    else if (task.recurrence === 'weekdays' && day >= 1 && day <= 5) dates.push(ds);
    else if (task.recurrence === 'weekends' && (day === 0 || day === 6)) dates.push(ds);
    else if (task.recurrence === 'weekly' && day === start.getUTCDay()) dates.push(ds);
    else if (task.recurrence === 'biweekly' && day === start.getUTCDay() && i % 14 === 0) dates.push(ds);
    else if (task.recurrence === 'monthly' && d.getUTCDate() === start.getUTCDate()) dates.push(ds);
    else if (task.recurrence === 'yearly' && d.getUTCMonth() === start.getUTCMonth() && d.getUTCDate() === start.getUTCDate()) dates.push(ds);
    else if (task.recurrence === 'custom' && task.recurrenceDays?.includes(day)) dates.push(ds);
  }
  return dates;
};

const reminderMinutes = (task) => {
  const reminder = task.reminders?.[0] || 'exact';
  return ({ exact: 0, '5min': 5, '10min': 10, '15min': 15, '30min': 30, '1hour': 60, '1day': 1440 })[reminder] || 0;
};

const reminderLabel = (task) => {
  const reminder = task.reminders?.[0] || 'exact';
  return ({
    exact: 'Es hora',
    '5min': 'Faltan 5 minutos',
    '10min': 'Faltan 10 minutos',
    '15min': 'Faltan 15 minutos',
    '30min': 'Faltan 30 minutos',
    '1hour': 'Falta 1 hora',
    '1day': 'Falta 1 dia'
  })[reminder] || 'Recordatorio';
};

const dueTasksForUser = (row, now) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const agenda = row.data?.agenda || {};
  const due = [];
  const expanded = {};

  Object.entries(agenda).forEach(([date, tasks]) => {
    (tasks || []).forEach((task) => {
      if (!expanded[date]) expanded[date] = [];
      expanded[date].push(task);
      generateRecurrenceDates(task, task.dueDate || date).forEach((ds) => {
        if (ds !== (task.dueDate || date)) {
          if (!expanded[ds]) expanded[ds] = [];
          expanded[ds].push({ ...task, dueDate: ds });
        }
      });
    });
  });

  for (let dayOffset = -1; dayOffset <= 7; dayOffset += 1) {
    const date = addDaysToDateString(localNow.date, dayOffset);
    (expanded[date] || []).forEach((task) => {
      if (!task.alarm || !task.dueTime || task.completed) return;
      const dueMinutes = parseTimeToMinutes(task.dueTime);
      if (dueMinutes === null) return;
      let notifyDate = date;
      let notifyMinutes = dueMinutes - reminderMinutes(task);
      while (notifyMinutes < 0) {
        notifyDate = addDaysToDateString(notifyDate, -1);
        notifyMinutes += 1440;
      }
      while (notifyMinutes >= 1440) {
        notifyDate = addDaysToDateString(notifyDate, 1);
        notifyMinutes -= 1440;
      }
      if (notifyDate !== localNow.date) return;
      const diff = notifyMinutes * 60000 - localNow.msOfDay;
      if (diff <= 30000 && diff >= -180000) {
        due.push({ date, task, deliveryKey: `${row.user_id}:${task.id}:${date}:${task.dueTime}:${task.reminders?.[0] || 'exact'}` });
      }
    });
  }
  return due;
};

const markDelivery = async (deliveryKey, userId) => {
  try {
    const existing = await supabaseFetch(`habitflow_push_deliveries?select=delivery_key&delivery_key=eq.${encodeURIComponent(deliveryKey)}&limit=1`);
    if (existing?.length) return false;
    await supabaseFetch('habitflow_push_deliveries', {
      method: 'POST',
      body: JSON.stringify({ delivery_key: deliveryKey, user_id: userId })
    });
    return true;
  } catch (error) {
    console.error('Could not mark delivery', error);
    return false;
  }
};

const sendPush = async (subscription, item) => {
  const taskTitle = item.task.text || 'Recordatorio';
  const details = `${reminderLabel(item.task)} · ${item.task.dueTime}${item.task.category ? ` · ${item.task.category}` : ''}`;
  const payload = JSON.stringify({
    title: 'HabitFlow • Agenda',
    body: `${taskTitle}\n${details}`,
    tag: item.deliveryKey,
    renotify: true,
    requireInteraction: true,
    data: { view: 'agenda', taskId: item.task.id, date: item.date }
  });
  await webpush.sendNotification(subscription.subscription, payload, { TTL: 120, urgency: 'high' });
};

export default async () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.error('Missing push environment variables');
    return new Response('Missing push environment variables', { status: 500 });
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const now = new Date();
  const [users, subscriptions] = await Promise.all([
    supabaseFetch('habitflow_user_data?select=user_id,data'),
    supabaseFetch('habitflow_push_subscriptions?select=user_id,endpoint,subscription&enabled=eq.true')
  ]);
  const subscriptionsByUser = new Map();
  (subscriptions || []).forEach((subscription) => {
    if (!subscriptionsByUser.has(subscription.user_id)) subscriptionsByUser.set(subscription.user_id, []);
    subscriptionsByUser.get(subscription.user_id).push(subscription);
  });

  let sent = 0;
  let dueCount = 0;
  for (const user of users || []) {
    const userSubscriptions = subscriptionsByUser.get(user.user_id) || [];
    if (!userSubscriptions.length) continue;
    for (const item of dueTasksForUser(user, now)) {
      dueCount += 1;
      const inserted = await markDelivery(item.deliveryKey, user.user_id);
      if (!inserted) continue;
      for (const subscription of userSubscriptions) {
        try {
          await sendPush(subscription, item);
          sent += 1;
        } catch (error) {
          console.error('Push failed', error);
          if (error?.statusCode === 404 || error?.statusCode === 410) {
            await supabaseFetch(`habitflow_push_subscriptions?endpoint=eq.${encodeURIComponent(subscription.endpoint)}`, { method: 'DELETE' }).catch(() => null);
          }
        }
      }
    }
  }
  console.log(`HabitFlow push cron checked users=${users?.length || 0} subscriptions=${subscriptions?.length || 0} due=${dueCount} sent=${sent}`);
  return new Response(JSON.stringify({ ok: true, sent, due: dueCount }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
