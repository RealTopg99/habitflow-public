import webpush from "npm:web-push@3.6.7";

const DEFAULT_TIME_ZONE = Deno.env.get("HABITFLOW_TIME_ZONE") || "America/Bogota";
const SUPABASE_URL = Deno.env.get("HABITFLOW_SUPABASE_URL") || Deno.env.get("SUPABASE_URL") || "";
const VAPID_PUBLIC_KEY = Deno.env.get("HABITFLOW_VAPID_PUBLIC_KEY") || "";
const VAPID_PRIVATE_KEY = Deno.env.get("HABITFLOW_VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT = Deno.env.get("HABITFLOW_VAPID_SUBJECT") || "mailto:ventasdeeproots09@gmail.com";

const getServiceRoleKey = () => {
  const direct = Deno.env.get("HABITFLOW_SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (direct) return direct;
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    return keys.service_role || keys.service_role_key || keys.secret || Object.values(keys)[0] || "";
  } catch {
    return "";
  }
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });

const supabaseFetch = async (path: string, options: RequestInit = {}) => {
  const serviceRoleKey = getServiceRoleKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase ${response.status}: ${text}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const toYYYYMMDD = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const addDaysToDateString = (dateStr: string, days: number) => {
  const date = new Date(`${dateStr}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toYYYYMMDD(date);
};

const getZonedNow = (now: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(now).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {} as Record<string, string>);

  const hour = Number(parts.hour === "24" ? "00" : parts.hour);
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    msOfDay: ((hour * 60 + Number(parts.minute)) * 60 + Number(parts.second)) * 1000
  };
};

const parseTimeToMinutes = (value: unknown) => {
  const [hours, minutes] = String(value || "").split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
};

const minutesToTime = (mins: number) => {
  const clean = ((Math.round(mins) % 1440) + 1440) % 1440;
  const hours = Math.floor(clean / 60);
  const minutes = clean % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const daysBetweenDateStrings = (start: string, end: string) => Math.round((new Date(`${end}T12:00:00Z`).getTime() - new Date(`${start}T12:00:00Z`).getTime()) / 86400000);

const taskIntervalMinutes = (task: any) => {
  const mode = task?.intervalRepeat || "none";
  if (mode === "minute") return 1;
  if (mode === "hour") return 60;
  if (mode === "customHours") {
    const hours = Number(task.intervalEvery || 1);
    return Number.isFinite(hours) && hours > 0 ? Math.max(1, Math.round(hours * 60)) : 60;
  }
  return 0;
};

const generateIntervalDates = (task: any, fromDate: string, count = 31) => {
  const intervalMins = taskIntervalMinutes(task);
  if (!intervalMins || !task.dueTime) return [];
  const endDate = task.repeatUntilDate || fromDate;
  const startMins = parseTimeToMinutes(task.dueTime);
  const endMins = parseTimeToMinutes(task.repeatUntilTime || "23:59");
  if (startMins === null || endMins === null) return [];
  const endAbs = daysBetweenDateStrings(fromDate, endDate) * 1440 + endMins;
  if (endAbs < startMins) return [];
  const dates = new Set<string>();
  for (let occurrenceAbs = startMins; occurrenceAbs <= endAbs; occurrenceAbs += intervalMins) {
    const dayOffset = Math.floor(occurrenceAbs / 1440);
    if (dayOffset >= count) break;
    dates.add(addDaysToDateString(fromDate, dayOffset));
  }
  return Array.from(dates);
};

const intervalDueSlots = (task: any, localNow: { date: string; msOfDay: number }, reminderMins: number) => {
  const intervalMins = taskIntervalMinutes(task);
  if (!intervalMins || !task.dueTime) return [];
  const anchorDate = task._intervalAnchorDate || task.dueDate || localNow.date;
  const startMins = parseTimeToMinutes(task.dueTime);
  if (startMins === null) return [];
  const endDate = task.repeatUntilDate || anchorDate;
  const endMins = parseTimeToMinutes(task.repeatUntilTime || "23:59");
  if (endMins === null) return [];
  const startAbs = startMins;
  const endAbs = daysBetweenDateStrings(anchorDate, endDate) * 1440 + endMins;
  const nowAbs = daysBetweenDateStrings(anchorDate, localNow.date) * 1440 + localNow.msOfDay / 60000;
  if (endAbs < startAbs || nowAbs < startAbs - reminderMins - 2 || nowAbs > endAbs + 2) return [];
  const baseIndex = Math.floor((nowAbs + reminderMins - startAbs) / intervalMins);
  const slots: any[] = [];
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

const generateRecurrenceDates = (task: any, fromDate: string, count = 8) => {
  if (!task.recurrence || task.recurrence === "none") return [];
  const dates: string[] = [];
  const start = new Date(`${fromDate}T12:00:00Z`);
  const untilDate = task.recurrenceUntilDate || "";
  for (let i = 0; i < count; i += 1) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const ds = toYYYYMMDD(d);
    if (untilDate && ds > untilDate) break;
    const day = d.getUTCDay();
    if (task.recurrence === "daily") dates.push(ds);
    else if (task.recurrence === "weekdays" && day >= 1 && day <= 5) dates.push(ds);
    else if (task.recurrence === "weekends" && (day === 0 || day === 6)) dates.push(ds);
    else if (task.recurrence === "weekly" && day === start.getUTCDay()) dates.push(ds);
    else if (task.recurrence === "biweekly" && day === start.getUTCDay() && i % 14 === 0) dates.push(ds);
    else if (task.recurrence === "monthly" && d.getUTCDate() === start.getUTCDate()) dates.push(ds);
    else if (task.recurrence === "yearly" && d.getUTCMonth() === start.getUTCMonth() && d.getUTCDate() === start.getUTCDate()) dates.push(ds);
    else if (task.recurrence === "custom" && task.recurrenceDays?.includes(day)) dates.push(ds);
  }
  return dates;
};

const reminderMinutes = (task: any) => {
  const reminder = task.reminders?.[0] || "exact";
  return ({ exact: 0, "5min": 5, "10min": 10, "15min": 15, "30min": 30, "1hour": 60, "1day": 1440 } as Record<string, number>)[reminder] || 0;
};

const reminderLabel = (task: any) => {
  const reminder = task.reminders?.[0] || "exact";
  return ({
    exact: "Es hora",
    "5min": "Faltan 5 minutos",
    "10min": "Faltan 10 minutos",
    "15min": "Faltan 15 minutos",
    "30min": "Faltan 30 minutos",
    "1hour": "Falta 1 hora",
    "1day": "Falta 1 dia"
  } as Record<string, string>)[reminder] || "Recordatorio";
};

const localWeekday = (dateStr: string) => new Date(`${dateStr}T12:00:00Z`).getUTCDay();

const isExpectedHabitDay = (habit: any, dateStr: string) => {
  if (!habit || habit.active === false) return false;
  if (!habit.frequency || habit.frequency === "Diario") return true;
  const day = localWeekday(dateStr);
  if (habit.frequency === "Lun-Vie") return day >= 1 && day <= 5;
  if (habit.frequency === "Fines de semana") return day === 0 || day === 6;
  if (habit.frequency === "Personalizado" && Array.isArray(habit.frequencyDays)) {
    return habit.frequencyDays.includes(day);
  }
  return true;
};

const habitProgressForDate = (data: any, dateStr: string) => {
  const habits = (data?.habits || []).filter((habit: any) => isExpectedHabitDay(habit, dateStr));
  const records = data?.records || [];
  const completedIds = new Set(
    records
      .filter((record: any) => record.date === dateStr && record.completed)
      .map((record: any) => record.habitId)
  );
  const completed = habits.filter((habit: any) => completedIds.has(habit.id));
  const pending = habits.filter((habit: any) => !completedIds.has(habit.id));
  return { total: habits.length, completed: completed.length, pending };
};

const isHabitCompleted = (data: any, habitId: string, dateStr: string) =>
  (data?.records || []).some((record: any) => record.habitId === habitId && record.date === dateStr && record.completed);

const habitStreakBeforeDate = (data: any, habit: any, dateStr: string) => {
  let streak = 0;
  let cursor = addDaysToDateString(dateStr, -1);
  for (let i = 0; i < 365; i += 1) {
    if (!isExpectedHabitDay(habit, cursor)) {
      cursor = addDaysToDateString(cursor, -1);
      continue;
    }
    if (isHabitCompleted(data, habit.id, cursor)) {
      streak += 1;
      cursor = addDaysToDateString(cursor, -1);
      continue;
    }
    break;
  }
  return streak;
};

const weeklyHabitStats = (data: any, today: string) => {
  let total = 0;
  let completed = 0;
  for (let i = 0; i < 7; i += 1) {
    const dateStr = addDaysToDateString(today, -i);
    const progress = habitProgressForDate(data, dateStr);
    total += progress.total;
    completed += progress.completed;
  }
  return { total, completed, pct: total ? Math.round((completed / total) * 100) : 0 };
};

const isDueMinute = (localNow: { msOfDay: number }, at: string) => {
  const atMinutes = parseTimeToMinutes(at);
  if (atMinutes === null) return false;
  const diff = atMinutes * 60000 - localNow.msOfDay;
  return diff <= 30000 && diff >= -180000;
};

const singularPlural = (count: number, singular: string, plural: string) => count === 1 ? singular : plural;

const dueHabitNotificationsForUser = (row: any, now: Date) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const progress = habitProgressForDate(row.data, localNow.date);
  if (!progress.total) return [];

  const remaining = progress.pending.length;
  const firstPending = progress.pending[0]?.name || "tu siguiente habito";
  const items: any[] = [];
  const pushHabitItem = (slot: string, title: string, body: string, requireInteraction = false) => {
    items.push({
      type: "habit",
      date: localNow.date,
      deliveryKey: `${row.user_id}:habit:${localNow.date}:${slot}`,
      payload: {
        title,
        body,
        requireInteraction,
        data: { view: "habits", date: localNow.date }
      }
    });
  };

  (row.data?.habits || []).forEach((habit: any) => {
    const reminder = habit?.reminder;
    if (habit?.active === false || !reminder?.enabled || !reminder?.time) return;
    if (!isExpectedHabitDay(habit, localNow.date) || isHabitCompleted(row.data, habit.id, localNow.date)) return;
    const reminderDays = Array.isArray(reminder.days) ? reminder.days.map(Number) : [];
    if (reminderDays.length && !reminderDays.includes(localWeekday(localNow.date))) return;
    if (!isDueMinute(localNow, reminder.time)) return;
    items.push({
      type: "habit-reminder",
      date: localNow.date,
      deliveryKey: `${row.user_id}:habit-reminder:${habit.id}:${localNow.date}:${reminder.time}`,
      payload: {
        title: "HabitFlow - Habito",
        body: String(reminder.message || "").trim() || `Es hora de ${habit.name}.`,
        requireInteraction: true,
        data: { view: "habits", habitId: habit.id, date: localNow.date }
      }
    });
  });

  if (isDueMinute(localNow, "08:30") && remaining > 0) {
    pushHabitItem(
      "morning-plan",
      "HabitFlow - Disciplina",
      `Hoy tienes ${remaining} ${singularPlural(remaining, "habito pendiente", "habitos pendientes")}.\nEmpieza por: ${firstPending}.`
    );
  }

  if (isDueMinute(localNow, "13:00") && remaining > 0) {
    pushHabitItem(
      "midday-check",
      "HabitFlow - Checkpoint",
      `Vas ${progress.completed}/${progress.total} hoy.\nTe faltan ${remaining}. Un paso pequeno ahora cuenta.`
    );
  }

  if (isDueMinute(localNow, "17:00") && remaining > 0) {
    pushHabitItem(
      "evening-push",
      "HabitFlow - Empuje final",
      `Todavia faltan ${remaining} ${singularPlural(remaining, "habito", "habitos")}.\nNo negocies con tu version cansada.`
    );
  }

  if (isDueMinute(localNow, "20:30") && remaining > 0) {
    pushHabitItem(
      "night-close",
      "HabitFlow - Cierre del dia",
      `Ultima ventana: ${remaining} pendiente${remaining === 1 ? "" : "s"}.\nHazlo simple, pero hazlo.`,
      true
    );
  }

  if (isDueMinute(localNow, "21:15") && remaining === 0) {
    pushHabitItem(
      "perfect-day",
      "HabitFlow - Dia perfecto",
      `Completaste ${progress.completed}/${progress.total} habitos.\nAsi se construye una identidad.`,
      true
    );
  }

  const motivationalMessages = [
    "La disciplina no pide ganas. Pide una accion pequena repetida.",
    "Hoy no necesitas hacerlo perfecto. Necesitas no romper la cadena.",
    "Tu futuro se negocia en minutos pequenos como este.",
    "Si esta pendiente, bajale el tamano y haz la primera version.",
    "Una marca hecha hoy pesa mas que una promesa para manana."
  ];
  const motivationIndex = (Number(localNow.date.replaceAll("-", "")) + Math.floor(localNow.msOfDay / 3600000)) % motivationalMessages.length;

  if (isDueMinute(localNow, "10:30") && remaining > 0) {
    pushHabitItem("motivation-am", "HabitFlow - Mentalidad", motivationalMessages[motivationIndex]);
  }

  if (isDueMinute(localNow, "18:30") && remaining > 0) {
    pushHabitItem("motivation-pm", "HabitFlow - Constancia", motivationalMessages[(motivationIndex + 2) % motivationalMessages.length]);
  }

  return items;
};

const expandedAgendaForUser = (data: any) => {
  const agenda = data?.agenda || {};
  const expanded: Record<string, any[]> = {};
  const pushOccurrence = (targetDate: string, task: any, anchorDate: string) => {
    if ((task.deletedDates || []).includes(targetDate)) return;
    if (!expanded[targetDate]) expanded[targetDate] = [];
    if (!expanded[targetDate].some((item: any) => item.id === task.id)) {
      expanded[targetDate].push({ ...task, dueDate: targetDate, _seriesAnchorDate: anchorDate, _intervalAnchorDate: anchorDate });
    }
  };
  Object.entries(agenda).forEach(([date, tasks]) => {
    (tasks as any[] || []).forEach((task) => {
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
  return expanded;
};

const dueAgendaCoachNotificationsForUser = (row: any, now: Date) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const expanded = expandedAgendaForUser(row.data);
  const todayTasks = (expanded[localNow.date] || []).filter((task: any) => !task.completed);
  const tomorrow = addDaysToDateString(localNow.date, 1);
  const tomorrowTasks = (expanded[tomorrow] || []).filter((task: any) => !task.completed);
  const nowMinutes = Math.floor(localNow.msOfDay / 60000);
  const overdue = todayTasks.filter((task: any) => {
    const dueMinutes = parseTimeToMinutes(task.dueTime);
    return dueMinutes !== null && dueMinutes + 10 < nowMinutes;
  });
  const items: any[] = [];
  const pushItem = (slot: string, title: string, body: string, view = "agenda", requireInteraction = false) => {
    items.push({
      type: "coach",
      date: localNow.date,
      deliveryKey: `${row.user_id}:coach:${localNow.date}:${slot}`,
      payload: { title, body, requireInteraction, data: { view, date: localNow.date } }
    });
  };

  if (isDueMinute(localNow, "07:45") && todayTasks.length > 0) {
    const timed = todayTasks.filter((task: any) => task.dueTime).sort((a: any, b: any) => String(a.dueTime).localeCompare(String(b.dueTime)));
    const first = timed[0] || todayTasks[0];
    pushItem(
      "daily-agenda-preview",
      "HabitFlow - Tu dia",
      `Tienes ${todayTasks.length} ${singularPlural(todayTasks.length, "tarea", "tareas")} para hoy.\nPrimera clave: ${first?.text || "revisar tu agenda"}.`
    );
  }

  if (isDueMinute(localNow, "12:30") && overdue.length >= 3) {
    pushItem(
      "overdue-cluster",
      "HabitFlow - Reordena",
      `Hay ${overdue.length} tareas atrasadas.\nElige una, terminala o muevela a otro momento.`,
      "agenda",
      true
    );
  }

  if (isDueMinute(localNow, "16:15") && todayTasks.length > 0) {
    pushItem(
      "late-afternoon-agenda",
      "HabitFlow - Segundo aire",
      `Quedan ${todayTasks.length} ${singularPlural(todayTasks.length, "tarea", "tareas")} en tu agenda.\nCierra lo importante antes de la noche.`
    );
  }

  if (isDueMinute(localNow, "21:45")) {
    pushItem(
      "tomorrow-plan",
      "HabitFlow - Plan de manana",
      tomorrowTasks.length
        ? `Manana ya tienes ${tomorrowTasks.length} ${singularPlural(tomorrowTasks.length, "tarea", "tareas")}.\nRevisa si falta preparar algo.`
        : "Deja manana preparado en 2 minutos.\nUna tarea clara vale mas que una lista mental.",
      "agenda"
    );
  }

  return items;
};

const dueStreakCoachNotificationsForUser = (row: any, now: Date) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  if (!isDueMinute(localNow, "19:30")) return [];

  const progress = habitProgressForDate(row.data, localNow.date);
  if (!progress.pending.length) return [];

  const risks = progress.pending
    .map((habit: any) => ({ habit, streak: habitStreakBeforeDate(row.data, habit, localNow.date) }))
    .filter((item: any) => item.streak >= 3)
    .sort((a: any, b: any) => b.streak - a.streak);

  if (!risks.length) return [];

  const top = risks[0];
  return [{
    type: "coach",
    date: localNow.date,
    deliveryKey: `${row.user_id}:coach:${localNow.date}:streak-rescue:${top.habit.id}`,
    payload: {
      title: "HabitFlow - Protege tu racha",
      body: `${top.habit.name}: ${top.streak} dias en juego.\nHazlo pequeno, pero no rompas la cadena.`,
      requireInteraction: true,
      data: { view: "habits", date: localNow.date, habitId: top.habit.id }
    }
  }];
};

const dueWeeklyReviewNotificationsForUser = (row: any, now: Date) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const day = localWeekday(localNow.date);
  if (day !== 0 || !isDueMinute(localNow, "19:00")) return [];
  const stats = weeklyHabitStats(row.data, localNow.date);
  if (!stats.total) return [];
  return [{
    type: "coach",
    date: localNow.date,
    deliveryKey: `${row.user_id}:coach:${localNow.date}:weekly-review`,
    payload: {
      title: "HabitFlow - Revision semanal",
      body: `Esta semana: ${stats.completed}/${stats.total} habitos (${stats.pct}%).\nAjusta una cosa para subir de nivel manana.`,
      requireInteraction: false,
      data: { view: "stats", date: localNow.date }
    }
  }];
};

const dueTasksForUser = (row: any, now: Date) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const agenda = row.data?.agenda || {};
  const due: any[] = [];
  const expanded: Record<string, any[]> = {};
  const pushOccurrence = (targetDate: string, task: any, anchorDate: string) => {
    if ((task.deletedDates || []).includes(targetDate)) return;
    if (!expanded[targetDate]) expanded[targetDate] = [];
    if (!expanded[targetDate].some((item: any) => item.id === task.id)) {
      expanded[targetDate].push({ ...task, dueDate: targetDate, _seriesAnchorDate: anchorDate, _intervalAnchorDate: anchorDate });
    }
  };

  Object.entries(agenda).forEach(([date, tasks]) => {
    (tasks as any[] || []).forEach((task) => {
      const anchorDate = task.dueDate || date;
      const hasIntervalRepeat = taskIntervalMinutes(task) > 0;
      pushOccurrence(anchorDate, task, anchorDate);
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
            type: "agenda",
            date: slot.date,
            task,
            occurrenceTime: slot.time,
            deliveryKey: `${row.user_id}:${task.id}:interval:${slot.key}:${task.reminders?.[0] || "exact"}`
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
        due.push({
          type: "agenda",
          date,
          task,
          deliveryKey: `${row.user_id}:${task.id}:${date}:${task.dueTime}:${task.reminders?.[0] || "exact"}`
        });
      }
    });
  }
  return due;
};

const isMedicationActiveOnDate = (med: any, dateStr: string) => {
  if (!med || med.isActive === false) return false;
  if (med.startDate && dateStr < med.startDate) return false;
  if (med.endDate && dateStr > med.endDate) return false;
  return true;
};

const isMedicationDoseTaken = (health: any, medicationId: string, date: string, time: string) =>
  (health?.takenLogs || []).some((log: any) => log.medicationId === medicationId && log.date === date && log.scheduledTime === time && log.status === "taken");

const dueMedicationNotificationsForUser = (row: any, now: Date) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const health = row.data?.healthData || {};
  const items: any[] = [];

  (health.medications || [])
    .filter((med: any) => isMedicationActiveOnDate(med, localNow.date))
    .forEach((med: any) => {
      (med.times || []).forEach((time: string) => {
        if (isMedicationDoseTaken(health, med.id, localNow.date, time)) return;
        const dueMinutes = parseTimeToMinutes(time);
        if (dueMinutes === null) return;
        const diff = dueMinutes * 60000 - localNow.msOfDay;
        if (diff > 30000 || diff < -180000) return;
        items.push({
          type: "health",
          date: localNow.date,
          deliveryKey: `${row.user_id}:health:${med.id}:${localNow.date}:${time}`,
          payload: {
            title: "HabitFlow - Salud",
            body: `${med.name || "Medicamento"} - ${med.dose || "dosis"}\nEs hora - ${time}${med.instructions ? ` - ${med.instructions}` : ""}`,
            requireInteraction: true,
            data: { view: "health", medicationId: med.id, date: localNow.date }
          }
        });
      });
    });

  return items;
};

const normalizeCurrency = (value: unknown) => String(value || "").toUpperCase() === "COP" ? "COP" : "USD";

const convertFinanceAmount = (amount: number, fromCurrency: string, toCurrency: string, copRate: number) => {
  if (fromCurrency === toCurrency) return amount;
  if (fromCurrency === "COP" && toCurrency === "USD") return amount / copRate;
  if (fromCurrency === "USD" && toCurrency === "COP") return amount * copRate;
  return amount;
};

const formatFinanceAmount = (amount: number, currency: string, copRate: number) => {
  const normalized = normalizeCurrency(currency);
  if (normalized === "COP") {
    return `$ ${Math.round(amount).toLocaleString("es-CO")} COP`;
  }
  return `$ ${Number(amount || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} USD`;
};

const dueDebtNotificationsForUser = (row: any, now: Date) => {
  const timeZone = row.data?.user?.timezone || DEFAULT_TIME_ZONE;
  const localNow = getZonedNow(now, timeZone);
  const finance = row.data?.financeData || {};
  const copRate = Math.max(1, Number(finance.copRate || 4000));
  const transactions = finance.transactions || [];
  const items: any[] = [];

  (finance.debts || []).forEach((debt: any) => {
    if (!debt?.dueDate || debt.reminderEnabled === false) return;
    const dueDate = String(debt.dueDate || "");
    const reminderDays = Math.max(0, Number(debt.reminderDaysBefore || 0));
    const reminderStart = addDaysToDateString(dueDate, -reminderDays);
    if (localNow.date < reminderStart || localNow.date > dueDate) return;

    const debtCurrency = normalizeCurrency(debt.currency || finance.currency || "USD");
    const paid = transactions
      .filter((transaction: any) => transaction.type === "debt_payment" && (transaction.debtId || transaction.debtAccountId) === debt.id)
      .reduce((sum: number, transaction: any) => sum + Math.abs(Number(transaction.amount || 0)), 0);
    const pending = Math.max(0, Number(debt.total || 0) - paid);
    if (pending <= 0) return;

    const minimumPayment = Math.max(0, Number(debt.minimumPayment || pending * 0.08));
    const displayMinimum = convertFinanceAmount(minimumPayment, "USD", debtCurrency, copRate);
    items.push({
      type: "finance-debt",
      date: localNow.date,
      deliveryKey: `${row.user_id}:finance-debt:${debt.id}:${localNow.date}:${dueDate}`,
      payload: {
        title: "HabitFlow - Pago de deuda",
        body: `${debt.name || "Deuda"}\nCuota minima: ${formatFinanceAmount(displayMinimum, debtCurrency, copRate)}\nPago oportuno: ${dueDate}`,
        requireInteraction: true,
        data: { view: "finance", section: "debts", debtId: debt.id, date: localNow.date }
      }
    });
  });

  return items;
};

const markDelivery = async (deliveryKey: string, userId: string) => {
  try {
    const existing = await supabaseFetch(`habitflow_push_deliveries?select=delivery_key&delivery_key=eq.${encodeURIComponent(deliveryKey)}&limit=1`);
    if (existing?.length) return false;
    await supabaseFetch("habitflow_push_deliveries", {
      method: "POST",
      body: JSON.stringify({ delivery_key: deliveryKey, user_id: userId })
    });
    return true;
  } catch (error) {
    console.error("Could not mark delivery", error);
    return false;
  }
};

const sendPush = async (subscription: any, item: any) => {
  const taskTitle = item.task?.text || "Recordatorio";
  const displayTime = item.occurrenceTime || item.task?.dueTime;
  const intervalText = item.occurrenceTime ? "Repeticion activa" : reminderLabel(item.task);
  const details = item.task ? `${intervalText} - ${displayTime}${item.task.category ? ` - ${item.task.category}` : ""}` : "";
  const notification = item.payload || {
    title: "HabitFlow - Agenda",
    body: `${taskTitle}\n${details}`,
    requireInteraction: true,
    data: { view: "agenda", taskId: item.task?.id, date: item.date }
  };
  const payload = JSON.stringify({
    title: notification.title,
    body: notification.body,
    tag: item.deliveryKey,
    renotify: true,
    requireInteraction: notification.requireInteraction ?? true,
    data: notification.data || { view: "dashboard" }
  });
  await webpush.sendNotification(subscription.subscription, payload, { TTL: 120, urgency: "high" });
};

Deno.serve(async (req) => {
  const serviceRoleKey = getServiceRoleKey();
  if (!SUPABASE_URL || !serviceRoleKey || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return jsonResponse({ ok: false, error: "Missing environment variables" }, 500);
  }

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const now = new Date();
  const [users, subscriptions] = await Promise.all([
    supabaseFetch("habitflow_user_data?select=user_id,data"),
    supabaseFetch("habitflow_push_subscriptions?select=user_id,endpoint,subscription&enabled=eq.true")
  ]);

  const subscriptionsByUser = new Map<string, any[]>();
  (subscriptions || []).forEach((subscription: any) => {
    if (!subscriptionsByUser.has(subscription.user_id)) subscriptionsByUser.set(subscription.user_id, []);
    subscriptionsByUser.get(subscription.user_id)?.push(subscription);
  });

  let dueCount = 0;
  let sent = 0;
  const dueByType: Record<string, number> = {};

  for (const user of users || []) {
    if (user.data?.user?.notificationsEnabled === false) continue;
    const userSubscriptions = subscriptionsByUser.get(user.user_id) || [];
    if (!userSubscriptions.length) continue;

    const dueItems = [
      ...dueTasksForUser(user, now),
      ...dueMedicationNotificationsForUser(user, now),
      ...dueDebtNotificationsForUser(user, now),
      ...dueHabitNotificationsForUser(user, now),
      ...dueAgendaCoachNotificationsForUser(user, now),
      ...dueStreakCoachNotificationsForUser(user, now),
      ...dueWeeklyReviewNotificationsForUser(user, now)
    ];

    for (const item of dueItems) {
      dueCount += 1;
      dueByType[item.type || "unknown"] = (dueByType[item.type || "unknown"] || 0) + 1;
      const inserted = await markDelivery(item.deliveryKey, user.user_id);
      if (!inserted) continue;

      for (const subscription of userSubscriptions) {
        try {
          await sendPush(subscription, item);
          sent += 1;
        } catch (error: any) {
          console.error("Push failed", error);
          if (error?.statusCode === 404 || error?.statusCode === 410) {
            await supabaseFetch(`habitflow_push_subscriptions?endpoint=eq.${encodeURIComponent(subscription.endpoint)}`, { method: "DELETE" }).catch(() => null);
          }
        }
      }
    }
  }

  console.log(`HabitFlow cron checked users=${users?.length || 0} subscriptions=${subscriptions?.length || 0} due=${dueCount} sent=${sent} types=${JSON.stringify(dueByType)}`);
  return jsonResponse({ ok: true, users: users?.length || 0, subscriptions: subscriptions?.length || 0, due: dueCount, sent, types: dueByType });
});
