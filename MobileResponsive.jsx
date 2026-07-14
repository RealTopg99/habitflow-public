(function registerHabitFlowResponsive(global) {
  const { useEffect, useState } = React;
  const {
    Home, Target, CalendarDays, WalletCards, MoreHorizontal, Dumbbell,
    Clock3, Sparkles, HeartPulse, Settings, Flame, Bell, X
  } = global.lucideReact;

  const MOBILE_TABLET_QUERY = '(max-width: 1180px)';
  const PHONE_QUERY = '(max-width: 767px)';

  const useMediaQuery = (query) => {
    const read = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
    const [matches, setMatches] = useState(read);
    useEffect(() => {
      const media = window.matchMedia(query);
      const update = () => setMatches(media.matches);
      update();
      media.addEventListener?.('change', update);
      return () => media.removeEventListener?.('change', update);
    }, [query]);
    return matches;
  };

  const useResponsiveViewport = () => {
    const isMobileTablet = useMediaQuery(MOBILE_TABLET_QUERY);
    const isPhone = useMediaQuery(PHONE_QUERY);
    return { isMobileTablet, isPhone, isTablet: isMobileTablet && !isPhone };
  };

  const MobileAppShell = ({ view, children }) => (
    <div className={`hf-responsive-shell hf-responsive-view-${view || 'dashboard'}`}>{children}</div>
  );

  const MobilePageContainer = ({ view, children }) => (
    <div className={`hf-mobile-page hf-mobile-page-${view || 'dashboard'}`}>{children}</div>
  );

  const MobileHeader = ({ dateLabel, streak = 0, userName = 'Usuario', onNotifications }) => (
    <header className="hf-mobile-header">
      <div className="hf-mobile-brand" aria-label="HabitFlow">
        <img src="./brand-logo.svg" alt="" aria-hidden="true" />
        <strong>HabitFlow</strong>
      </div>
      <div className="hf-mobile-date"><CalendarDays size={17} /><span>{dateLabel}</span></div>
      <div className="hf-mobile-header-actions">
        <span className="hf-mobile-streak" aria-label={`Racha global: ${streak} días`}><Flame size={20} /><b>{streak}</b></span>
        <button type="button" className="hf-mobile-icon-button" onClick={onNotifications} aria-label="Activar notificaciones"><Bell size={20} /></button>
        <span className="hf-mobile-avatar" aria-label={userName}>{String(userName || 'U').trim().slice(0, 1).toUpperCase()}</span>
      </div>
    </header>
  );

  const PRIMARY_ITEMS = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'habits', label: 'Hábitos', icon: Target },
    { id: 'agenda', label: 'Agenda', icon: CalendarDays },
    { id: 'finance', label: 'Finanzas', icon: WalletCards }
  ];
  const MORE_ITEMS = [
    { id: 'workout', label: 'Entreno', icon: Dumbbell },
    { id: 'pomodoro', label: 'Pomodoro', icon: Clock3 },
    { id: 'dreams', label: 'Metas', icon: Sparkles },
    { id: 'health', label: 'Salud', icon: HeartPulse },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const MobileBottomNav = ({ view, onNavigate, moreOpen, onToggleMore, includeCreator = false }) => {
    const extraItems = includeCreator ? [...MORE_ITEMS, { id: 'creator', label: 'Creador', icon: Settings }] : MORE_ITEMS;
    const extraActive = extraItems.some(item => item.id === view);
    return (
      <>
        {moreOpen && <button type="button" className="hf-mobile-sheet-scrim" onClick={onToggleMore} aria-label="Cerrar más secciones" />}
        {moreOpen && (
          <section className="hf-mobile-more-sheet" role="dialog" aria-modal="true" aria-label="Más secciones">
            <div className="hf-mobile-sheet-head"><div><span>HabitFlow</span><h2>Más secciones</h2></div><button type="button" onClick={onToggleMore} aria-label="Cerrar"><X size={20} /></button></div>
            <div className="hf-mobile-more-grid">
              {extraItems.map(item => <button type="button" key={item.id} className={view === item.id ? 'is-active' : ''} onClick={() => { onNavigate(item.id); onToggleMore(false); }}><item.icon size={23} /><span>{item.label}</span></button>)}
            </div>
          </section>
        )}
        <nav className="hf-mobile-bottom-nav" aria-label="Navegación principal móvil">
          {PRIMARY_ITEMS.map(item => <button type="button" key={item.id} className={view === item.id ? 'is-active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => { onNavigate(item.id); onToggleMore(false); }}><item.icon size={23} /><span>{item.label}</span></button>)}
          <button type="button" className={moreOpen || extraActive ? 'is-active' : ''} aria-expanded={moreOpen} onClick={() => onToggleMore()}><MoreHorizontal size={24} /><span>Más</span></button>
        </nav>
      </>
    );
  };

  const MobileCard = ({ as: Tag = 'section', className = '', children, ...props }) => <Tag className={`hf-mobile-card ${className}`.trim()} {...props}>{children}</Tag>;
  const MobileMetricCard = ({ icon, label, value, detail }) => <MobileCard className="hf-mobile-metric-card">{icon}<div><strong>{value}</strong><span>{label}</span>{detail && <small>{detail}</small>}</div></MobileCard>;
  const MobileSectionTabs = ({ items, value, onChange, label = 'Secciones' }) => <div className="hf-mobile-section-tabs" role="tablist" aria-label={label}>{items.map(item => <button type="button" role="tab" aria-selected={item.id === value} className={item.id === value ? 'is-active' : ''} key={item.id} onClick={() => onChange(item.id)}>{item.label}</button>)}</div>;
  const MobileFilterChip = ({ active, children, ...props }) => <button type="button" className={`hf-mobile-filter-chip ${active ? 'is-active' : ''}`} {...props}>{children}</button>;
  const MobileActionButton = ({ className = '', children, ...props }) => <button type="button" className={`hf-mobile-action ${className}`.trim()} {...props}>{children}</button>;
  const MobileEmptyState = ({ icon, title, description }) => <MobileCard className="hf-mobile-empty">{icon}<strong>{title}</strong><p>{description}</p></MobileCard>;
  const MobileSkeleton = ({ lines = 3 }) => <div className="hf-mobile-skeleton" aria-label="Cargando">{Array.from({ length: lines }, (_, index) => <i key={index} />)}</div>;
  const MobileBottomSheet = ({ open, title, onClose, children }) => open ? <><button type="button" className="hf-mobile-sheet-scrim" onClick={onClose} aria-label="Cerrar" /><section className="hf-mobile-bottom-sheet" role="dialog" aria-modal="true"><div className="hf-mobile-sheet-head"><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Cerrar"><X size={20} /></button></div>{children}</section></> : null;
  const MobileModal = MobileBottomSheet;

  global.HabitFlowResponsive = {
    useResponsiveViewport,
    MobileAppShell,
    MobileHeader,
    MobileBottomNav,
    MobilePageContainer,
    MobileSectionTabs,
    MobileCard,
    MobileMetricCard,
    MobileFilterChip,
    MobileBottomSheet,
    MobileModal,
    MobileActionButton,
    MobileEmptyState,
    MobileSkeleton
  };
})(window);
