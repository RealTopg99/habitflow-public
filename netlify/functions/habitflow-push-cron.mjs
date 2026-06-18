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

const minutesToTime = (mins) => {
  const clean = ((Math.round(mins) % 1440) + 1440) % 1440;
  const hours = Math.floor(clean / 60);
  const minutes = clean % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const daysBetweenDateStrings = (start, end) => Math.round((new Date(`${end}T12:00:00Z`).getTime() - new Date(`${start}T12:00:00Z`).getTime()) / 86400000);

const taskIntervalMinutes = (task) => {
  const mode = task?.intervalRepeat || 'none';
  if (mode === 'minute') return 1;
  if (mode === 'hour') return 60;
  if (mode === 'customHours') {
    const hours = Number(task.intervalEvery || 1);
    return Number.isFinite(hours) && hours > 0 ? Math.max(1, Math.round(hours * 60)) : 60;
  }
  return 0;
};

const generateIntervalDates = (task, fromDate, count = 31) => {
  const intervalMins = taskIntervalMinutes(task);
  if (!intervalMins || !task.dueTime) return [];
  const endDate = task.repeatUntilDate || fromDate;
  const startMins = parseTimeToMinutes(task.dueTime);
  const endMins = parseTimeToMinutes(task.repeatUntilTime || '23:59');
  if (startMins === null || endMins === null) return [];
  const endAbs = daysBetweenDateStrings(fromDate, endDate) * 1440 + endMins;
  if (endAbs < startMins) return [];
  const dates = new Set();
  for (let occurrenceAbs = startMins; occurrenceAbs <= endAbs; occurrenceAbs += intervalMins) {
    const dayOffset = Math.floor(occurrenceAbs / 1440);
    if (dayOffset >= count) break;
    dates.add(addDaysToDateString(fromDate, dayOffset));
  }
  return Array.from(dates);
};

const intervalDueSlots = (task, localNow, reminderMins) => {
  const intervalMins = taskIntervalMinutes(task);
  if (!intervalMins || !task.dueTime) return [];
  const anchorDate = task._intervalAnchorDate || task.dueDate || localNow.date;
  const startMins = parseTimeToMinutes(task.dueTime);
  if (startMins === null) return [];
  const endDate = task.repeatUntilDate || anchorDate;
  const endMins = parseTimeToMinutes(task.repeatUntilTime || '23:59');
  if (endMins === null) return [];
  const startAbs = startMins;
  const endAbs = daysBetweenDateStrings(anchorDate, endDate) * 1440 + endMins;
  const nowAbs = daysBetweenDateStrings(anchorDate, localNow.date) * 1440 + localNow.msOfDay / 60000;
  if (endAbs < startAbs || nowAbs < startAbs - reminderMins - 2 || nowAbs > endAbs + 2) return [];
  const baseIndex = Math.floor((nowAbs + reminderMins - startAbs) / intervalMins);
  const slots = [];
  for (let i = Math.max(0, baseIndex - 1); i <= baseIndex + 1; i += 1) {
    const occurrenceAbs = startAbs + i * intervalMins;
    if (occurrenceAbs < startAbs || occurrenceAbs > endAbs) continue;
    const notifyAbs = occurrenceAbs - reminderMins;
    const diff = notifyAbs * 60000 - nowAbs * 60000;
    if (diff <= 30000 && diff >= -180000) {
      const dayOffset = Math.floor(occurrenceAbs / 1440);
      const occurrenceDate = addDaysToDateString(anchorDate, dayOffset);
      const occurrenceTime = minutesToTime(occurrenceAbs);
      slots.push({ date: occurrenceDate, time: occurrenceTime, key: `${occurrenceDate}:${occurrenceTime}` });
    }
  }
  return slots;
};

const generateRecurrenceDates = (task, fromDate, count = 8) => {
  if (!task.recurrence || task.recurrence === 'none') return [];
  const dates = [];
  const start = new Date(`${fromDate}T12:00:00Z`);
  const untilDate = task.recurrenceUntilDate || '';
  for (let i = 0; i < count; i += 1) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const ds = toYYYYMMDD(d);
    if (untilDate && ds > untilDate) break;
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

const localWeekday = (dateStr) => new Date(`${dateStr}T12:00:00Z`).getUTCDay();

const isExpectedHabitDay = (habit, dateStr) => {
  if (!habit || habit.active === false) return false;
  const weekday = localWeekday(dateStr);
  if (Array.isArray(habit.frequencyDays) && habit.frequencyDays.length) {
    return habit.frequencyDays.map(Number).includes(weekday);
  }
  if (habit.frequency === 'weekdays') return weekday >= 1 && weekday <= 5;
  if (habit.frequency === 'weekends') return weekday === 0 || weekday === 6;
  return true;
};

const isHabitCompleted = (data, habitId, dateStr) =>
  (data?.records || []).some((record) => record.habitId === habitId && record.date === dateStr && record.completed);

const isDueMinute = (localNow, at) => {
  const atMinutes = parseTimeToMinutes(at);
  if (atMinutes === null) return false;
  const diff = atMinutes * 60000 - localNow.msOfDay;
  return diff <= 30000 && diff >= -180000;
};

const dueHabitRemindersForUser = (row, now) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const items = [];
  (row.data?.habits || []).forEach((habit) => {
    const reminder = habit?.reminder;
    if (habit?.active === false || !reminder?.enabled || !reminder?.time) return;
    if (!isExpectedHabitDay(habit, localNow.date) || isHabitCompleted(row.data, habit.id, localNow.date)) return;
    const reminderDays = Array.isArray(reminder.days) ? reminder.days.map(Number) : [];
    if (reminderDays.length && !reminderDays.includes(localWeekday(localNow.date))) return;
    if (!isDueMinute(localNow, reminder.time)) return;
    items.push({
      type: 'habit-reminder',
      date: localNow.date,
      deliveryKey: `${row.user_id}:habit-reminder:${habit.id}:${localNow.date}:${reminder.time}`,
      payload: {
        title: 'HabitFlow - Habito',
        body: String(reminder.message || '').trim() || `Es hora de ${habit.name}.`,
        requireInteraction: true,
        data: { view: 'habits', habitId: habit.id, date: localNow.date }
      }
    });
  });
  return items;
};

const dueTasksForUser = (row, now) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const agenda = row.data?.agenda || {};
  const due = [];
  const expanded = {};
  const pushOccurrence = (targetDate, task, anchorDate) => {
    if ((task.deletedDates || []).includes(targetDate)) return;
    if (!expanded[targetDate]) expanded[targetDate] = [];
    if (!expanded[targetDate].some((item) => item.id === task.id)) {
      expanded[targetDate].push({ ...task, dueDate: targetDate, _seriesAnchorDate: anchorDate, _intervalAnchorDate: anchorDate });
    }
  };

  Object.entries(agenda).forEach(([date, tasks]) => {
    (tasks || []).forEach((task) => {
      const anchorDate = task.dueDate || date;
      pushOccurrence(anchorDate, task, anchorDate);
      const hasIntervalRepeat = taskIntervalMinutes(task) > 0;
      if (!hasIntervalRepeat) generateRecurrenceDates(task, anchorDate).forEach((ds) => {
        pushOccurrence(ds, task, anchorDate);
      });
      if (hasIntervalRepeat) generateIntervalDates(task, anchorDate).forEach((ds) => {
        pushOccurrence(ds, task, anchorDate);
      });
    });
  });

  for (let dayOffset = -1; dayOffset <= 7; dayOffset += 1) {
    const date = addDaysToDateString(localNow.date, dayOffset);
    (expanded[date] || []).forEach((task) => {
      if (!task.alarm || !task.dueTime || task.completed) return;
      const intervalSlots = intervalDueSlots(task, localNow, reminderMinutes(task));
      if (intervalSlots.length) {
        intervalSlots.forEach((slot) => {
          due.push({
            date: slot.date,
            task,
            occurrenceTime: slot.time,
            deliveryKey: `${row.user_id}:${task.id}:interval:${slot.key}:${task.reminders?.[0] || 'exact'}`
          });
        });
        return;
      }
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

const isMedicationActiveOnDate = (med, dateStr) => {
  if (!med || med.isActive === false) return false;
  if (med.startDate && dateStr < med.startDate) return false;
  if (med.endDate && dateStr > med.endDate) return false;
  return true;
};

const isMedicationDoseTaken = (health, medicationId, date, time) =>
  (health?.takenLogs || []).some((log) => log.medicationId === medicationId && log.date === date && log.scheduledTime === time && log.status === 'taken');

const dueMedicationNotificationsForUser = (row, now) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const health = row.data?.healthData || {};
  const items = [];
  (health.medications || [])
    .filter((med) => isMedicationActiveOnDate(med, localNow.date))
    .forEach((med) => {
      (med.times || []).forEach((time) => {
        if (isMedicationDoseTaken(health, med.id, localNow.date, time)) return;
        const dueMinutes = parseTimeToMinutes(time);
        if (dueMinutes === null) return;
        const diff = dueMinutes * 60000 - localNow.msOfDay;
        if (diff > 30000 || diff < -180000) return;
        items.push({
          type: 'health',
          date: localNow.date,
          deliveryKey: `${row.user_id}:health:${med.id}:${localNow.date}:${time}`,
          payload: {
            title: 'HabitFlow - Salud',
            body: `${med.name || 'Medicamento'} - ${med.dose || 'dosis'}\nEs hora - ${time}${med.instructions ? ` - ${med.instructions}` : ''}`,
            requireInteraction: true,
            data: { view: 'health', medicationId: med.id, date: localNow.date }
          }
        });
      });
    });
  return items;
};

const normalizeCurrency = (value) => String(value || '').toUpperCase() === 'COP' ? 'COP' : 'USD';

const convertFinanceAmount = (amount, fromCurrency, toCurrency, copRate) => {
  if (fromCurrency === toCurrency) return amount;
  if (fromCurrency === 'COP' && toCurrency === 'USD') return amount / copRate;
  if (fromCurrency === 'USD' && toCurrency === 'COP') return amount * copRate;
  return amount;
};

const formatFinanceAmount = (amount, currency, copRate) => {
  const normalized = normalizeCurrency(currency);
  if (normalized === 'COP') {
    return `$ ${Math.round(amount).toLocaleString('es-CO')} COP`;
  }
  return `$ ${Number(amount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD`;
};

const dueDebtNotificationsForUser = (row, now) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const finance = row.data?.financeData || {};
  const copRate = Math.max(1, Number(finance.copRate || 4000));
  const tags = finance.accountTags || [];
  const transactions = finance.transactions || [];
  const items = [];

  (finance.accounts || []).forEach((account) => {
    if (!account?.debtDueDate || account.debtReminderEnabled === false) return;
    const tagGroup = tags.find((tag) => tag.id === account.tagId)?.group || account.type;
    const isDebt = tagGroup === 'loan' || account.type === 'loan' || String(account.id || '').startsWith('debt_') || Number(account.balance || 0) < 0;
    if (!isDebt) return;

    const dueDate = String(account.debtDueDate || '');
    const reminderDays = Math.max(0, Number(account.debtReminderDaysBefore || 0));
    const reminderStart = addDaysToDateString(dueDate, -reminderDays);
    if (localNow.date < reminderStart || localNow.date > dueDate) return;

    const accountCurrency = normalizeCurrency(account.currency || finance.currency || 'USD');
    const movement = transactions
      .filter((transaction) => (transaction.accountId || '') === account.id)
      .reduce((sum, transaction) => {
        const amount = Math.abs(Number(transaction.amount || 0));
        const transactionCurrency = normalizeCurrency(transaction.currency || accountCurrency);
        const converted = convertFinanceAmount(amount, transactionCurrency, accountCurrency, copRate);
        return sum + (transaction.type === 'income' ? converted : -converted);
      }, 0);
    const pending = Math.max(0, Math.abs(Number(account.balance || 0) + movement));
    if (pending <= 0) return;

    const minimumPayment = Math.max(0, Number(account.debtMinimumPayment || pending * 0.08));
    items.push({
      type: 'finance-debt',
      date: localNow.date,
      deliveryKey: `${row.user_id}:finance-debt:${account.id}:${localNow.date}:${dueDate}`,
      payload: {
        title: 'HabitFlow - Pago de deuda',
        body: `${account.name || 'Deuda'}\nCuota minima: ${formatFinanceAmount(minimumPayment, accountCurrency, copRate)}\nPago oportuno: ${dueDate}`,
        requireInteraction: true,
        data: { view: 'finance', section: 'debts', debtId: account.id, date: localNow.date }
      }
    });
  });

  return items;
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
  const taskTitle = item.task?.text || 'Recordatorio';
  const displayTime = item.occurrenceTime || item.task?.dueTime;
  const intervalText = item.occurrenceTime ? 'Repeticion activa' : reminderLabel(item.task);
  const details = item.task ? `${intervalText} - ${displayTime}${item.task.category ? ` - ${item.task.category}` : ''}` : '';
  const notification = item.payload || {
    title: 'HabitFlow - Agenda',
    body: `${taskTitle}\n${details}`,
    requireInteraction: true,
    data: { view: 'agenda', taskId: item.task?.id, date: item.date }
  };
  const payload = JSON.stringify({
    title: notification.title,
    body: notification.body,
    tag: item.deliveryKey,
    renotify: true,
    requireInteraction: notification.requireInteraction ?? true,
    data: notification.data || { view: 'dashboard' }
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
    const dueItems = [
      ...dueTasksForUser(user, now),
      ...dueMedicationNotificationsForUser(user, now),
      ...dueDebtNotificationsForUser(user, now),
      ...dueHabitRemindersForUser(user, now)
    ];
    for (const item of dueItems) {
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
