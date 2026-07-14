(function registerHabitFlowWorkoutFeature(global) {
  const {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
  } = React;
  const iconFallback = global.lucideReact.Circle || global.lucideReact.Activity || (() => null);
  const icons = new Proxy(global.lucideReact, {
    get(target, property) { return target[property] || iconFallback; }
  });
  const {
    Activity, AlarmClock, ArrowDown, ArrowUp, BarChart3, Bookmark, BookOpen,
    Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Dumbbell,
    Edit, GripVertical, Heart, List, ListChecks, MoreHorizontal, Pause, Pencil,
    Play, Plus, RefreshCw, Repeat, Save, Search, Settings, StopCircle, Timer,
    Trash2, TrendingUp, Trophy, X, Zap
  } = icons;
  const ArrowLeft = icons.ArrowLeft || ChevronLeft;
  const CalendarDays = icons.CalendarDays || Calendar;
  const CirclePause = icons.CirclePause || Pause;
  const CirclePlay = icons.CirclePlay || Play;
  const Clock3 = icons.Clock3 || Clock;
  const Copy = icons.Copy || Repeat;
  const Edit3 = icons.Edit3 || Edit;
  const Flag = icons.Flag || Bookmark;
  const History = icons.History || Clock;
  const Layers3 = icons.Layers3 || List;
  const LibraryBig = icons.LibraryBig || BookOpen;
  const MoreVertical = icons.MoreVertical || MoreHorizontal;
  const Repeat2 = icons.Repeat2 || Repeat;
  const Weight = icons.Weight || Dumbbell;
  const Wrench = icons.Wrench || Settings;

  const dataset = global.HabitFlowExerciseDataset;
  const SCREEN_IDS = ['summary', 'routines', 'library', 'detail', 'builder', 'active', 'progress', 'history'];
  const SCREEN_TABS = [
    ['summary', 'Resumen'],
    ['routines', 'Rutinas'],
    ['library', 'Ejercicios'],
    ['progress', 'Progreso'],
    ['history', 'Historial']
  ];
  const DAY_OPTIONS = [
    ['mon', 'L', 'Lunes'], ['tue', 'M', 'Martes'], ['wed', 'X', 'Miércoles'], ['thu', 'J', 'Jueves'], ['fri', 'V', 'Viernes'], ['sat', 'S', 'Sábado'], ['sun', 'D', 'Domingo']
  ];
  const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const CATEGORY_ES = {
    back: 'Espalda', cardio: 'Cardio', chest: 'Pecho', 'lower arms': 'Antebrazos',
    'lower legs': 'Pantorrillas', neck: 'Cuello', shoulders: 'Hombros',
    'upper arms': 'Brazos', 'upper legs': 'Piernas', waist: 'Core'
  };
  const EQUIPMENT_ES = {
    barbell: 'Barra', dumbbell: 'Mancuernas', cable: 'Polea', 'body weight': 'Peso corporal',
    kettlebell: 'Kettlebell', band: 'Banda', 'assisted': 'Asistido', machine: 'Máquina',
    'leverage machine': 'Máquina de palanca', 'smith machine': 'Máquina Smith',
    'weighted': 'Con peso', 'stability ball': 'Fitball', rope: 'Cuerda',
    'medicine ball': 'Balón medicinal', 'bosu ball': 'Bosu', roller: 'Rodillo',
    wheel: 'Rueda', sled: 'Trineo', tire: 'Neumático', trapbar: 'Barra hexagonal',
    'ez barbell': 'Barra EZ', 'olympic barbell': 'Barra olímpica',
    'resistance band': 'Banda de resistencia', 'elliptical machine': 'Elíptica',
    hammer: 'Martillo', 'skierg machine': 'Máquina de esquí', 'sled machine': 'Trineo',
    'stationary bike': 'Bicicleta estática', 'stepmill machine': 'Escaladora',
    'trap bar': 'Barra hexagonal', 'upper body ergometer': 'Ergómetro de tren superior',
    'wheel roller': 'Rueda abdominal'
  };
  const MUSCLE_ES = {
    abdominals: 'Abdominales', abductors: 'Abductores', abs: 'Abdominales', adductors: 'Aductores',
    'ankle stabilizers': 'Estabilizadores del tobillo', ankles: 'Tobillos', back: 'Espalda',
    biceps: 'Bíceps', brachialis: 'Braquial', calves: 'Pantorrillas',
    'cardiovascular system': 'Sistema cardiovascular', chest: 'Pecho', core: 'Core',
    deltoids: 'Deltoides', delts: 'Deltoides', feet: 'Pies', forearms: 'Antebrazos',
    glutes: 'Glúteos', 'grip muscles': 'Músculos de agarre', groin: 'Ingle',
    hamstrings: 'Isquiotibiales', hands: 'Manos', 'hip flexors': 'Flexores de cadera',
    'inner thighs': 'Cara interna de los muslos', 'latissimus dorsi': 'Dorsal ancho',
    lats: 'Dorsales', 'levator scapulae': 'Elevador de la escápula',
    'lower abs': 'Abdominales inferiores', 'lower back': 'Zona lumbar', obliques: 'Oblicuos',
    pectorals: 'Pectorales', quadriceps: 'Cuádriceps', quads: 'Cuádriceps',
    'rear deltoids': 'Deltoides posteriores', rhomboids: 'Romboides',
    'rotator cuff': 'Manguito rotador', 'serratus anterior': 'Serrato anterior',
    shins: 'Tibiales', shoulders: 'Hombros', soleus: 'Sóleo', spine: 'Columna',
    sternocleidomastoid: 'Esternocleidomastoideo', trapezius: 'Trapecio', traps: 'Trapecios',
    triceps: 'Tríceps', 'upper back': 'Espalda alta', 'upper chest': 'Pecho superior',
    'wrist extensors': 'Extensores de la muñeca', 'wrist flexors': 'Flexores de la muñeca',
    wrists: 'Muñecas'
  };
  const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const nowIso = () => new Date().toISOString();
  const dateKey = (value = new Date()) => {
    const d = value instanceof Date ? value : new Date(value);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const displayLabel = (value, dictionary = {}) => dictionary[value] || String(value || 'Sin especificar').replace(/\b\w/g, c => c.toUpperCase());
  const displayMuscle = value => displayLabel(value, MUSCLE_ES);
  const formatMinutes = (minutes) => {
    const total = Math.max(0, Math.round(Number(minutes || 0)));
    if (total < 60) return `${total} min`;
    return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, '0')}m`;
  };
  const formatElapsed = (seconds) => {
    const value = Math.max(0, Math.floor(Number(seconds || 0)));
    const hours = Math.floor(value / 3600);
    const mins = Math.floor((value % 3600) / 60);
    const secs = value % 60;
    return `${hours ? `${String(hours).padStart(2, '0')}:` : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  const routineDuration = (routine) => Math.max(10, Math.round((routine?.exercises || []).reduce((sum, item) => (
    sum + Math.max(1, Number(item.sets || 1)) * (1.25 + Math.max(15, Number(item.restSeconds || item.rest || 60)) / 60)
  ), 4)));
  const routineSets = (routine) => (routine?.exercises || []).reduce((sum, item) => sum + Math.max(0, Number(item.sets || 0)), 0);
  const exerciseIdOf = (item) => String(item?.exerciseId || item?.eid || item?.id || '');
  const sessionDuration = (session) => Number(session?.durationMinutes || session?.duration || 0);
  const sessionDate = (session) => session?.date || String(session?.completedAt || session?.startedAt || '').slice(0, 10);
  const sessionVolume = (session) => Number(session?.totalVolume || 0);
  const getWeekStart = (value = new Date()) => {
    const d = new Date(value);
    d.setHours(12, 0, 0, 0);
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    return d;
  };
  const addDays = (value, amount) => {
    const d = new Date(value);
    d.setDate(d.getDate() + amount);
    return d;
  };
  const daysSince = (value) => {
    if (!value) return null;
    const diff = Math.floor((new Date(`${dateKey()}T12:00:00`) - new Date(`${String(value).slice(0, 10)}T12:00:00`)) / 86400000);
    if (diff <= 0) return 'hoy';
    if (diff === 1) return 'ayer';
    return `hace ${diff} días`;
  };
  const getRoute = () => {
    const params = new URLSearchParams(global.location.search);
    const requested = params.get('workout') || 'summary';
    return {
      screen: SCREEN_IDS.includes(requested) ? requested : 'summary',
      exerciseId: params.get('exercise') || '',
      routineId: params.get('routine') || ''
    };
  };
  const updateRoute = (screen, options = {}, replace = false) => {
    const url = new URL(global.location.href);
    url.searchParams.set('view', 'workout');
    if (screen === 'summary') url.searchParams.delete('workout');
    else url.searchParams.set('workout', screen);
    if (options.exerciseId) url.searchParams.set('exercise', options.exerciseId);
    else url.searchParams.delete('exercise');
    if (options.routineId) url.searchParams.set('routine', options.routineId);
    else url.searchParams.delete('routine');
    global.history[replace ? 'replaceState' : 'pushState']({}, '', url);
  };

  const ensureWorkoutStyles = () => {
    if (document.getElementById('habitflow-workout-redesign-styles')) return;
    const style = document.createElement('style');
    style.id = 'habitflow-workout-redesign-styles';
    style.textContent = `
      .wr-root{--wr-red:#f3132b;--wr-red-hover:#ff263d;--wr-success:#22c77a;--wr-blue:#4da3ff;--wr-purple:#a77bff;--wr-amber:#ffb547;color:var(--hf-text);width:100%;max-width:1500px;margin:0 auto;font-family:'Plus Jakarta Sans','Inter',sans-serif;min-width:0;animation:fadeIn .22s ease}
      .wr-root *{box-sizing:border-box}.wr-root button,.wr-root input,.wr-root select,.wr-root textarea{font:inherit}.wr-root button{cursor:pointer}.wr-root button:focus-visible,.wr-root input:focus-visible,.wr-root select:focus-visible,.wr-root textarea:focus-visible{outline:2px solid var(--wr-red);outline-offset:2px}
      .wr-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:18px}.wr-title{margin:0;font-size:clamp(34px,3.2vw,42px);line-height:1.05;letter-spacing:-.045em;color:var(--hf-text);font-family:'Plus Jakarta Sans','Inter',sans-serif;font-weight:800}.wr-subtitle{margin:8px 0 0;color:var(--hf-muted);font-size:14px}.wr-header-actions,.wr-inline-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
      .wr-btn{min-height:44px;border:1px solid var(--hf-card-border);border-radius:11px;padding:0 16px;background:var(--hf-input-bg);color:var(--hf-text);display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:700;font-size:13px;transition:background .16s,border-color .16s,color .16s}.wr-btn:hover{background:var(--hf-input-hover);border-color:var(--hf-card-border-strong)}.wr-btn-primary{background:var(--hf-action-primary);border-color:transparent;color:#fff}.wr-btn-primary:hover{background:var(--hf-action-primary-hover)}.wr-btn-danger{color:var(--wr-red)}.wr-btn-quiet{background:transparent}.wr-icon-btn{width:42px;height:42px;padding:0;border-radius:11px}.wr-btn[disabled]{opacity:.48;cursor:not-allowed}
      .wr-tabs{display:flex;gap:7px;margin:0 0 18px;overflow-x:auto;scrollbar-width:none}.wr-tabs::-webkit-scrollbar{display:none}.wr-tab{height:42px;min-width:108px;padding:0 18px;border:1px solid var(--hf-card-border);border-radius:9px;background:transparent;color:var(--hf-muted);font-size:13px;font-weight:700;white-space:nowrap;position:relative}.wr-tab.is-active{color:var(--wr-red);background:color-mix(in srgb,var(--wr-red) 10%,transparent);border-color:color-mix(in srgb,var(--wr-red) 38%,var(--hf-card-border))}.wr-tab.is-active:after{content:'';position:absolute;height:2px;left:0;right:0;bottom:-1px;background:var(--wr-red);border-radius:2px}
      .wr-card{background:var(--hf-glass-quiet);border:1px solid var(--hf-card-border);border-radius:20px;box-shadow:inset 0 1px 0 var(--hf-card-highlight);min-width:0}.wr-card-pad{padding:20px}.wr-card-title{font-size:17px;font-weight:800;color:var(--hf-text);margin:0}.wr-eyebrow{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--hf-muted);font-weight:700}.wr-muted{color:var(--hf-muted)}.wr-meta{font-size:12px;color:var(--hf-muted)}
      .wr-summary-top{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(350px,.85fr);gap:18px;margin-bottom:18px}.wr-hero{min-height:278px;padding:28px;position:relative;overflow:hidden;display:flex;align-items:center}.wr-hero:before{content:'';position:absolute;inset:auto -70px -130px auto;width:390px;height:390px;border-radius:50%;border:56px solid color-mix(in srgb,var(--wr-red) 14%,transparent);box-shadow:0 0 0 42px color-mix(in srgb,var(--wr-red) 5%,transparent)}.wr-hero:after{content:'';position:absolute;right:52px;top:26px;width:152px;height:228px;background:linear-gradient(145deg,color-mix(in srgb,var(--wr-red) 28%,transparent),transparent 68%);clip-path:polygon(42% 0,69% 18%,81% 43%,100% 61%,77% 100%,52% 71%,23% 100%,0 61%,17% 39%,28% 17%);opacity:.8}.wr-hero-content{position:relative;z-index:1;max-width:68%}.wr-hero h2{font-size:30px;line-height:1.1;margin:14px 0 10px;letter-spacing:-.035em}.wr-hero-copy{color:var(--hf-muted);font-size:13px;line-height:1.7;margin-bottom:22px}.wr-hero-empty{max-width:560px}.wr-type-badge{position:absolute;right:20px;top:20px;z-index:2;padding:9px 12px;border:1px solid var(--hf-card-border);border-radius:10px;background:var(--hf-input-bg);font-size:12px;font-weight:700;display:flex;gap:7px;align-items:center}
      .wr-weekly{padding:18px}.wr-section-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:14px}.wr-metrics{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--hf-card-border);border-radius:13px;overflow:hidden}.wr-metric{min-height:74px;padding:13px 15px;border-right:1px solid var(--hf-card-border);border-bottom:1px solid var(--hf-card-border);display:grid;grid-template-columns:32px 1fr;align-items:center;gap:9px}.wr-metric:nth-child(2n){border-right:0}.wr-metric:nth-last-child(-n+2){border-bottom:0}.wr-metric-icon{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--hf-card-border);color:var(--wr-red)}.wr-metric strong{display:block;font-size:20px}.wr-metric span{font-size:11px;color:var(--hf-muted)}.wr-week-days{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-top:12px;padding:9px 11px;border:1px solid var(--hf-card-border);border-radius:12px}.wr-day{text-align:center;font-size:10px;color:var(--hf-muted)}.wr-day b{display:block;font-size:10px;margin-bottom:7px}.wr-day-bar{height:6px;border-radius:8px;background:var(--hf-track);overflow:hidden}.wr-day-bar i{display:block;height:100%;background:var(--wr-red);border-radius:inherit}
      .wr-section{padding:18px 20px;margin-bottom:18px}.wr-routine-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.wr-routine-card{border:1px solid var(--hf-card-border);border-radius:14px;padding:14px;background:var(--hf-input-bg);min-width:0}.wr-routine-top{display:flex;align-items:center;gap:11px;margin-bottom:11px}.wr-routine-icon{width:40px;height:40px;border-radius:10px;border:1px solid color-mix(in srgb,var(--wr-red) 28%,var(--hf-card-border));display:grid;place-items:center;color:var(--wr-red);flex:0 0 auto}.wr-routine-main{min-width:0;flex:1}.wr-routine-main strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wr-progress{height:4px;border-radius:6px;background:var(--hf-track);overflow:hidden;margin:12px 0 7px}.wr-progress>span{display:block;height:100%;background:var(--wr-red);border-radius:inherit}.wr-routine-foot{display:flex;justify-content:space-between;font-size:10px;color:var(--hf-muted)}
      .wr-bottom-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(360px,.85fr);gap:18px}.wr-activity-list{display:grid}.wr-activity{display:grid;grid-template-columns:46px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--hf-card-border)}.wr-activity:last-child{border-bottom:0}.wr-thumb{width:46px;height:46px;border-radius:9px;object-fit:contain;background:var(--hf-surface-soft);border:1px solid var(--hf-card-border)}.wr-activity strong{font-size:13px}.wr-dataset-stats{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--hf-card-border);border-radius:12px;margin:10px 0 12px}.wr-dataset-stat{text-align:center;padding:10px 6px;border-right:1px solid var(--hf-card-border)}.wr-dataset-stat:last-child{border-right:0}.wr-dataset-stat strong{display:block;font-size:14px}.wr-dataset-stat span{font-size:9px;color:var(--hf-muted)}
      .wr-toolbar{display:grid;grid-template-columns:minmax(260px,1fr) repeat(3,minmax(150px,auto));gap:10px;margin:14px 0 18px}.wr-search{position:relative}.wr-search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--hf-muted)}.wr-input,.wr-select,.wr-textarea{width:100%;min-height:46px;padding:0 14px;border-radius:11px;border:1px solid var(--hf-card-border);background:var(--hf-input-bg);color:var(--hf-text);outline:none}.wr-search .wr-input{padding-left:42px}.wr-select{appearance:auto}.wr-textarea{padding:12px 14px;resize:vertical;line-height:1.5}.wr-filter-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:-6px 0 14px;font-size:12px;color:var(--hf-muted)}
      .wr-library-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.wr-ex-card{overflow:hidden;position:relative}.wr-ex-media{height:174px;display:grid;place-items:center;background:var(--hf-surface-soft);position:relative;border-bottom:1px solid var(--hf-card-border)}.wr-ex-media img{width:180px;height:180px;max-width:100%;max-height:100%;object-fit:contain}.wr-play{position:absolute;right:10px;top:10px;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.55);color:#fff;display:grid;place-items:center}.wr-ex-category{position:absolute;left:10px;top:10px;color:var(--wr-red);font-size:10px;font-weight:800;background:rgba(0,0,0,.62);padding:5px 7px;border-radius:6px}.wr-ex-body{padding:13px}.wr-ex-name{font-size:14px;font-weight:800;line-height:1.35;margin:0 0 5px;min-height:38px}.wr-ex-tags{font-size:11px;color:var(--hf-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wr-pill{display:inline-flex;align-items:center;gap:5px;margin-top:9px;padding:5px 8px;border-radius:6px;background:var(--hf-input-bg);font-size:10px;color:var(--hf-muted)}.wr-ex-actions{display:flex;align-items:center;justify-content:space-between;margin-top:11px}.wr-link{border:0;background:none;padding:0;color:var(--wr-red);font-weight:800;font-size:11px}.wr-fav{border:0;background:none;color:var(--hf-muted);padding:5px}.wr-fav.is-active{color:var(--wr-red)}
      .wr-pagination{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:18px;flex-wrap:wrap}.wr-pages{display:flex;align-items:center;gap:6px}.wr-page{width:38px;height:38px;border-radius:9px;border:1px solid var(--hf-card-border);background:var(--hf-input-bg);color:var(--hf-muted)}.wr-page.is-active{background:color-mix(in srgb,var(--wr-red) 20%,transparent);color:var(--hf-text);border-color:var(--wr-red)}
      .wr-empty{min-height:210px;border:1px dashed var(--hf-card-border-strong);border-radius:16px;display:grid;place-items:center;text-align:center;padding:28px;color:var(--hf-muted)}.wr-empty svg{color:var(--wr-red);margin-bottom:10px}.wr-empty h3{color:var(--hf-text);margin:0 0 6px}.wr-empty p{max-width:460px;margin:0 0 16px;font-size:13px;line-height:1.6}
      .wr-detail-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}.wr-detail-grid{display:grid;grid-template-columns:minmax(360px,.82fr) minmax(0,1.18fr);gap:18px}.wr-detail-media{min-height:680px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;position:relative;overflow:hidden}.wr-detail-media img{width:clamp(320px,62%,430px);height:auto;aspect-ratio:1/1;max-width:calc(100% - 56px);object-fit:contain;image-rendering:auto}.wr-attribution{position:absolute;left:20px;bottom:18px;color:var(--hf-muted);font-size:10px;letter-spacing:.02em}.wr-media-toggle{position:absolute;left:20px;top:20px}.wr-detail-info{padding:28px}.wr-detail-info h1{font-size:31px;line-height:1.12;margin:0 0 8px;letter-spacing:-.035em}.wr-info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0 24px}.wr-info-box{padding:13px;border:1px solid var(--hf-card-border);border-radius:12px;background:var(--hf-input-bg)}.wr-info-box span{display:block;font-size:10px;color:var(--hf-muted);margin-bottom:8px}.wr-info-box strong{font-size:14px;color:var(--wr-red)}.wr-muscles{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 24px}.wr-muscle{padding:7px 13px;border:1px solid var(--hf-card-border);border-radius:999px;color:var(--hf-muted);font-size:11px}.wr-steps{display:grid;gap:10px;margin:12px 0 22px}.wr-step{display:grid;grid-template-columns:32px 1fr;gap:10px;align-items:start;color:var(--hf-muted);font-size:13px;line-height:1.55}.wr-step-number{width:30px;height:30px;border:1px solid var(--wr-red);border-radius:50%;display:grid;place-items:center;color:var(--wr-red);font-weight:800}.wr-guidance{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;border:1px solid var(--hf-card-border);border-radius:13px;padding:14px;margin-bottom:16px}.wr-guidance>div{display:grid;grid-template-columns:28px 1fr;gap:8px;align-items:center}.wr-guidance svg{color:var(--wr-red)}.wr-guidance span{font-size:10px;color:var(--hf-muted)}.wr-guidance strong{display:block;font-size:13px}.wr-detail-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .wr-routines-layout{display:grid;gap:14px}.wr-routines-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.wr-routine-full{padding:18px}.wr-routine-actions{display:flex;gap:7px;margin-top:14px}.wr-routine-actions .wr-btn{flex:1;padding:0 10px}.wr-confirm-note{font-size:10px;color:var(--hf-muted);margin-top:10px}
      .wr-builder-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}.wr-builder-heading{display:flex;align-items:center;gap:12px;min-width:0}.wr-builder-heading .wr-title{font-size:clamp(28px,2.6vw,36px)}.wr-builder-layout{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:18px;align-items:start}.wr-builder-main,.wr-builder-side{padding:20px}.wr-builder-side{position:sticky;top:16px}.wr-builder-form{display:grid;gap:6px}.wr-form-label,.wr-field-label{font-size:10px;color:var(--hf-muted);font-weight:800;letter-spacing:.02em}.wr-builder-name{font-size:18px;font-weight:800}.wr-field-error{color:var(--wr-red);font-size:11px;margin:1px 0 0}.wr-builder-list{display:grid;gap:10px;margin-top:14px}.wr-builder-row{display:grid;grid-template-columns:28px minmax(150px,1fr) minmax(360px,1.7fr) 112px;gap:12px;align-items:center;padding:12px;border:1px solid var(--hf-card-border);border-radius:13px;background:var(--hf-input-bg);transition:border-color .16s,background .16s}.wr-builder-row:hover{border-color:var(--hf-card-border-strong)}.wr-builder-row.is-dragging{opacity:.45}.wr-drag{border:0;background:none;color:var(--hf-muted);padding:5px}.wr-builder-ex{display:grid;grid-template-columns:46px minmax(0,1fr);gap:10px;align-items:center;min-width:0}.wr-builder-ex img{width:46px;height:46px;border-radius:9px;object-fit:contain;background:var(--hf-surface-soft)}.wr-builder-ex strong{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wr-builder-ex span{font-size:9px;color:var(--hf-muted)}.wr-builder-fields{display:grid;grid-template-columns:74px 104px 88px 98px;gap:8px}.wr-builder-field{display:grid;gap:4px;min-width:0}.wr-small-input{min-height:38px;padding:0 9px}.wr-notes-field{grid-column:1/-1;margin-top:2px}.wr-notes-field .wr-textarea{min-height:40px;max-height:96px;padding:9px 11px;resize:vertical;overflow:auto;font-size:12px}.wr-row-menu{display:flex;align-items:center;justify-content:flex-end;gap:4px}.wr-row-action{width:36px;height:36px;border:1px solid transparent;border-radius:9px;background:transparent;color:var(--hf-muted);display:grid;place-items:center}.wr-row-action:hover{background:var(--hf-input-hover);color:var(--hf-text)}.wr-row-action.is-delete:hover{background:color-mix(in srgb,var(--wr-red) 12%,transparent);color:var(--wr-red)}.wr-row-action[disabled]{opacity:.3;cursor:not-allowed}.wr-remove-confirm{grid-column:1/-1;display:flex;justify-content:flex-end;align-items:center;gap:8px;padding-top:8px;border-top:1px solid var(--hf-card-border);font-size:11px;color:var(--hf-muted)}.wr-side-metrics{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0 18px}.wr-side-metric{padding:11px;border:1px solid var(--hf-card-border);border-radius:11px;background:var(--hf-input-bg)}.wr-side-metric span{display:block;font-size:10px;color:var(--hf-muted);margin-bottom:5px}.wr-side-metric strong{font-size:16px}.wr-side-metric.is-wide{grid-column:1/-1}.wr-days{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin:10px 0 5px}.wr-day-toggle{height:38px;border-radius:9px;border:1px solid var(--hf-card-border);background:var(--hf-input-bg);color:var(--hf-muted);font-weight:800}.wr-day-toggle.is-active{background:var(--wr-red);color:#fff;border-color:var(--wr-red)}.wr-validation{color:var(--wr-red);font-size:11px;margin-top:10px}.wr-save-wrap{margin-top:18px}.wr-empty-builder{min-height:176px}.wr-empty-builder p{margin-bottom:0}
      .wr-overlay{position:fixed;inset:0;z-index:2600;background:var(--hf-overlay);backdrop-filter:blur(8px);display:grid;place-items:center;padding:20px}.wr-modal{width:min(900px,100%);max-height:min(88vh,850px);overflow:auto;padding:20px}.wr-picker-toolbar{display:grid;grid-template-columns:minmax(240px,1fr) repeat(3,minmax(130px,170px));gap:8px;margin-top:14px}.wr-picker-list{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0 76px}.wr-picker-item{display:grid;grid-template-columns:50px minmax(0,1fr) 26px;gap:10px;align-items:center;padding:9px;border:1px solid var(--hf-card-border);border-radius:11px;background:var(--hf-input-bg);text-align:left;color:var(--hf-text);min-width:0}.wr-picker-item:hover{border-color:var(--hf-card-border-strong)}.wr-picker-item.is-selected{border-color:var(--wr-red);background:color-mix(in srgb,var(--wr-red) 9%,var(--hf-input-bg))}.wr-picker-item.is-included{opacity:.64}.wr-picker-item img{width:50px;height:50px;object-fit:contain;border-radius:8px;background:var(--hf-surface-soft)}.wr-picker-item span{font-size:10px;color:var(--hf-muted)}.wr-picker-check{width:22px;height:22px;border:1px solid var(--hf-card-border-strong);border-radius:7px;display:grid;place-items:center}.wr-picker-item.is-selected .wr-picker-check{background:var(--wr-red);border-color:var(--wr-red);color:#fff}.wr-picker-warning{padding:9px 11px;border-radius:9px;background:color-mix(in srgb,var(--wr-red) 10%,transparent);color:var(--wr-red);font-size:11px;margin-top:10px}.wr-picker-footer{position:sticky;bottom:-20px;margin:0 -20px -20px;padding:13px 20px;background:var(--hf-surface-strong);border-top:1px solid var(--hf-card-border);display:flex;justify-content:space-between;align-items:center;gap:12px;z-index:2}
      .wr-session{max-width:none}.wr-session-bar{display:grid;grid-template-columns:220px 1fr auto;gap:22px;align-items:center;padding:16px 20px;margin-bottom:18px}.wr-session-time{display:grid;grid-template-columns:38px 1fr;gap:10px;align-items:center}.wr-session-time svg{color:var(--wr-red)}.wr-session-time strong{font-size:25px;display:block}.wr-session-layout{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:18px}.wr-current{padding:22px}.wr-current-grid{display:grid;grid-template-columns:minmax(260px,.92fr) minmax(260px,1.08fr);gap:22px;align-items:center;margin:16px 0}.wr-current-media{min-height:300px;display:grid;place-items:center;background:var(--hf-surface-soft);border:1px solid var(--hf-card-border);border-radius:15px;position:relative}.wr-current-media img{width:180px;height:180px;object-fit:contain}.wr-current-stats strong{font-size:26px}.wr-current-weight{font-size:26px;color:var(--wr-red);font-weight:800;margin:12px 0 20px}.wr-rest{display:flex;align-items:center;gap:13px;margin:14px 0}.wr-rest-ring{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--wr-red) var(--rest-progress,0%),var(--hf-track) 0);position:relative}.wr-rest-ring:after{content:'';position:absolute;inset:6px;border-radius:50%;background:var(--hf-surface-strong)}.wr-rest-ring svg{position:relative;z-index:1;color:var(--wr-red)}.wr-set-list{display:grid;gap:6px}.wr-set-head{display:grid;grid-template-columns:52px 1fr 1fr minmax(54px,auto);gap:12px;padding:0 13px 2px;color:var(--hf-muted);font-size:10px;font-weight:800;letter-spacing:.03em;text-transform:uppercase}.wr-set-head span:last-child{text-align:right}.wr-set-row{display:grid;grid-template-columns:52px 1fr 1fr minmax(54px,auto);gap:12px;align-items:center;min-height:48px;padding:7px 13px;border:1px solid var(--hf-card-border);border-radius:11px;background:var(--hf-input-bg)}.wr-set-row.is-current{border-left:4px solid var(--wr-red)}.wr-set-row.is-complete{color:var(--wr-success)}.wr-set-row input{width:100%;min-height:34px}.wr-session-side{padding:20px;display:flex;flex-direction:column}.wr-next{display:grid;grid-template-columns:1fr 90px;gap:10px;align-items:center;padding-bottom:18px;border-bottom:1px solid var(--hf-card-border)}.wr-next img{width:90px;height:90px;object-fit:contain}.wr-session-note{min-height:180px;margin:12px 0 16px}.wr-session-side .wr-btn:last-child{margin-top:auto}.wr-paused{padding:9px 12px;border-radius:9px;background:color-mix(in srgb,var(--wr-amber) 12%,transparent);color:var(--wr-amber);font-size:12px;font-weight:800}
      .wr-history-list{display:grid;gap:10px}.wr-history-item{padding:16px}.wr-history-head{display:grid;grid-template-columns:1fr repeat(3,110px) auto;gap:14px;align-items:center}.wr-history-head strong{font-size:14px}.wr-history-details{margin-top:14px;padding-top:12px;border-top:1px solid var(--hf-card-border);display:grid;gap:7px}.wr-history-ex{display:flex;justify-content:space-between;gap:10px;font-size:11px;color:var(--hf-muted)}
      .wr-progress-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}.wr-kpi{padding:16px}.wr-kpi span{font-size:10px;color:var(--hf-muted);text-transform:uppercase;letter-spacing:.06em}.wr-kpi strong{display:block;font-size:24px;margin-top:7px}.wr-chart-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.wr-chart{padding:19px;min-height:280px}.wr-bars{height:210px;display:flex;align-items:flex-end;gap:10px;padding-top:18px}.wr-bar-item{flex:1;min-width:0;text-align:center}.wr-bar{height:var(--bar-height);min-height:3px;border-radius:7px 7px 2px 2px;background:linear-gradient(180deg,var(--wr-red),color-mix(in srgb,var(--wr-red) 48%,transparent))}.wr-bar-label{font-size:9px;color:var(--hf-muted);margin-top:7px}.wr-record-list{display:grid;gap:8px;margin-top:13px}.wr-record{display:grid;grid-template-columns:1fr auto auto;gap:12px;padding:11px;border:1px solid var(--hf-card-border);border-radius:11px;font-size:11px}.wr-record b{color:var(--wr-red)}
      .wr-toast{position:fixed;right:22px;bottom:22px;z-index:3000;max-width:min(390px,calc(100vw - 44px));padding:12px 15px;border-radius:12px;background:var(--hf-surface-strong);border:1px solid var(--hf-card-border-strong);box-shadow:var(--hf-shadow-raised);display:flex;align-items:center;gap:9px;color:var(--hf-text);font-size:12px}.wr-toast.is-error{border-color:color-mix(in srgb,var(--wr-red) 45%,var(--hf-card-border))}.wr-skeleton{background:linear-gradient(90deg,var(--hf-input-bg),var(--hf-input-hover),var(--hf-input-bg));background-size:220% 100%;animation:wrShimmer 1.2s linear infinite;border-radius:12px;min-height:170px}@keyframes wrShimmer{to{background-position:-220% 0}}
      html[data-theme-mode='pinkLight'] .wr-root{--wr-red:#d96b7d;--wr-red-hover:#c95a70}.wr-root img{color:transparent}
      @media (max-width:1180px){.wr-summary-top,.wr-bottom-grid{grid-template-columns:1fr}.wr-library-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.wr-builder-layout,.wr-session-layout{grid-template-columns:1fr}.wr-builder-side{position:static}.wr-routines-grid{grid-template-columns:1fr 1fr}.wr-builder-row{grid-template-columns:28px minmax(150px,.8fr) minmax(360px,1.5fr) 112px}.wr-detail-grid{grid-template-columns:minmax(300px,.8fr) 1.2fr}.wr-session-side{min-height:460px}}
      @media (max-width:900px){.wr-header{align-items:flex-start}.wr-header-actions{justify-content:flex-end}.wr-routine-grid{grid-template-columns:1fr}.wr-library-grid{grid-template-columns:1fr 1fr}.wr-detail-grid{grid-template-columns:1fr}.wr-detail-media{min-height:430px}.wr-detail-info{padding:22px}.wr-current-grid{grid-template-columns:1fr}.wr-progress-grid{grid-template-columns:1fr 1fr}.wr-chart-grid{grid-template-columns:1fr}.wr-session-bar{grid-template-columns:1fr auto}.wr-session-bar>.wr-progress{grid-column:1/-1}.wr-toolbar{grid-template-columns:1fr 1fr}.wr-toolbar .wr-search{grid-column:1/-1}.wr-history-head{grid-template-columns:1fr 90px 90px auto}.wr-history-head .wr-hide-tablet{display:none}.wr-builder-row{grid-template-columns:28px minmax(0,1fr) 108px}.wr-builder-fields{grid-column:2/-1;grid-template-columns:repeat(4,minmax(76px,1fr))}.wr-picker-toolbar{grid-template-columns:1fr 1fr}.wr-picker-toolbar .wr-search{grid-column:1/-1}.wr-picker-list{grid-template-columns:1fr}}
      @media (max-width:680px){.wr-root{width:100%;overflow:hidden}.wr-header{display:block;margin-bottom:14px}.wr-title{font-size:32px}.wr-subtitle{font-size:13px;line-height:1.5}.wr-header-actions{margin-top:14px;justify-content:flex-start}.wr-header-actions .wr-btn{flex:1}.wr-tabs{margin-inline:-2px}.wr-tab{min-width:98px;padding-inline:13px}.wr-summary-top{gap:13px}.wr-hero{min-height:300px;padding:20px}.wr-hero-content{max-width:100%}.wr-hero:after{opacity:.22;right:-20px}.wr-hero h2{font-size:25px}.wr-type-badge{position:static;width:max-content;margin-bottom:12px}.wr-metrics{grid-template-columns:1fr}.wr-metric,.wr-metric:nth-child(2n){border-right:0}.wr-metric:nth-last-child(-n+2){border-bottom:1px solid var(--hf-card-border)}.wr-metric:last-child{border-bottom:0}.wr-week-days{gap:4px;padding-inline:6px}.wr-section{padding:15px}.wr-bottom-grid{grid-template-columns:1fr}.wr-dataset-stats{grid-template-columns:1fr}.wr-dataset-stat{border-right:0;border-bottom:1px solid var(--hf-card-border)}.wr-dataset-stat:last-child{border-bottom:0}.wr-toolbar{grid-template-columns:1fr}.wr-toolbar .wr-search{grid-column:auto}.wr-library-grid,.wr-routines-grid{grid-template-columns:1fr}.wr-ex-media{height:190px}.wr-pagination{align-items:flex-start}.wr-pages{order:3;width:100%;justify-content:center}.wr-detail-head{align-items:flex-start}.wr-detail-head .wr-inline-actions{justify-content:flex-end}.wr-detail-media{min-height:360px}.wr-detail-info{padding:18px}.wr-detail-info h1{font-size:25px}.wr-info-grid,.wr-guidance,.wr-detail-actions{grid-template-columns:1fr}.wr-builder-head{align-items:flex-start}.wr-builder-heading{gap:7px}.wr-builder-heading .wr-title{font-size:25px}.wr-builder-head .wr-btn{min-width:44px;padding-inline:12px}.wr-builder-head .wr-sync-label{display:none}.wr-builder-main,.wr-builder-side{padding:15px}.wr-builder-row{grid-template-columns:28px minmax(0,1fr);padding:10px;gap:9px}.wr-builder-ex{grid-template-columns:44px minmax(0,1fr)}.wr-builder-fields{grid-column:1/-1;grid-template-columns:1fr 1fr}.wr-notes-field{grid-column:1/-1}.wr-row-menu{grid-column:1/-1;justify-content:flex-end;padding-top:3px}.wr-row-action{width:44px;height:44px}.wr-remove-confirm{justify-content:flex-start;flex-wrap:wrap}.wr-side-metrics{grid-template-columns:1fr 1fr}.wr-save-wrap{position:sticky;bottom:0;margin:18px -15px -15px;padding:12px 15px;background:var(--hf-surface-strong);border-top:1px solid var(--hf-card-border);z-index:2}.wr-picker-toolbar{grid-template-columns:1fr}.wr-picker-toolbar .wr-search{grid-column:auto}.wr-picker-footer{align-items:stretch;flex-direction:column}.wr-picker-footer .wr-btn{width:100%}.wr-session-bar{grid-template-columns:1fr}.wr-session-bar>.wr-inline-actions{justify-content:stretch}.wr-session-bar>.wr-inline-actions .wr-btn{flex:1}.wr-current{padding:15px}.wr-current-media{min-height:240px}.wr-set-head{grid-template-columns:38px 1fr 1fr minmax(48px,auto);gap:7px;padding-inline:8px;font-size:8px}.wr-set-head span:nth-child(2){font-size:0}.wr-set-head span:nth-child(2):after{content:'Reps';font-size:8px}.wr-set-head span:nth-child(3){font-size:0}.wr-set-head span:nth-child(3):after{content:'Peso (kg)';font-size:8px}.wr-set-row{grid-template-columns:38px 1fr 1fr minmax(48px,auto);gap:7px;padding-inline:8px}.wr-set-row input{font-size:16px}.wr-session-side{padding:15px;min-height:420px}.wr-progress-grid{grid-template-columns:1fr 1fr}.wr-history-head{grid-template-columns:1fr auto}.wr-history-head .wr-hide-mobile{display:none}.wr-info-box strong{font-size:13px}.wr-input,.wr-select,.wr-textarea{font-size:16px}.wr-toast{right:12px;bottom:78px;max-width:calc(100vw - 24px)}}
      @media (max-width:390px){.wr-progress-grid{grid-template-columns:1fr}.wr-header-actions{display:grid;grid-template-columns:1fr 1fr}.wr-detail-head{display:block}.wr-detail-head .wr-inline-actions{margin-top:10px;justify-content:flex-start}.wr-current-stats strong,.wr-current-weight{font-size:22px}.wr-days{gap:3px}.wr-day-toggle{height:38px}}
      @media (prefers-reduced-motion:reduce){.wr-root,.wr-skeleton{animation:none!important}.wr-root *{scroll-behavior:auto!important;transition:none!important}}
    `;
    document.head.appendChild(style);
  };

  const Toast = ({ toast, onClose }) => {
    useEffect(() => {
      if (!toast) return undefined;
      const id = setTimeout(onClose, 3600);
      return () => clearTimeout(id);
    }, [toast, onClose]);
    if (!toast) return null;
    return <div className={`wr-toast ${toast.type === 'error' ? 'is-error' : ''}`} role="status"><Check size={16} />{toast.message}<button className="wr-fav" onClick={onClose} aria-label="Cerrar aviso"><X size={14} /></button></div>;
  };

  const EmptyState = ({ icon: Icon = Dumbbell, title, text, action, actionLabel }) => (
    <div className="wr-empty"><div><Icon size={31} /><h3>{title}</h3><p>{text}</p>{action && <button className="wr-btn wr-btn-primary" onClick={action}><Plus size={15} />{actionLabel}</button>}</div></div>
  );

  const WorkoutHeader = ({ screen, onNavigate, onNew, onSync, syncing }) => {
    const detailTitles = {
      library: ['Biblioteca de ejercicios', 'Ejercicios reales con animaciones, filtros y guías en español.'],
      routines: ['Rutinas', 'Crea, programa y ejecuta planes sincronizados entre tus dispositivos.'],
      builder: ['Constructor de rutinas', 'Organiza ejercicios, series, repeticiones y tiempos de descanso.'],
      active: ['Entrenamiento activo', 'Tu sesión se guarda y puede recuperarse si recargas.'],
      progress: ['Progreso', 'Métricas calculadas únicamente con tus sesiones guardadas.'],
      history: ['Historial', 'Revisa tus sesiones, ejercicios, volumen y notas.']
    };
    const [title, subtitle] = detailTitles[screen] || ['Entreno', 'Tu centro de entrenamiento, rutinas y progreso.'];
    return <>
      <header className="wr-header">
        <div><h1 className="wr-title">{title}</h1><p className="wr-subtitle">{subtitle}</p></div>
        <div className="wr-header-actions">
          <button className="wr-btn" onClick={onSync} disabled={syncing}><RefreshCw size={15} className={syncing ? 'spin' : ''} />{syncing ? 'Sincronizando' : 'Sincronizar'}</button>
          <button className="wr-btn wr-btn-primary" onClick={onNew}><Plus size={16} />Nuevo</button>
        </div>
      </header>
      {!['builder', 'active'].includes(screen) && <nav className="wr-tabs" aria-label="Secciones de Entreno">
        {SCREEN_TABS.map(([id, label]) => <button key={id} className={`wr-tab ${screen === id || (screen === 'detail' && id === 'library') ? 'is-active' : ''}`} onClick={() => onNavigate(id)}>{label}</button>)}
      </nav>}
    </>;
  };

  const SummaryView = ({ workoutData, catalogById, onNavigate, onEditRoutine, onStartRoutine }) => {
    const routines = workoutData.routines || [];
    const sessions = [...(workoutData.sessions || [])].sort((a, b) => String(b.completedAt || b.date || '').localeCompare(String(a.completedAt || a.date || '')));
    const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
    const nextRoutine = routines.find(item => (item.scheduledDays || []).includes(todayKey)) || routines[0] || null;
    const lastForNext = nextRoutine ? sessions.find(item => item.routineId === nextRoutine.id) : null;
    const weekStart = getWeekStart();
    const weekEnd = addDays(weekStart, 6);
    const weekSessions = sessions.filter(item => {
      const d = sessionDate(item);
      return d >= dateKey(weekStart) && d <= dateKey(weekEnd);
    });
    const weekMinutes = weekSessions.reduce((sum, item) => sum + sessionDuration(item), 0);
    const weekVolume = weekSessions.reduce((sum, item) => sum + sessionVolume(item), 0);
    const scheduled = routines.reduce((sum, item) => sum + Math.max(1, (item.scheduledDays || []).length), 0);
    const adherence = scheduled ? Math.min(100, Math.round((weekSessions.length / scheduled) * 100)) : 0;
    const recentExerciseRows = sessions.flatMap(session => (session.exercises || []).map(item => ({ ...item, session }))).slice(0, 3);
    return <>
      <div className="wr-summary-top">
        <section className="wr-card wr-hero">
          {nextRoutine ? <>
            <div className="wr-type-badge"><Dumbbell size={14} />{nextRoutine.type || 'Fuerza'}</div>
            <div className="wr-hero-content">
              <div className="wr-eyebrow">Próximo entrenamiento</div>
              <h2>{nextRoutine.name}</h2>
              <div className="wr-hero-copy">{nextRoutine.exercises?.length || 0} ejercicios · {routineDuration(nextRoutine)} min estimados · {lastForNext ? `Última vez ${daysSince(sessionDate(lastForNext))}` : 'Sin sesiones anteriores'}</div>
              <div className="wr-inline-actions">
                <button className="wr-btn wr-btn-primary" onClick={() => onStartRoutine(nextRoutine)}><Play size={16} />Iniciar entrenamiento</button>
                <button className="wr-btn" onClick={() => onEditRoutine(nextRoutine)}><Pencil size={15} />Editar rutina</button>
              </div>
            </div>
          </> : <div className="wr-hero-content wr-hero-empty"><div className="wr-eyebrow">Próximo entrenamiento</div><h2>Prepara tu primera rutina</h2><div className="wr-hero-copy">Elige ejercicios del catálogo real, define series y descansos, y guarda el plan en tu cuenta.</div><button className="wr-btn wr-btn-primary" onClick={() => onNavigate('builder')}><Plus size={16} />Crear rutina</button></div>}
        </section>
        <section className="wr-card wr-weekly">
          <div className="wr-section-head"><div><div className="wr-eyebrow">Resumen semanal</div></div><span className="wr-meta"><CalendarDays size={13} /> Esta semana</span></div>
          <div className="wr-metrics">
            <div className="wr-metric"><span className="wr-metric-icon"><Layers3 size={15} /></span><div><strong>{weekSessions.length}</strong><span>Sesiones</span></div></div>
            <div className="wr-metric"><span className="wr-metric-icon"><Clock3 size={15} /></span><div><strong>{formatMinutes(weekMinutes)}</strong><span>Tiempo total</span></div></div>
            <div className="wr-metric"><span className="wr-metric-icon"><Weight size={15} /></span><div><strong>{weekVolume > 999 ? `${(weekVolume / 1000).toFixed(1)}k` : Math.round(weekVolume)}</strong><span>Volumen (kg)</span></div></div>
            <div className="wr-metric"><span className="wr-metric-icon"><Activity size={15} /></span><div><strong>{adherence}%</strong><span>Adherencia</span></div></div>
          </div>
          <div className="wr-week-days">{Array.from({ length: 7 }, (_, index) => {
            const day = addDays(weekStart, index);
            const count = weekSessions.filter(item => sessionDate(item) === dateKey(day)).length;
            return <div className="wr-day" key={dateKey(day)}><b>{DAY_LABELS[day.getDay()]}</b><div className="wr-day-bar"><i style={{ width: count ? '100%' : '0%' }} /></div></div>;
          })}</div>
        </section>
      </div>

      <section className="wr-card wr-section">
        <div className="wr-section-head"><h2 className="wr-card-title">Rutinas rápidas</h2><button className="wr-link" onClick={() => onNavigate('routines')}>Ver todas</button></div>
        {routines.length ? <div className="wr-routine-grid">{routines.slice(0, 3).map((routine, index) => {
          const completed = sessions.filter(item => item.routineId === routine.id).length;
          return <button className="wr-routine-card" key={routine.id} onClick={() => onStartRoutine(routine)} style={{ textAlign: 'left', color: 'inherit' }}>
            <div className="wr-routine-top"><span className="wr-routine-icon">{index % 3 === 0 ? <Dumbbell size={19} /> : index % 3 === 1 ? <Zap size={19} /> : <Activity size={19} />}</span><div className="wr-routine-main"><strong>{routine.name}</strong><span className="wr-meta">{(routine.muscleGroups || []).map(displayMuscle).join(', ') || 'Rutina personalizada'}</span></div><ChevronRight size={16} /></div>
            <div className="wr-progress"><span style={{ width: `${Math.min(100, completed * 18)}%` }} /></div><div className="wr-routine-foot"><span>{routine.exercises?.length || 0} ejercicios</span><span>{routineDuration(routine)} min</span></div>
          </button>;
        })}</div> : <EmptyState icon={ListChecks} title="Aún no tienes rutinas" text="Construye una rutina con ejercicios reales y aparecerá aquí para iniciarla rápidamente." action={() => onNavigate('builder')} actionLabel="Crear rutina" />}
      </section>

      <section className="wr-card wr-section">
        <div className="wr-section-head"><h2 className="wr-card-title">Actividad reciente</h2><button className="wr-link" onClick={() => onNavigate('history')}>Ver historial</button></div>
        {recentExerciseRows.length ? <div className="wr-activity-list">{recentExerciseRows.map((item, index) => {
          const catalogItem = catalogById.get(exerciseIdOf(item));
          const firstSet = item.sets?.[0];
          return <div className="wr-activity" key={`${item.session.id}_${exerciseIdOf(item)}_${index}`}><img className="wr-thumb" loading="lazy" decoding="async" src={dataset.resolveExerciseMedia(catalogItem?.image || item.image)} alt="" /><div><strong>{item.exerciseName || catalogItem?.name || 'Ejercicio'}</strong><div className="wr-meta">{item.sets?.length || 0} series · {firstSet?.reps || 0} rep · {firstSet?.weight || 0} kg</div></div><span className="wr-meta">{daysSince(sessionDate(item.session))}</span></div>;
        })}</div> : <div className="wr-meta">Tu actividad aparecerá después de completar la primera sesión.</div>}
      </section>
    </>;
  };

  const LibraryView = ({ catalog, catalogLoading, catalogError, workoutData, onToggleFavorite, onOpenDetail, onCustomExercise }) => {
    const [scope, setScope] = useState('all');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [equipment, setEquipment] = useState('all');
    const [target, setTarget] = useState('all');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [playingId, setPlayingId] = useState('');
    const favorites = new Set(workoutData.favorites || []);
    const custom = workoutData.customExercises || [];
    const allItems = useMemo(() => [...catalog, ...custom], [catalog, custom]);
    const options = useMemo(() => ({
      categories: [...new Set(catalog.map(item => item.category).filter(Boolean))].sort(),
      equipment: [...new Set(catalog.map(item => item.equipment).filter(Boolean))].sort(),
      targets: [...new Set(catalog.map(item => item.target).filter(Boolean))].sort()
    }), [catalog]);
    const query = dataset.normalizeSearch(search);
    const filtered = useMemo(() => allItems.filter(item => {
      if (scope === 'favorites' && !favorites.has(String(item.id))) return false;
      if (scope === 'custom' && item.source !== 'custom') return false;
      if (category !== 'all' && item.category !== category) return false;
      if (equipment !== 'all' && item.equipment !== equipment) return false;
      if (target !== 'all' && item.target !== target) return false;
      return !query || dataset.searchableText(item).includes(query);
    }), [allItems, scope, category, equipment, target, query, workoutData.favorites]);
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    useEffect(() => setPage(1), [scope, search, category, equipment, target, pageSize]);
    useEffect(() => { if (page > pages) setPage(pages); }, [page, pages]);
    const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
    const clearFilters = () => { setSearch(''); setCategory('all'); setEquipment('all'); setTarget('all'); };
    if (catalogLoading) return <div className="wr-library-grid">{Array.from({ length: 8 }, (_, i) => <div className="wr-skeleton" key={i} />)}</div>;
    if (catalogError) return <EmptyState icon={LibraryBig} title="Catálogo no disponible" text={catalogError} />;
    return <>
      <div className="wr-tabs" style={{ marginBottom: 0 }}>
        {[['all', 'Todos'], ['favorites', 'Favoritos'], ['custom', 'Mis ejercicios']].map(([id, label]) => <button key={id} className={`wr-tab ${scope === id ? 'is-active' : ''}`} onClick={() => setScope(id)}>{label}</button>)}
      </div>
      <div className="wr-toolbar">
        <label className="wr-search"><Search size={17} /><input className="wr-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ejercicio, músculo o equipo..." aria-label="Buscar ejercicios" /></label>
        <select className="wr-select" value={category} onChange={e => setCategory(e.target.value)} aria-label="Grupo muscular"><option value="all">Grupos musculares</option>{options.categories.map(value => <option value={value} key={value}>{displayLabel(value, CATEGORY_ES)}</option>)}</select>
        <select className="wr-select" value={equipment} onChange={e => setEquipment(e.target.value)} aria-label="Equipo"><option value="all">Equipo</option>{options.equipment.map(value => <option value={value} key={value}>{displayLabel(value, EQUIPMENT_ES)}</option>)}</select>
        <select className="wr-select" value={target} onChange={e => setTarget(e.target.value)} aria-label="Objetivo"><option value="all">Objetivo</option>{options.targets.map(value => <option value={value} key={value}>{displayMuscle(value)}</option>)}</select>
      </div>
      <div className="wr-filter-summary"><span>Mostrando {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} de {filtered.length} resultados</span><div className="wr-inline-actions"><button className="wr-link" onClick={clearFilters}>Limpiar filtros</button><button className="wr-link" onClick={onCustomExercise}><Plus size={12} /> Ejercicio personalizado</button></div></div>
      {visible.length ? <div className="wr-library-grid">{visible.map(item => {
        const isPlaying = playingId === String(item.id);
        const image = isPlaying ? item.gif_url : item.image;
        return <article className="wr-card wr-ex-card" key={item.id}>
          <div className="wr-ex-media"><img loading="lazy" decoding="async" src={dataset.resolveExerciseMedia(image)} alt={`Técnica de ${item.name}`} onError={e => { e.currentTarget.style.opacity = '.16'; }} /><span className="wr-ex-category"><Zap size={10} /> {displayLabel(item.category, CATEGORY_ES)}</span>{item.gif_url && <button className="wr-play" onClick={() => setPlayingId(isPlaying ? '' : String(item.id))} aria-label={isPlaying ? `Detener animación de ${item.name}` : `Reproducir animación de ${item.name}`}>{isPlaying ? <Pause size={15} /> : <Play size={15} />}</button>}</div>
          <div className="wr-ex-body"><h3 className="wr-ex-name">{item.name}</h3><div className="wr-ex-tags">{displayMuscle(item.target)} · {displayMuscle(item.muscle_group)}</div><span className="wr-pill"><Wrench size={11} />{displayLabel(item.equipment, EQUIPMENT_ES)}</span><div className="wr-ex-actions"><button className="wr-link" onClick={() => onOpenDetail(item.id)}>Ver técnica</button><button className={`wr-fav ${favorites.has(String(item.id)) ? 'is-active' : ''}`} onClick={() => onToggleFavorite(item.id)} aria-label={favorites.has(String(item.id)) ? `Quitar ${item.name} de favoritos` : `Agregar ${item.name} a favoritos`}><Heart size={16} fill={favorites.has(String(item.id)) ? 'currentColor' : 'none'} /></button></div></div>
        </article>;
      })}</div> : <EmptyState icon={Search} title="Sin resultados" text="Ajusta la búsqueda o limpia los filtros para volver a explorar el catálogo." action={clearFilters} actionLabel="Limpiar filtros" />}
      <div className="wr-pagination"><span className="wr-meta">Página {page} de {pages}</span><div className="wr-pages"><button className="wr-page" disabled={page === 1} onClick={() => setPage(value => Math.max(1, value - 1))} aria-label="Página anterior"><ChevronLeft size={16} /></button>{[...new Set([1, page - 1, page, page + 1, pages])].filter(value => value >= 1 && value <= pages).sort((a, b) => a - b).map(value => <button key={value} className={`wr-page ${value === page ? 'is-active' : ''}`} onClick={() => setPage(value)}>{value}</button>)}<button className="wr-page" disabled={page === pages} onClick={() => setPage(value => Math.min(pages, value + 1))} aria-label="Página siguiente"><ChevronRight size={16} /></button></div><select className="wr-select" style={{ width: 142 }} value={pageSize} onChange={e => setPageSize(Number(e.target.value))}><option value={12}>12 por página</option><option value={24}>24 por página</option><option value={48}>48 por página</option></select></div>
    </>;
  };

  const DetailView = ({ exercise, loading, error, isFavorite, onBack, onToggleFavorite, onAddToRoutine, onStartNow }) => {
    const [playing, setPlaying] = useState(false);
    if (loading) return <div className="wr-detail-grid"><div className="wr-skeleton" style={{ minHeight: 620 }} /><div className="wr-skeleton" style={{ minHeight: 620 }} /></div>;
    if (error || !exercise) return <EmptyState icon={Activity} title="No se pudo abrir el ejercicio" text={error || 'El registro solicitado no existe.'} action={onBack} actionLabel="Volver a la biblioteca" />;
    const steps = exercise.instruction_steps?.es || exercise.instructions?.es?.split(/(?<=[.!?])\s+/).filter(Boolean) || exercise.instruction_steps?.en || exercise.instructions?.en?.split(/(?<=[.!?])\s+/).filter(Boolean) || [];
    return <>
      <div className="wr-detail-head"><button className="wr-btn wr-btn-quiet" onClick={onBack}><ArrowLeft size={16} />Volver</button><div className="wr-inline-actions"><button className={`wr-btn ${isFavorite ? 'wr-btn-primary' : ''}`} onClick={onToggleFavorite}><Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />Favorito</button></div></div>
      <div className="wr-detail-grid">
        <section className="wr-card wr-detail-media"><button className="wr-btn wr-media-toggle" onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? 'Pausar' : 'Ver animación'}</button><img src={dataset.resolveExerciseMedia(playing ? exercise.gif_url : exercise.image)} alt={`Demostración de ${exercise.name}`} decoding="async" /><span className="wr-attribution">© Gym visual</span></section>
        <section className="wr-card wr-detail-info"><h1>{exercise.name}</h1><div className="wr-muted">{displayLabel(exercise.category, CATEGORY_ES)} · {displayLabel(exercise.equipment, EQUIPMENT_ES)}</div>
          <div className="wr-info-grid"><div className="wr-info-box"><span>Objetivo</span><strong>{displayMuscle(exercise.target)}</strong></div><div className="wr-info-box"><span>Equipo</span><strong style={{ color: 'var(--wr-blue)' }}>{displayLabel(exercise.equipment, EQUIPMENT_ES)}</strong></div><div className="wr-info-box"><span>Grupo muscular</span><strong style={{ color: 'var(--wr-success)' }}>{displayMuscle(exercise.muscle_group)}</strong></div></div>
          <h2 className="wr-card-title">Músculos trabajados</h2><div className="wr-muscles"><span className="wr-muscle">{displayMuscle(exercise.target)}</span>{(exercise.secondary_muscles || []).map(value => <span className="wr-muscle" key={value}>{displayMuscle(value)}</span>)}</div>
          <h2 className="wr-card-title">Cómo realizarlo</h2><div className="wr-steps">{steps.map((step, index) => <div className="wr-step" key={`${index}_${step.slice(0, 16)}`}><span className="wr-step-number">{index + 1}</span><span>{step}</span></div>)}</div>
          <div className="wr-guidance" aria-label="Orientación de HabitFlow"><div><TrendingUp size={19} /><div><span>Series orientativas*</span><strong>3–4</strong></div></div><div><Repeat2 size={19} /><div><span>Repeticiones*</span><strong>8–12</strong></div></div><div><AlarmClock size={19} /><div><span>Descanso*</span><strong>60–90 s</strong></div></div></div><div className="wr-meta" style={{ margin: '-8px 0 14px' }}>* Orientación general de HabitFlow; no forma parte del dataset ni sustituye asesoría profesional.</div>
          <div className="wr-detail-actions"><button className="wr-btn wr-btn-primary" onClick={onAddToRoutine}><Plus size={16} />Agregar a rutina</button><button className="wr-btn" onClick={onStartNow}><Play size={15} />Iniciar ahora</button></div>
        </section>
      </div>
    </>;
  };

  const RoutinesView = ({ workoutData, onNew, onEdit, onStart, onDuplicate, onDelete }) => {
    const routines = workoutData.routines || [];
    const sessions = workoutData.sessions || [];
    if (!routines.length) return <EmptyState icon={ListChecks} title="No hay rutinas guardadas" text="Crea un plan completo con ejercicios del catálogo y días programados." action={onNew} actionLabel="Nueva rutina" />;
    return <div className="wr-routines-layout"><div className="wr-routines-grid">{routines.map(routine => {
      const last = [...sessions].filter(item => item.routineId === routine.id).sort((a, b) => sessionDate(b).localeCompare(sessionDate(a)))[0];
      return <article className="wr-card wr-routine-full" key={routine.id}><div className="wr-routine-top"><span className="wr-routine-icon"><Dumbbell size={19} /></span><div className="wr-routine-main"><strong>{routine.name}</strong><span className="wr-meta">{(routine.muscleGroups || []).map(displayMuscle).join(' · ') || 'Rutina personalizada'}</span></div><button className="wr-fav" aria-label={`Más acciones para ${routine.name}`}><MoreVertical size={17} /></button></div><div className="wr-dataset-stats"><div className="wr-dataset-stat"><strong>{routine.exercises?.length || 0}</strong><span>Ejercicios</span></div><div className="wr-dataset-stat"><strong>{routineSets(routine)}</strong><span>Series</span></div><div className="wr-dataset-stat"><strong>{routineDuration(routine)} min</strong><span>Estimado</span></div></div><div className="wr-meta">{last ? `Última sesión ${daysSince(sessionDate(last))}` : 'Todavía no se ha realizado'}</div><div className="wr-routine-actions"><button className="wr-btn wr-btn-primary" onClick={() => onStart(routine)}><Play size={14} />Iniciar</button><button className="wr-btn" onClick={() => onEdit(routine)}><Edit3 size={14} />Editar</button><button className="wr-btn wr-icon-btn" onClick={() => onDuplicate(routine)} aria-label={`Duplicar ${routine.name}`}><Copy size={14} /></button><button className="wr-btn wr-icon-btn wr-btn-danger" onClick={() => onDelete(routine)} aria-label={`Eliminar ${routine.name}`}><Trash2 size={14} /></button></div></article>;
    })}</div></div>;
  };

  const ExercisePicker = ({ catalog, selectedIds, onAdd, onClose }) => {
    const [search, setSearch] = useState('');
    const [target, setTarget] = useState('all');
    const [equipment, setEquipment] = useState('all');
    const [category, setCategory] = useState('all');
    const [pendingIds, setPendingIds] = useState(new Set());
    const [warning, setWarning] = useState('');
    useEffect(() => {
      const closeOnEscape = event => { if (event.key === 'Escape') onClose(); };
      global.addEventListener('keydown', closeOnEscape);
      return () => global.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);
    const query = dataset.normalizeSearch(search);
    const targets = useMemo(() => [...new Set(catalog.map(item => item.target).filter(Boolean))].sort(), [catalog]);
    const equipmentOptions = useMemo(() => [...new Set(catalog.map(item => item.equipment).filter(Boolean))].sort(), [catalog]);
    const categories = useMemo(() => [...new Set(catalog.map(item => item.category || item.body_part).filter(Boolean))].sort(), [catalog]);
    const items = useMemo(() => catalog.filter(item => (
      (!query || dataset.searchableText(item).includes(query)) &&
      (target === 'all' || item.target === target) &&
      (equipment === 'all' || item.equipment === equipment) &&
      (category === 'all' || (item.category || item.body_part) === category)
    )).slice(0, 80), [catalog, query, target, equipment, category]);
    const toggle = (item) => {
      const id = String(item.id);
      if (selectedIds.has(id)) { setWarning('Este ejercicio ya está incluido en la rutina.'); return; }
      setWarning('');
      setPendingIds(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
    };
    const submit = () => {
      const selected = catalog.filter(item => pendingIds.has(String(item.id)));
      if (!selected.length) return;
      onAdd(selected);
    };
    return <div className="wr-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="wr-card wr-modal" role="dialog" aria-modal="true" aria-labelledby="exercise-picker-title"><div className="wr-section-head"><div><h2 className="wr-card-title" id="exercise-picker-title">Añadir ejercicios</h2><div className="wr-meta">Selecciona uno o varios movimientos del catálogo.</div></div><button className="wr-btn wr-icon-btn" onClick={onClose} aria-label="Cerrar selector"><X size={16} /></button></div>
      <div className="wr-picker-toolbar"><label className="wr-search"><Search size={16} /><input className="wr-input" autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, músculo o equipo" aria-label="Buscar ejercicios" /></label><select className="wr-select" value={target} onChange={e => setTarget(e.target.value)} aria-label="Filtrar por grupo muscular"><option value="all">Todos los grupos</option>{targets.map(value => <option key={value} value={value}>{displayMuscle(value)}</option>)}</select><select className="wr-select" value={equipment} onChange={e => setEquipment(e.target.value)} aria-label="Filtrar por equipo"><option value="all">Todo el equipo</option>{equipmentOptions.map(value => <option key={value} value={value}>{displayLabel(value, EQUIPMENT_ES)}</option>)}</select><select className="wr-select" value={category} onChange={e => setCategory(e.target.value)} aria-label="Filtrar por categoría"><option value="all">Todas las categorías</option>{categories.map(value => <option key={value} value={value}>{displayLabel(value, CATEGORY_ES)}</option>)}</select></div>
      {warning && <div className="wr-picker-warning" role="status">{warning}</div>}
      <div className="wr-picker-list">{items.map(item => { const id = String(item.id); const included = selectedIds.has(id); const selected = pendingIds.has(id); return <button className={`wr-picker-item ${selected ? 'is-selected' : ''} ${included ? 'is-included' : ''}`} key={item.id} onClick={() => toggle(item)} aria-pressed={selected} title={included ? 'Este ejercicio ya está incluido' : selected ? 'Quitar de la selección' : 'Seleccionar ejercicio'}><img src={dataset.resolveExerciseMedia(item.image)} loading="lazy" decoding="async" alt="" /><span style={{ minWidth: 0 }}><strong style={{ display: 'block', color: 'var(--hf-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</strong><span>{displayMuscle(item.target)} · {displayLabel(item.equipment, EQUIPMENT_ES)}</span></span><span className="wr-picker-check" aria-hidden="true">{selected || included ? <Check size={13} /> : null}</span></button>; })}</div>{!items.length && <div className="wr-meta" style={{ padding: 18, textAlign: 'center' }}>No hay coincidencias con estos filtros.</div>}
      <footer className="wr-picker-footer"><span className="wr-meta">{pendingIds.size} {pendingIds.size === 1 ? 'ejercicio seleccionado' : 'ejercicios seleccionados'}</span><button className="wr-btn wr-btn-primary" disabled={!pendingIds.size} onClick={submit}><Plus size={15} />Añadir seleccionados</button></footer>
    </section></div>;
  };

  const RoutineBuilder = ({ catalog, routine, prefillExerciseId, onSave, onCancel, onSync, syncing }) => {
    const [name, setName] = useState(routine?.name || '');
    const [description, setDescription] = useState(routine?.description || '');
    const [scheduledDays, setScheduledDays] = useState(routine?.scheduledDays || []);
    const initialItems = useMemo(() => {
      const base = (routine?.exercises || []).map((item, index) => ({
        id: item.id || uid('routine_ex'), exerciseId: exerciseIdOf(item), order: index,
        sets: Number(item.sets || 3), reps: String(item.reps || item.repRange || '8–12'),
        restSeconds: Number(item.restSeconds || item.rest || 90), notes: item.notes || '', targetWeight: Number(item.targetWeight || item.weight || 0)
      }));
      if (prefillExerciseId && !base.some(item => item.exerciseId === String(prefillExerciseId))) base.push({ id: uid('routine_ex'), exerciseId: String(prefillExerciseId), order: base.length, sets: 3, reps: '8–12', restSeconds: 90, notes: '', targetWeight: 0 });
      return base;
    }, [routine?.id, prefillExerciseId]);
    const [items, setItems] = useState(initialItems);
    const [showPicker, setShowPicker] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [dragging, setDragging] = useState('');
    const [pendingRemoveId, setPendingRemoveId] = useState('');
    const byId = useMemo(() => new Map(catalog.map(item => [String(item.id), item])), [catalog]);
    const updateItem = (id, patch) => setItems(current => current.map(item => item.id === id ? { ...item, ...patch } : item));
    const removeItem = (id) => setItems(current => current.filter(item => item.id !== id).map((item, index) => ({ ...item, order: index })));
    const moveItem = (id, delta) => setItems(current => {
      const index = current.findIndex(item => item.id === id);
      const target = index + delta;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next.map((item, order) => ({ ...item, order }));
    });
    const dropOn = (targetId) => setItems(current => {
      const from = current.findIndex(item => item.id === dragging);
      const to = current.findIndex(item => item.id === targetId);
      if (from < 0 || to < 0 || from === to) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next.map((item, order) => ({ ...item, order }));
    });
    const addExercises = (exercises) => {
      setItems(current => {
        const existing = new Set(current.map(item => item.exerciseId));
        const additions = exercises.filter(exercise => !existing.has(String(exercise.id))).map((exercise, index) => ({ id: uid('routine_ex'), exerciseId: String(exercise.id), order: current.length + index, sets: 3, reps: '8–12', restSeconds: 90, notes: '', targetWeight: 0 }));
        return [...current, ...additions];
      });
      setShowPicker(false);
    };
    const muscleGroups = [...new Set(items.map(item => byId.get(item.exerciseId)?.target || byId.get(item.exerciseId)?.muscle_group).filter(Boolean))].map(displayMuscle);
    const draft = { exercises: items };
    const itemValuesValid = items.every(item => Number(item.sets) > 0 && String(item.reps).trim() && Number(item.targetWeight) >= 0 && Number(item.restSeconds) >= 0);
    const formValid = Boolean(name.trim() && scheduledDays.length && items.length && itemValuesValid);
    const builderDuration = items.length ? routineDuration(draft) : 0;
    const requestRemove = (item) => {
      const configured = Boolean(item.notes?.trim() || Number(item.sets) !== 3 || String(item.reps) !== '8–12' || Number(item.restSeconds) !== 90 || Number(item.targetWeight) > 0);
      if (configured) setPendingRemoveId(item.id);
      else removeItem(item.id);
    };
    const save = async () => {
      if (!formValid || saving) return;
      setSaving(true);
      setError('');
      try { await onSave({ id: routine?.id || uid('routine'), name: name.trim(), description: description.trim(), type: routine?.type || 'Fuerza', scheduledDays, exercises: items.map((item, order) => ({ ...item, order })), muscleGroups, estimatedDuration: builderDuration, createdAt: routine?.createdAt || nowIso(), updatedAt: nowIso() }); }
      catch (saveError) { setError(saveError.message || 'No se pudo guardar la rutina. Inténtalo de nuevo.'); }
      finally { setSaving(false); }
    };
    return <>
      <header className="wr-builder-head"><div className="wr-builder-heading"><button className="wr-btn wr-icon-btn wr-btn-quiet" onClick={onCancel} aria-label="Volver a rutinas" title="Volver a rutinas"><ArrowLeft size={18} /></button><div><h1 className="wr-title">Constructor de rutinas</h1><p className="wr-subtitle">Organiza ejercicios, series, carga y descansos.</p></div></div><button className="wr-btn" onClick={onSync} disabled={syncing} title="Sincronizar rutinas y cambios entre dispositivos" aria-label="Sincronizar rutinas y cambios entre dispositivos"><RefreshCw size={15} className={syncing ? 'spin' : ''} /><span className="wr-sync-label">{syncing ? 'Sincronizando' : 'Sincronizar'}</span></button></header>
      <div className="wr-builder-layout">
        <section className="wr-card wr-builder-main"><div className="wr-builder-form"><label className="wr-form-label" htmlFor="routine-name">Nombre de la rutina *</label><input id="routine-name" className="wr-input wr-builder-name" value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder="Ej. Torso · Fuerza" aria-invalid={!name.trim()} aria-describedby={!name.trim() ? 'routine-name-error' : undefined} />{!name.trim() && <div className="wr-field-error" id="routine-name-error">Escribe un nombre para la rutina.</div>}<label className="wr-form-label" htmlFor="routine-description" style={{ marginTop: 5 }}>Descripción <span style={{ fontWeight: 500 }}>(opcional)</span></label><textarea id="routine-description" className="wr-textarea" style={{ minHeight: 70 }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Objetivo, enfoque o indicaciones generales" /></div>
          <div className="wr-section-head" style={{ marginTop: 18 }}><div><h2 className="wr-card-title">Ejercicios</h2><div className="wr-meta">Arrastra para reordenar o usa los controles accesibles.</div></div><button className="wr-btn" onClick={() => setShowPicker(true)}><Plus size={14} />Añadir ejercicio</button></div>
          {items.length ? <div className="wr-builder-list">{items.map((item, index) => {
            const exercise = byId.get(item.exerciseId);
            return <div className={`wr-builder-row ${dragging === item.id ? 'is-dragging' : ''}`} key={item.id} draggable onDragStart={() => setDragging(item.id)} onDragEnd={() => setDragging('')} onDragOver={event => event.preventDefault()} onDrop={() => dropOn(item.id)}>
              <button className="wr-drag" aria-label={`Arrastrar ${exercise?.name || 'ejercicio'}`} title="Arrastrar para reordenar"><GripVertical size={17} /></button><div className="wr-builder-ex"><img loading="lazy" decoding="async" src={dataset.resolveExerciseMedia(exercise?.image)} alt="" /><div><strong>{exercise?.name || 'Ejercicio no disponible'}</strong><span>{displayMuscle(exercise?.target || exercise?.muscle_group)}</span></div></div>
              <div className="wr-builder-fields"><label className="wr-builder-field"><span className="wr-field-label">Series</span><input className="wr-input wr-small-input" type="number" min="1" value={item.sets} onChange={e => updateItem(item.id, { sets: Math.max(1, Number(e.target.value || 1)) })} aria-label={`Series de ${exercise?.name}`} /></label><label className="wr-builder-field"><span className="wr-field-label">Repeticiones</span><input className="wr-input wr-small-input" value={item.reps} onChange={e => updateItem(item.id, { reps: e.target.value })} aria-label={`Repeticiones de ${exercise?.name}`} /></label><label className="wr-builder-field"><span className="wr-field-label">Carga (kg)</span><input className="wr-input wr-small-input" type="number" min="0" step="0.5" value={item.targetWeight} onChange={e => updateItem(item.id, { targetWeight: Math.max(0, Number(e.target.value || 0)) })} aria-label={`Carga en kilogramos de ${exercise?.name}`} /></label><label className="wr-builder-field"><span className="wr-field-label">Descanso (s)</span><input className="wr-input wr-small-input" type="number" min="0" step="15" value={item.restSeconds} onChange={e => updateItem(item.id, { restSeconds: Math.max(0, Number(e.target.value || 0)) })} aria-label={`Descanso en segundos de ${exercise?.name}`} /></label><label className="wr-builder-field wr-notes-field"><span className="wr-field-label">Notas</span><textarea className="wr-textarea" rows="1" value={item.notes} onChange={e => updateItem(item.id, { notes: e.target.value })} onInput={e => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 96)}px`; }} placeholder="Indicaciones, técnica, tempo o ajustes…" aria-label={`Notas de ${exercise?.name}`} /></label></div>
              <div className="wr-row-menu"><button className="wr-row-action" disabled={index === 0} onClick={() => moveItem(item.id, -1)} aria-label={`Subir ${exercise?.name}`} title="Mover arriba"><ArrowUp size={15} /></button><button className="wr-row-action" disabled={index === items.length - 1} onClick={() => moveItem(item.id, 1)} aria-label={`Bajar ${exercise?.name}`} title="Mover abajo"><ArrowDown size={15} /></button><button className="wr-row-action is-delete" onClick={() => requestRemove(item)} aria-label={`Eliminar ${exercise?.name}`} title="Eliminar ejercicio"><Trash2 size={15} /></button></div>
              {pendingRemoveId === item.id && <div className="wr-remove-confirm" role="alert"><span>Este ejercicio tiene ajustes. ¿Quieres eliminarlo?</span><button className="wr-btn wr-btn-quiet" onClick={() => setPendingRemoveId('')}>Cancelar</button><button className="wr-btn wr-btn-danger" onClick={() => { removeItem(item.id); setPendingRemoveId(''); }}>Eliminar</button></div>}
            </div>;
          })}</div> : <div className="wr-empty wr-empty-builder"><div><Dumbbell size={31} /><h3>Rutina vacía</h3><p>Añade ejercicios del catálogo con el botón superior para configurar el plan.</p></div></div>}
        </section>
        <aside className="wr-card wr-builder-side"><h2 className="wr-card-title">Resumen de la rutina</h2><div className="wr-side-metrics"><div className="wr-side-metric"><span>Duración estimada</span><strong>{builderDuration} min</strong></div><div className="wr-side-metric"><span>Series totales</span><strong>{routineSets(draft)}</strong></div><div className="wr-side-metric"><span>Ejercicios</span><strong>{items.length}</strong></div><div className="wr-side-metric"><span>Grupos musculares</span><strong>{muscleGroups.length}</strong></div><div className="wr-side-metric is-wide"><span>Músculos principales</span><strong style={{ fontSize: 13, lineHeight: 1.5 }}>{muscleGroups.join(', ') || 'Sin ejercicios'}</strong></div></div><h3 className="wr-card-title" style={{ fontSize: 14 }}>Días programados *</h3><div className="wr-days">{DAY_OPTIONS.map(([id, label, fullLabel]) => <button key={id} className={`wr-day-toggle ${scheduledDays.includes(id) ? 'is-active' : ''}`} onClick={() => setScheduledDays(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])} aria-pressed={scheduledDays.includes(id)} aria-label={fullLabel} title={fullLabel}>{label}</button>)}</div>{!scheduledDays.length && <div className="wr-field-error">Selecciona al menos un día.</div>}{!items.length && <div className="wr-field-error" style={{ marginTop: 8 }}>Añade al menos un ejercicio.</div>}<div className="wr-save-wrap"><button className="wr-btn wr-btn-primary" style={{ width: '100%' }} disabled={!formValid || saving} onClick={save}><Save size={15} className={saving ? 'spin' : ''} />{saving ? 'Guardando…' : 'Guardar rutina'}</button>{error && <div className="wr-validation" role="alert">{error}</div>}</div></aside>
      </div>
      {showPicker && <ExercisePicker catalog={catalog} selectedIds={new Set(items.map(item => item.exerciseId))} onAdd={addExercises} onClose={() => setShowPicker(false)} />}
    </>;
  };

  const ActiveWorkout = ({ session, onChange, onFinish, onExit }) => {
    const [tick, setTick] = useState(Date.now());
    const notifiedRestRef = useRef('');
    const [finishedSummary, setFinishedSummary] = useState(null);
    useEffect(() => {
      const id = setInterval(() => setTick(Date.now()), 1000);
      return () => clearInterval(id);
    }, []);
    useEffect(() => {
      if (!session?.restEndsAt || tick < new Date(session.restEndsAt).getTime()) return;
      if (notifiedRestRef.current === session.restEndsAt) return;
      notifiedRestRef.current = session.restEndsAt;
      onChange({ ...session, restEndsAt: null, updatedAt: nowIso() });
      try {
        if (global.Notification?.permission === 'granted') new Notification('Descanso terminado', { body: 'Es momento de continuar con la siguiente serie.', icon: './icon-192-20260603.png', tag: `workout-rest-${session.id}` });
      } catch {}
    }, [session?.restEndsAt, tick]);
    if (!session) return <EmptyState icon={Timer} title="No hay una sesión activa" text="Inicia una rutina para registrar series, peso y descanso." action={onExit} actionLabel="Ver rutinas" />;
    const pausedMs = Number(session.totalPausedMs || 0) + (session.status === 'paused' && session.pausedAt ? Math.max(0, tick - new Date(session.pausedAt).getTime()) : 0);
    const elapsed = Math.max(0, Math.floor((tick - new Date(session.startedAt).getTime() - pausedMs) / 1000));
    const exercises = session.exercises || [];
    const currentIndex = Math.min(Math.max(0, Number(session.currentExerciseIndex || 0)), Math.max(0, exercises.length - 1));
    const current = exercises[currentIndex];
    const next = exercises[currentIndex + 1];
    const allSets = exercises.flatMap(item => item.sets || []);
    const completedSets = allSets.filter(item => item.completed).length;
    const progress = allSets.length ? Math.round((completedSets / allSets.length) * 100) : 0;
    const currentSetIndex = Math.max(0, (current?.sets || []).findIndex(item => !item.completed));
    const currentSet = current?.sets?.[currentSetIndex] || current?.sets?.[current?.sets?.length - 1];
    const restRemaining = session.restEndsAt ? Math.max(0, Math.ceil((new Date(session.restEndsAt).getTime() - tick) / 1000)) : 0;
    const restTotal = Math.max(1, Number(current?.restSeconds || 90));
    const updateExercise = (exerciseIndex, updater) => onChange({ ...session, exercises: exercises.map((item, index) => index === exerciseIndex ? updater(item) : item), updatedAt: nowIso() });
    const updateSet = (setIndex, patch) => updateExercise(currentIndex, item => ({ ...item, sets: item.sets.map((set, index) => index === setIndex ? { ...set, ...patch } : set) }));
    const completeCurrentSet = () => {
      if (!currentSet || session.status === 'paused') return;
      const nextExercises = exercises.map((exercise, exerciseIndex) => exerciseIndex === currentIndex ? { ...exercise, sets: exercise.sets.map((set, setIndex) => setIndex === currentSetIndex ? { ...set, completed: true, completedAt: nowIso() } : set) } : exercise);
      const remainingInExercise = nextExercises[currentIndex].sets.some(set => !set.completed);
      const nextExerciseIndex = remainingInExercise ? currentIndex : Math.min(exercises.length - 1, currentIndex + 1);
      onChange({ ...session, exercises: nextExercises, currentExerciseIndex: nextExerciseIndex, restEndsAt: new Date(Date.now() + restTotal * 1000).toISOString(), updatedAt: nowIso() });
    };
    const togglePause = () => {
      if (session.status === 'paused') {
        const pausedFor = session.pausedAt ? Date.now() - new Date(session.pausedAt).getTime() : 0;
        onChange({ ...session, status: 'active', pausedAt: null, totalPausedMs: Number(session.totalPausedMs || 0) + pausedFor, updatedAt: nowIso() });
      } else onChange({ ...session, status: 'paused', pausedAt: nowIso(), updatedAt: nowIso() });
    };
    const finish = async () => {
      const completedAt = nowIso();
      const workout = {
        id: session.id,
        routineId: session.routineId || null,
        routineName: session.routineName || 'Entreno libre',
        date: dateKey(completedAt),
        startedAt: session.startedAt,
        completedAt,
        durationMinutes: Math.max(1, Math.round(elapsed / 60)),
        totalVolume: exercises.reduce((sum, exercise) => sum + (exercise.sets || []).filter(set => set.completed).reduce((setSum, set) => setSum + Number(set.weight || 0) * Number(set.reps || 0), 0), 0),
        totalSets: completedSets,
        exercises,
        notes: session.notes || '',
        updatedAt: completedAt
      };
      await onFinish(workout);
      setFinishedSummary(workout);
    };
    if (finishedSummary) return <div className="wr-card wr-card-pad" style={{ maxWidth: 760, margin: '70px auto', textAlign: 'center' }}><Trophy size={46} color="var(--wr-red)" /><h2>Entrenamiento guardado</h2><p className="wr-muted">La sesión ya forma parte de tu historial y progreso sincronizado.</p><div className="wr-dataset-stats"><div className="wr-dataset-stat"><strong>{finishedSummary.durationMinutes} min</strong><span>Duración</span></div><div className="wr-dataset-stat"><strong>{Math.round(finishedSummary.totalVolume)} kg</strong><span>Volumen</span></div><div className="wr-dataset-stat"><strong>{finishedSummary.totalSets}</strong><span>Series</span></div></div><button className="wr-btn wr-btn-primary" onClick={onExit}>Ver historial</button></div>;
    return <>
      <section className="wr-card wr-session-bar"><div className="wr-session-time"><Timer size={28} /><div><strong>{formatElapsed(elapsed)}</strong><span className="wr-meta">Tiempo transcurrido</span></div></div><div><div className="wr-meta">Ejercicio {currentIndex + 1} de {exercises.length}</div><div className="wr-progress"><span style={{ width: `${progress}%` }} /></div></div><div className="wr-inline-actions"><strong style={{ color: 'var(--wr-red)' }}>{progress}%</strong><button className="wr-btn" onClick={togglePause}>{session.status === 'paused' ? <CirclePlay size={15} /> : <CirclePause size={15} />}{session.status === 'paused' ? 'Reanudar' : 'Pausar'}</button><button className="wr-btn" onClick={finish}><Flag size={15} />Finalizar</button></div></section>
      {session.status === 'paused' && <div className="wr-paused" style={{ marginBottom: 14 }}>Sesión pausada. El cronómetro se reanudará sin duplicar tiempo.</div>}
      <div className="wr-session-layout">
        <section className="wr-card wr-current"><div><h2 className="wr-card-title" style={{ fontSize: 22 }}>{current?.exerciseName || 'Ejercicio'}</h2><div className="wr-muted">{displayLabel(current?.category, CATEGORY_ES)} · Serie {currentSetIndex + 1} de {current?.sets?.length || 0}</div></div><div className="wr-current-grid"><div className="wr-current-media"><img src={dataset.resolveExerciseMedia(current?.gifUrl || current?.image)} alt={`Demostración de ${current?.exerciseName || 'ejercicio'}`} /></div><div className="wr-current-stats"><div className="wr-meta">Serie actual</div><strong>{currentSet?.reps || 0} repeticiones</strong><div className="wr-current-weight">{Number(currentSet?.weight || 0)} kg</div><div className="wr-rest"><span className="wr-rest-ring" style={{ '--rest-progress': `${restRemaining ? Math.round((1 - restRemaining / restTotal) * 100) : 0}%` }}><AlarmClock size={20} /></span><div><div className="wr-meta">Descanso</div><strong>{restRemaining ? formatElapsed(restRemaining) : 'Listo'}</strong><div className="wr-meta">de {formatElapsed(restTotal)}</div></div></div><button className="wr-btn wr-btn-primary" onClick={completeCurrentSet} disabled={session.status === 'paused' || !currentSet || currentSet.completed}><Check size={16} />Completar serie</button></div></div><h3 className="wr-card-title">Series</h3><div className="wr-set-list" role="table" aria-label="Series del ejercicio"><div className="wr-set-head" role="row"><span role="columnheader">Serie</span><span role="columnheader">Repeticiones</span><span role="columnheader">Peso (kg)</span><span role="columnheader">Estado</span></div>{(current?.sets || []).map((set, index) => <div key={set.id || index} className={`wr-set-row ${set.completed ? 'is-complete' : index === currentSetIndex ? 'is-current' : ''}`} role="row"><strong role="cell">{index + 1}</strong><input className="wr-input" type="number" min="0" value={set.reps} onChange={e => updateSet(index, { reps: Math.max(0, Number(e.target.value || 0)) })} aria-label={`Repeticiones serie ${index + 1}`} /><input className="wr-input" type="number" min="0" step="0.5" value={set.weight} onChange={e => updateSet(index, { weight: Math.max(0, Number(e.target.value || 0)) })} aria-label={`Peso en kilogramos serie ${index + 1}`} />{set.completed ? <Check size={17} aria-label="Completada" /> : index === currentSetIndex ? <span style={{ color: 'var(--wr-red)', fontSize: 11, fontWeight: 800 }} role="cell">Actual</span> : <span className="wr-meta" role="cell">Pendiente</span>}</div>)}</div></section>
        <aside className="wr-card wr-session-side"><div className="wr-eyebrow">Siguiente</div>{next ? <div className="wr-next"><div><h2 className="wr-card-title" style={{ fontSize: 20 }}>{next.exerciseName}</h2><div className="wr-meta">{next.sets?.length || 0} × {next.sets?.[0]?.reps || 0} · {next.restSeconds || 90} s</div></div><img src={dataset.resolveExerciseMedia(next.image)} loading="lazy" decoding="async" alt="" /></div> : <div className="wr-next"><div><h2 className="wr-card-title">Último ejercicio</h2><div className="wr-meta">Completa tus series y finaliza.</div></div><Trophy size={42} color="var(--wr-red)" /></div>}<h3 className="wr-card-title" style={{ marginTop: 20 }}>Notas rápidas</h3><textarea className="wr-textarea wr-session-note" defaultValue={session.notes || ''} onBlur={e => onChange({ ...session, notes: e.target.value, updatedAt: nowIso() })} placeholder="Añade una nota sobre técnica, dolor o peso para la próxima sesión." /><button className="wr-btn" onClick={finish}><Flag size={15} />Finalizar entrenamiento</button></aside>
      </div>
    </>;
  };

  const ProgressView = ({ workoutData }) => {
    const sessions = workoutData.sessions || [];
    const totalVolume = sessions.reduce((sum, item) => sum + sessionVolume(item), 0);
    const totalMinutes = sessions.reduce((sum, item) => sum + sessionDuration(item), 0);
    const weekRows = Array.from({ length: 8 }, (_, index) => {
      const start = addDays(getWeekStart(), (index - 7) * 7);
      const end = addDays(start, 6);
      const matches = sessions.filter(item => sessionDate(item) >= dateKey(start) && sessionDate(item) <= dateKey(end));
      return { label: `${start.getDate()}/${start.getMonth() + 1}`, sessions: matches.length, volume: matches.reduce((sum, item) => sum + sessionVolume(item), 0) };
    });
    const maxVolume = Math.max(1, ...weekRows.map(item => item.volume));
    const records = sessions.flatMap(session => (session.exercises || []).flatMap(exercise => (exercise.sets || []).filter(set => set.completed).map(set => ({ exercise: exercise.exerciseName, weight: Number(set.weight || 0), reps: Number(set.reps || 0), date: sessionDate(session) })))).sort((a, b) => b.weight - a.weight).slice(0, 6);
    if (!sessions.length) return <EmptyState icon={BarChart3} title="Aún no hay progreso calculable" text="Completa una sesión para ver volumen, frecuencia y récords basados en datos reales." />;
    return <><div className="wr-progress-grid"><div className="wr-card wr-kpi"><span>Sesiones</span><strong>{sessions.length}</strong></div><div className="wr-card wr-kpi"><span>Volumen total</span><strong>{totalVolume > 999 ? `${(totalVolume / 1000).toFixed(1)}k kg` : `${Math.round(totalVolume)} kg`}</strong></div><div className="wr-card wr-kpi"><span>Tiempo entrenado</span><strong>{formatMinutes(totalMinutes)}</strong></div><div className="wr-card wr-kpi"><span>Rutinas activas</span><strong>{workoutData.routines?.length || 0}</strong></div></div><div className="wr-chart-grid"><section className="wr-card wr-chart"><div className="wr-section-head"><h2 className="wr-card-title">Volumen por semana</h2><span className="wr-meta">8 semanas</span></div><div className="wr-bars">{weekRows.map(item => <div className="wr-bar-item" key={item.label}><div className="wr-bar" style={{ '--bar-height': `${Math.max(3, Math.round((item.volume / maxVolume) * 180))}px` }} title={`${Math.round(item.volume)} kg`} /><div className="wr-bar-label">{item.label}</div></div>)}</div></section><section className="wr-card wr-chart"><div className="wr-section-head"><h2 className="wr-card-title">Mejores registros</h2><Trophy size={18} color="var(--wr-red)" /></div><div className="wr-record-list">{records.map((item, index) => <div className="wr-record" key={`${item.exercise}_${item.date}_${index}`}><span>{item.exercise}</span><b>{item.weight} kg × {item.reps}</b><span className="wr-meta">{item.date}</span></div>)}</div></section></div></>;
  };

  const HistoryView = ({ workoutData }) => {
    const [expanded, setExpanded] = useState('');
    const sessions = [...(workoutData.sessions || [])].sort((a, b) => String(b.completedAt || b.date || '').localeCompare(String(a.completedAt || a.date || '')));
    if (!sessions.length) return <EmptyState icon={History} title="Historial vacío" text="Las sesiones finalizadas se guardarán aquí con duración, volumen, ejercicios y notas." />;
    return <div className="wr-history-list">{sessions.map(session => <article className="wr-card wr-history-item" key={session.id}><div className="wr-history-head"><div><strong>{session.routineName || 'Entreno libre'}</strong><div className="wr-meta">{sessionDate(session)} · {(session.exercises || []).length} ejercicios</div></div><span className="wr-meta wr-hide-mobile">{sessionDuration(session)} min</span><span className="wr-meta wr-hide-mobile">{Math.round(sessionVolume(session))} kg</span><span className="wr-meta wr-hide-tablet">{session.totalSets || 0} series</span><button className="wr-btn wr-icon-btn" onClick={() => setExpanded(current => current === session.id ? '' : session.id)} aria-expanded={expanded === session.id}><ChevronDown size={16} /></button></div>{expanded === session.id && <div className="wr-history-details">{(session.exercises || []).map((exercise, index) => <div className="wr-history-ex" key={`${exerciseIdOf(exercise)}_${index}`}><span>{exercise.exerciseName || 'Ejercicio'}</span><span>{exercise.sets?.filter(set => set.completed).length || exercise.sets?.length || 0} series · {Math.round((exercise.sets || []).reduce((sum, set) => sum + Number(set.weight || 0) * Number(set.reps || 0), 0))} kg</span></div>)}{session.notes && <div className="wr-meta">Notas: {session.notes}</div>}</div>}</article>)}</div>;
  };

  const CustomExerciseModal = ({ onSave, onClose }) => {
    const [form, setForm] = useState({ name: '', category: 'custom', equipment: 'body weight', target: '', muscle_group: '' });
    const [error, setError] = useState('');
    const submit = () => {
      if (!form.name.trim()) { setError('Escribe el nombre del ejercicio.'); return; }
      onSave({ ...form, id: uid('custom_exercise'), name: form.name.trim(), body_part: form.category, secondary_muscles: [], image: '', gif_url: '', attribution: '', source: 'custom', createdAt: nowIso(), updatedAt: nowIso() });
    };
    return <div className="wr-overlay"><section className="wr-card wr-modal" style={{ maxWidth: 560 }} role="dialog" aria-modal="true"><div className="wr-section-head"><h2 className="wr-card-title">Ejercicio personalizado</h2><button className="wr-btn wr-icon-btn" onClick={onClose}><X size={16} /></button></div><div style={{ display: 'grid', gap: 10 }}><input className="wr-input" value={form.name} onChange={e => setForm(current => ({ ...current, name: e.target.value }))} placeholder="Nombre" autoFocus /><input className="wr-input" value={form.muscle_group} onChange={e => setForm(current => ({ ...current, muscle_group: e.target.value, target: e.target.value }))} placeholder="Grupo muscular" /><input className="wr-input" value={form.equipment} onChange={e => setForm(current => ({ ...current, equipment: e.target.value }))} placeholder="Equipo" /><button className="wr-btn wr-btn-primary" onClick={submit}><Save size={15} />Guardar ejercicio</button>{error && <div className="wr-validation">{error}</div>}</div></section></div>;
  };

  const HabitFlowWorkoutRedesign = ({ data, onUpdateData, onCompleteHabit, awardXp, onSync }) => {
    ensureWorkoutStyles();
    const initialRoute = useMemo(getRoute, []);
    const [screen, setScreen] = useState(initialRoute.screen);
    const [selectedExerciseId, setSelectedExerciseId] = useState(initialRoute.exerciseId);
    const [selectedRoutineId, setSelectedRoutineId] = useState(initialRoute.routineId);
    const [prefillExerciseId, setPrefillExerciseId] = useState('');
    const [catalog, setCatalog] = useState([]);
    const [catalogLoading, setCatalogLoading] = useState(false);
    const [catalogError, setCatalogError] = useState('');
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState('');
    const [toast, setToast] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const workoutData = data.workoutData || {};
    const catalogWithCustom = useMemo(() => [...catalog, ...(workoutData.customExercises || [])], [catalog, workoutData.customExercises]);
    const catalogById = useMemo(() => new Map(catalogWithCustom.map(item => [String(item.id), item])), [catalogWithCustom]);

    const mutate = useCallback((updater) => onUpdateData(current => ({ ...updater(current || {}), updatedAt: nowIso() })), [onUpdateData]);
    const navigate = useCallback((next, options = {}, replace = false) => {
      setScreen(next);
      setSelectedExerciseId(options.exerciseId || '');
      setSelectedRoutineId(options.routineId || '');
      if (next !== 'builder') setPrefillExerciseId('');
      updateRoute(next, options, replace);
      global.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
      const onPop = () => {
        const route = getRoute();
        setScreen(route.screen); setSelectedExerciseId(route.exerciseId); setSelectedRoutineId(route.routineId);
      };
      global.addEventListener('popstate', onPop);
      return () => global.removeEventListener('popstate', onPop);
    }, []);

    const ensureCatalog = useCallback(async () => {
      if (catalog.length) return catalog;
      setCatalogLoading(true); setCatalogError('');
      try {
        const records = await dataset.loadCatalog();
        setCatalog(records);
        return records;
      } catch (error) {
        setCatalogError(error.message || 'No se pudo cargar el catálogo.');
        throw error;
      } finally { setCatalogLoading(false); }
    }, [catalog]);

    useEffect(() => {
      if (['library', 'detail', 'builder', 'active', 'routines'].includes(screen)) ensureCatalog().catch(() => {});
    }, [screen]);

    useEffect(() => {
      if (screen !== 'detail' || !selectedExerciseId) return undefined;
      const controller = new AbortController();
      setDetailLoading(true); setDetailError(''); setDetail(null);
      const custom = (workoutData.customExercises || []).find(item => String(item.id) === String(selectedExerciseId));
      if (custom) { setDetail(custom); setDetailLoading(false); return () => controller.abort(); }
      dataset.loadExercise(selectedExerciseId, controller.signal).then(value => setDetail(value)).catch(error => { if (error.name !== 'AbortError') setDetailError(error.message || 'No se pudo cargar el detalle.'); }).finally(() => setDetailLoading(false));
      return () => controller.abort();
    }, [screen, selectedExerciseId]);

    useEffect(() => {
      if (workoutData.activeSession && workoutData.activeSession.status !== 'completed' && getRoute().screen === 'active') setScreen('active');
    }, []);

    const syncNow = async () => {
      if (!onSync || syncing) return;
      setSyncing(true);
      try { const result = await onSync(); setToast({ type: result?.ok === false ? 'error' : 'success', message: result?.message || (result?.ok === false ? 'No se pudo sincronizar Entreno.' : 'Entreno sincronizado con tu cuenta.') }); }
      catch (error) { setToast({ type: 'error', message: error.message || 'No se pudo sincronizar.' }); }
      finally { setSyncing(false); }
    };
    const openBuilder = async (routine = null, exerciseId = '') => {
      try { await ensureCatalog(); } catch { return; }
      setPrefillExerciseId(String(exerciseId || ''));
      navigate('builder', { routineId: routine?.id || '' });
    };
    const saveRoutine = async (routine) => {
      mutate(current => ({ ...current, routines: [...(current.routines || []).filter(item => item.id !== routine.id), routine] }));
      setToast({ type: 'success', message: 'Rutina guardada y enviada a sincronización.' });
      navigate('routines');
    };
    const startRoutine = async (routine) => {
      let records;
      try { records = await ensureCatalog(); } catch { return; }
      const byId = new Map([...records, ...(workoutData.customExercises || [])].map(item => [String(item.id), item]));
      const session = {
        id: uid('workout_session'), routineId: routine?.id || null, routineName: routine?.name || 'Entreno libre',
        startedAt: nowIso(), status: 'active', pausedAt: null, totalPausedMs: 0, currentExerciseIndex: 0, restEndsAt: null, notes: '', updatedAt: nowIso(),
        exercises: (routine?.exercises || []).map(item => {
          const exercise = byId.get(exerciseIdOf(item));
          const setCount = Math.max(1, Number(item.sets || 3));
          const repNumber = Number(String(item.reps || item.repRange || '10').match(/\d+/)?.[0] || 10);
          return { exerciseId: exerciseIdOf(item), exerciseName: exercise?.name || 'Ejercicio', category: exercise?.category || exercise?.body_part || '', target: exercise?.target || '', image: exercise?.image || '', gifUrl: exercise?.gif_url || '', restSeconds: Number(item.restSeconds || item.rest || 90), notes: item.notes || '', sets: Array.from({ length: setCount }, (_, index) => ({ id: uid('set'), setNumber: index + 1, reps: repNumber, weight: Number(item.targetWeight || item.weight || 0), completed: false, completedAt: null })) };
        })
      };
      if (!session.exercises.length) { setToast({ type: 'error', message: 'La rutina no contiene ejercicios.' }); return; }
      mutate(current => ({ ...current, activeSession: session }));
      navigate('active');
    };
    const startSingle = (exercise) => startRoutine({ id: null, name: exercise.name, exercises: [{ exerciseId: exercise.id, sets: 3, reps: '10', restSeconds: 75, targetWeight: 0 }] });
    const finishSession = async (session) => {
      mutate(current => ({ ...current, activeSession: null, sessions: [...(current.sessions || []).filter(item => item.id !== session.id), session] }));
      try { awardXp?.(data, 30); } catch {}
      try { onCompleteHabit?.('h2'); } catch {}
    };
    const saveCustomExercise = (exercise) => {
      mutate(current => ({ ...current, customExercises: [...(current.customExercises || []), exercise] }));
      setShowCustom(false); setToast({ type: 'success', message: 'Ejercicio personalizado guardado.' });
    };
    const toggleFavorite = (id) => mutate(current => {
      const key = String(id); const favorites = current.favorites || [];
      return { ...current, favorites: favorites.includes(key) ? favorites.filter(value => value !== key) : [...favorites, key] };
    });
    const duplicateRoutine = (routine) => mutate(current => ({ ...current, routines: [...(current.routines || []), { ...routine, id: uid('routine'), name: `${routine.name} · copia`, createdAt: nowIso(), updatedAt: nowIso() }] }));
    const deleteRoutine = (routine) => {
      if (!global.confirm(`¿Eliminar la rutina “${routine.name}”? El historial no se borrará.`)) return;
      mutate(current => ({ ...current, routines: (current.routines || []).filter(item => item.id !== routine.id) }));
      setToast({ type: 'success', message: 'Rutina eliminada.' });
    };
    const currentRoutine = (workoutData.routines || []).find(item => item.id === selectedRoutineId) || null;
    const onNew = () => screen === 'library' ? setShowCustom(true) : openBuilder();

    let content;
    if (screen === 'summary') content = <SummaryView workoutData={workoutData} catalogById={catalogById} onNavigate={navigate} onEditRoutine={routine => openBuilder(routine)} onStartRoutine={startRoutine} />;
    else if (screen === 'library') content = <LibraryView catalog={catalog} catalogLoading={catalogLoading} catalogError={catalogError} workoutData={workoutData} onToggleFavorite={toggleFavorite} onOpenDetail={id => navigate('detail', { exerciseId: String(id) })} onCustomExercise={() => setShowCustom(true)} />;
    else if (screen === 'detail') content = <DetailView exercise={detail} loading={detailLoading} error={detailError} isFavorite={(workoutData.favorites || []).includes(String(selectedExerciseId))} onBack={() => navigate('library')} onToggleFavorite={() => toggleFavorite(selectedExerciseId)} onAddToRoutine={() => openBuilder(null, selectedExerciseId)} onStartNow={() => detail && startSingle(detail)} />;
    else if (screen === 'routines') content = <RoutinesView workoutData={workoutData} onNew={() => openBuilder()} onEdit={routine => openBuilder(routine)} onStart={startRoutine} onDuplicate={duplicateRoutine} onDelete={deleteRoutine} />;
    else if (screen === 'builder') content = <RoutineBuilder catalog={catalogWithCustom} routine={currentRoutine} prefillExerciseId={prefillExerciseId} onSave={saveRoutine} onCancel={() => navigate('routines')} onSync={syncNow} syncing={syncing} />;
    else if (screen === 'active') content = <ActiveWorkout session={workoutData.activeSession} onChange={session => mutate(current => ({ ...current, activeSession: session }))} onFinish={finishSession} onExit={() => navigate('history')} />;
    else if (screen === 'progress') content = <ProgressView workoutData={workoutData} />;
    else content = <HistoryView workoutData={workoutData} />;

    return <div className={`wr-root ${screen === 'active' ? 'wr-session' : ''}`}>
      {!['detail', 'builder'].includes(screen) && <WorkoutHeader screen={screen} onNavigate={navigate} onNew={onNew} onSync={syncNow} syncing={syncing} />}
      {workoutData.activeSession && screen !== 'active' && <button className="wr-card wr-card-pad" style={{ width: '100%', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'inherit', textAlign: 'left' }} onClick={() => navigate('active')}><span><strong>Sesión en curso</strong><span className="wr-meta" style={{ display: 'block' }}>{workoutData.activeSession.routineName} · toca para continuar</span></span><ChevronRight size={18} color="var(--wr-red)" /></button>}
      {content}
      {showCustom && <CustomExerciseModal onSave={saveCustomExercise} onClose={() => setShowCustom(false)} />}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>;
  };

  global.HabitFlowWorkoutRedesign = HabitFlowWorkoutRedesign;
})(window);
