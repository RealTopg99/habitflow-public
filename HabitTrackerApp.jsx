import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, Area
} from 'recharts';
import {
  Activity, Check, Edit, Flame, Menu, Plus, Settings, Trash2,
  User, X, Target, TrendingUp, Download, Upload, AlertTriangle,
  Sparkles, Eye, EyeOff, BarChart3, Calendar, BookOpen,
  Clock, Play, Pause, StopCircle, Award, ChevronLeft, ChevronRight,
  Dumbbell, SkipBack, SkipForward, Timer, Repeat, Maximize, Minimize,
  List, Search, ArrowUp, ArrowDown, Hash, GripVertical, CreditCard
} from 'lucide-react';

const supabase = window.supabaseClient;

const BASE_COLORS = {
  bg: '#0a0a0f',
  surface: '#12121a',
  card: '#1a1a26',
  primary: '#e11d48',
  secondary: '#efefef',
  success: '#00ff9d',
  alert: '#ff6b6b',
  text: '#e8e8f0',
  textDim: '#8888a0',
  border: 'rgba(255,255,255,0.06)',
  cardHover: '#22223a'
};

const COLORS = { ...BASE_COLORS };

const CATEGORIES = [
  { id: 'salud', label: 'Salud', icon: '\u{1F4A7}', color: '#00ff9d' },
  { id: 'fitness', label: 'Ejercicio', icon: '\u{1F4AA}', color: '#ff6b6b' },
  { id: 'mente', label: 'Mente', icon: '\u{1F9E0}', color: '#e11d48' },
  { id: 'productividad', label: 'Productividad', icon: '\u{1F680}', color: '#efefef' },
  { id: 'social', label: 'Social', icon: '\u{1F91D}', color: '#ffd93d' },
  { id: 'creatividad', label: 'Creatividad', icon: '\u{1F3A8}', color: '#e11d48' },
  { id: 'otro', label: 'Otro', icon: '\u{2B50}', color: '#a0a0b8' }
];

const ICONS = [
  '\u{1F4A7}', '\u{1F4AA}', '\u{1F9E0}', '\u{1F4DA}', '\u{1F9D8}', '\u{1F3C3}',
  '\u{1F6B4}', '\u{1F3CB}\u{FE0F}', '\u{1F34E}', '\u{1F957}', '\u{1F964}', '\u{1F634}',
  '\u{1F305}', '\u{1F319}', '\u{2600}\u{FE0F}', '\u{1F680}', '\u{1F4BB}', '\u{1F4DD}',
  '\u{2705}', '\u{1F3AF}', '\u{1F4C5}', '\u{23F0}', '\u{1F4A1}', '\u{1F3B5}',
  '\u{1F3A8}', '\u{1F4F7}', '\u{1F91D}', '\u{1F4AC}', '\u{2764}\u{FE0F}', '\u{1F33F}',
  '\u{1F333}', '\u{1F33A}', '\u{1F525}', '\u{26A1}', '\u{1F31F}', '\u{1F3C6}',
  '\u{1F4B0}', '\u{1F9F9}', '\u{1F9F4}', '\u{1F6BF}', '\u{1F6CF}\u{FE0F}', '\u{1F415}',
  '\u{1F431}', '\u{1F30D}', '\u{1F3E0}', '\u{1F697}', '\u{2708}\u{FE0F}', '\u{1F381}',
  '\u{1F389}', '\u{2B50}', '\u{1F308}', '\u{1F60A}',
  '\u{1F3C1}', '\u{1F947}', '\u{1F948}', '\u{1F949}', '\u{1F3AE}', '\u{1F3B2}',
  '\u{1F3B8}', '\u{1F3A7}', '\u{1F3AC}', '\u{1F3A4}', '\u{1F3B9}', '\u{1F3BB}',
  '\u{1F4D6}', '\u{1F4D3}', '\u{1F4D8}', '\u{1F4D9}', '\u{1F4D7}', '\u{1F4CA}',
  '\u{1F4C8}', '\u{1F4C9}', '\u{1F4CB}', '\u{1F4CC}', '\u{1F4CE}', '\u{1F4E6}',
  '\u{1F4E7}', '\u{1F4DE}', '\u{1F4F1}', '\u{1F4BE}', '\u{1F5C2}\u{FE0F}', '\u{1F5D3}\u{FE0F}',
  '\u{1F512}', '\u{1F511}', '\u{1F50D}', '\u{1F527}', '\u{1F528}', '\u{1F9F0}',
  '\u{1F9EA}', '\u{1F52C}', '\u{1F489}', '\u{1F48A}', '\u{1FA7A}', '\u{1F9EC}',
  '\u{1F951}', '\u{1F34C}', '\u{1F353}', '\u{1FAD0}', '\u{1F35A}', '\u{1F35D}',
  '\u{1F95A}', '\u{1F95B}', '\u{2615}', '\u{1F375}', '\u{1F9CA}', '\u{1F6CC}',
  '\u{1F9D1}\u{200D}\u{1F4BB}', '\u{1F9D1}\u{200D}\u{1F3A8}', '\u{1F9D1}\u{200D}\u{1F373}', '\u{1F468}\u{200D}\u{2695}\u{FE0F}', '\u{1F469}\u{200D}\u{1F3EB}', '\u{1F9D1}\u{200D}\u{1F52C}',
  '\u{1F6D2}', '\u{1F6CD}\u{FE0F}', '\u{1F3E6}', '\u{1F4B3}', '\u{1F9FE}', '\u{1F4B8}',
  '\u{1F3D6}\u{FE0F}', '\u{1F5FA}\u{FE0F}', '\u{1F9ED}', '\u{1F3D4}\u{FE0F}', '\u{1F3DD}\u{FE0F}', '\u{1F6A2}',
  '\u{1F6F5}', '\u{1F68C}', '\u{1F686}', '\u{1F6B6}', '\u{1F3CA}', '\u{1F9D7}',
  '\u{1F94A}', '\u{1F3BE}', '\u{26BD}', '\u{1F3C0}', '\u{1F3D0}', '\u{1F94B}',
  '\u{1F6A8}', '\u{1F6E1}\u{FE0F}', '\u{1F9F2}', '\u{1F9FF}', '\u{1F9E9}', '\u{1F9D2}',
  '\u{1F468}', '\u{1F469}', '\u{1F476}', '\u{1F46A}', '\u{1F46B}', '\u{1F64F}',
  '\u{1F60E}', '\u{1F642}', '\u{1F929}', '\u{1F973}', '\u{1F914}', '\u{1F62E}\u{200D}\u{1F4A8}',
  '\u{1F98B}', '\u{1F985}', '\u{1F407}', '\u{1F43E}', '\u{1F331}', '\u{1F340}',
  '\u{1F30A}', '\u{1F32B}\u{FE0F}', '\u{1F4AB}', '\u{1FA90}', '\u{1F9FF}', '\u{1F5A4}',
  '\u{1F600}', '\u{1F601}', '\u{1F602}', '\u{1F603}', '\u{1F604}', '\u{1F605}',
  '\u{1F606}', '\u{1F607}', '\u{1F609}', '\u{1F60B}', '\u{1F60C}', '\u{1F60D}',
  '\u{1F618}', '\u{1F61C}', '\u{1F61D}', '\u{1F62A}', '\u{1F62D}', '\u{1F631}',
  '\u{1F636}', '\u{1F641}', '\u{1F642}', '\u{1F643}', '\u{1F644}', '\u{1F910}',
  '\u{1F911}', '\u{1F917}', '\u{1F920}', '\u{1F923}', '\u{1F928}', '\u{1F92B}',
  '\u{1F92C}', '\u{1F92D}', '\u{1F970}', '\u{1F972}', '\u{1F978}', '\u{1FAE1}',
  '\u{1FAE2}', '\u{1FAE3}', '\u{1FAE8}', '\u{1F44D}', '\u{1F44E}', '\u{1F44F}',
  '\u{1F450}', '\u{1F64C}', '\u{1F91C}', '\u{1F91B}', '\u{1F91E}', '\u{270C}\u{FE0F}',
  '\u{1F90C}', '\u{1F90F}', '\u{1F4AA}', '\u{1F9BE}', '\u{1F9BF}', '\u{1F9B5}',
  '\u{1F9B6}', '\u{1FAC0}', '\u{1FAC1}', '\u{1FAC2}', '\u{1F9D1}', '\u{1F468}',
  '\u{1F469}', '\u{1F9D4}', '\u{1F475}', '\u{1F474}', '\u{1F9D3}', '\u{1F46E}',
  '\u{1F575}\u{FE0F}', '\u{1F477}', '\u{1F934}', '\u{1F478}', '\u{1F9D9}', '\u{1F9DA}',
  '\u{1F9DB}', '\u{1F9DC}', '\u{1F9DD}', '\u{1F9DE}', '\u{1F9DF}', '\u{1F486}',
  '\u{1F487}', '\u{1F6B6}', '\u{1F9CD}', '\u{1F9CE}', '\u{1F3C4}', '\u{1F3C7}',
  '\u{1F3CC}\u{FE0F}', '\u{1F3C2}', '\u{26F7}\u{FE0F}', '\u{1F3A3}', '\u{1F93F}', '\u{1F6F9}',
  '\u{1F6F4}', '\u{1F6EB}', '\u{1F680}', '\u{1F6F8}', '\u{1F6A5}', '\u{1F6A7}',
  '\u{2699}\u{FE0F}', '\u{1F9F1}', '\u{1F9EF}', '\u{1F9FA}', '\u{1FAA3}', '\u{1FAA4}',
  '\u{1FA9B}', '\u{1FA9E}', '\u{1FA91}', '\u{1FA9C}', '\u{1F6AA}', '\u{1FA9F}',
  '\u{1F6CB}\u{FE0F}', '\u{1F6BD}', '\u{1F6C1}', '\u{1FAA5}', '\u{1F9FD}', '\u{1F9FC}',
  '\u{1FAA5}', '\u{1F9FA}', '\u{1F9FB}', '\u{1FAE7}', '\u{1F48E}', '\u{1F48D}',
  '\u{1F451}', '\u{1F45F}', '\u{1F3BD}', '\u{1F97E}', '\u{1F9E2}', '\u{1F9E3}',
  '\u{1F9E4}', '\u{1F9E5}', '\u{1F97C}', '\u{1F45C}', '\u{1F392}', '\u{1F453}',
  '\u{1F576}\u{FE0F}', '\u{1F9E2}', '\u{2602}\u{FE0F}', '\u{1F436}', '\u{1F98A}', '\u{1F981}',
  '\u{1F42F}', '\u{1F434}', '\u{1F984}', '\u{1F41D}', '\u{1F41E}', '\u{1F33C}',
  '\u{1F337}', '\u{1F339}', '\u{1F940}', '\u{1F344}', '\u{1F335}', '\u{1F334}',
  '\u{1F341}', '\u{1F342}', '\u{1F347}', '\u{1F348}', '\u{1F349}', '\u{1F34A}',
  '\u{1F34D}', '\u{1F96D}', '\u{1FAD2}', '\u{1FAD1}', '\u{1FAD3}', '\u{1F955}',
  '\u{1F33D}', '\u{1F336}\u{FE0F}', '\u{1FAD1}', '\u{1F96C}', '\u{1F966}', '\u{1F9C4}',
  '\u{1F9C5}', '\u{1F95C}', '\u{1F330}', '\u{1F35E}', '\u{1F950}', '\u{1F956}',
  '\u{1F968}', '\u{1F9C0}', '\u{1F356}', '\u{1F357}', '\u{1F969}', '\u{1F953}',
  '\u{1F354}', '\u{1F35F}', '\u{1F355}', '\u{1F32D}', '\u{1F96A}', '\u{1F32E}',
  '\u{1F372}', '\u{1F963}', '\u{1F96B}', '\u{1F371}', '\u{1F363}', '\u{1F364}',
  '\u{1F36A}', '\u{1F382}', '\u{1F36B}', '\u{1F36F}', '\u{1F37C}', '\u{1F9C3}',
  '\u{1F377}', '\u{1F37A}', '\u{1F943}', '\u{1F6D0}', '\u{262F}\u{FE0F}', '\u{271D}\u{FE0F}',
  '\u{262E}\u{FE0F}', '\u{267B}\u{FE0F}', '\u{2695}\u{FE0F}', '\u{2696}\u{FE0F}', '\u{1F4F0}', '\u{1F4D1}',
  '\u{1F4D2}', '\u{1F4C4}', '\u{1F4C3}', '\u{1F4DC}', '\u{1F4DD}', '\u{270F}\u{FE0F}',
  '\u{1F58A}\u{FE0F}', '\u{1F5DD}\u{FE0F}', '\u{1F4E5}', '\u{1F4E4}', '\u{1F4EB}', '\u{1F4EC}',
  '\u{1F4AD}', '\u{1F4A4}', '\u{1F4A6}', '\u{1F4A8}', '\u{1F4AF}', '\u{1F4A5}',
  '\u{1F4A2}', '\u{1F4A3}', '\u{1F4AC}', '\u{1F441}\u{FE0F}', '\u{1F9FF}', '\u{1FAAC}'
];

const getCategoryIcon = (category) => CATEGORIES.find(c => c.id === category)?.icon || CATEGORIES[0].icon;
const isBrokenHabitIcon = (icon) => !icon || /^\?+$/.test(icon) || icon.includes('\uFFFD');

const FREQUENCIES = ['Diario', 'Lun-Vie', 'Fines de semana', 'Personalizado'];

const THEME_VARIANTS = [
  { id: 'labCrimson', name: 'Lab Crimson', primary: '#e11d48', secondary: '#efefef' },
  { id: 'roseQuartz', name: 'Rosa claro', primary: '#e11d48', secondary: '#fb7185' },
  { id: 'monoInk', name: 'Mono Ink', primary: '#5f6673', secondary: '#efefef' },
  { id: 'violet', name: 'Violeta', primary: '#6d28d9', secondary: '#efefef' },
  { id: 'cyan', name: 'Cian', primary: '#0e7490', secondary: '#efefef' },
  { id: 'green', name: 'Verde', primary: '#047857', secondary: '#efefef' }
];

const ICON_COLOR_PALETTE = [
  { id: 'labRed', name: 'Lab rojo', primary: '#e11d48', hover: '#f5f5f5', deep: '#7f1028', rgb: '225,29,72' },
  { id: 'rimuWhite', name: 'Blanco premium', primary: '#d8d8df', hover: '#ffffff', deep: '#777782', rgb: '216,216,223' },
  { id: 'fire', name: 'Fuego', primary: '#f97316', hover: '#ffb86b', deep: '#b91c1c', rgb: '249,115,22' },
  { id: 'gold', name: 'Dorado', primary: '#d4a017', hover: '#f5d76e', deep: '#92400e', rgb: '212,160,23' },
  { id: 'violet', name: 'Violeta', primary: '#8b5cf6', hover: '#c4b5fd', deep: '#4c1d95', rgb: '139,92,246' },
  { id: 'cyan', name: 'Cian', primary: '#38bdf8', hover: '#bae6fd', deep: '#075985', rgb: '56,189,248' },
  { id: 'emerald', name: 'Verde', primary: '#10b981', hover: '#86efac', deep: '#065f46', rgb: '16,185,129' },
  { id: 'rose', name: 'Rosa', primary: '#e11d48', hover: '#fda4af', deep: '#9f1239', rgb: '225,29,72' },
  { id: 'red', name: 'Rojo', primary: '#ef4444', hover: '#fca5a5', deep: '#991b1b', rgb: '239,68,68' },
  { id: 'ice', name: 'Hielo', primary: '#93c5fd', hover: '#eff6ff', deep: '#1d4ed8', rgb: '147,197,253' }
];

const THEME_MODES = [
  { id: 'labNeon', name: 'Lab Neon', desc: 'Negro absoluto, bordes finos, rojo neon y estetica de app premium.', colors: {
    ...BASE_COLORS,
    bg: '#000000',
    surface: '#050505',
    card: '#0f0f0f',
    cardHover: '#171717',
    success: '#efefef',
    alert: '#e11d48',
    text: '#efefef',
    textDim: '#9a9aa0',
    border: 'rgba(239,239,239,0.11)'
  } },
  { id: 'midnight', name: 'Dark suave', desc: 'Oscuro con tarjetas visibles y contraste cómodo.', colors: BASE_COLORS },
  { id: 'pureDark', name: 'Dark puro', desc: 'Negro profundo, menos brillo y bordes más finos.', colors: {
    ...BASE_COLORS,
    bg: '#000000',
    surface: '#070708',
    card: '#0d0d10',
    cardHover: '#151519',
    text: '#f2f2f4',
    textDim: '#8c8c96',
    border: 'rgba(255,255,255,0.095)'
  } },
  { id: 'pinkLight', name: 'Claro rosa', desc: 'Fondo claro, tarjetas blancas, acentos rosa y contraste suave.', defaultAccent: 'roseQuartz', defaultIconColor: 'rose', colors: {
    ...BASE_COLORS,
    bg: '#fff7fb',
    surface: '#fff0f6',
    card: '#ffffff',
    cardHover: '#ffe4ef',
    primary: '#e11d48',
    secondary: '#fb7185',
    success: '#059669',
    alert: '#be123c',
    text: '#30202a',
    textDim: '#8a5b70',
    border: 'rgba(190,18,60,0.16)'
  } }
];

const PREDEFINED_CHALLENGES = [
  { id: 'challenge1', name: 'Hidratación 30 días', icon: '\u{1F4A7}', desc: 'Tomar 2L de agua diario por 30 días', duration: 30, difficulty: 'Fácil', diffColor: COLORS.success, target: { name: 'Tomar 2L de agua', category: 'salud', icon: '\u{1F4A7}', frequency: 'Diario', targetStreak: 30 } },
  { id: 'challenge2', name: 'Desafío de Ejercicio', icon: '\u{1F4AA}', desc: 'Ejercicio 20 min por 21 días consecutivos', duration: 21, difficulty: 'Medio', diffColor: '#ffd93d', target: { name: 'Ejercicio 20 min', category: 'fitness', icon: '\u{1F4AA}', frequency: 'Diario', targetStreak: 21 } },
  { id: 'challenge3', name: 'Lector Intensivo', icon: '\u{1F4DA}', desc: 'Leer 30 min por 14 días seguidos', duration: 14, difficulty: 'Medio', diffColor: '#ffd93d', target: { name: 'Leer 30 min', category: 'mente', icon: '\u{1F4DA}', frequency: 'Diario', targetStreak: 14 } },
  { id: 'challenge4', name: 'Meditación Profunda', icon: '\u{1F9D8}', desc: 'Meditar 15 min por 21 días', duration: 21, difficulty: 'Medio', diffColor: '#ffd93d', target: { name: 'Meditar 15 min', category: 'mente', icon: '\u{1F9D8}', frequency: 'Diario', targetStreak: 21 } },
  { id: 'challenge5', name: '100 días de Código', icon: '\u{1F4BB}', desc: 'Programar/aprender 1 hora por 100 días', duration: 100, difficulty: 'Difícil', diffColor: COLORS.alert, target: { name: 'Programar 1 hora', category: 'productividad', icon: '\u{1F4BB}', frequency: 'Diario', targetStreak: 100 } },
  { id: 'challenge6', name: 'Hábito Perfecto', icon: '\u{1F3C6}', desc: 'Completar TODOS los hábitos del día por 7 días seguidos', duration: 7, difficulty: 'Difícil', diffColor: COLORS.alert, target: null }
];

const MUSCLE_COLORS = {
  'Pecho': '#ff6b6b', 'Espalda': '#efefef', 'Piernas': '#00ff9d',
  'Hombros': '#ffd93d', 'Bíceps': '#e11d48', 'Tríceps': '#e11d48',
  'Abdomen': '#ff9f43', 'Cardio': '#a0a0ff', 'Full Body': '#7f1028'
};

const WORKOUT_EXERCISES = [
  { id: 'ex1', name: 'Press de Banca', mg: 'Pecho', type: 'fuerza', equip: 'Barra' },
  { id: 'ex2', name: 'Press Inclinado', mg: 'Pecho', type: 'fuerza', equip: 'Mancuernas' },
  { id: 'ex3', name: 'Aperturas', mg: 'Pecho', type: 'fuerza', equip: 'Mancuernas' },
  { id: 'ex4', name: 'Fondos en Paralelas', mg: 'Pecho', type: 'peso_corporal', equip: 'Peso Corporal' },
  { id: 'ex5', name: 'Press en Máquina', mg: 'Pecho', type: 'fuerza', equip: 'Máquina' },
  { id: 'ex6', name: 'Dominadas', mg: 'Espalda', type: 'peso_corporal', equip: 'Peso Corporal' },
  { id: 'ex7', name: 'Remo con Barra', mg: 'Espalda', type: 'fuerza', equip: 'Barra' },
  { id: 'ex8', name: 'Remo con Mancuerna', mg: 'Espalda', type: 'fuerza', equip: 'Mancuernas' },
  { id: 'ex9', name: 'Jalón al Pecho', mg: 'Espalda', type: 'fuerza', equip: 'Máquina' },
  { id: 'ex10', name: 'Peso Muerto', mg: 'Espalda', type: 'fuerza', equip: 'Barra' },
  { id: 'ex11', name: 'Press Militar', mg: 'Hombros', type: 'fuerza', equip: 'Barra' },
  { id: 'ex12', name: 'Press con Mancuernas', mg: 'Hombros', type: 'fuerza', equip: 'Mancuernas' },
  { id: 'ex13', name: 'Elevaciones Laterales', mg: 'Hombros', type: 'fuerza', equip: 'Mancuernas' },
  { id: 'ex14', name: 'Pájaros', mg: 'Hombros', type: 'fuerza', equip: 'Mancuernas' },
  { id: 'ex15', name: 'Curl con Barra', mg: 'Bíceps', type: 'fuerza', equip: 'Barra' },
  { id: 'ex16', name: 'Curl Martillo', mg: 'Bíceps', type: 'fuerza', equip: 'Mancuernas' },
  { id: 'ex17', name: 'Curl en Máquina', mg: 'Bíceps', type: 'fuerza', equip: 'Máquina' },
  { id: 'ex18', name: 'Extensión Francesa', mg: 'Tríceps', type: 'fuerza', equip: 'Barra' },
  { id: 'ex19', name: 'Press Francés', mg: 'Tríceps', type: 'fuerza', equip: 'Mancuernas' },
  { id: 'ex20', name: 'Jalón de Polea', mg: 'Tríceps', type: 'fuerza', equip: 'Máquina' },
  { id: 'ex21', name: 'Sentadilla', mg: 'Piernas', type: 'fuerza', equip: 'Barra' },
  { id: 'ex22', name: 'Prensa de Piernas', mg: 'Piernas', type: 'fuerza', equip: 'Máquina' },
  { id: 'ex23', name: 'Extensión de Cuádriceps', mg: 'Piernas', type: 'fuerza', equip: 'Máquina' },
  { id: 'ex24', name: 'Curl de Femoral', mg: 'Piernas', type: 'fuerza', equip: 'Máquina' },
  { id: 'ex25', name: 'Peso Muerto Rumano', mg: 'Piernas', type: 'fuerza', equip: 'Barra' },
  { id: 'ex26', name: 'Pantorrillas de Pie', mg: 'Piernas', type: 'fuerza', equip: 'Máquina' },
  { id: 'ex27', name: 'Crunch', mg: 'Abdomen', type: 'peso_corporal', equip: 'Peso Corporal' },
  { id: 'ex28', name: 'Plancha', mg: 'Abdomen', type: 'peso_corporal', equip: 'Peso Corporal' },
  { id: 'ex29', name: 'Caminata en Cinta', mg: 'Cardio', type: 'cardio', equip: 'Cinta' },
  { id: 'ex30', name: 'Bicicleta estática', mg: 'Cardio', type: 'cardio', equip: 'Bicicleta' }
];

const SAMPLE_ROUTINES = [
  { id: 'r1', name: 'Pecho y Tríceps', mgs: ['Pecho', 'Tríceps'], exs: [{ eid: 'ex1', sets: 4, reps: 10, weight: 60, rest: 90 }, { eid: 'ex2', sets: 3, reps: 12, weight: 20, rest: 60 }, { eid: 'ex3', sets: 3, reps: 15, weight: 12, rest: 60 }, { eid: 'ex20', sets: 3, reps: 12, weight: 25, rest: 90 }, { eid: 'ex19', sets: 3, reps: 15, weight: 10, rest: 60 }] },
  { id: 'r2', name: 'Piernas y Abdomen', mgs: ['Piernas', 'Abdomen'], exs: [{ eid: 'ex21', sets: 4, reps: 10, weight: 80, rest: 120 }, { eid: 'ex23', sets: 3, reps: 12, weight: 50, rest: 60 }, { eid: 'ex24', sets: 3, reps: 15, weight: 35, rest: 60 }, { eid: 'ex27', sets: 3, reps: 20, weight: 0, rest: 45 }, { eid: 'ex28', sets: 3, reps: 60, weight: 0, rest: 45 }] },
  { id: 'r3', name: 'Espalda y Hombros', mgs: ['Espalda', 'Hombros'], exs: [{ eid: 'ex6', sets: 3, reps: 8, weight: 0, rest: 90 }, { eid: 'ex7', sets: 4, reps: 10, weight: 50, rest: 90 }, { eid: 'ex9', sets: 3, reps: 12, weight: 40, rest: 60 }, { eid: 'ex11', sets: 4, reps: 8, weight: 35, rest: 90 }, { eid: 'ex13', sets: 3, reps: 15, weight: 8, rest: 45 }] }
];

const MGS = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Bíceps', 'Tríceps', 'Abdomen', 'Cardio'];

const calcRM = (w, r) => Math.round(w * (1 + r / 30));

const genSampleSessions = () => {

const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) { /* silent fail */ }
};
  const sessions = [];
  const sd = new Date();
  const usedDates = new Set();
  for (let i = 0; i < 20; i++) {
    const daysAgo = 1 + Math.floor(Math.random() * 59);
    const d = addDays(sd, -daysAgo);
    const ds = toYYYYMMDD(d);
    if (usedDates.has(ds)) continue;
    usedDates.add(ds);
    const ri = i % 3;
    const r = SAMPLE_ROUTINES[ri];
    const volFactor = 0.8 + Math.random() * 0.4;
    const duration = 20 + Math.floor(Math.random() * 40);
    const exs = r.exs.map((ex, ei) => ({
      exerciseId: ex.eid,
      exerciseName: WORKOUT_EXERCISES.find(e => e.id === ex.eid)?.name || '',
      muscleGroup: WORKOUT_EXERCISES.find(e => e.id === ex.eid)?.mg || '',
      sets: Array.from({ length: ex.sets }, (_, si) => ({
        setNumber: si + 1, reps: Math.max(1, Math.round(ex.reps * (0.8 + Math.random() * 0.4))),
        weight: Math.round(ex.weight * volFactor / 2.5) * 2.5, completed: true,
        isPersonalRecord: Math.random() < 0.05
      }))
    }));
    const totalSets = exs.reduce((s, e) => s + e.sets.length, 0);
    const totalVolume = exs.reduce((s, e) => s + e.sets.reduce((ss, set) => ss + set.reps * set.weight, 0), 0);
    sessions.push({
      id: `ws${i}`, routineId: r.id, routineName: r.name, date: ds,
      startTime: `${String(6 + Math.floor(Math.random() * 14)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      endTime: '', durationMinutes: duration,
      totalVolume, totalSets, exercises: exs, notes: ['Buen entreno', 'Me costó un poco', 'Fue intenso', 'Bien, a mejorar'][i % 4]
    });
  }
  return sessions;
};

const getWorkoutData = () => ({
  exercises: WORKOUT_EXERCISES.map(e => ({ ...e, custom: false })),
  routines: SAMPLE_ROUTINES.map(r => ({ id: r.id, name: r.name, muscleGroups: r.mgs, exercises: r.exs, createdAt: toYYYYMMDD(addDays(new Date(), -60)) })),
  sessions: genSampleSessions()
});

const getFinanceData = () => ({
  currency: 'USD',
  copRate: 4000,
  monthlyBudget: 1200,
  categories: [
    { id: 'food', name: 'Comida', color: '#efefef' },
    { id: 'home', name: 'Casa', color: '#e11d48' },
    { id: 'transport', name: 'Transporte', color: '#ff6b6b' },
    { id: 'health', name: 'Salud', color: '#00ff9d' },
    { id: 'fun', name: 'Ocio', color: '#ffd93d' },
    { id: 'income', name: 'Ingresos', color: '#10b981' }
  ],
  budgets: {
    food: 380,
    home: 520,
    transport: 140,
    health: 100,
    fun: 160
  },
  accounts: [
    { id: 'cash', name: 'Efectivo', type: 'cash', balance: 180 },
    { id: 'bank', name: 'Cuenta principal', type: 'bank', balance: 2100 }
  ],
  recurring: [
    { id: 'rec1', name: 'Renta', type: 'expense', amount: 520, category: 'home', day: 5, active: true },
    { id: 'rec2', name: 'Internet', type: 'expense', amount: 45, category: 'home', day: 12, active: true },
    { id: 'rec3', name: 'Ingreso principal', type: 'income', amount: 2500, category: 'income', day: 1, active: true }
  ],
  goals: [
    { id: 'goal1', name: 'Fondo de emergencia', target: 2000, saved: 420, dueDate: toYYYYMMDD(addDays(new Date(), 120)) }
  ],
  transactions: [
    { id: 'fin1', type: 'income', amount: 2500, category: 'income', accountId: 'bank', payee: 'Empresa', note: 'Ingreso principal', date: toYYYYMMDD(new Date()) },
    { id: 'fin2', type: 'expense', amount: 86, category: 'food', accountId: 'bank', payee: 'Supermercado', note: 'Compra semanal', date: toYYYYMMDD(new Date()) },
    { id: 'fin3', type: 'expense', amount: 42, category: 'transport', accountId: 'cash', payee: 'Transporte', note: 'Transporte semanal', date: toYYYYMMDD(addDays(new Date(), -1)) }
  ]
});

const getReadingData = () => ({
  books: [],
  activeBookId: null
});

const getStudyData = () => ({
  subjects: [
    { id: 'sub1', name: 'Productividad', color: '#e11d48', goalHours: 12, topics: [
      { id: 'top1', name: 'Sistema semanal', completed: true },
      { id: 'top2', name: 'Revision de metas', completed: false }
    ] },
    { id: 'sub2', name: 'Finanzas personales', color: '#7c85f5', goalHours: 8, topics: [
      { id: 'top3', name: 'Presupuesto mensual', completed: false },
      { id: 'top4', name: 'Control de gastos', completed: false }
    ] }
  ],
  sessions: [
    { id: 'study1', subjectId: 'sub1', minutes: 45, note: 'Repaso del sistema', date: toYYYYMMDD(new Date()) },
    { id: 'study2', subjectId: 'sub2', minutes: 35, note: 'Categorías de gastos', date: toYYYYMMDD(addDays(new Date(), -1)) }
  ]
});

const getDreamGoals = () => ([
  {
    id: 'dream_bmw',
    title: 'Comprar BMW M4',
    icon: '\u{1F697}',
    target: 85000,
    current: 55250,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
    accent: '#e11d48'
  },
  {
    id: 'dream_swiss',
    title: 'Viaje a Suiza',
    icon: '\u{26F0}\u{FE0F}',
    target: 12000,
    current: 4800,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
    accent: '#7aa8ff'
  },
  {
    id: 'dream_savings',
    title: 'Guardar $30.000',
    icon: '\u{1F4B0}',
    target: 30000,
    current: 24600,
    image: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&w=900&q=80',
    accent: '#48d982'
  }
]);

const greets = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Buenos días', emoji: '\u{1F305}' };
  if (h < 19) return { text: 'Buenas tardes', emoji: '\u{2600}\u{FE0F}' };
  return { text: 'Buenas noches', emoji: '\u{1F319}' };
};

const SPANISH_WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const SPANISH_MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const formatDateSpanish = (d) => {
  const date = new Date(d);
  return `${SPANISH_WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${SPANISH_MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
};

const formatDateShort = (d) => {
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const openNativeDatePicker = (input) => {
  try {
    if (input && typeof input.showPicker === 'function') input.showPicker();
  } catch (e) {}
};

const toYYYYMMDD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const addDays = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const daysAgo = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
};

const getDayOfWeek = (d) => d.getDay();

const genSampleHabits = () => [
  { id: 'h1', name: 'Beber 2L de agua', description: 'Mantenerse hidratado durante el día', category: 'salud', icon: '\u{1F4A7}', color: '#00ff9d', frequency: 'Diario', targetStreak: 30, active: true, createdAt: toYYYYMMDD(addDays(new Date(), -60)) },
  { id: 'h2', name: 'Ejercicio 30 min', description: 'Actividad física diaria', category: 'fitness', icon: '\u{1F4AA}', color: '#ff6b6b', frequency: 'Diario', targetStreak: 21, active: true, createdAt: toYYYYMMDD(addDays(new Date(), -60)) },
  { id: 'h3', name: 'Leer 20 páginas', description: 'Lectura diaria para desarrollo personal', category: 'mente', icon: '\u{1F4DA}', color: '#e11d48', frequency: 'Diario', targetStreak: 30, active: true, createdAt: toYYYYMMDD(addDays(new Date(), -60)) },
  { id: 'h4', name: 'Meditar 10 min', description: 'Meditación de atención plena', category: 'mente', icon: '\u{1F9D8}', color: '#efefef', frequency: 'Diario', targetStreak: 14, active: true, createdAt: toYYYYMMDD(addDays(new Date(), -60)) },
  { id: 'h5', name: 'Aprender algo nuevo', description: 'Estudiar o practicar una nueva habilidad', category: 'productividad', icon: '\u{1F680}', color: '#ffd93d', frequency: 'Diario', targetStreak: 21, active: true, createdAt: toYYYYMMDD(addDays(new Date(), -60)) }
];

const genSampleRecords = (habits) => {
  const records = [];
  const rates = { h1: 0.85, h2: 0.65, h3: 0.7, h4: 0.55, h5: 0.75 };
  const sampleNotes = ['Bien hoy', 'Un poco cansado', 'Excelente sesión', 'Me costó empezar', 'Muy productivo', 'Regular', 'Contento con el progreso'];
  const sampleMoods = [3, 4, 5, 2, 4, 3, 5];
  const today = new Date();

  for (let i = 60; i >= 0; i--) {
    const date = addDays(today, -i);
    const dateStr = toYYYYMMDD(date);
    const dow = getDayOfWeek(date);
    habits.forEach((h, idx) => {
      const rate = rates[h.id] || 0.7;
      let prob = rate;
      if (dow === 0 || dow === 6) prob *= 0.85;
      prob += (Math.random() - 0.5) * 0.1;
      const completed = Math.random() < prob;
      const hasNote = completed && Math.random() < 0.2;
      records.push({
        habitId: h.id, date: dateStr, completed, note: hasNote ? sampleNotes[(idx + i) % sampleNotes.length] : '',
        mood: completed ? sampleMoods[(idx + i) % sampleMoods.length] : 0
      });
    });
  }
  return records;
};

const getDefaultData = (reset = false) => {
  const habits = reset ? [] : genSampleHabits().map(h => ({
    ...h,
    icon: isBrokenHabitIcon(h.icon) ? getCategoryIcon(h.category) : h.icon
  }));
  const records = reset ? [] : genSampleRecords(habits);
  const xp = reset ? 0 : records.filter(r => r.completed).length * 10;
  return {
    user: { name: 'Usuario', motto: 'Cada día es una nueva oportunidad', accentColor: 'violet', themeMode: 'midnight', iconColor: 'fire', createdAt: toYYYYMMDD(new Date()), xp, level: getLevel(xp), levelUpShown: getLevel(xp), pomodoro: { focus: 25, shortBreak: 5, longBreak: 15 } },
    habits,
    records,
    dailyNotes: reset ? {} : { [toYYYYMMDD(new Date())]: { note: 'Buen día en general, cumplí todos mis hábitos', mood: 4 } },
    challenges: reset ? [] : [{ id: 'ch1', habitId: 'h1', startDate: toYYYYMMDD(addDays(new Date(), -14)), status: 'active' }],
    workoutData: reset ? { exercises: WORKOUT_EXERCISES.map(e => ({ ...e, custom: false })), routines: [], sessions: [] } : getWorkoutData(),
    financeData: reset ? { currency: 'USD', copRate: 4000, monthlyBudget: 0, categories: getFinanceData().categories, transactions: [] } : getFinanceData(),
    studyData: reset ? { subjects: [], sessions: [] } : getStudyData(),
    readingData: getReadingData(),
    dreamGoals: reset ? [] : getDreamGoals(),
    pomodoroRecords: [],
    agenda: {},
    agendaNotes: {},
    agendaTodos: {},
    agendaTodoLabels: []
  };
};

const normalizeLoadedData = (parsed) => {
  if (!parsed || !parsed.user || !parsed.habits || !parsed.records) return null;
  if (!parsed.user.xp) parsed.user.xp = 0;
  if (!parsed.user.level) parsed.user.level = 1;
  if (!parsed.user.levelUpShown) parsed.user.levelUpShown = 1;
  if (!parsed.user.themeMode) parsed.user.themeMode = 'midnight';
  if (!parsed.user.iconColor) parsed.user.iconColor = 'fire';
  if (parsed.user.visualVersion !== 'labNeon2026') {
    parsed.user.themeMode = 'labNeon';
    parsed.user.accentColor = 'labCrimson';
    parsed.user.iconColor = 'labRed';
    parsed.user.visualVersion = 'labNeon2026';
  }
  if (!parsed.dailyNotes) parsed.dailyNotes = {};
  if (!parsed.challenges) parsed.challenges = [];
  parsed.habits.forEach(h => {
    if (!h.lastFocusSession) h.lastFocusSession = null;
    if (isBrokenHabitIcon(h.icon)) h.icon = getCategoryIcon(h.category);
  });
  parsed.records.forEach(r => { if (r.mood === undefined) r.mood = 0; });
  if (!parsed.workoutData) parsed.workoutData = getWorkoutData();
  if (!parsed.workoutData.exercises) parsed.workoutData.exercises = WORKOUT_EXERCISES.map(e => ({ ...e, custom: false }));
  if (!parsed.workoutData.routines) parsed.workoutData.routines = SAMPLE_ROUTINES.map(r => ({ id: r.id, name: r.name, muscleGroups: r.mgs, exercises: r.exs, createdAt: toYYYYMMDD(addDays(new Date(), -60)) }));
  if (!parsed.workoutData.sessions) parsed.workoutData.sessions = genSampleSessions();
  if (!parsed.financeData) parsed.financeData = getFinanceData();
  if (!parsed.financeData.currency) parsed.financeData.currency = 'USD';
  if (!parsed.financeData.copRate) parsed.financeData.copRate = 4000;
  if (!parsed.financeData.categories) parsed.financeData.categories = getFinanceData().categories;
  if (!parsed.financeData.transactions) parsed.financeData.transactions = [];
  if (parsed.financeData.monthlyBudget === undefined) parsed.financeData.monthlyBudget = 0;
  if (!parsed.financeData.budgets) parsed.financeData.budgets = {};
  if (!parsed.financeData.accounts || !parsed.financeData.accounts.length) parsed.financeData.accounts = getFinanceData().accounts;
  if (!parsed.financeData.recurring) parsed.financeData.recurring = [];
  if (!parsed.financeData.goals) parsed.financeData.goals = [];
  if (!parsed.studyData) parsed.studyData = getStudyData();
  if (!parsed.studyData.subjects) parsed.studyData.subjects = [];
  if (!parsed.studyData.sessions) parsed.studyData.sessions = [];
  parsed.studyData.subjects.forEach(s => { if (!s.topics) s.topics = []; if (!s.goalHours) s.goalHours = 0; });
  parsed.readingData = getReadingData();
  if (!parsed.dreamGoals) parsed.dreamGoals = getDreamGoals();
  parsed.dreamGoals = (parsed.dreamGoals || []).map(goal => ({
    ...goal,
    image: typeof goal.image === 'string' && goal.image.startsWith('data:') ? '' : goal.image
  }));
  if (!parsed.agenda) parsed.agenda = {};
  if (!parsed.agendaNotes) parsed.agendaNotes = {};
  if (!parsed.agendaTodos) parsed.agendaTodos = {};
  if (!parsed.agendaTodoLabels) parsed.agendaTodoLabels = [];
  return parsed;
};

const saveLocalData = (data) => {
  localStorage.setItem('habitTrackerData', JSON.stringify(data));
};

const loadData = () => {
  try {
    const raw = localStorage.getItem('habitTrackerData');
    if (raw) {
      const parsed = normalizeLoadedData(JSON.parse(raw));
      if (parsed) {
        saveLocalData(parsed);
        return parsed;
      }
    }
  } catch (e) {}
  const data = normalizeLoadedData(getDefaultData()) || getDefaultData();
  saveLocalData(data);
  return data;
};

const CLOUD_TABLE = 'habitflow_user_data';
const NOTIFICATION_SENT_STORAGE = 'habitflowNotificationSent';
let cloudSaveTimer = null;
let lastCloudSave = Promise.resolve();

const emitCloudSyncStatus = (detail) => {
  try {
    window.dispatchEvent(new CustomEvent('habitflow-cloud-sync', { detail }));
  } catch {}
};

const getClerkUserId = () => window.Clerk?.user?.id || null;

const getCloudClient = () => {
  if (!window.createSupabaseClient || !window.HABITFLOW_SUPABASE_URL || !window.HABITFLOW_SUPABASE_PUBLISHABLE_KEY) return null;
  return window.createSupabaseClient(
    window.HABITFLOW_SUPABASE_URL,
    window.HABITFLOW_SUPABASE_PUBLISHABLE_KEY,
    {
      accessToken: async () => window.Clerk?.session?.getToken() ?? null
    }
  );
};

const loadCloudData = async () => {
  const userId = getClerkUserId();
  const client = getCloudClient();
  if (!userId || !client) return { ok: false, reason: 'Nube no disponible.' };
  try {
    const { data, error } = await client
      .from(CLOUD_TABLE)
      .select('data, updated_at')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return { ok: false, reason: error.message };
    const normalized = normalizeLoadedData(data?.data);
    return { ok: true, data: normalized, updatedAt: data?.updated_at || null };
  } catch (err) {
    return { ok: false, reason: err.message || 'No se pudo cargar la nube.' };
  }
};

const saveCloudDataNow = async (data) => {
  const userId = getClerkUserId();
  const client = getCloudClient();
  if (!userId || !client || !data) return { ok: false, reason: 'Nube no disponible.' };
  const payload = {
    user_id: userId,
    data: { ...data, user: { ...data.user, clerkUserId: userId } },
    updated_at: new Date().toISOString()
  };
  try {
    const { error } = await client
      .from(CLOUD_TABLE)
      .upsert(payload, { onConflict: 'user_id' });
    if (error) return { ok: false, reason: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message || 'No se pudo guardar en la nube.' };
  }
};

const queueCloudSave = (data) => {
  if (!getClerkUserId()) {
    emitCloudSyncStatus({ status: 'local', label: 'Guardado local', reason: 'No hay sesión de Clerk activa.' });
    return;
  }
  emitCloudSyncStatus({ status: 'saving', label: 'Guardando nube', reason: 'Sincronizando el último cambio con Supabase.' });
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => {
    lastCloudSave = lastCloudSave
      .then(() => saveCloudDataNow(data))
      .then(result => {
        emitCloudSyncStatus(result.ok
          ? { status: 'active', label: 'Nube activa', reason: 'Último cambio guardado en Supabase.' }
          : { status: 'local', label: 'Guardado local', reason: result.reason || 'No se pudo guardar en Supabase.' });
      })
      .catch(err => {
        emitCloudSyncStatus({ status: 'local', label: 'Guardado local', reason: err?.message || 'No se pudo guardar en Supabase.' });
      });
  }, 120);
};

const saveData = (data) => {
  saveLocalData(data);
  queueCloudSave(data);
};

const getNotificationPermissionState = () => {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission || 'default';
};

const getNotificationStatusLabel = (permission = getNotificationPermissionState()) => {
  if (permission === 'granted') return 'Activas';
  if (permission === 'denied') return 'Bloqueadas';
  if (permission === 'unsupported') return 'No disponibles';
  return 'Sin activar';
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
};

const savePushSubscription = async (subscription) => {
  const client = getCloudClient();
  const userId = getClerkUserId();
  if (!client || !userId || !subscription?.endpoint) {
    return { ok: false, reason: 'Para recibir avisos con la app cerrada debes iniciar sesión y tener la nube activa.' };
  }
  try {
    const { error } = await client
      .from('habitflow_push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscription.endpoint,
        subscription: subscription.toJSON(),
        user_agent: navigator.userAgent || '',
        enabled: true,
        last_seen_at: new Date().toISOString()
      }, { onConflict: 'endpoint' });
    if (error) return { ok: false, reason: error.message };
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error?.message || 'No se pudo guardar la suscripción push.' };
  }
};

const requestHabitFlowNotifications = async () => {
  if (typeof Notification === 'undefined') {
    return { ok: false, permission: 'unsupported', reason: 'Este navegador no soporta notificaciones web.' };
  }
  if (!window.isSecureContext && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return { ok: false, permission: Notification.permission, reason: 'Las notificaciones requieren HTTPS.' };
  }
  try {
    let registration = null;
    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.register('./sw.js'); } catch {}
      try { registration = await navigator.serviceWorker.ready; } catch {}
    }
    const permission = Notification.permission === 'default'
      ? await Notification.requestPermission()
      : Notification.permission;
    if (permission === 'granted' && registration && 'PushManager' in window && window.HABITFLOW_VAPID_PUBLIC_KEY) {
      try {
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(window.HABITFLOW_VAPID_PUBLIC_KEY)
          });
        }
        const saved = await savePushSubscription(subscription);
        return {
          ok: saved.ok,
          permission,
          reason: saved.ok
            ? 'Push real activo. Este dispositivo ya puede recibir avisos aunque HabitFlow esté cerrado, cuando el servidor de alarmas esté activo.'
            : `Permiso activo, pero falta guardar el dispositivo: ${saved.reason}`
        };
      } catch (error) {
        return {
          ok: true,
          permission,
          reason: `Permiso activo para avisos locales, pero el push cerrado no quedó suscrito: ${error?.message || 'revisa el dispositivo.'}`
        };
      }
    }
    return {
      ok: permission === 'granted',
      permission,
      reason: permission === 'granted'
        ? 'Notificaciones activas en este dispositivo. Para que suene en todos, abre HabitFlow en cada PC o celular y activa sus notificaciones una vez.'
        : permission === 'denied'
          ? 'El navegador bloqueó las notificaciones. Actívalas desde permisos del sitio.'
          : 'No se concedió el permiso.'
    };
  } catch {
    return { ok: false, permission: getNotificationPermissionState(), reason: 'No se pudo activar el permiso de notificaciones.' };
  }
};

const showHabitFlowNotification = async (title, options = {}) => {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return false;
  const payload = {
    badge: './icon-192-20260603.png',
    icon: './icon-192-20260603.png',
    silent: false,
    requireInteraction: false,
    ...options
  };
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration?.showNotification) {
        await registration.showNotification(title, payload);
        return true;
      }
    }
    new Notification(title, payload);
    return true;
  } catch {
    try {
      new Notification(title, payload);
      return true;
    } catch {
      return false;
    }
  }
};

const getSentNotificationMap = () => {
  try { return JSON.parse(localStorage.getItem(NOTIFICATION_SENT_STORAGE) || '{}') || {}; } catch { return {}; }
};

const saveSentNotificationMap = (map) => {
  try { localStorage.setItem(NOTIFICATION_SENT_STORAGE, JSON.stringify(map)); } catch {}
};

const CLERK_KEY_STORAGE = 'habitflowClerkPublishableKey';

const getStoredClerkKey = () => {
  try {
    return localStorage.getItem(CLERK_KEY_STORAGE) || window.HABITFLOW_CLERK_PUBLISHABLE_KEY || '';
  } catch {
    return window.HABITFLOW_CLERK_PUBLISHABLE_KEY || '';
  }
};

const getClerkFrontendApi = (publishableKey) => {
  const part = (publishableKey || '').trim().split('_')[2];
  if (!part) throw new Error('La llave pública de Clerk no parece válida.');
  const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');
  return atob(padded).replace(/\$$/, '');
};

const loadScriptOnce = (id, src, attrs = {}) => new Promise((resolve, reject) => {
  const existing = document.getElementById(id);
  if (existing) {
    if (existing.dataset.loaded === 'true') resolve();
    else existing.addEventListener('load', resolve, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = true;
  script.crossOrigin = 'anonymous';
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  script.onload = () => { script.dataset.loaded = 'true'; resolve(); };
  script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
  document.head.appendChild(script);
});

const loadClerk = async (publishableKey) => {
  const key = (publishableKey || '').trim();
  if (!key.startsWith('pk_')) throw new Error('Pega una Publishable Key de Clerk que empiece por pk_test_ o pk_live_.');
  const frontendApi = getClerkFrontendApi(key);
  await loadScriptOnce('habitflow-clerk-ui', `https://${frontendApi}/npm/@clerk/ui@1/dist/ui.browser.js`);
  await loadScriptOnce('habitflow-clerk-js', `https://${frontendApi}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`, {
    'data-clerk-publishable-key': key
  });
  if (!window.Clerk) throw new Error('Clerk no se inicializó correctamente.');
  await window.Clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor } });
  return window.Clerk;
};

const injectStyles = () => {
  if (document.getElementById('habitflow-dynamic-styles')) return;
  const style = document.createElement('style');
  style.id = 'habitflow-dynamic-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    input, select, textarea { font-size: 14px; }
    button:focus-visible { outline: 2px solid var(--primary, #e11d48); outline-offset: 2px; }
    button:active { transform: scale(0.97); }
    button:not(:disabled):hover { filter: brightness(1.035); }
    button.flash-green { animation: flashScale 0.5s ease-out; }
    @keyframes flashScale { 0% { transform: scale(1.05); box-shadow: 0 0 20px rgba(0,204,122,0.4); } 100% { transform: scale(1); box-shadow: none; } }
    [style*="cursor: pointer"]:hover { filter: brightness(1.025); transition: filter 0.2s; }
    body { font-family: 'Inter', sans-serif; background: var(--app-bg, #0a0a0f); color: var(--app-text, #e8e8f0); overflow-x: hidden; }
    body::before { content: none !important; display: none !important; }
    h1, h2, h3, h4 { font-family: 'DM Serif Display', serif; font-weight: 400; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #12121a; }
    ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #3a3a4a; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes countUp { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
    @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 5px rgba(var(--icon-rgb,225,29,72),0.12); } 50% { box-shadow: 0 0 14px rgba(var(--icon-rgb,225,29,72),0.20); } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes confettiFall { 0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 1; } 100% { transform: translateY(var(--ty, 80px)) translateX(var(--tx, 40px)) rotate(720deg) scale(0); opacity: 0; } }
    @keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }
    @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes checkPop { 0% { transform: scale(0); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
    @keyframes logoGradientFlow {
      0% { background-position: 0% 50%; text-shadow: 0 0 12px rgba(var(--icon-rgb, 225,29,72),0.18); }
      50% { background-position: 100% 50%; text-shadow: 0 0 22px rgba(var(--icon-rgb, 225,29,72),0.34); }
      100% { background-position: 0% 50%; text-shadow: 0 0 12px rgba(var(--icon-rgb, 225,29,72),0.18); }
    }
    @keyframes authGradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes authOrbFloat {
      0%, 100% { transform: translate3d(0,0,0) scale(1); opacity: 0.55; }
      50% { transform: translate3d(20px,-18px,0) scale(1.08); opacity: 0.82; }
    }
    @keyframes labAura {
      0% { transform: translate3d(0,0,0) scale(1); opacity: 0.78; }
      50% { transform: translate3d(0,-12px,0) scale(1.04); opacity: 1; }
      100% { transform: translate3d(0,10px,0) scale(1.02); opacity: 0.82; }
    }
    @keyframes labBorderSpin {
      to { transform: rotate(360deg); }
    }
    @keyframes labPulseLine {
      0%, 100% { opacity: 0.25; transform: scaleX(0.62); }
      50% { opacity: 0.8; transform: scaleX(1); }
    }

    .view-enter { animation: fadeIn 0.3s ease-out; }
    .content-area, .sidebar, header, main { position: relative; z-index: 1; }
    .sidebar-toggle { display: flex; }
    .app-main { position: relative; z-index: 1; background: transparent !important; }
    .app-main h2 {
      background: linear-gradient(160deg, #ffffff 20%, #8a8a8a 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent !important;
      letter-spacing: -0.025em;
    }
    .app-main > .view-enter::before { content: none !important; display: none !important; }
    .lab-shell-card {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(239,239,239,0.10);
      background: linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.045), 0 24px 70px rgba(0,0,0,0.34);
      backdrop-filter: blur(18px);
    }
    .lab-shell-card::after {
      content: '';
      position: absolute;
      inset: -60% auto auto -20%;
      width: 340px;
      height: 340px;
      background: radial-gradient(circle, rgba(var(--icon-rgb,225,29,72),0.11), transparent 70%);
      pointer-events: none;
      filter: blur(8px);
    }
    .lab-hero-title {
      background: linear-gradient(155deg, #ffffff 16%, #b7b7bd 62%, var(--icon-primary,#e11d48) 128%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent !important;
      letter-spacing: -0.045em;
    }
    .lab-pill {
      border: 1px solid rgba(239,239,239,0.12);
      background: rgba(239,239,239,0.045);
      color: rgba(239,239,239,0.78);
      border-radius: 999px;
      backdrop-filter: blur(12px);
    }
    .lab-cta {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(239,239,239,0.14) !important;
      background: linear-gradient(#090909, #090909) padding-box, conic-gradient(from 0deg, transparent, var(--icon-primary,#e11d48), #ffffff, var(--icon-primary,#e11d48), transparent) border-box !important;
      color: #ffffff !important;
      box-shadow: 0 0 20px rgba(var(--icon-rgb,225,29,72),0.11) !important;
    }
    .lab-cta::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: conic-gradient(from 0deg, transparent 0 35%, rgba(var(--icon-rgb,225,29,72),0.42), rgba(255,255,255,0.48), transparent 72%);
      animation: labBorderSpin 6s linear infinite;
      opacity: 0.24;
      pointer-events: none;
    }
    .lab-cta > * { position: relative; z-index: 1; }
    .kpi-card, .habit-card {
      border-color: rgba(239,239,239,0.11) !important;
      background: linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018)) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.26);
    }
    .kpi-card { transition: all 0.3s ease; }
    .kpi-card:hover { transform: translateY(-1px); }
    .kpi-grid { display: grid !important; grid-template-columns: repeat(5, 1fr) !important; gap: 12px !important; }
    .habit-card { transition: all 0.3s ease; }
    .habit-card:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(var(--icon-rgb,225,29,72),0.09); }
    .btn-ripple { position: relative; overflow: hidden; }
    .btn-ripple::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.2); border-radius: 50%; transform: scale(0); opacity: 0; }
    .btn-ripple:active::after { animation: rippleAnim 0.6s ease-out; }
    .skeleton { background: linear-gradient(90deg, #1a1a26 25%, #22223a 50%, #1a1a26 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
    .confetti-piece { position: fixed; width: 8px; height: 8px; border-radius: 2px; pointer-events: none; z-index: 9999; animation: confettiFall 0.8s ease-out forwards; }
    .completed-badge { animation: checkPop 0.3s ease-out; }
    .soft-check {
      color: #d9fff0 !important;
      stroke: #d9fff0 !important;
      filter: none !important;
      stroke-width: 2.6;
    }
    .nav-indicator { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .sidebar-collapsed .user-info:last-child > div {
      width: 38px;
      overflow: hidden;
      white-space: nowrap;
      font-size: 0 !important;
    }
    .sidebar-collapsed .user-info:last-child .streak-compact-count {
      display: inline-flex !important;
      font-size: 11px;
      line-height: 1;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
    }
    .fire-logo {
      background: linear-gradient(120deg, var(--icon-hover, #ffffff) 0%, var(--icon-primary, #e11d48) 35%, var(--icon-deep, #7f1028) 62%, var(--icon-hover, #ffffff) 100%);
      background-size: 240% 240%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent !important;
      text-shadow: 0 0 12px rgba(var(--icon-rgb, 225,29,72),0.14);
      animation: logoGradientFlow 4.8s ease-in-out infinite;
    }
    .brand-lockup {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      line-height: 1;
      color: #f7f7f8;
      text-decoration: none;
    }
    .brand-lockup.center {
      justify-content: center;
      width: 100%;
    }
    .brand-lockup.compact {
      justify-content: center;
      gap: 0;
    }
    .brand-mark {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      display: block;
      object-fit: cover;
      background: #000;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.10), 0 12px 28px rgba(0,0,0,0.42), 0 0 22px rgba(var(--icon-rgb,225,29,72),0.14);
    }
    .brand-word {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.04em;
      background: linear-gradient(120deg, #ffffff 0%, #f2f2f4 32%, var(--icon-primary, #e11d48) 76%, #ffffff 100%);
      background-size: 220% 220%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 0 18px rgba(var(--icon-rgb,225,29,72),0.12);
      animation: logoGradientFlow 5.8s ease-in-out infinite;
    }
    .brand-lockup.lg .brand-mark { width: 48px; height: 48px; border-radius: 15px; }
    .brand-lockup.lg .brand-word { font-size: 42px; }
    .brand-lockup.md .brand-mark { width: 42px; height: 42px; border-radius: 14px; }
    .brand-lockup.md .brand-word { font-size: 32px; }
    .brand-lockup.sm .brand-mark { width: 34px; height: 34px; border-radius: 11px; }
    .brand-lockup.sm .brand-word { font-size: 22px; }
    .auth-screen {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      background:
        radial-gradient(circle at 20% 15%, rgba(var(--icon-rgb,225,29,72),0.14), transparent 30%),
        radial-gradient(circle at 80% 20%, rgba(239,239,239,0.08), transparent 28%),
        linear-gradient(135deg, #000000, #070708, #101018, #000000);
      background-size: 180% 180%;
      animation: authGradientMove 12s ease-in-out infinite;
    }
    .auth-screen::before, .auth-screen::after {
      content: '';
      position: absolute;
      width: 380px;
      height: 380px;
      border-radius: 999px;
      filter: blur(38px);
      pointer-events: none;
      animation: authOrbFloat 8s ease-in-out infinite;
    }
    .auth-screen::before {
      left: -120px;
      bottom: 8%;
      background: rgba(var(--icon-rgb,225,29,72),0.13);
    }
    .auth-screen::after {
      right: -130px;
      top: 10%;
      background: rgba(239,239,239,0.08);
      animation-delay: -3s;
    }
    .auth-shell {
      width: min(980px, 100%);
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 420px;
      gap: 26px;
      align-items: center;
    }
    .auth-hero-card, .auth-form-card {
      border: 1px solid rgba(255,255,255,0.095);
      background: linear-gradient(145deg, rgba(13,13,16,0.86), rgba(5,5,5,0.72));
      box-shadow: 0 28px 80px rgba(0,0,0,0.48);
      backdrop-filter: blur(18px);
    }
    .auth-hero-card {
      min-height: 500px;
      border-radius: 28px;
      padding: 34px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .auth-form-card {
      border-radius: 26px;
      padding: 18px;
    }
    .auth-feature-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 12px;
      border-radius: 999px;
      border: 1px solid rgba(var(--icon-rgb,225,29,72),0.22);
      background: rgba(var(--icon-rgb,225,29,72),0.08);
      color: #f2f2f4;
      font-size: 12px;
      font-family: 'Inter', sans-serif;
    }
    .auth-form-card .cl-rootBox, .auth-form-card .cl-card {
      width: 100%;
    }
    .auth-form-card .cl-card {
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }
    .auth-form-card .cl-headerTitle {
      font-family: 'DM Serif Display', serif !important;
      font-weight: 400 !important;
      color: #f2f2f4 !important;
      font-size: 26px !important;
    }
    .auth-form-card .cl-headerSubtitle, .auth-form-card .cl-footerActionText, .auth-form-card .cl-formFieldLabel,
    .auth-form-card .cl-dividerText, .auth-form-card .cl-footerPagesLink {
      color: #8c8c96 !important;
    }
    .auth-form-card .cl-socialButtonsBlockButton, .auth-form-card .cl-formButtonPrimary {
      border-radius: 12px !important;
    }
    .auth-form-card .cl-socialButtonsBlockButton {
      background: rgba(255,255,255,0.055) !important;
      border: 1px solid rgba(255,255,255,0.10) !important;
      color: #e9e9ef !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.055) !important;
    }
    .auth-form-card .cl-socialButtonsBlockButton:hover {
      background: rgba(var(--icon-rgb,225,29,72),0.10) !important;
      border-color: rgba(var(--icon-rgb,225,29,72),0.34) !important;
    }
    .auth-form-card .cl-formButtonPrimary {
      background: linear-gradient(135deg, var(--icon-primary,#e11d48), var(--icon-deep,#7f1028)) !important;
      box-shadow: 0 10px 22px rgba(var(--icon-rgb,225,29,72),0.16) !important;
      color: #fff !important;
    }
    .auth-form-card .cl-formFieldInput {
      background: rgba(255,255,255,0.055) !important;
      color: #f2f2f4 !important;
      border: 1px solid rgba(255,255,255,0.13) !important;
      border-radius: 12px !important;
    }
    .auth-form-card .cl-formFieldInput:focus {
      border-color: rgba(var(--icon-rgb,225,29,72),0.55) !important;
      box-shadow: 0 0 0 3px rgba(var(--icon-rgb,225,29,72),0.13) !important;
    }
    .auth-form-card .cl-formFieldInput::placeholder {
      color: rgba(242,242,244,0.34) !important;
    }
    .auth-form-card .cl-dividerLine {
      background: rgba(255,255,255,0.08) !important;
    }
    .auth-form-card .cl-footer {
      background: rgba(0,0,0,0.38) !important;
      border-top: 1px solid rgba(255,255,255,0.06) !important;
    }
    .auth-form-card .cl-footerActionLink, .auth-form-card .cl-formFieldAction {
      color: var(--icon-primary,#e11d48) !important;
    }
    @media (max-width: 860px) {
      .auth-shell { grid-template-columns: 1fr; max-width: 460px; }
      .auth-hero-card { min-height: auto; padding: 26px; }
      .auth-hero-side { display: none; }
      .auth-screen { padding: 18px; }
    }
    body svg:not(.recharts-surface):not(.kpi-progress-ring):not(.soft-check) {
      color: var(--icon-primary, #e11d48) !important;
      stroke: var(--icon-primary, #e11d48) !important;
      filter: drop-shadow(0 0 4px rgba(var(--icon-rgb, 225,29,72),0.12));
      stroke-width: 2.2;
    }
    button:hover svg:not(.recharts-surface):not(.kpi-progress-ring):not(.soft-check) {
      color: var(--icon-hover, #ffffff) !important;
      stroke: var(--icon-hover, #ffffff) !important;
      filter: drop-shadow(0 0 6px rgba(var(--icon-rgb, 225,29,72),0.18));
    }
    .fire-emoji {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--icon-primary, #e11d48) !important;
      text-shadow: 0 0 6px rgba(var(--icon-rgb, 225,29,72),0.20), 0 0 12px rgba(var(--icon-rgb, 225,29,72),0.08);
      filter: saturate(1.04) drop-shadow(0 0 3px rgba(var(--icon-rgb, 225,29,72),0.12));
    }
    button:hover .fire-emoji, [style*="cursor: pointer"]:hover .fire-emoji {
      text-shadow: 0 0 8px rgba(var(--icon-rgb, 225,29,72),0.24), 0 0 16px rgba(var(--icon-rgb, 225,29,72),0.10);
      filter: saturate(1.08) drop-shadow(0 0 4px rgba(var(--icon-rgb, 225,29,72),0.16));
    }
    .recharts-tooltip-cursor { fill: transparent !important; stroke: rgba(255,255,255,0.12) !important; }
    .recharts-default-tooltip { background: var(--tooltip-bg, #0d0d10) !important; border: 1px solid var(--tooltip-border, rgba(255,255,255,0.10)) !important; border-radius: 10px !important; box-shadow: 0 10px 32px rgba(0,0,0,0.18) !important; }
    .recharts-tooltip-label, .recharts-tooltip-item { color: var(--app-text, #f2f2f4) !important; }
    html[data-theme-mode="pinkLight"] input,
    html[data-theme-mode="pinkLight"] textarea,
    html[data-theme-mode="pinkLight"] select {
      background: #fffafd !important;
      color: #30202a !important;
      border-color: rgba(190,18,60,0.18) !important;
    }
    html[data-theme-mode="pinkLight"] input::placeholder,
    html[data-theme-mode="pinkLight"] textarea::placeholder {
      color: #9a6a7f !important;
      opacity: 1 !important;
    }
    html[data-theme-mode="pinkLight"] .lab-pill {
      background: rgba(225,29,72,0.08) !important;
      border-color: rgba(225,29,72,0.22) !important;
      color: #5d2a3d !important;
    }
    .stats-grid-2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 18px !important; }
    .kpi-grid-2col { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
    .app-main { padding: 24px 28px; max-width: 1280px; margin: 0 auto; width: 100%; }
    .mobile-only { display: none !important; }

    :root {
      --hf-radius-xs: 10px;
      --hf-radius-sm: 14px;
      --hf-radius-md: 18px;
      --hf-radius-lg: 26px;
      --hf-glass: linear-gradient(145deg, rgba(255,255,255,0.052), rgba(255,255,255,0.018));
      --hf-glass-quiet: linear-gradient(145deg, rgba(255,255,255,0.038), rgba(255,255,255,0.012));
      --hf-shadow: 0 22px 58px rgba(0,0,0,0.26);
      --hf-shadow-soft: 0 12px 32px rgba(0,0,0,0.18);
    }
    body {
      background:
        radial-gradient(circle at 12% 10%, rgba(var(--icon-rgb,225,29,72),0.10), transparent 26%),
        radial-gradient(circle at 84% 18%, rgba(255,255,255,0.045), transparent 24%),
        radial-gradient(circle at 72% 86%, rgba(var(--icon-rgb,225,29,72),0.055), transparent 32%),
        var(--app-bg, #050505) !important;
    }
    .content-area > header {
      border-bottom: 1px solid var(--app-border, rgba(255,255,255,0.08)) !important;
      background: var(--header-bg, rgba(0,0,0,0.92)) !important;
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }
    .sidebar {
      border-right: 1px solid var(--app-border, rgba(255,255,255,0.08)) !important;
      background:
        radial-gradient(circle at 40% 0%, rgba(var(--icon-rgb,225,29,72),0.09), transparent 25%),
        var(--app-surface, #050505) !important;
    }
    .view-enter {
      animation: fadeIn 0.28s cubic-bezier(.2,.8,.2,1);
    }
    input, textarea, select {
      transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    }
    input:focus, textarea:focus, select:focus {
      border-color: rgba(var(--icon-rgb,225,29,72),0.48) !important;
      box-shadow: 0 0 0 4px rgba(var(--icon-rgb,225,29,72),0.10) !important;
    }
    button {
      transition: transform 0.18s ease, filter 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
    }
    button:disabled {
      cursor: not-allowed !important;
      opacity: 0.52 !important;
      filter: grayscale(0.25);
    }
    .lab-shell-card,
    .finance-card,
    .kpi-card,
    .habit-card {
      border-radius: var(--hf-radius-lg) !important;
      border-color: rgba(255,255,255,0.105) !important;
      background: var(--hf-glass) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.045), var(--hf-shadow) !important;
    }
    .finance-card,
    .reading-view [style*="box-shadow"] {
      background: var(--hf-glass-quiet) !important;
    }
    .lab-pill {
      min-height: 26px;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      letter-spacing: 0.015em;
    }
    .lab-cta {
      min-height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 800 !important;
      letter-spacing: -0.01em;
    }
    .lab-cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 26px rgba(var(--icon-rgb,225,29,72),0.18) !important;
    }
    .kpi-card:hover,
    .habit-card:hover,
    .finance-card:hover,
    .reading-view [style*="box-shadow"]:hover {
      border-color: rgba(var(--icon-rgb,225,29,72),0.24) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 70px rgba(0,0,0,0.30) !important;
    }
    .app-main h1,
    .app-main h2 {
      text-wrap: balance;
    }
    .app-main p,
    .app-main div {
      text-rendering: geometricPrecision;
    }
    .top-sync,
    .top-random {
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }
    .mobile-more-popover {
      box-shadow: 0 -18px 54px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05) !important;
    }
    .recharts-cartesian-grid line {
      stroke-opacity: 0.45 !important;
    }
    .recharts-text {
      fill: var(--app-text-dim, #8888a0) !important;
    }
    .reading-view iframe {
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.22);
    }
    html[data-theme-mode="pinkLight"] {
      --hf-glass: linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,240,246,0.78));
      --hf-glass-quiet: linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,247,251,0.86));
      --hf-shadow: 0 22px 58px rgba(190,18,60,0.12);
      --hf-shadow-soft: 0 12px 32px rgba(190,18,60,0.09);
    }
    html[data-theme-mode="pinkLight"] body {
      background:
        radial-gradient(circle at 12% 8%, rgba(251,113,133,0.20), transparent 28%),
        radial-gradient(circle at 82% 18%, rgba(255,255,255,0.86), transparent 24%),
        linear-gradient(135deg, #fff7fb, #fff0f6 46%, #ffffff) !important;
    }
    html[data-theme-mode="pinkLight"] .app-main h2,
    html[data-theme-mode="pinkLight"] .lab-hero-title {
      background: linear-gradient(150deg, #24131c 12%, #8a3154 58%, #e11d48 108%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent !important;
    }
    html[data-theme-mode="pinkLight"] .content-area > header,
    html[data-theme-mode="pinkLight"] .sidebar {
      background: rgba(255,247,251,0.86) !important;
      border-color: rgba(190,18,60,0.14) !important;
    }
    html[data-theme-mode="pinkLight"] .lab-cta {
      background: linear-gradient(135deg, #e11d48, #fb7185) !important;
      border-color: rgba(190,18,60,0.22) !important;
      box-shadow: 0 12px 26px rgba(225,29,72,0.18) !important;
    }
    html[data-theme-mode="pinkLight"] .lab-cta::before {
      display: none !important;
    }
    html[data-theme-mode="pinkLight"] .kpi-card,
    html[data-theme-mode="pinkLight"] .habit-card,
    html[data-theme-mode="pinkLight"] .finance-card,
    html[data-theme-mode="pinkLight"] .lab-shell-card {
      border-color: rgba(190,18,60,0.16) !important;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.001ms !important;
      }
    }

    @media (max-width: 768px) {
      .mobile-only { display: flex !important; }
      .desktop-only { display: none !important; }
      .mobile-bottom-nav { display: flex !important; }
      html, body { width: 100%; max-width: 100%; overflow-x: hidden; overscroll-behavior-y: contain; }
      body { -webkit-text-size-adjust: 100%; touch-action: manipulation; }
      * { -webkit-tap-highlight-color: transparent; }
      #root, #root > div, .view-enter, .app-main, .app-main > .view-enter, .app-main > .view-enter > div {
        max-width: 100vw !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
      }
      input, select, textarea { font-size: 16px !important; min-width: 0; }
      button, input, select, textarea { max-width: 100%; }
      .app-main { padding: 16px 14px 20px !important; }
      .content-area { margin-left: 0 !important; margin-bottom: 72px; }
      .sidebar { display: none !important; }
      .sidebar-toggle { display: none !important; }
      .stats-grid { grid-template-columns: 1fr !important; }
      .stats-grid-2 { grid-template-columns: 1fr !important; }
      .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
      .mobile-header-btn { display: flex !important; }
      .chart-container { overflow-x: auto; }
      .chart-container > * { min-width: 500px; }
    }
    @media (max-width: 480px) {
      .app-main {
        width: 100% !important;
        max-width: 100% !important;
        padding: 12px 12px calc(96px + env(safe-area-inset-bottom)) !important;
      }
      .content-area {
        width: 100% !important;
        min-width: 0 !important;
        margin-bottom: calc(84px + env(safe-area-inset-bottom)) !important;
      }
      .view-enter > div {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-area > header {
        padding: calc(10px + env(safe-area-inset-top)) 12px 9px !important;
        gap: 8px !important;
        align-items: center !important;
        background: var(--header-bg, rgba(0,0,0,0.92)) !important;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .mobile-header-btn { display: none !important; }
      .top-identity { gap: 8px !important; min-width: 0 !important; }
      .top-identity > div:last-child { min-width: 0 !important; max-width: 135px !important; overflow: hidden !important; }
      .top-identity > div:last-child > div:first-child {
        max-width: 135px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        font-size: 13px !important;
      }
      .top-identity > div:last-child > div:nth-child(2) {
        max-width: 135px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        font-size: 9.5px !important;
      }
      .top-identity > div:last-child > div:nth-child(3) { font-size: 8px !important; }
      .top-actions { gap: 7px !important; min-width: 0 !important; }
      .top-random, .top-xp { display: none !important; }
      .top-sync {
        padding: 5px 8px !important;
        max-width: 116px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        font-size: 9px !important;
      }
      .top-streak { gap: 3px !important; font-size: 11px !important; }
      .top-streak svg { width: 14px !important; height: 14px !important; }
      .top-user { transform: scale(0.88); transform-origin: right center; width: 31px; height: 31px; overflow: visible; }
      .mobile-bottom-nav {
        height: calc(68px + env(safe-area-inset-bottom)) !important;
        padding: 6px 6px calc(7px + env(safe-area-inset-bottom)) !important;
        background: var(--mobile-nav-bg, rgba(5,5,5,0.94)) !important;
        border-top: 1px solid var(--app-border, rgba(255,255,255,0.08)) !important;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 -18px 38px var(--mobile-nav-shadow, rgba(0,0,0,0.42));
      }
      .mobile-bottom-nav button {
        min-width: 0 !important;
        min-height: 50px !important;
        padding: 6px 5px !important;
        border-radius: 14px !important;
        justify-content: center !important;
      }
      .mobile-bottom-nav svg { width: 18px !important; height: 18px !important; }
      .mobile-bottom-nav span {
        max-width: 58px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        font-size: 9px !important;
        line-height: 1.1 !important;
      }
      .mobile-bottom-nav [style*="bottom: 100%"] {
        right: 4px !important;
        min-width: 185px !important;
        max-height: min(420px, calc(100vh - 130px)) !important;
        overflow-y: auto !important;
        border-radius: 18px !important;
      }
      .mobile-more-popover {
        width: 178px !important;
        min-width: 178px !important;
        max-width: 178px !important;
        right: 6px !important;
        padding: 8px !important;
      }
      .mobile-more-popover button {
        width: 100% !important;
        min-height: 42px !important;
        display: grid !important;
        grid-template-columns: 24px minmax(0, 1fr) !important;
        justify-items: start !important;
        justify-content: start !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 8px 10px !important;
        text-align: left !important;
      }
      .mobile-more-popover button svg {
        justify-self: center !important;
      }
      .mobile-more-popover button span {
        max-width: 112px !important;
        font-size: 12px !important;
        text-align: left !important;
      }
      .app-main h1 {
        font-size: clamp(31px, 11vw, 46px) !important;
        line-height: 0.98 !important;
        letter-spacing: -0.052em !important;
      }
      .app-main h2 { font-size: clamp(24px, 8vw, 34px) !important; line-height: 1.02 !important; }
      .app-main h3 { font-size: 17px !important; }
      .kpi-grid { grid-template-columns: 1fr 1fr !important; gap: 9px !important; }
      .kpi-card {
        min-height: 112px !important;
        padding: 13px !important;
        border-radius: 16px !important;
      }
      .kpi-card [style*="font-size: 28"] { font-size: 23px !important; }
      .kpi-card [style*="font-size: 10"] { font-size: 9px !important; }
      .habit-card { border-radius: 15px !important; padding: 10px !important; }
      .lab-shell-card, .auth-form-card, .auth-hero-card {
        border-radius: 20px !important;
      }
      [style*="grid-template-columns: 1fr 280px"],
      [style*="grid-template-columns: minmax(0, 1.45fr) minmax(330px, 0.9fr)"],
      [style*="grid-template-columns: minmax(0, 1fr) 270px"],
      [style*="grid-template-columns: minmax(0, 1fr) 340px"],
      [style*="grid-template-columns: repeat(6, 1fr)"],
      [style*="grid-template-columns: repeat(4, 1fr)"],
      [style*="grid-template-columns: repeat(auto-fit, minmax(170px, 1fr))"],
      [style*="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))"],
      [style*="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))"],
      [style*="grid-template-columns: repeat(auto-fit, minmax(145px, 1fr))"],
      [style*="grid-template-columns: repeat(auto-fit, minmax(132px, 1fr))"],
      [style*="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr))"],
      [style*="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))"],
      [style*="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))"],
      [style*="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))"],
      [style*="grid-template-columns: 110px 1fr 1fr"],
      [style*="grid-template-columns: 1fr 1fr 1fr auto"],
      [style*="grid-template-columns: 1fr 110px"],
      [style*="grid-template-columns: 1fr 96px auto"],
      [style*="grid-template-columns: 1fr 82px 58px"],
      [style*="grid-template-columns: 1fr auto"],
      [style*="grid-template-columns: 1fr auto auto"],
      [style*="grid-template-columns: 1fr 110px auto"],
      [style*="grid-template-columns: 1fr 1fr 1fr 1fr"],
      [style*="grid-template-columns: 70px 1fr 1fr 48px"],
      [style*="grid-template-columns: 1fr 1fr"] {
        grid-template-columns: 1fr !important;
      }
      [style*="min-width: 250px"],
      [style*="min-width: 260px"],
      [style*="min-width: 280px"],
      [style*="min-width: 300px"],
      [style*="min-width: 330px"],
      [style*="min-width: 340px"] {
        min-width: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      [style*="width: 260px"],
      [style*="width: 270px"],
      [style*="width: 280px"],
      [style*="width: 300px"],
      [style*="width: 330px"],
      [style*="width: 340px"] {
        width: 100% !important;
        max-width: 100% !important;
      }
      [style*="grid-template-columns: repeat(30, 1fr)"] {
        grid-template-columns: repeat(15, 1fr) !important;
      }
      [style*="grid-template-columns: repeat(auto-fit, minmax(300px, 360px))"] {
        grid-template-columns: minmax(0, 1fr) !important;
        justify-content: stretch !important;
      }
      [style*="max-width: 360"] { max-width: 100% !important; }
      [style*="height: 220"] { height: 190px !important; }
      .chart-container > * { min-width: 420px !important; }
      .recharts-wrapper, .recharts-responsive-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .recharts-surface { max-width: 100% !important; }
      .workout-session-shell {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        height: 100dvh !important;
      }
      .workout-session-header {
        grid-template-columns: 1fr auto !important;
        min-height: auto !important;
        padding: calc(10px + env(safe-area-inset-top)) 12px 10px !important;
        gap: 8px !important;
        align-items: center !important;
      }
      .workout-session-header > div:first-child {
        justify-self: start !important;
        padding: 7px 10px !important;
        font-size: 15px !important;
      }
      .workout-session-header > div:nth-child(2) {
        display: none !important;
      }
      .workout-session-header > button,
      .workout-session-header > div:last-child {
        justify-self: end !important;
      }
      .workout-session-progress {
        padding: 10px 12px !important;
      }
      .workout-session-body {
        display: block !important;
        overflow: visible !important;
        padding: 12px 12px calc(94px + env(safe-area-inset-bottom)) !important;
      }
      .workout-session-main {
        width: 100% !important;
        max-width: 100% !important;
        overflow: visible !important;
        margin: 0 !important;
        border-radius: 18px !important;
        padding: 14px !important;
      }
      .workout-session-main [style*="font-size: 28"] {
        font-size: 25px !important;
        line-height: 1.05 !important;
      }
      .workout-set-grid {
        grid-template-columns: 52px minmax(0, 1fr) minmax(0, 1fr) 34px !important;
        gap: 6px !important;
        padding: 9px 8px !important;
      }
      .workout-set-grid input {
        padding: 7px 6px !important;
        font-size: 16px !important;
      }
      .workout-session-main > div:last-child {
        flex-direction: column !important;
        gap: 8px !important;
      }
      .workout-session-main > div:last-child button {
        width: 100% !important;
      }
      .finance-mobile-view {
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
        overflow-x: hidden !important;
      }
      .finance-hero {
        padding: 18px !important;
        border-radius: 20px !important;
        margin-bottom: 14px !important;
      }
      .finance-hero-grid {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }
      .finance-hero h2 {
        font-size: 30px !important;
        line-height: 1 !important;
        margin-bottom: 8px !important;
      }
      .finance-available-card {
        min-width: 0 !important;
        width: 100% !important;
        padding: 14px !important;
        border-radius: 16px !important;
        background: rgba(255,255,255,0.035) !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
      }
      .finance-available-card [style*="font-size: 34"] {
        font-size: 28px !important;
      }
      .finance-kpis {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 9px !important;
        margin-bottom: 14px !important;
      }
      .finance-kpis .kpi-card {
        min-height: 104px !important;
        padding: 13px !important;
        border-radius: 16px !important;
      }
      .finance-kpis .kpi-card > div:first-child {
        font-size: 8.5px !important;
        line-height: 1.25 !important;
      }
      .finance-kpis .kpi-card > div:last-child {
        font-size: 18px !important;
        line-height: 1.05 !important;
        word-break: break-word !important;
      }
      .finance-layout,
      .finance-main-column,
      .finance-side-column {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 14px !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .finance-card {
        padding: 16px !important;
        border-radius: 18px !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        overflow: hidden !important;
        box-shadow: 0 12px 34px rgba(0,0,0,0.22) !important;
      }
      .finance-card h3 {
        font-size: 19px !important;
        line-height: 1.08 !important;
        margin-bottom: 12px !important;
      }
      .finance-card-header,
      .finance-card-header-wrap {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 10px !important;
        align-items: stretch !important;
      }
      .finance-card-header input[type="month"] {
        width: 100% !important;
      }
      .finance-form-row,
      .finance-form-row-3,
      .finance-form-row-4,
      .finance-compact-form,
      .finance-goal-form {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 9px !important;
        width: 100% !important;
        margin-bottom: 9px !important;
      }
      .finance-inline-form,
      .finance-filter-row {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 9px !important;
        width: 100% !important;
      }
      .finance-mobile-view input,
      .finance-mobile-view select {
        width: 100% !important;
        min-height: 44px !important;
        font-size: 16px !important;
      }
      .finance-mobile-view button {
        min-height: 40px !important;
        font-size: 14px !important;
        justify-content: center !important;
      }
      .finance-submit-button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 7px !important;
      }
      body .finance-mobile-view .finance-submit-button svg:not(.recharts-surface):not(.kpi-progress-ring):not(.soft-check),
      body .finance-mobile-view .finance-icon-button svg:not(.recharts-surface):not(.kpi-progress-ring):not(.soft-check) {
        color: #ffffff !important;
        stroke: #ffffff !important;
      }
      .finance-form-row button,
      .finance-compact-form button,
      .finance-goal-form > button,
      .finance-action-button {
        width: 100% !important;
      }
      .finance-icon-button {
        width: 44px !important;
        min-width: 44px !important;
        height: 44px !important;
        min-height: 44px !important;
        padding: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 12px !important;
        flex: 0 0 44px !important;
      }
      .finance-category-form {
        grid-template-columns: minmax(0, 1fr) 44px !important;
        align-items: center !important;
      }
      .finance-recurring-card > div:first-of-type {
        gap: 10px !important;
      }
      .finance-recurring-actions {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) 44px !important;
        gap: 8px !important;
        align-items: center !important;
      }
      .finance-recurring-actions .finance-action-button {
        min-height: 42px !important;
        border-radius: 12px !important;
        padding: 0 12px !important;
        font-size: 13px !important;
      }
      .finance-transaction-item {
        display: grid !important;
        grid-template-columns: 8px minmax(0, 1fr) auto 32px !important;
        gap: 9px !important;
        align-items: center !important;
      }
      .finance-transaction-item > div:nth-child(2) {
        min-width: 0 !important;
      }
      .finance-transaction-item > div:nth-child(2) > div {
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      .finance-transaction-item > div:nth-child(3) {
        font-size: 12px !important;
        max-width: 92px !important;
        text-align: right !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      .finance-chart-card .recharts-responsive-container,
      .finance-pie-card .recharts-responsive-container {
        height: 220px !important;
      }
      .finance-pie-card {
        padding-bottom: 18px !important;
      }
      .finance-categories-card .lab-pill {
        max-width: 100% !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      .finance-currency-controls {
        grid-template-columns: 1fr !important;
      }
      .reading-view {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
      }
      .reading-view .lab-shell-card {
        padding: 20px !important;
        border-radius: 22px !important;
        margin-bottom: 14px !important;
      }
      .reading-view .lab-hero-title {
        font-size: 31px !important;
        line-height: 1 !important;
      }
      .reading-layout,
      .reading-notes-grid {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 14px !important;
      }
      .reading-toolbar,
      .reading-progress-row {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 10px !important;
      }
      .reading-view iframe {
        height: 68vh !important;
        min-height: 420px !important;
      }
      .reading-view input,
      .reading-view button {
        min-height: 44px !important;
        font-size: 16px !important;
      }
      .habits-mobile-view .habit-stats-grid,
      .pomodoro-mobile-view .pomodoro-kpis,
      .study-mobile-view .study-kpis {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 9px !important;
      }
      .habits-mobile-view .habit-stats-grid > div,
      .pomodoro-mobile-view .pomodoro-kpis > div,
      .study-mobile-view .study-kpis > div {
        min-height: 86px !important;
        padding: 12px !important;
        border-radius: 15px !important;
      }
      .habits-mobile-view .habit-card > div:first-child {
        gap: 10px !important;
        align-items: flex-start !important;
      }
      .habits-mobile-view .habit-card > div:first-child > div:first-child {
        min-width: 0 !important;
      }
      .habits-mobile-view .habit-card > div:first-child > div:last-child {
        flex-wrap: wrap !important;
        justify-content: flex-end !important;
        max-width: 168px !important;
        gap: 2px !important;
      }
      .habits-mobile-view .habit-card > div:first-child > div:last-child button {
        width: 22px !important;
        height: 22px !important;
        min-height: 22px !important;
        padding: 0 !important;
        border-radius: 6px !important;
        font-size: 9px !important;
      }
      .habits-mobile-view .habit-card > div:first-child > div:last-child button:first-child {
        width: auto !important;
        min-width: 44px !important;
        padding: 0 7px !important;
      }
      .habits-mobile-view .habit-skip-mobile {
        display: none !important;
      }
      .habits-mobile-view .habit-card [style*="font-size: 15"] {
        line-height: 1.15 !important;
      }
      .habits-toolbar {
        display: grid !important;
        grid-template-columns: 1fr !important;
        justify-items: start !important;
        align-items: start !important;
        gap: 10px !important;
        margin-bottom: 16px !important;
      }
      .habits-toolbar > h2 {
        width: 100% !important;
      }
      .habits-toolbar > div:last-child {
        width: auto !important;
        max-width: 100% !important;
        display: inline-flex !important;
        justify-content: flex-start !important;
        align-items: center !important;
        gap: 8px !important;
        flex-wrap: nowrap !important;
      }
      .habits-toolbar > div:last-child > div:first-child {
        flex: 0 1 auto !important;
        max-width: calc(100vw - 124px) !important;
        overflow-x: auto !important;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .habits-toolbar > div:last-child > div:first-child::-webkit-scrollbar {
        display: none;
      }
      .habits-toolbar > div:last-child > button {
        flex: 0 0 auto !important;
      }
      .habits-toolbar > div:last-child button {
        min-height: 42px !important;
        white-space: nowrap !important;
      }
      .habits-date-row {
        width: 100% !important;
        justify-content: space-between !important;
        gap: 6px !important;
      }
      .habits-date-row span {
        min-width: 0 !important;
        flex: 1 !important;
        font-size: 13px !important;
      }
      .habits-filter-row {
        gap: 7px !important;
        margin-bottom: 16px !important;
      }
      .settings-mobile-view {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
        padding-right: 3px !important;
        box-sizing: border-box !important;
      }
      .settings-stack {
        width: 100% !important;
        max-width: 100% !important;
        gap: 14px !important;
        box-sizing: border-box !important;
      }
      .settings-stack > div {
        width: calc(100% - 2px) !important;
        max-width: calc(100% - 2px) !important;
        margin-right: 2px !important;
        box-sizing: border-box !important;
        border-radius: 18px !important;
        padding: 18px !important;
        overflow: hidden !important;
      }
      .settings-stack > div * {
        box-sizing: border-box !important;
      }
      .settings-stack h3 {
        line-height: 1.15 !important;
      }
      .settings-stack input,
      .settings-stack select,
      .settings-stack textarea {
        min-width: 0 !important;
        width: 100% !important;
      }
      .settings-stack [style*="display: flex"] {
        min-width: 0 !important;
      }
      .settings-stack [style*="display: flex"][style*="gap: 8"],
      .settings-stack [style*="display: flex"][style*="gap: 12"] {
        flex-wrap: wrap !important;
      }
      .settings-stack [style*="display: flex"][style*="gap: 8"] > input,
      .settings-stack [style*="display: flex"][style*="gap: 12"] > input {
        flex: 1 1 100% !important;
      }
      .settings-stack [style*="display: grid"] {
        max-width: 100% !important;
      }
      .settings-stack [style*="grid-template-columns: repeat(3, 1fr)"] {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
      .settings-stack [style*="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))"],
      .settings-stack [style*="grid-template-columns: repeat(auto-fit, minmax(132px, 1fr))"] {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .settings-stack [style*="display: flex"][style*="gap: 12"] > button {
        flex: 1 1 calc(50% - 6px) !important;
        min-width: 0 !important;
      }
      .settings-stack button {
        max-width: 100% !important;
        min-height: 42px !important;
      }
      .pomodoro-head {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        margin-bottom: 16px !important;
      }
      .pomodoro-modes,
      .workout-tabs,
      .stats-period-row,
      .agenda-view-tabs {
        overflow-x: auto !important;
        flex-wrap: nowrap !important;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 2px !important;
      }
      .pomodoro-modes::-webkit-scrollbar,
      .workout-tabs::-webkit-scrollbar,
      .stats-period-row::-webkit-scrollbar,
      .agenda-view-tabs::-webkit-scrollbar {
        display: none;
      }
      .pomodoro-modes button,
      .workout-tabs button,
      .stats-period-row button,
      .agenda-view-tabs button {
        flex: 0 0 auto !important;
        white-space: nowrap !important;
      }
      .pomodoro-main-grid {
        grid-template-columns: 1fr !important;
        gap: 14px !important;
        margin-bottom: 14px !important;
      }
      .pomodoro-timer-card {
        padding: 18px !important;
        border-radius: 18px !important;
      }
      .pomodoro-timer-ring {
        width: 210px !important;
        height: 210px !important;
      }
      .pomodoro-timer-ring svg {
        width: 210px !important;
        height: 210px !important;
      }
      .pomodoro-timer-ring [style*="font-size: 56"] {
        font-size: 42px !important;
      }
      .pomodoro-timer-card [style*="width: 72"] {
        width: 64px !important;
        height: 64px !important;
      }
      .pomodoro-timer-card [style*="gap: 20"] {
        gap: 10px !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
      }
      .study-mobile-view .lab-shell-card {
        padding: 20px !important;
        border-radius: 20px !important;
        margin-bottom: 14px !important;
      }
      .study-mobile-view .lab-hero-title {
        font-size: 30px !important;
        line-height: 1.02 !important;
      }
      .study-layout {
        grid-template-columns: 1fr !important;
        gap: 14px !important;
      }
      .study-topic-add {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) 44px !important;
        gap: 8px !important;
      }
      .study-topic-add button {
        width: 44px !important;
        min-width: 44px !important;
        padding: 0 !important;
      }
      .workout-tabs {
        margin-right: -12px !important;
        padding-right: 12px !important;
        margin-bottom: 16px !important;
      }
      .workout-tabs button {
        padding: 10px 12px !important;
        border-radius: 16px !important;
        font-size: 12px !important;
        gap: 4px !important;
      }
      .workout-routine-header {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 10px !important;
        align-items: stretch !important;
      }
      .workout-routine-header > div {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 8px !important;
      }
      .workout-routine-header button {
        width: 100% !important;
        justify-content: center !important;
        min-height: 42px !important;
      }
      .stats-head {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        margin-bottom: 16px !important;
      }
      .stats-period-row {
        width: 100% !important;
      }
      .stats-period-row button {
        min-width: 104px !important;
        min-height: 44px !important;
      }
      .stats-chart-card {
        padding: 16px !important;
        border-radius: 18px !important;
        overflow: hidden !important;
      }
      .stats-chart-card h3 {
        margin-bottom: 12px !important;
      }
      .stats-mobile-view .chart-container {
        overflow: hidden !important;
        margin: 0 -10px !important;
      }
      .stats-mobile-view .chart-container > * {
        min-width: 0 !important;
      }
      .stats-mobile-view .recharts-responsive-container {
        height: 220px !important;
      }
      .stats-mobile-view .recharts-legend-wrapper {
        display: none !important;
      }
      .agenda-mobile-view {
        max-width: 100% !important;
      }
      .agenda-topbar {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 12px !important;
        margin-bottom: 14px !important;
      }
      .agenda-top-actions {
        width: 100% !important;
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 7px !important;
      }
      .agenda-top-actions > div:first-child {
        order: 10 !important;
        width: 100% !important;
        text-align: left !important;
        margin-right: 0 !important;
      }
      .agenda-top-actions > button {
        min-height: 42px !important;
      }
      .agenda-top-actions > button:last-child {
        flex: 1 1 150px !important;
      }
      .agenda-view-tabs {
        margin-right: -12px !important;
        padding-right: 12px !important;
      }
      .agenda-view-tabs > div {
        flex: 0 0 8px !important;
      }
      .agenda-quick-capture {
        padding: 9px !important;
        border-radius: 16px !important;
      }
      .agenda-quick-capture > div {
        display: grid !important;
        grid-template-columns: 22px minmax(0, 1fr) auto !important;
        gap: 6px !important;
      }
      .agenda-quick-capture input {
        font-size: 16px !important;
        min-width: 0 !important;
      }
      .agenda-day-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
      .agenda-layout-toggle {
        justify-content: flex-start !important;
        gap: 6px !important;
        margin: -2px 0 10px !important;
      }
      .agenda-layout-toggle button {
        min-height: 38px !important;
        border-radius: 13px !important;
        padding: 0 12px !important;
        font-size: 12px !important;
      }
      .agenda-plan-card {
        min-height: 0 !important;
        padding: 14px !important;
        border-radius: 18px !important;
        overflow: hidden !important;
      }
      .agenda-plan-head {
        padding-bottom: 11px !important;
        gap: 10px !important;
        align-items: center !important;
      }
      .agenda-plan-head > div:first-child {
        min-width: 0 !important;
      }
      .agenda-plan-head > div:first-child > div:first-child {
        font-size: 18px !important;
        line-height: 1.1 !important;
      }
      .agenda-plan-head > div:first-child > div:last-child {
        font-size: 12px !important;
        line-height: 1.35 !important;
        margin-top: 4px !important;
      }
      .agenda-add-task-button {
        min-height: 40px !important;
        padding: 0 12px !important;
        border-radius: 14px !important;
        flex: 0 0 auto !important;
        box-shadow: none !important;
      }
      .agenda-plan-section {
        margin-top: 13px !important;
      }
      .agenda-plan-section > div:first-child {
        margin-bottom: 2px !important;
        gap: 6px !important;
        align-items: center !important;
      }
      .agenda-plan-section > div:first-child span:first-child {
        font-size: 12px !important;
      }
      .agenda-plan-section > div:first-child span:last-child {
        font-size: 10px !important;
      }
      .agenda-clean-task-row {
        display: grid !important;
        grid-template-columns: 28px 54px minmax(0, 1fr) 34px !important;
        gap: 8px !important;
        align-items: center !important;
        padding: 10px 0 !important;
      }
      .agenda-clean-task-row > button:first-child {
        width: 22px !important;
        min-width: 22px !important;
        max-width: 22px !important;
        height: 22px !important;
        min-height: 22px !important;
        max-height: 22px !important;
        aspect-ratio: 1 / 1 !important;
        justify-self: center !important;
        align-self: start !important;
        margin-top: 1px !important;
        border-width: 2px !important;
        border-radius: 999px !important;
        padding: 0 !important;
        line-height: 1 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .agenda-plan-check {
        width: 22px !important;
        min-width: 22px !important;
        max-width: 22px !important;
        height: 22px !important;
        min-height: 22px !important;
        max-height: 22px !important;
        aspect-ratio: 1 / 1 !important;
        border-radius: 999px !important;
        padding: 0 !important;
        flex: 0 0 22px !important;
        align-self: start !important;
        margin-top: 1px !important;
        line-height: 1 !important;
      }
      .agenda-task-block .agenda-timeline-check {
        width: 22px !important;
        min-width: 22px !important;
        max-width: 22px !important;
        height: 22px !important;
        min-height: 22px !important;
        max-height: 22px !important;
        aspect-ratio: 1 / 1 !important;
        border-radius: 999px !important;
        padding: 0 !important;
        flex: 0 0 22px !important;
        align-self: center !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        line-height: 1 !important;
      }
      .agenda-task-block.compact .agenda-timeline-check {
        width: 18px !important;
        min-width: 18px !important;
        max-width: 18px !important;
        height: 18px !important;
        min-height: 18px !important;
        max-height: 18px !important;
        flex-basis: 18px !important;
      }
      .agenda-task-block > div:first-child > div:last-child button {
        width: 28px !important;
        min-width: 28px !important;
        max-width: 28px !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        padding: 0 !important;
      }
      .agenda-clean-task-row > div:nth-child(2) {
        width: auto !important;
        font-size: 11px !important;
        text-align: left !important;
      }
      .agenda-clean-task-row > div:nth-child(3) > div:first-child {
        font-size: 14px !important;
        line-height: 1.2 !important;
      }
      .agenda-clean-task-row > div:nth-child(3) > div:last-child {
        margin-top: 3px !important;
        gap: 5px !important;
      }
      .agenda-clean-task-row > div:nth-child(3) > div:last-child span {
        font-size: 10px !important;
      }
      .agenda-clean-task-row > button:last-child {
        width: 32px !important;
        height: 32px !important;
        min-height: 32px !important;
        border-radius: 10px !important;
        color: var(--icon-primary, #e11d48) !important;
      }
      .agenda-todo-list {
        margin-top: 12px !important;
        padding-top: 12px !important;
      }
      .agenda-todo-add-row {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) 38px !important;
        gap: 7px !important;
        margin-bottom: 8px !important;
      }
      .agenda-todo-add-row input {
        min-height: 42px !important;
        font-size: 16px !important;
      }
      .agenda-todo-add-row button {
        width: 38px !important;
        height: 42px !important;
        min-height: 42px !important;
        border-radius: 12px !important;
      }
      .agenda-todo-row {
        display: grid !important;
        grid-template-columns: 24px minmax(0, 1fr) 28px !important;
        gap: 9px !important;
        align-items: start !important;
        padding: 9px 0 !important;
      }
      .agenda-todo-check {
        width: 22px !important;
        min-width: 22px !important;
        max-width: 22px !important;
        height: 22px !important;
        min-height: 22px !important;
        max-height: 22px !important;
        aspect-ratio: 1 / 1 !important;
        border-radius: 999px !important;
        padding: 0 !important;
        margin: 1px 0 0 !important;
        align-self: start !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        line-height: 1 !important;
      }
      .agenda-todo-label-chip {
        display: inline-flex !important;
        width: fit-content !important;
        max-width: 132px !important;
        min-height: 0 !important;
        padding: 3px 7px !important;
        border-radius: 999px !important;
        font-size: 10px !important;
        line-height: 1 !important;
      }
      .agenda-todo-delete {
        width: 28px !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        padding: 0 !important;
        border-radius: 9px !important;
      }
      .agenda-side-panel {
        padding: 12px !important;
        border-radius: 18px !important;
      }
      .agenda-side-tabs {
        margin-bottom: 10px !important;
        padding: 3px !important;
        border-radius: 12px !important;
      }
      .agenda-side-tabs button {
        min-height: 44px !important;
        padding: 0 6px !important;
        border-radius: 10px !important;
        font-size: 11px !important;
      }
      .agenda-side-panel textarea {
        min-height: 138px !important;
        font-size: 16px !important;
      }
      .agenda-sidebar {
        width: 100% !important;
      }
      .mobile-bottom-nav [style*="bottom: 100%"] {
        min-width: 214px !important;
        right: 0 !important;
      }
      .mobile-bottom-nav [style*="bottom: 100%"] button span {
        max-width: none !important;
        font-size: 11px !important;
      }
      .mobile-bottom-nav .mobile-more-popover {
        min-width: 178px !important;
        width: 178px !important;
        max-width: 178px !important;
        right: 6px !important;
      }
      .mobile-bottom-nav .mobile-more-popover button span {
        max-width: 112px !important;
        font-size: 12px !important;
      }
      textarea { min-height: 96px; }
      input[type="date"], input[type="month"], select, button {
        min-height: 42px;
      }
      [style*="position: fixed"][style*="z-index: 1000"],
      [style*="position: fixed"][style*="z-index: 2000"] {
        padding: 10px !important;
      }
      [style*="max-height: 85vh"] {
        width: calc(100vw - 20px) !important;
        max-height: calc(100dvh - 24px) !important;
        border-radius: 20px !important;
      }
      .auth-screen {
        min-height: 100dvh !important;
        padding: max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom)) !important;
      }
      .auth-form-card { padding: 12px !important; }
    }
    @media (min-width: 769px) {
      .mobile-bottom-nav { display: none !important; }
      .mobile-header-btn { display: none !important; }
    }
  `;
  document.head.appendChild(style);
};

const Confetti = ({ x, y }) => {
  const colors = ['#e11d48', '#efefef', '#00ff9d', '#ff6b6b', '#ffd93d', '#e11d48'];
  const particles = Array.from({ length: 20 }, (_, i) => {
    const color = colors[i % colors.length];
    const angle = (Math.PI * 2 * i) / 20;
    const dist = 40 + Math.random() * 60;
    return {
      id: i,
      color,
      left: x + Math.cos(angle) * 0,
      top: y + Math.sin(angle) * 0,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist - 30,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.1
    };
  });
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: p.left,
          top: p.top,
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          animationDelay: `${p.delay}s`,
          '--tx': `${p.tx}px`,
          '--ty': `${p.ty}px`,
        }} />
      ))}
    </div>
  );
};

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: COLORS.success, error: COLORS.alert, info: COLORS.secondary, warning: '#ffd93d' };
  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
      background: COLORS.card, border: `1px solid ${colors[type]}40`, borderRadius: 12,
      padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: `0 8px 32px rgba(0,0,0,0.3)`, animation: 'slideIn 0.2s ease-out'
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[type], flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', fontSize: 16, padding: 0 }}><X size={16} /></button>
    </div>
  );
};

const EmptyState = ({ icon = '\u{1F4CB}', title = 'Sin datos', subtitle = '', compact = false }) => (
  <div style={{ textAlign: 'center', padding: compact ? 24 : 48, color: COLORS.textDim }}>
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.4 }}>
      <rect x="10" y="20" width="60" height="50" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="35" x2="60" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="43" x2="50" y2="43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
      <line x1="20" y1="49" x2="55" y2="49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
      <circle cx="40" cy="55" r="4" fill="currentColor" />
    </svg>
    <div style={{ fontSize: 16, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 4 }}>{title}</div>
    {subtitle && <div style={{ fontSize: 13, color: COLORS.textDim }}>{subtitle}</div>}
  </div>
);

const Skeleton = ({ width = '100%', height = 20, style = {} }) => (
  <div className="skeleton" style={{ width, height, ...style }} />
);

const AnimatedCounter = ({ value, duration = 1000, prefix = '', suffix = '', style = {} }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span style={style}>{prefix}{display}{suffix}</span>;
};

const KPICard = ({ icon, title, value, subtitle, accent, suffix = '', delay = 0, progress }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return <div className="kpi-card" style={{
    background: COLORS.card, borderRadius: 12, padding: 16,
    border: `1px solid ${COLORS.border}`, opacity: 0, transform: 'translateY(10px)'
  }}><Skeleton height={20} /><Skeleton height={10} width="60%" style={{ marginTop: 6 }} /></div>;

  const progressCircle = progress !== undefined ? (
    <svg className="kpi-progress-ring" width="38" height="38" viewBox="0 0 38 38" style={{ flexShrink: 0, opacity: 0.82 }}>
      <circle cx="19" cy="19" r="15" fill="none" stroke={COLORS.border} strokeWidth="2" opacity="0.75" />
      <circle cx="19" cy="19" r="15" fill="none" stroke={accent} strokeWidth="2.25"
        strokeLinecap="round"
        strokeOpacity="0.88"
        strokeDasharray={`${2 * Math.PI * 15}`}
        strokeDashoffset={`${2 * Math.PI * 15 * (1 - progress)}`}
        transform="rotate(-90 19 19)"
        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
      <text x="19" y="19" textAnchor="middle" dominantBaseline="central"
        fill={COLORS.textDim} fontSize="8.5" fontWeight="700" fontFamily="'Inter', sans-serif">
        {Math.round(progress * 100)}
      </text>
    </svg>
  ) : null;

  return (
    <div className="kpi-card" style={{
      background: COLORS.card, borderRadius: 12, padding: 16,
      border: `1px solid ${COLORS.border}`,
      animation: `fadeIn 0.4s ease-out ${delay}ms both`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
            <span className="fire-emoji">{icon}</span> {title}
          </div>
          <div style={{ fontSize: 24, fontWeight: 500, color: COLORS.text, fontFamily: "'Inter', sans-serif", lineHeight: 1.2 }}>
            <AnimatedCounter value={typeof value === 'number' ? value : parseInt(value)} duration={1200} suffix={suffix} />
          </div>
        </div>
        {progressCircle}
      </div>
      <div style={{ fontSize: 11, color: COLORS.textDim }}>{subtitle}</div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, width = 480 }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      <div style={{
        background: COLORS.surface, borderRadius: 16,
        border: `1px solid ${COLORS.border}`, padding: 32,
        width: '90%', maxWidth: width, maxHeight: '85vh', overflowY: 'auto',
        animation: 'slideIn 0.3s ease-out'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>{title}</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer',
            padding: 4, borderRadius: 8, display: 'flex'
          }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const BrandLogo = ({ size = 'sm', compact = false, center = false }) => (
  <div className={`brand-lockup ${size} ${compact ? 'compact' : ''} ${center ? 'center' : ''}`} aria-label="HabitFlow">
    <img className="brand-mark" src="./brand-logo.svg" alt="HF" />
    {!compact && <span className="brand-word">HabitFlow</span>}
  </div>
);

const ClerkSetupScreen = ({ initialKey = '', error = '', loading = false, onSave }) => {
  const [key, setKey] = useState(initialKey);
  return (
    <div className="auth-screen">
      <div className="auth-form-card" style={{ width: '100%', maxWidth: 460, padding: 28 }}>
        <div style={{ marginBottom: 12 }}><BrandLogo size="md" /></div>
        <div style={{ color: COLORS.text, fontSize: 20, fontFamily: "'DM Serif Display', serif", marginBottom: 6 }}>Conectar login con Clerk</div>
        <div style={{ color: COLORS.textDim, fontSize: 12, lineHeight: 1.6, marginBottom: 18 }}>
          Pega tu Publishable Key de Clerk. La encuentras en Clerk Dashboard, sección API keys, y empieza por pk_test_ o pk_live_.
        </div>
        <input value={key} onChange={e => setKey(e.target.value)} placeholder="pk_test_..." style={{
          width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10,
          border: `1px solid ${error ? COLORS.alert : COLORS.border}`, background: COLORS.bg,
          color: COLORS.text, outline: 'none', fontSize: 13, fontFamily: "'Inter', sans-serif", marginBottom: 10
        }} />
        {error && <div style={{ color: COLORS.alert, fontSize: 11, lineHeight: 1.45, marginBottom: 12 }}>{error}</div>}
        <button disabled={loading || !key.trim()} onClick={() => onSave(key.trim())} style={{
          width: '100%', padding: '12px 16px', borderRadius: 10, border: 'none',
          background: loading || !key.trim() ? COLORS.border : `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`,
          color: '#fff', cursor: loading || !key.trim() ? 'default' : 'pointer',
          fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700
        }}>{loading ? 'Conectando...' : 'Activar login'}</button>
      </div>
    </div>
  );
};

const ClerkSignInScreen = ({ clerk }) => {
  const signInRef = useRef(null);
  useEffect(() => {
    if (!clerk || !signInRef.current) return;
    clerk.mountSignIn(signInRef.current, {
      appearance: {
        variables: {
          colorPrimary: '#e11d48',
          colorBackground: 'transparent',
          colorText: COLORS.text,
          colorInputBackground: COLORS.bg,
          colorTextSecondary: COLORS.textDim,
          borderRadius: '12px'
        },
        elements: {
          card: 'auth-clerk-card',
          rootBox: 'auth-clerk-root'
        }
      }
    });
    return () => {
      try { clerk.unmountSignIn(signInRef.current); } catch {}
    };
  }, [clerk]);

  return (
    <div className="auth-screen">
      <div className="auth-shell">
        <div className="auth-hero-card auth-hero-side">
          <div>
            <div style={{ marginBottom: 18 }}><BrandLogo size="lg" /></div>
            <div style={{ maxWidth: 420, fontSize: 36, lineHeight: 1.05, color: COLORS.text, fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.03em', marginBottom: 14 }}>
              Entra a tu sistema personal de hábitos.
            </div>
            <div style={{ maxWidth: 420, color: COLORS.textDim, fontSize: 13, lineHeight: 1.7 }}>
              Tus hábitos, agenda, entrenos y enfoque quedan protegidos tras tu sesión de Clerk.
            </div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <div className="auth-feature-pill"><span className="fire-emoji">{'\u{1F525}'}</span> Rachas y progreso diario</div>
            <div className="auth-feature-pill"><span className="fire-emoji">✅</span> Acceso seguro con Google o email</div>
            <div className="auth-feature-pill"><span className="fire-emoji">{'\u{1F319}'}</span> Dark puro con identidad visual propia</div>
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 16 }}><BrandLogo size="md" center /></div>
          <div className="auth-form-card">
            <div ref={signInRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ClerkUserButtonMount = () => {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.Clerk || !ref.current) return;
    window.Clerk.mountUserButton(ref.current, {
      appearance: { elements: { userButtonAvatarBox: { width: '34px', height: '34px' } } }
    });
    return () => {
      try { window.Clerk.unmountUserButton(ref.current); } catch {}
    };
  }, []);
  return <div ref={ref} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />;
};

const AuthGate = ({ children }) => {
  const [publishableKey, setPublishableKey] = useState(getStoredClerkKey);
  const [clerk, setClerk] = useState(null);
  const [status, setStatus] = useState(publishableKey ? 'loading' : 'setup');
  const [error, setError] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const connectClerk = useCallback(async (key) => {
    setStatus('loading');
    setError('');
    try {
      localStorage.setItem(CLERK_KEY_STORAGE, key);
      const loaded = await loadClerk(key);
      setClerk(loaded);
      setIsSignedIn(!!loaded.isSignedIn);
      setStatus('ready');
    } catch (err) {
      setStatus('setup');
      setError(err.message || 'No se pudo conectar Clerk.');
    }
  }, []);

  useEffect(() => {
    if (!publishableKey) return;
    connectClerk(publishableKey);
  }, [publishableKey, connectClerk]);

  useEffect(() => {
    if (!clerk?.addListener) return;
    const unsubscribe = clerk.addListener(({ session }) => setIsSignedIn(!!session));
    return () => { try { unsubscribe?.(); } catch {} };
  }, [clerk]);

  if (status === 'setup') return <ClerkSetupScreen initialKey={publishableKey} error={error} onSave={key => setPublishableKey(key)} />;
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.textDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Cargando login...</div>
      </div>
    );
  }
  if (!isSignedIn) return <ClerkSignInScreen clerk={clerk} />;
  return children;
};

const getCategoryInfo = (catId) => CATEGORIES.find(c => c.id === catId) || CATEGORIES[6];

const isExpectedDay = (habit, date) => {
  if (!habit || !habit.frequency || habit.frequency === 'Diario') return true;
  const day = new Date(date).getDay();
  if (habit.frequency === 'Lun-Vie') return day >= 1 && day <= 5;
  if (habit.frequency === 'Fines de semana') return day === 0 || day === 6;
  if (habit.frequency === 'Personalizado' && habit.frequencyDays) return habit.frequencyDays.includes(day);
  return true;
};

const getCompletionRate = (habitId, records, days = 30, habit) => {
  const now = new Date();
  let expected = 0, completed = 0;
  for (let i = 0; i < days; i++) {
    const d = addDays(now, -i);
    const dateStr = toYYYYMMDD(d);
    if (habit && !isExpectedDay(habit, d)) continue;
    expected++;
    const rec = records.find(r => r.habitId === habitId && r.date === dateStr);
    if (rec && rec.completed) completed++;
  }
  return expected > 0 ? completed / expected : 0;
};

const getCurrentStreak = (habitId, records, habit) => {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = addDays(today, -i);
    const date = toYYYYMMDD(d);
    if (habit && !isExpectedDay(habit, d)) continue;
    const rec = records.find(r => r.habitId === habitId && r.date === date);
    if (rec && rec.skipped) continue;
    if (rec && rec.completed) streak++;
    else break;
  }
  return streak;
};

const getBestStreak = (habitId, records, habit) => {
  const sorted = records.filter(r => r.habitId === habitId)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) return 0;
  const start = new Date(sorted[0].date + 'T00:00:00');
  const end = new Date();
  let best = 0, current = 0;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = toYYYYMMDD(d);
    if (habit && !isExpectedDay(habit, d)) continue;
    const rec = records.find(r => r.habitId === habitId && r.date === dateStr);
    if (rec && rec.skipped) continue;
    if (rec && rec.completed) { current++; best = Math.max(best, current); }
    else current = 0;
  }
  return best;
};

const getTodayCount = (habits, records) => {
  const today = toYYYYMMDD(new Date());
  const todayRecords = records.filter(r => r.date === today);
  const completed = todayRecords.filter(r => r.completed).length;
  return { completed, total: habits.filter(h => h.active).length };
};

const getWeeklyRate = (habits, records) => {
  const now = new Date();
  let total = 0, completed = 0;
  for (let i = 0; i < 7; i++) {
    const date = toYYYYMMDD(addDays(now, -i));
    const dayRecs = records.filter(r => r.date === date);
    dayRecs.forEach(r => { total++; if (r.completed) completed++; });
  }
  return total ? Math.round((completed / total) * 100) : 0;
};

const getGlobalBestStreak = (habits, records) => {
  return Math.max(...habits.filter(h => h.active).map(h => getBestStreak(h.id, records)), 0);
};

const getGlobalCurrentStreak = (habits, records) => {
  return Math.max(...habits.filter(h => h.active).map(h => getCurrentStreak(h.id, records)), 0);
};

const getHabitStrength = (habitId, records) => {
  const decay = 0.85;
  let sumW = 0, sumV = 0;
  for (let i = 0; i < 30; i++) {
    const date = toYYYYMMDD(addDays(new Date(), -i));
    const rec = records.find(r => r.habitId === habitId && r.date === date);
    const w = Math.pow(decay, i);
    sumW += w;
    if (rec && rec.completed) sumV += w;
  }
  return sumW > 0 ? Math.round((sumV / sumW) * 100) : 0;
};

const getAvgHabitStrength = (habits, records) => {
  const scores = habits.filter(h => h.active).map(h => getHabitStrength(h.id, records));
  if (!scores.length) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

const getStrengthColor = (s) => s >= 70 ? COLORS.success : s >= 40 ? '#ffd93d' : COLORS.alert;

const getXpForLevel = (level) => Math.round(100 * level * 1.5);

const getLevel = (xp) => {
  let level = 1, needed = getXpForLevel(1);
  while (xp >= needed) { level++; needed = getXpForLevel(level); }
  return level;
};

const getXpProgress = (xp) => {
  let level = 1, needed = getXpForLevel(1);
  while (xp >= needed) { level++; xp -= needed; needed = getXpForLevel(level); }
  return { xp, needed, level };
};

const getDailyCompletionData = (habits, records, days = 30) => {
  const now = new Date();
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(now, -i);
    const dateStr = toYYYYMMDD(date);
    const dayRecs = records.filter(r => r.date === dateStr);
    const total = dayRecs.length;
    const completed = dayRecs.filter(r => r.completed).length;
    data.push({
      date: dateStr,
      label: formatDateShort(date),
      completed,
      total,
      pct: total ? Math.round((completed / total) * 100) : 0
    });
  }
  return data;
};

const getCategoryPerformance = (habits, records, days = 30) => {
  const now = new Date();
  const catMap = {};
 CATEGORIES.forEach(c => { catMap[c.id] = { total: 0, completed: 0 }; });
  const cutoff = toYYYYMMDD(addDays(now, -days));
  records.filter(r => r.date >= cutoff).forEach(r => {
    const h = habits.find(hab => hab.id === r.habitId);
    if (h && h.active) {
      if (!catMap[h.category]) catMap[h.category] = { total: 0, completed: 0 };
      catMap[h.category].total++;
      if (r.completed) catMap[h.category].completed++;
    }
  });
  return CATEGORIES.filter(c => catMap[c.id] && catMap[c.id].total > 0).map(c => ({
    category: c.label,
    value: catMap[c.id].total ? Math.round((catMap[c.id].completed / catMap[c.id].total) * 100) : 0,
    fullMark: 100,
    color: c.color,
    id: c.id
  }));
};

const getCategoryDistribution = (habits) => {
  const count = {};
  habits.filter(h => h.active).forEach(h => {
    count[h.category] = (count[h.category] || 0) + 1;
  });
  return CATEGORIES.filter(c => count[c.id]).map(c => ({
    name: c.label,
    value: count[c.id],
    color: c.color,
    icon: c.icon
  }));
};

const getWeeklyStackData = (habits, records) => {
  const now = new Date();
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = addDays(now, -i);
    const dateStr = toYYYYMMDD(date);
    const entry = { date: formatDateShort(date), label: dateStr };
    habits.filter(h => h.active).forEach(h => {
      const rec = records.find(r => r.habitId === h.id && r.date === dateStr);
      entry[h.name] = rec && rec.completed ? 1 : 0;
    });
    data.push(entry);
  }
  return data;
};

const getHeatMapData = (habits, records, year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const data = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dateStr = toYYYYMMDD(date);
    const dayRecs = records.filter(r => r.date === dateStr);
    const total = dayRecs.length;
    const completed = dayRecs.filter(r => r.completed).length;
    const pct = total ? completed / total : 0;
    const dow = date.getDay();
    data.push({ day: d, date: dateStr, dow, pct, completed, total, label: formatDateShort(date) });
  }
  return data;
};

const getHeatMapIntensity = (pct) => {
  if (pct === 0) return COLORS.card;
  if (pct >= 1) return COLORS.success;
  if (pct >= 0.75) return '#9f1239';
  if (pct >= 0.5) return '#009955';
  return '#006633';
};

const getDayLabels = () => ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'sáb'];

const generateInsights = (habits, records) => {
  const insights = [];
  const today = new Date();
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'sábado'];

  const dayRates = Array(7).fill(0).map(() => ({ total: 0, completed: 0 }));
  for (let i = 0; i < 30; i++) {
    const date = toYYYYMMDD(addDays(today, -i));
    const dow = new Date(date).getDay();
    const dayRecs = records.filter(r => r.date === date);
    dayRecs.forEach(r => { dayRates[dow].total++; if (r.completed) dayRates[dow].completed++; });
  }
  let bestDay = 0, worstDay = 0;
  dayRates.forEach((d, i) => {
    if (d.total && d.completed / d.total > (dayRates[bestDay].total ? dayRates[bestDay].completed / dayRates[bestDay].total : 0)) bestDay = i;
    if (d.total && d.completed / d.total < (dayRates[worstDay].total ? dayRates[worstDay].completed / dayRates[worstDay].total : 1)) worstDay = i;
  });
  const bestPct = dayRates[bestDay].total ? Math.round((dayRates[bestDay].completed / dayRates[bestDay].total) * 100) : 0;
  const worstPct = dayRates[worstDay].total ? Math.round((dayRates[worstDay].completed / dayRates[worstDay].total) * 100) : 0;
  if (bestDay !== worstDay && dayRates[bestDay].total > 0) {
    insights.push({ id: 'bestDay', icon: '\u{1F31F}', text: `Tu mejor día es el ${dayNames[bestDay]} con un ${bestPct}% de completitud`, type: 'positive' });
    insights.push({ id: 'worstDay', icon: '\u{26A0}\u{FE0F}', text: `Los ${dayNames[worstDay]} sueles fallar más (${worstPct}% completitud). Qué pasa ese día?`, type: 'warning' });
  }

  const scores = habits.filter(h => h.active).map(h => ({ h, score: getHabitStrength(h.id, records) })).sort((a, b) => b.score - a.score);
  if (scores.length > 0) {
    insights.push({ id: 'strongest', icon: '\u{1F4AA}', text: `Tu hábito más consolidado es '${scores[0].h.name}' con ${scores[0].score}% de fuerza`, type: 'positive' });
    if (scores.length > 1) {
      insights.push({ id: 'weakest', icon: '\u{1F3AF}', text: `'${scores[scores.length - 1].h.name}' necesita más atención (${scores[scores.length - 1].score}% de fuerza)`, type: 'attention' });
    }
  }

  const thisWeek = [6,5,4,3,2,1,0].map(i => toYYYYMMDD(addDays(today, -i)));
  const lastWeek = [13,12,11,10,9,8,7].map(i => toYYYYMMDD(addDays(today, -i)));
  const calcWeekRate = (dates) => {
    let t = 0, c = 0;
    dates.forEach(d => { const r = records.filter(rec => rec.date === d); r.forEach(rec => { t++; if (rec.completed) c++; }); });
    return t ? c / t : 0;
  };
  const twr = calcWeekRate(thisWeek), lwr = calcWeekRate(lastWeek);
  if (twr > lwr && lwr > 0) {
    const diff = Math.round((twr - lwr) * 100);
    insights.push({ id: 'trendUp', icon: '\u{1F4C8}', text: `Esta semana vas un ${diff}% mejor que la semana pasada. ¡Sigue así!`, type: 'positive' });
  } else if (lwr > twr && twr > 0) {
    const diff = Math.round((lwr - twr) * 100);
    insights.push({ id: 'trendDown', icon: '\u{1F4C9}', text: `Esta semana bajaste un ${diff}% vs la semana pasada. ¡Puedes recuperarte!`, type: 'warning' });
  }

  habits.filter(h => h.active).forEach(h => {
    const streak = getCurrentStreak(h.id, records);
    const todayRec = records.find(r => r.habitId === h.id && r.date === toYYYYMMDD(today));
    const yesterdayRec = records.find(r => r.habitId === h.id && r.date === toYYYYMMDD(addDays(today, -1)));
    if (streak >= 5 && !todayRec?.completed) {
      insights.push({ id: `risk-${h.id}`, icon: '\u{1F525}', text: `Tu racha en '${h.name}' está en riesgo (${streak} días). No la rompas hoy!`, type: 'danger' });
    }
  });

  return insights;
};

const getMonthCalendar = (year, month, heatData) => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const weeks = [];
  let currentWeek = Array(firstDay).fill(null).concat(
    Array.from({ length: 7 - firstDay }, (_, i) => i + 1)
  );
  weeks.push(currentWeek);
  let day = 7 - firstDay + 1;
  while (day <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      week.push(day++);
    }
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
};

const RippleButton = ({ onClick, children, style, disabled }) => {
  const btnRef = useRef(null);
  const handleClick = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute; left: ${x}px; top: ${y}px;
      width: 20px; height: 20px; background: rgba(255,255,255,0.3);
      border-radius: 50%; transform: translate(-50%,-50%) scale(0);
      animation: rippleAnim 0.6s ease-out; pointer-events: none;
    `;
    btnRef.current.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    if (onClick) onClick(e);
  };
  return (
    <button ref={btnRef} onClick={handleClick} disabled={disabled}
      style={{ position: 'relative', overflow: 'hidden', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}>
      {children}
    </button>
  );
};

const CompletionHeatMap = ({ habits, records, days = 30 }) => {
  const data = getDailyCompletionData(habits, records, days);
  const maxVal = Math.max(...data.map(d => d.completed), 1);
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 80 }}>
      {data.map((d, i) => {
        const height = Math.max(4, (d.completed / maxVal) * 60);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{
              width: '100%', minHeight: 4, height, borderRadius: '4px 4px 0 0',
              background: d.pct >= 80 ? COLORS.success : d.pct >= 50 ? COLORS.primary : d.pct > 0 ? '#3a3a5a' : COLORS.card,
              transition: 'height 0.5s ease, background 0.3s',
              animation: `barGrow 0.5s ease-out ${i * 30}ms both`,
              transformOrigin: 'bottom'
            }} title={`${d.label}: ${d.completed}/${d.total} (${d.pct}%)`} />
          </div>
        );
      })}
    </div>
  );
};

const HabitHeatMap30 = ({ habitId, records }) => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = toYYYYMMDD(addDays(now, -i));
    const rec = records.find(r => r.habitId === habitId && r.date === date);
    data.push({ date, completed: rec ? rec.completed : false });
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: 2 }}>
      {data.map((d, i) => (
        <div key={i} style={{
          width: '100%', aspectRatio: '1', borderRadius: 2,
          background: d.completed ? COLORS.success : COLORS.card,
          transition: 'background 0.3s',
          position: 'relative'
        }} title={`${d.date}: ${d.completed ? 'Hecho' : 'Pendiente'}`} />
      ))}
    </div>
  );
};

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'sáb'];

const HabitForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || {
    name: '', description: '', category: 'salud', icon: getCategoryIcon('salud'),
    frequency: 'Diario', frequencyDays: [1, 2, 3, 4, 5], targetStreak: 21, active: true
  });
  const [error, setError] = useState('');

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const uniqueIcons = useMemo(() => [...new Set(ICONS)], []);

  const toggleDay = (day) => {
    const current = form.frequencyDays || [1, 2, 3, 4, 5];
    if (current.includes(day)) {
      if (current.length > 1) handleChange('frequencyDays', current.filter(d => d !== day));
    } else {
      handleChange('frequencyDays', [...current, day].sort());
    }
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    onSave({ ...form, name: form.name.trim() });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6, letterSpacing: '0.05em' }}>NOMBRE</label>
        <input value={form.name} onChange={e => { handleChange('name', e.target.value); setError(''); }}
          placeholder="Ej: 'Leer 20 páginas"
          style={{
            width: '100%', padding: '12px 16px', background: COLORS.bg, border: `1px solid ${error ? COLORS.alert : COLORS.border}`,
            borderRadius: 8, color: COLORS.text, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif"
          }} />
        {error && <div style={{ color: COLORS.alert, fontSize: 12, marginTop: 4 }}>{error}</div>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6, letterSpacing: '0.05em' }}>DESCRIPCIÓN</label>
        <input value={form.description} onChange={e => handleChange('description', e.target.value)}
          placeholder="Opcional - Describe tu hábito"
          style={{
            width: '100%', padding: '12px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
            borderRadius: 8, color: COLORS.text, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif"
          }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6, letterSpacing: '0.05em' }}>CATEGORÍA</label>
          <select value={form.category} onChange={e => {
            const cat = CATEGORIES.find(c => c.id === e.target.value);
            handleChange('category', e.target.value);
            handleChange('icon', cat.icon);
            handleChange('color', cat.color);
          }} style={{
            width: '100%', padding: '12px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
            borderRadius: 8, color: COLORS.text, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif"
          }}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6, letterSpacing: '0.05em' }}>FRECUENCIA</label>
          <select value={form.frequency} onChange={e => {
            handleChange('frequency', e.target.value);
            if (e.target.value === 'Personalizado' && (!form.frequencyDays || form.frequencyDays.length === 0)) {
              handleChange('frequencyDays', [1, 2, 3, 4, 5]);
            }
          }} style={{
            width: '100%', padding: '12px 16px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
            borderRadius: 8, color: COLORS.text, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif"
          }}>
            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          {form.frequency === 'Personalizado' && (
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              {DAY_LABELS.map((label, di) => (
                <button key={di} onClick={() => toggleDay(di)} style={{
                  flex: 1, padding: '6px 0', borderRadius: 6, border: 'none',
                  background: (form.frequencyDays || []).includes(di) ? COLORS.primary : COLORS.bg,
                  color: (form.frequencyDays || []).includes(di) ? '#fff' : COLORS.textDim,
                  cursor: 'pointer', fontSize: 10, fontFamily: "'Inter', sans-serif",
                  fontWeight: 500, transition: 'all 0.15s'
                }}>{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6, letterSpacing: '0.05em' }}>ÍCONO</label>
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: COLORS.textDim }}>Elige uno de los iconos disponibles</span>
            <span style={{ fontSize: 11, color: COLORS.textDim, whiteSpace: 'nowrap' }}>{uniqueIcons.length} iconos</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 220, overflowY: 'auto', paddingRight: 4 }}>
          {uniqueIcons.map(ic => (
            <button key={ic} onClick={() => handleChange('icon', ic)} style={{
              width: 36, height: 36, borderRadius: 8, border: `2px solid ${form.icon === ic ? COLORS.primary : COLORS.border}`,
              background: form.icon === ic ? `${COLORS.primary}14` : 'transparent',
              cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}>{ic}</button>
          ))}
          </div>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6, letterSpacing: '0.05em' }}>
          META DE RACHA
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="range" min="3" max="365" value={form.targetStreak}
            onChange={e => handleChange('targetStreak', parseInt(e.target.value))}
            style={{ flex: 1, accentColor: COLORS.primary }} />
          <input type="number" min="3" max="365" value={form.targetStreak}
            onChange={e => handleChange('targetStreak', Math.max(3, Math.min(365, parseInt(e.target.value) || 3)))}
            style={{ width: 64, padding: '6px 8px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontSize: 13, textAlign: 'center', fontFamily: "'Inter', sans-serif" }} />
          <span style={{ fontSize: 12, color: COLORS.textDim }}>días</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button onClick={onCancel} style={{
          padding: '10px 24px', borderRadius: 8, border: `1px solid ${COLORS.border}`,
          background: 'transparent', color: COLORS.textDim, cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif"
        }}>Cancelar</button>
        <RippleButton onClick={handleSubmit} style={{
          padding: '10px 24px', borderRadius: 8, border: 'none',
          background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff',
          fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 500
        }}>
          <Plus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          {initial ? 'Guardar Cambios' : 'Crear Hábito'}
        </RippleButton>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, danger }) => (
  <Modal isOpen={isOpen} onClose={onCancel} title={title} width={400}>
    <p style={{ color: COLORS.textDim, marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
      <button onClick={onCancel} style={{
        padding: '10px 24px', borderRadius: 8, border: `1px solid ${COLORS.border}`,
        background: 'transparent', color: COLORS.textDim, cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif"
      }}>Cancelar</button>
      <RippleButton onClick={onConfirm} style={{
        padding: '10px 24px', borderRadius: 8, border: 'none',
        background: danger ? COLORS.alert : COLORS.primary, color: '#fff',
        fontSize: 14, fontFamily: "'Inter', sans-serif"
      }}>
        {danger ? 'Eliminar' : 'Confirmar'}
      </RippleButton>
    </div>
  </Modal>
);

const AchievementsSection = ({ habits, records }) => {
  const achievements = useMemo(() => {
    const list = [];
    const totalCompletions = records.filter(r => r.completed).length;
    const bestStreak = getGlobalBestStreak(habits, records);

    if (totalCompletions >= 10) list.push({ id: 'a1', icon: '\u{1F331}', label: 'Primeros Pasos', desc: '10 hábitos completados', unlocked: true, color: '#ffd93d' });
    if (totalCompletions >= 50) list.push({ id: 'a2', icon: '\u{1F525}', label: 'Racha de Fuego', desc: '50 hábitos completados', unlocked: true, color: '#ff6b6b' });
    if (totalCompletions >= 100) list.push({ id: 'a3', icon: '\u{1F4AA}', label: 'Dedicación', desc: '100 hábitos completados', unlocked: true, color: '#e11d48' });
    if (totalCompletions >= 200) list.push({ id: 'a4', icon: '\u{1F3C6}', label: 'Campeón', desc: '200 hábitos completados', unlocked: true, color: '#ffd93d' });
    if (bestStreak >= 7) list.push({ id: 'a5', icon: '\u{1F4C5}', label: 'Una Semana', desc: 'Racha de 7 días', unlocked: true, color: '#efefef' });
    if (bestStreak >= 14) list.push({ id: 'a6', icon: '\u{1F680}', label: 'Dos Semanas', desc: 'Racha de 14 días', unlocked: true, color: '#ff6b6b' });
    if (bestStreak >= 21) list.push({ id: 'a7', icon: '\u{2705}', label: '21 días', desc: 'Racha de 21 días (hábito formado)', unlocked: true, color: '#00ff9d' });
    if (bestStreak >= 30) list.push({ id: 'a8', icon: '\u{1F31F}', label: 'Un Mes', desc: 'Racha de 30 días', unlocked: true, color: '#ffd93d' });

   CATEGORIES.forEach(c => {
      const catHabits = habits.filter(h => h.active && h.category === c.id);
      if (catHabits.length === 0) return;
      const catRecs = records.filter(r => catHabits.some(h => h.id === r.habitId) && r.completed);
      if (catRecs.length >= 30) list.push({
        id: `ac-${c.id}`, icon: c.icon, label: `Maestro en ${c.label}`,
        desc: `${catRecs.length} completados`, unlocked: true, color: c.color
      });
    });

    return list.slice(0, 8);
  }, [habits, records]);

  return (
    <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
      <h3 style={{ fontSize: 18, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
        <Sparkles size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: COLORS.primary }} />
        Logros Recientes
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {achievements.map((a, i) => (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 12,
            background: `${a.color}12`, border: `1px solid ${a.color}30`,
            animation: `fadeIn 0.4s ease-out ${i * 80}ms both`,
            cursor: 'default'
          }}>
            <span className="fire-emoji" style={{ fontSize: 24, animation: 'float 2s ease-in-out infinite' }}>{a.icon}</span>
            <div>
              <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{a.label}</div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 12, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
      <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, color: p.color, marginBottom: 2 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

const StatsTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 12, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
      <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, color: p.color, marginBottom: 2 }}>
          {p.name}: {p.value}%
        </div>
      ))}
    </div>
  );
};

const DashboardView = ({ data, onCompleteHabit, workoutData, onNavigate, onUpdateUser }) => {
  const { habits, records } = data;
  const today = toYYYYMMDD(new Date());
  const todayCount = getTodayCount(habits, records);
  const greet = greets();
  const insights = useMemo(() => generateInsights(habits, records).slice(0, 4), [habits, records]);

  const kpis = useMemo(() => ({
    completed: todayCount.completed,
    total: todayCount.total,
    rate: getWeeklyRate(habits, records),
    currentStreak: getGlobalCurrentStreak(habits, records),
    bestStreak: getGlobalBestStreak(habits, records)
  }), [habits, records, todayCount]);

  const habitsToday = useMemo(() =>
    habits.filter(h => h.active).map(h => {
      const rec = records.find(r => r.habitId === h.id && r.date === today);
      const cat = getCategoryInfo(h.category);
      return { ...h, completed: rec ? rec.completed : false, categoryInfo: cat, streak: getCurrentStreak(h.id, records) };
    }), [habits, records, today]);

  const isFirstRun = !data.user?.onboardingDone && (habits.length === 0 || records.length === 0);
  const [tourStep, setTourStep] = useState(null);
  const tourSteps = [
    { title: 'Crea tus primeros hábitos', text: 'Empieza con 3 hábitos simples. Mejor poco y constante que una lista enorme imposible de cumplir.', view: 'habits' },
    { title: 'Organiza tu día', text: 'Usa Agenda para anotar tareas, poner etiquetas, fechas y alertas. Aquí aterrizas lo que tienes que hacer.', view: 'agenda' },
    { title: 'Enfócate y mide progreso', text: 'Pomodoro te ayuda a trabajar por bloques. Estadísticas te muestra qué está funcionando y qué debes ajustar.', view: 'pomodoro' }
  ];
  const finishTour = (view = 'habits') => {
    onUpdateUser?.({ onboardingDone: true });
    setTourStep(null);
    onNavigate?.(view);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 28, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 4 }}>
          {greet.text} {greet.emoji}
        </div>
        <div style={{ fontSize: 14, color: COLORS.textDim }}>
          {formatDateSpanish(new Date())}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          {isFirstRun && (
            <div style={{
              background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.border}`,
              padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 14, flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ color: COLORS.text, fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Empieza con una guía rápida</div>
                <div style={{ color: COLORS.textDim, fontSize: 12, lineHeight: 1.6 }}>Te muestro en 3 pasos cómo crear hábitos, organizar tareas y medir tu progreso.</div>
              </div>
              <button className="lab-cta" onClick={() => setTourStep(0)} style={{
                borderRadius: 999, padding: '11px 18px', cursor: 'pointer',
                fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 700
              }}>
                <span>Activar mis hábitos ahora</span>
              </button>
            </div>
          )}

          <Modal isOpen={tourStep !== null} onClose={() => setTourStep(null)} title={tourStep !== null ? tourSteps[tourStep].title : ''} width={460}>
            {tourStep !== null && (
              <div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  {tourSteps.map((_, i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: i <= tourStep ? COLORS.primary : COLORS.border }} />)}
                </div>
                <p style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>{tourSteps[tourStep].text}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <button onClick={() => setTourStep(null)} style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.textDim, cursor: 'pointer' }}>Cerrar</button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {tourStep > 0 && <button onClick={() => setTourStep(s => s - 1)} style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, cursor: 'pointer' }}>Anterior</button>}
                    <button className="lab-cta" onClick={() => tourStep === tourSteps.length - 1 ? finishTour('habits') : setTourStep(s => s + 1)} style={{ padding: '10px 14px', borderRadius: 999, cursor: 'pointer' }}>
                      <span>{tourStep === tourSteps.length - 1 ? 'Crear mi primer habito' : 'Siguiente'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Modal>

          <div className="kpi-grid" style={{ marginBottom: 24 }}>
            <KPICard icon={'\u{2705}'} title="Completados Hoy" value={kpis.completed} suffix={`/${kpis.total}`}
              subtitle="Hábitos marcados hoy" accent={COLORS.secondary}
              progress={kpis.total > 0 ? kpis.completed / kpis.total : 0} delay={100} />
            <KPICard icon={'\u{1F525}'} title="Racha Actual" value={kpis.currentStreak} subtitle="días consecutivos"
              accent={COLORS.alert} suffix=" días" delay={200} />
            <KPICard icon={'\u{1F4AA}'} title="Fuerza de Hábitos" value={getAvgHabitStrength(habits, records)}
              subtitle="Puntuación promedio (0-100)" accent={COLORS.primary} suffix=" ptos" delay={250}
              progress={getAvgHabitStrength(habits, records) / 100} />
            <KPICard icon={'\u{1F4C8}'} title="Tasa de éxito" value={kpis.rate} subtitle="Esta semana"
              accent={COLORS.success} suffix="%" delay={300}
              progress={kpis.rate / 100} />
            <KPICard icon={'\u{1F3C6}'} title="Mejor Racha" value={kpis.bestStreak} subtitle="Récord histórico"
              accent={COLORS.alert} suffix=" días" delay={400} />
          </div>

          {workoutData?.sessions?.length > 0 && (() => {
            const last = workoutData.sessions[workoutData.sessions.length - 1];
            return (
              <div style={{ background: `linear-gradient(135deg, ${COLORS.card}, ${COLORS.surface})`, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 13, color: COLORS.textDim }}>{'\u{1F3CB}\u{FE0F}'} Último Entreno</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "'Inter', sans-serif" }}>{last.date}</div>
                </div>
                <div style={{ fontSize: 16, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 8 }}>{last.routineName || 'Entreno Libre'}</div>
                <div style={{ display: 'flex', gap: 24, fontSize: 12, color: COLORS.textDim }}>
                  <span><span style={{ color: COLORS.success }}>{(last.totalVolume || 0) > 999 ? `${(last.totalVolume / 1000).toFixed(1)}k` : last.totalVolume || 0}</span> kg</span>
                  <span><span style={{ color: COLORS.primary }}>{last.exercises?.length || 0}</span> ejercicios</span>
                  <span><span style={{ color: COLORS.alert }}>{last.duration ? `${Math.floor(last.duration / 60)}m` : '--'}</span></span>
                </div>
              </div>
            );
          })()}

          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Últimos 7 días
            </h3>
            {(() => {
              const dailyData = getDailyCompletionData(habits, records, 7);
              return (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#8888a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8888a0', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload || !payload[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                          <div style={{ fontSize: 13, color: COLORS.text, marginBottom: 4 }}>{d.label}</div>
                          <div style={{ fontSize: 12, color: COLORS.textDim }}><span style={{ color: COLORS.primary }}>{'\u{2705}'}</span> {d.completed}/{d.total} hábitos</div>
                          <div style={{ fontSize: 12, color: COLORS.textDim }}>Tasa: <span style={{ color: d.pct >= 80 ? COLORS.success : d.pct >= 50 ? COLORS.primary : COLORS.alert }}>{d.pct}%</span></div>
                        </div>
                      );
                    }} />
                    <Bar dataKey="completed" name="Completados" fill="url(#weeklyGrad)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    <defs>
                      <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.primary} />
                        <stop offset="100%" stopColor={COLORS.secondary} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>

          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              <Activity size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
              Perspectivas y Recomendaciones
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
              {insights.map((insight, i) => {
                const bgColors = { positive: 'rgba(0,255,157,0.08)', warning: 'rgba(255,217,61,0.08)', attention: `${COLORS.primary}12`, danger: 'rgba(255,77,77,0.08)' };
                const borderColors = { positive: 'rgba(0,255,157,0.2)', warning: 'rgba(255,217,61,0.2)', attention: `${COLORS.primary}30`, danger: 'rgba(255,77,77,0.2)' };
                return (
                  <div key={insight.id || i} style={{ background: bgColors[insight.type] || COLORS.bg, borderRadius: 12, border: `1px solid ${borderColors[insight.type] || COLORS.border}`, padding: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span className="fire-emoji" style={{ fontSize: 20 }}>{insight.icon}</span>
                    <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{insight.text}</div>
                  </div>
                );
              })}
              {insights.length === 0 && (
                <div style={{ color: COLORS.textDim, fontSize: 13, padding: 16 }}>Completa más hábitos para recibir perspectivas personalizadas.</div>
              )}
            </div>
          </div>

          <AchievementsSection habits={habits} records={records} />
        </div>

        <div style={{
          background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`,
          padding: 20, position: 'sticky', top: 16
        }}>
          <h3 style={{ fontSize: 15, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
            Hábitos de Hoy
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {habitsToday.length === 0 && (
              <div style={{ fontSize: 12, color: COLORS.textDim, textAlign: 'center', padding: 16 }}>
                No hay hábitos activos
              </div>
            )}
            {habitsToday.map((h, i) => (
              <div key={h.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                background: h.completed ? 'rgba(0,255,157,0.06)' : 'transparent',
                border: `1px solid ${h.completed ? 'rgba(0,255,157,0.12)' : 'transparent'}`,
                animation: `fadeIn 0.3s ease-out ${i * 50}ms both`,
                cursor: 'pointer', transition: 'all 0.2s'
              }} onClick={() => onCompleteHabit(h.id)}>
                <span className="fire-emoji" style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{h.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, color: COLORS.text, fontWeight: 500,
                    textDecoration: h.completed ? 'line-through' : 'none',
                    opacity: h.completed ? 0.5 : 1
                  }}>{h.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                    <span style={{ fontSize: 10, color: h.categoryInfo.color, background: `${h.categoryInfo.color}12`, padding: '1px 6px', borderRadius: 3 }}>
                      {h.categoryInfo.label}
                    </span>
                    {h.streak > 0 && (
                      <span style={{ fontSize: 10, color: COLORS.alert }}>{'\u{1F525}'} {h.streak}</span>
                    )}
                  </div>
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: h.completed ? 'rgba(0,255,157,0.16)' : COLORS.bg,
                  border: `1px solid ${h.completed ? 'rgba(0,255,157,0.32)' : COLORS.border}`,
                  boxShadow: h.completed ? 'inset 0 0 0 1px rgba(255,255,255,0.025)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {h.completed ? <Check size={13} className="completed-badge soft-check" /> : <div style={{ width: 4, height: 4, borderRadius: '50%', background: COLORS.textDim }} />}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLORS.textDim }}>
            <span>{kpis.completed}/{kpis.total} completados</span>
            <span style={{ color: kpis.total > 0 && kpis.completed === kpis.total ? COLORS.success : COLORS.textDim }}>
              {kpis.total > 0 ? `${Math.round((kpis.completed / kpis.total) * 100)}%` : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChallengesView = ({ data, onCompleteChallenge, onJoinChallenge, records }) => {
  const { habits, challenges } = data;
  const [showCreate, setShowCreate] = useState(false);
  const today = toYYYYMMDD(new Date());

  const activeC = challenges.filter(c => c.status === 'active');
  const completedC = challenges.filter(c => c.status === 'completed');
  const available = PREDEFINED_CHALLENGES.filter(pc => !challenges.some(c => c.id === pc.id));

  const handleJoinChallenge = (pc) => {
    const habitId = pc.target ? `ch_${pc.id}` : null;
    let habitData = null;
    if (pc.target && !habits.some(h => h.id === habitId)) {
      habitData = { id: habitId, name: pc.target.name, category: pc.target.category, icon: isBrokenHabitIcon(pc.target.icon) ? getCategoryIcon(pc.target.category) : pc.target.icon, frequency: pc.target.frequency, targetStreak: pc.target.targetStreak, description: `Reto: ${pc.name}`, createdAt: today, active: true };
    }
    const challenge = { id: pc.id, predefinedId: pc.id, name: pc.name, icon: pc.icon, desc: pc.desc, duration: pc.duration, difficulty: pc.difficulty, diffColor: pc.diffColor, target: pc.target, habitId, startDate: today, status: 'active', progress: 0 };
    onJoinChallenge(challenge, habitData);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>
          <Award size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: COLORS.primary }} />
          Desafíos 30 días
        </h3>
        <button onClick={() => setShowCreate(!showCreate)} style={{
          padding: '8px 16px', borderRadius: 8, border: 'none',
          background: showCreate ? COLORS.border : `${COLORS.primary}15`,
          color: showCreate ? COLORS.textDim : COLORS.primary,
          cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif"
        }}>{showCreate ? 'Cerrar' : 'Explorar Retos'}</button>
      </div>

      {showCreate && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 24 }}>
          {available.length === 0 && <div style={{ color: COLORS.textDim, fontSize: 13, textAlign: 'center', padding: 20, gridColumn: '1 / -1' }}>¡Ya uniste todos los retos disponibles!</div>}
          {available.map(pc => (
            <div key={pc.id} style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className="fire-emoji" style={{ fontSize: 28 }}>{pc.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{pc.name}</div>
                  <span style={{ fontSize: 11, color: pc.diffColor }}>{pc.difficulty}  {pc.duration} días</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 12 }}>{pc.desc}</div>
              <button onClick={() => handleJoinChallenge(pc)} style={{
                width: '100%', padding: '8px 16px', borderRadius: 8, border: 'none',
                background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff',
                cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif"
              }}>Aceptar Reto</button>
            </div>
          ))}
        </div>
      )}

      {activeC.length === 0 && completedC.length === 0 && !showCreate && (
        <div style={{ textAlign: 'center', padding: 40, color: COLORS.textDim }}>
          <div className="fire-emoji" style={{ fontSize: 48, marginBottom: 12 }}>{'\u{1F3AF}'}</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>No tienes retos activos</div>
          <div style={{ fontSize: 12, color: COLORS.textDim }}>Explora retos y acepta uno nuevo</div>
        </div>
      )}

      {activeC.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Activos</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {activeC.map(c => {
              const diff = Math.max(0, Math.floor((new Date(today) - new Date(c.startDate)) / (1000 * 60 * 60 * 24)));
              const progress = Math.min(1, diff / c.duration);
              return (
                <div key={c.id} style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span className="fire-emoji" style={{ fontSize: 28 }}>{c.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{c.name}</div>
                      <span style={{ fontSize: 11, color: c.diffColor || COLORS.textDim }}>{c.difficulty}  día {Math.min(c.duration, diff + 1)} de {c.duration}</span>
                    </div>
                    <span style={{ fontSize: 13, color: COLORS.primary, fontFamily: "'Inter', sans-serif" }}>{Math.round(progress * 100)}%</span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: COLORS.bg, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${progress * 100}%`, height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`, transition: 'width 0.5s ease' }} />
                  </div>
                  {diff >= c.duration && (
                    <button onClick={() => onCompleteChallenge(c.id, c.habitId)} style={{
                      width: '100%', marginTop: 12, padding: '10px 16px', borderRadius: 8, border: 'none',
                      background: `linear-gradient(135deg, ${COLORS.success}, #9f1239)`, color: '#000',
                      cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 500
                    }}>{'\u{1F381}'} Reclamar Recompensa!</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {completedC.length > 0 && (
        <div>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completados</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {completedC.map(c => (
              <div key={c.id} style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.success}30`, padding: 12, display: 'flex', alignItems: 'center', gap: 12, opacity: 0.7 }}>
                <span className="fire-emoji" style={{ fontSize: 24 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: COLORS.text }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.success }}>{'\u{2705}'} Completado {c.completedDate || ''}</div>
                </div>
                <Award size={20} color={COLORS.success} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HabitsView = ({ data, onAddHabit, onUpdateHabit, onDeleteHabit, onToggleHabit, onCompleteHabit, onUpdateRecord, records }) => {
  const { habits } = data;
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState('week');
  const [baseDate, setBaseDate] = useState(new Date());
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date(); start.setDate(start.getDate() - 30);
    return { start: toYYYYMMDD(start), end: toYYYYMMDD(end) };
  });
  const [calSelect, setCalSelect] = useState(null);

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'sáb', 'Dom'];

  const getWeekDays = (ref) => {
    const days = [];
    const monday = new Date(ref);
    const dow = monday.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    monday.setDate(monday.getDate() + diff);
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      days.push({ date: toYYYYMMDD(d), label: dayNames[i], dayNum: d.getDate(), full: d, isToday: toYYYYMMDD(d) === toYYYYMMDD(new Date()) });
    }
    return days;
  };

  const getMonthWeeks = (ref) => {
    const year = ref.getFullYear();
    const month = ref.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const offset = startDow === 0 ? 6 : startDow - 1;
    const calStart = new Date(firstDay);
    calStart.setDate(calStart.getDate() - offset);
    const weeks = [];
    let cursor = new Date(calStart);
    while (cursor <= lastDay || weeks.length < 6) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push({ date: toYYYYMMDD(cursor), dayNum: cursor.getDate(), isCurrentMonth: cursor.getMonth() === month, full: new Date(cursor), isToday: toYYYYMMDD(cursor) === toYYYYMMDD(new Date()) });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
      if (weeks.length >= 6) break;
    }
    return weeks;
  };

  const getCalWeeks = (ref) => {
    const year = ref.getFullYear();
    const month = ref.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const calStart = new Date(firstDay);
    calStart.setDate(calStart.getDate() - startDow);
    const weeks = [];
    let cursor = new Date(calStart);
    while (cursor <= lastDay || weeks.length < 6) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push({ date: toYYYYMMDD(cursor), dayNum: cursor.getDate(), isCurrentMonth: cursor.getMonth() === month, full: new Date(cursor), isToday: toYYYYMMDD(cursor) === toYYYYMMDD(new Date()) });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
      if (weeks.length >= 6) break;
    }
    return weeks;
  };

  const weekDays = getWeekDays(baseDate);
  const monthWeeks = getMonthWeeks(baseDate);
  const calWeeks = getCalWeeks(baseDate);
  const monthLabel = baseDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/\b\w/g, c => c.toUpperCase());
  const weekLabel = `${weekDays[0].dayNum} ${baseDate.toLocaleDateString('es-ES', { month: 'short' })} - ${weekDays[6].dayNum} ${weekDays[6].full.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}`;

  const calDayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'sáb'];

  const navigate = (dir) => {
    const d = new Date(baseDate);
    if (viewMode === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setBaseDate(d);
  };

  const filtered = useMemo(() => {
    let list = habits;
    if (filter !== 'all') list = list.filter(h => h.category === filter);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [habits, filter]);

  const handleSave = (habitData) => {
    if (editHabit) {
      onUpdateHabit({ ...habitData, id: editHabit.id });
    } else {
      onAddHabit({
        ...habitData,
        id: `h${Date.now()}`,
        createdAt: toYYYYMMDD(new Date()),
        active: true
      });
    }
    setShowForm(false);
    setEditHabit(null);
  };

  const handleEdit = (h) => {
    setEditHabit(h);
    setShowForm(true);
  };

  const handleDelete = (h) => {
    setConfirmDelete(h);
  };

  const handleDateRangeChange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange({ start: toYYYYMMDD(start), end: toYYYYMMDD(end) });
    setCalSelect(null);
  };

  const isRangeActive = (days) => {
    const expectedStart = toYYYYMMDD(addDays(new Date(), -days));
    const expectedEnd = toYYYYMMDD(new Date());
    return dateRange.start === expectedStart && dateRange.end === expectedEnd;
  };

  const goToToday = () => {
    setBaseDate(new Date());
    handleDateRangeChange(30);
  };

  const handleCalDayClick = (dateStr) => {
    if (!calSelect) {
      setCalSelect(dateStr);
      setDateRange({ start: dateStr, end: dateStr });
    } else {
      const dates = [calSelect, dateStr].sort();
      setDateRange({ start: dates[0], end: dates[1] });
      setCalSelect(null);
    }
  };

  const isInRange = (dateStr) => {
    return dateStr >= dateRange.start && dateStr <= dateRange.end;
  };

  const formatRangeLabel = () => {
    const s = new Date(dateRange.start + 'T00:00:00');
    const e = new Date(dateRange.end + 'T00:00:00');
    if (dateRange.start === dateRange.end) return s.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    return `${s.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${e.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const renderDayGrid = (h) => {
    const getDayCompletion = (dateStr) => {
      const rec = records.find(r => r.habitId === h.id && r.date === dateStr);
      return rec ? rec.completed : false;
    };
    if (viewMode === 'week') {
      return (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
            {dayNames.map(d => (
              <div key={d} style={{ fontSize: 9, color: COLORS.textDim + '80', textAlign: 'center', padding: '2px 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {weekDays.map((wd, wi) => {
              const done = getDayCompletion(wd.date);
              const rec = records.find(r => r.habitId === h.id && r.date === wd.date);
              const isSkipped = rec && rec.skipped;
              const isToday = wd.isToday;
              const isScheduled = isExpectedDay(h, wd.date);
              const isPast = new Date(wd.date + 'T00:00:00') <= new Date();
              return (
                <div key={wi} style={{ textAlign: 'center', padding: '4px 0', position: 'relative' }}>
                  <div onClick={isToday ? () => onCompleteHabit(h.id) : undefined} style={{
                    width: 28, height: 28, borderRadius: '50%', margin: '0 auto 4px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? `linear-gradient(135deg, ${COLORS.success}, #9f1239)` : isSkipped ? `${COLORS.textDim}15` : isScheduled ? `${COLORS.primary}12` : 'transparent',
                    border: done ? 'none' : isSkipped ? `1.5px dashed ${COLORS.textDim}50` : isToday ? `2px solid ${COLORS.primary}80` : isScheduled ? `1.5px solid ${COLORS.primary}55` : `1.5px dashed ${COLORS.border}35`,
                    transition: 'all 0.25s ease',
                    boxShadow: done ? `0 2px 8px ${COLORS.success}40` : 'none',
                    cursor: isToday ? 'pointer' : 'default',
                    opacity: isScheduled ? (isPast || isToday ? 1 : 0.55) : 0.22
                  }}>
                    {done ? <Check size={13} color="#0a0a0f" strokeWidth={3.5} /> : isSkipped ? <span style={{ fontSize: 11, color: COLORS.textDim }}>-</span> : !isScheduled ? <span style={{ fontSize: 11, color: COLORS.textDim }}>·</span> : null}
                  </div>
                  <div style={{
                    fontSize: 10, color: isToday ? COLORS.primary : COLORS.textDim + '99',
                    fontWeight: isToday ? 700 : 400,
                    fontFamily: "'Inter', sans-serif"
                  }}>{wd.dayNum}</div>
                  {isToday && <div style={{
                    position: 'absolute', top: -2, left: '50%', marginLeft: -2,
                    width: 4, height: 4, borderRadius: '50%', background: COLORS.primary
                  }} />}
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (viewMode === 'month') {
      return (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 6 }}>
            {dayNames.map(d => (
              <div key={d} style={{ fontSize: 8, color: COLORS.textDim + '80', textAlign: 'center', padding: '2px 0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>{d}</div>
            ))}
          </div>
          {monthWeeks.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
              {week.map((wd, di) => {
                const done = getDayCompletion(wd.date);
                const scheduled = isExpectedDay(h, wd.date);
                return (
                  <div key={di} style={{
                    textAlign: 'center', padding: '6px 0', borderRadius: 8,
                    opacity: wd.isCurrentMonth ? (scheduled ? 1 : 0.3) : 0.12,
                    background: wd.isToday ? `${COLORS.primary}12` : 'transparent',
                    position: 'relative'
                  }}>
                    <div style={{
                      fontSize: 11, color: wd.isToday ? COLORS.primary : COLORS.textDim + 'cc',
                      fontWeight: wd.isToday ? 700 : 400,
                      fontFamily: "'Inter', sans-serif", marginBottom: 4
                    }}>{wd.dayNum}</div>
                    {wd.isCurrentMonth && (
                      <div style={{
                        width: 5, height: 5, borderRadius: '50%', margin: '0 auto',
                        background: done ? COLORS.success : scheduled ? `${COLORS.primary}75` : `${COLORS.border}30`,
                        transition: 'all 0.2s'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CalendarPicker = () => (
    <div style={{ background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => { const d = new Date(baseDate); d.setMonth(d.getMonth() - 1); setBaseDate(d); }} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', padding: 4 }}><ChevronLeft size={18} /></button>
        <span style={{ fontSize: 15, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>{monthLabel}</span>
        <button onClick={() => { const d = new Date(baseDate); d.setMonth(d.getMonth() + 1); setBaseDate(d); }} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', padding: 4 }}><ChevronRight size={18} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
        {calDayNames.map(d => (
          <div key={d} style={{ fontSize: 9, color: COLORS.textDim, textAlign: 'center', padding: '4px 0', textTransform: 'uppercase', fontWeight: 500 }}>{d}</div>
        ))}
      </div>
      {calWeeks.map((week, wi) => (
        <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
          {week.map((wd, di) => {
            const inRange = isInRange(wd.date);
            const isStart = wd.date === dateRange.start;
            const isEnd = wd.date === dateRange.end;
            return (
              <button key={di} onClick={() => handleCalDayClick(wd.date)} disabled={!wd.isCurrentMonth} style={{
                textAlign: 'center', padding: '6px 0', borderRadius: 6, border: 'none', cursor: wd.isCurrentMonth ? 'pointer' : 'default',
                background: isStart || isEnd ? `linear-gradient(135deg, ${COLORS.primary}, #7f1028)` : inRange ? `${COLORS.primary}25` : 'transparent',
                color: (isStart || isEnd) ? '#fff' : wd.isToday ? COLORS.primary : wd.isCurrentMonth ? COLORS.text : COLORS.textDim,
                fontWeight: (isStart || isEnd || wd.isToday) ? 600 : 400, fontSize: 12,
                opacity: wd.isCurrentMonth ? 1 : 0.2, transition: 'all 0.15s', fontFamily: "'Inter', sans-serif"
              }}>
                {wd.dayNum}
              </button>
            );
          })}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COLORS.border}` }}>
        <span style={{ fontSize: 11, color: COLORS.textDim }}>
          {calSelect ? 'Selecciona el día final' : `${formatRangeLabel()} - ${Math.ceil((new Date(dateRange.end + 'T00:00:00') - new Date(dateRange.start + 'T00:00:00')) / 86400000) + 1} días`}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[7, 14, 30, 60].map(n => (
            <button key={n} onClick={() => handleDateRangeChange(n)} style={{
              padding: '2px 10px', borderRadius: 6, border: `1px solid ${isRangeActive(n) ? COLORS.primary : COLORS.border}`,
              background: isRangeActive(n) ? `${COLORS.primary}20` : 'transparent',
              color: isRangeActive(n) ? COLORS.primary : COLORS.textDim, cursor: 'pointer',
              fontSize: 10, fontFamily: "'Inter', sans-serif", transition: 'all 0.2s'
            }}>{n}d</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="habits-mobile-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="habits-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 20, color: COLORS.text, fontFamily: "'DM Serif Display', serif", margin: 0, letterSpacing: '-0.01em' }}>Mis Hábitos</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 2, background: COLORS.bg, borderRadius: 10, padding: 3, border: `1px solid ${COLORS.border}` }}>
            {[
              { key: 'week', label: 'Semana', icon: 'M3 3h4v4H3V3zm7 0h4v4h-4V3zm7 0h4v4h-4V3z' },
              { key: 'month', label: 'Mes', icon: 'M3 10h18M3 14h18M3 18h18M3 22h18' },
              { key: 'calendar', label: 'Personalizado', icon: 'M3 8h18V6a1 1 0 00-1-1H4a1 1 0 00-1 1v2zm0 0v12a1 1 0 001 1h16a1 1 0 001-1V8H3z' }
            ].map(m => (
              <button key={m.key} onClick={() => setViewMode(m.key)} style={{
                padding: '5px 12px', borderRadius: 7, border: 'none',
                background: viewMode === m.key ? `linear-gradient(135deg, ${COLORS.primary}, #7f1028)` : 'transparent',
                color: viewMode === m.key ? '#fff' : COLORS.textDim,
                cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s', fontWeight: viewMode === m.key ? 500 : 400,
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                {viewMode === m.key && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {m.label}
              </button>
            ))}
          </div>
          <RippleButton onClick={() => { setEditHabit(null); setShowForm(true); }} style={{
            padding: '7px 14px', borderRadius: 8, border: 'none',
            background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff',
            fontSize: 12, fontFamily: "'Inter', sans-serif", cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500,
            boxShadow: `0 2px 8px ${COLORS.primary}30`
          }}>
            <Plus size={14} /> Nuevo
          </RippleButton>
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: viewMode === 'calendar' ? 14 : 16, flexWrap: 'wrap', gap: 8
      }}>
        <div className="habits-date-row" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => navigate(-1)} style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'transparent', border: 'none',
            color: COLORS.textDim, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s'
          }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{
            fontSize: 14, color: COLORS.text, fontFamily: "'Inter', sans-serif",
            fontWeight: 500, margin: '0 4px', minWidth: 140, textAlign: 'center'
          }}>
            {viewMode === 'week' ? weekLabel : viewMode === 'month' ? monthLabel : formatRangeLabel()}
          </span>
          <button onClick={() => navigate(1)} style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'transparent', border: 'none',
            color: COLORS.textDim, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s'
          }}>
            <ChevronRight size={16} />
          </button>
          <button onClick={goToToday} style={{
            padding: '4px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
            background: 'transparent', color: COLORS.textDim, cursor: 'pointer',
            fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 500,
            transition: 'all 0.15s', marginLeft: 4
          }}>Hoy</button>
        </div>
        {viewMode !== 'calendar' && (
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {[7, 14, 30, 60].map(n => (
              <button key={n} onClick={() => handleDateRangeChange(n)} style={{
                padding: '4px 10px', borderRadius: 6, border: 'none',
                background: isRangeActive(n) ? `linear-gradient(135deg, ${COLORS.primary}, #7f1028)` : 'transparent',
                color: isRangeActive(n) ? '#fff' : COLORS.textDim + '99',
                cursor: 'pointer', fontSize: 10, fontFamily: "'Inter', sans-serif",
                fontWeight: isRangeActive(n) ? 500 : 400,
                transition: 'all 0.2s'
              }}>{n}d</button>
            ))}
          </div>
        )}
      </div>

      {viewMode === 'calendar' && <CalendarPicker />}

      <div className="habits-filter-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
        {[
          { id: 'all', label: 'Todos', icon: '', color: COLORS.primary },
          ...CATEGORIES
        ].map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{
            padding: '5px 14px', borderRadius: 20, border: 'none',
            background: filter === c.id ? `${c.color}20` : 'transparent',
            color: filter === c.id ? c.color : COLORS.textDim + 'aa',
            cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif",
            fontWeight: filter === c.id ? 600 : 400, transition: 'all 0.2s',
            border: filter === c.id ? `1px solid ${c.color}40` : `1px solid transparent`
          }}>{c.icon && <span className="fire-emoji" style={{ marginRight: 4 }}>{c.icon}</span>}{c.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.map((h, i) => {
          const cat = getCategoryInfo(h.category);
          const streak = getCurrentStreak(h.id, records, h);
          const bestStreak = getBestStreak(h.id, records, h);
          const rangeDays = Math.max(1, Math.ceil((new Date(dateRange.end + 'T00:00:00') - new Date(dateRange.start + 'T00:00:00')) / 86400000));
          const rate = getCompletionRate(h.id, records, rangeDays, h);
          const metaPct = Math.min(100, Math.round((streak / h.targetStreak) * 100));
          const todayRec = records.find(r => r.habitId === h.id && r.date === toYYYYMMDD(new Date()));
          const isTodayComplete = todayRec && todayRec.completed;
          const isTodaySkipped = todayRec && todayRec.skipped;

          return (
            <div key={h.id} className="habit-card" style={{
              background: COLORS.card, borderRadius: 16,
              padding: 20, opacity: h.active ? 1 : 0.4,
              border: `1px solid ${COLORS.border}`,
              transition: 'all 0.2s',
              animation: `fadeIn 0.35s ease-out ${i * 50}ms both`,
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `linear-gradient(135deg, ${cat.color}25, ${cat.color}10)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, border: `1px solid ${cat.color}15`
                  }}><span className="fire-emoji">{h.icon}</span></div>
                  <div>
                    <div style={{ fontSize: 15, color: COLORS.text, fontWeight: 600, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em' }}>{h.name}</div>
                    <div style={{
                      fontSize: 10, color: cat.color, marginTop: 3,
                      fontFamily: "'Inter', sans-serif", fontWeight: 500,
                      background: `${cat.color}12`, padding: '1px 7px', borderRadius: 4,
                      display: 'inline-block'
                    }}>
                      <span className="fire-emoji">{cat.icon}</span> {cat.label}
                    </div>
                    {h.frequency === 'Personalizado' && h.frequencyDays?.length > 0 && (
                      <div style={{
                        marginTop: 5, fontSize: 10, color: COLORS.primary,
                        fontFamily: "'Inter', sans-serif", fontWeight: 700,
                        letterSpacing: '0.03em'
                      }}>
                        Programado: {h.frequencyDays.map(d => DAY_LABELS[d]).join(' · ')}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {isTodaySkipped ? (
                    <button onClick={() => onCompleteHabit(h.id)} style={{
                      padding: '3px 8px', borderRadius: 6, border: `1px solid ${COLORS.success}50`,
                      background: `${COLORS.success}12`, cursor: 'pointer',
                      fontSize: 10, fontFamily: "'Inter', sans-serif", color: COLORS.success,
                      display: 'flex', alignItems: 'center', gap: 3, fontWeight: 500
                    }}>
                      <Check size={10} /> Hacer
                    </button>
                  ) : isTodayComplete ? (
                    <button onClick={() => onCompleteHabit(h.id)} style={{
                      padding: '3px 8px', borderRadius: 6, border: `1px solid ${COLORS.success}40`,
                      background: `${COLORS.success}20`, cursor: 'pointer',
                      fontSize: 10, fontFamily: "'Inter', sans-serif", color: COLORS.success,
                      display: 'flex', alignItems: 'center', gap: 3, fontWeight: 500
                    }}>
                      <Check size={10} /> Hecho
                    </button>
                  ) : (
                    <button onClick={() => onCompleteHabit(h.id)} style={{
                      padding: '3px 8px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
                      background: 'transparent', cursor: 'pointer',
                      fontSize: 10, fontFamily: "'Inter', sans-serif", color: COLORS.textDim,
                      display: 'flex', alignItems: 'center', gap: 3, fontWeight: 500
                    }}>
                      <Check size={10} /> Hoy
                    </button>
                  )}
                  {!isTodayComplete && !isTodaySkipped && (
                    <button className="habit-skip-mobile" onClick={() => {
                      const today = toYYYYMMDD(new Date());
                      onUpdateRecord(h.id, today, { skipped: true, completed: false });
                    }} style={{
                      padding: '3px 6px', borderRadius: 6, border: 'none',
                      background: 'transparent', cursor: 'pointer',
                      fontSize: 10, fontFamily: "'Inter', sans-serif", color: COLORS.textDim + '99',
                      display: 'flex', alignItems: 'center', gap: 2
                    }}>
                      <span style={{ fontSize: 12 }}>-</span>
                    </button>
                  )}
                  {[
                    { icon: h.active ? <Eye size={11} /> : <EyeOff size={11} />, onClick: () => onToggleHabit(h.id), color: h.active ? COLORS.success : COLORS.textDim },
                    { icon: <Edit size={11} />, onClick: () => handleEdit(h), color: COLORS.textDim },
                    { icon: <Trash2 size={11} />, onClick: () => handleDelete(h), color: COLORS.textDim }
                  ].map((btn, bi) => (
                    <button key={bi} onClick={btn.onClick} style={{
                      width: 26, height: 26, borderRadius: 6, border: 'none',
                      background: 'transparent', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: btn.color, transition: 'all 0.15s'
                    }}><span className="fire-emoji">{btn.icon}</span></button>
                  ))}
                </div>
              </div>

              {viewMode !== 'calendar' && renderDayGrid(h)}

              <div className="habit-stats-grid" style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
                marginBottom: 12
              }}>
                {[
                  { label: 'Racha', icon: '\u{1F525}', value: streak, color: COLORS.alert },
                  { label: 'Mejor', icon: '\u{1F3C6}', value: bestStreak, color: COLORS.primary },
                  { label: viewMode === 'calendar' ? 'Rango' : 'Este mes', icon: '\u{1F4C5}', value: `${Math.round(rate * 100)}%`, color: COLORS.success },
                  { label: 'Meta', icon: '\u{1F3AF}', value: `${metaPct}%`, color: COLORS.secondary }
                ].map((stat, si) => (
                  <div key={si} style={{
                    background: COLORS.bg, borderRadius: 8,
                    padding: '8px 6px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 9, color: COLORS.textDim + 'aa', marginBottom: 3, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}><span className="fire-emoji">{stat.icon}</span> {stat.label}</div>
                    <div style={{ fontSize: 17, color: stat.color, fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: '-0.02em' }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  flex: 1, height: 5, background: COLORS.bg, borderRadius: 3,
                  overflow: 'hidden', position: 'relative'
                }}>
                  <div style={{
                    width: `${metaPct}%`, height: '100%', borderRadius: 3,
                    background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
                <div style={{
                  fontSize: 10, color: COLORS.textDim + 'cc',
                  fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  minWidth: 44, textAlign: 'right',
                  background: COLORS.bg, padding: '2px 8px', borderRadius: 4
                }}>
                  {streak}/{h.targetStreak} días
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.textDim, background: COLORS.card, borderRadius: 16, border: `1px dashed ${COLORS.border}` }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>{'\u{1F4CB}'}</div>
            <div style={{ fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 500, marginBottom: 4 }}>No hay hábitos aquí aún</div>
            <div style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: COLORS.textDim + '99' }}>Crea tu primer hábito para empezar</div>
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditHabit(null); }}
        title={editHabit ? 'Editar Hábito' : 'Nuevo Hábito'}>
        <HabitForm initial={editHabit} onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditHabit(null); }} />
      </Modal>

      <ConfirmModal isOpen={!!confirmDelete} title="Eliminar Hábito"
        message={`¿estás seguro de eliminar "${confirmDelete?.name}"? Se perdern todos sus registros.`}
        danger onConfirm={() => { onDeleteHabit(confirmDelete.id); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)} />
    </div>
  );
};

const FinanceView = ({ data, onUpdateFinance }) => {
  const finance = data.financeData || getFinanceData();
  const s = { fontFamily: "'Inter', sans-serif" };
  const categories = finance.categories || [];
  const expenseCategories = categories.filter(c => c.id !== 'income');
  const transactions = finance.transactions || [];
  const accounts = finance.accounts || [];
  const recurring = finance.recurring || [];
  const goals = finance.goals || [];
  const budgets = finance.budgets || {};
  const today = toYYYYMMDD(new Date());
  const [selectedMonth, setSelectedMonth] = useState(today.slice(0, 7));
  const [form, setForm] = useState({ type: 'expense', amount: '', category: expenseCategories[0]?.id || categories[0]?.id || 'food', accountId: accounts[0]?.id || 'cash', payee: '', note: '', date: today });
  const [accountForm, setAccountForm] = useState({ name: '', balance: '' });
  const [recurringForm, setRecurringForm] = useState({ name: '', amount: '', category: expenseCategories[0]?.id || 'food', day: 1, type: 'expense' });
  const [goalForm, setGoalForm] = useState({ name: '', target: '', saved: '', dueDate: '' });
  const [goalAdds, setGoalAdds] = useState({});
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [catName, setCatName] = useState('');
  const [section, setSection] = useState('overview');

  const monthDate = new Date(`${selectedMonth}-01T12:00:00`);
  const monthly = transactions.filter(t => (t.date || '').startsWith(selectedMonth));
  const income = monthly.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
  const expenses = monthly.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
  const balance = income - expenses;
  const budget = Number(finance.monthlyBudget || 0);
  const budgetTotal = expenseCategories.reduce((sum, c) => sum + Number(budgets[c.id] || 0), 0) || budget;
  const budgetPct = budget > 0 ? Math.min(100, Math.round((expenses / budget) * 100)) : 0;
  const currency = finance.currency || 'USD';
  const copRate = Math.max(1, Number(finance.copRate || 4000));
  const toDisplayAmount = (n) => currency === 'COP' ? Number(n || 0) * copRate : Number(n || 0);
  const fromDisplayAmount = (n) => currency === 'COP' ? Number(n || 0) / copRate : Number(n || 0);
  const cleanDisplayValue = (n) => {
    const v = toDisplayAmount(n);
    if (!v) return '';
    return Number.isInteger(v) ? String(v) : v.toFixed(2);
  };
  const moneyUSD = (n) => Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const moneyCOP = (n) => Number(Number(n || 0) * copRate).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  const money = (n) => `${moneyUSD(n)} · ${moneyCOP(n)}`;
  const catById = (id) => categories.find(c => c.id === id) || { name: 'Sin categoria', color: COLORS.textDim };
  const accountById = (id) => accounts.find(a => a.id === id) || accounts[0] || { name: 'Sin cuenta' };
  const inputStyle = { padding: '10px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, outline: 'none', boxSizing: 'border-box', ...s };
  const cardStyle = { background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.border}`, padding: 20, boxShadow: '0 18px 50px rgba(0,0,0,0.18)', minWidth: 0, overflow: 'hidden' };
  const tooltipStyle = { background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text };

  const byCategory = expenseCategories.map(cat => {
    const spent = monthly.filter(t => t.type === 'expense' && t.category === cat.id).reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const limit = Number(budgets[cat.id] || 0);
    return { id: cat.id, name: cat.name, value: spent, limit, pct: limit ? Math.min(100, Math.round((spent / limit) * 100)) : 0, color: cat.color };
  }).filter(c => c.value > 0 || c.limit > 0);

  const filteredTransactions = transactions.filter(t => {
    const typeOk = filterType === 'all' || t.type === filterType;
    const q = search.trim().toLowerCase();
    const text = `${t.payee || ''} ${t.note || ''} ${catById(t.category).name}`.toLowerCase();
    return typeOk && (!q || text.includes(q));
  }).slice(0, 18);

  const accountBalances = accounts.map(a => {
    const movement = transactions.filter(t => (t.accountId || accounts[0]?.id) === a.id).reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount || 0) : -Number(t.amount || 0)), 0);
    return { ...a, current: Number(a.balance || 0) + movement };
  });
  const netWorth = accountBalances.reduce((sum, a) => sum + Number(a.current || 0), 0);
  const activeRecurring = recurring.filter(r => r.active !== false);
  const recurringExpense = activeRecurring.filter(r => r.type === 'expense').reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const savingsTarget = goals.reduce((sum, g) => sum + Math.max(0, Number(g.target || 0) - Number(g.saved || 0)), 0);
  const goalMonthlyNeed = Math.round(goals.reduce((sum, g) => {
    if (!g.dueDate || !g.target) return sum;
    const months = Math.max(1, Math.ceil((new Date(g.dueDate + 'T12:00:00') - new Date()) / (1000 * 60 * 60 * 24 * 30)));
    return sum + Math.max(0, (Number(g.target || 0) - Number(g.saved || 0)) / months);
  }, 0));
  const available = income - expenses - recurringExpense - goalMonthlyNeed;
  const savingRate = income ? Math.round((balance / income) * 100) : 0;

  const monthKeys = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() - (5 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const cashFlow = monthKeys.map(key => {
    const items = transactions.filter(t => (t.date || '').startsWith(key));
    const inc = items.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const exp = items.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const d = new Date(`${key}-01T12:00:00`);
    return { name: d.toLocaleDateString('es-ES', { month: 'short' }), ingresos: inc, gastos: exp, balance: inc - exp };
  });
  const accountChartData = accountBalances.map(a => ({ name: a.name, balance: a.current }));
  const financeSections = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'movements', label: 'Movimientos', icon: List },
    { id: 'accounts', label: 'Cuentas', icon: CreditCard },
    { id: 'budget', label: 'Presupuesto', icon: Target },
    { id: 'recurring', label: 'Recurrentes', icon: Repeat },
    { id: 'goals', label: 'Metas', icon: Sparkles }
  ];

  const insights = [
    budgetPct > 90 ? `Alerta: ya usaste ${budgetPct}% del presupuesto mensual.` : `Presupuesto sano: vas en ${budgetPct}% del mes.`,
    available < 0 ? `Tu disponible proyectado queda negativo: ${money(available)}.` : `Disponible proyectado despues de gastos, recurrentes y metas: ${money(available)}.`,
    goalMonthlyNeed > 0 ? `Para cumplir tus metas, separa aprox. ${money(goalMonthlyNeed)} este mes.` : 'Crea una meta para empezar a separar dinero con intención.',
    recurringExpense > 0 ? `Pagos recurrentes estimados este mes: ${money(recurringExpense)}.` : 'Agrega pagos recurrentes para anticipar obligaciones.'
  ];

  const addTransaction = () => {
    const amount = fromDisplayAmount(form.amount);
    if (!amount || amount <= 0) return;
    const category = form.type === 'income' ? 'income' : form.category;
    onUpdateFinance(prev => ({
      ...prev,
      transactions: [{ ...form, id: `fin_${Date.now()}`, amount, category, accountId: form.accountId || (prev.accounts || [])[0]?.id || 'cash' }, ...(prev.transactions || [])]
    }));
    setForm(f => ({ ...f, amount: '', payee: '', note: '', date: today }));
  };

  const removeTransaction = (id) => {
    onUpdateFinance(prev => ({ ...prev, transactions: (prev.transactions || []).filter(t => t.id !== id) }));
  };

  const addCategory = () => {
    const clean = catName.trim();
    if (!clean) return;
    const colors = ['#e11d48', '#efefef', '#ff6b6b', '#00ff9d', '#ffd93d', '#a0a0b8'];
    onUpdateFinance(prev => ({
      ...prev,
      categories: [...(prev.categories || []), { id: `cat_${Date.now()}`, name: clean, color: colors[(prev.categories || []).length % colors.length] }]
    }));
    setCatName('');
  };

  const addAccount = () => {
    const clean = accountForm.name.trim();
    if (!clean) return;
    onUpdateFinance(prev => ({ ...prev, accounts: [...(prev.accounts || []), { id: `acc_${Date.now()}`, name: clean, type: 'custom', balance: fromDisplayAmount(accountForm.balance) }] }));
    setAccountForm({ name: '', balance: '' });
  };

  const updateBudget = (catId, amount) => {
    onUpdateFinance(prev => ({ ...prev, budgets: { ...(prev.budgets || {}), [catId]: fromDisplayAmount(amount) } }));
  };

  const addRecurring = () => {
    const name = recurringForm.name.trim();
    const amount = fromDisplayAmount(recurringForm.amount);
    if (!name || !amount) return;
    onUpdateFinance(prev => ({ ...prev, recurring: [{ ...recurringForm, id: `rec_${Date.now()}`, amount, day: Number(recurringForm.day || 1), active: true }, ...(prev.recurring || [])] }));
    setRecurringForm(f => ({ ...f, name: '', amount: '' }));
  };

  const payRecurring = (item) => {
    onUpdateFinance(prev => ({
      ...prev,
      transactions: [{ id: `fin_${Date.now()}`, type: item.type || 'expense', amount: Number(item.amount || 0), category: item.category || 'home', accountId: (prev.accounts || [])[0]?.id || 'cash', payee: item.name, note: 'Pago recurrente', date: `${selectedMonth}-${String(item.day || 1).padStart(2, '0')}` }, ...(prev.transactions || [])]
    }));
  };

  const removeRecurring = (id) => onUpdateFinance(prev => ({ ...prev, recurring: (prev.recurring || []).filter(r => r.id !== id) }));

  const addGoal = () => {
    const name = goalForm.name.trim();
    const target = fromDisplayAmount(goalForm.target);
    if (!name || !target) return;
    onUpdateFinance(prev => ({ ...prev, goals: [{ ...goalForm, id: `goal_${Date.now()}`, target, saved: fromDisplayAmount(goalForm.saved || 0) }, ...(prev.goals || [])] }));
    setGoalForm({ name: '', target: '', saved: '', dueDate: '' });
  };

  const contributeGoal = (goalId) => {
    const amount = fromDisplayAmount(goalAdds[goalId] || 0);
    if (!amount) return;
    onUpdateFinance(prev => ({ ...prev, goals: (prev.goals || []).map(g => {
      const target = Number(g.target || 0);
      const saved = Number(g.saved || 0);
      if (g.id !== goalId || (target && saved >= target)) return g;
      return { ...g, saved: Math.min(target, saved + amount) };
    }) }));
    setGoalAdds(prev => ({ ...prev, [goalId]: '' }));
  };

  const removeGoal = (id) => onUpdateFinance(prev => ({ ...prev, goals: (prev.goals || []).filter(g => g.id !== id) }));

  return (
    <div className="finance-mobile-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="lab-shell-card finance-hero" style={{ borderRadius: 26, padding: 28, marginBottom: 20 }}>
        <div className="finance-hero-grid" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div className="lab-pill" style={{ display: 'inline-flex', padding: '7px 11px', fontSize: 11, marginBottom: 12 }}>FINANZAS PRO</div>
            <h2 className="lab-hero-title" style={{ fontSize: 36, lineHeight: 1.05, marginBottom: 8 }}>Tu centro financiero personal.</h2>
            <div style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.7, maxWidth: 620 }}>Presupuesto por categoria, flujo de caja, metas, cuentas, recurrentes e insights en una sola vista.</div>
          </div>
          <div className="finance-available-card" style={{ minWidth: 250 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 6, ...s }}>Disponible proyectado</div>
            <div style={{ fontSize: 34, color: available >= 0 ? COLORS.success : COLORS.alert, fontFamily: "'DM Serif Display', serif" }}>{money(available)}</div>
            <div style={{ color: COLORS.textDim, fontSize: 11, ...s }}>Mes: {monthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</div>
            <div className="finance-currency-controls" style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: 8, marginTop: 12 }}>
              <select value={currency} onChange={e => onUpdateFinance(prev => ({ ...prev, currency: e.target.value }))} style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }}>
                <option value="USD">USD</option>
                <option value="COP">COP</option>
              </select>
              <input type="number" min="1" value={copRate} onChange={e => onUpdateFinance(prev => ({ ...prev, copRate: Math.max(1, Number(e.target.value || 1)) }))} placeholder="COP por 1 USD" style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }} />
            </div>
            <div style={{ color: COLORS.textDim, fontSize: 10, marginTop: 6, ...s }}>Tasa editable para convertir tus datos entre USD y COP.</div>
          </div>
        </div>
      </div>

      <div className="finance-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Ingresos del mes', value: money(income), color: COLORS.success },
          { label: 'Gastos del mes', value: money(expenses), color: COLORS.alert },
          { label: 'Balance mensual', value: money(balance), color: balance >= 0 ? COLORS.success : COLORS.alert },
          { label: 'Patrimonio', value: money(netWorth), color: COLORS.text },
          { label: 'Tasa de ahorro', value: `${savingRate}%`, color: savingRate >= 10 ? COLORS.success : COLORS.primary }
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, color: k.color, fontWeight: 700 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="finance-section-tabs" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {financeSections.map(item => {
          const Icon = item.icon;
          const active = section === item.id;
          return (
            <button key={item.id} onClick={() => setSection(item.id)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: `1px solid ${active ? COLORS.primary : COLORS.border}`,
              background: active ? `${COLORS.primary}18` : COLORS.card,
              color: active ? COLORS.primary : COLORS.textDim,
              borderRadius: 999,
              padding: '10px 14px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: 12,
              ...s
            }}>
              <Icon size={14} /> {item.label}
            </button>
          );
        })}
      </div>

      <div className="finance-layout" style={{ display: 'grid', gridTemplateColumns: ['overview', 'accounts', 'budget'].includes(section) ? 'minmax(0, 1.45fr) minmax(330px, 0.9fr)' : '1fr', gap: 18, alignItems: 'start' }}>
        <div className="finance-main-column" style={{ display: ['overview', 'movements', 'accounts', 'budget'].includes(section) ? 'grid' : 'none', gap: 18 }}>
          <div className="finance-card finance-transaction-card" style={{ ...cardStyle, display: section === 'movements' ? 'block' : 'none' }}>
            <div className="finance-card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 17, color: COLORS.text, margin: 0 }}>Registrar movimiento</h3>
              <input type="month" value={selectedMonth} onClick={e => openNativeDatePicker(e.currentTarget)} onFocus={e => openNativeDatePicker(e.currentTarget)} onChange={e => setSelectedMonth(e.target.value || today.slice(0, 7))} style={{ ...inputStyle, width: 160, cursor: 'pointer' }} />
            </div>
            <div className="finance-form-row finance-form-row-3" style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', gap: 10, marginBottom: 10 }}>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value, category: e.target.value === 'income' ? 'income' : (expenseCategories[0]?.id || f.category) }))} style={inputStyle}>
                <option value="expense">Gasto</option><option value="income">Ingreso</option>
              </select>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder={`Monto ${currency}`} style={inputStyle} />
              <input type="date" value={form.date} onClick={e => openNativeDatePicker(e.currentTarget)} onFocus={e => openNativeDatePicker(e.currentTarget)} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }} />
            </div>
            <div className="finance-form-row finance-form-row-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10 }}>
              <select value={form.category} disabled={form.type === 'income'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, opacity: form.type === 'income' ? 0.55 : 1 }}>
                {(form.type === 'income' ? categories.filter(c => c.id === 'income') : expenseCategories).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))} style={inputStyle}>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <input value={form.payee} onChange={e => setForm(f => ({ ...f, payee: e.target.value }))} placeholder="Comercio / origen" style={inputStyle} />
              <button className="lab-cta" onClick={addTransaction} style={{ borderRadius: 999, padding: '10px 16px', cursor: 'pointer' }}><span>Agregar</span></button>
            </div>
            <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Nota opcional: supermercado, salario, factura..." style={{ ...inputStyle, width: '100%', marginTop: 10 }} />
          </div>

          <div className="finance-card finance-movements-card" style={{ ...cardStyle, display: section === 'movements' ? 'block' : 'none' }}>
            <div className="finance-card-header finance-card-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: 17, color: COLORS.text, margin: 0 }}>Movimientos</h3>
              <div className="finance-filter-row" style={{ display: 'flex', gap: 8 }}>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...inputStyle, padding: '8px 10px', fontSize: 11 }}>
                  <option value="all">Todos</option><option value="expense">Gastos</option><option value="income">Ingresos</option>
                </select>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." style={{ ...inputStyle, padding: '8px 10px', width: 170, fontSize: 11 }} />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 8, maxHeight: 470, overflowY: 'auto', paddingRight: 2 }}>
              {filteredTransactions.map(t => {
                const cat = catById(t.category);
                return (
                  <div className="finance-transaction-item" key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 12, background: 'rgba(239,239,239,0.035)', border: `1px solid ${COLORS.border}` }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: cat.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 700 }}>{t.payee || t.note || cat.name}</div>
                      <div style={{ color: COLORS.textDim, fontSize: 11 }}>{cat.name} · {accountById(t.accountId).name} · {t.date}</div>
                    </div>
                    <div style={{ color: t.type === 'income' ? '#10b981' : COLORS.alert, fontWeight: 800 }}>{t.type === 'income' ? '+' : '-'}{money(t.amount)}</div>
                    <button onClick={() => removeTransaction(t.id)} style={{ border: 'none', background: 'transparent', color: COLORS.textDim, cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                );
              })}
              {!filteredTransactions.length && <div style={{ color: COLORS.textDim, fontSize: 13, textAlign: 'center', padding: 18 }}>No hay movimientos con ese filtro.</div>}
            </div>
          </div>

          <div className="finance-card finance-chart-card" style={{ ...cardStyle, display: section === 'overview' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 17, color: COLORS.text, marginBottom: 14 }}>Flujo de caja</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cashFlow}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.textDim} tick={{ fontSize: 11 }} />
                <YAxis stroke={COLORS.textDim} tick={{ fontSize: 11 }} tickFormatter={v => currency === 'COP' ? `${Math.round(toDisplayAmount(v) / 1000)}k` : `$${Math.round(toDisplayAmount(v))}`} />
                <Tooltip formatter={v => money(v)} contentStyle={tooltipStyle} labelStyle={{ color: COLORS.text }} />
                <Line type="monotone" dataKey="ingresos" stroke={COLORS.success} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="gastos" stroke={COLORS.alert} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="balance" stroke={COLORS.primary} strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="finance-card finance-chart-card" style={{ ...cardStyle, display: section === 'accounts' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 17, color: COLORS.text, marginBottom: 14 }}>Balance por cuenta</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={accountChartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke={COLORS.textDim} tick={{ fontSize: 11 }} />
                <YAxis stroke={COLORS.textDim} tick={{ fontSize: 11 }} tickFormatter={v => moneyUSD(v)} />
                <Tooltip formatter={v => money(v)} contentStyle={tooltipStyle} labelStyle={{ color: COLORS.text }} />
                <Bar dataKey="balance" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="finance-card finance-budget-card" style={{ ...cardStyle, display: section === 'budget' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 17, color: COLORS.text, marginBottom: 14 }}>Presupuesto por categoria</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {expenseCategories.map(cat => {
                const spent = monthly.filter(t => t.type === 'expense' && t.category === cat.id).reduce((sum, t) => sum + Number(t.amount || 0), 0);
                const limit = Number(budgets[cat.id] || 0);
                const pct = limit ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
                return (
                  <div key={cat.id} style={{ padding: 12, borderRadius: 14, background: 'rgba(239,239,239,0.03)', border: `1px solid ${COLORS.border}` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 12, alignItems: 'center', marginBottom: 9 }}>
                      <div>
                        <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 800 }}><span style={{ color: cat.color }}>●</span> {cat.name}</div>
                        <div style={{ color: pct > 90 ? COLORS.alert : COLORS.textDim, fontSize: 11 }}>{money(spent)} usados de {money(limit)}</div>
                      </div>
                      <input type="number" value={cleanDisplayValue(limit)} onChange={e => updateBudget(cat.id, e.target.value)} placeholder={`Limite ${currency}`} style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }} />
                    </div>
                    <div style={{ height: 7, borderRadius: 99, background: COLORS.bg, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: pct > 90 ? COLORS.alert : `linear-gradient(90deg, ${cat.color}, ${COLORS.primary})` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="finance-side-column" style={{ display: ['overview', 'accounts', 'budget', 'recurring', 'goals'].includes(section) ? 'grid' : 'none', gap: 18 }}>
          <div className="finance-card finance-insights-card" style={{ ...cardStyle, display: section === 'overview' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Insights</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {insights.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 9, padding: '10px 11px', borderRadius: 12, background: idx === 1 && available < 0 ? 'rgba(255,107,107,0.08)' : 'rgba(239,239,239,0.035)', border: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 12, lineHeight: 1.45, ...s }}>
                  <Sparkles size={14} color={idx === 1 && available < 0 ? COLORS.alert : COLORS.primary} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="finance-card finance-monthly-budget-card" style={{ ...cardStyle, display: section === 'budget' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Presupuesto mensual</h3>
            <input type="number" value={cleanDisplayValue(finance.monthlyBudget)} onChange={e => onUpdateFinance(prev => ({ ...prev, monthlyBudget: fromDisplayAmount(e.target.value || 0) }))} placeholder={`Presupuesto ${currency}`} style={{ ...inputStyle, width: '100%', marginBottom: 12 }} />
            <div style={{ height: 8, background: COLORS.bg, borderRadius: 99, overflow: 'hidden' }}><div style={{ height: '100%', width: `${budgetPct}%`, background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.alert})`, borderRadius: 99 }} /></div>
            <div style={{ color: COLORS.textDim, fontSize: 11, marginTop: 8 }}>Usado: {money(expenses)} · Plan por categorías: {money(budgetTotal)}</div>
          </div>

          <div className="finance-card finance-accounts-card" style={{ ...cardStyle, display: section === 'accounts' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Cuentas</h3>
            <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
              {accountBalances.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 11px', borderRadius: 12, background: 'rgba(239,239,239,0.035)', border: `1px solid ${COLORS.border}` }}>
                  <div>
                    <div style={{ color: COLORS.text, fontSize: 12, fontWeight: 800 }}>{a.name}</div>
                    <div style={{ color: COLORS.textDim, fontSize: 10 }}>{a.type}</div>
                  </div>
                  <div style={{ color: a.current >= 0 ? COLORS.text : COLORS.alert, fontWeight: 800 }}>{money(a.current)}</div>
                </div>
              ))}
            </div>
            <div className="finance-compact-form" style={{ display: 'grid', gridTemplateColumns: '1fr 96px auto', gap: 8 }}>
              <input value={accountForm.name} onChange={e => setAccountForm(f => ({ ...f, name: e.target.value }))} placeholder="Nueva cuenta" style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }} />
              <input type="number" value={accountForm.balance} onChange={e => setAccountForm(f => ({ ...f, balance: e.target.value }))} placeholder={`Saldo ${currency}`} style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }} />
              <button className="finance-submit-button" onClick={addAccount} style={{ border: 'none', borderRadius: 10, background: COLORS.primary, color: '#fff', padding: '0 12px', cursor: 'pointer', fontWeight: 800, whiteSpace: 'nowrap' }}><Plus size={15} /> Agregar cuenta</button>
            </div>
          </div>

          <div className="finance-card finance-categories-card" style={{ ...cardStyle, display: section === 'budget' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Categorías</h3>
            <div className="finance-inline-form finance-category-form" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Nueva categoría" style={{ ...inputStyle, flex: 1, padding: '9px 11px' }} />
              <button className="finance-icon-button" onClick={addCategory} style={{ border: 'none', borderRadius: 10, background: COLORS.primary, color: '#fff', padding: '0 12px', cursor: 'pointer' }}><Plus size={15} /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{categories.map(c => <span key={c.id} className="lab-pill" style={{ padding: '6px 9px', fontSize: 11 }}><span style={{ color: c.color }}>●</span> {c.name}</span>)}</div>
          </div>

          <div className="finance-card finance-recurring-card" style={{ ...cardStyle, display: section === 'recurring' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Pagos recurrentes</h3>
            <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
              {activeRecurring.slice(0, 5).map(r => (
                <div key={r.id} style={{ padding: '10px 11px', borderRadius: 12, background: 'rgba(239,239,239,0.035)', border: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                    <div>
                      <div style={{ color: COLORS.text, fontSize: 12, fontWeight: 800 }}>{r.name}</div>
                      <div style={{ color: COLORS.textDim, fontSize: 10 }}>Dia {r.day} · {catById(r.category).name}</div>
                    </div>
                    <div style={{ color: r.type === 'income' ? COLORS.success : COLORS.alert, fontWeight: 800 }}>{r.type === 'income' ? '+' : '-'}{money(r.amount)}</div>
                  </div>
                  <div className="finance-recurring-actions" style={{ display: 'flex', gap: 7, marginTop: 9 }}>
                    <button className="finance-action-button" onClick={() => payRecurring(r)} style={{ flex: 1, border: 'none', borderRadius: 9, background: `${COLORS.primary}22`, color: COLORS.primary, padding: '7px 0', cursor: 'pointer', fontSize: 11, fontWeight: 800 }}>Marcar pagado</button>
                    <button className="finance-icon-button" onClick={() => removeRecurring(r.id)} style={{ border: 'none', borderRadius: 9, background: 'rgba(255,255,255,0.04)', color: COLORS.textDim, padding: '0 10px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="finance-compact-form" style={{ display: 'grid', gridTemplateColumns: '1fr 82px 58px', gap: 7, marginBottom: 7 }}>
              <input value={recurringForm.name} onChange={e => setRecurringForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre" style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }} />
              <input type="number" value={recurringForm.amount} onChange={e => setRecurringForm(f => ({ ...f, amount: e.target.value }))} placeholder={`Monto ${currency}`} style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }} />
              <input type="number" min="1" max="31" value={recurringForm.day} onChange={e => setRecurringForm(f => ({ ...f, day: e.target.value }))} style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }} />
            </div>
            <div className="finance-compact-form" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 7 }}>
              <select value={recurringForm.category} onChange={e => setRecurringForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }}>
                {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button className="finance-submit-button" onClick={addRecurring} style={{ border: 'none', borderRadius: 10, background: COLORS.primary, color: '#fff', padding: '0 12px', cursor: 'pointer', fontWeight: 800, whiteSpace: 'nowrap' }}><Plus size={15} /> Agregar pago</button>
            </div>
          </div>

          <div className="finance-card finance-saving-goals-card" style={{ ...cardStyle, display: section === 'goals' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Metas de ahorro</h3>
            <div style={{ display: 'grid', gap: 9, marginBottom: 12 }}>
              {goals.map(g => {
                const pct = g.target ? Math.min(100, Math.round((Number(g.saved || 0) / Number(g.target || 1)) * 100)) : 0;
                const completed = pct >= 100;
                return (
                  <div key={g.id} style={{ padding: '11px', borderRadius: 12, background: 'rgba(239,239,239,0.035)', border: `1px solid ${COLORS.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ color: COLORS.text, fontSize: 12, fontWeight: 800 }}>{g.name}</div>
                        <div style={{ color: COLORS.textDim, fontSize: 10 }}>{money(g.saved)} / {money(g.target)} {g.dueDate ? `· ${g.dueDate}` : ''}</div>
                      </div>
                      <button onClick={() => removeGoal(g.id)} style={{ border: 'none', background: 'transparent', color: COLORS.textDim, cursor: 'pointer' }}><X size={13} /></button>
                    </div>
                    <div style={{ height: 7, borderRadius: 99, background: COLORS.bg, overflow: 'hidden', marginBottom: 8 }}><div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS.success}, ${COLORS.primary})` }} /></div>
                    <div className="finance-inline-form" style={{ display: 'flex', gap: 7 }}>
                      {completed ? (
                        <div style={{ ...inputStyle, flex: 1, padding: '7px 8px', fontSize: 11, color: COLORS.success, fontWeight: 800 }}>Meta completada</div>
                      ) : (
                        <>
                          <input type="number" value={goalAdds[g.id] || ''} onChange={e => setGoalAdds(prev => ({ ...prev, [g.id]: e.target.value }))} placeholder="Aportar" style={{ ...inputStyle, flex: 1, padding: '7px 8px', fontSize: 11 }} />
                          <button onClick={() => contributeGoal(g.id)} style={{ border: 'none', borderRadius: 9, background: `${COLORS.success}18`, color: COLORS.success, padding: '0 10px', cursor: 'pointer', fontWeight: 800 }}>+</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="finance-goal-form" style={{ display: 'grid', gap: 7 }}>
              <input value={goalForm.name} onChange={e => setGoalForm(f => ({ ...f, name: e.target.value }))} placeholder="Meta: viaje, emergencia..." style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }} />
              <div className="finance-compact-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                <input type="number" value={goalForm.target} onChange={e => setGoalForm(f => ({ ...f, target: e.target.value }))} placeholder={`Objetivo ${currency}`} style={{ ...inputStyle, padding: '8px 9px', fontSize: 11 }} />
                <input type="date" value={goalForm.dueDate} onClick={e => openNativeDatePicker(e.currentTarget)} onFocus={e => openNativeDatePicker(e.currentTarget)} onChange={e => setGoalForm(f => ({ ...f, dueDate: e.target.value }))} style={{ ...inputStyle, padding: '8px 9px', fontSize: 11, cursor: 'pointer' }} />
              </div>
              <button onClick={addGoal} style={{ border: 'none', borderRadius: 10, background: COLORS.primary, color: '#fff', padding: '9px 0', cursor: 'pointer', fontWeight: 800 }}>Crear meta</button>
            </div>
          </div>

          <div className="finance-card finance-pie-card" style={{ ...cardStyle, display: section === 'overview' ? 'block' : 'none' }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Gastos por categoria</h3>
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>{byCategory.length ? <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={78}>{byCategory.map((c, i) => <Cell key={i} fill={c.color} />)}</Pie> : null}<Tooltip formatter={v => money(v)} contentStyle={tooltipStyle} labelStyle={{ color: COLORS.text }} /></PieChart>
            </ResponsiveContainer>
            <div style={{ color: COLORS.textDim, fontSize: 11, textAlign: 'center' }}>{savingsTarget > 0 ? `Pendiente en metas: ${money(savingsTarget)}` : 'Sin metas pendientes.'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReadingView = ({ data, onUpdateReading }) => {
  const reading = data.readingData || getReadingData();
  const books = reading.books || [];
  const activeBook = books.find(b => b.id === reading.activeBookId) || books[0] || null;
  const fileRef = useRef(null);
  const [bookmarkForm, setBookmarkForm] = useState({ page: '', label: '' });
  const [noteForm, setNoteForm] = useState({ page: '', text: '' });
  const s = { fontFamily: "'Inter', sans-serif" };
  const inputStyle = { padding: '11px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 12, color: COLORS.text, outline: 'none', boxSizing: 'border-box', ...s };
  const cardStyle = { background: COLORS.card, borderRadius: 22, border: `1px solid ${COLORS.border}`, padding: 20, boxShadow: '0 18px 50px rgba(0,0,0,0.18)' };

  const updateBook = (bookId, updater) => {
    onUpdateReading(prev => ({
      ...prev,
      books: (prev.books || []).map(book => book.id === bookId ? updater(book) : book),
      activeBookId: bookId
    }));
  };

  const handleUpload = (file) => {
    if (!file || (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name || ''))) return;
    const reader = new FileReader();
    reader.onload = () => {
      const book = {
        id: `book_${Date.now()}`,
        title: file.name.replace(/\.pdf$/i, ''),
        fileName: file.name,
        fileData: reader.result,
        currentPage: 1,
        totalPages: '',
        bookmarks: [],
        notes: [],
        createdAt: new Date().toISOString()
      };
      onUpdateReading(prev => ({ ...prev, books: [book, ...(prev.books || [])], activeBookId: book.id }));
    };
    reader.readAsDataURL(file);
  };

  const removeBook = (bookId) => {
    onUpdateReading(prev => {
      const nextBooks = (prev.books || []).filter(book => book.id !== bookId);
      return { ...prev, books: nextBooks, activeBookId: nextBooks[0]?.id || null };
    });
  };

  const addBookmark = () => {
    if (!activeBook) return;
    const page = Math.max(1, Number(bookmarkForm.page || activeBook.currentPage || 1));
    const label = bookmarkForm.label.trim() || `Página ${page}`;
    updateBook(activeBook.id, book => ({
      ...book,
      bookmarks: [{ id: `bm_${Date.now()}`, page, label, createdAt: new Date().toISOString() }, ...(book.bookmarks || [])]
    }));
    setBookmarkForm({ page: '', label: '' });
  };

  const addNote = () => {
    if (!activeBook || !noteForm.text.trim()) return;
    const page = Math.max(1, Number(noteForm.page || activeBook.currentPage || 1));
    updateBook(activeBook.id, book => ({
      ...book,
      notes: [{ id: `note_${Date.now()}`, page, text: noteForm.text.trim(), createdAt: new Date().toISOString() }, ...(book.notes || [])]
    }));
    setNoteForm({ page: '', text: '' });
  };

  const removeBookmark = (id) => activeBook && updateBook(activeBook.id, book => ({ ...book, bookmarks: (book.bookmarks || []).filter(b => b.id !== id) }));
  const removeNote = (id) => activeBook && updateBook(activeBook.id, book => ({ ...book, notes: (book.notes || []).filter(n => n.id !== id) }));
  const progress = activeBook?.totalPages ? Math.min(100, Math.round((Number(activeBook.currentPage || 1) / Number(activeBook.totalPages || 1)) * 100)) : 0;

  return (
    <div className="reading-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="lab-shell-card" style={{ borderRadius: 28, padding: 30, marginBottom: 20 }}>
        <div className="lab-pill" style={{ display: 'inline-flex', padding: '7px 11px', fontSize: 11, marginBottom: 12 }}><BookOpen size={14} /> Biblioteca personal</div>
        <h2 className="lab-hero-title" style={{ fontSize: 40, lineHeight: 1.05, marginBottom: 8 }}>Lectura con marcadores y notas.</h2>
        <div style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.7, maxWidth: 680 }}>Sube tus PDFs, guarda tu avance, marca páginas importantes y deja notas rápidas mientras estudias o lees.</div>
      </div>

      <div className="reading-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 0.38fr) minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <div style={cardStyle}>
            <input ref={fileRef} type="file" accept="application/pdf" onChange={e => handleUpload(e.target.files?.[0])} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} className="lab-cta" style={{ width: '100%', justifyContent: 'center', borderRadius: 14, padding: '13px 16px', cursor: 'pointer' }}>
              <Upload size={16} /> <span>Subir libro PDF</span>
            </button>
            <div style={{ color: COLORS.textDim, fontSize: 11, marginTop: 10, lineHeight: 1.5, ...s }}>Los PDFs quedan guardados en tu cuenta como parte de tus datos. Para libros muy pesados puede tardar un poco.</div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: COLORS.text, fontSize: 18, marginBottom: 14 }}>Mis libros</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {books.map(book => (
                <button key={book.id} onClick={() => onUpdateReading(prev => ({ ...prev, activeBookId: book.id }))} style={{
                  textAlign: 'left', border: `1px solid ${reading.activeBookId === book.id ? COLORS.primary : COLORS.border}`,
                  background: reading.activeBookId === book.id ? `${COLORS.primary}12` : COLORS.bg,
                  borderRadius: 14, padding: 12, cursor: 'pointer', color: COLORS.text
                }}>
                  <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{book.title}</div>
                  <div style={{ color: COLORS.textDim, fontSize: 11 }}>Pág. {book.currentPage || 1}{book.totalPages ? ` de ${book.totalPages}` : ''} · {(book.notes || []).length} notas</div>
                </button>
              ))}
              {!books.length && <div style={{ color: COLORS.textDim, fontSize: 13, textAlign: 'center', padding: 18 }}>Sube tu primer PDF para empezar.</div>}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {activeBook ? (
            <>
              <div style={cardStyle}>
                <div className="reading-toolbar" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ color: COLORS.text, fontSize: 22, margin: 0 }}>{activeBook.title}</h3>
                    <div style={{ color: COLORS.textDim, fontSize: 12, marginTop: 4 }}>{activeBook.fileName}</div>
                  </div>
                  <button onClick={() => removeBook(activeBook.id)} style={{ border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.alert, borderRadius: 12, padding: '9px 11px', cursor: 'pointer' }}><Trash2 size={15} /></button>
                </div>

                <div className="reading-progress-row" style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <div style={{ height: 8, background: COLORS.bg, borderRadius: 99, overflow: 'hidden' }}><div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})` }} /></div>
                    <div style={{ color: COLORS.textDim, fontSize: 11, marginTop: 6 }}>{progress ? `${progress}% leído` : 'Agrega total de páginas para ver progreso'}</div>
                  </div>
                  <input type="number" min="1" value={activeBook.currentPage || ''} onChange={e => updateBook(activeBook.id, book => ({ ...book, currentPage: Math.max(1, Number(e.target.value || 1)) }))} placeholder="Página actual" style={inputStyle} />
                  <input type="number" min="1" value={activeBook.totalPages || ''} onChange={e => updateBook(activeBook.id, book => ({ ...book, totalPages: e.target.value }))} placeholder="Total páginas" style={inputStyle} />
                </div>

                <iframe title={activeBook.title} src={activeBook.fileData} style={{ width: '100%', height: 'min(72vh, 760px)', border: `1px solid ${COLORS.border}`, borderRadius: 18, background: COLORS.bg }} />
              </div>

              <div className="reading-notes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div style={cardStyle}>
                  <h3 style={{ color: COLORS.text, fontSize: 17, marginBottom: 12 }}>Marcadores</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 8, marginBottom: 12 }}>
                    <input type="number" min="1" value={bookmarkForm.page} onChange={e => setBookmarkForm(f => ({ ...f, page: e.target.value }))} placeholder="Pág." style={inputStyle} />
                    <input value={bookmarkForm.label} onChange={e => setBookmarkForm(f => ({ ...f, label: e.target.value }))} placeholder="Nombre del marcador" style={inputStyle} />
                    <button onClick={addBookmark} style={{ border: 'none', background: COLORS.primary, color: '#fff', borderRadius: 12, padding: '0 13px', cursor: 'pointer' }}><Plus size={16} /></button>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {(activeBook.bookmarks || []).map(b => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: 10, borderRadius: 12, background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
                        <span style={{ color: COLORS.text, fontSize: 12 }}><strong style={{ color: COLORS.primary }}>Pág. {b.page}</strong> · {b.label}</span>
                        <button onClick={() => removeBookmark(b.id)} style={{ border: 'none', background: 'transparent', color: COLORS.textDim, cursor: 'pointer' }}><X size={13} /></button>
                      </div>
                    ))}
                    {!activeBook.bookmarks?.length && <div style={{ color: COLORS.textDim, fontSize: 12 }}>Aún no tienes marcadores.</div>}
                  </div>
                </div>

                <div style={cardStyle}>
                  <h3 style={{ color: COLORS.text, fontSize: 17, marginBottom: 12 }}>Notas</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 8, marginBottom: 12 }}>
                    <input type="number" min="1" value={noteForm.page} onChange={e => setNoteForm(f => ({ ...f, page: e.target.value }))} placeholder="Pág." style={inputStyle} />
                    <input value={noteForm.text} onChange={e => setNoteForm(f => ({ ...f, text: e.target.value }))} placeholder="Escribe una nota..." style={inputStyle} />
                    <button onClick={addNote} style={{ border: 'none', background: COLORS.primary, color: '#fff', borderRadius: 12, padding: '0 13px', cursor: 'pointer' }}><Plus size={16} /></button>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {(activeBook.notes || []).map(n => (
                      <div key={n.id} style={{ padding: 10, borderRadius: 12, background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                          <strong style={{ color: COLORS.primary, fontSize: 12 }}>Pág. {n.page}</strong>
                          <button onClick={() => removeNote(n.id)} style={{ border: 'none', background: 'transparent', color: COLORS.textDim, cursor: 'pointer' }}><X size={13} /></button>
                        </div>
                        <div style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.5 }}>{n.text}</div>
                      </div>
                    ))}
                    {!activeBook.notes?.length && <div style={{ color: COLORS.textDim, fontSize: 12 }}>Aún no tienes notas.</div>}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ ...cardStyle, textAlign: 'center', padding: 46 }}>
              <div className="fire-emoji" style={{ fontSize: 54, marginBottom: 12 }}>{'\u{1F4D6}'}</div>
              <h3 style={{ color: COLORS.text, fontSize: 22, marginBottom: 8 }}>Tu biblioteca está vacía</h3>
              <div style={{ color: COLORS.textDim, fontSize: 13 }}>Sube un PDF para leerlo, guardar progreso, marcadores y notas.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DreamGoalsView = ({ data, onUpdateDreamGoals }) => {
  const goals = data.dreamGoals || getDreamGoals();
  const s = { fontFamily: "'Inter', sans-serif" };
  const isPinkLight = (data?.user?.themeMode || '') === 'pinkLight';
  const dreamPanelBg = isPinkLight ? 'rgba(255,255,255,0.92)' : '#080808';
  const dreamInputBg = isPinkLight ? '#fffafd' : '#050505';
  const dreamProgressBg = isPinkLight ? 'rgba(190,18,60,0.12)' : '#151515';
  const dreamSoftShadow = isPinkLight ? '0 20px 58px rgba(190,18,60,0.12)' : '0 24px 80px rgba(0,0,0,0.34)';
  const [form, setForm] = useState({
    title: '',
    icon: '\u{1F3AF}',
    target: '',
    current: '',
    image: '',
    accent: '#e11d48'
  });
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [adds, setAdds] = useState({});
  const money = (n) => Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const inputStyle = { padding: '10px 12px', background: dreamInputBg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, outline: 'none', ...s };
  const fallbackImages = [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80'
  ];
  const dreamIcons = [
    '\u{1F3AF}', '\u{1F697}', '\u{1F3E0}', '\u{2708}\u{FE0F}', '\u{1F4B0}', '\u{1F4BC}',
    '\u{1F680}', '\u{1F3CB}\u{FE0F}', '\u{1F393}', '\u{1F4BB}', '\u{1F48E}', '\u{1F3D6}\u{FE0F}',
    '\u{1F3C6}', '\u{1F4C8}', '\u{1F6E5}\u{FE0F}', '\u{1F3A8}', '\u{1F3B5}', '\u{1F512}',
    '\u{1F525}', '\u{1F4A1}', '\u{1F4DA}', '\u{1F4DD}', '\u{1F4C5}', '\u{23F0}',
    '\u{1F451}', '\u{1F947}', '\u{1F396}\u{FE0F}', '\u{2B50}', '\u{1F31F}', '\u{26A1}',
    '\u{1F9E0}', '\u{1F9D8}', '\u{1F4AA}', '\u{1F3C3}', '\u{1F6B4}', '\u{1F3CA}',
    '\u{1F3D4}\u{FE0F}', '\u{1F30A}', '\u{1F334}', '\u{1F30D}', '\u{1F5FA}\u{FE0F}', '\u{1F9ED}',
    '\u{1F4F1}', '\u{1F4F7}', '\u{1F3A5}', '\u{1F3AE}', '\u{1F3A7}', '\u{1F399}\u{FE0F}',
    '\u{1F6CD}\u{FE0F}', '\u{1F381}', '\u{1F48D}', '\u{1F45F}', '\u{231A}', '\u{1F457}',
    '\u{1F37D}\u{FE0F}', '\u{2615}', '\u{1F349}', '\u{1F957}', '\u{1F9F3}', '\u{1F6CF}\u{FE0F}',
    '\u{1F3E6}', '\u{1F4B3}', '\u{1F4B5}', '\u{1F4B8}', '\u{1F4CA}', '\u{1F9FE}',
    '\u{1F3ED}', '\u{1F6A2}', '\u{1F682}', '\u{1F6F8}', '\u{1F9F1}', '\u{1F527}',
    '\u{2699}\u{FE0F}', '\u{1F52C}', '\u{1F9EC}', '\u{1F489}', '\u{1F48A}', '\u{1F9D1}\u{200D}\u{1F4BB}',
    '\u{1F468}\u{200D}\u{1F4BC}', '\u{1F469}\u{200D}\u{1F4BC}', '\u{1F468}\u{200D}\u{1F393}', '\u{1F469}\u{200D}\u{1F393}', '\u{1F46A}', '\u{2764}\u{FE0F}'
  ];

  const addGoal = () => {
    const title = form.title.trim();
    const target = Number(form.target);
    if (!title || !target) return;
    onUpdateDreamGoals(prev => [
      {
        ...form,
        id: `dream_${Date.now()}`,
        title,
        target,
        current: Number(form.current || 0),
        image: form.image.trim() || fallbackImages[(prev || []).length % fallbackImages.length]
      },
      ...(prev || [])
    ]);
    setForm({ title: '', icon: '\u{1F3AF}', target: '', current: '', image: '', accent: '#e11d48' });
  };

  const contributeGoal = (id) => {
    const amount = Number(adds[id] || 0);
    if (!amount) return;
    onUpdateDreamGoals(prev => (prev || []).map(goal => {
      const target = Number(goal.target || 0);
      const current = Number(goal.current || 0);
      if (goal.id !== id || (target && current >= target)) return goal;
      return { ...goal, current: Math.min(target, current + amount) };
    }));
    setAdds(prev => ({ ...prev, [id]: '' }));
  };

  const removeGoal = (id) => onUpdateDreamGoals(prev => (prev || []).filter(goal => goal.id !== id));

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out', maxWidth: 1160, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 54, paddingTop: 6 }}>
        <div className="lab-pill" style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '8px 14px', fontSize: 12, color: COLORS.text, borderColor: `${COLORS.primary}44`, background: `${COLORS.primary}10`, marginBottom: 22 }}>
          <Target size={13} /> Ecosistema de Metas
        </div>
        <h1 style={{ margin: 0, color: COLORS.text, fontSize: 'clamp(44px, 7vw, 74px)', lineHeight: 0.95, letterSpacing: '-0.07em', fontWeight: 500, ...s }}>
          Tus sueños, bajo<br />
          <span style={{ color: COLORS.primary, fontWeight: 900, textShadow: `0 0 28px ${COLORS.primary}22` }}>control matemático.</span>
        </h1>
        <p style={{ margin: '24px auto 0', maxWidth: 430, color: COLORS.textDim, fontSize: 14, lineHeight: 1.75, ...s }}>
          No solo sueñes. Visualiza el progreso exacto y cuánto te falta para conquistar tus próximos grandes pasos.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 360px))',
        gap: 24,
        marginBottom: 30,
        justifyContent: goals.length === 1 ? 'center' : 'start'
      }}>
        {goals.map((goal, index) => {
          const target = Number(goal.target || 0);
          const current = Number(goal.current || 0);
          const pct = target ? Math.min(100, Math.round((current / target) * 100)) : 0;
          const missing = Math.max(0, target - current);
          return (
            <div key={goal.id} style={{
              background: dreamPanelBg,
              borderRadius: 20,
              overflow: 'hidden',
              border: `1px solid ${COLORS.border}`,
              boxShadow: dreamSoftShadow,
              width: '100%',
              maxWidth: 360,
              animation: `fadeIn 0.35s ease ${index * 80}ms both`
            }}>
              <div style={{
                height: 220,
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.03), rgba(0,0,0,0.18)), url("${goal.image || fallbackImages[index % fallbackImages.length]}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                borderBottom: `1px solid ${COLORS.border}`
              }} />
              <div style={{ padding: '0 0 14px' }}>
                <div style={{ transform: 'translateY(-20px)', marginLeft: 18, width: 40, height: 40, borderRadius: 10, background: `${goal.accent || COLORS.primary}14`, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: -8 }}>{goal.icon || '\u{1F3AF}'}</div>
                <div style={{ padding: '0 20px' }}>
                  <div style={{ color: COLORS.text, fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 3, ...s }}>{goal.title}</div>
                  <div style={{ color: COLORS.textDim, fontSize: 12, marginBottom: 22, ...s }}>Objetivo: {money(target)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: COLORS.text, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 7, ...s }}>
                    <span>Progreso</span><span>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: dreamProgressBg, borderRadius: 99, overflow: 'hidden', marginBottom: 13 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: goal.accent || COLORS.primary, borderRadius: 99, boxShadow: `0 0 18px ${(goal.accent || COLORS.primary)}66` }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', borderRadius: 14, background: `${goal.accent || COLORS.primary}12`, border: `1px solid ${goal.accent || COLORS.primary}2f`, color: COLORS.text, fontSize: 12, ...s }}>
                    <span style={{ color: goal.accent || COLORS.primary, fontWeight: 900 }}>{missing === 0 ? '✓' : '$'}</span>
                    <span style={{ color: COLORS.textDim }}>Faltan</span>
                    <strong style={{ color: goal.accent || COLORS.primary }}>{money(missing)}</strong>
                    <span>{missing === 0 ? 'meta completada.' : 'para completar.'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: missing === 0 ? '1fr auto' : '1fr auto auto', gap: 8, marginTop: 12 }}>
                    {missing > 0 ? (
                      <>
                        <input type="number" value={adds[goal.id] || ''} onChange={e => setAdds(prev => ({ ...prev, [goal.id]: e.target.value }))} placeholder="Aportar" style={{ ...inputStyle, padding: '8px 10px', fontSize: 11 }} />
                        <button onClick={() => contributeGoal(goal.id)} style={{ border: 'none', borderRadius: 10, background: goal.accent || COLORS.primary, color: '#fff', padding: '0 14px', cursor: 'pointer', fontWeight: 800 }}>+ Aportar</button>
                      </>
                    ) : (
                      <div style={{ ...inputStyle, padding: '8px 10px', fontSize: 11, color: COLORS.success, fontWeight: 800 }}>Meta completada</div>
                    )}
                    <button onClick={() => removeGoal(goal.id)} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, background: 'transparent', color: COLORS.textDim, padding: '0 10px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: COLORS.card, borderRadius: 20, border: `1px solid ${COLORS.border}`, padding: 20, display: 'grid', gap: 12 }}>
        <div style={{ color: COLORS.text, fontSize: 17, fontWeight: 800, ...s }}>Crear nueva meta visual</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ej: Comprar casa, viaje, negocio..." style={inputStyle} />
          <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} placeholder="Objetivo" style={inputStyle} />
          <input type="number" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))} placeholder="Actual" style={inputStyle} />
          <input type="color" value={form.accent} onChange={e => setForm(f => ({ ...f, accent: e.target.value }))} style={{ ...inputStyle, padding: 6, height: 42 }} />
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ color: COLORS.textDim, fontSize: 11, marginBottom: 8, ...s }}>Icono</div>
          <button onClick={() => setShowIconPicker(value => !value)} style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 12,
            border: `1px solid ${showIconPicker ? form.accent : COLORS.border}`,
            background: dreamInputBg,
            color: COLORS.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...s
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: `${form.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{form.icon}</span>
              Elegir icono
            </span>
            <span style={{ color: COLORS.textDim, fontSize: 11 }}>{dreamIcons.length} disponibles</span>
          </button>
          {showIconPicker && (
            <div style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              background: dreamPanelBg,
              maxHeight: 250,
              overflowY: 'auto',
              boxShadow: isPinkLight ? '0 18px 46px rgba(190,18,60,0.12)' : '0 18px 48px rgba(0,0,0,0.35)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(38px, 1fr))', gap: 7 }}>
                {dreamIcons.map(icon => (
                  <button key={icon} onClick={() => { setForm(f => ({ ...f, icon })); setShowIconPicker(false); }} style={{
                    height: 38,
                    borderRadius: 10,
                    border: `1px solid ${form.icon === icon ? form.accent : COLORS.border}`,
                    background: form.icon === icon ? `${form.accent}22` : dreamInputBg,
                    color: COLORS.text,
                    cursor: 'pointer',
                    fontSize: 17,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>{icon}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(160px, 0.6fr)', gap: 10, alignItems: 'center' }}>
          <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="URL de imagen opcional (no se almacena la foto)" style={inputStyle} />
          <button className="lab-cta" onClick={addGoal} style={{ borderRadius: 999, padding: '10px 18px', cursor: 'pointer', fontWeight: 800 }}><span>Crear meta</span></button>
        </div>
        <div style={{ color: COLORS.textDim, fontSize: 11, ...s }}>HabitFlow solo guarda el enlace. La imagen queda alojada en donde pegues la URL.</div>
        {form.image && (
          <div style={{
            width: 'min(100%, 360px)',
            height: 220,
            borderRadius: 16,
            border: `1px solid ${COLORS.border}`,
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.04), rgba(0,0,0,0.22)), url("${form.image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            boxShadow: '0 18px 50px rgba(0,0,0,0.25)'
          }} />
        )}
      </div>
    </div>
  );
};

const StudyView = ({ data, onUpdateStudy }) => {
  const study = data.studyData || getStudyData();
  const subjects = study.subjects || [];
  const sessions = study.sessions || [];
  const [subjectForm, setSubjectForm] = useState({ name: '', goalHours: 8 });
  const [sessionForm, setSessionForm] = useState({ subjectId: subjects[0]?.id || '', minutes: 30, note: '', date: toYYYYMMDD(new Date()) });
  const [topicInputs, setTopicInputs] = useState({});
  const colors = ['#e11d48', '#efefef', '#7c85f5', '#10b981', '#f59e0b', '#06b6d4'];
  const totalMinutes = sessions.reduce((s, x) => s + Number(x.minutes || 0), 0);
  const completedTopics = subjects.flatMap(s => s.topics || []).filter(t => t.completed).length;
  const totalTopics = subjects.flatMap(s => s.topics || []).length;
  const fmtTime = (mins) => mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
  const subjectById = (id) => subjects.find(s => s.id === id) || subjects[0] || {};

  const addSubject = () => {
    const clean = subjectForm.name.trim();
    if (!clean) return;
    onUpdateStudy(prev => ({
      ...prev,
      subjects: [...(prev.subjects || []), { id: `sub_${Date.now()}`, name: clean, goalHours: Number(subjectForm.goalHours || 0), color: colors[(prev.subjects || []).length % colors.length], topics: [] }]
    }));
    setSubjectForm({ name: '', goalHours: 8 });
  };

  const addTopic = (subjectId) => {
    const clean = (topicInputs[subjectId] || '').trim();
    if (!clean) return;
    onUpdateStudy(prev => ({
      ...prev,
      subjects: (prev.subjects || []).map(s => s.id === subjectId ? { ...s, topics: [...(s.topics || []), { id: `top_${Date.now()}`, name: clean, completed: false }] } : s)
    }));
    setTopicInputs(prev => ({ ...prev, [subjectId]: '' }));
  };

  const toggleTopic = (subjectId, topicId) => {
    onUpdateStudy(prev => ({
      ...prev,
      subjects: (prev.subjects || []).map(s => s.id === subjectId ? { ...s, topics: (s.topics || []).map(t => t.id === topicId ? { ...t, completed: !t.completed } : t) } : s)
    }));
  };

  const addSession = () => {
    const subjectId = sessionForm.subjectId || subjects[0]?.id;
    if (!subjectId || !Number(sessionForm.minutes)) return;
    onUpdateStudy(prev => ({
      ...prev,
      sessions: [{ ...sessionForm, subjectId, id: `study_${Date.now()}`, minutes: Number(sessionForm.minutes) }, ...(prev.sessions || [])]
    }));
    setSessionForm(f => ({ ...f, minutes: 30, note: '', date: toYYYYMMDD(new Date()) }));
  };

  const removeSession = (id) => onUpdateStudy(prev => ({ ...prev, sessions: (prev.sessions || []).filter(s => s.id !== id) }));
  const removeSubject = (id) => onUpdateStudy(prev => ({ ...prev, subjects: (prev.subjects || []).filter(s => s.id !== id), sessions: (prev.sessions || []).filter(s => s.subjectId !== id) }));

  const chartData = subjects.map(s => ({
    name: s.name,
    horas: Math.round(sessions.filter(x => x.subjectId === s.id).reduce((sum, x) => sum + Number(x.minutes || 0), 0) / 60 * 10) / 10,
    color: s.color
  }));

  return (
    <div className="study-mobile-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="lab-shell-card" style={{ borderRadius: 26, padding: 28, marginBottom: 20 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="lab-pill" style={{ display: 'inline-flex', padding: '7px 11px', fontSize: 11, marginBottom: 12 }}>ESTUDIOS REALES</div>
          <h2 className="lab-hero-title" style={{ fontSize: 36, lineHeight: 1.05, marginBottom: 8 }}>Materias, temas y horas bajo control.</h2>
          <div style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.7, maxWidth: 620 }}>Crea materias, divide temas, marca avances y registra sesiones de estudio para ver tu progreso real.</div>
        </div>
      </div>

      <div className="study-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Materias', value: subjects.length, color: COLORS.text },
          { label: 'Tiempo total', value: fmtTime(totalMinutes), color: COLORS.primary },
          { label: 'Temas completados', value: `${completedTopics}/${totalTopics}`, color: COLORS.success },
          { label: 'Sesiones', value: sessions.length, color: '#7c85f5' }
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, color: k.color, fontWeight: 700 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="study-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h3 style={{ fontSize: 17, color: COLORS.text, marginBottom: 14 }}>Nueva materia</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px auto', gap: 10 }}>
              <input value={subjectForm.name} onChange={e => setSubjectForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Ingles, Trading, Calculo..." style={{ padding: '10px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text }} />
              <input type="number" value={subjectForm.goalHours} onChange={e => setSubjectForm(f => ({ ...f, goalHours: e.target.value }))} placeholder="Meta h" style={{ padding: '10px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text }} />
              <button className="lab-cta" onClick={addSubject} style={{ borderRadius: 999, padding: '10px 16px', cursor: 'pointer' }}><span>Crear</span></button>
            </div>
          </div>

          {subjects.map(subject => {
            const studied = sessions.filter(s => s.subjectId === subject.id).reduce((sum, s) => sum + Number(s.minutes || 0), 0);
            const goal = Number(subject.goalHours || 0) * 60;
            const pct = goal ? Math.min(100, Math.round((studied / goal) * 100)) : 0;
            return (
              <div key={subject.id} style={{ background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.border}`, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div><div style={{ color: COLORS.text, fontSize: 17, fontWeight: 800 }}><span style={{ color: subject.color }}>●</span> {subject.name}</div><div style={{ color: COLORS.textDim, fontSize: 11 }}>Meta: {subject.goalHours || 0}h  Estudiado: {fmtTime(studied)}</div></div>
                  <button onClick={() => removeSubject(subject.id)} style={{ border: 'none', background: 'transparent', color: COLORS.textDim, cursor: 'pointer' }}><Trash2 size={15} /></button>
                </div>
                <div style={{ height: 7, background: COLORS.bg, borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}><div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${subject.color}, ${COLORS.primary})`, borderRadius: 99 }} /></div>
                <div style={{ display: 'grid', gap: 7, marginBottom: 12 }}>
                  {(subject.topics || []).map(topic => (
                    <button key={topic.id} onClick={() => toggleTopic(subject.id, topic.id)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: topic.completed ? 'rgba(239,239,239,0.08)' : 'rgba(239,239,239,0.025)', color: COLORS.text, cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ width: 17, height: 17, borderRadius: 5, border: `1px solid ${topic.completed ? COLORS.success : COLORS.border}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{topic.completed ? '✓' : ''}</span>
                      <span style={{ textDecoration: topic.completed ? 'line-through' : 'none', opacity: topic.completed ? 0.55 : 1 }}>{topic.name}</span>
                    </button>
                  ))}
                </div>
                <div className="study-topic-add" style={{ display: 'flex', gap: 8 }}>
                  <input value={topicInputs[subject.id] || ''} onChange={e => setTopicInputs(prev => ({ ...prev, [subject.id]: e.target.value }))} placeholder="Agregar tema..." style={{ flex: 1, padding: '9px 11px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text }} />
                  <button onClick={() => addTopic(subject.id)} style={{ border: 'none', borderRadius: 10, background: COLORS.primary, color: '#fff', padding: '0 12px', cursor: 'pointer' }}><Plus size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Registrar sesion</h3>
            <div style={{ display: 'grid', gap: 9 }}>
              <select value={sessionForm.subjectId || subjects[0]?.id || ''} onChange={e => setSessionForm(f => ({ ...f, subjectId: e.target.value }))} style={{ padding: '10px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text }}>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="number" value={sessionForm.minutes} onChange={e => setSessionForm(f => ({ ...f, minutes: e.target.value }))} placeholder="Minutos" style={{ padding: '10px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text }} />
              <input type="date" value={sessionForm.date} onClick={e => openNativeDatePicker(e.currentTarget)} onFocus={e => openNativeDatePicker(e.currentTarget)} onChange={e => setSessionForm(f => ({ ...f, date: e.target.value }))} style={{ padding: '10px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, cursor: 'pointer' }} />
              <input value={sessionForm.note} onChange={e => setSessionForm(f => ({ ...f, note: e.target.value }))} placeholder="Nota de estudio" style={{ padding: '10px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text }} />
              <button className="lab-cta" onClick={addSession} disabled={!subjects.length} style={{ borderRadius: 999, padding: '10px 16px', cursor: subjects.length ? 'pointer' : 'not-allowed', opacity: subjects.length ? 1 : 0.5 }}><span>Guardar sesion</span></button>
            </div>
          </div>
          <div style={{ background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Horas por materia</h3>
            <ResponsiveContainer width="100%" height={210}><BarChart data={chartData}><XAxis dataKey="name" tick={{ fill: COLORS.textDim, fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: COLORS.textDim, fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="horas" radius={[6, 6, 0, 0]}>{chartData.map((c, i) => <Cell key={i} fill={c.color} />)}</Bar></BarChart></ResponsiveContainer>
          </div>
          <div style={{ background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}>Sesiones recientes</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {sessions.slice(0, 8).map(s => {
                const subject = subjectById(s.subjectId);
                return <div key={s.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10, borderRadius: 12, background: 'rgba(239,239,239,0.035)', border: `1px solid ${COLORS.border}` }}><span style={{ color: subject.color }}>●</span><div style={{ flex: 1 }}><div style={{ color: COLORS.text, fontSize: 12, fontWeight: 700 }}>{subject.name}  {fmtTime(Number(s.minutes || 0))}</div><div style={{ color: COLORS.textDim, fontSize: 10 }}>{s.date} {s.note ? ` ${s.note}` : ''}</div></div><button onClick={() => removeSession(s.id)} style={{ border: 'none', background: 'transparent', color: COLORS.textDim, cursor: 'pointer' }}><Trash2 size={13} /></button></div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatisticsView = ({ data }) => {
  const { habits, records } = data;
  const [period, setPeriod] = useState(30);
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const dailyData = useMemo(() => getDailyCompletionData(habits, records, period), [habits, records, period]);
  const catPerformance = useMemo(() => getCategoryPerformance(habits, records, period), [habits, records, period]);
  const catDistribution = useMemo(() => getCategoryDistribution(habits), [habits]);
  const weeklyStack = useMemo(() => getWeeklyStackData(habits, records), [habits, records]);
  const heatData = useMemo(() => getHeatMapData(habits, records, year, month), [habits, records, year, month]);
  const calendar = useMemo(() => getMonthCalendar(year, month, heatData), [year, month, heatData]);
  const dayLabels = getDayLabels();

  const streakTable = useMemo(() =>
    habits.filter(h => h.active)
      .map(h => ({ ...h, streak: getCurrentStreak(h.id, records), best: getBestStreak(h.id, records) }))
      .sort((a, b) => b.streak - a.streak),
    [habits, records]
  );

  const stackedHabits = habits.filter(h => h.active);

  return (
    <div className="stats-mobile-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="stats-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 24, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>
          <BarChart3 size={22} style={{ verticalAlign: 'middle', marginRight: 8, color: COLORS.primary }} />
          Estadísticas
        </h2>
        <div className="stats-period-row" style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Semana', value: 7 },
            { label: 'Mes', value: 30 },
            { label: '3 Meses', value: 90 }
          ].map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)} style={{
              padding: '6px 16px', borderRadius: 8, border: `1px solid ${period === p.value ? COLORS.primary : COLORS.border}`,
              background: period === p.value ? COLORS.primary : 'transparent',
              color: period === p.value ? '#fff' : COLORS.textDim, cursor: 'pointer',
              fontSize: 13, fontFamily: "'Inter', sans-serif", transition: 'all 0.2s'
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24 }}>
        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
            Progreso Diario
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData} margin={{ top: 8, right: 14, bottom: 4, left: -12 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={COLORS.primary} />
                    <stop offset="100%" stopColor={COLORS.secondary} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="label" stroke={COLORS.textDim} fontSize={11} tickMargin={8} />
                <YAxis stroke={COLORS.textDim} fontSize={11} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<StatsTooltip />} />
                <Line type="monotone" dataKey="pct" stroke="url(#lineGrad)" strokeWidth={2.5}
                  dot={{ fill: COLORS.primary, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: COLORS.secondary, strokeWidth: 2, stroke: COLORS.bg }} />
                <Area type="monotone" dataKey="pct" fill="url(#lineGrad)" fillOpacity={0.08} stroke="none" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Últimos 7 días
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyStack} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="date" stroke={COLORS.textDim} fontSize={11} />
                  <YAxis stroke={COLORS.textDim} fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: COLORS.textDim }} />
                  {stackedHabits.map((h, i) => (
                    <Bar key={h.id} dataKey={h.name} stackId="a" fill={h.color || CATEGORIES[i % CATEGORIES.length].color} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Rendimiento por Categoría
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={catPerformance} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <defs>
                    <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={COLORS.primary} />
                      <stop offset="100%" stopColor={COLORS.secondary} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke={COLORS.border} strokeOpacity={0.3} />
                  <PolarAngleAxis dataKey="category" stroke={COLORS.textDim} fontSize={10} />
                  <PolarRadiusAxis stroke={COLORS.textDim} fontSize={10} domain={[0, 100]} />
                  <Tooltip content={<StatsTooltip />} />
                  <Radar name="Rendimiento" dataKey="value" stroke="url(#radarGrad)" fill="url(#radarGrad)" fillOpacity={0.15} strokeWidth={2.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="stats-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              Distribución por Categoría
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={catDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {catDistribution.map((c, i) => (
                    <Cell key={i} fill={c.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, color: COLORS.textDim }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
            <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
              <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
              {now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/\b\w/g, c => c.toUpperCase())}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
              {dayLabels.map((d, i) => (
                <div key={i} style={{ fontSize: 10, color: COLORS.textDim, textAlign: 'center', padding: '4px 0' }}>{d}</div>
              ))}
            </div>
            {calendar.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
                {week.map((day, di) => {
                  if (!day) return <div key={di} />;
                  const hd = heatData.find(d => d.day === day);
                  return (
                    <div key={di} style={{
                      aspectRatio: '1', borderRadius: 4,
                      background: hd ? getHeatMapIntensity(hd.pct) : COLORS.card,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: hd && hd.pct > 0.5 ? '#000' : COLORS.textDim,
                      cursor: 'pointer', transition: 'all 0.2s',
                      position: 'relative'
                    }} title={hd ? `${hd.label}: ${hd.completed}/${hd.total}` : ''}>
                      {day}
                    </div>
                  );
                })}
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: COLORS.textDim }}>Menos</span>
              {[COLORS.card, '#006633', '#009955', '#9f1239', COLORS.success].map((c, i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c }} />
              ))}
              <span style={{ fontSize: 10, color: COLORS.textDim }}>Más</span>
            </div>
          </div>
        </div>

        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
            <Flame size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.alert }} />
            Tabla de Rachas
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: COLORS.textDim, letterSpacing: '0.05em' }}>HBITO</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: 11, color: COLORS.textDim, letterSpacing: '0.05em' }}>RACHA</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: 11, color: COLORS.textDim, letterSpacing: '0.05em' }}>MEJOR</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: 11, color: COLORS.textDim, letterSpacing: '0.05em' }}>META</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: 11, color: COLORS.textDim, letterSpacing: '0.05em' }}>PROGRESO</th>
                </tr>
              </thead>
              <tbody>
                {streakTable.map(h => (
                  <tr key={h.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="fire-emoji" style={{ fontSize: 16 }}>{h.icon}</span>
                      <span style={{ fontSize: 13, color: COLORS.text }}>{h.name}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px', fontSize: 16, color: COLORS.alert, fontFamily: "'Inter', sans-serif" }}>
                      {'\u{1F525}'} {h.streak}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: COLORS.primary, fontFamily: "'Inter', sans-serif" }}>
                      {'\u{1F3C6}'} {h.best}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px', fontSize: 14, color: COLORS.textDim, fontFamily: "'Inter', sans-serif" }}>
                      {'\u{1F3AF}'} {h.targetStreak}
                    </td>
                    <td style={{ padding: '12px', minWidth: 120 }}>
                      <div style={{ width: '100%', height: 6, background: COLORS.bg, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, (h.streak / h.targetStreak) * 100)}%`,
                          height: '100%', borderRadius: 3,
                          background: `linear-gradient(90deg, ${COLORS.alert}, ${COLORS.primary})`,
                          transition: 'width 0.8s ease-out'
                        }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ data, onUpdateUser, onResetData }) => {
  const { user, habits, records } = data;
  const s = { fontFamily: "'Inter', sans-serif" };
  const fileInputRef = useRef(null);
  const [editName, setEditName] = useState(user.name || '');
  const [editMotto, setEditMotto] = useState(user.motto || '');
  const [showReset, setShowReset] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiPwd, setApiPwd] = useState('');
  const [apiPwdError, setApiPwdError] = useState('');
  const [showSetPwd, setShowSetPwd] = useState(false);
  const [newApiPwd, setNewApiPwd] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clerkKey, setClerkKey] = useState(getStoredClerkKey());
  const [clerkMsg, setClerkMsg] = useState('');
  const [notificationPermission, setNotificationPermission] = useState(getNotificationPermissionState());
  const [notificationMsg, setNotificationMsg] = useState('');

  const totalCompletions = records.filter(r => r.completed).length;
  const daysRegistered = new Set(records.map(r => r.date)).size;
  const totalHabitsCreated = habits.length;
  const currentStreak = getGlobalCurrentStreak(habits, records);

  useEffect(() => {
    setEditName(user.name || '');
    setEditMotto(user.motto || '');
  }, [user.name, user.motto]);

  useEffect(() => {
    const refresh = () => setNotificationPermission(getNotificationPermissionState());
    refresh();
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const handleSaveProfile = () => {
    onUpdateUser({ name: editName, motto: editMotto });
  };

  const handleSaveClerkKey = () => {
    const clean = clerkKey.trim();
    if (!clean.startsWith('pk_')) {
      setClerkMsg('La llave debe empezar por pk_test_ o pk_live_.');
      return;
    }
    localStorage.setItem(CLERK_KEY_STORAGE, clean);
    setClerkMsg('Clerk guardado. Recargando login...');
    setTimeout(() => window.location.reload(), 700);
  };

  const handleRemoveClerkKey = () => {
    localStorage.removeItem(CLERK_KEY_STORAGE);
    setClerkMsg('Clerk desactivado. Recargando...');
    setTimeout(() => window.location.reload(), 700);
  };

  const handleEnableNotifications = async () => {
    setNotificationMsg('Preparando notificaciones...');
    const result = await requestHabitFlowNotifications();
    setNotificationPermission(result.permission);
    setNotificationMsg(result.reason);
    if (result.ok) {
      await showHabitFlowNotification('HabitFlow', {
        body: 'Las alertas de agenda ya pueden aparecer en este dispositivo.',
        tag: 'habitflow-notifications-enabled'
      });
    }
  };

  const handleTestNotification = async () => {
    if (getNotificationPermissionState() !== 'granted') {
      await handleEnableNotifications();
      return;
    }
    const ok = await showHabitFlowNotification('HabitFlow • Prueba', {
      body: 'Si ves esto, las notificaciones funcionan en este dispositivo.',
      tag: `habitflow-test-${Date.now()}`
    });
    setNotificationPermission(getNotificationPermissionState());
    setNotificationMsg(ok ? 'Notificación de prueba enviada.' : 'No se pudo enviar la prueba. Revisa permisos del navegador.');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'habit-tracker-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = normalizeLoadedData(JSON.parse(ev.target.result));
        if (parsed) {
          saveData(parsed);
          setImportMsg('\u{2705} Datos importados correctamente. Recarga la página.');
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setImportMsg('\u{26A0}\u{FE0F} Formato de archivo inválido');
        }
      } catch {
        setImportMsg('\u{26A0}\u{FE0F} Error al leer el archivo');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="settings-mobile-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <h2 style={{ fontSize: 24, color: COLORS.text, marginBottom: 24, fontFamily: "'DM Serif Display', serif" }}>
        <Settings size={22} style={{ verticalAlign: 'middle', marginRight: 8, color: COLORS.primary }} />
       Configuración
      </h2>

      <div className="settings-stack" style={{ display: 'grid', gap: 18, maxWidth: 760 }}>
        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
            <User size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
            Perfil
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: '#fff', fontFamily: "'DM Serif Display', serif"
            }}>
              {(editName || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>{editName || 'Usuario'}</div>
              <div style={{ fontSize: 12, color: COLORS.textDim }}>Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4, display: 'block' }}>NOMBRE</label>
              <input value={editName} onChange={e => setEditName(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                  borderRadius: 8, color: COLORS.text, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif"
                }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4, display: 'block' }}>FRASE DE MOTIVACIÓN</label>
              <input value={editMotto} onChange={e => setEditMotto(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                  borderRadius: 8, color: COLORS.text, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif"
                }} />
            </div>
            <button onClick={handleSaveProfile} style={{
              alignSelf: 'flex-start', padding: '8px 20px', borderRadius: 8, border: 'none',
              background: COLORS.primary, color: '#fff', cursor: 'pointer',
              fontSize: 13, fontFamily: "'Inter', sans-serif", marginTop: 4
            }}>Guardar Perfil</button>
          </div>
        </div>

        <div className="stats-chart-card" style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>
            <Clock size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
            Notificaciones
          </h3>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 14, lineHeight: 1.55 }}>
            Recibe alarmas de agenda, recordatorios de habitos pendientes y mensajes de disciplina en todos los dispositivos de tu cuenta.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 999,
              border: `1px solid ${notificationPermission === 'granted' ? COLORS.success : notificationPermission === 'denied' ? COLORS.alert : COLORS.border}`,
              background: notificationPermission === 'granted' ? `${COLORS.success}12` : notificationPermission === 'denied' ? `${COLORS.alert}10` : COLORS.bg,
              color: notificationPermission === 'granted' ? COLORS.success : notificationPermission === 'denied' ? COLORS.alert : COLORS.textDim,
              fontSize: 12, fontWeight: 800, ...s
            }}>
              🔔 {getNotificationStatusLabel(notificationPermission)}
            </span>
            <button onClick={handleEnableNotifications} style={{
              padding: '10px 14px', borderRadius: 10, border: 'none',
              background: notificationPermission === 'granted' ? COLORS.bg : COLORS.primary,
              color: notificationPermission === 'granted' ? COLORS.text : '#fff', cursor: 'pointer',
              fontSize: 12, fontWeight: 800, ...s
            }}>{notificationPermission === 'granted' ? 'Revisar permiso' : 'Activar notificaciones'}</button>
            <button onClick={handleTestNotification} style={{
              padding: '10px 14px', borderRadius: 10, border: `1px solid ${COLORS.border}`,
              background: COLORS.bg, color: COLORS.text, cursor: 'pointer',
              fontSize: 12, fontWeight: 800, ...s
            }}>Enviar prueba</button>
          </div>
          {notificationMsg && <div style={{ marginTop: 10, color: notificationPermission === 'denied' ? COLORS.alert : COLORS.textDim, fontSize: 11, lineHeight: 1.45 }}>{notificationMsg}</div>}
        </div>

        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 22 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 14, fontFamily: "'DM Serif Display', serif" }}>
            <Sparkles size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
            Modo visual
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {THEME_MODES.map(mode => {
              const selected = (user.themeMode || 'midnight') === mode.id;
              return (
                <button key={mode.id} onClick={() => onUpdateUser({
                  themeMode: mode.id,
                  ...(mode.defaultAccent ? { accentColor: mode.defaultAccent } : {}),
                  ...(mode.defaultIconColor ? { iconColor: mode.defaultIconColor } : {})
                })} style={{
                  padding: 14, borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                  border: `1px solid ${selected ? COLORS.primary + '88' : COLORS.border}`,
                  background: selected ? `${COLORS.primary}12` : mode.colors.card,
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 9 }}>
                    {[mode.colors.bg, mode.colors.surface, mode.colors.card].map((color, idx) => (
                      <span key={idx} style={{ width: 24, height: 16, borderRadius: 5, background: color, border: `1px solid ${COLORS.border}` }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 13, color: selected ? COLORS.text : mode.colors.text, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{mode.name}</div>
                  <div style={{ fontSize: 10, color: selected ? COLORS.textDim : mode.colors.textDim, marginTop: 4, lineHeight: 1.45 }}>{mode.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="stats-chart-card" style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>
            <User size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
            Login con Clerk
          </h3>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 12, lineHeight: 1.45 }}>
            Actualiza la Publishable Key si cambias de proyecto en Clerk.
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={clerkKey} onChange={e => setClerkKey(e.target.value)} placeholder="pk_test_..." style={{
              flex: 1, minWidth: 0, padding: '10px 12px', background: COLORS.bg,
              border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text,
              fontSize: 12, outline: 'none', fontFamily: "'Inter', sans-serif"
            }} />
            <button onClick={handleSaveClerkKey} style={{
              padding: '10px 14px', borderRadius: 8, border: 'none',
              background: COLORS.primary, color: '#fff', cursor: 'pointer',
              fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 700
            }}>Guardar</button>
            <button onClick={handleRemoveClerkKey} style={{
              padding: '10px 12px', borderRadius: 8, border: `1px solid ${COLORS.alert}55`,
              background: `${COLORS.alert}10`, color: COLORS.alert, cursor: 'pointer',
              fontSize: 12, fontFamily: "'Inter', sans-serif"
            }}>Quitar</button>
          </div>
          {clerkMsg && <div style={{ marginTop: 8, fontSize: 11, color: clerkMsg.includes('debe') ? COLORS.alert : COLORS.success }}>{clerkMsg}</div>}
        </div>

          <div className="stats-chart-card" style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
            <Target size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
            Tema de Color
          </h3>
          <div style={{ display: 'flex', gap: 12 }}>
            {THEME_VARIANTS.map(t => (
              <button key={t.id} onClick={() => onUpdateUser({ accentColor: t.id })} style={{
                flex: 1, padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                border: `2px solid ${user.accentColor === t.id ? t.primary : COLORS.border}`,
                background: user.accentColor === t.id ? `${t.primary}15` : COLORS.bg,
                transition: 'all 0.2s', textAlign: 'center'
              }}>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.primary }} />
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.secondary }} />
                </div>
                <div style={{ fontSize: 13, color: COLORS.text }}>{t.name}</div>
              </button>
            ))}
          </div>
        </div>

          <div className="stats-chart-card" style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>
            <Flame size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.alert }} />
            Color de iconos
          </h3>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 14, lineHeight: 1.45 }}>
            Cambia el color global de iconos, emojis de hábitos y logo.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))', gap: 10 }}>
            {ICON_COLOR_PALETTE.map(p => {
              const selected = (user.iconColor || 'fire') === p.id;
              return (
                <button key={p.id} onClick={() => onUpdateUser({ iconColor: p.id })} style={{
                  padding: '11px 12px', borderRadius: 12, cursor: 'pointer',
                  border: `1px solid ${selected ? p.primary : COLORS.border}`,
                  background: selected ? `${p.primary}18` : COLORS.bg,
                  display: 'flex', alignItems: 'center', gap: 10,
                  textAlign: 'left', transition: 'all 0.2s'
                }}>
                  <span style={{
                    width: 30, height: 30, borderRadius: 10,
                    background: `linear-gradient(135deg, ${p.hover}, ${p.primary}, ${p.deep})`,
                    boxShadow: `0 0 16px rgba(${p.rgb},0.32)`,
                    flexShrink: 0
                  }} />
                  <span>
                    <span style={{ display: 'block', color: COLORS.text, fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{p.name}</span>
                    <span style={{ display: 'block', color: selected ? p.primary : COLORS.textDim, fontSize: 10, marginTop: 2 }}>{selected ? 'Activo' : 'Elegir'}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

          <div className="stats-chart-card" style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
            <TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
           Estadísticas de Uso
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ background: COLORS.bg, borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: COLORS.secondary, fontFamily: "'Inter', sans-serif" }}>{daysRegistered}</div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>días Registrando</div>
            </div>
            <div style={{ background: COLORS.bg, borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: COLORS.primary, fontFamily: "'Inter', sans-serif" }}>{totalHabitsCreated}</div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>Hábitos Creados</div>
            </div>
            <div style={{ background: COLORS.bg, borderRadius: 8, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, color: COLORS.success, fontFamily: "'Inter', sans-serif" }}>{totalCompletions}</div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>Completados</div>
            </div>
          </div>
        </div>

          <div className="stats-chart-card" style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
            <Award size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
            Progreso de Nivel
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 20, fontFamily: "'Inter', sans-serif", fontWeight: 600
            }}>{user.level || 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: COLORS.text }}>Nivel {user.level || 1}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLORS.textDim, marginBottom: 4, marginTop: 4 }}>
                <span>{user.xp || 0} XP</span>
                <span>{getXpForLevel((user.level || 1) + 1)} XP</span>
              </div>
              <div style={{ width: '100%', height: 8, background: COLORS.bg, borderRadius: 4, overflow: 'hidden' }}>
                {(() => { const p = getXpProgress(user.xp || 0); const pct = p.needed > 0 ? (p.xp / p.needed) * 100 : 0; return <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS.primary}, #7f1028, ${COLORS.secondary})`, borderRadius: 4, transition: 'width 0.5s ease', backgroundSize: '200% 100%', animation: 'shimmer 2s ease-in-out infinite' }} />; })()}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: COLORS.bg, borderRadius: 8, padding: '8px 12px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 18, color: COLORS.secondary, fontFamily: "'Inter', sans-serif" }}>{getLevel(user.xp || 0)}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim }}>Nivel Actual</div>
            </div>
            <div style={{ background: COLORS.bg, borderRadius: 8, padding: '8px 12px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 18, color: COLORS.primary, fontFamily: "'Inter', sans-serif" }}>{getXpForLevel(getLevel(user.xp || 0) + 1)}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim }}>XP para Nv.{getLevel(user.xp || 0) + 1}</div>
            </div>
            <div style={{ background: COLORS.bg, borderRadius: 8, padding: '8px 12px', textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 18, color: COLORS.success, fontFamily: "'Inter', sans-serif" }}>{getAvgHabitStrength(habits, records)}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim }}>Fuerza</div>
            </div>
          </div>
        </div>

        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
            <Download size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
            Exportar / Importar Datos
          </h3>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button onClick={handleExport} style={{
              flex: 1, padding: '10px 16px', borderRadius: 8, border: `1px solid ${COLORS.border}`,
              background: 'transparent', color: COLORS.text, cursor: 'pointer',
              fontSize: 13, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}><Download size={14} /> Exportar JSON</button>
            <button onClick={() => fileInputRef.current?.click()} style={{
              flex: 1, padding: '10px 16px', borderRadius: 8, border: `1px solid ${COLORS.border}`,
              background: 'transparent', color: COLORS.text, cursor: 'pointer',
              fontSize: 13, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}><Upload size={14} /> Importar JSON</button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </div>
          {importMsg && <div style={{ fontSize: 13, color: COLORS.success }}>{importMsg}</div>}
        </div>

        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: COLORS.text, marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
            <Search size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: COLORS.primary }} />
            YouTube API Key
          </h3>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 12, lineHeight: 1.5 }}>
            Necesits una API Key de YouTube Data API v3 para buscar videos. Es gratis y sin tarjeta de crédito.
            Obtenela en <span style={{ color: COLORS.primary, cursor: 'pointer' }} onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}>console.cloud.google.com</span>.
          </div>

          {!user.youtubeApiKey ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="text" value={newApiPwd} onChange={e => setNewApiPwd(e.target.value)}
                placeholder="AIzaSy..."
                style={{ flex: 1, padding: '10px 14px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                  borderRadius: 8, color: COLORS.text, fontSize: 13, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
              <button onClick={() => {
                const clean = newApiPwd.trim();
                if (!clean) return;
                onUpdateUser({ youtubeApiKey: clean });
                setNewApiPwd('');
              }} style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: COLORS.primary,
                color: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                whiteSpace: 'nowrap'
              }}>Guardar</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: COLORS.bg, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 13, color: COLORS.textDim, flexShrink: 0 }}>{'\u{1F511}'}</span>
                <span style={{ flex: 1, fontSize: 13, color: COLORS.textDim, fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em' }}>
                  {showApiKey ? user.youtubeApiKey : '****************'}
                </span>
                <button onClick={() => {
                  if (showApiKey) { setShowApiKey(false); setApiPwd(''); setApiPwdError(''); }
                  else if (!user.youtubeKeyPassword) { setShowApiKey(true); }
                  else { setShowApiKey(true); }
                }} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', fontSize: 12, padding: 2 }}>
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {showApiKey && user.youtubeKeyPassword && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="password" value={apiPwd} onChange={e => { setApiPwd(e.target.value); setApiPwdError(''); }}
                    placeholder="Contraseña para ver la key"
                    style={{ flex: 1, padding: '8px 12px', background: COLORS.bg, border: `1px solid ${apiPwdError ? COLORS.alert : COLORS.border}`,
                      borderRadius: 6, color: COLORS.text, fontSize: 12, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
                  <button onClick={() => {
                    if (apiPwd === user.youtubeKeyPassword) { setShowApiKey(true); setApiPwdError(''); }
                    else { setApiPwdError('Contraseña incorrecta'); }
                  }} style={{ padding: '8px 14px', borderRadius: 6, border: 'none', background: COLORS.primary, color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Ver</button>
                </div>
              )}
              {apiPwdError && <div style={{ fontSize: 11, color: COLORS.alert }}>{apiPwdError}</div>}

              {showApiKey && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value={user.youtubeApiKey} onChange={e => onUpdateUser({ youtubeApiKey: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                      borderRadius: 6, color: COLORS.text, fontSize: 12, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
                  {!user.youtubeKeyPassword && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="password" value={newApiPwd} onChange={e => setNewApiPwd(e.target.value)}
                        placeholder="Crear contraseña" style={{ width: 120, padding: '8px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                          borderRadius: 6, color: COLORS.text, fontSize: 12, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
                      <button onClick={() => { if (newApiPwd) { onUpdateUser({ youtubeKeyPassword: newApiPwd }); setNewApiPwd(''); } }}
                        style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: COLORS.success, color: '#000', cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>{'\u{1F512}'} Fijar</button>
                    </div>
                  )}
                  {showDeleteConfirm ? (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => { onUpdateUser({ youtubeApiKey: '', youtubeKeyPassword: '' }); setShowApiKey(false); setShowDeleteConfirm(false); }}
                        style={{ padding: '8px 10px', borderRadius: 6, border: 'none', background: COLORS.alert, color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>Confirmar</button>
                      <button onClick={() => setShowDeleteConfirm(false)}
                        style={{ padding: '8px 10px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.textDim, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>Cancelar</button>
                    </div>
                  ) : (
                    <button onClick={() => setShowDeleteConfirm(true)} style={{
                      padding: '8px 12px', borderRadius: 6, border: `1px solid ${COLORS.alert}`,
                      background: 'transparent', color: COLORS.alert, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif"
                    }}><Trash2 size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Eliminar</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.alert}30`, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={18} color={COLORS.alert} />
            <h3 style={{ fontSize: 16, color: COLORS.alert, fontFamily: "'DM Serif Display', serif" }}>Zona de Peligro</h3>
          </div>
          <p style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 16, lineHeight: 1.5 }}>
           Esto eliminar TODOS tus datos incluyendo hábitos y registros. Esta acción no se puede deshacer.
          </p>
          <RippleButton onClick={() => setShowReset(true)} style={{
            padding: '10px 24px', borderRadius: 8, border: `1px solid ${COLORS.alert}`,
            background: 'transparent', color: COLORS.alert, cursor: 'pointer',
            fontSize: 13, fontFamily: "'Inter', sans-serif"
          }}>Resetear Todos los Datos</RippleButton>
        </div>
      </div>

      <ConfirmModal isOpen={showReset} title="Resetear Datos"
        message="¿estás completamente seguro? Se eliminarn todos tus hábitos, registros y configuración. Esta acción es irreversible."
        danger onConfirm={() => { onResetData(); setShowReset(false); }}
        onCancel={() => setShowReset(false)} />
    </div>
  );
};

const LevelUpModal = ({ open, level, onClose }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
      animation: 'fadeIn 0.3s ease-out'
    }} onClick={onClose}>
      <div style={{
        textAlign: 'center', padding: 48, animation: 'slideIn 0.5s ease-out',
        background: `linear-gradient(135deg, ${COLORS.card}, #1a1a3a)`,
        borderRadius: 24, border: `1px solid ${COLORS.primary}40`, maxWidth: 420
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 72, marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>{'\u{1F389}'}</div>
        <div style={{ fontSize: 14, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
          ¡Felicidades!
        </div>
        <div style={{ fontSize: 48, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 8 }}>
          SUBISTE AL
        </div>
        <div style={{ fontSize: 80, fontFamily: "'DM Serif Display', serif", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
          NIVEL {level}
        </div>
        <div style={{ fontSize: 14, color: COLORS.textDim, margin: '16px 0 24px' }}>
          Sigue así, cada día cuenta en tu camino
        </div>
        <button onClick={onClose} style={{
          padding: '12px 32px', borderRadius: 12, border: 'none',
          background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff',
          fontSize: 16, cursor: 'pointer', fontFamily: "'Inter', sans-serif"
        }}>A seguir!</button>
      </div>
    </div>
  );
};

const FocusMode = ({ habits, records, onCompleteHabit, onClose }) => {
  const [step, setStep] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const pendingToday = useMemo(() => {
    const today = toYYYYMMDD(new Date());
    return habits.filter(h => h.active && !records.find(r => r.habitId === h.id && r.date === today)?.completed);
  }, [habits, records]);

  const current = pendingToday[step];

  useEffect(() => {
    setTimeLeft(null); setRunning(false); setPaused(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, [step]);

  useEffect(() => {
    if (running && !paused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); setRunning(false); return 0; } return t - 1; });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, paused]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const progress = timerMinutes > 0 ? 1 - (timeLeft ?? (timerMinutes * 60)) / (timerMinutes * 60) : 0;

  const handleComplete = () => {
    if (current) onCompleteHabit(current.id);
    if (step < pendingToday.length - 1) setStep(s => s + 1);
    else onClose();
  };

  if (!pendingToday.length) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: COLORS.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ fontSize: 80 }}>{'\u{1F389}'}</div>
        <div style={{ fontSize: 28, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>Todos completados hoy!</div>
        <button onClick={onClose} style={{ padding: '12px 32px', borderRadius: 12, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.text, cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Cerrar</button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000, background: COLORS.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 40, animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: COLORS.textDim }}>Hábito {step + 1} de {pendingToday.length} pendientes</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', padding: 8 }}><X size={20} /></button>
      </div>

      {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', padding: 12 }}><ChevronLeft size={32} /></button>}
      {step < pendingToday.length - 1 && <button onClick={() => setStep(s => s + 1)} style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', padding: 12 }}><ChevronRight size={32} /></button>}

      <div className="fire-emoji" style={{ fontSize: 80, marginBottom: 16 }}>{current?.icon}</div>
      <div style={{ fontSize: 36, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 32, textAlign: 'center' }}>{current?.name}</div>

      {timeLeft === null && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          {[5, 10, 15, 25, 30].map(m => (
            <button key={m} onClick={() => setTimerMinutes(m)} style={{
              width: 56, height: 56, borderRadius: '50%', border: `2px solid ${timerMinutes === m ? COLORS.primary : COLORS.border}`,
              background: timerMinutes === m ? `${COLORS.primary}20` : 'transparent', color: timerMinutes === m ? COLORS.primary : COLORS.textDim,
              cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif", transition: 'all 0.2s'
            }}>{m}</button>
          ))}
        </div>
      )}

      <div style={{ position: 'relative', width: 240, height: 240, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'absolute' }}>
          <circle cx="120" cy="120" r="110" fill="none" stroke={COLORS.border} strokeWidth="6" />
          {timeLeft !== null && (
            <circle cx="120" cy="120" r="110" fill="none" stroke={`url(#focusGrad-${step})`} strokeWidth="6"
              strokeLinecap="round" transform="rotate(-90 120 120)"
              strokeDasharray={`${2 * Math.PI * 110}`}
              strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
          )}
          <defs>
            <linearGradient id={`focusGrad-${step}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.primary} />
              <stop offset="100%" stopColor={COLORS.secondary} />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, fontFamily: "'Inter', sans-serif", color: COLORS.text, fontWeight: 500 }}>
            {timeLeft !== null ? formatTime(timeLeft) : `${timerMinutes}:00`}
          </div>
          {timeLeft !== null && timeLeft === 0 && <div style={{ fontSize: 14, color: COLORS.success, marginTop: 4 }}>¡Tiempo!</div>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {timeLeft === null ? (
          <button onClick={() => { setTimeLeft(timerMinutes * 60); setRunning(true); }} style={{
            padding: '12px 32px', borderRadius: 12, border: 'none',
            background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff',
            cursor: 'pointer', fontSize: 16, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: 8
          }}><Play size={18} /> Iniciar</button>
        ) : (
          <>
            {timeLeft > 0 && (
              <button onClick={() => setPaused(p => !p)} style={{
                padding: '12px 24px', borderRadius: 12, border: `1px solid ${COLORS.border}`,
                background: COLORS.card, color: COLORS.text, cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif"
              }}>{paused ? <Play size={16} /> : <Pause size={16} />} {paused ? 'Reanudar' : 'Pausar'}</button>
            )}
            <button onClick={() => { setTimeLeft(null); setRunning(false); setPaused(false); }} style={{
              padding: '12px 24px', borderRadius: 12, border: `1px solid ${COLORS.alert}`,
              background: 'transparent', color: COLORS.alert, cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif"
            }}><StopCircle size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Detener</button>
            {timeLeft === 0 && (
              <button onClick={handleComplete} style={{
                padding: '12px 32px', borderRadius: 12, border: 'none',
                background: `linear-gradient(135deg, ${COLORS.success}, #9f1239)`, color: '#000',
                cursor: 'pointer', fontSize: 16, fontFamily: "'Inter', sans-serif"
              }}><Check size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Marcar Completado</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('ErrorBoundary caught:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: '#ff6b6b', fontFamily: "'Inter', sans-serif", background: '#0a0a0f', minHeight: '100vh' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", marginBottom: 16, color: '#ff6b6b' }}>
            Error en la visualizaci\u00f3n
          </h2>
          <p style={{ color: '#e8e8f0', marginBottom: 12 }}>{this.state.error.message}</p>
          <pre style={{ background: '#1a1a26', padding: 16, borderRadius: 8, fontSize: 12, color: '#8888a0', overflowX: 'auto' }}>
            {this.state.error.stack}
          </pre>
          <button onClick={() => this.setState({ error: null })}
            style={{ marginTop: 16, padding: '10px 20px', border: 'none', borderRadius: 8, background: '#e11d48', color: '#fff', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PomodoroView = ({ data, onUpdateUser, onUpdatePomodoro }) => {
  const today = toYYYYMMDD(new Date());
  const settings = data.user?.pomodoro || { focus: 25, shortBreak: 5, longBreak: 15, ambientSound: 'none', ambientVolume: 0.3 };
  const records = data.pomodoroRecords || [];
  const todaySessions = records.filter(r => r.date === today);

  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const intervalRef = useRef(null);
  const ambientCtxRef = useRef(null);
  const ambientNodesRef = useRef(null);

  const ambientTypes = [
    { id: 'none', label: 'Silencio', icon: '\u{1F507}' },
    { id: 'whitenoise', label: 'Ruido Blanco', icon: '\u{1F4FB}' },
    { id: 'brown', label: 'Ruido Marrón', icon: '\u{1F3A7}' },
    { id: 'rain', label: 'Lluvia', icon: '\u{1F327}\u{FE0F}' },
    { id: 'ocean', label: 'Olas', icon: '\u{1F30A}' },
    { id: 'fire', label: 'Fogata', icon: '\u{1F525}' },
  ];
  const defaultFavorites = [
    { id: 'fav1', label: 'Top G Songs', videoId: 'aG4kHBL5WlQ', playlist: 'RDaG4kHBL5WlQ' },
    { id: 'fav2', label: 'Música Clásica Radio', videoId: 'hydk9hHO1Ko', playlist: 'RDhydk9hHO1Ko' },
    { id: 'fav3', label: 'Lofi 1 AM Study', videoId: 'lTRiuFIWV54', playlist: '' },
  ];
  const [searchInput, setSearchInput] = useState('');
  const [youtubePlay, setYoutubePlay] = useState(false);
  const [youtubeUnmuted, setYoutubeUnmuted] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [favorites, setFavorites] = useState(() => data.user?.youtubeFavorites?.length ? data.user.youtubeFavorites : defaultFavorites);
  const [volume, setVolume] = useState(100);
  const [showVideo, setShowVideo] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const seekIntervalRef = useRef(null);
  const durations = { focus: settings.focus * 60, shortBreak: settings.shortBreak * 60, longBreak: settings.longBreak * 60 };
  const youtubeContainerRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const youtubeApiLoadedRef = useRef(false);

  const parseYoutubeInput = (text) => {
    const t = text.trim();
    if (!t) return null;
    let m = t.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (m) {
      const videoId = m[1];
      const listMatch = t.match(/[?&]list=([a-zA-Z0-9_-]+)/);
      return { type: 'url', videoId, playlist: listMatch ? listMatch[1] : '', label: t.substring(0, 60) };
    }
    return { type: 'search', query: t, label: t.substring(0, 60) };
  };

  const ensureApi = (callback) => {
    if (typeof YT !== 'undefined' && YT.Player) { callback(); return; }
    if (youtubeApiLoadedRef.current) { const chk = setInterval(() => { if (typeof YT !== 'undefined' && YT.Player) { clearInterval(chk); callback(); } }, 200); return; }
    youtubeApiLoadedRef.current = true;
    window.onYouTubeIframeAPIReady = callback;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(tag);
  };

  const playYoutube = (videoId, playlist, label) => {
    closeSearch();
    if (seekIntervalRef.current) { clearInterval(seekIntervalRef.current); seekIntervalRef.current = null; }
    setCurrentVideo({ videoId, playlist: playlist || '', label: label || '' });
    setYoutubePlay(true);
    setYoutubeUnmuted(false);
    setCurrentTime(0);
    setDuration(0);
    // Wait for React to render the container, then init player
    setTimeout(() => {
      if (youtubeContainerRef.current) {
        youtubeContainerRef.current.innerHTML = '';
        const containerDiv = document.createElement('div');
        containerDiv.id = 'yt-player-' + Date.now();
        youtubeContainerRef.current.appendChild(containerDiv);
        ensureApi(() => {
          const opts = {
            height: 360, width: 640,
            videoId,
            playerVars: { autoplay: 0, mute: 1, controls: 1, modestbranding: 1, rel: 0, iv_load_policy: 3, fs: 0, playsinline: 1, enablejsapi: 1 },
            events: {
              onReady: (e) => {
                e.target.setVolume(volume);
                e.target.playVideo();
                setDuration(e.target.getDuration() || 0);
                if (!seekIntervalRef.current) {
                  seekIntervalRef.current = setInterval(() => { try { const t = e.target.getCurrentTime(); if (typeof t === 'number') setCurrentTime(t); } catch(ex) {} }, 500);
                }
              },
              onStateChange: (e) => {
                if (e.data === 0) { setCurrentTime(0); if (seekIntervalRef.current) { clearInterval(seekIntervalRef.current); seekIntervalRef.current = null; } }
              },
              onError: (e) => {}
            }
          };
          if (playlist) { opts.playerVars.list = playlist; delete opts.videoId; }
          try {
            if (youtubePlayerRef.current) { try { youtubePlayerRef.current.destroy(); } catch(ex) {} youtubePlayerRef.current = null; }
            youtubePlayerRef.current = new YT.Player(containerDiv, opts);
          } catch(e) { /* */ }
        });
      }
    }, 50);
  };

  const getThumbnail = (videoId) => `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

  const formatDuration = (s) => { if (!s) return ''; const m = Math.floor(s / 60); return `${m}:${(s % 60).toString().padStart(2, '0')}`; };

  const doSearch = async (query) => {
    setSearchLoading(true);
    setSearchError('');
    setSearchResults([]);
    setCurrentVideo(null);
    setYoutubePlay(false);
    if (youtubePlayerRef.current) { try { youtubePlayerRef.current.destroy(); } catch(e) { /* */ } youtubePlayerRef.current = null; }
    if (youtubeContainerRef.current) youtubeContainerRef.current.innerHTML = '';
    const apiKey = data.user?.youtubeApiKey;
    if (apiKey) {
      try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=20&type=video`);
        if (!res.ok) { setSearchError('Error de API: ' + (await res.text()).substring(0, 100)); setSearchLoading(false); return; }
        const data = await res.json();
        const videos = (data.items || []).map(i => ({
          videoId: i.id.videoId,
          title: i.snippet.title,
          author: i.snippet.channelTitle,
          lengthSeconds: 0,
          viewCount: 0,
          publishedText: i.snippet.publishedAt ? new Date(i.snippet.publishedAt).toLocaleDateString() : ''
        }));
        setSearchResults(videos); setSearchLoading(false); return;
      } catch(e) { setSearchError('Error de conexión: ' + e.message); setSearchLoading(false); return; }
    }
    // Fallback: 'YouTube embed with search results
    setSearchError('Configura una API Key de YouTube en Settings para buscar. Sin key, usó URLs directas.');
    setSearchLoading(false);
  };

  const closeSearch = () => { setSearchResults([]); setSearchError(''); setSearchLoading(false); };

  const showSearchResults = (query) => { doSearch(query); };

  const handleSearchSubmit = () => {
    const parsed = parseYoutubeInput(searchInput);
    if (!parsed) return;
    if (parsed.type === 'url') {
      playYoutube(parsed.videoId, parsed.playlist || '', parsed.label);
    } else if (parsed.type === 'search') {
      doSearch(parsed.query);
    }
  };

  const addFavorite = (videoId, playlist, label) => {
    const id = 'fav_' + Date.now();
    const updated = [...favorites, { id, label: label || 'Sin título', videoId, playlist: playlist || '' }];
    setFavorites(updated);
    onUpdateUser({ youtubeFavorites: updated });
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    onUpdateUser({ youtubeFavorites: updated });
  };

  const stopYoutube = () => {
    setYoutubePlay(false);
    setCurrentVideo(null);
    setCurrentTime(0);
    setDuration(0);
    if (seekIntervalRef.current) { clearInterval(seekIntervalRef.current); seekIntervalRef.current = null; }
    if (youtubePlayerRef.current) { try { youtubePlayerRef.current.stopVideo(); youtubePlayerRef.current.destroy(); } catch(e) { /* */ } youtubePlayerRef.current = null; }
    if (youtubeContainerRef.current) youtubeContainerRef.current.innerHTML = '';
  };

  const unMuteYoutube = () => {
    setYoutubeUnmuted(true);
    if (youtubePlayerRef.current) { try { youtubePlayerRef.current.unMute(); } catch(e) { /* */ } }
  };
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const total = durations[mode];
  const progress = total > 0 ? 1 - timeLeft / total : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const toggleTimer = () => setIsRunning(s => !s);
  const resetTimer = () => { setIsRunning(false); setTimeLeft(durations[mode]); };
  const switchMode = (m) => { setIsRunning(false); setMode(m); };

  const totalFocusToday = todaySessions.reduce((sum, s) => sum + s.focusTime, 0);

  const weeklyRecords = records.filter(r => {
    const d = new Date(r.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  });
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(new Date(), -i);
    const ds = toYYYYMMDD(d);
    const daySessions = weeklyRecords.filter(r => r.date === ds);
    const totalMin = daySessions.reduce((s, r) => s + r.focusTime, 0);
    const dayLabel = d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
    weeklyData.push({ label: dayLabel, minutes: totalMin, sessions: daySessions.length });
  }

  const monthlyTotal = records.reduce((sum, r) => sum + r.focusTime, 0);
  const totalSessions = records.length;
  const avgSession = totalSessions > 0 ? Math.round(monthlyTotal / totalSessions) : 0;

  let bestStreak = 0, currentStreak = 0;
  const uniqueDates = [...new Set(records.map(r => r.date))].sort();
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i > 0 && daysAgo(uniqueDates[i - 1]) - daysAgo(uniqueDates[i]) === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    bestStreak = Math.max(bestStreak, currentStreak);
  }

  const stopAmbient = () => {
    try {
      if (ambientNodesRef.current) {
        ambientNodesRef.current.forEach(n => {
          if (typeof n === 'object' && n.stop) n.stop();
          try { if (n.disconnect) n.disconnect(); } catch (e) { /* */ }
        });
        ambientNodesRef.current = null;
      }
      if (ambientCtxRef.current) {
        ambientCtxRef.current.close();
        ambientCtxRef.current = null;
      }
    } catch (e) { /* */ }
  };

  const pinkNoiseBuffer = (ctx, len) => {
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i=0;i<len;i++) {
      const w=Math.random()*2-1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759; b2=0.96900*b2+w*0.1538520;
      b3=0.86650*b3+w*0.3104856; b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926;
    }
    return buf;
  };

  const startAmbient = (type, volume) => {
    stopAmbient();
    if (!type || type === 'none') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ambientCtxRef.current = ctx;
      const nodes = [];
      const vol = volume ?? 0.3;

      const sourceFrom = (buf) => { const s=ctx.createBufferSource(); s.buffer=buf; s.loop=true; nodes.push(s); return s; };

      if (type === 'whitenoise') {
        const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
        const d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
        const s=sourceFrom(buf);
        const g=ctx.createGain(); g.gain.setValueAtTime(vol*0.4,ctx.currentTime); g.connect(ctx.destination);
        s.connect(g); nodes.push(g);
        s.start();
      }

      else if (type === 'brown') {
        const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
        const d=buf.getChannelData(0); let v=0;
        for(let i=0;i<d.length;i++){v+=Math.random()*0.02-0.01; if(v>1)v=1;if(v<-1)v=-1; d[i]=v*0.5;}
        const s=sourceFrom(buf);
        const g=ctx.createGain(); g.gain.setValueAtTime(vol*0.5,ctx.currentTime); g.connect(ctx.destination);
        s.connect(g); nodes.push(g);
        s.start();
      }

      else if (type === 'rain') {
        const pink = pinkNoiseBuffer(ctx, ctx.sampleRate * 4);
        const s = sourceFrom(pink);
        const bp1=ctx.createBiquadFilter(); bp1.type='bandpass'; bp1.frequency.value=800; bp1.Q.value=0.5;
        const bp2=ctx.createBiquadFilter(); bp2.type='bandpass'; bp2.frequency.value=2500; bp2.Q.value=0.6;
        const bp3=ctx.createBiquadFilter(); bp3.type='bandpass'; bp3.frequency.value=4500; bp3.Q.value=0.3;
        const hp=ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=300;
        const g1=ctx.createGain(); g1.gain.value=0.6;
        const g2=ctx.createGain(); g2.gain.value=0.4;
        const g3=ctx.createGain(); g3.gain.value=0.2;
        const sum=ctx.createGain(); sum.gain.value=vol*0.6;
        s.connect(hp); hp.connect(bp1); bp1.connect(g1); g1.connect(sum);
        hp.connect(bp2); bp2.connect(g2); g2.connect(sum);
        hp.connect(bp3); bp3.connect(g3); g3.connect(sum);
        sum.connect(ctx.destination);
        nodes.push(bp1,bp2,bp3,hp,g1,g2,g3,sum);
        // Low rumble layer
        const buf2=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
        const d2=buf2.getChannelData(0); let v2=0;
        for(let i=0;i<d2.length;i++){v2+=Math.random()*0.01-0.005; if(v2>1)v2=1;if(v2<-1)v2=-1;d2[i]=v2*0.3;}
        const s2=sourceFrom(buf2);
        const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=150;
        const gLow=ctx.createGain(); gLow.gain.value=vol*0.25;
        s2.connect(lp); lp.connect(gLow); gLow.connect(ctx.destination);
        nodes.push(lp,gLow);
        s.start(); s2.start();
      }

      else if (type === 'ocean') {
        const pink = pinkNoiseBuffer(ctx, ctx.sampleRate * 4);
        const s = sourceFrom(pink);
        const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=500; lp.Q.value=0.8;
        const lfo=ctx.createOscillator(); lfo.type='sawtooth'; lfo.frequency.value=0.06;
        const lfoG=ctx.createGain(); lfoG.gain.value=0.25;
        lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start(); nodes.push(lfo,lfoG);
        const g=ctx.createGain(); g.gain.value=vol*0.5;
        s.connect(lp); lp.connect(g); g.connect(ctx.destination);
        nodes.push(lp,g);
        // Second layer - high foam
        const buf2=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
        const d2=buf2.getChannelData(0); let v2=0;
        for(let i=0;i<d2.length;i++){v2+=Math.random()*0.015-0.0075; if(v2>1)v2=1;if(v2<-1)v2=-1;d2[i]=v2*0.4;}
        const s2=sourceFrom(buf2);
        const lp2=ctx.createBiquadFilter(); lp2.type='lowpass'; lp2.frequency.value=2000;
        const hp2=ctx.createBiquadFilter(); hp2.type='highpass'; hp2.frequency.value=800;
        const lfo2=ctx.createOscillator(); lfo2.type='sine'; lfo2.frequency.value=0.12;
        const lfoG2=ctx.createGain(); lfoG2.gain.value=0.15;
        const g2=ctx.createGain(); g2.gain.value=vol*0.15;
        lfo2.connect(lfoG2); lfoG2.connect(g2.gain); lfo2.start(); nodes.push(lfo2,lfoG2);
        s2.connect(hp2); hp2.connect(lp2); lp2.connect(g2); g2.connect(ctx.destination);
        nodes.push(lp2,hp2,g2);
        s.start(); s2.start();
      }

      else if (type === 'fire') {
        // Low rumble (brown noise)
        const bufR=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
        const dR=bufR.getChannelData(0); let vr=0;
        for(let i=0;i<dR.length;i++){vr+=Math.random()*0.02-0.01; if(vr>1)vr=1;if(vr<-1)vr=-1;dR[i]=vr*0.3;}
        const sR=sourceFrom(bufR);
        const lpR=ctx.createBiquadFilter(); lpR.type='lowpass'; lpR.frequency.value=120;
        const gR=ctx.createGain(); gR.gain.value=vol*0.4;
        sR.connect(lpR); lpR.connect(gR); gR.connect(ctx.destination);
        nodes.push(lpR,gR);
        // Mid crackle (pink noise, bandpass + amplitude modulation)
        const pink = pinkNoiseBuffer(ctx, ctx.sampleRate * 4);
        const sC=sourceFrom(pink);
        const bpC=ctx.createBiquadFilter(); bpC.type='bandpass'; bpC.frequency.value=1200; bpC.Q.value=0.8;
        const cmLfo=ctx.createOscillator(); cmLfo.type='sine'; cmLfo.frequency.value=3.5;
        const cmG=ctx.createGain(); cmG.gain.value=0.7;
        const gC=ctx.createGain(); gC.gain.value=vol*0.2;
        cmLfo.connect(cmG); cmG.connect(gC.gain); cmLfo.start(); nodes.push(cmLfo,cmG);
        sC.connect(bpC); bpC.connect(gC); gC.connect(ctx.destination);
        nodes.push(bpC,gC);
        // Random pops (short noise bursts)
        const popInterval = setInterval(() => {
          if (!ambientCtxRef.current) { clearInterval(popInterval); return; }
          try {
            const t = ctx.currentTime;
            const popOsc = ctx.createOscillator();
            const popG = ctx.createGain();
            const popFreq = 600 + Math.random() * 1400;
            popOsc.frequency.setValueAtTime(popFreq, t);
            popOsc.type = 'sine';
            popG.gain.setValueAtTime(0, t);
            popG.gain.linearRampToValueAtTime(vol * (0.08 + Math.random() * 0.06), t + 0.01);
            popG.gain.exponentialRampToValueAtTime(0.001, t + 0.04 + Math.random() * 0.06);
            popOsc.connect(popG);
            popG.connect(ctx.destination);
            popOsc.start(t);
            popOsc.stop(t + 0.1);
            nodes.push(popOsc, popG);
          } catch(e) { /* */ }
        }, 150 + Math.random() * 350);
        // High sizzle
        const bufS=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
        const dS=bufS.getChannelData(0); for(let i=0;i<dS.length;i++) dS[i]=Math.random()*2-1;
        const sS=sourceFrom(bufS);
        const hpS=ctx.createBiquadFilter(); hpS.type='highpass'; hpS.frequency.value=5000;
        const gS=ctx.createGain(); gS.gain.value=vol*0.08;
        sS.connect(hpS); hpS.connect(gS); gS.connect(ctx.destination);
        nodes.push(hpS,gS);
        nodes.push({ stop: () => clearInterval(popInterval) });
        sR.start(); sC.start(); sS.start();
      }

      ambientNodesRef.current = nodes;
    } catch (e) { /* silent fail */ }
  };

  useEffect(() => {
    setTimeLeft(durations[mode]);
    setIsRunning(false);
    stopAmbient();
  }, [mode, settings.focus, settings.shortBreak, settings.longBreak]);

  useEffect(() => {
    if (!isRunning) { stopAmbient(); return; }
    if (mode === 'focus' && settings.ambientSound && settings.ambientSound !== 'none') {
      startAmbient(settings.ambientSound, settings.ambientVolume ?? 0.3);
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          stopAmbient();
          playBeep();
          if (mode === 'focus') {
            const newRecord = { date: today, completedAt: new Date().toISOString(), focusTime: settings.focus };
            onUpdatePomodoro(prev => [...prev, newRecord]);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { clearInterval(intervalRef.current); stopAmbient(); };
  }, [isRunning, mode, settings.ambientSound, settings.ambientVolume]);

  return (
    <div className="pomodoro-mobile-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="pomodoro-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>
            {'\u{1F345}'} Pomodoro
          </div>
          <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>
            {todaySessions.length} sesión{String(todaySessions.length) !== '1' ? 'es' : ''} completadas hoy
          </div>
        </div>
        <div className="pomodoro-modes" style={{ display: 'flex', gap: 8 }}>
          {['focus', 'shortBreak', 'longBreak'].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none',
              background: mode === m ? `${COLORS.primary}20` : 'transparent',
              color: mode === m ? COLORS.primary : COLORS.textDim,
              cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif",
              borderBottom: mode === m ? `2px solid ${COLORS.primary}` : '2px solid transparent',
              transition: 'all 0.2s'
            }}>
              {m === 'focus' ? 'Enfoque' : m === 'shortBreak' ? 'Descanso' : 'Descanso Largo'}
            </button>
          ))}
        </div>
      </div>

      <div className="pomodoro-kpis" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Sesiones hoy</div>
          <div style={{ fontSize: 28, color: COLORS.alert, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{todaySessions.length}</div>
          <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>{'\u{2705}'} completadas</div>
        </div>
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Tiempo hoy</div>
          <div style={{ fontSize: 28, color: COLORS.primary, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{totalFocusToday}</div>
          <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>minutos enfocado</div>
        </div>
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Total sesiones</div>
          <div style={{ fontSize: 28, color: COLORS.success, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{totalSessions}</div>
          <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>en total - ~{avgSession}m c/u</div>
        </div>
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Mejor racha</div>
          <div style={{ fontSize: 28, color: '#ffd93d', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{bestStreak}</div>
          <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>días seguidos</div>
        </div>
      </div>

      <div className="pomodoro-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="pomodoro-timer-card" style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="pomodoro-timer-ring" style={{ position: 'relative', width: 260, height: 260 }}>
            <svg width="260" height="260" viewBox="0 0 260 260" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="130" cy="130" r={radius} fill="none" stroke={COLORS.border} strokeWidth="6" />
              <circle cx="130" cy="130" r={radius} fill="none" stroke={mode === 'focus' ? COLORS.alert : COLORS.success} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.3s linear' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 56, color: COLORS.text, fontFamily: "'Inter', sans-serif", lineHeight: 1, fontWeight: 300 }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 8, letterSpacing: '0.12em' }}>
                {mode === 'focus' ? 'ENFOQUE' : mode === 'shortBreak' ? 'DESCANSO' : 'DESCANSO LARGO'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 28, alignItems: 'center' }}>
            <button onClick={resetTimer} style={{
              width: 44, height: 44, borderRadius: '50%', border: `1px solid ${COLORS.border}`,
              background: 'transparent', color: COLORS.textDim, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
            }}><Repeat size={18} /></button>
            <button onClick={toggleTimer} style={{
              width: 72, height: 72, borderRadius: '50%', border: 'none',
              background: `linear-gradient(135deg, ${mode === 'focus' ? COLORS.alert : COLORS.success}, ${mode === 'focus' ? '#ff4d6d' : '#9f1239'})`,
              color: '#000', cursor: 'pointer', fontSize: 28, display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s',
              transform: isRunning ? 'scale(1.05)' : 'scale(1)'
            }}>
              {isRunning ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <button onClick={() => setShowSettings(true)} style={{
              width: 44, height: 44, borderRadius: '50%', border: `1px solid ${COLORS.border}`,
              background: 'transparent', color: COLORS.textDim, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
            }}><Settings size={18} /></button>
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 20, fontSize: 12, color: COLORS.textDim }}>
            <span>Enfoque: <span style={{ color: COLORS.text, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{settings.focus}m</span></span>
            <span>Descanso: <span style={{ color: COLORS.text, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{settings.shortBreak}m</span></span>
            <span>Largo: <span style={{ color: COLORS.text, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{settings.longBreak}m</span></span>
          </div>

          {mode === 'focus' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center', justifyContent: 'center' }}>
              {ambientTypes.map(t => (
                <button key={t.id} onClick={() => {
                  const newSettings = { ...settings, ambientSound: t.id };
                  onUpdateUser({ pomodoro: newSettings });
                  if (isRunning) { stopAmbient(); if (t.id !== 'none') startAmbient(t.id, settings.ambientVolume); }
                }} style={{
                  width: 36, height: 36, borderRadius: 8, border: 'none',
                  background: settings.ambientSound === t.id ? `${COLORS.primary}20` : COLORS.bg,
                  color: settings.ambientSound === t.id ? COLORS.primary : COLORS.textDim,
                  cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }} title={t.label}><span className="fire-emoji">{t.icon}</span></button>
              ))}
            </div>
          )}
        </div>

        <div className="pomodoro-side-column" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{'\u{1F4CA}'} Esta semana</div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>
                {weeklyData.reduce((s, d) => s + d.minutes, 0)} min total
              </div>
            </div>
            {weeklyData.some(d => d.minutes > 0) ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#8888a0', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8888a0', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload;
                    return <div style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 12px' }}>
                      <div style={{ fontSize: 12, color: COLORS.text, marginBottom: 2 }}>{d.label}</div>
                      <div style={{ fontSize: 11, color: COLORS.alert }}>{d.minutes} min - {d.sessions} sesión{String(d.sessions) !== '1' ? 'es' : ''}</div>
                    </div>;
                  }} />
                  <Bar dataKey="minutes" name="Minutos" fill={COLORS.alert} radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, color: COLORS.textDim, fontSize: 12 }}>
                Sin datos esta semana
              </div>
            )}
          </div>

          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 500, marginBottom: 12 }}>{'\u{1F4C8}'} Resumen total</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: COLORS.textDim }}>Horas enfocado</div>
                <div style={{ fontSize: 20, color: COLORS.alert, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{(monthlyTotal / 60).toFixed(1)}h</div>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: COLORS.textDim }}>Promedio/sesión</div>
                <div style={{ fontSize: 20, color: COLORS.primary, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{avgSession}m</div>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: COLORS.textDim }}>días activos</div>
                <div style={{ fontSize: 20, color: COLORS.success, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{uniqueDates.length}</div>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: COLORS.textDim }}>Racha actual</div>
                <div style={{ fontSize: 20, color: '#ffd93d', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{currentStreak}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {todaySessions.length > 0 && (
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 10 }}>Sesiones de hoy</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {todaySessions.map((s, i) => (
              <div key={i} style={{
                padding: '6px 12px', borderRadius: 6, background: `${COLORS.success}12`,
                color: COLORS.success, fontSize: 12, fontFamily: "'Inter', sans-serif",
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                {'\u{1F345}'} {s.focusTime}m
                <span style={{ fontSize: 9, color: COLORS.textDim, opacity: 0.6 }}>
                  {new Date(s.completedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div ref={youtubeContainerRef} style={{ display: 'none' }} />

      {currentVideo && (
        <div style={{ marginBottom: 16, padding: 12, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: COLORS.text, flex: 1 }}>{'\u{1F3B5}'} {currentVideo.label || 'Reproduciendo'}</span>
            {!youtubeUnmuted && (
              <button onClick={() => { if (youtubePlayerRef.current) { try { youtubePlayerRef.current.unMute(); setYoutubeUnmuted(true); } catch(ex) {} } }} style={{
                padding: '4px 10px', borderRadius: 6, border: 'none', background: COLORS.alert, color: '#000',
                cursor: 'pointer', fontSize: 10, fontFamily: "'Inter', sans-serif"
              }}>{'\u{1F50A}'} Activar sonido</button>
            )}
            <button onClick={() => { stopYoutube(); }} style={{
              background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', fontSize: 14
            }}><X size={14} /></button>
          </div>
          <input type="range" min={0} max={duration || 100} value={currentTime || 0}
            onChange={e => { if (youtubePlayerRef.current) { try { youtubePlayerRef.current.seekTo(Number(e.target.value)); } catch(ex) {} } }}
            style={{ width: '100%', accentColor: COLORS.primary, height: 4, cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: COLORS.textDim, marginTop: 4 }}>
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 10, color: COLORS.textDim }}>Vol</span>
            <input type="range" min={0} max={100} value={volume}
              onChange={e => { const v = Number(e.target.value); setVolume(v); if (youtubePlayerRef.current) { try { youtubePlayerRef.current.setVolume(v); } catch(ex) {} } }}
              style={{ flex: 1, accentColor: COLORS.primary, height: 4, cursor: 'pointer' }} />
            <span style={{ fontSize: 10, color: COLORS.textDim }}>{volume}%</span>
          </div>
          {currentVideo && !favorites.find(f => f.videoId === currentVideo.videoId) && (
            <button onClick={() => addFavorite(currentVideo.videoId, currentVideo.playlist, currentVideo.label)} style={{
              marginTop: 6, padding: '4px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`,
              background: 'transparent', color: COLORS.textDim, cursor: 'pointer', fontSize: 10, fontFamily: "'Inter', sans-serif"
            }}>{'\u{2B50}'} Agregar a Favoritos</button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
          placeholder="URL de YouTube o bsqueda..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.bg,
            color: COLORS.text, fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none' }} />
        <button onClick={handleSearchSubmit} style={{
          padding: '10px 18px', borderRadius: 10, border: 'none', background: COLORS.primary, color: '#000',
          cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap'
        }}>Ir</button>
      </div>

      {searchLoading && (
        <div style={{ textAlign: 'center', padding: 20, color: COLORS.textDim, fontSize: 12, marginBottom: 16 }}>
          Buscando...
        </div>
      )}

      {searchError && (
        <div style={{ textAlign: 'center', padding: 12, color: COLORS.alert, fontSize: 11, background: COLORS.card, borderRadius: 8, marginBottom: 16 }}>
          {searchError}
          <button onClick={closeSearch} style={{ marginLeft: 8, background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', fontSize: 11 }}><X size={11} /></button>
        </div>
      )}

      {searchResults.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim }}>Resultados ({searchResults.length})</div>
            <button onClick={closeSearch} style={{
              marginLeft: 'auto', padding: '4px 10px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: 'transparent',
              color: COLORS.textDim, cursor: 'pointer', fontSize: 10, fontFamily: "'Inter', sans-serif"
            }}><X size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} /> Cerrar</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 480, overflowY: 'auto' }}>
            {searchResults.map(v => (
              <div key={v.videoId} onClick={() => playYoutube(v.videoId, '', v.title || v.videoId)} style={{
                display: 'flex', gap: 10, padding: 10, borderRadius: 10, cursor: 'pointer',
                background: COLORS.card, border: `1px solid ${COLORS.border}`,
                transition: 'all 0.2s', alignItems: 'center'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.primary}
                onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}>
                <img src={getThumbnail(v.videoId)} alt="" style={{ width: 80, height: 45, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.3, marginBottom: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.title}</div>
                  <div style={{ fontSize: 10, color: COLORS.textDim }}>{v.author || ''} {v.author ? ' - ' : ''} {formatDuration(v.lengthSeconds)}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); addFavorite(v.videoId, '', v.title || v.videoId); }} title="Agregar a favoritos" style={{
                  flexShrink: 0, background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', fontSize: 16, padding: 4
                }}>{'\u{2B50}'}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {favorites.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 8 }}>{'\u{2B50}'} Favoritos</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {favorites.map(f => (
              <div key={f.id} style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px', borderRadius: 8,
                background: currentVideo?.videoId === f.videoId ? `${COLORS.primary}15` : COLORS.card,
                border: `1px solid ${currentVideo?.videoId === f.videoId ? COLORS.primary : COLORS.border}`,
                transition: 'all 0.2s'
              }}>
                <button onClick={() => playYoutube(f.videoId, f.playlist, f.label)} style={{
                  background: 'none', border: 'none', color: currentVideo?.videoId === f.videoId ? COLORS.primary : COLORS.text,
                  cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif", padding: 0, whiteSpace: 'nowrap'
                }}>{'\u{1F3B5}'} {f.label}</button>
                <button onClick={() => removeFavorite(f.id)} style={{
                  background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1
                }}><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSettings && (
        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Configurar Pomodoro" width={420}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'focus', label: 'Duración de enfoque (min)', min: 1, max: 120 },
              { key: 'shortBreak', label: 'Descanso corto (min)', min: 1, max: 30 },
              { key: 'longBreak', label: 'Descanso largo (min)', min: 5, max: 60 },
            ].map(({ key, label, min, max }) => (
              <div key={key}>
                <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>{label}</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input type="range" min={min} max={max} value={localSettings[key]}
                    onChange={e => setLocalSettings(s => ({ ...s, [key]: Number(e.target.value) }))}
                    style={{ flex: 1, accentColor: COLORS.primary }} />
                  <span style={{ fontSize: 14, color: COLORS.text, fontFamily: "'Inter', sans-serif", minWidth: 32, textAlign: 'right' }}>{localSettings[key]}</span>
                </div>
              </div>
            ))}

            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 8 }}>Sonido ambiental (solo enfoque)</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ambientTypes.map(t => (
                  <button key={t.id} onClick={() => setLocalSettings(s => ({ ...s, ambientSound: t.id }))} style={{
                    padding: '6px 10px', borderRadius: 6, border: `1px solid ${localSettings.ambientSound === t.id ? COLORS.primary : COLORS.border}`,
                    background: localSettings.ambientSound === t.id ? `${COLORS.primary}15` : 'transparent',
                    color: localSettings.ambientSound === t.id ? COLORS.primary : COLORS.textDim,
                    cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif",
                    display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s'
                  }}>
                    <span className="fire-emoji">{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
              {localSettings.ambientSound !== 'none' && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Volumen: {Math.round((localSettings.ambientVolume ?? 0.3) * 100)}%</div>
                  <input type="range" min={0} max={1} step={0.05} value={localSettings.ambientVolume ?? 0.3}
                    onChange={e => setLocalSettings(s => ({ ...s, ambientVolume: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: COLORS.primary }} />
                </div>
              )}
            </div>

            <button onClick={() => { onUpdateUser({ pomodoro: localSettings }); setShowSettings(false); }}
              style={{ marginTop: 8, padding: '12px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, color: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif" }}>
              Guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const WorkoutView = ({ data, onUpdateData, onCompleteHabit, awardXp }) => {
  const { workoutData } = data;
  const [tab, setTab] = useState('train');
  const [gymMode, setGymMode] = useState(null);
  const mgs = [...new Set(workoutData.exercises.map(e => e.mg))];
  const getEx = (id) => workoutData.exercises.find(e => e.id === id);

  const handleGymSaveSession = (session, prs) => {
    onUpdateData(wd => ({ ...wd, sessions: [...wd.sessions, session] }));
    awardXp(data, 30);
    if (prs.length > 0) awardXp(data, prs.length * 20);
    setGymMode(null);
  };

  return (
    <div className="workout-mobile-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="workout-tabs" style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'train', label: 'Entrenar Ahora', icon: <Play size={16} /> },
          { id: 'cal', label: 'Calendario', icon: <Calendar size={16} /> },
          { id: 'prog', label: 'Progreso', icon: <TrendingUp size={16} /> }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 20px', borderRadius: 20, border: 'none',
            background: tab === t.id ? `linear-gradient(135deg, ${COLORS.primary}, #7f1028)` : COLORS.card,
            color: tab === t.id ? '#fff' : COLORS.textDim, cursor: 'pointer',
            fontSize: 14, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.2s'
          }}><span className="fire-emoji">{t.icon}</span>{t.label}</button>
        ))}
      </div>
      {tab === 'train' && <WorkoutTrainTab workoutData={workoutData} onUpdateData={onUpdateData} setGymMode={setGymMode} awardXp={awardXp} onCompleteHabit={onCompleteHabit} />}
      {tab === 'cal' && <WorkoutCalTab workoutData={workoutData} />}
      {tab === 'prog' && <WorkoutProgTab workoutData={workoutData} />}
      {gymMode && <GymMode gymData={gymMode} workoutData={workoutData} onUpdateData={onUpdateData} onClose={() => setGymMode(null)} onSaveSession={handleGymSaveSession} onCompleteHabit={onCompleteHabit} />}
    </div>
  );
};

const WorkoutTrainTab = ({ workoutData, onUpdateData, setGymMode, awardXp, onCompleteHabit }) => {
  const { exercises, routines, sessions } = workoutData;
  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [editRoutine, setEditRoutine] = useState(null);
  const [showExManager, setShowExManager] = useState(false);
  const getEx = (id) => exercises.find(e => e.id === id);

  const startFreeWorkout = () => setGymMode({ type: 'free', routine: null, exercises: [] });
  const startRoutine = (r) => setGymMode({ type: 'routine', routine: r, exercises: r.exercises.map(ex => ({ ...ex, rest: Number(ex.rest || 90), sets: Array.from({ length: ex.sets }, (_, i) => ({ setNumber: i + 1, reps: ex.reps, weight: ex.weight, completed: false, isPersonalRecord: false })) })) });
  const createRoutineExercise = (exercise) => {
    const newEx = {
      id: `ex_custom_${Date.now()}`,
      name: exercise.name.trim(),
      mg: exercise.mg,
      type: exercise.type,
      equip: exercise.equip,
      custom: true
    };
    onUpdateData(wd => ({ ...wd, exercises: [...wd.exercises, newEx] }));
    return newEx;
  };

  const saveRoutine = (data) => {
    const exercisePool = [...exercises, ...(data.createdExercises || [])];
    const findExercise = (id) => exercisePool.find(e => e.id === id);
    const r = { id: editRoutine?.id || `r${Date.now()}`, name: data.name, muscleGroups: [...new Set(data.exercises.map(ex => findExercise(ex.eid)?.mg).filter(Boolean))], exercises: data.exercises, createdAt: toYYYYMMDD(new Date()) };
    onUpdateData(wd => ({ ...wd, routines: editRoutine ? wd.routines.map(x => x.id === r.id ? r : x) : [...wd.routines, r] }));
    setShowNewRoutine(false); setEditRoutine(null);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary}15, #7f102810)`, borderRadius: 16, border: `1px solid ${COLORS.primary}30`, padding: 32, marginBottom: 24, textAlign: 'center' }}>
        <div className="fire-emoji" style={{ fontSize: 48, marginBottom: 12 }}>{'\u{1F3CB}\u{FE0F}'}</div>
        <div style={{ fontSize: 20, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 8 }}>Entreno Libre</div>
        <div style={{ fontSize: 13, color: COLORS.textDim, marginBottom: 20 }}>Empieza sin rutina, añade ejercicios sobre la marcha</div>
        <button onClick={startFreeWorkout} style={{ padding: '14px 40px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff', fontSize: 16, fontFamily: "'Inter', sans-serif", cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}><Play size={18} /> Iniciar Entreno Libre</button>
      </div>

      <div className="workout-routine-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>Mis Rutinas</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowExManager(true)} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: COLORS.card, color: COLORS.textDim, cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Gestionar Ejercicios</button>
          <button onClick={() => { setEditRoutine(null); setShowNewRoutine(true); }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: `${COLORS.primary}15`, color: COLORS.primary, cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={14} /> Nueva Rutina</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {routines.map(r => {
          const last = sessions.filter(s => s.routineId === r.id).sort((a, b) => b.date.localeCompare(a.date))[0];
          const totalSets = r.exercises.reduce((s, ex) => s + (ex.sets || 0), 0);
          const estDuration = totalSets * 3.5;
          return (
            <div key={r.id} style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: 16, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>{r.name}</div>
                <button onClick={() => { setEditRoutine(r); setShowNewRoutine(true); }} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', padding: 4 }}><Edit size={14} /></button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {r.muscleGroups.map(mg => <span key={mg} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${MUSCLE_COLORS[mg] || COLORS.primary}20`, color: MUSCLE_COLORS[mg] || COLORS.text }}>{mg}</span>)}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>{r.exercises.length} ejercicios - {totalSets} series - ~{Math.floor(estDuration)} min</div>
              <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 16 }}>{last ? `Última vez: ${daysAgo(last.date)} días` : 'Nunca realizada'}</div>
              <button onClick={() => startRoutine(r)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif" }}><Play size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Iniciar</button>
            </div>
          );
        })}
        <button onClick={() => { setEditRoutine(null); setShowNewRoutine(true); }} style={{ background: COLORS.card, borderRadius: 16, border: `2px dashed ${COLORS.border}`, padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 180, color: COLORS.textDim }}>
          <Plus size={32} />
          <span style={{ fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Nueva Rutina</span>
        </button>
      </div>

      {showNewRoutine && <RoutineModal exercises={exercises} initial={editRoutine} onSave={saveRoutine} onCreateExercise={createRoutineExercise} onClose={() => { setShowNewRoutine(false); setEditRoutine(null); }} />}
      {showExManager && <ExerciseManager exercises={exercises} workoutData={workoutData} onUpdateData={onUpdateData} onClose={() => setShowExManager(false)} />}
    </div>
  );
};

const RoutineModal = ({ exercises, initial, onSave, onClose, onCreateExercise }) => {
  const [name, setName] = useState(initial?.name || '');
  const [exs, setExs] = useState(initial?.exercises?.map(e => ({ ...e })) || []);
  const [search, setSearch] = useState('');
  const [mgFilter, setMgFilter] = useState('all');
  const [createdExercises, setCreatedExercises] = useState([]);
  const [showCustomExercise, setShowCustomExercise] = useState(false);
  const [customExercise, setCustomExercise] = useState({ name: '', mg: 'Full Body', type: 'fuerza', equip: 'Peso Corporal' });
  const allExercises = [...exercises, ...createdExercises.filter(ex => !exercises.some(existing => existing.id === ex.id))];
  const muscleOptions = [...new Set([...allExercises.map(e => e.mg).filter(Boolean), 'Full Body', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'])];
  const mgs = [...new Set(allExercises.map(e => e.mg).filter(Boolean))];
  const filtered = allExercises.filter(e => (mgFilter === 'all' || e.mg === mgFilter) && e.name.toLowerCase().includes(search.toLowerCase()) && !exs.some(x => x.eid === e.id));

  const addEx = (eid) => setExs(x => [...x, { eid, sets: 3, reps: 10, weight: 0, rest: 90 }]);
  const addCustomExercise = () => {
    const cleanName = customExercise.name.trim();
    if (!cleanName) return;
    const existing = allExercises.find(e => e.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      if (!exs.some(ex => ex.eid === existing.id)) addEx(existing.id);
      setCustomExercise({ name: '', mg: 'Full Body', type: 'fuerza', equip: 'Peso Corporal' });
      setShowCustomExercise(false);
      return;
    }
    const newEx = onCreateExercise({
      name: cleanName,
      mg: customExercise.mg || 'Full Body',
      type: customExercise.type || 'fuerza',
      equip: customExercise.equip || 'Peso Corporal'
    });
    setCreatedExercises(prev => [...prev, newEx]);
    setExs(prev => [...prev, { eid: newEx.id, sets: 3, reps: 10, weight: 0, rest: 90 }]);
    setCustomExercise({ name: '', mg: 'Full Body', type: 'fuerza', equip: 'Peso Corporal' });
    setSearch('');
    setShowCustomExercise(false);
  };
  const updateEx = (idx, field, val) => setExs(x => x.map((e, i) => i === idx ? { ...e, [field]: val } : e));
  const removeEx = (idx) => setExs(x => x.filter((_, i) => i !== idx));
  const moveEx = (idx, dir) => { const a = [...exs]; const t = a[idx]; a[idx] = a[idx + dir]; a[idx + dir] = t; setExs(a); };

  return (
    <Modal isOpen={true} onClose={onClose} title={initial ? 'Editar Rutina' : 'Nueva Rutina'} width={600}>
      <div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, color: COLORS.textDim, display: 'block', marginBottom: 4 }}>NOMBRE DE LA RUTINA</label><input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif" }} /></div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <button onClick={() => setMgFilter('all')} style={{ padding: '4px 12px', borderRadius: 12, border: 'none', background: mgFilter === 'all' ? COLORS.primary : COLORS.bg, color: mgFilter === 'all' ? '#fff' : COLORS.textDim, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>Todos</button>
        {mgs.map(mg => <button key={mg} onClick={() => setMgFilter(mg)} style={{ padding: '4px 12px', borderRadius: 12, border: 'none', background: mgFilter === mg ? MUSCLE_COLORS[mg] || COLORS.primary : COLORS.bg, color: mgFilter === mg ? '#fff' : COLORS.textDim, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>{mg}</button>)}
      </div>
      <div style={{ marginBottom: 10 }}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ejercicio..." style={{ width: '100%', padding: '8px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13, outline: 'none', fontFamily: "'Inter', sans-serif" }} /></div>
      <div style={{ marginBottom: 16, border: `1px solid ${showCustomExercise ? COLORS.primary + '55' : COLORS.border}`, borderRadius: 12, background: showCustomExercise ? `${COLORS.primary}08` : COLORS.bg, overflow: 'hidden' }}>
        <button onClick={() => setShowCustomExercise(value => !value)} style={{ width: '100%', border: 'none', background: 'transparent', color: COLORS.text, cursor: 'pointer', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={15} color={COLORS.primary} />
            Agregar ejercicio personalizado
          </span>
          <span style={{ color: COLORS.textDim, fontSize: 11 }}>{showCustomExercise ? 'Cerrar' : 'Crear'}</span>
        </button>
        {showCustomExercise && (
          <div style={{ padding: '0 12px 12px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(110px, 0.8fr)', gap: 8 }}>
            <input value={customExercise.name} onChange={e => setCustomExercise(prev => ({ ...prev, name: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') addCustomExercise(); }} placeholder="Nombre del ejercicio"
              style={{ gridColumn: '1 / -1', padding: '9px 12px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 9, color: COLORS.text, fontSize: 13, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
            <select value={customExercise.mg} onChange={e => setCustomExercise(prev => ({ ...prev, mg: e.target.value }))} style={{ padding: '8px 10px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
              {muscleOptions.map(mg => <option key={mg} value={mg}>{mg}</option>)}
            </select>
            <select value={customExercise.type} onChange={e => setCustomExercise(prev => ({ ...prev, type: e.target.value }))} style={{ padding: '8px 10px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
              <option value="fuerza">Fuerza</option>
              <option value="cardio">Cardio</option>
              <option value="peso_corporal">Peso corporal</option>
              <option value="movilidad">Movilidad</option>
            </select>
            <input value={customExercise.equip} onChange={e => setCustomExercise(prev => ({ ...prev, equip: e.target.value }))} placeholder="Equipo"
              style={{ padding: '8px 10px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 12, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
            <button onClick={addCustomExercise} disabled={!customExercise.name.trim()} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: customExercise.name.trim() ? `linear-gradient(135deg, ${COLORS.primary}, #7f1028)` : COLORS.border, color: customExercise.name.trim() ? '#fff' : COLORS.textDim, cursor: customExercise.name.trim() ? 'pointer' : 'default', fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              Agregar
            </button>
          </div>
        )}
      </div>
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filtered.map(e => <button key={e.id} onClick={() => addEx(e.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, color: COLORS.text, fontSize: 13, fontFamily: "'Inter', sans-serif", textAlign: 'left' }}><Plus size={14} color={COLORS.primary} />{e.name} <span style={{ fontSize: 10, color: COLORS.textDim }}>- {e.mg}</span></button>)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {exs.map((ex, i) => {
          const e = allExercises.find(x => x.id === ex.eid);
          return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: COLORS.bg, borderRadius: 8, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 13, color: COLORS.text, flex: 1, minWidth: 100 }}>{e?.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}><span style={{ fontSize: 9, color: COLORS.textDim }}>Series</span><input type="number" value={ex.sets} onChange={e => updateEx(i, 'sets', Math.max(1, +e.target.value))} style={{ width: 40, padding: '4px 6px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.text, fontSize: 12, textAlign: 'center', fontFamily: "'Inter', sans-serif" }} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}><span style={{ fontSize: 9, color: COLORS.textDim }}>Reps</span><input type="number" value={ex.reps} onChange={e => updateEx(i, 'reps', Math.max(1, +e.target.value))} style={{ width: 40, padding: '4px 6px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.text, fontSize: 12, textAlign: 'center', fontFamily: "'Inter', sans-serif" }} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}><span style={{ fontSize: 9, color: COLORS.textDim }}>Peso (kg)</span><input type="number" value={ex.weight} onChange={e => updateEx(i, 'weight', Math.max(0, +e.target.value))} step="0.5" style={{ width: 50, padding: '4px 6px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.text, fontSize: 12, textAlign: 'center', fontFamily: "'Inter', sans-serif" }} /></div>
            <button onClick={() => moveEx(i, -1)} disabled={i === 0} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', padding: 2 }}><ArrowUp size={14} /></button>
            <button onClick={() => moveEx(i, 1)} disabled={i === exs.length - 1} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer', padding: 2 }}><ArrowDown size={14} /></button>
            <button onClick={() => removeEx(i)} style={{ background: 'none', border: 'none', color: COLORS.alert, cursor: 'pointer', padding: 2 }}><X size={14} /></button>
          </div>;
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.textDim, cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Cancelar</button>
        <button onClick={() => onSave({ name, exercises: exs, createdExercises })} disabled={!name || exs.length === 0} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: name && exs.length ? `linear-gradient(135deg, ${COLORS.primary}, #7f1028)` : COLORS.border, color: name && exs.length ? '#fff' : COLORS.textDim, cursor: name && exs.length ? 'pointer' : 'default', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Guardar Rutina</button>
      </div>
    </Modal>
  );
};

const ExerciseManager = ({ exercises, workoutData, onUpdateData, onClose }) => {
  const [search, setSearch] = useState('');
  const [mgFilter, setMgFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', mg: 'Pecho', type: 'fuerza', equip: 'Barra' });
  const mgs = [...new Set(exercises.map(e => e.mg))];
  const filtered = exercises.filter(e => (mgFilter === 'all' || e.mg === mgFilter) && e.name.toLowerCase().includes(search.toLowerCase()));
  const createEx = () => { if (form.name.trim()) { onUpdateData(wd => ({ ...wd, exercises: [...wd.exercises, { id: `ex_custom_${Date.now()}`, name: form.name.trim(), mg: form.mg, type: form.type, equip: form.equip, custom: true }] })); setShowForm(false); setForm({ name: '', mg: 'Pecho', type: 'fuerza', equip: 'Barra' }); } };
  const deleteEx = (id) => { onUpdateData(wd => ({ ...wd, exercises: wd.exercises.filter(e => e.id !== id) })); };

  return (
    <Modal isOpen={true} onClose={onClose} title="Gestionar Ejercicios" width={600}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <button onClick={() => setMgFilter('all')} style={{ padding: '4px 12px', borderRadius: 12, border: 'none', background: mgFilter === 'all' ? COLORS.primary : COLORS.bg, color: mgFilter === 'all' ? '#fff' : COLORS.textDim, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>Todos</button>
        {mgs.map(mg => <button key={mg} onClick={() => setMgFilter(mg)} style={{ padding: '4px 12px', borderRadius: 12, border: 'none', background: mgFilter === mg ? MUSCLE_COLORS[mg] || COLORS.primary : COLORS.bg, color: mgFilter === mg ? '#fff' : COLORS.textDim, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>{mg}</button>)}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." style={{ flex: 1, padding: '8px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: COLORS.primary, color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>+ Crear</button>
      </div>
      {showForm && <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', padding: 12, background: COLORS.bg, borderRadius: 8 }}><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre" style={{ flex: 1, minWidth: 120, padding: '6px 10px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontSize: 12, fontFamily: "'Inter', sans-serif" }} /><select value={form.mg} onChange={e => setForm(f => ({ ...f, mg: e.target.value }))} style={{ padding: '6px 10px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontSize: 12, fontFamily: "'Inter', sans-serif" }}>{mgs.map(m => <option key={m} value={m}>{m}</option>)}</select><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ padding: '6px 10px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontSize: 12, fontFamily: "'Inter', sans-serif" }}><option value="fuerza">Fuerza</option><option value="cardio">Cardio</option><option value="peso_corporal">Peso Corporal</option></select><input value={form.equip} onChange={e => setForm(f => ({ ...f, equip: e.target.value }))} placeholder="Equipo" style={{ width: 100, padding: '6px 10px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontSize: 12, fontFamily: "'Inter', sans-serif" }} /><button onClick={createEx} style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: COLORS.success, color: '#000', cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Guardar</button></div>}
      <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filtered.map(e => <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: COLORS.bg, borderRadius: 8 }}>
          <span style={{ fontSize: 13, color: COLORS.text, flex: 1, fontFamily: "'Inter', sans-serif" }}>{e.name}</span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${MUSCLE_COLORS[e.mg] || COLORS.primary}20`, color: MUSCLE_COLORS[e.mg] || COLORS.text }}>{e.mg}</span>
          <span style={{ fontSize: 10, color: COLORS.textDim }}>{e.equip}</span>
          {e.custom && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: `${COLORS.alert}20`, color: COLORS.alert }}>CUSTOM</span>}
          {e.custom && <button onClick={() => deleteEx(e.id)} style={{ background: 'none', border: 'none', color: COLORS.alert, cursor: 'pointer', padding: 2 }}><Trash2 size={12} /></button>}
        </div>)}
      </div>
    </Modal>
  );
};

const GymMode = ({ gymData, workoutData, onUpdateData, onClose, onSaveSession, onCompleteHabit }) => {
  const { exercises: wdExs, sessions: wdSessions } = workoutData;
  const [activeExIdx, setActiveExIdx] = useState(0);
  const [exState, setExState] = useState(gymData.exercises.length > 0 ? gymData.exercises : []);
  const [activeSetIdx, setActiveSetIdx] = useState(0);
  const [restTime, setRestTime] = useState(null);
  const [restRunning, setRestRunning] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [showAddEx, setShowAddEx] = useState(false);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [finished, setFinished] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [prs, setPrs] = useState([]);
  const [showFitnessToast, setShowFitnessToast] = useState(false);
  const [exerciseDurations, setExerciseDurations] = useState({});
  const [restSecondsTotal, setRestSecondsTotal] = useState(0);
  const [finalStats, setFinalStats] = useState(null);
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);
  const exerciseStartRef = useRef(Date.now());
  const titleRef = useRef(null);
  const getEx = (id) => wdExs.find(e => e.id === id);

  // Timer
  useEffect(() => {
    if (!finished) { timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime, finished]);

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);

  useEffect(() => {
    if (restRunning && restTime > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTime(t => {
          if (t <= 1) { setRestRunning(false); return 0; }
          setRestSecondsTotal(s => s + 1);
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (restTimerRef.current) clearInterval(restTimerRef.current); };
  }, [restRunning]);

  const curEx = exState[activeExIdx];
  const curSets = curEx?.sets || [];
  const curSet = curSets[activeSetIdx];
  const totalExs = exState.length;
  const totalSets = exState.reduce((s, e) => s + e.sets.length, 0);
  const completedSets = exState.reduce((s, e) => s + e.sets.filter(x => x.completed).length, 0);
  const fElapsed = (s) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const durationLabel = (seconds = 0) => {
    const safe = Math.max(0, Math.round(seconds));
    const h = Math.floor(safe / 3600);
    const m = Math.floor((safe % 3600) / 60);
    const sec = safe % 60;
    if (h) return `${h}h ${m}m`;
    if (m) return `${m}m ${sec}s`;
    return `${sec}s`;
  };
  const setVolume = (set) => Number(set.weight || 0) * Number(set.reps || 0);
  const estimateRm = (set) => calcRM(Number(set.weight || 0), Number(set.reps || 0));
  const getCurrentExerciseKey = (state = exState, idx = activeExIdx) => state[idx]?.eid || state[idx]?.exerciseId || '';
  const buildWorkoutStats = (state = exState, durations = exerciseDurations) => {
    const durationSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
    const currentKey = getCurrentExerciseKey(state);
    const delta = currentKey ? Math.max(0, Math.floor((Date.now() - exerciseStartRef.current) / 1000)) : 0;
    const mergedDurations = currentKey ? { ...durations, [currentKey]: (durations[currentKey] || 0) + delta } : durations;
    const doneSets = state.flatMap(e => e.sets.filter(x => x.completed));
    const totalVolume = doneSets.reduce((sum, set) => sum + setVolume(set), 0);
    const bestRm = doneSets.reduce((best, set) => Math.max(best, estimateRm(set)), 0);
    return {
      durationSeconds,
      activeSeconds: Math.max(0, durationSeconds - restSecondsTotal),
      restSeconds: restSecondsTotal,
      totalSetsDone: doneSets.length,
      totalVolume,
      bestRm,
      exerciseDurations: mergedDurations
    };
  };
  const captureExerciseDuration = (state = exState, idx = activeExIdx) => {
    const key = getCurrentExerciseKey(state, idx);
    const delta = Math.max(0, Math.floor((Date.now() - exerciseStartRef.current) / 1000));
    if (key && delta > 0) {
      setExerciseDurations(prev => ({ ...prev, [key]: (prev[key] || 0) + delta }));
    }
    exerciseStartRef.current = Date.now();
  };
  const currentStats = buildWorkoutStats();
  const currentExerciseKey = getCurrentExerciseKey();
  const currentExerciseDuration = currentStats.exerciseDurations[currentExerciseKey] || 0;
  const pendingSets = curSets.filter(set => !set.completed).length;

  const updateSetField = (setIndex, field, value) => {
    setExState(items => items.map((ex, ei) => ei === activeExIdx ? {
      ...ex,
      sets: ex.sets.map((set, si) => si === setIndex ? { ...set, [field]: value } : set)
    } : ex));
  };
  const updateCurrentExerciseRestMinutes = (value) => {
    const rest = Math.max(0, Math.round(Number(value || 0) * 60));
    setExState(items => items.map((ex, ei) => ei === activeExIdx ? { ...ex, rest } : ex));
  };
  const addSetToCurrentExercise = () => {
    setExState(items => items.map((ex, ei) => {
      if (ei !== activeExIdx) return ex;
      const last = ex.sets[ex.sets.length - 1] || { reps: 10, weight: 0 };
      return {
        ...ex,
        sets: [...ex.sets, { setNumber: ex.sets.length + 1, reps: last.reps || 10, weight: last.weight || 0, completed: false, isPersonalRecord: false }]
      };
    }));
  };
  const removeCurrentSet = (setIndex) => {
    if (curSets.length <= 1) return;
    setExState(items => items.map((ex, ei) => ei === activeExIdx ? { ...ex, sets: ex.sets.filter((_, si) => si !== setIndex).map((set, si) => ({ ...set, setNumber: si + 1 })) } : ex));
    setActiveSetIdx(idx => Math.max(0, Math.min(idx, curSets.length - 2)));
  };
  const goToExercise = (nextIdx) => {
    if (nextIdx < 0 || nextIdx >= totalExs || nextIdx === activeExIdx) return;
    captureExerciseDuration();
    setActiveExIdx(nextIdx);
    const firstPending = exState[nextIdx]?.sets.findIndex(set => !set.completed);
    setActiveSetIdx(firstPending >= 0 ? firstPending : 0);
    setRestRunning(false);
    setRestTime(null);
  };

  const completeSet = () => {
    if (!curSet) return;
    const eid = curEx.eid || curEx.exerciseId;
    const lastSessions = wdSessions.filter(s => s.exercises.some(e => e.exerciseId === eid)).sort((a, b) => b.date.localeCompare(a.date));
    let isPR = true;
    const currVal = curSet.weight * curSet.reps;
    for (const s of lastSessions) {
      for (const e of s.exercises) {
        if (e.exerciseId === eid) { for (const set of e.sets) { if (set.weight * set.reps >= currVal) { isPR = false; break; } } }
        if (!isPR) break;
      }
      if (!isPR) break;
    }
    const nextPrs = isPR && curSet.weight > 0 ? [...prs, { exName: getEx(eid)?.name || '', weight: curSet.weight, reps: curSet.reps }] : prs;
    if (nextPrs !== prs) setPrs(nextPrs);
    const newExState = exState.map((ex, ei) => ei === activeExIdx ? { ...ex, sets: ex.sets.map((s, si) => si === activeSetIdx ? { ...s, completed: true, isPersonalRecord: isPR } : s) } : ex);
    setExState(newExState);
    if (activeSetIdx < curSets.length - 1) { setActiveSetIdx(s => s + 1); setRestTime(Number(curEx.rest || 90)); setRestRunning(true); }
    else if (activeExIdx < totalExs - 1) { captureExerciseDuration(newExState); setActiveExIdx(i => i + 1); setActiveSetIdx(0); }
    else finishWorkout(newExState, nextPrs);
  };

  const finishWorkout = (state = exState, nextPrs = prs) => {
    const stats = buildWorkoutStats(state);
    setFinalStats(stats);
    setExerciseDurations(stats.exerciseDurations);
    exerciseStartRef.current = Date.now();
    setPrs(nextPrs);
    setFinished(true);
    setShowFitnessToast(stats.durationSeconds >= 1200);
  };

  const saveSession = () => {
    const stats = finalStats || buildWorkoutStats();
    const s = {
      id: `ws${Date.now()}`, routineId: gymData.routine?.id || null, routineName: gymData.routine?.name || 'Entreno Libre',
      date: toYYYYMMDD(new Date()), startTime: new Date(startTime).toTimeString().slice(0, 5), endTime: new Date().toTimeString().slice(0, 5),
      durationMinutes: Math.max(1, Math.round(stats.durationSeconds / 60)), durationSeconds: stats.durationSeconds, activeSeconds: stats.activeSeconds, restSeconds: stats.restSeconds,
      totalVolume: stats.totalVolume, totalSets: stats.totalSetsDone,
      exercises: exState.filter(e => e.sets.some(s => s.completed)).map(e => ({
        exerciseId: e.eid || e.exerciseId,
        exerciseName: getEx(e.eid || e.exerciseId)?.name || '',
        muscleGroup: getEx(e.eid || e.exerciseId)?.mg || '',
        durationSeconds: stats.exerciseDurations[e.eid || e.exerciseId] || 0,
        sets: e.sets.filter(s => s.completed)
      })),
      notes: sessionNotes
    };
    onSaveSession(s, prs);
  };

  const summaryStats = finalStats || currentStats;

  if (finished) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: `radial-gradient(circle at 50% 0%, ${COLORS.primary}18, transparent 38%), ${COLORS.bg}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ fontSize: 70, marginBottom: 12 }}>{'\u{1F3C6}'}</div>
      <div style={{ fontSize: 34, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 8 }}>¡Entreno completado!</div>
      <div style={{ color: COLORS.textDim, fontSize: 13, fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>Resumen real de tu sesión</div>
      <div style={{ background: COLORS.card, borderRadius: 22, border: `1px solid ${COLORS.border}`, padding: 24, maxWidth: 720, width: '100%', marginBottom: 20, boxShadow: '0 26px 90px rgba(0,0,0,0.16)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 12, marginBottom: 16 }}>
          {[
            ['Duración', durationLabel(summaryStats.durationSeconds), COLORS.primary],
            ['Tiempo activo', durationLabel(summaryStats.activeSeconds), COLORS.success],
            ['Descanso', durationLabel(summaryStats.restSeconds), COLORS.textDim],
            ['Series', summaryStats.totalSetsDone, COLORS.success],
            ['Volumen total', `${summaryStats.totalVolume} kg`, COLORS.alert],
            ['Mejor 1RM est.', `${summaryStats.bestRm} kg`, '#ffd93d']
          ].map(([label, value, color]) => (
            <div key={label} style={{ background: COLORS.bg, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 5, fontFamily: "'Inter', sans-serif" }}>{label}</div>
              <div style={{ fontSize: 18, color, fontFamily: "'Inter', sans-serif", fontWeight: 900 }}>{value}</div>
            </div>
          ))}
        </div>
        {prs.length > 0 && <div style={{ marginBottom: 16 }}><div style={{ fontSize: 12, color: '#ffd93d', marginBottom: 8 }}>{'\u{1F3C6}'} Nuevos Récords Personales</div>{prs.map((p, i) => <div key={i} style={{ fontSize: 11, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>{p.exName}: {p.weight}kg - {p.reps} reps</div>)}</div>}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, marginBottom: 14 }}>
          <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 800, fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>Duración por ejercicio</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {exState.filter(e => e.sets.some(set => set.completed)).map(e => {
              const key = e.eid || e.exerciseId;
              const exInfo = getEx(key);
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 10px', borderRadius: 10, background: COLORS.bg, border: `1px solid ${COLORS.border}`, fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
                  <span style={{ color: COLORS.text }}>{exInfo?.name || 'Ejercicio'}</span>
                  <span style={{ color: COLORS.primary, fontWeight: 900 }}>{durationLabel(summaryStats.exerciseDurations[key] || 0)}</span>
                </div>
              );
            })}
          </div>
        </div>
        <textarea value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} placeholder="¿Cómo te sentiste hoy?" rows={2} style={{ width: '100%', padding: '8px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13, fontFamily: "'Inter', sans-serif", resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onClose} style={{ padding: '12px 24px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.textDim, cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Descartar</button>
        <button onClick={saveSession} style={{ padding: '12px 32px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${COLORS.success}, #9f1239)`, color: '#000', cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif" }}>{'\u{1F4BE}'} Guardar Sesión</button>
      </div>
    </div>
  );

  if (!curEx) return <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WorkoutExerciseAdder workoutData={workoutData} onUpdateData={onUpdateData} onAdd={(eid) => { setExState(x => [...x, { exerciseId: eid, eid, rest: 90, sets: [{ setNumber: 1, reps: 10, weight: 0, completed: false }] }]); setShowAddEx(false); }} onClose={() => { if (exState.length === 0) onClose(); else setShowAddEx(false); }} /></div>;

  return (
    <div className="workout-session-shell" style={{ position: 'fixed', inset: 0, zIndex: 2000, background: `radial-gradient(circle at 20% 0%, ${COLORS.primary}16, transparent 34%), ${COLORS.bg}`, display: 'flex', flexDirection: 'column' }}>
      <div className="workout-session-header" style={{ minHeight: 72, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: 'grid', gridTemplateColumns: '220px 1fr 220px', alignItems: 'center', padding: '0 28px', flexShrink: 0, gap: 18 }}>
        <div ref={titleRef} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, justifySelf: 'start', padding: '9px 14px', borderRadius: 999, background: `${COLORS.primary}12`, border: `1px solid ${COLORS.primary}32`, color: COLORS.text, fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 900, letterSpacing: '0.02em', boxShadow: `0 0 24px ${COLORS.primary}12` }}>
          <Timer size={18} color={COLORS.primary} />
          {fElapsed(elapsed)}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>{gymData.routine?.name || 'Entreno Libre'}</div>
          <div style={{ marginTop: 3, fontSize: 11, color: COLORS.textDim, fontFamily: "'Inter', sans-serif" }}>Ejercicio {activeExIdx + 1} de {totalExs} · {completedSets}/{totalSets} series</div>
        </div>
        {confirmSkip ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifySelf: 'end' }}>
            <span style={{ fontSize: 11, color: COLORS.alert }}>¿Salir sin guardar?</span>
            <button onClick={() => { setConfirmSkip(false); }} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.textDim, cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>No</button>
            <button onClick={onClose} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: COLORS.alert, color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Sí</button>
          </div>
        ) : (
          <button onClick={() => setConfirmSkip(true)} style={{ justifySelf: 'end', padding: '8px 16px', borderRadius: 8, border: 'none', background: COLORS.alert + '20', color: COLORS.alert, cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Terminar</button>
        )}
      </div>

      <div className="workout-session-progress" style={{ padding: '12px 28px', borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLORS.textDim, marginBottom: 7, fontFamily: "'Inter', sans-serif" }}><span>Progreso del entreno</span><span>{totalSets ? Math.round((completedSets / totalSets) * 100) : 0}%</span></div>
        <div style={{ width: '100%', height: 4, background: COLORS.bg, borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
          {exState.map((ex, i) => <div key={i} style={{ flex: 1, height: '100%', marginRight: 2, borderRadius: 2, background: i < activeExIdx ? COLORS.success : i === activeExIdx ? COLORS.primary : COLORS.border }} title={getEx(ex.eid || ex.exerciseId)?.name || ''} />)}
        </div>
      </div>

      <div className="workout-session-body" style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 24, gap: 18 }}>
        <div className="workout-session-main" style={{ flex: 1, overflowY: 'auto', maxWidth: 980, margin: '0 auto', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 22, padding: 24, boxShadow: '0 24px 90px rgba(0,0,0,0.16)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span className="fire-emoji" style={{ fontSize: 34 }}>{getEx(curEx.eid || curEx.exerciseId)?.name?.charAt(0) || '\u{1F3CB}\u{FE0F}'}</span>
            <div><div style={{ fontSize: 28, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>{getEx(curEx.eid || curEx.exerciseId)?.name || 'Ejercicio'}</div><div style={{ display: 'flex', gap: 8, marginTop: 6 }}><span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: `${MUSCLE_COLORS[getEx(curEx.eid || curEx.exerciseId)?.mg] || COLORS.primary}20`, color: MUSCLE_COLORS[getEx(curEx.eid || curEx.exerciseId)?.mg] || COLORS.text }}>{getEx(curEx.eid || curEx.exerciseId)?.mg || 'Grupo'}</span><span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: COLORS.bg, color: COLORS.textDim }}>{getEx(curEx.eid || curEx.exerciseId)?.equip || 'Equipo'}</span></div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 10, marginBottom: 18 }}>
            {[
              ['Duración ejercicio', durationLabel(currentExerciseDuration), COLORS.primary],
              ['Pendientes', pendingSets, COLORS.text]
            ].map(([label, value, color]) => (
              <div key={label} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: '11px 12px' }}>
                <div style={{ color: COLORS.textDim, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Inter', sans-serif", marginBottom: 5 }}>{label}</div>
                <div style={{ color, fontSize: 18, fontWeight: 900, fontFamily: "'Inter', sans-serif" }}>{value}</div>
              </div>
            ))}
            <div style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: '11px 12px' }}>
              <div style={{ color: COLORS.textDim, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Inter', sans-serif", marginBottom: 7 }}>Descanso</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="number" value={Number(((curEx.rest || 90) / 60).toFixed(1))} min="0" step="0.5" onChange={e => updateCurrentExerciseRestMinutes(e.target.value)} style={{ width: 72, padding: '6px 8px', borderRadius: 9, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 14, fontWeight: 900, outline: 'none' }} />
                <span style={{ color: COLORS.textDim, fontSize: 12, fontFamily: "'Inter', sans-serif" }}>min</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div className="workout-set-grid" style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 48px', gap: 8, padding: '10px 14px', background: COLORS.bg, borderRadius: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: COLORS.textDim, fontWeight: 800 }}>Serie</span>
              <span style={{ fontSize: 12, color: COLORS.textDim, fontWeight: 800 }}>Peso (kg)</span>
              <span style={{ fontSize: 12, color: COLORS.textDim, fontWeight: 800 }}>Reps</span>
              <span style={{ fontSize: 12, color: COLORS.textDim }}></span>
            </div>
            {curSets.map((set, idx) => (
              <div className="workout-set-grid" key={idx} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 48px', gap: 8, padding: '12px 14px', background: set.completed ? `${COLORS.success}08` : idx === activeSetIdx && !restRunning ? `${COLORS.primary}10` : 'rgba(255,255,255,0.015)', borderRadius: 12, marginBottom: 6, border: idx === activeSetIdx && !restRunning ? `1px solid ${COLORS.primary}35` : `1px solid ${COLORS.border}`, transition: 'all 0.2s' }}>
                <span style={{ fontSize: 15, color: COLORS.text, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', fontWeight: 800 }}>
                  {set.completed ? <Check size={14} color={COLORS.success} /> : idx === activeSetIdx && !restRunning ? <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.primary, animation: 'pulseGlow 1.5s infinite' }} /> : <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.border }} />}
                  <span style={{ marginLeft: 8 }}>{idx + 1}</span>
                </span>
                <input type="number" value={set.weight} onChange={e => updateSetField(idx, 'weight', +e.target.value)} step="0.5" min="0" style={{ padding: '8px 10px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, fontSize: 16, fontFamily: "'Inter', sans-serif", textAlign: 'center', outline: 'none' }} />
                <input type="number" value={set.reps} onChange={e => updateSetField(idx, 'reps', +e.target.value)} step="1" min="0" style={{ padding: '8px 10px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.text, fontSize: 16, fontFamily: "'Inter', sans-serif", textAlign: 'center', outline: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  {set.isPersonalRecord && <span style={{ fontSize: 15 }}>{'\u{1F3C6}'}</span>}
                  <button onClick={() => removeCurrentSet(idx)} disabled={curSets.length <= 1} style={{ width: 26, height: 26, borderRadius: 8, border: 'none', background: 'transparent', color: curSets.length <= 1 ? COLORS.textDim + '55' : COLORS.alert, cursor: curSets.length <= 1 ? 'default' : 'pointer' }}><X size={13} /></button>
                </div>
              </div>
            ))}
            <button onClick={addSetToCurrentExercise} style={{ marginTop: 4, padding: '9px 13px', borderRadius: 11, border: `1px dashed ${COLORS.primary}55`, background: `${COLORS.primary}10`, color: COLORS.primary, cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 800 }}><Plus size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />Añadir serie</button>
          </div>

          {restRunning && restTime > 0 ? (
            <div style={{ textAlign: 'center', padding: 20, animation: restTime <= 5 ? 'pulseGlow 1s infinite' : 'none' }}>
              <div style={{ fontSize: 13, color: COLORS.secondary, marginBottom: 12 }}>DESCANSO {restTime <= 5 ? '\u{23F0}' : ''}</div>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ margin: '0 auto 16px' }}>
                <circle cx="80" cy="80" r="70" fill="none" stroke={COLORS.border} strokeWidth="6" />
                <circle cx="80" cy="80" r="70" fill="none" stroke={restTime <= 5 ? COLORS.alert : COLORS.secondary} strokeWidth="6" strokeLinecap="round" transform="rotate(-90 80 80)" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 * (1 - restTime / (curEx.rest || 90))}`} style={{ transition: 'stroke-dashoffset 0.5s linear' }} />
              </svg>
              <div style={{ fontSize: 48, color: restTime <= 5 ? COLORS.alert : COLORS.secondary, fontFamily: "'Inter', sans-serif" }}>{String(Math.floor(restTime / 60)).padStart(2, '0')}:{String(restTime % 60).padStart(2, '0')}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                <button onClick={() => setRestTime(t => Math.min(t + 30, 300))} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.textDim, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>+30s</button>
                <button onClick={() => setRestTime(t => Math.max(0, t - 30))} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.textDim, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>-30s</button>
                <button onClick={() => { setRestRunning(false); setRestTime(0); }} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: COLORS.primary, color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>Saltar</button>
              </div>
            </div>
          ) : (
            <button onClick={curSet?.completed && completedSets >= totalSets ? () => finishWorkout() : completeSet} disabled={curSet?.completed && completedSets < totalSets} className={curSet?.completed ? 'flash-green' : ''} style={{ width: '100%', padding: '17px', borderRadius: 14, border: 'none', background: curSet?.completed && completedSets >= totalSets ? `linear-gradient(135deg, ${COLORS.primary}, #7f1028)` : curSet?.completed ? COLORS.border : `linear-gradient(135deg, ${COLORS.success}, #9f1239)`, color: curSet?.completed && completedSets >= totalSets ? '#fff' : curSet?.completed ? COLORS.textDim : '#000', cursor: curSet?.completed && completedSets < totalSets ? 'default' : 'pointer', fontSize: 16, fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              {curSet?.completed && completedSets >= totalSets ? '\u{1F3C1} Finalizar entreno' : curSet?.completed ? '\u{2705} Completa' : '\u{2705} Completar serie'}
            </button>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <button onClick={() => goToExercise(activeExIdx - 1)} disabled={activeExIdx === 0} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.textDim, cursor: activeExIdx > 0 ? 'pointer' : 'default', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>{'\u{2190}'} Ejercicio Anterior</button>
            <button onClick={() => setShowAddEx(true)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: `${COLORS.primary}15`, color: COLORS.primary, cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>+ Añadir Ejercicio</button>
            <button onClick={() => goToExercise(activeExIdx + 1)} disabled={activeExIdx >= totalExs - 1} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.textDim, cursor: activeExIdx < totalExs - 1 ? 'pointer' : 'default', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Siguiente Ejercicio {'\u{2192}'}</button>
          </div>
        </div>

        <div className="mobile-only" style={{ flexDirection: 'column', gap: 4, padding: '8px 16px', borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ejercicios</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {exState.map((ex, i) => {
              const exInfo = getEx(ex.eid || ex.exerciseId);
              const setsDone = ex.sets.filter(s => s.completed).length;
              return (
                <button key={i} onClick={() => goToExercise(i)} style={{
                  padding: '4px 10px', borderRadius: 12, border: 'none',
                  background: i === activeExIdx ? COLORS.primary : COLORS.card,
                  color: i === activeExIdx ? '#fff' : COLORS.textDim,
                  cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 4,
                  opacity: setsDone === ex.sets.length ? 0.7 : 1
                }}>
                  {setsDone === ex.sets.length ? '\u{2705} ' : ''}{exInfo?.name || 'Ex'} ({setsDone}/{ex.sets.length})
                </button>
              );
            })}
          </div>
        </div>
        <div className="gym-sidebar desktop-only" style={{ width: 280, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, background: COLORS.card, alignSelf: 'stretch' }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ejercicios</div>
          {exState.map((ex, i) => {
            const exInfo = getEx(ex.eid || ex.exerciseId);
            const setsDone = ex.sets.filter(s => s.completed).length;
            return <button key={i} onClick={() => goToExercise(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: 'none', background: i === activeExIdx ? COLORS.primary + '15' : 'transparent', color: COLORS.text, cursor: 'pointer', textAlign: 'left', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
              <span>{setsDone === ex.sets.length ? '\u{2705}' : i === activeExIdx ? '\u{1F3CB}\u{FE0F}' : '\u{25CB}'}</span>
              <span style={{ flex: 1, textDecoration: setsDone === ex.sets.length ? 'line-through' : 'none', opacity: setsDone === ex.sets.length ? 0.6 : 1 }}>{exInfo?.name || 'Ejercicio'}</span>
              <span style={{ fontSize: 10, color: COLORS.textDim }}>{setsDone}/{ex.sets.length}</span>
            </button>;
          })}
        </div>
      </div>

      {showAddEx && <WorkoutExerciseAdder workoutData={workoutData} onUpdateData={onUpdateData} onAdd={(eid) => { setExState(x => [...x, { exerciseId: eid, eid, rest: 90, sets: [{ setNumber: 1, reps: 10, weight: 0, completed: false, isPersonalRecord: false }] }]); setShowAddEx(false); }} onClose={() => setShowAddEx(false)} />}
      {showFitnessToast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 2001, background: COLORS.card, border: `1px solid ${COLORS.success}40`, borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, animation: 'slideIn 0.3s ease-out' }}>
          <span>{'\u{1F4AA}'} ¿Marcar tu hábito de fitness como completado hoy?</span>
          <button onClick={() => { onCompleteHabit('h2'); setShowFitnessToast(false); }} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: COLORS.success, color: '#000', cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>Sí</button>
          <button onClick={() => setShowFitnessToast(false)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: 'transparent', color: COLORS.textDim, cursor: 'pointer', fontSize: 12, fontFamily: "'Inter', sans-serif" }}>No</button>
        </div>
      )}
    </div>
  );
};

const WorkoutExerciseAdder = ({ workoutData, onAdd, onClose, onUpdateData }) => {
  const [search, setSearch] = useState('');
  const [mgFilter, setMgFilter] = useState('all');
  const [customName, setCustomName] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const mgs = [...new Set(workoutData.exercises.map(e => e.mg))];
  const filtered = workoutData.exercises.filter(e => (mgFilter === 'all' || e.mg === mgFilter) && e.name.toLowerCase().includes(search.toLowerCase()));
  const addCustom = () => {
    if (!customName.trim()) return;
    const newEx = { id: `ex_custom_${Date.now()}`, name: customName.trim(), mg: 'Full Body', type: 'fuerza', equip: 'Peso Corporal', custom: true };
    onUpdateData(wd => ({ ...wd, exercises: [...wd.exercises, newEx] }));
    setCustomName('');
    setShowCustom(false);
  };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2100, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24, maxWidth: 480, width: '90%', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 16, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 16 }}>Añadir Ejercicio</div>
        {!showCustom && (
          <button onClick={() => setShowCustom(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: `${COLORS.primary}10`, border: `1px dashed ${COLORS.primary}40`, cursor: 'pointer', borderRadius: 10, color: COLORS.primary, fontSize: 13, fontFamily: "'Inter', sans-serif", textAlign: 'left', marginBottom: 12 }}>
            <Sparkles size={16} /> Personalizar ejercicio
          </button>
        )}
        {showCustom && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input value={customName} onChange={e => setCustomName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustom()} placeholder="Nombre del ejercicio" autoFocus style={{ flex: 1, padding: '10px 14px', background: COLORS.bg, border: `1px solid ${COLORS.primary}`, borderRadius: 10, color: COLORS.text, fontSize: 13, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
            <button onClick={addCustom} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: COLORS.primary, color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>Añadir</button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setMgFilter('all')} style={{ padding: '4px 12px', borderRadius: 12, border: 'none', background: mgFilter === 'all' ? COLORS.primary : COLORS.bg, color: mgFilter === 'all' ? '#fff' : COLORS.textDim, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>Todos</button>
          {mgs.map(mg => <button key={mg} onClick={() => setMgFilter(mg)} style={{ padding: '4px 12px', borderRadius: 12, border: 'none', background: mgFilter === mg ? MUSCLE_COLORS[mg] || COLORS.primary : COLORS.bg, color: mgFilter === mg ? '#fff' : COLORS.textDim, cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif" }}>{mg}</button>)}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." style={{ width: '100%', padding: '8px 12px', background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13, marginBottom: 12, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{filtered.map(e => <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><button onClick={() => onAdd(e.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer', color: COLORS.text, fontSize: 13, fontFamily: "'Inter', sans-serif", textAlign: 'left' }}><Plus size={14} color={COLORS.primary} />{e.name} <span style={{ fontSize: 10, color: COLORS.textDim }}>- {e.mg}</span></button>{e.custom && <button onClick={() => onUpdateData(wd => ({ ...wd, exercises: wd.exercises.filter(x => x.id !== e.id) }))} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', color: COLORS.alert, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, flexShrink: 0 }}><Trash2 size={12} /></button>}</div>)}</div>
      </div>
    </div>
  );
};

const WorkoutCalTab = ({ workoutData }) => {
  const { sessions } = workoutData;
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const ds = toYYYYMMDD(new Date(currentYear, currentMonth, d));
    const session = sessions.find(s => s.date === ds);
    return { day: d, dateStr: ds, session };
  });

  const daysWithSessions = days.filter(d => d.session);
  const thisMonthSessions = sessions.filter(s => s.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`));
  const totalVol = thisMonthSessions.reduce((s, x) => s + x.totalVolume, 0);
  const mgCount = {};
  thisMonthSessions.forEach(s => s.exercises?.forEach(e => { if (e.muscleGroup) { mgCount[e.muscleGroup] = (mgCount[e.muscleGroup] || 0) + 1; } }));
  const topMg = Object.entries(mgCount).sort((a, b) => b[1] - a[1])[0];

  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'sáb'];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
    else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
    else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer' }}><ChevronLeft size={20} /></button>
          <div style={{ fontSize: 16, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>{monthNames[currentMonth]} {currentYear}</div>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer' }}><ChevronRight size={20} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
          {dayLabels.map(d => <div key={d} style={{ fontSize: 10, color: COLORS.textDim, textAlign: 'center', padding: '4px 0' }}>{d}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
          {days.map(d => {
            const isToday = d.dateStr === toYYYYMMDD(new Date());
            return <div key={d.day} onClick={() => d.session && setSelectedDay(d.session)} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: d.session ? MUSCLE_COLORS[d.session.exercises?.[0]?.muscleGroup] || COLORS.primary : 'transparent', cursor: d.session ? 'pointer' : 'default', border: isToday ? `2px solid ${COLORS.primary}` : 'none', fontSize: 12, color: d.session ? '#000' : COLORS.textDim, fontFamily: "'Inter', sans-serif", fontWeight: d.session ? 600 : 400 }}>{d.day}</div>;
          })}
        </div>
      </div>

      {selectedDay && (
        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20, marginBottom: 24, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 16, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>{selectedDay.routineName}</div>
            <div style={{ fontSize: 12, color: COLORS.textDim, fontFamily: "'Inter', sans-serif" }}>{selectedDay.date} - {selectedDay.durationMinutes} min</div>
          </div>
          {selectedDay.exercises?.map((ex, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}><span>{ex.exerciseName}</span><span style={{ color: COLORS.textDim }}>{ex.sets?.length} sets</span></div>)}
          <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 8 }}>Volumen: {selectedDay.totalVolume} kg - Series: {selectedDay.totalSets}</div>
          {selectedDay.notes && <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4, fontStyle: 'italic' }}>"{selectedDay.notes}"</div>}
        </div>
      )}

      <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20 }}>
        <div style={{ fontSize: 14, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 12 }}>Resumen del Mes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: '12px', textAlign: 'center' }}><div style={{ fontSize: 24, color: COLORS.primary, fontFamily: "'Inter', sans-serif" }}>{thisMonthSessions.length}</div><div style={{ fontSize: 10, color: COLORS.textDim }}>Sesiones</div></div>
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: '12px', textAlign: 'center' }}><div style={{ fontSize: 24, color: COLORS.success, fontFamily: "'Inter', sans-serif" }}>{totalVol > 999 ? `${(totalVol / 1000).toFixed(1)}k` : totalVol}</div><div style={{ fontSize: 10, color: COLORS.textDim }}>Volumen (kg)</div></div>
          <div style={{ background: COLORS.bg, borderRadius: 8, padding: '12px', textAlign: 'center' }}><div style={{ fontSize: 24, color: COLORS.alert, fontFamily: "'Inter', sans-serif" }}>{topMg?.[0] || '--'}</div><div style={{ fontSize: 10, color: COLORS.textDim }}>Grupo + Entrenado</div></div>
        </div>
      </div>
    </div>
  );
};

const WorkoutProgTab = ({ workoutData }) => {
  const { exercises, sessions } = workoutData;
  const [selectedEx, setSelectedEx] = useState(exercises[0]?.id || '');
  const exData = sessions.filter(s => s.exercises?.some(e => e.exerciseId === selectedEx)).sort((a, b) => a.date.localeCompare(b.date));
  const chartData = exData.map(s => {
    const ex = s.exercises.find(e => e.exerciseId === selectedEx);
    const maxSet = ex?.sets?.reduce((best, set) => set.weight > best.weight ? set : best, { weight: 0, reps: 0 }) || { weight: 0, reps: 0 };
    return { date: s.date.slice(5), maxWeight: maxSet.weight, reps: maxSet.reps, rm: calcRM(maxSet.weight, maxSet.reps), volume: ex?.sets?.reduce((t, set) => t + set.weight * set.reps, 0) || 0 };
  });
  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const end = new Date(); end.setDate(end.getDate() - i * 7); const start = new Date(end); start.setDate(start.getDate() - 6);
    const weekSessions = sessions.filter(s => s.date >= toYYYYMMDD(start) && s.date <= toYYYYMMDD(end));
    return { week: `S${8 - i}`, sessions: weekSessions.length, volume: weekSessions.reduce((t, s) => t + Number(s.totalVolume || 0), 0), duration: weekSessions.reduce((t, s) => t + Number(s.duration || 0), 0) };
  }).reverse();
  const totalVolume = sessions.reduce((t, s) => t + Number(s.totalVolume || 0), 0);
  const totalDuration = sessions.reduce((t, s) => t + Number(s.duration || 0), 0);
  const totalExerciseLogs = sessions.reduce((t, s) => t + (s.exercises?.length || 0), 0);
  const trainedExercises = new Set(sessions.flatMap(s => s.exercises?.map(e => e.exerciseId) || [])).size;

  const allPRs = sessions.flatMap(s => s.exercises?.flatMap(e => (e.sets || []).filter(x => x.isPersonalRecord).map(x => ({ ...x, exName: e.exerciseName, date: s.date }))) || []).sort((a, b) => b.date.localeCompare(a.date));
  const isNewPR = (d) => Math.abs((new Date(d) - new Date()) / (1000 * 60 * 60 * 24)) <= 7;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Sesiones totales', value: sessions.length, color: COLORS.primary },
          { label: 'Volumen general', value: totalVolume > 999 ? `${(totalVolume / 1000).toFixed(1)}k kg` : `${totalVolume} kg`, color: COLORS.success },
          { label: 'Tiempo entrenado', value: `${Math.round(totalDuration / 60)} min`, color: COLORS.alert },
          { label: 'Ejercicios tocados', value: `${trainedExercises}/${exercises.length}`, color: '#ffd93d' }
        ].map(item => (
          <div key={item.label} style={{ background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: 16 }}>
            <div style={{ color: COLORS.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{item.label}</div>
            <div style={{ color: item.color, fontSize: 24, fontWeight: 900, fontFamily: "'Inter', sans-serif" }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 16, color: COLORS.text, marginBottom: 12, fontFamily: "'DM Serif Display', serif" }}>Progreso general</div>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={weeklyData}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: COLORS.textDim }} />
            <YAxis tick={{ fontSize: 10, fill: COLORS.textDim }} />
            <Tooltip />
            <Bar dataKey="sessions" name="Sesiones" fill={COLORS.primary} radius={[5, 5, 0, 0]} />
            <Bar dataKey="volume" name="Volumen" fill={COLORS.success} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ color: COLORS.textDim, fontSize: 11, marginTop: 8 }}>Registros de ejercicios guardados: {totalExerciseLogs}</div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: COLORS.textDim, fontFamily: "'Inter', sans-serif" }}>Ejercicio:</span>
        <select value={selectedEx} onChange={e => setSelectedEx(e.target.value)} style={{ padding: '8px 14px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.text, fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none' }}>
          {exercises.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {chartData.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20 }}>
              <div style={{ fontSize: 14, color: COLORS.text, marginBottom: 12, fontFamily: "'DM Serif Display', serif" }}>Progresión de Peso Máximo</div>
              <ResponsiveContainer width="100%" height={250}><LineChart data={chartData}><XAxis dataKey="date" tick={{ fontSize: 10, fill: COLORS.textDim }} /><YAxis tick={{ fontSize: 10, fill: COLORS.textDim }} /><Tooltip /><defs><linearGradient id="rmGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.3} /><stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} /></linearGradient></defs><Line type="monotone" dataKey="rm" stroke={COLORS.primary} strokeWidth={2} dot={{ fill: COLORS.primary, r: 4 }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer>
            </div>
            <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20 }}>
              <div style={{ fontSize: 14, color: COLORS.text, marginBottom: 12, fontFamily: "'DM Serif Display', serif" }}>Volumen por Sesión</div>
              <ResponsiveContainer width="100%" height={250}><BarChart data={chartData}><XAxis dataKey="date" tick={{ fontSize: 10, fill: COLORS.textDim }} /><YAxis tick={{ fontSize: 10, fill: COLORS.textDim }} /><Tooltip /><defs><linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.secondary} stopOpacity={0.8} /><stop offset="100%" stopColor={COLORS.secondary} stopOpacity={0.3} /></linearGradient></defs><Bar dataKey="volume" fill="url(#volGrad)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
            </div>
          </div>
          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 14, color: COLORS.text, marginBottom: 12, fontFamily: "'DM Serif Display', serif" }}>Frecuencia Semanal</div>
            <ResponsiveContainer width="100%" height={200}><BarChart data={weeklyData}><XAxis dataKey="week" tick={{ fontSize: 10, fill: COLORS.textDim }} /><YAxis tick={{ fontSize: 10, fill: COLORS.textDim }} /><Tooltip /><Bar dataKey="sessions" fill={COLORS.primary} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
          </div>
        </>
        ) : <EmptyState icon={'\u{1F3CB}\u{FE0F}'} title="Sin datos de entrenos" subtitle="Registra sesiones para ver tu progreso aquí" compact />}

      <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 16, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 16 }}>{'\u{1F3C6}'} Récords Personales</div>
        {allPRs.length > 0 ? <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ borderBottom: `1px solid ${COLORS.border}` }}><th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, color: COLORS.textDim }}>EJERCICIO</th><th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 10, color: COLORS.textDim }}>PESO</th><th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 10, color: COLORS.textDim }}>REPS</th><th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 10, color: COLORS.textDim }}>1RM EST.</th><th style={{ textAlign: 'center', padding: '8px 12px', fontSize: 10, color: COLORS.textDim }}>FECHA</th></tr></thead><tbody>{allPRs.map((pr, i) => <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}><td style={{ padding: '8px 12px', fontSize: 12, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>{pr.exName} {isNewPR(pr.date) && <span style={{ fontSize: 9, background: COLORS.alert, color: '#fff', padding: '1px 6px', borderRadius: 4, marginLeft: 4 }}>NUEVO</span>}</td><td style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>{pr.weight} kg</td><td style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, color: COLORS.textDim, fontFamily: "'Inter', sans-serif" }}>{pr.reps}</td><td style={{ textAlign: 'center', padding: '8px 12px', fontSize: 12, color: COLORS.primary, fontFamily: "'Inter', sans-serif" }}>{calcRM(pr.weight, pr.reps)} kg</td><td style={{ textAlign: 'center', padding: '8px 12px', fontSize: 11, color: COLORS.textDim, fontFamily: "'Inter', sans-serif" }}>{pr.date}</td></tr>)}</tbody></table></div> : <div style={{ textAlign: 'center', padding: 20, color: COLORS.textDim }}>Aún no hay récords personales. ¡A darle!</div>}
      </div>

      <div className="stats-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16, textAlign: 'center' }}><div style={{ fontSize: 28, color: COLORS.primary, fontFamily: "'Inter', sans-serif" }}>{sessions.length}</div><div style={{ fontSize: 11, color: COLORS.textDim }}>Sesiones Registradas</div></div>
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16, textAlign: 'center' }}><div style={{ fontSize: 28, color: COLORS.success, fontFamily: "'Inter', sans-serif" }}>{sessions.reduce((t, s) => t + s.totalVolume, 0) > 999 ? `${(sessions.reduce((t, s) => t + s.totalVolume, 0) / 1000).toFixed(1)}k` : sessions.reduce((t, s) => t + s.totalVolume, 0)}</div><div style={{ fontSize: 11, color: COLORS.textDim }}>Volumen Total (kg)</div></div>
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16, textAlign: 'center' }}><div style={{ fontSize: 28, color: COLORS.alert, fontFamily: "'Inter', sans-serif" }}>{exercises.reduce((best, e) => { const c = sessions.filter(s => s.exercises?.some(x => x.exerciseId === e.id)).length; return c > best.count ? { count: c, name: e.name } : best; }, { count: 0, name: '--' }).name}</div><div style={{ fontSize: 11, color: COLORS.textDim }}>Ejercicio + Frecuente</div></div>
        <div style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 16, textAlign: 'center' }}><div style={{ fontSize: 28, color: '#ffd93d', fontFamily: "'Inter', sans-serif" }}>{Object.entries(sessions.flatMap(s => s.exercises?.map(e => e.muscleGroup) || []).reduce((acc, mg) => { acc[mg] = (acc[mg] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || '--'}</div><div style={{ fontSize: 11, color: COLORS.textDim }}>Músculo + Entrenado</div></div>
      </div>
    </div>
  );
};

const AGENDA_CATEGORIES = ['Personal', 'Trabajo', 'Salud', 'Finanzas', 'Estudios', 'Hogar', 'Social', 'Trading', 'Otro'];
const PRIORITY_LABELS = { 1: 'P1', 2: 'P2', 3: 'P3', 4: 'P4' };
const PRIORITY_COLORS = { 1: '#ff6b6b', 2: '#ff9f43', 3: '#e11d48', 4: '#8888a0' };
const STATUS_LABELS = { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completada', postponed: 'Pospuesta', cancelled: 'Cancelada' };
const STATUS_COLORS = { pending: COLORS.textDim, in_progress: COLORS.primary, completed: COLORS.success, postponed: '#ffd93d', cancelled: '#666' };
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
const SECTION_LABELS = { morning: '\u{1F305} Mañana', afternoon: '\u{2600}\u{FE0F} Tarde', evening: '\u{1F319} Noche' };
const SECTION_HOURS = { morning: [6, 7, 8, 9, 10, 11], afternoon: [12, 13, 14, 15, 16, 17], evening: [18, 19, 20, 21, 22, 23] };
const RECURRENCE_TYPES = [
  { id: 'none', label: 'No repetir' }, { id: 'daily', label: 'Cada día' },
  { id: 'weekdays', label: 'Lun - Vie' }, { id: 'weekends', label: 'Fines de semana' },
  { id: 'weekly', label: 'Semanal' }, { id: 'biweekly', label: 'Cada 2 semanas' },
  { id: 'monthly', label: 'Mensual' }, { id: 'yearly', label: 'Anual' },
  { id: 'custom', label: 'Personalizado' }
];
const REMINDER_OPTIONS = [
  { id: 'exact', label: 'A la hora exacta', mins: 0 },
  { id: '5min', label: '5 minutos antes', mins: 5 },
  { id: '10min', label: '10 minutos antes', mins: 10 },
  { id: '15min', label: '15 minutos antes', mins: 15 },
  { id: '30min', label: '30 minutos antes', mins: 30 },
  { id: '1hour', label: '1 hora antes', mins: 60 },
  { id: '1day', label: '1 día antes', mins: 1440 }
];
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const timeToHour = (t) => { if (!t) return -1; const [h] = t.split(':').map(Number); return h; };
const timeToMinutes = (t) => { if (!t) return 0; const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const minutesToTime = (mins) => { const h = Math.floor(mins / 60); const m = mins % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; };

const getWeekDays = (date) => {
  const start = new Date(date); start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

const getMonthGrid = (date) => {
  const year = date.getFullYear(); const month = date.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first); start.setDate(start.getDate() - start.getDay());
  const weeks = [];
  let current = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) { week.push(new Date(current)); current.setDate(current.getDate() + 1); }
    weeks.push(week);
    if (current.getMonth() !== month && w >= 3) break;
  }
  return weeks;
};

const formatTime = (t) => { if (!t) return ''; const [h, m] = t.split(':').map(Number); return `${h}:${String(m).padStart(2, '0')}`; };

const getTodayTasks = (agenda) => Object.values(agenda || {}).flat();

const parseNaturalInput = (text, defaultDate) => {
  let clean = text;
  let priority = 3, category = 'Personal', dueDate = defaultDate, startTime = '';
  let recurrence = 'none', hasAlarm = false;
  const pMatch = clean.match(/\bp([1-4])\b/i);
  if (pMatch) { priority = parseInt(pMatch[1]); clean = clean.replace(pMatch[0], '').trim(); }
  const catMatch = clean.match(/@(\w+)/);
  if (catMatch) {
    const found = AGENDA_CATEGORIES.find(c => c.toLowerCase().startsWith(catMatch[1].toLowerCase()));
    if (found) category = found;
    clean = clean.replace(catMatch[0], '').trim();
  }
  const timeMatch = clean.match(/\b(\d{1,2}):(\d{2})\b/);
  if (timeMatch) { startTime = timeMatch[0]; clean = clean.replace(timeMatch[0], '').trim(); }
  const today = toYYYYMMDD(new Date());
  if (/\bpasado mañana\b/i.test(clean)) { dueDate = toYYYYMMDD(new Date(Date.now() + 2 * 86400000)); clean = clean.replace(/\bpasado mañana\b/i, '').trim(); }
  else if (/\bmañana\b/i.test(clean)) { dueDate = toYYYYMMDD(new Date(Date.now() + 86400000)); clean = clean.replace(/\bmañana\b/i, '').trim(); }
  else if (/\bhoy\b/i.test(clean)) { dueDate = today; clean = clean.replace(/\bhoy\b/i, '').trim(); }
  else {
    const dmMatch = clean.match(/\b(\d{1,2})[\/-](\d{1,2})\b/);
    if (dmMatch) { const d = new Date(); d.setMonth(parseInt(dmMatch[2]) - 1, parseInt(dmMatch[1])); dueDate = toYYYYMMDD(d); clean = clean.replace(dmMatch[0], '').trim(); }
  }
  if (/\balarma\b|\brecordatorio\b/i.test(clean)) { hasAlarm = true; clean = clean.replace(/\balarma\b|\brecordatorio\b/ig, '').trim(); }
  if (/\bfines? de semana\b/i.test(clean)) { recurrence = 'weekends'; clean = clean.replace(/\bfines? de semana\b/ig, '').trim(); }
  else if (/\bd[i]as? laborables\b|\blun\s*-\s*vie\b/i.test(clean)) { recurrence = 'weekdays'; clean = clean.replace(/\bd[i]as? laborables\b|\blun\s*-\s*vie\b/ig, '').trim(); }
  else if (/\bsemanal\b/i.test(clean)) { recurrence = 'weekly'; clean = clean.replace(/\bsemanal\b/ig, '').trim(); }
  else if (/\bmensual\b/i.test(clean)) { recurrence = 'monthly'; clean = clean.replace(/\bmensual\b/ig, '').trim(); }
  else if (/\banual\b/i.test(clean)) { recurrence = 'yearly'; clean = clean.replace(/\banual\b/ig, '').trim(); }
  else if (/\bdiari[oa]\b|\brepetir\b|\brecurren\b|\bcada\b/i.test(clean)) { recurrence = 'daily'; clean = clean.replace(/\bdiari[oa]\b|\brepetir\b|\brecurren\b|\bcada\b/ig, '').trim(); }
  return { text: clean.trim(), priority, category, dueDate, startTime, recurrence, hasAlarm };
};

const formatDuration = (start, end) => {
  if (!start || !end) return '';
  const s = timeToMinutes(start), e = timeToMinutes(end);
  if (e <= s) return '';
  const diff = e - s;
  const h = Math.floor(diff / 60), m = diff % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

const getFreeBlocks = (tasks, dateStr) => {
  const todayTasks = tasks.filter(t => t.dueDate === dateStr && t.startTime && t.endTime && !t.completed)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  const blocks = [];
  let cursor = 6 * 60;
  todayTasks.forEach(t => {
    const s = timeToMinutes(t.startTime);
    if (s > cursor) blocks.push({ start: cursor, end: s });
    const e = timeToMinutes(t.endTime);
    if (e > cursor) cursor = e;
  });
  if (cursor < 23 * 60) blocks.push({ start: cursor, end: 23 * 60 });
  return blocks;
};

const generateRecurrenceDates = (task, fromDate, count = 90) => {
  if (!task.recurrence || task.recurrence === 'none') return [];
  const dates = [];
  const start = new Date(fromDate + 'T12:00:00');
  const r = task.recurrence;
  for (let i = 0; i < count; i++) {
    const d = new Date(start); d.setDate(d.getDate() + i);
    const ds = toYYYYMMDD(d);
    if (r === 'daily') dates.push(ds);
    else if (r === 'weekdays' && d.getDay() >= 1 && d.getDay() <= 5) dates.push(ds);
    else if (r === 'weekends' && (d.getDay() === 0 || d.getDay() === 6)) dates.push(ds);
    else if (r === 'weekly' && d.getDay() === start.getDay()) dates.push(ds);
    else if (r === 'biweekly' && d.getDay() === start.getDay() && (i % 14 === 0)) dates.push(ds);
    else if (r === 'monthly' && d.getDate() === start.getDate()) dates.push(ds);
    else if (r === 'yearly' && d.getMonth() === start.getMonth() && d.getDate() === start.getDate()) dates.push(ds);
    else if (r === 'custom' && task.recurrenceDays?.includes(d.getDay())) dates.push(ds);
  }
  return dates;
};

const AgendaView = ({ data, onUpdateAgenda, onUpdateAgendaNote, onUpdateAgendaTodos, onUpdateAgendaTodoLabels, onMoveTaskToDate, onCompleteHabit }) => {
  const { habits, records, agenda = {}, agendaNotes = {}, agendaTodos = {}, agendaTodoLabels = [] } = data;
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState('day');
  const [inputPrio, setInputPrio] = useState(3);
  const [hideDone, setHideDone] = useState(false);
  const [dragTaskId, setDragTaskId] = useState(null);
  const [dropHour, setDropHour] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModalTask, setEditModalTask] = useState(null);
  const [sidebarTab, setSidebarTab] = useState('unscheduled');
  const [filterPrio, setFilterPrio] = useState(0);
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlanner, setShowPlanner] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [quickText, setQuickText] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dayLayout, setDayLayout] = useState('list');
  const [sidePanel, setSidePanel] = useState('notes');
  const [todoText, setTodoText] = useState('');
  const [todoLabel, setTodoLabel] = useState('');
  const [newTodoLabel, setNewTodoLabel] = useState('');
  const [showTodoLabels, setShowTodoLabels] = useState(false);
  const [editingTodoLabelId, setEditingTodoLabelId] = useState(null);
  const dragRef = useRef(null);

  const s = { fontFamily: "'Inter', sans-serif" };
  const dateStr = toYYYYMMDD(currentDate);
  const todayStr = toYYYYMMDD(new Date());
  const isToday = dateStr === todayStr;
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const monthGrid = useMemo(() => getMonthGrid(currentDate), [currentDate]);

  const expandedAgenda = useMemo(() => {
    const result = {};
    Object.entries(agenda || {}).forEach(([ds, tasks]) => {
      result[ds] = [...tasks];
      tasks.forEach(task => {
        if (task.recurrence && task.recurrence !== 'none') {
          const dates = generateRecurrenceDates(task, task.dueDate || ds, 90);
          dates.forEach(d => {
            if (d !== (task.dueDate || ds)) {
              if (!result[d]) result[d] = [];
              if (!result[d].some(e => e.id === task.id)) result[d].push({ ...task, dueDate: d });
            }
          });
        }
      });
    });
    return result;
  }, [agenda]);

  const tasks = useMemo(() => {
    return (expandedAgenda[dateStr] || []).map(t => ({ ...t, dueDate: t.dueDate || dateStr, dueTime: t.dueTime || t.time || '' }))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [agenda, dateStr]);

  const dayHabits = useMemo(() => {
    return habits.filter(h => h.active && isExpectedDay(h, dateStr)).map(h => {
      const rec = records.find(r => r.habitId === h.id && r.date === dateStr);
      const cat = getCategoryInfo(h.category);
      return { ...h, completed: rec ? rec.completed : false, skipped: rec ? rec.skipped : false, categoryInfo: cat };
    });
  }, [habits, records, dateStr]);

  const timedTasks = useMemo(() => tasks.filter(t => t.dueTime && (!hideDone || !t.completed)), [tasks, hideDone]);
  const untimedTasks = useMemo(() => tasks.filter(t => !t.dueTime && (!hideDone || !t.completed)), [tasks, hideDone]);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const overdueCount = Object.entries(expandedAgenda || {}).filter(([d]) => d < todayStr).flatMap(([, ts]) => ts.filter(t => !t.completed)).length;
  const alarmCount = tasks.filter(t => t.alarm && !t.completed).length;
  const busyMins = timedTasks.filter(t => !t.completed).reduce((acc, t) => acc + (t.endTime ? timeToMinutes(t.endTime) - timeToMinutes(t.dueTime) : 30), 0);
  const freeMins = Math.max(0, 17 * 60 - busyMins);

  const updateTasks = useCallback((updater) => { onUpdateAgenda(dateStr, updater); }, [dateStr, onUpdateAgenda]);

  const goPrev = () => {
    if (viewMode === 'month') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    else if (viewMode === 'week') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
    else setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
  };
  const goNext = () => {
    if (viewMode === 'month') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    else if (viewMode === 'week') setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
    else setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
  };
  const goToday = () => setCurrentDate(new Date());

  const addTask = (text, priority, category, dueDateParam, dueTime, extras) => {
    const t = text;
    if (!t.trim()) return;
    const targetDate = dueDateParam || dateStr;
    onUpdateAgenda(targetDate, prev => {
      const newTask = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 4),
        text: t.trim(), completed: false, priority: priority || inputPrio,
        category: category || 'Personal', note: '', dueDate: targetDate,
        dueTime: dueTime || '', alarm: false, recurrence: 'none',
        reminders: [], subtasks: [], tags: [], ...extras, order: prev.length
      };
      return [...prev, newTask];
    });
    if (targetDate !== dateStr) setCurrentDate(new Date(targetDate + 'T12:00:00'));
  };

  const handleQuickAdd = () => {
    const parsed = parseNaturalInput(quickText, dateStr);
    if (!parsed.text) return;
    if (parsed.hasAlarm) requestHabitFlowNotifications();
    addTask(parsed.text, parsed.priority, parsed.category, parsed.dueDate, parsed.startTime, {
      alarm: parsed.hasAlarm,
      recurrence: parsed.recurrence,
      reminders: parsed.hasAlarm ? ['exact'] : []
    });
    setQuickText('');
  };

  const toggleTask = (taskId) => { updateTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)); };
  const deleteTask = (taskId) => { updateTasks(prev => prev.filter(t => t.id !== taskId)); };
  const updateTaskField = (taskId, field, value) => { updateTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t)); };
  const removeTaskTime = (taskId) => { updateTasks(prev => prev.map(t => t.id === taskId ? { ...t, dueTime: '' } : t)); };
  const startEdit = (task) => { setEditTaskId(task.id); setEditText(task.text); };
  const saveEdit = () => { if (editTaskId && editText.trim()) updateTaskField(editTaskId, 'text', editText.trim()); setEditTaskId(null); };
  const toggleExpand = (taskId) => { setExpandedTaskId(expandedTaskId === taskId ? null : taskId); setEditTaskId(null); };
  const openTaskModal = (task) => { setEditModalTask(task ? { ...JSON.parse(JSON.stringify(task)), _originalDueDate: task.dueDate || '' } : null); setShowModal(true); };
  const closeTaskModal = () => { setShowModal(false); setEditModalTask(null); setShowDatePicker(false); setShowTimePicker(false); setNewSubtask(''); };
  const addModalSubtask = () => {
    if (!newSubtask.trim()) return;
    setEditModalTask(prev => ({ ...prev, subtasks: [...(prev?.subtasks || []), { text: newSubtask.trim(), completed: false }] }));
    setNewSubtask('');
  };
  const saveTaskModal = () => {
    const task = editModalTask;
    if (!task || !task.text?.trim()) { closeTaskModal(); return; }
    if (task.id) {
      const origDate = task._originalDueDate || dateStr;
      Object.entries({ text: task.text, dueTime: task.dueTime, priority: task.priority, category: task.category, alarm: task.alarm, note: task.note, recurrence: task.recurrence, recurrenceDays: task.recurrenceDays, reminders: task.reminders, subtasks: task.subtasks, tags: task.tags, status: task.status }).forEach(([k, v]) => updateTaskField(task.id, k, v));
      if (task.dueDate && task.dueDate !== origDate) {
        onMoveTaskToDate(task.id, origDate, task.dueDate);
      }
    } else {
      addTask(task.text, task.priority || 3, task.category || 'Personal', task.dueDate || dateStr, task.dueTime || '', { alarm: task.alarm, recurrence: task.recurrence, recurrenceDays: task.recurrenceDays, note: task.note, reminders: task.reminders, subtasks: task.subtasks, tags: task.tags, status: task.status });
    }
    closeTaskModal();
  };

  const handleDueDateChange = (taskId, newDate) => {
    if (!newDate) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task || newDate === task.dueDate) return;
    onMoveTaskToDate(taskId, dateStr, newDate);
    setExpandedTaskId(null);
  };

  const handleDragStart = (e, taskId) => { dragRef.current = taskId; setDragTaskId(taskId); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', taskId); };
  const handleDragEnd = () => { setDragTaskId(null); setDropHour(null); };
  const handleDropOnHour = (hour) => { const id = dragRef.current; if (id) { updateTaskField(id, 'dueTime', `${String(hour).padStart(2,'0')}:00`); setDragTaskId(null); setDropHour(null); } };

  const getFilteredAgenda = (agendaObj) => {
    return Object.entries(agendaObj || {}).map(([date, ts]) => [date, ts.filter(t => {
      if (searchQuery && !t.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterStatus === 'pending' && t.completed) return false;
      if (filterStatus === 'done' && !t.completed) return false;
      if (filterPrio > 0 && (t.priority || 3) !== filterPrio) return false;
      if (filterCat && t.category !== filterCat) return false;
      return true;
    })]).filter(([_, ts]) => ts.length > 0);
  };

  const getOverdueTasks = () => Object.entries(expandedAgenda || {}).filter(([d]) => d < todayStr).flatMap(([, ts]) => ts.filter(t => !t.completed));
  const getUpcomingTasks = () => Object.entries(expandedAgenda || {}).filter(([d]) => d >= todayStr).flatMap(([, ts]) => ts.filter(t => !t.completed)).sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || '')).slice(0, 3);
  const getAlarmTasks = () => tasks.filter(t => t.alarm && !t.completed);

  const btnBase = { border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.15s' };
  const TASK_BLOCK_COLORS = { 1: { bg: '#ff6b6b18', border: '#ff6b6b', text: '#ff6b6b' }, 2: { bg: '#ff9f4318', border: '#ff9f43', text: '#ff9f43' }, 3: { bg: '#e11d4818', border: '#e11d48', text: '#e11d48' }, 4: { bg: '#8888a015', border: '#8888a0', text: '#8888a0' } };

  const renderStatsCards = () => {
    const cards = [
      { label: 'Pendientes', value: totalCount - completedCount, color: COLORS.primary, icon: <List size={14} /> },
      { label: 'Completadas', value: completedCount, color: COLORS.success, icon: <Check size={14} /> },
      { label: 'Vencidas', value: overdueCount, color: COLORS.alert, icon: <AlertTriangle size={14} /> },
      { label: 'Alertas', value: alarmCount, color: '#ffd93d', icon: <Clock size={14} /> },
      { label: 'Ocupado', value: busyMins >= 60 ? `${Math.round(busyMins/60)}h` : `${busyMins}m`, color: COLORS.secondary, icon: <Calendar size={14} /> },
      { label: 'Libre', value: freeMins >= 60 ? `${Math.round(freeMins/60)}h` : `${freeMins}m`, color: COLORS.textDim, icon: <Sparkles size={14} /> }
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 12 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: `linear-gradient(135deg, ${COLORS.card}, ${COLORS.surface})`, borderRadius: 12,
            border: `1px solid ${COLORS.border}`, padding: '10px 12px', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -8, right: -8, width: 40, height: 40, borderRadius: '50%', background: `${c.color}08`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: c.color }}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{c.value}</div>
              <span className="fire-emoji" style={{ opacity: 0.75 }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: 9, color: COLORS.textDim, ...s }}>{c.label}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderTaskBlock = (task, opts = {}) => {
    const { compact, mini, hideTime, noDrag, onClick } = opts;
    const pc = TASK_BLOCK_COLORS[task.priority || 3];
    return (
      <div className={compact ? 'agenda-task-block compact' : 'agenda-task-block'} key={task.id} {...(!noDrag ? { draggable: true, onDragStart: e => handleDragStart(e, task.id), onDragEnd: handleDragEnd } : {})}
        onClick={e => { e.stopPropagation(); if (onClick) onClick(task); }} style={{
          padding: compact ? '5px 8px' : '8px 10px', borderRadius: 8, marginBottom: compact ? 3 : 5,
          background: task.completed ? `${COLORS.success}06` : dragTaskId === task.id ? `${COLORS.primary}12` : pc.bg,
          border: `1px solid ${dragTaskId === task.id ? `${COLORS.primary}50` : task.completed ? `${COLORS.success}15` : 'transparent'}`,
          borderLeft: `3px solid ${task.completed ? COLORS.success : pc.border}`,
          cursor: noDrag ? 'pointer' : 'grab', opacity: task.completed ? 0.5 : 1,
          transition: 'all 0.15s', boxShadow: dragTaskId === task.id ? `0 4px 16px ${COLORS.primary}20` : 'none'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 5 : 8 }}>
          <button className="agenda-timeline-check" onClick={e => { e.stopPropagation(); toggleTask(task.id); }}
            style={{ width: compact ? 16 : 18, height: compact ? 16 : 18, borderRadius: '50%', border: 'none', flexShrink: 0,
              background: task.completed ? COLORS.success : 'transparent',
              border: task.completed ? 'none' : `2px solid ${COLORS.textDim}40`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {task.completed && <Check size={compact ? 7 : 9} color="#0a0a0f" strokeWidth={4} />}
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: compact ? 10 : 12, color: task.completed ? COLORS.textDim : COLORS.text,
              textDecoration: task.completed ? 'line-through' : 'none', fontWeight: task.completed ? 400 : 500,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...s
            }} onDoubleClick={e => { e.stopPropagation(); startEdit(task); }}>
              {!hideTime && task.dueTime && !compact && (
                <span style={{ color: pc.text, fontWeight: 600, marginRight: 5, fontSize: 11 }}>{task.dueTime}</span>
              )}
              {task.text}
            </div>
            {!compact && (
              <div style={{ display: 'flex', gap: 4, marginTop: 2, alignItems: 'center' }}>
                {task.dueTime && <span style={{ fontSize: 9, color: pc.text, fontWeight: 500, ...s }}>{task.dueTime}</span>}
                {task.endTime && <span style={{ fontSize: 8, color: COLORS.textDim, ...s }}>- {task.endTime} ({formatDuration(task.dueTime, task.endTime)})</span>}
                {!hideTime && !task.dueTime && <span style={{ fontSize: 8, color: COLORS.textDim + '88', ...s }}>Sin hora</span>}
                {task.category && <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: `${COLORS.textDim}12`, color: COLORS.textDim + 'cc', ...s }}>{task.category}</span>}
                {task.alarm && <Clock size={10} color="#ffd93d" />}
                {task.recurrence && task.recurrence !== 'none' && <Repeat size={10} color={COLORS.primary} />}
                {task.status === 'in_progress' && <span style={{ fontSize: 8, color: COLORS.primary, fontWeight: 600, ...s }}>{'\u{25CF}'}</span>}
              </div>
            )}
          </div>
          {!compact && (
            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
              {!task.dueTime && <button onClick={e => { e.stopPropagation(); const n = new Date(); updateTaskField(task.id, 'dueTime', `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`); }}
                style={{ ...btnBase, width: 22, height: 22, background: 'transparent', color: COLORS.primary + '99', fontSize: 10 }}><Clock size={11} /></button>}
              <button onClick={e => { e.stopPropagation(); openTaskModal(task); }}
                style={{ ...btnBase, width: 22, height: 22, background: 'transparent', color: COLORS.textDim + '77', fontSize: 10 }}><Edit size={11} /></button>
              <button onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                style={{ ...btnBase, width: 22, height: 22, background: 'transparent', color: COLORS.textDim + '55', fontSize: 10 }}><X size={11} /></button>
            </div>
          )}
        </div>
        {expandedTaskId === task.id && !mini && (
          <div style={{ padding: '8px 0 2px 22px', borderTop: `1px solid ${COLORS.border}`, marginTop: 5 }}>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4, alignItems: 'center' }}>
              <input type="date" value={task.dueDate || dateStr} onClick={e => openNativeDatePicker(e.currentTarget)} onFocus={e => openNativeDatePicker(e.currentTarget)} onChange={e => handleDueDateChange(task.id, e.target.value)}
                style={{ padding: '2px 6px', borderRadius: 5, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 9, ...s, outline: 'none', width: 100, cursor: 'pointer' }} />
              <input type="time" value={task.dueTime || ''} onChange={e => updateTaskField(task.id, 'dueTime', e.target.value)}
                style={{ padding: '2px 6px', borderRadius: 5, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 9, ...s, outline: 'none', width: 65 }} />
              <select value={task.category} onChange={e => updateTaskField(task.id, 'category', e.target.value)}
                style={{ padding: '2px 6px', borderRadius: 5, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 9, ...s, outline: 'none' }}>
                {AGENDA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={() => { if (!task.alarm) requestHabitFlowNotifications(); updateTaskField(task.id, 'alarm', !task.alarm); }}
                style={{ ...btnBase, padding: '2px 6px', background: task.alarm ? `${COLORS.primary}15` : `${COLORS.alert}08`, color: task.alarm ? COLORS.primary : COLORS.alert, fontSize: 9 }}><Clock size={11} /></button>
              <button onClick={() => openTaskModal(task)} style={{ ...btnBase, padding: '2px 8px', background: `${COLORS.primary}10`, color: COLORS.primary, fontSize: 9 }}>Editar</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDayView = () => (
    <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
      {timedTasks.length === 0 && untimedTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: COLORS.textDim }}>
          <div className="fire-emoji" style={{ fontSize: 36, marginBottom: 8, opacity: 0.8 }}>
            {isToday ? '\u{1F305}' : '\u{1F4C5}'}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, ...s, marginBottom: 4 }}>
            {isToday ? 'Tu día está libre' : 'No hay tareas para este día'}
          </div>
          <div style={{ fontSize: 11, color: COLORS.textDim, ...s, marginBottom: 12 }}>
            {isToday ? 'Añade una tarea o bloquea tiempo para enfocarte' : 'Selecciona otro día o crea una tarea aquí'}
          </div>
          <button onClick={() => { setEditModalTask({ dueDate: dateStr, priority: inputPrio }); setShowModal(true); }}
            style={{ ...btnBase, padding: '8px 20px', background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff', margin: '0 auto', fontSize: 12 }}>
            <Plus size={14} /> Añadir tarea
          </button>
        </div>
      ) : (
        <div style={{ padding: '4px 0' }}>
          {HOURS.map(hour => {
            const hourTasks = timedTasks.filter(t => timeToHour(t.dueTime) === hour);
            const isDrop = dropHour === hour;
            const isCurrent = hour === new Date().getHours() && isToday;
            const isSectionStart = Object.values(SECTION_HOURS).some(hrs => hrs[0] === hour);
            const sectionLabel = isSectionStart ? Object.entries(SECTION_HOURS).find(([_, hrs]) => hrs[0] === hour)?.[0] : null;
            return (
              <div key={hour} onDragOver={e => { e.preventDefault(); setDropHour(hour); }}
                onDragLeave={() => setDropHour(null)} onDrop={e => { e.preventDefault(); handleDropOnHour(hour); }}
                style={{ display: 'flex', position: 'relative',
                  borderTop: isSectionStart ? `1px solid ${COLORS.border}` : 'none',
                  background: isDrop ? `${COLORS.primary}06` : isCurrent ? `${COLORS.primary}04` : 'transparent',
                  paddingTop: isSectionStart ? 10 : 0, marginTop: isSectionStart ? 6 : 0 }}>
                {isCurrent && <div style={{ position: 'absolute', left: 38, right: 0, top: 0, height: 2, background: `linear-gradient(90deg, ${COLORS.primary}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />}
                <div style={{ width: 40, flexShrink: 0, textAlign: 'center', padding: '4px 0', alignSelf: 'flex-start' }}>
                  {isSectionStart && sectionLabel && (
                    <div style={{ fontSize: 7, color: COLORS.textDim + '70', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{SECTION_LABELS[sectionLabel]}</div>
                  )}
                  <div style={{ fontSize: 10, color: isCurrent ? COLORS.primary : COLORS.textDim + 'bb', fontWeight: isCurrent ? 700 : 500, background: isCurrent ? `${COLORS.primary}15` : 'transparent', borderRadius: 4, padding: '0 4px', display: 'inline-block', ...s }}>
                    {String(hour).padStart(2, '0')}
                  </div>
                  <button onClick={e => { e.stopPropagation(); setEditModalTask({ dueTime: `${String(hour).padStart(2,'0')}:00`, dueDate: dateStr, priority: inputPrio }); setShowModal(true); }}
                    style={{ width: 14, height: 14, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: COLORS.textDim + '44', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1px auto', padding: 0 }}>+</button>
                  {hour < 23 && <div style={{ width: 1, height: 10, background: isCurrent ? COLORS.primary : COLORS.border, margin: '0 auto' }} />}
                </div>
                <div onClick={() => {
                  setEditModalTask({ dueTime: `${String(hour).padStart(2,'0')}:00`, dueDate: dateStr, priority: inputPrio });
                  setShowModal(true);
                }} style={{ flex: 1, padding: '2px 8px', minHeight: hourTasks.length > 0 ? undefined : 28, borderRadius: 4 }}>
                  {isDrop && hourTasks.length === 0 && (
                    <div style={{ margin: '3px 0', padding: '6px 10px', borderRadius: 8, border: `1.5px dashed ${COLORS.primary}50`, fontSize: 10, color: COLORS.primary + '88', textAlign: 'center' }}>Soltar aquí</div>
                  )}
                  {hourTasks.map(task => renderTaskBlock(task))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderWeekView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 10, background: COLORS.card, borderRadius: 18, border: `1px solid ${COLORS.border}`, padding: 14 }}>
      {weekDays.map((d, i) => {
        const ds = toYYYYMMDD(d);
        const isSel = ds === dateStr;
        const isT = ds === todayStr;
        const dayTasks = (expandedAgenda[ds] || []).map(t => ({ ...t, dueDate: t.dueDate || ds, dueTime: t.dueTime || t.time || '' }));
        const dayPct = dayTasks.length > 0 ? Math.round(dayTasks.filter(t => t.completed).length / dayTasks.length * 100) : 0;
        return (
          <div key={i} onClick={() => { setCurrentDate(d); }}
            style={{ background: isSel ? `${COLORS.primary}08` : 'transparent', borderRadius: 14, padding: 10, border: `1px solid ${isSel ? COLORS.primary + '35' : COLORS.border}`, cursor: 'pointer', minHeight: 142 }}>
            <div style={{ textAlign: 'center', marginBottom: 9, padding: '7px 0', borderRadius: 10, background: isT ? COLORS.primary : 'transparent' }}>
              <div style={{ fontSize: 10, color: isT ? '#fff' : COLORS.textDim, fontWeight: 700, letterSpacing: '0.03em', ...s }}>{DAY_NAMES[i]}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: isT ? '#fff' : COLORS.text, lineHeight: 1.1, ...s }}>{d.getDate()}</div>
            </div>
            {dayTasks.length > 0 && <div style={{ height: 4, borderRadius: 4, background: COLORS.bg, marginBottom: 7, overflow: 'hidden' }}>
              <div style={{ width: `${dayPct}%`, height: '100%', borderRadius: 4, background: COLORS.success, transition: 'width 0.3s' }} />
            </div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {dayTasks.filter(t => !hideDone || !t.completed).slice(0, 4).map(t => (
                <div key={t.id} style={{
                  padding: '4px 6px', borderRadius: 6, fontSize: 10, lineHeight: 1.25, fontWeight: 700, ...s,
                  background: t.completed ? `${COLORS.success}10` : `${TASK_BLOCK_COLORS[t.priority || 3].bg}`,
                  borderLeft: `2px solid ${t.completed ? COLORS.success : TASK_BLOCK_COLORS[t.priority || 3].border}`,
                  color: t.completed ? COLORS.textDim : COLORS.text,
                  textDecoration: t.completed ? 'line-through' : 'none',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {t.dueTime && <span style={{ color: TASK_BLOCK_COLORS[t.priority || 3].text, marginRight: 4 }}>{t.dueTime}</span>}
                  {t.text}
                </div>
              ))}
              {dayTasks.length > 4 && <div style={{ fontSize: 10, color: COLORS.textDim, textAlign: 'center', fontWeight: 700, ...s }}>+{dayTasks.length - 4}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMonthView = () => (
    <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', borderBottom: `1px solid ${COLORS.border}` }}>
        {DAY_NAMES.map(d => <div key={d} style={{ padding: '12px 0', fontSize: 12, color: COLORS.textDim, fontWeight: 700, letterSpacing: '0.02em', ...s }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
        {monthGrid.flat().map((d, i) => {
          const ds = toYYYYMMDD(d);
          const isCurr = d.getMonth() === currentDate.getMonth();
          const isT = ds === todayStr;
          const isSel = ds === dateStr;
          const dayTasks = (expandedAgenda[ds] || []).filter(t => !hideDone || !t.completed);
          const hasOverdue = dayTasks.some(t => !t.completed && ds < todayStr);
          return (
            <div key={i} onClick={() => { setCurrentDate(d); setViewMode('day'); }}
              style={{ padding: '9px 7px', minHeight: 92, cursor: 'pointer', borderBottom: `1px solid ${COLORS.border}`,
                borderRight: (i + 1) % 7 === 0 ? 'none' : `1px solid ${COLORS.border}`,
                background: isSel ? `${COLORS.primary}15` : isT ? `${COLORS.primary}08` : 'transparent' }}>
              <div style={{ fontSize: 14, fontWeight: isT || isSel ? 800 : 600, color: isT ? COLORS.primary : isCurr ? COLORS.text : COLORS.textDim + '40', ...s, marginBottom: 7 }}>
                {d.getDate()}
                {hasOverdue && <span style={{ color: COLORS.alert, marginLeft: 2 }}></span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {dayTasks.slice(0, 4).map(t => (
                  <div key={t.id} style={{
                    padding: '3px 6px', borderRadius: 5, fontSize: 9, lineHeight: 1.25, fontWeight: 600, ...s,
                    background: t.completed ? `${COLORS.success}15` : `${TASK_BLOCK_COLORS[t.priority || 3].bg}`,
                    color: t.completed ? COLORS.textDim : TASK_BLOCK_COLORS[t.priority || 3].text,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{t.text}</div>
                ))}
                {dayTasks.length > 4 && <div style={{ fontSize: 9, color: COLORS.textDim, fontWeight: 700, paddingLeft: 2, ...s }}>+{dayTasks.length - 4}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderListView = () => {
    const filtered = getFilteredAgenda(expandedAgenda);
    return (
      <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: COLORS.textDim }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.6 }}>{'\u{1F4CB}'}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, ...s, marginBottom: 4 }}>No hay tareas</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, ...s }}>Prueba a cambiar los filtros o crea una nueva tarea</div>
          </div>
        ) : filtered.map(([date, ts]) => (
          <div key={date}>
            <div style={{ padding: '8px 14px', fontSize: 11, color: COLORS.textDim, fontWeight: 600, background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...s }}>
              <span>{date === todayStr ? 'Hoy' : date === toYYYYMMDD(new Date(Date.now() + 86400000)) ? 'Mañana' : new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
              <span style={{ fontSize: 10, color: COLORS.textDim + '88' }}>{ts.length} tareas</span>
            </div>
            <div style={{ padding: '5px 10px' }}>
              {ts.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).map(t => renderTaskBlock(t))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMiniCalendar = () => {
    const monthYear = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: COLORS.bg, cursor: 'pointer', color: COLORS.textDim, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}></button>
          <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.text, ...s }}>{monthYear}</span>
          <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: COLORS.bg, cursor: 'pointer', color: COLORS.textDim, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1, textAlign: 'center' }}>
          {DAY_NAMES.map(d => <div key={d} style={{ fontSize: 8, color: COLORS.textDim, padding: '2px 0', ...s }}>{d}</div>)}
          {monthGrid.flat().map((d, i) => {
            const ds = toYYYYMMDD(d);
            const isCurr = d.getMonth() === currentDate.getMonth();
            const isSel = ds === dateStr;
            const isT = ds === todayStr;
            const cnt = (expandedAgenda[ds] || []).filter(t => !t.completed).length;
            return (
              <button key={i} onClick={() => setCurrentDate(new Date(d))} style={{
                padding: '2px 0', border: 'none', background: isSel ? COLORS.primary : 'transparent',
                color: isSel ? '#fff' : isT ? COLORS.primary : isCurr ? COLORS.text : COLORS.textDim + '40',
                fontSize: 9, fontWeight: isSel || isT ? 700 : 400, borderRadius: 4, cursor: 'pointer', position: 'relative', ...s
              }}>
                {d.getDate()}
                {cnt > 0 && !isSel && <div style={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 3, height: 3, borderRadius: '50%', background: COLORS.primary + '66' }} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSidebar = () => (
    <div className="agenda-sidebar" style={{ width: 260, flexShrink: 0 }}>
      <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden', position: 'sticky', top: 16, alignSelf: 'flex-start' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${COLORS.border}` }}>
          {[
            { id: 'unscheduled', label: 'Sin hora', icon: '\u{1F4CB}' },
            { id: 'calendar', label: 'Calendario', icon: '\u{1F4C5}' },
            { id: 'alarms', label: 'Alarmas', icon: '\u{1F514}' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setSidebarTab(tab.id)} style={{
              flex: 1, padding: '8px 4px', border: 'none',
              background: sidebarTab === tab.id ? `${COLORS.primary}12` : 'transparent',
              color: sidebarTab === tab.id ? COLORS.primary : COLORS.textDim, cursor: 'pointer',
              fontSize: 8, fontWeight: 600, ...s,
              borderBottom: sidebarTab === tab.id ? `2px solid ${COLORS.primary}` : 'none',
              transition: 'all 0.15s'
            }}><div className="fire-emoji" style={{ fontSize: 12, marginBottom: 2 }}>{tab.icon}</div>{tab.label}</button>
          ))}
        </div>
        <div style={{ padding: 8 }}>
          {sidebarTab === 'unscheduled' && (
            untimedTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 8px', color: COLORS.textDim + '99' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>✅</div>
                <div style={{ fontSize: 10, ...s }}>Todo programado</div>
              </div>
            ) : untimedTasks.map(task => renderTaskBlock(task, { compact: true }))
          )}
          {sidebarTab === 'calendar' && (
            <div>
              {renderMiniCalendar()}
              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 8, marginTop: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.text, ...s, marginBottom: 6 }}>Resumen del día</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: COLORS.textDim, ...s }}>Progreso</span>
                  <span style={{ fontSize: 9, color: COLORS.text, fontWeight: 600, ...s }}>{pct}%</span>
                </div>
                <div style={{ height: 3, background: COLORS.bg, borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${COLORS.success}, ${COLORS.secondary})`, transition: 'width 0.4s' }} />
                </div>
                {[
                  ['Pendientes', totalCount - completedCount, COLORS.primary],
                  ['Completadas', completedCount, COLORS.success],
                  ['Vencidas', overdueCount, COLORS.alert],
                  ['Ocupado', busyMins >= 60 ? `${Math.round(busyMins/60)}h` : `${busyMins}m`, COLORS.secondary],
                  ['Libre', freeMins >= 60 ? `${Math.round(freeMins/60)}h` : `${freeMins}m`, COLORS.textDim]
                ].map(([label, val, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: COLORS.textDim, ...s, marginBottom: 2 }}>
                    <span>{label}</span>
                    <span style={{ color, fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {sidebarTab === 'alarms' && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.text, ...s, marginBottom: 6 }}>Próximas alarmas</div>
              {tasks.filter(t => t.alarm && !t.completed && t.dueTime).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '12px 8px', color: COLORS.textDim + '99' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{'\u{1F515}'}</div>
                  <div style={{ fontSize: 9, ...s }}>No hay alarmas próximas</div>
                </div>
              ) : tasks.filter(t => t.alarm && !t.completed && t.dueTime).sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || '')).slice(0, 5).map(t => (
                <div key={t.id} style={{ padding: '5px 8px', borderRadius: 6, marginBottom: 3, background: COLORS.bg, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 10 }}>{'\u{1F514}'}</span>
                  <span style={{ fontSize: 9, color: COLORS.primary, fontWeight: 600, ...s, flexShrink: 0 }}>{t.dueTime}</span>
                  <span style={{ fontSize: 9, color: COLORS.text, ...s, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</span>
                </div>
              ))}
              {overdueCount > 0 && <>
                <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.alert, ...s, margin: '8px 0 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span> ï¸ Vencidas ({overdueCount})</span>
                </div>
                {getOverdueTasks().slice(0, 3).map(t => (
                  <div key={t.id} style={{ padding: '4px 8px', borderRadius: 6, marginBottom: 2, background: `${COLORS.alert}06`, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 9, color: COLORS.text, ...s, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</span>
                    <button onClick={() => { const d = new Date(t.dueDate + 'T12:00:00'); d.setDate(d.getDate() + 1); onMoveTaskToDate(t.id, t.dueDate, toYYYYMMDD(d)); }}
                      style={{ ...btnBase, fontSize: 8, padding: '1px 5px', background: `${COLORS.primary}10`, color: COLORS.primary }}>Mover</button>
                    <button onClick={() => toggleTask(t.id)} style={{ ...btnBase, fontSize: 8, padding: '1px 5px', background: `${COLORS.success}10`, color: COLORS.success }}>✓</button>
                  </div>
                ))}
              </>}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuickCapture = () => (
    <div className="agenda-quick-capture" style={{ background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 7, marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
        <Plus size={15} color={COLORS.primary} style={{ marginLeft: 4 }} />
        <input value={quickText} onChange={e => setQuickText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(); }}
          placeholder="Añade una tarea... prueba: pagar luz mañana 18:00 p1 @finanzas"
          style={{ flex: 1, padding: '8px 4px', border: 'none', background: 'transparent', color: COLORS.text, fontSize: 12, ...s, outline: 'none' }} />
        <button onClick={handleQuickAdd} style={{ ...btnBase, padding: '7px 11px', background: `${COLORS.primary}16`, color: COLORS.primary, fontWeight: 700 }}>
          Añadir
        </button>
      </div>
    </div>
  );

  const renderDailyNotes = () => (
    <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 12, marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 7 }}>
        <BookOpen size={14} color={COLORS.primary} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.text, ...s }}>Notas del día</div>
          <div style={{ fontSize: 9, color: COLORS.textDim, ...s }}>Ideas, llamadas o cosas que no quieres olvidar.</div>
        </div>
      </div>
      <textarea value={agendaNotes[dateStr] || ''} onChange={e => onUpdateAgendaNote(dateStr, e.target.value)}
        placeholder="Escribe aquí tus anotaciones..."
        style={{ width: '100%', minHeight: 108, resize: 'vertical', boxSizing: 'border-box', padding: '9px 10px', borderRadius: 9, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 11, lineHeight: 1.5, ...s, outline: 'none' }} />
    </div>
  );

  const renderCleanTaskRow = (task) => {
    const priorityColor = PRIORITY_COLORS[task.priority || 3];
    return (
      <div className="agenda-clean-task-row" key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 4px', borderBottom: `1px solid ${COLORS.border}` }}>
        <button className="agenda-plan-check" onClick={() => toggleTask(task.id)} style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: task.completed ? 'none' : `2px solid ${priorityColor}88`, background: task.completed ? COLORS.success : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          {task.completed && <Check size={10} color={COLORS.bg} strokeWidth={4} />}
        </button>
        <div style={{ width: 45, flexShrink: 0, fontSize: 10, fontWeight: 700, color: task.dueTime ? priorityColor : COLORS.textDim, ...s }}>
          {task.dueTime || 'Sin hora'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: task.completed ? COLORS.textDim : COLORS.text, textDecoration: task.completed ? 'line-through' : 'none', ...s, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.text}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 3 }}>
            <span style={{ fontSize: 8, color: COLORS.textDim, ...s }}>{task.category || 'Personal'}</span>
            {task.alarm && <Clock size={10} color="#ffd93d" />}
            {task.recurrence && task.recurrence !== 'none' && <Repeat size={10} color={COLORS.primary} />}
            {task.subtasks?.length > 0 && <span style={{ fontSize: 8, color: COLORS.textDim, ...s }}>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>}
          </div>
        </div>
        <button onClick={() => openTaskModal(task)} style={{ ...btnBase, width: 26, height: 26, color: COLORS.textDim, background: 'transparent' }} title="Editar"><Edit size={13} /></button>
      </div>
    );
  };

  const renderCalmDayView = () => {
    const visibleTimed = timedTasks.filter(t => !t.completed);
    const visibleUntimed = untimedTasks.filter(t => !t.completed);
    const visibleDone = tasks.filter(t => t.completed && !hideDone);
    const sections = [
      { id: 'timed', label: 'Programadas', hint: 'Con una hora definida', tasks: visibleTimed },
      { id: 'untimed', label: 'Por ordenar', hint: 'Decide cuándo hacerlas', tasks: visibleUntimed }
    ];
    return (
      <div className="agenda-plan-card" style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: '18px 20px', minHeight: 470 }}>
        <div className="agenda-plan-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingBottom: 13, borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <div style={{ fontSize: 15, color: COLORS.text, fontWeight: 700, ...s }}>Plan del día</div>
            <div style={{ marginTop: 3, fontSize: 10, color: COLORS.textDim, ...s }}>{totalCount - completedCount} pendientes  {freeMins >= 60 ? `${Math.floor(freeMins / 60)}h ${freeMins % 60}m` : `${freeMins}m`} disponibles</div>
          </div>
          <button className="agenda-add-task-button" onClick={() => openTaskModal(null)} style={{ ...btnBase, padding: '7px 10px', color: COLORS.primary, background: `${COLORS.primary}12`, fontWeight: 700 }}><Plus size={13} /> Tarea</button>
        </div>
        {tasks.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 330, textAlign: 'center' }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: `${COLORS.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><Check size={21} color={COLORS.primary} /></div>
            <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, ...s }}>Tu día está despejado</div>
            <div style={{ color: COLORS.textDim, fontSize: 11, marginTop: 5, maxWidth: 260, lineHeight: 1.5, ...s }}>Captura algo arriba o disfruta del espacio libre. No hace falta llenar cada hora.</div>
          </div>
        ) : (
          <div>
            {sections.map(section => section.tasks.length > 0 && (
              <div className="agenda-plan-section" key={section.id} style={{ marginTop: 17 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 3 }}>
                  <span style={{ color: COLORS.text, fontSize: 11, fontWeight: 700, ...s }}>{section.label}</span>
                  <span style={{ color: COLORS.textDim, fontSize: 9, ...s }}>{section.hint}</span>
                </div>
                {section.tasks.map(renderCleanTaskRow)}
              </div>
            ))}
            {visibleDone.length > 0 && (
              <div className="agenda-plan-section" style={{ marginTop: 17 }}>
                <div style={{ color: COLORS.textDim, fontSize: 10, fontWeight: 700, ...s, marginBottom: 3 }}>Completadas  {visibleDone.length}</div>
                {visibleDone.map(renderCleanTaskRow)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderWeekStrip = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 14 }}>
      {weekDays.map((day, index) => {
        const ds = toYYYYMMDD(day);
        const selected = ds === dateStr;
        const today = ds === todayStr;
        const count = (expandedAgenda[ds] || []).filter(task => !task.completed).length;
        return (
          <button key={ds} onClick={() => setCurrentDate(new Date(day))} style={{ padding: '8px 4px', borderRadius: 10, border: `1px solid ${selected ? COLORS.primary + '55' : 'transparent'}`, background: selected ? `${COLORS.primary}16` : 'transparent', color: selected ? COLORS.text : COLORS.textDim, cursor: 'pointer' }}>
            <div style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.08em', ...s }}>{DAY_NAMES[index]}</div>
            <div style={{ fontSize: 15, marginTop: 3, fontWeight: today || selected ? 700 : 500, color: today ? COLORS.primary : 'inherit', ...s }}>{day.getDate()}</div>
            <div style={{ margin: '5px auto 0', width: 4, height: 4, borderRadius: '50%', background: count > 0 ? COLORS.primary : 'transparent' }} />
          </button>
        );
      })}
    </div>
  );

  const renderUpcomingPanel = () => {
    const upcoming = getUpcomingTasks().filter(task => task.dueDate !== dateStr).slice(0, 5);
    return (
      <div>
        <div style={{ color: COLORS.text, fontSize: 12, fontWeight: 700, marginBottom: 9, ...s }}>Próximos días</div>
        {upcoming.length === 0 ? <div style={{ color: COLORS.textDim, fontSize: 10, lineHeight: 1.5, ...s }}>No tienes tareas próximas. Tu semana se ve tranquila.</div> : upcoming.map(task => (
          <div key={`${task.id}-${task.dueDate}`} style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ color: COLORS.text, fontSize: 10, ...s }}>{task.text}</div>
            <div style={{ color: COLORS.textDim, fontSize: 8, marginTop: 3, ...s }}>{new Date(task.dueDate + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}{task.dueTime ? `  ${task.dueTime}` : ''}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderCompactTodoList = () => {
    const todoItems = agendaTodos[dateStr] || [];
    const labelColors = ['#e11d48', '#efefef', '#00ff9d', '#ffd93d', '#ff9f43', '#e11d48', '#ff6b6b'];
    const getTodoLabelColor = (label) => labelColors[Math.abs([...label].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % labelColors.length];
    const groupedTodos = todoItems.reduce((groups, todo) => {
      const group = todo.label || '';
      if (!groups[group]) groups[group] = [];
      groups[group].push(todo);
      return groups;
    }, {});
    const todoGroups = Object.entries(groupedTodos).sort(([labelA], [labelB]) => {
      if (!labelA) return 1;
      if (!labelB) return -1;
      return labelA.localeCompare(labelB, 'es');
    });
    const addTodo = () => {
      if (!todoText.trim()) return;
      onUpdateAgendaTodos(dateStr, prev => [...prev, { id: Date.now().toString(36), text: todoText.trim(), completed: false, label: todoLabel }]);
      setTodoText('');
    };
    const toggleTodo = (todoId) => onUpdateAgendaTodos(dateStr, prev => prev.map(todo => todo.id === todoId ? { ...todo, completed: !todo.completed } : todo));
    const deleteTodo = (todoId) => onUpdateAgendaTodos(dateStr, prev => prev.filter(todo => todo.id !== todoId));
    const updateTodoLabel = (todoId, label) => onUpdateAgendaTodos(dateStr, prev => prev.map(todo => todo.id === todoId ? { ...todo, label } : todo));
    const addTodoLabel = () => {
      const label = newTodoLabel.trim();
      if (!label || agendaTodoLabels.some(existing => existing.toLowerCase() === label.toLowerCase())) return;
      onUpdateAgendaTodoLabels(prev => [...prev, label]);
      setTodoLabel(label);
      setNewTodoLabel('');
    };
    const deleteTodoLabel = (label) => {
      onUpdateAgendaTodoLabels(prev => prev.filter(existing => existing !== label));
      onUpdateAgendaTodos(dateStr, prev => prev.map(todo => todo.label === label ? { ...todo, label: '' } : todo));
      if (todoLabel === label) setTodoLabel('');
    };
    return (
      <div className="agenda-todo-list" style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ color: COLORS.text, fontSize: 12, fontWeight: 700, ...s }}>To-do list</div>
          <button onClick={() => setShowTodoLabels(value => !value)} style={{ ...btnBase, padding: '4px 6px', color: showTodoLabels ? COLORS.primary : COLORS.textDim, background: showTodoLabels ? `${COLORS.primary}12` : 'transparent', fontSize: 9 }}><Hash size={10} /> Etiquetas</button>
        </div>
        <div style={{ color: COLORS.textDim, fontSize: 9, marginTop: 2, marginBottom: 8, ...s }}>Anota algo rápido y márcalo cuando esté hecho.</div>
        {showTodoLabels && (
          <div style={{ marginBottom: 7, padding: 7, borderRadius: 8, background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', gap: 5 }}>
              <input value={newTodoLabel} onChange={e => setNewTodoLabel(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addTodoLabel(); }} placeholder="Nueva etiqueta..."
                style={{ flex: 1, minWidth: 0, padding: '5px 6px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.text, fontSize: 9, ...s, outline: 'none' }} />
              <button onClick={addTodoLabel} style={{ ...btnBase, width: 25, color: COLORS.primary, background: `${COLORS.primary}14` }} title="Crear etiqueta"><Plus size={11} /></button>
            </div>
            {agendaTodoLabels.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              {agendaTodoLabels.map(label => <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 4px 2px 6px', borderRadius: 10, color: getTodoLabelColor(label), background: `${getTodoLabelColor(label)}16`, fontSize: 8, ...s }}>{label}<button onClick={() => deleteTodoLabel(label)} style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={9} /></button></span>)}
            </div>}
          </div>
        )}
        {agendaTodoLabels.length > 0 && <select value={todoLabel} onChange={e => setTodoLabel(e.target.value)} style={{ width: '100%', marginBottom: 6, padding: '5px 6px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: todoLabel ? getTodoLabelColor(todoLabel) : COLORS.textDim, fontSize: 9, ...s, outline: 'none' }}>
          <option value="">Añadir sin etiqueta</option>
          {agendaTodoLabels.map(label => <option key={label} value={label}>{label}</option>)}
        </select>}
        <div className="agenda-todo-add-row" style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
          <input value={todoText} onChange={e => setTodoText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addTodo(); }} placeholder="Ej: compras supermercado"
            style={{ flex: 1, minWidth: 0, padding: '7px 8px', borderRadius: 7, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 10, ...s, outline: 'none' }} />
          <button onClick={addTodo} style={{ ...btnBase, width: 30, color: COLORS.primary, background: `${COLORS.primary}14` }} title="Añadir pendiente"><Plus size={13} /></button>
        </div>
        {todoItems.length === 0 ? (
          <div style={{ padding: '7px 0 2px', color: COLORS.textDim, fontSize: 10, lineHeight: 1.45, ...s }}>Todavía no hay pendientes.</div>
        ) : todoGroups.map(([label, groupTodos]) => {
          const labelColor = label ? getTodoLabelColor(label) : COLORS.textDim;
          return (
            <div key={label || '__unlabeled__'} style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 4, borderBottom: `1px solid ${label ? labelColor + '35' : COLORS.border}` }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: labelColor }} />
                <span style={{ color: labelColor, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', ...s }}>{label || 'Sin etiqueta'}</span>
                <span style={{ marginLeft: 'auto', color: COLORS.textDim, fontSize: 8, ...s }}>{groupTodos.length}</span>
              </div>
              {groupTodos.map(todo => (
                <div className="agenda-todo-row" key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                  <button className="agenda-todo-check" onClick={() => toggleTodo(todo.id)} style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: todo.completed ? 'none' : `2px solid ${COLORS.textDim}88`, background: todo.completed ? COLORS.success : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    {todo.completed && <Check size={8} color={COLORS.bg} strokeWidth={4} />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: todo.completed ? COLORS.textDim : COLORS.text, fontSize: 10, textDecoration: todo.completed ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...s }}>{todo.text}</div>
                    {agendaTodoLabels.length > 0 && (
                      editingTodoLabelId === todo.id ? (
                        <select autoFocus value={todo.label || ''} onChange={e => { updateTodoLabel(todo.id, e.target.value); setEditingTodoLabelId(null); }} onBlur={() => setEditingTodoLabelId(null)}
                          style={{ maxWidth: 105, marginTop: 3, padding: '1px 3px', borderRadius: 5, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: todo.label ? getTodoLabelColor(todo.label) : COLORS.textDim, fontSize: 8, ...s, outline: 'none' }}>
                          <option value="">Sin etiqueta</option>
                          {agendaTodoLabels.map(todoLabelOption => <option key={todoLabelOption} value={todoLabelOption}>{todoLabelOption}</option>)}
                        </select>
                      ) : (
                        <button className="agenda-todo-label-chip" onClick={() => setEditingTodoLabelId(todo.id)} style={{ marginTop: 4, padding: todo.label ? '2px 6px' : '1px 0', borderRadius: 10, border: 'none', background: todo.label ? `${getTodoLabelColor(todo.label)}16` : 'transparent', color: todo.label ? getTodoLabelColor(todo.label) : COLORS.textDim + '99', fontSize: 8, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, ...s }}>
                          {todo.label && <span style={{ width: 5, height: 5, borderRadius: '50%', background: getTodoLabelColor(todo.label) }} />}
                          {todo.label || '+ etiqueta'}
                        </button>
                      )
                    )}
                  </div>
                  <button className="agenda-todo-delete" onClick={() => deleteTodo(todo.id)} style={{ ...btnBase, width: 20, height: 20, color: COLORS.textDim + '88', background: 'transparent' }} title="Eliminar"><X size={11} /></button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSidePanel = () => (
    <div className="agenda-side-panel" style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 12 }}>
      <div className="agenda-side-tabs" style={{ display: 'flex', gap: 3, marginBottom: 12, padding: 3, background: COLORS.bg, borderRadius: 9 }}>
        {[
          { id: 'notes', label: 'Notas', icon: <BookOpen size={11} /> },
          { id: 'calendar', label: 'Mes', icon: <Calendar size={11} /> },
          { id: 'upcoming', label: 'Próximo', icon: <List size={11} /> }
        ].map(item => (
          <button key={item.id} onClick={() => setSidePanel(item.id)} style={{ ...btnBase, flex: 1, padding: '6px 3px', background: sidePanel === item.id ? COLORS.card : 'transparent', color: sidePanel === item.id ? COLORS.text : COLORS.textDim, fontSize: 9 }}>{item.icon}{item.label}</button>
        ))}
      </div>
      {sidePanel === 'notes' && (
        <div>
          <div style={{ color: COLORS.text, fontSize: 12, fontWeight: 700, marginBottom: 3, ...s }}>Notas del día</div>
          <div style={{ color: COLORS.textDim, fontSize: 9, marginBottom: 8, lineHeight: 1.45, ...s }}>Apunta ideas rápidas sin convertirlas en tareas.</div>
          <textarea value={agendaNotes[dateStr] || ''} onChange={e => onUpdateAgendaNote(dateStr, e.target.value)} placeholder="Escribe una nota..."
            style={{ width: '100%', minHeight: 210, resize: 'vertical', boxSizing: 'border-box', padding: 10, borderRadius: 9, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 11, lineHeight: 1.5, ...s, outline: 'none' }} />
          {renderCompactTodoList()}
        </div>
      )}
      {sidePanel === 'calendar' && renderMiniCalendar()}
      {sidePanel === 'upcoming' && renderUpcomingPanel()}
    </div>
  );

  const renderEmptyState = (msg, sub, cta) => (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: COLORS.textDim }}>
      <div className="fire-emoji" style={{ fontSize: 36, marginBottom: 8, opacity: 0.8 }}>{msg.icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, ...s, marginBottom: 4 }}>{msg.title}</div>
      <div style={{ fontSize: 11, color: COLORS.textDim, ...s, marginBottom: 12 }}>{msg.desc}</div>
      {cta && <button onClick={cta.onClick} style={{ ...btnBase, padding: '8px 20px', background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff', margin: '0 auto', fontSize: 12 }}>
        {cta.icon && <Plus size={14} />}{cta.label}
      </button>}
    </div>
  );

  const renderTaskModal = () => {
    if (!showModal) return null;
    const t = editModalTask || {};
    const modalStyle = { background: COLORS.card, borderRadius: '18px 0 0 18px', borderLeft: `1px solid ${COLORS.border}`, padding: '28px 30px', maxWidth: 440, width: '100%', height: '100%', overflow: 'hidden', boxSizing: 'border-box', boxShadow: '-18px 0 54px rgba(0,0,0,0.38)', display: 'flex', flexDirection: 'column' };
    return (
      <div onClick={closeTaskModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.36)', zIndex: 1000, display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end', backdropFilter: 'blur(2px)' }}>
        <div onClick={e => e.stopPropagation()} style={modalStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexShrink: 0 }}>
            <div style={{ fontSize: 18, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>{t.id ? 'Editar tarea' : 'Nueva tarea'}</div>
            <button onClick={closeTaskModal} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: COLORS.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.textDim, fontSize: 14 }}>✕</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 2 }}>
            <input value={t.text || ''} onChange={e => setEditModalTask(p => ({ ...p, text: e.target.value }))} placeholder="Título de la tarea"
              style={{ width: '100%', height: 44, flexShrink: 0, boxSizing: 'border-box', padding: '0 14px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 14, fontWeight: 500, ...s, outline: 'none' }} />
            <textarea value={t.note || ''} onChange={e => setEditModalTask(p => ({ ...p, note: e.target.value }))} placeholder="Añadir descripción..."
              style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 11, ...s, outline: 'none', resize: 'vertical', minHeight: 86, boxSizing: 'border-box' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><div style={{ fontSize: 9, color: COLORS.textDim, marginBottom: 3, ...s }}>Fecha</div>
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setShowDatePicker(!showDatePicker)} type="button"
                    style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 10, ...s, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={11} color={COLORS.textDim} />
                    {new Date((t.dueDate || dateStr) + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </button>
                  {showDatePicker && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 20, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', marginTop: 4, width: 230 }}>
                      {(() => {
                        const dp = new Date((t.dueDate || dateStr) + 'T12:00:00');
                        const grid = getMonthGrid(dp);
                        return (<>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <button onClick={() => { const d = new Date(dp); d.setMonth(d.getMonth() - 1); setEditModalTask(p => ({ ...p, dueDate: toYYYYMMDD(d) })); }}
                              style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: COLORS.bg, cursor: 'pointer', color: COLORS.textDim, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}></button>
                            <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.text, ...s }}>{MONTH_NAMES[dp.getMonth()]} {dp.getFullYear()}</span>
                            <button onClick={() => { const d = new Date(dp); d.setMonth(d.getMonth() + 1); setEditModalTask(p => ({ ...p, dueDate: toYYYYMMDD(d) })); }}
                              style={{ width: 22, height: 22, borderRadius: 5, border: 'none', background: COLORS.bg, cursor: 'pointer', color: COLORS.textDim, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}></button>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1, textAlign: 'center' }}>
                            {DAY_NAMES.map(d => <div key={d} style={{ fontSize: 8, color: COLORS.textDim, padding: '2px 0', ...s }}>{d}</div>)}
                            {grid.flat().map((d, i) => {
                              const ds = toYYYYMMDD(d);
                              const isCurr = d.getMonth() === dp.getMonth();
                              const isSel = ds === (t.dueDate || dateStr);
                              const isT = ds === todayStr;
                              return (
                                <button key={i} onClick={() => { setEditModalTask(p => ({ ...p, dueDate: ds })); setShowDatePicker(false); }}
                                  style={{ padding: '2px 0', border: 'none', background: isSel ? COLORS.primary : isT ? `${COLORS.primary}15` : 'transparent', color: isSel ? '#fff' : isT ? COLORS.primary : isCurr ? COLORS.text : COLORS.textDim + '40', fontSize: 9, fontWeight: isSel || isT ? 700 : 400, borderRadius: 4, cursor: 'pointer', ...s }}>{d.getDate()}</button>
                              );
                            })}
                          </div>
                        </>);
                      })()}
                    </div>
                  )}
                </div>
              </div>
              <div><div style={{ fontSize: 9, color: COLORS.textDim, marginBottom: 3, ...s }}>Hora</div>
                {(() => {
                  const h24 = t.dueTime ? parseInt(t.dueTime.split(':')[0]) : -1;
                  const mins = t.dueTime ? t.dueTime.split(':')[1]?.slice(0,2) || '00' : '00';
                  const h12 = h24 >= 0 ? (h24 % 12 || 12) : 12;
                  const ampm = h24 >= 0 ? (h24 >= 12 ? 'PM' : 'AM') : 'AM';
                  return (
                    <div style={{ display: 'flex', gap: 3 }}>
                      <select value={h12} onChange={e => {
                        const nh = parseInt(e.target.value);
                        const n24 = ampm === 'PM' ? (nh === 12 ? 12 : nh + 12) : (nh === 12 ? 0 : nh);
                        setEditModalTask(p => ({ ...p, dueTime: `${String(n24).padStart(2,'0')}:${mins}` }));
                      }} style={{ flex: 1, padding: '6px 4px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 10, ...s, outline: 'none', textAlign: 'center', cursor: 'pointer' }}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => <option key={h} value={h}>{String(h).padStart(2,'0')}</option>)}
                      </select>
                      <span style={{ color: COLORS.textDim, fontSize: 13, display: 'flex', alignItems: 'center', fontWeight: 600 }}>:</span>
                      <select value={mins} onChange={e => {
                        const nm = e.target.value;
                        const n24 = ampm === 'PM' ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
                        setEditModalTask(p => ({ ...p, dueTime: `${String(n24).padStart(2,'0')}:${nm}` }));
                      }} style={{ flex: 1, padding: '6px 4px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 10, ...s, outline: 'none', textAlign: 'center', cursor: 'pointer' }}>
                        {Array.from({ length: 60 }, (_, i) => String(i).padStart(2,'0')).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <select value={ampm} onChange={e => {
                        const na = e.target.value;
                        const nh = na === 'PM' ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
                        setEditModalTask(p => ({ ...p, dueTime: `${String(nh).padStart(2,'0')}:${mins}` }));
                      }} style={{ flex: 0.7, padding: '6px 4px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 10, ...s, outline: 'none', textAlign: 'center', cursor: 'pointer' }}>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><div style={{ fontSize: 9, color: COLORS.textDim, marginBottom: 3, ...s }}>Prioridad</div>
                <div style={{ display: 'flex', gap: 3 }}>{[1, 2, 3, 4].map(p => (
                  <button key={p} onClick={() => setEditModalTask(prev => ({ ...prev, priority: p }))}
                    style={{ flex: 1, padding: '5px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: (t.priority || 3) === p ? PRIORITY_COLORS[p] : `${PRIORITY_COLORS[p]}15`,
                      color: (t.priority || 3) === p ? '#fff' : PRIORITY_COLORS[p], fontWeight: 700, fontSize: 9, ...s }}>{PRIORITY_LABELS[p]}</button>
                ))}</div></div>
              <div><div style={{ fontSize: 9, color: COLORS.textDim, marginBottom: 3, ...s }}>Categoría</div>
                <select value={t.category || 'Personal'} onChange={e => setEditModalTask(p => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 10, ...s, outline: 'none' }}>
                  {AGENDA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                <input type="checkbox" checked={t.alarm || false} onChange={e => { if (e.target.checked) requestHabitFlowNotifications(); setEditModalTask(p => ({ ...p, alarm: e.target.checked })); }}
                  style={{ accentColor: COLORS.primary }} />
                <span style={{ fontSize: 10, ...s }}>Alerta</span>
              </label>
              <select value={t.recurrence || 'none'} onChange={e => setEditModalTask(p => ({ ...p, recurrence: e.target.value }))}
                style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 9, ...s, outline: 'none' }}>
                {RECURRENCE_TYPES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
              <select value={t.status || 'pending'} onChange={e => setEditModalTask(p => ({ ...p, status: e.target.value }))}
                style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 9, ...s, outline: 'none' }}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            {t.alarm && (
              <div>
                <div style={{ fontSize: 9, color: COLORS.textDim, marginBottom: 3, ...s }}>Avisarme</div>
                <select value={t.reminders?.[0] || 'exact'} onChange={e => setEditModalTask(p => ({ ...p, reminders: [e.target.value] }))}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 10, ...s, outline: 'none' }}>
                  {REMINDER_OPTIONS.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select>
              </div>
            )}
            {t.recurrence === 'custom' && (
              <div>
                <div style={{ fontSize: 9, color: COLORS.textDim, marginBottom: 4, ...s }}>Repetir estos días</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {DAY_NAMES.map((day, idx) => {
                    const active = (t.recurrenceDays || []).includes(idx);
                    return <button key={day} onClick={() => setEditModalTask(p => ({ ...p, recurrenceDays: active ? (p.recurrenceDays || []).filter(d => d !== idx) : [...(p.recurrenceDays || []), idx] }))}
                      style={{ ...btnBase, flex: 1, padding: '5px 0', background: active ? COLORS.primary : COLORS.bg, color: active ? '#fff' : COLORS.textDim, fontSize: 8 }}>{day}</button>;
                  })}
                </div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.text, ...s, marginBottom: 4 }}>Checklist</div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addModalSubtask(); }}
                  placeholder="Añadir un paso..."
                  style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 10, ...s, outline: 'none' }} />
                <button onClick={addModalSubtask} style={{ ...btnBase, padding: '0 9px', background: `${COLORS.primary}18`, color: COLORS.primary }}><Plus size={12} /></button>
              </div>
              {t.subtasks?.length > 0 && <>
              {t.subtasks.map((st, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                  <input type="checkbox" checked={st.completed} onChange={() => { const s = [...(t.subtasks||[])]; s[idx] = { ...s[idx], completed: !s[idx].completed }; setEditModalTask(p => ({ ...p, subtasks: s })); }}
                    style={{ accentColor: COLORS.primary }} />
                  <span style={{ flex: 1, fontSize: 10, color: st.completed ? COLORS.textDim : COLORS.text, textDecoration: st.completed ? 'line-through' : 'none', ...s }}>{st.text}</span>
                  <button onClick={() => setEditModalTask(p => ({ ...p, subtasks: p.subtasks.filter((_, i) => i !== idx) }))}
                    style={{ ...btnBase, background: 'transparent', color: COLORS.textDim, padding: 1 }}><X size={11} /></button>
                </div>
              ))}
              </>}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 18, borderTop: `1px solid ${COLORS.border}` }}>
              {t.id ? (
                <>
                  <button onClick={saveTaskModal}
                    style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, ...s }}>Guardar cambios</button>
                  <button onClick={() => { deleteTask(t.id); closeTaskModal(); }}
                    style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: `${COLORS.alert}10`, color: COLORS.alert, cursor: 'pointer', fontSize: 11, fontWeight: 500, ...s }}>Eliminar</button>
                </>
              ) : (
                <button onClick={saveTaskModal}
                  style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${COLORS.primary}, #7f1028)`, color: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, ...s }}>Crear tarea</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const dayName = currentDate.toLocaleDateString('es-ES', { weekday: 'long' });
  const formattedDate = currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="agenda-mobile-view" style={{ maxWidth: viewMode === 'month' || viewMode === 'week' ? 1280 : 1100, margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div className="agenda-topbar" style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ color: COLORS.primary, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', ...s }}>Agenda</div>
          <div style={{ marginTop: 4, fontSize: 28, color: COLORS.text, fontFamily: "'DM Serif Display', serif", letterSpacing: '-0.03em' }}>{isToday ? 'Hoy' : dayName.charAt(0).toUpperCase() + dayName.slice(1)}</div>
          <div style={{ marginTop: 3, color: COLORS.textDim, fontSize: 11, ...s }}>{formattedDate}</div>
        </div>
        <div className="agenda-top-actions" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {totalCount > 0 && <div style={{ marginRight: 8, textAlign: 'right' }}>
            <div style={{ color: COLORS.text, fontSize: 11, fontWeight: 700, ...s }}>{pct}% completado</div>
            <div style={{ width: 96, height: 3, borderRadius: 3, marginTop: 5, overflow: 'hidden', background: COLORS.card }}><div style={{ width: `${pct}%`, height: '100%', background: COLORS.success }} /></div>
          </div>}
          <button onClick={goPrev} style={{ ...btnBase, width: 32, height: 32, color: COLORS.textDim, background: COLORS.card }}><ChevronLeft size={14} /></button>
          <button onClick={goToday} style={{ ...btnBase, padding: '0 10px', height: 32, color: isToday ? COLORS.primary : COLORS.textDim, background: COLORS.card, fontWeight: 700 }}>Hoy</button>
          <button onClick={goNext} style={{ ...btnBase, width: 32, height: 32, color: COLORS.textDim, background: COLORS.card }}><ChevronRight size={14} /></button>
          <button onClick={() => openTaskModal(null)} style={{ ...btnBase, marginLeft: 5, height: 32, padding: '0 13px', color: '#fff', background: COLORS.primary, fontWeight: 700 }}><Plus size={14} /> Nueva tarea</button>
        </div>
      </div>

      <div className="agenda-view-tabs" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 9 }}>
        {[
          { id: 'day', label: 'Mi día' },
          { id: 'week', label: 'Semana' },
          { id: 'month', label: 'Mes' },
          { id: 'list', label: 'Todas' }
        ].map(item => <button key={item.id} onClick={() => setViewMode(item.id)} style={{ ...btnBase, padding: '6px 9px', borderRadius: 7, background: viewMode === item.id ? `${COLORS.primary}14` : 'transparent', color: viewMode === item.id ? COLORS.primary : COLORS.textDim, fontWeight: viewMode === item.id ? 700 : 500 }}>{item.label}</button>)}
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowFilters(v => !v)} style={{ ...btnBase, padding: '6px 9px', color: showFilters ? COLORS.primary : COLORS.textDim, background: showFilters ? `${COLORS.primary}12` : 'transparent' }}><Hash size={12} /> Filtros</button>
        <button onClick={() => setShowPlanner(true)} style={{ ...btnBase, padding: '6px 9px', color: COLORS.textDim, background: 'transparent' }}><Sparkles size={12} /> Planificar</button>
      </div>

      {renderQuickCapture()}

      {showFilters && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', padding: '8px 10px', marginBottom: 14, borderRadius: 10, background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <Search size={12} color={COLORS.textDim} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar tareas..." style={{ width: 145, padding: '5px 2px', background: 'transparent', color: COLORS.text, border: 'none', outline: 'none', fontSize: 10, ...s }} />
          <div style={{ width: 1, height: 16, background: COLORS.border }} />
          {[0, 1, 2, 3, 4].map(priority => <button key={priority} onClick={() => setFilterPrio(priority)} style={{ ...btnBase, padding: '4px 7px', borderRadius: 6, color: filterPrio === priority ? '#fff' : COLORS.textDim, background: filterPrio === priority ? (priority ? PRIORITY_COLORS[priority] : COLORS.primary) : 'transparent', fontSize: 9 }}>{priority ? PRIORITY_LABELS[priority] : 'Todas'}</button>)}
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '4px 7px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, fontSize: 9, ...s }}><option value="">Categorías</option>{AGENDA_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}</select>
          <div style={{ flex: 1 }} />
          <button onClick={() => setHideDone(v => !v)} style={{ ...btnBase, padding: '4px 7px', color: hideDone ? COLORS.primary : COLORS.textDim, background: hideDone ? `${COLORS.primary}12` : 'transparent', fontSize: 9 }}>{hideDone ? 'Mostrar completadas' : 'Ocultar completadas'}</button>
        </div>
      )}

      {viewMode === 'day' && renderWeekStrip()}

      {viewMode === 'day' ? (
        <>
          <div className="agenda-layout-toggle" style={{ display: 'flex', justifyContent: 'flex-end', gap: 3, marginBottom: 7 }}>
            <button onClick={() => setDayLayout('list')} style={{ ...btnBase, padding: '5px 8px', background: dayLayout === 'list' ? `${COLORS.primary}12` : 'transparent', color: dayLayout === 'list' ? COLORS.primary : COLORS.textDim, fontSize: 9 }}><List size={11} /> Lista</button>
            <button onClick={() => setDayLayout('timeline')} style={{ ...btnBase, padding: '5px 8px', background: dayLayout === 'timeline' ? `${COLORS.primary}12` : 'transparent', color: dayLayout === 'timeline' ? COLORS.primary : COLORS.textDim, fontSize: 9 }}><Clock size={11} /> Cronograma</button>
          </div>
          <div className="agenda-day-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 270px', gap: 14, alignItems: 'start' }}>
            <div>
            {dayLayout === 'list' ? renderCalmDayView() : renderDayView()}
            </div>
            {renderSidePanel()}
          </div>
        </>
      ) : (
        <div>
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'list' && renderListView()}
        </div>
      )}

      {/* === PLANNER MODAL === */}
      {showPlanner && (
        <div onClick={() => setShowPlanner(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.card, borderRadius: 20, border: `1px solid ${COLORS.border}`, padding: 28, maxWidth: 520, width: '100%', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 18, color: COLORS.text, fontFamily: "'DM Serif Display', serif", marginBottom: 20 }}>{'\u{1F9E0}'} Planificar día</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '12px 16px', borderRadius: 10, background: `${COLORS.primary}08`, border: `1px solid ${COLORS.primary}20` }}>
                <div style={{ fontSize: 10, color: COLORS.textDim, ...s, marginBottom: 2 }}>Tiempo libre disponible</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, ...s }}>{freeMins >= 60 ? `${Math.round(freeMins/60)}h ${freeMins%60}m` : `${freeMins}m`}</div>
              </div>
              {untimedTasks.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.text, ...s, marginBottom: 4 }}>Tareas sin hora ({untimedTasks.length})</div>
                  {untimedTasks.slice(0, 5).map(t => (
                    <div key={t.id} style={{ padding: '6px 10px', borderRadius: 6, marginBottom: 2, background: COLORS.bg, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 10, color: COLORS.text, ...s, flex: 1 }}>{t.text}</span>
                      <span style={{ fontSize: 8, color: PRIORITY_COLORS[t.priority || 3], fontWeight: 600 }}>{PRIORITY_LABELS[t.priority || 3]}</span>
                      <button onClick={() => { const n = new Date(); updateTaskField(t.id, 'dueTime', `${String(n.getHours()).padStart(2,'0')}:00`); }}
                        style={{ ...btnBase, padding: '2px 6px', background: `${COLORS.primary}10`, color: COLORS.primary, fontSize: 8 }}>Programar</button>
                    </div>
                  ))}
                </div>
              )}
              {overdueCount > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.alert, ...s, marginBottom: 4 }}>Vencidas ({overdueCount})</div>
                  {getOverdueTasks().slice(0, 3).map(t => (
                    <div key={t.id} style={{ padding: '6px 10px', borderRadius: 6, marginBottom: 2, background: `${COLORS.alert}06`, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 10, color: COLORS.text, ...s, flex: 1 }}>{t.text}</span>
                      <button onClick={() => { onMoveTaskToDate(t.id, t.dueDate, todayStr); }} style={{ ...btnBase, padding: '2px 6px', background: `${COLORS.primary}10`, color: COLORS.primary, fontSize: 8 }}>Mover a hoy</button>
                      <button onClick={() => toggleTask(t.id)} style={{ ...btnBase, padding: '2px 6px', background: `${COLORS.success}10`, color: COLORS.success, fontSize: 8 }}>✓</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 4, fontSize: 10, color: COLORS.textDim, ...s, padding: '8px 12px', borderRadius: 8, background: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
                <span style={{ color: COLORS.primary, fontWeight: 600 }}>{'\u{1F4A1}'} Sugerencia:</span>{' '}
                {freeMins > 120 ? 'Tienes tiempo libre amplio. Ideal para programar tus tareas P1 en bloques de enfoque.' :
                 untimedTasks.length > 0 ? `Tienes ${untimedTasks.length} tareas sin hora. Asígnales un horario para mejorar tu productividad.` :
                 overdueCount > 0 ? `Tienes ${overdueCount} tareas vencidas. Reprogramarlas te ayudará a cerrar el día.` :
                 'Tu día está bien organizado. Buen trabajo!'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === TASK MODAL === */}
      {renderTaskModal()}
    </div>
  );
};

const HabitFlowApp = () => {
  const [data, setData] = useState(null);
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem('habitflow_active_view');
    return saved && saved !== 'reading' ? saved : 'dashboard';
  });
  const [confetti, setConfetti] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showMoreNav, setShowMoreNav] = useState(false);
  const [toast, setToast] = useState(null);
  const [cloudSync, setCloudSync] = useState({ status: 'checking', label: 'Conectando nube', reason: '' });
  const pushAutoSyncRef = useRef(false);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    const handleCloudSync = (event) => {
      if (event?.detail) setCloudSync(event.detail);
    };
    window.addEventListener('habitflow-cloud-sync', handleCloudSync);
    return () => window.removeEventListener('habitflow-cloud-sync', handleCloudSync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loaded = loadData();
    setData(loaded);
    setCloudSync({ status: 'checking', label: 'Conectando nube', reason: '' });

    (async () => {
      const cloud = await loadCloudData();
      if (cancelled) return;

      if (cloud.ok && cloud.data) {
        saveLocalData(cloud.data);
        setData(cloud.data);
        setCloudSync({ status: 'active', label: 'Nube activa', reason: 'Datos sincronizados con Supabase.' });
        return;
      }

      if (cloud.ok && !cloud.data) {
        const saved = await saveCloudDataNow(loaded);
        if (cancelled) return;
        setCloudSync(saved.ok
          ? { status: 'active', label: 'Nube activa', reason: 'Tus datos locales se subieron a tu usuario.' }
          : { status: 'local', label: 'Guardado local', reason: saved.reason });
        return;
      }

      setCloudSync({ status: 'local', label: 'Guardado local', reason: cloud.reason });
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (cloudSync.status !== 'active') return;
    if (pushAutoSyncRef.current) return;
    if (getNotificationPermissionState() !== 'granted') return;
    pushAutoSyncRef.current = true;
    requestHabitFlowNotifications().catch(() => {
      pushAutoSyncRef.current = false;
    });
  }, [cloudSync.status]);

  useEffect(() => {
    if (!data?.agenda) return;
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') return;

    const buildExpandedForAlarms = () => {
      const expanded = {};
      Object.entries(data.agenda || {}).forEach(([ds, ts]) => {
        (ts || []).forEach(t => {
          if (!expanded[ds]) expanded[ds] = [];
          expanded[ds].push(t);
          if (t.recurrence && t.recurrence !== 'none') {
            const dates = generateRecurrenceDates(t, t.dueDate || ds, 90);
            dates.forEach(d => {
              if (d !== (t.dueDate || ds)) {
                if (!expanded[d]) expanded[d] = [];
                if (!expanded[d].some(e => e.id === t.id)) expanded[d].push({ ...t, dueDate: d });
              }
            });
          }
        });
      });
      return expanded;
    };

    const checkDueNotifications = () => {
      const now = new Date();
      const expandedForAlarms = buildExpandedForAlarms();
      const sentMap = getSentNotificationMap();
      const keepAfter = now.getTime() - 7 * 86400000;
      Object.keys(sentMap).forEach(key => { if (sentMap[key] < keepAfter) delete sentMap[key]; });
      let changed = false;

      for (let dayOffset = -1; dayOffset <= 7; dayOffset++) {
        const dateStr = toYYYYMMDD(new Date(now.getTime() + dayOffset * 86400000));
        (expandedForAlarms[dateStr] || []).filter(t => t.alarm && t.dueTime && !t.completed).forEach(task => {
          const alarmTime = new Date(`${dateStr}T${task.dueTime}:00`);
          if (Number.isNaN(alarmTime.getTime())) return;
          const reminderId = task.reminders?.[0] || 'exact';
          const reminder = REMINDER_OPTIONS.find(option => option.id === reminderId) || REMINDER_OPTIONS[0];
          const notificationTime = new Date(alarmTime.getTime() - reminder.mins * 60000);
          const diff = notificationTime.getTime() - now.getTime();
          const dueWindow = diff <= 30000 && diff >= -10 * 60000;
          if (!dueWindow) return;
          const key = `${task.id}:${dateStr}:${task.dueTime}:${reminderId}`;
          if (sentMap[key]) return;
          sentMap[key] = now.getTime();
          changed = true;
          const when = reminder.mins > 0 ? `${reminder.label} · ${task.dueTime}` : `Es hora · ${task.dueTime}`;
          const category = task.category ? ` · ${task.category}` : '';
          showHabitFlowNotification('HabitFlow • Agenda', {
            body: `${task.text}\n${when}${category}`,
            tag: key,
            data: { view: 'agenda', taskId: task.id, date: dateStr },
            renotify: true
          });
        });
      }

      if (changed) saveSentNotificationMap(sentMap);
    };

    checkDueNotifications();
    const interval = setInterval(checkDueNotifications, 30000);
    const onWake = () => checkDueNotifications();
    window.addEventListener('focus', onWake);
    document.addEventListener('visibilitychange', onWake);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onWake);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, [data?.agenda]);

  const persist = useCallback((newData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const [showLevelUp, setShowLevelUp] = useState(null);
  const [showChallengeComplete, setShowChallengeComplete] = useState(null);
  const [showFocus, setShowFocus] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigateTo = useCallback((nextView) => {
    const safeView = nextView === 'reading' ? 'dashboard' : nextView;
    setView(safeView);
    localStorage.setItem('habitflow_active_view', safeView);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      const main = document.querySelector('.app-main');
      if (main) main.scrollTop = 0;
    });
  }, []);

  const awardXp = useCallback((prev, amount) => {
    const user = { ...prev.user };
    const oldLevel = getLevel(user.xp || 0);
    user.xp = (user.xp || 0) + amount;
    const newLevel = getLevel(user.xp);
    if (newLevel > oldLevel && newLevel > (user.levelUpShown || 0)) {
      user.level = newLevel;
      user.levelUpShown = newLevel;
      setTimeout(() => setShowLevelUp(newLevel), 600);
    }
    user.level = newLevel;
    return { ...prev, user };
  }, []);

  const onCompleteHabit = useCallback((habitId) => {
    const today = toYYYYMMDD(new Date());
    setToast(null);
    setData(prev => {
      const records = [...prev.records];
      const idx = records.findIndex(r => r.habitId === habitId && r.date === today);
      let xpGain = 0;
      let habitName = '';
      if (idx >= 0) {
        const wasCompleted = records[idx].completed;
        records[idx] = { ...records[idx], completed: !wasCompleted };
        if (!wasCompleted) {
          xpGain = 10;
          const streak = getCurrentStreak(habitId, records);
          if (streak >= 21) xpGain = 25;
          else if (streak >= 7) xpGain = 15;
          habitName = prev.habits.find(h => h.id === habitId)?.name || '';
          const rect = document.activeElement?.getBoundingClientRect();
          setConfetti({ x: rect?.left || window.innerWidth / 2, y: rect?.top || window.innerHeight / 2, key: Date.now() });
          setTimeout(() => setConfetti(null), 1000);
        }
      } else {
        records.push({ habitId, date: today, completed: true, note: '', mood: 0 });
        xpGain = 10;
        habitName = prev.habits.find(h => h.id === habitId)?.name || '';
        setConfetti({ x: window.innerWidth / 2, y: window.innerHeight / 2, key: Date.now() });
        setTimeout(() => setConfetti(null), 1000);
      }
      if (xpGain > 0) {
        const allToday = records.filter(r => r.date === today);
        const totalHabits = prev.habits.filter(h => h.active).length;
        const completedToday = allToday.filter(r => r.completed).length;
        if (completedToday === totalHabits) xpGain += 20;
        if (habitName) setToast({ message: `+${xpGain} XP - ${habitName}`, type: 'success' });
      }
      let newData = xpGain > 0 ? awardXp({ ...prev, records }, xpGain) : { ...prev, records };
      saveData(newData);
      return newData;
    });
  }, [awardXp]);

  const onUpdateRecord = useCallback((habitId, date, updates) => {
    setData(prev => {
      const records = [...prev.records];
      const idx = records.findIndex(r => r.habitId === habitId && r.date === date);
      if (idx >= 0) records[idx] = { ...records[idx], ...updates };
      else records.push({ habitId, date, completed: false, note: '', mood: 0, ...updates });
      const newData = { ...prev, records };
      saveData(newData);
      return newData;
    });
  }, []);

  const onSaveDailyNote = useCallback((date, note) => {
    setData(prev => {
      const dailyNotes = { ...(prev.dailyNotes || {}), [date]: note };
      const newData = { ...prev, dailyNotes };
      saveData(newData);
      return newData;
    });
  }, []);

  const onCompleteChallenge = useCallback((challengeId, habitId) => {
    setData(prev => {
      const challenges = prev.challenges.map(c =>
        c.id === challengeId ? { ...c, status: 'completed', completedDate: toYYYYMMDD(new Date()) } : c
      );
      let newData = awardXp({ ...prev, challenges }, 200);
      saveData(newData);
      setShowChallengeComplete(challengeId);
      return newData;
    });
  }, [awardXp]);

  const onJoinChallenge = useCallback((challengeData, habitData) => {
    setData(prev => {
      const habits = habitData ? [...prev.habits, habitData] : prev.habits;
      const challenges = [...(prev.challenges || []), challengeData];
      let newData = awardXp({ ...prev, habits, challenges }, 50);
      saveData(newData);
      return newData;
    });
  }, [awardXp]);

  const onAddHabit = useCallback((habit) => {
    setData(prev => {
      const newData = { ...prev, habits: [...prev.habits, habit] };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateHabit = useCallback((habit) => {
    setData(prev => {
      const habits = prev.habits.map(h => h.id === habit.id ? habit : h);
      const newData = { ...prev, habits };
      saveData(newData);
      return newData;
    });
  }, []);

  const onDeleteHabit = useCallback((id) => {
    setData(prev => {
      const newData = {
        ...prev,
        habits: prev.habits.filter(h => h.id !== id),
        records: prev.records.filter(r => r.habitId !== id)
      };
      saveData(newData);
      return newData;
    });
    setToast({ message: 'Datos aleatorios cargados en toda la app', type: 'success' });
  }, []);

  const onToggleHabit = useCallback((id) => {
    setData(prev => {
      const habits = prev.habits.map(h => h.id === id ? { ...h, active: !h.active } : h);
      const newData = { ...prev, habits };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateUser = useCallback((updates) => {
    setData(prev => {
      const newData = { ...prev, user: { ...prev.user, ...updates } };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateWorkout = useCallback((updater) => {
    setData(prev => {
      const newData = { ...prev, workoutData: updater(prev.workoutData) };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateFinance = useCallback((updater) => {
    setData(prev => {
      const newData = { ...prev, financeData: updater(prev.financeData || getFinanceData()) };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateReading = useCallback((updater) => {
    setData(prev => {
      const newData = { ...prev, readingData: updater(prev.readingData || getReadingData()) };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateStudy = useCallback((updater) => {
    setData(prev => {
      const newData = { ...prev, studyData: updater(prev.studyData || getStudyData()) };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateDreamGoals = useCallback((updater) => {
    setData(prev => {
      const newData = { ...prev, dreamGoals: updater(prev.dreamGoals || getDreamGoals()) };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdatePomodoro = useCallback((updater) => {
    setData(prev => {
      const newData = { ...prev, pomodoroRecords: updater(prev.pomodoroRecords || []) };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateAgenda = useCallback((date, updater) => {
    setData(prev => {
      const agenda = { ...(prev.agenda || {}) };
      agenda[date] = updater(agenda[date] || []);
      const newData = { ...prev, agenda };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateAgendaNote = useCallback((date, note) => {
    setData(prev => {
      const agendaNotes = { ...(prev.agendaNotes || {}) };
      if (note.trim()) agendaNotes[date] = note;
      else delete agendaNotes[date];
      const newData = { ...prev, agendaNotes };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateAgendaTodos = useCallback((date, updater) => {
    setData(prev => {
      const agendaTodos = { ...(prev.agendaTodos || {}) };
      const todos = updater(agendaTodos[date] || []);
      if (todos.length) agendaTodos[date] = todos;
      else delete agendaTodos[date];
      const newData = { ...prev, agendaTodos };
      saveData(newData);
      return newData;
    });
  }, []);

  const onUpdateAgendaTodoLabels = useCallback((updater) => {
    setData(prev => {
      const agendaTodoLabels = updater(prev.agendaTodoLabels || []);
      const newData = { ...prev, agendaTodoLabels };
      saveData(newData);
      return newData;
    });
  }, []);

  const onMoveTaskToDate = useCallback((taskId, fromDate, toDate) => {
    setData(prev => {
      const agenda = { ...(prev.agenda || {}) };
      const fromTasks = [...(agenda[fromDate] || [])];
      const idx = fromTasks.findIndex(t => t.id === taskId);
      if (idx === -1) return prev;
      const [task] = fromTasks.splice(idx, 1);
      const moved = { ...task, dueDate: toDate };
      agenda[fromDate] = fromTasks.length > 0 ? fromTasks : undefined;
      agenda[toDate] = [...(agenda[toDate] || []), moved];
      const newData = { ...prev, agenda };
      saveData(newData);
      return newData;
    });
  }, []);

  const onResetData = useCallback(async () => {
    const fresh = getDefaultData(true);
    const savedKey = data?.user?.youtubeApiKey;
    const savedPwd = data?.user?.youtubeKeyPassword;
    if (savedKey) fresh.user.youtubeApiKey = savedKey;
    if (savedPwd) fresh.user.youtubeKeyPassword = savedPwd;
    saveLocalData(fresh);
    await saveCloudDataNow(fresh);
    window.location.reload();
  }, [data]);

  const onGenerateRandomData = useCallback(() => {
    if (!window.confirm('Esto reemplazará tus datos actuales con datos aleatorios de demostración. ¿Quieres continuar?')) return;
    setData(prev => {
      const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const rand = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
      const moneyAmount = (min, max) => rand(min, max);
      const newHabits = genSampleHabits().map(h => ({
        ...h,
        id: `h_${uid()}`,
        targetStreak: rand(10, 45),
        createdAt: toYYYYMMDD(addDays(new Date(), -rand(35, 110)))
      }));
      const extraHabits = [
        { name: 'Escribir diario', description: 'Reflexion diaria', category: 'mente', icon: '\u{1F4DD}', color: '#e11d48', frequency: 'Diario' },
        { name: 'Estirar 10 min', description: 'Movilidad y flexibilidad', category: 'fitness', icon: '\u{1F9D8}', color: '#ff6b6b', frequency: 'Diario' },
        { name: 'No azucar', description: 'Evitar azucares procesados', category: 'salud', icon: '\u{1F34E}', color: '#00ff9d', frequency: 'Diario' },
        { name: 'Llamar a un amigo', description: 'Mantener conexiones', category: 'social', icon: '\u{1F4DE}', color: '#ffd93d', frequency: 'Lun-Vie' },
        { name: 'Dibujar algo', description: 'Creatividad diaria', category: 'creatividad', icon: '\u{1F3A8}', color: '#e11d48', frequency: 'Fines de semana' }
      ].map(h => ({
        ...h,
        id: `h_${uid()}`,
        targetStreak: rand(7, 35),
        active: true,
        createdAt: toYYYYMMDD(addDays(new Date(), -rand(28, 95)))
      }));
      const allHabits = [...newHabits, ...extraHabits].map((h, index) => ({
        ...h,
        targetStreak: h.targetStreak || rand(14, 45),
        icon: isBrokenHabitIcon(h.icon) ? getCategoryIcon(h.category) : h.icon,
        lastFocusSession: Math.random() > 0.55 ? toYYYYMMDD(addDays(new Date(), -rand(0, 8))) : null,
        order: index
      }));
      const today = toYYYYMMDD(new Date());
      let newRecords = genSampleRecords(allHabits);
      allHabits.forEach(h => {
        const existing = newRecords.find(r => r.habitId === h.id && r.date === today);
        if (!existing) {
          newRecords.push({ habitId: h.id, date: today, completed: Math.random() > 0.22, note: Math.random() > 0.7 ? 'Dato demo aleatorio' : '', mood: rand(3, 5) });
        }
      });

      const taskTexts = [
        'Comprar supermercado', 'Pagar luz', 'Revisar presupuesto', 'Entrenar piernas',
        'Preparar reunion', 'Estudiar finanzas', 'Ordenar escritorio', 'Llamar al banco',
        'Planificar semana', 'Enviar reporte'
      ];
      const todoLabels = ['Casa', 'Trabajo', 'Compras', 'Finanzas', 'Estudios', 'Salud'];
      const agenda = {};
      const agendaNotes = {};
      const agendaTodos = {};
      Array.from({ length: 16 }, (_, dayIndex) => addDays(new Date(), dayIndex - 5)).forEach((date, dayIndex) => {
        const ds = toYYYYMMDD(date);
        agendaNotes[ds] = pick(['Dia de foco profundo', 'Revisar prioridades y cerrar pendientes', 'Mantener ritmo sin saturarme', 'Dia ideal para avanzar tareas pequenas']);
        agenda[ds] = Array.from({ length: rand(2, 5) }, (_, i) => {
          const startHour = rand(8, 19);
          const startTime = `${String(startHour).padStart(2, '0')}:${String([0, 15, 30, 45][rand(0, 3)]).padStart(2, '0')}`;
          const endTime = minutesToTime(timeToMinutes(startTime) + rand(30, 100));
          const recurrence = Math.random() > 0.82 ? pick(['daily', 'weekdays', 'weekly', 'monthly']) : 'none';
          return {
            id: `task_${uid()}_${dayIndex}_${i}`,
            text: pick(taskTexts),
            completed: dayIndex < 5 ? Math.random() > 0.35 : Math.random() > 0.75,
            priority: rand(1, 4),
            category: pick(AGENDA_CATEGORIES),
            note: Math.random() > 0.45 ? pick(['Importante', 'Hacerlo temprano', 'Revisar despues', 'Bloque de enfoque']) : '',
            dueDate: ds,
            startTime,
            endTime,
            dueTime: startTime,
            alarm: Math.random() > 0.55,
            recurrence,
            reminders: Math.random() > 0.55 ? [pick(['exact', '10min', '30min', '1hour'])] : [],
            subtasks: Array.from({ length: rand(0, 3) }, (_, si) => ({ text: pick(['Preparar', 'Revisar', 'Confirmar', 'Enviar']), completed: Math.random() > 0.5 })),
            tags: [],
            status: Math.random() > 0.75 ? 'in_progress' : 'pending',
            order: i
          };
        });
        agendaTodos[ds] = Array.from({ length: rand(3, 8) }, (_, i) => ({
          id: `todo_${uid()}_${dayIndex}_${i}`,
          text: pick(['Comprar cafe', 'Lavar ropa', 'Responder mensaje', 'Actualizar presupuesto', 'Repasar apuntes', 'Preparar comida', 'Revisar facturas', 'Organizar archivos']),
          completed: Math.random() > 0.58,
          label: pick(todoLabels)
        }));
      });

      const newWorkout = getWorkoutData();
      const financeCategories = [
        { id: 'food', name: 'Comida', color: '#efefef' },
        { id: 'home', name: 'Casa', color: '#e11d48' },
        { id: 'transport', name: 'Transporte', color: '#ff6b6b' },
        { id: 'health', name: 'Salud', color: '#00ff9d' },
        { id: 'fun', name: 'Ocio', color: '#ffd93d' },
        { id: 'education', name: 'Educacion', color: '#a0a0b8' },
        { id: 'income', name: 'Ingresos', color: '#10b981' }
      ];
      const financeAccounts = [
        { id: 'cash', name: 'Efectivo', type: 'cash', balance: moneyAmount(80, 420) },
        { id: 'bank', name: 'Cuenta principal', type: 'bank', balance: moneyAmount(1400, 4200) },
        { id: 'card', name: 'Tarjeta', type: 'credit', balance: -moneyAmount(120, 900) }
      ];
      const payees = {
        food: ['Supermercado', 'Restaurante', 'Cafe'],
        home: ['Renta', 'Internet', 'Servicios'],
        transport: ['Gasolina', 'Uber', 'Metro'],
        health: ['Farmacia', 'Gimnasio', 'Consulta'],
        fun: ['Cine', 'Salida', 'Streaming'],
        education: ['Curso', 'Libro', 'Plataforma']
      };
      const financeTransactions = [];
      Array.from({ length: 90 }, (_, i) => {
        const d = addDays(new Date(), -rand(0, 90));
        const cat = pick(financeCategories.filter(c => c.id !== 'income'));
        financeTransactions.push({
          id: `fin_${uid()}_${i}`,
          type: 'expense',
          amount: moneyAmount(8, cat.id === 'home' ? 620 : 180),
          category: cat.id,
          accountId: pick(financeAccounts).id,
          payee: pick(payees[cat.id] || ['Movimiento']),
          note: pick(['Dato demo', 'Pago registrado', 'Compra mensual', 'Movimiento aleatorio']),
          date: toYYYYMMDD(d)
        });
      });
      Array.from({ length: 4 }, (_, i) => {
        financeTransactions.push({
          id: `fin_income_${uid()}_${i}`,
          type: 'income',
          amount: moneyAmount(1800, 3600),
          category: 'income',
          accountId: 'bank',
          payee: pick(['Empresa', 'Cliente', 'Proyecto freelance']),
          note: 'Ingreso demo',
          date: toYYYYMMDD(addDays(new Date(), -i * 30))
        });
      });
      const financeData = {
        currency: 'USD',
        copRate: 4000,
        monthlyBudget: moneyAmount(1400, 2600),
        categories: financeCategories,
        budgets: { food: moneyAmount(260, 520), home: moneyAmount(500, 900), transport: moneyAmount(100, 260), health: moneyAmount(80, 220), fun: moneyAmount(90, 260), education: moneyAmount(80, 240) },
        accounts: financeAccounts,
        recurring: [
          { id: `rec_${uid()}_1`, name: 'Renta', type: 'expense', amount: moneyAmount(480, 850), category: 'home', day: 5, active: true },
          { id: `rec_${uid()}_2`, name: 'Internet', type: 'expense', amount: moneyAmount(35, 75), category: 'home', day: 12, active: true },
          { id: `rec_${uid()}_3`, name: 'Gimnasio', type: 'expense', amount: moneyAmount(30, 90), category: 'health', day: 18, active: true },
          { id: `rec_${uid()}_4`, name: 'Ingreso principal', type: 'income', amount: moneyAmount(2200, 3600), category: 'income', day: 1, active: true }
        ],
        goals: [
          { id: `goal_${uid()}_1`, name: 'Fondo de emergencia', target: moneyAmount(1800, 4200), saved: moneyAmount(300, 1200), dueDate: toYYYYMMDD(addDays(new Date(), rand(90, 220))) },
          { id: `goal_${uid()}_2`, name: 'Viaje', target: moneyAmount(900, 2400), saved: moneyAmount(120, 700), dueDate: toYYYYMMDD(addDays(new Date(), rand(60, 180))) }
        ],
        transactions: financeTransactions.sort((a, b) => b.date.localeCompare(a.date))
      };

      const studySubjects = [
        { id: `sub_${uid()}_1`, name: 'Finanzas personales', color: '#e11d48', goalHours: rand(8, 18), topics: [
          { id: `top_${uid()}_1`, name: 'Presupuesto mensual', completed: true },
          { id: `top_${uid()}_2`, name: 'Flujo de caja', completed: Math.random() > 0.4 },
          { id: `top_${uid()}_3`, name: 'Metas de ahorro', completed: false }
        ] },
        { id: `sub_${uid()}_2`, name: 'Productividad', color: '#efefef', goalHours: rand(6, 14), topics: [
          { id: `top_${uid()}_4`, name: 'Sistema semanal', completed: true },
          { id: `top_${uid()}_5`, name: 'Deep work', completed: Math.random() > 0.5 }
        ] },
        { id: `sub_${uid()}_3`, name: 'Ingles', color: '#ff6b6b', goalHours: rand(10, 20), topics: [
          { id: `top_${uid()}_6`, name: 'Listening', completed: Math.random() > 0.5 },
          { id: `top_${uid()}_7`, name: 'Vocabulary', completed: false }
        ] }
      ];
      const studyData = {
        subjects: studySubjects,
        sessions: Array.from({ length: 28 }, (_, i) => {
          const subject = pick(studySubjects);
          return { id: `study_${uid()}_${i}`, subjectId: subject.id, minutes: rand(20, 95), note: pick(['Repaso', 'Ejercicios', 'Resumen', 'Practica enfocada']), date: toYYYYMMDD(addDays(new Date(), -rand(0, 45))) };
        }).sort((a, b) => b.date.localeCompare(a.date))
      };

      const pomodoroRecords = Array.from({ length: 34 }, (_, i) => ({
        id: `pom_${uid()}_${i}`,
        date: toYYYYMMDD(addDays(new Date(), -rand(0, 30))),
        mode: 'focus',
        focusTime: pick([25, 30, 35, 45, 50]),
        completedAt: new Date(Date.now() - rand(0, 30) * 86400000).toISOString()
      }));
      const dreamGoals = getDreamGoals().map((goal, i) => {
        const target = moneyAmount(i === 0 ? 55000 : 8000, i === 0 ? 120000 : 45000);
        return {
          ...goal,
          id: `dream_${uid()}_${i}`,
          target,
          current: moneyAmount(Math.round(target * 0.18), Math.round(target * 0.88))
        };
      });
      const dailyNotes = {};
      Array.from({ length: 20 }, (_, i) => {
        const ds = toYYYYMMDD(addDays(new Date(), -i));
        dailyNotes[ds] = { note: pick(['Buen dia de prueba con datos aleatorios', 'Mucho enfoque y buen avance', 'Dia normal, mantener consistencia', 'Excelente energia hoy']), mood: rand(2, 5) };
      });
      const xp = newRecords.filter(r => r.completed).length * 10;
      const newData = {
        ...prev,
        habits: allHabits,
        records: newRecords,
        workoutData: newWorkout,
        financeData,
        readingData: getReadingData(),
        studyData,
        agenda,
        agendaNotes,
        agendaTodos,
        agendaTodoLabels: todoLabels,
        pomodoroRecords,
        dreamGoals,
        dailyNotes,
        challenges: allHabits.slice(0, 3).map((h, i) => ({ id: `ch_${uid()}_${i}`, habitId: h.id, startDate: toYYYYMMDD(addDays(new Date(), -rand(7, 30))), status: Math.random() > 0.25 ? 'active' : 'completed' })),
        user: { ...prev.user, xp, level: getLevel(xp), levelUpShown: getLevel(xp) }
      };
      saveData(newData);
      return newData;
    });
  }, []);

  const accentColor = data?.user?.accentColor || 'violet';
  const themeMode = THEME_MODES.find(t => t.id === (data?.user?.themeMode || 'midnight')) || THEME_MODES[0];
  Object.assign(COLORS, themeMode.colors);
  const theme = THEME_VARIANTS.find(t => t.id === accentColor) || THEME_VARIANTS[0];
  const iconTheme = ICON_COLOR_PALETTE.find(t => t.id === (data?.user?.iconColor || 'fire')) || ICON_COLOR_PALETTE[0];
  COLORS.primary = theme.primary;
  COLORS.secondary = theme.secondary;

  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primary);
      document.documentElement.style.setProperty('--app-bg', COLORS.bg);
      document.documentElement.style.setProperty('--app-text', COLORS.text);
      document.documentElement.style.setProperty('--app-text-dim', COLORS.textDim);
      document.documentElement.style.setProperty('--app-surface', COLORS.surface);
      document.documentElement.style.setProperty('--app-card', COLORS.card);
      document.documentElement.style.setProperty('--app-border', COLORS.border);
      document.documentElement.style.setProperty('--tooltip-bg', COLORS.card);
      document.documentElement.style.setProperty('--tooltip-border', COLORS.border);
      document.documentElement.style.setProperty('--header-bg', themeMode.id === 'pinkLight' ? 'rgba(255,247,251,0.92)' : 'rgba(0,0,0,0.92)');
      document.documentElement.style.setProperty('--mobile-nav-bg', themeMode.id === 'pinkLight' ? 'rgba(255,240,246,0.94)' : 'rgba(5,5,5,0.94)');
      document.documentElement.style.setProperty('--mobile-nav-shadow', themeMode.id === 'pinkLight' ? 'rgba(190,18,60,0.12)' : 'rgba(0,0,0,0.42)');
      document.documentElement.style.setProperty('--icon-primary', iconTheme.primary);
      document.documentElement.style.setProperty('--icon-hover', iconTheme.hover);
      document.documentElement.style.setProperty('--icon-deep', iconTheme.deep);
      document.documentElement.style.setProperty('--icon-rgb', iconTheme.rgb);
      document.documentElement.dataset.themeMode = themeMode.id;
      document.body.style.background = COLORS.bg;
      document.body.style.color = COLORS.text;
    }
  }, [theme, themeMode, iconTheme]);

  if (!data) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: COLORS.bg, color: COLORS.textDim,
        flexDirection: 'column', gap: 16
      }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontSize: 14, fontFamily: "'Inter', sans-serif" }}>Cargando...</div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Panel', icon: <Activity size={20} /> },
    { id: 'habits', label: 'Hábitos', icon: <Target size={20} /> },
    { id: 'pomodoro', label: 'Pomodoro', icon: <Clock size={20} /> },
    { id: 'workout', label: 'Entreno', icon: <Dumbbell size={20} /> },
    { id: 'agenda', label: 'Agenda', icon: <List size={20} /> },
    { id: 'dreams', label: 'Metas', icon: <Sparkles size={20} /> },
    { id: 'finance', label: 'Finanzas', icon: <CreditCard size={20} /> },
    { id: 'stats', label:  'Estadísticas', icon: <BarChart3 size={20} /> },
    { id: 'settings', label:  'Configuración', icon: <Settings size={20} /> }
  ];

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardView data={data} onCompleteHabit={onCompleteHabit} workoutData={data.workoutData} onNavigate={navigateTo} onUpdateUser={onUpdateUser} />;
      case 'habits': return <HabitsView data={data} onAddHabit={onAddHabit} onUpdateHabit={onUpdateHabit} onDeleteHabit={onDeleteHabit} onToggleHabit={onToggleHabit} onCompleteHabit={onCompleteHabit} onUpdateRecord={onUpdateRecord} records={data.records} />;
      case 'pomodoro': return <PomodoroView data={data} onUpdateUser={onUpdateUser} onUpdatePomodoro={onUpdatePomodoro} />;
      case 'workout': return <WorkoutView data={data} onUpdateData={onUpdateWorkout} onCompleteHabit={onCompleteHabit} awardXp={(prev, amt) => awardXp(prev, amt)} />;
      case 'agenda': return <AgendaView data={data} onUpdateAgenda={onUpdateAgenda} onUpdateAgendaNote={onUpdateAgendaNote} onUpdateAgendaTodos={onUpdateAgendaTodos} onUpdateAgendaTodoLabels={onUpdateAgendaTodoLabels} onMoveTaskToDate={onMoveTaskToDate} onCompleteHabit={onCompleteHabit} />;
      case 'dreams': return <DreamGoalsView data={data} onUpdateDreamGoals={onUpdateDreamGoals} />;
      case 'finance': return <FinanceView data={data} onUpdateFinance={onUpdateFinance} />;
      case 'stats': return <StatisticsView data={data} />;
      case 'settings': return <SettingsView data={data} onUpdateUser={onUpdateUser} onResetData={onResetData} />;
      default: return <DashboardView data={data} onCompleteHabit={onCompleteHabit} workoutData={data.workoutData} onNavigate={navigateTo} onUpdateUser={onUpdateUser} />;
    }
  };

  const sidebarWidth = sidebarOpen ? 240 : 64;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg }}>
      {confetti && <Confetti key={confetti.key} x={confetti.x} y={confetti.y} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button className="sidebar-toggle" onClick={() => setSidebarOpen(s => !s)} style={{
        position: 'fixed', left: sidebarWidth - 12, top: 24, zIndex: 110,
        width: 28, height: 28, borderRadius: '50%', border: `1px solid ${COLORS.border}`,
        background: sidebarOpen ? COLORS.surface : COLORS.card, color: COLORS.textDim, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'left 0.3s ease, background 0.3s ease', padding: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }} title={sidebarOpen ? 'Ocultar nombres' : 'Mostrar nombres'}>
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`} style={{
        width: sidebarWidth, overflow: 'hidden',
        background: COLORS.surface, borderRight: 'none',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0,
        height: '100vh', zIndex: 100, transition: 'width 0.3s ease'
      }}>
        <div className="user-info" style={{ padding: sidebarOpen ? '20px 16px' : '16px 8px', borderBottom: `1px solid ${COLORS.border}`, transition: 'padding 0.3s ease', textAlign: sidebarOpen ? 'left' : 'center' }}>
          <BrandLogo size="sm" compact={!sidebarOpen} center={!sidebarOpen} />
          <div style={{ display: sidebarOpen ? 'block' : 'none', fontSize: 11, color: COLORS.textDim, lineHeight: 1.4, marginTop: 4 }}>
              {data.user.motto}
          </div>
          <div style={{ marginTop: sidebarOpen ? 12 : 10, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${theme.primary}, #7f1028)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              {data.user.level || 1}
            </div>
            <div style={{ flex: 1, display: sidebarOpen ? 'block' : 'none' }}>
              <div style={{ height: 6, background: COLORS.bg, borderRadius: 3, overflow: 'hidden' }}>
                {(() => { const p = getXpProgress(data.user.xp || 0); const pct = p.needed > 0 ? (p.xp / p.needed) * 100 : 0; return <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${theme.primary}, #7f1028)`, borderRadius: 3, transition: 'width 0.5s ease' }} />; })()}
              </div>
              <div style={{ fontSize: 9, color: COLORS.textDim, marginTop: 2 }}>Nv.{data.user.level || 1} - {(data.user.xp || 0)} XP</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: sidebarOpen ? '16px 12px' : '16px 8px', display: 'flex', flexDirection: 'column', gap: 4, transition: 'padding 0.3s ease' }}>
          {navItems.map(item => (
            <button key={item.id} aria-label={item.label} title={item.label} onClick={() => { navigateTo(item.id); setMobileMenu(false); }} style={{
              display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: sidebarOpen ? 12 : 0,
              padding: sidebarOpen ? '12px 16px' : '12px 0', borderRadius: 10,
              border: 'none', background: view === item.id ? `${theme.primary}15` : 'transparent',
              color: view === item.id ? theme.primary : COLORS.textDim,
              cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s', position: 'relative', width: '100%', textAlign: 'left'
            }}>
              <span className="nav-icon" style={{ display: 'flex' }}>{item.icon}</span>
              <span className="nav-label" style={{ display: sidebarOpen ? 'inline' : 'none' }}>{item.label}</span>
              {view === item.id && (
                <div className="nav-indicator" style={{
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  width: 3, height: 24, borderRadius: '0 4px 4px 0',
                  background: theme.primary, boxShadow: `0 0 8px ${theme.primary}60`
                }} />
              )}
            </button>
          ))}
        </nav>

        <div className="user-info" style={{ padding: sidebarOpen ? '16px 20px' : '14px 8px', borderTop: `1px solid ${COLORS.border}`, fontSize: 11, color: COLORS.textDim }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', gap: sidebarOpen ? 8 : 4, margin: sidebarOpen ? 0 : '0 auto', minHeight: 24, borderRadius: 9, background: sidebarOpen ? 'transparent' : `${COLORS.alert}10`, border: sidebarOpen ? 'none' : `1px solid ${COLORS.alert}24`, color: sidebarOpen ? COLORS.textDim : COLORS.text, fontWeight: sidebarOpen ? 400 : 700 }} title={`Racha global: ${getGlobalCurrentStreak(data.habits, data.records)} días`}>
            <Flame size={sidebarOpen ? 14 : 13} color={COLORS.alert} />
            {!sidebarOpen && <span className="streak-compact-count">{getGlobalCurrentStreak(data.habits, data.records)}</span>}
            Racha global: {getGlobalCurrentStreak(data.habits, data.records)} días
          </div>
        </div>
      </aside>

      <div className="content-area" style={{
        marginLeft: sidebarWidth, flex: 1, minHeight: '100vh', transition: 'margin-left 0.3s ease'
      }}>
        <header style={{
          background: COLORS.surface, borderBottom: 'none',
          padding: '16px 32px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', position: 'sticky', top: 0, zIndex: 50
        }}>
          <div className="top-identity" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="mobile-header-btn" onClick={() => setMobileMenu(!mobileMenu)} style={{
              background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer',
              padding: 4
            }}>
              <Menu size={24} />
            </button>
            <div>
              <div style={{ fontSize: 14, color: COLORS.text, fontFamily: "'DM Serif Display', serif" }}>
                {data.user.name}
              </div>
              <div style={{ fontSize: 11, color: COLORS.textDim }}>
                {formatDateSpanish(new Date())}
              </div>
              <div style={{ fontSize: 9, color: theme.primary, letterSpacing: '0.04em' }}>
                {navItems.find(n => n.id === view)?.label || view}
              </div>
            </div>
          </div>
          <div className="top-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {(() => {
              const syncColor = cloudSync.status === 'active' ? COLORS.success : cloudSync.status === 'saving' ? theme.primary : COLORS.textDim;
              const syncBg = cloudSync.status === 'active' ? `${COLORS.success}10` : cloudSync.status === 'saving' ? `${theme.primary}14` : `${COLORS.alert}0f`;
              const syncBorder = cloudSync.status === 'active' ? COLORS.success : cloudSync.status === 'saving' ? `${theme.primary}80` : COLORS.border;
              const syncIcon = cloudSync.status === 'active' ? '\u{2601}\u{FE0F}' : cloudSync.status === 'saving' ? '\u{21BB}' : '\u{1F4BE}';
              return (
                <div className="top-sync" title={cloudSync.reason || cloudSync.label} style={{
                  padding: '6px 10px', borderRadius: 999,
                  border: `1px solid ${syncBorder}`,
                  background: syncBg,
                  color: syncColor,
                  fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  {syncIcon} {cloudSync.label}
                </div>
              );
            })()}
            <button className="top-random" onClick={onGenerateRandomData} title="Generar datos aleatorios" style={{
              padding: '6px 12px', borderRadius: 8, border: 'none',
              background: `${theme.primary}12`, color: theme.primary,
              cursor: 'pointer', fontSize: 11, fontFamily: "'Inter', sans-serif",
              display: 'flex', alignItems: 'center', gap: 4
            }}>
              <Sparkles size={13} /> Aleatorio
            </button>
            <div className="top-streak" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: COLORS.alert }}>
              <Flame size={16} /> {getGlobalCurrentStreak(data.habits, data.records)}
            </div>
            <div className="top-xp" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textDim, fontFamily: "'Inter', sans-serif" }}>
              <Award size={14} color={theme.primary} />
              <span>Nv.{data.user.level || 1}</span>
              <div style={{ width: 60, height: 5, background: COLORS.bg, borderRadius: 3, overflow: 'hidden' }}>
                {(() => { const p = getXpProgress(data.user.xp || 0); const pct = p.needed > 0 ? (p.xp / p.needed) * 100 : 0; return <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${theme.primary}, #7f1028)`, borderRadius: 3, transition: 'width 0.5s ease' }} />; })()}
              </div>
              <span style={{ fontSize: 10 }}>{(data.user.xp || 0)}</span>
            </div>
            <div className="top-user"><ClerkUserButtonMount /></div>
          </div>
        </header>

        <main className="app-main">
          <div className="view-enter" key={view}>
            <ErrorBoundary>
              {renderView()}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {mobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenu(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90
        }} />
      )}

      <nav className="mobile-bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: COLORS.surface, borderTop: `1px solid ${COLORS.border}`,
        display: 'none', zIndex: 100, justifyContent: 'space-around',
        padding: '8px 0', paddingBottom: 'calc(8px + env(safe-area-inset-bottom))'
      }}>
        {navItems.slice(0, 4).map(item => (
          <button key={item.id} aria-label={item.label} title={item.label} onClick={() => { navigateTo(item.id); setShowMoreNav(false); }} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '8px 12px', borderRadius: 8, border: 'none',
            background: view === item.id ? `${theme.primary}15` : 'transparent',
            color: view === item.id ? theme.primary : COLORS.textDim,
            cursor: 'pointer', fontSize: 10, fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s', flex: 1
          }}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        <div style={{ position: 'relative', flex: 1 }}>
          <button aria-label="Más secciones" title="Más secciones" onClick={() => setShowMoreNav(s => !s)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '8px 12px', borderRadius: 8, border: 'none', width: '100%',
            background: showMoreNav ? `${theme.primary}15` : 'transparent',
            color: showMoreNav ? theme.primary : COLORS.textDim,
            cursor: 'pointer', fontSize: 10, fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s'
          }}>
            <Menu size={20} />
            <span>Más</span>
          </button>
          {showMoreNav && (
            <div className="mobile-more-popover" style={{
              position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
              background: COLORS.surface, borderRadius: 12, border: `1px solid ${COLORS.border}`,
              padding: 8, boxShadow: '0 -8px 32px rgba(0,0,0,0.3)', minWidth: 160,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              {navItems.slice(4).map(item => (
                <button className="mobile-more-item" key={item.id} aria-label={item.label} title={item.label} onClick={() => { navigateTo(item.id); setShowMoreNav(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 14px', borderRadius: 8, border: 'none',
                  background: view === item.id ? `${theme.primary}15` : 'transparent',
                  color: view === item.id ? theme.primary : COLORS.textDim,
                  cursor: 'pointer', fontSize: 13, fontFamily: "'Inter', sans-serif",
                  textAlign: 'left', transition: 'all 0.2s'
                }}>
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <LevelUpModal open={showLevelUp !== null} level={showLevelUp} onClose={() => setShowLevelUp(null)} />
      {showChallengeComplete !== null && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, background: `linear-gradient(135deg, ${COLORS.success}, #9f1239)`, borderRadius: 12, padding: '16px 24px', color: '#000', fontFamily: "'Inter', sans-serif", fontSize: 14, boxShadow: `0 8px 32px ${COLORS.success}40`, animation: 'slideIn 0.3s ease-out', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Award size={24} /> Reto completado! +200 XP
          <button onClick={() => setShowChallengeComplete(null)} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: 4, fontSize: 16 }}><X size={16} /></button>
        </div>
      )}
      {showFocus && <FocusMode habits={data.habits} records={data.records} onCompleteHabit={onCompleteHabit} onClose={() => setShowFocus(false)} />}
    </div>
  );
};

const App = () => {
  useEffect(() => { injectStyles(); }, []);
  return (
    <AuthGate>
      <HabitFlowApp />
    </AuthGate>
  );
};

export default App;

