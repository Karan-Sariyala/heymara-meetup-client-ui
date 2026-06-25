import { useState, useRef, useEffect } from "react";
import { CATS, INITIAL_EVENTS, AVATAR_PALETTE, hostName, fmtDate, MONTH_NAMES } from "./data";

/* ─── Atoms ──────────────────────────────── */

function PulseDot({ color = "#2ED4A2", size = 7 }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full opacity-50 animate-ping" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
    </span>
  );
}

function CardArt({ event, height }) {
  const cat = CATS[event.category];
  return (
    <div
      className="relative overflow-hidden"
      style={{
        height,
        background: `radial-gradient(ellipse at ${event.orb1.x} ${event.orb1.y}, ${cat.hex}52 0%, transparent 65%),
                     radial-gradient(ellipse at ${event.orb2.x} ${event.orb2.y}, ${cat.hex}30 0%, transparent 55%),
                     ${cat.dark}`,
      }}
    >
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <defs>
          <pattern id={`g${event.id}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke={cat.hex} strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g${event.id})`} />
      </svg>
      <div className="absolute bottom-1.5 right-[10px] text-[44px] leading-none opacity-[0.14] select-none">
        {cat.emoji}
      </div>
      <div className="absolute top-[11px] inset-x-[11px] flex items-center justify-between">
        <span
          className="px-[11px] py-1 rounded-full text-[11px] font-semibold"
          style={{
            color: cat.hex,
            background: `${cat.hex}1A`,
            border: `1px solid ${cat.hex}30`,
          }}
        >
          {cat.emoji} {event.category}
        </span>
        {event.tag && (
          <span className="px-[10px] py-1 rounded-full text-[11px] font-medium bg-[rgba(7,7,10,0.72)] text-text0">
            {event.tag}
          </span>
        )}
      </div>
    </div>
  );
}

function AvatarStack({ count, eventId }) {
  return (
    <div className="flex items-center gap-[7px]">
      <div className="flex">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-[#080809]"
            style={{
              marginLeft: i > 0 ? -7 : 0,
              border: "2px solid #0F0F14",
              background: AVATAR_PALETTE[(i + eventId) % AVATAR_PALETTE.length],
            }}
          >
            {String.fromCharCode(65 + ((i * 7 + eventId) % 26))}
          </div>
        ))}
      </div>
      <span className="text-[11px] text-text2">{count} going</span>
    </div>
  );
}

function Divider({ label, count }) {
  return (
    <div className="flex items-center gap-3 mb-3.5">
      <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-text2 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-border" />
      {count != null && <span className="text-[11px] text-text2 shrink-0">{count} events</span>}
    </div>
  );
}

/* ─── Event Card ─────────────────────────── */

function EventCard({ event, featured = false, onOpen }) {
  const [rsvped, setRsvped] = useState(false);
  const [hov, setHov] = useState(false);
  const cat = CATS[event.category];
  const pct = Math.round((event.rsvp / event.capacity) * 100);

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="bg-bg1 rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-200 ease-in-out"
      style={{
        border: `1px solid ${hov ? cat.hex + "44" : "#1E1E2C"}`,
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hov ? `0 16px 48px ${cat.hex}14` : "none",
      }}
    >
      <CardArt event={event} height={featured ? 185 : 145} />
      <div className="p-[13px] flex flex-col flex-1">
        <h3
          className="m-0 leading-tight tracking-[-0.01em] text-text0"
          style={{ fontSize: featured ? 15 : 14, fontWeight: 700 }}
        >
          {event.name}
        </h3>
        <p className="text-xs text-text1 m-0 mb-[10px] leading-[1.55] line-clamp-2">
          {event.notes}
        </p>
        <div className="flex flex-col gap-1 mb-[10px]">
          <div className="flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={cat.hex} strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[11px] text-text1">{event.fullDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3E3C52" strokeWidth="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[11px] text-text1">{event.location}</span>
          </div>
        </div>
        <div className="h-0.5 bg-bg3 rounded overflow-hidden mb-3">
          <div
            className="h-full rounded transition-all duration-500 ease-in-out"
            style={{
              width: `${pct}%`,
              background: pct >= 82 ? "#F05476" : cat.hex,
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <AvatarStack count={event.rsvp} eventId={event.id} />
          <button
            onClick={(e) => { e.stopPropagation(); setRsvped((r) => !r); }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer border-none transition-all duration-150 tracking-[0.01em] shrink-0"
            style={
              rsvped
                ? { background: `${cat.hex}1F`, color: cat.hex, outline: `1px solid ${cat.hex}44` }
                : { background: cat.hex, color: "#080809" }
            }
          >
            {rsvped ? "\u2713 Going" : "RSVP"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Calendar Filter ────────────────────── */

function CalendarFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const sunOffset = firstDay === 0 ? 6 : firstDay - 1;
  const days = [];
  for (let i = 0; i < sunOffset; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isSelected = (day) => {
    if (!value) return false;
    return value.getFullYear() === year && value.getMonth() === month && value.getDate() === day;
  };

  const handleDay = (day) => { onChange(new Date(year, month, day)); setOpen(false); };

  const display = value
    ? value.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "All dates";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((o) => !o); if (!open) setViewDate(value || new Date()); }}
        className="flex items-center gap-1.5 px-3 py-[7px] rounded-xl cursor-pointer text-xs font-medium transition-colors bg-bg1 border border-border text-text1 hover:border-[#8B7FF044]"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {display}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-40 bg-bg1 border border-border rounded-xl p-3 w-[250px] shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer text-text1 hover:text-text0 hover:bg-bg2"
            >
              {"\u25C0"}
            </button>
            <span className="text-xs font-semibold text-text0">{MONTH_NAMES[month]} {year}</span>
            <button
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer text-text1 hover:text-text0 hover:bg-bg2"
            >
              {"\u25B6"}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d} className="text-text2 text-[10px] py-1 font-semibold">{d}</div>
            ))}
            {days.map((day, i) => (
              <div key={i}>
                {day ? (
                  <button
                    onClick={() => handleDay(day)}
                    className="w-7 h-7 rounded-full text-xs cursor-pointer flex items-center justify-center mx-auto"
                    style={{
                      background: isSelected(day) ? "#8B7FF0" : "transparent",
                      color: isSelected(day) ? "#07070A" : "#F0EDF8",
                    }}
                  >
                    {day}
                  </button>
                ) : (
                  <div className="w-7 h-7" />
                )}
              </div>
            ))}
          </div>
          {value && (
            <div className="border-t border-border pt-2 mt-1 text-center">
              <button
                onClick={() => { onChange(null); setOpen(false); }}
                className="text-[11px] font-medium text-text2 cursor-pointer hover:text-text1"
              >
                {"\u2715"} Clear date filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Drawer Icons ───────────────────────── */

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A87A0" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A87A0" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const PeopleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A87A0" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8A87A0" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ─── Drawer Sub-components ──────────────── */

function DrawerSection({ label, children }) {
  return (
    <div className="px-5 pb-5">
      <div className="text-[10px] font-bold tracking-[0.13em] uppercase text-text2 mb-3">{label}</div>
      {children}
    </div>
  );
}

function DetailRow({ icon, label, value, editMode, onChange, cat, type = "text" }) {
  return (
    <div className="flex items-center gap-[10px] mb-3" style={editMode ? { alignItems: "flex-start" } : {}}>
      <div className="w-7 h-7 rounded-[7px] bg-bg2 border border-border shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[10px] text-text2 mb-[3px] uppercase tracking-[0.08em]">{label}</div>
        {editMode ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-bg2 rounded-[7px] px-[9px] py-1.5 text-text0 text-sm outline-none font-sans transition-colors"
            style={{ border: `1px solid ${cat.hex}33` }}
            onFocus={(e) => { e.target.style.borderColor = `${cat.hex}66`; e.target.style.background = "#1E1E28"; }}
            onBlur={(e) => { e.target.style.borderColor = `${cat.hex}33`; e.target.style.background = ""; }}
          />
        ) : (
          <div className="text-sm text-text0">{value}</div>
        )}
      </div>
    </div>
  );
}

/* ─── Drawer Panel ───────────────────────── */

function DrawerPanel({ event, onClose, onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({ ...event });
  const [rsvped, setRsvped] = useState(false);
  const [copied, setCopied] = useState(false);

  const cat = CATS[draft.category] || CATS.Frontend;
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(event);
  const pct = Math.round((draft.rsvp / draft.capacity) * 100);
  const spotsLeft = draft.capacity - draft.rsvp;

  const upd = (field, val) => setDraft((d) => ({ ...d, [field]: val }));
  const handleSave = () => { onSave(draft); setEditMode(false); };
  const handleDiscard = () => { setDraft({ ...event }); setEditMode(false); };
  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };

  const roster = draft.hosts.map((h) => ({
    initials: h,
    name: hostName(h),
    color: AVATAR_PALETTE[(draft.hosts.indexOf(h) + draft.id) % AVATAR_PALETTE.length],
  }));

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[99] bg-[rgba(7,7,10,0.7)] backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-bg1 border border-border rounded-2xl w-full max-w-[520px] max-h-[90vh] flex flex-col animate-modal-in shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 h-[52px] shrink-0 border-b border-border">
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-3.5 py-[5px] rounded-[7px] text-xs font-bold cursor-pointer border-none"
                  style={{ background: cat.hex, color: "#07070A" }}
                >
                  Save changes
                </button>
                <button
                  onClick={handleDiscard}
                  className="px-3 py-[5px] rounded-[7px] text-xs font-medium cursor-pointer bg-transparent text-text1 border border-border"
                >
                  Discard
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-3 py-[5px] rounded-[7px] text-xs font-semibold cursor-pointer bg-bg2 text-text1 border border-border"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit event
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && !editMode && (
              <span className="text-[10px] px-[7px] py-0.5 rounded" style={{ background: "#F5AA2C18", color: "#F5AA2C", border: "1px solid #F5AA2C30" }}>
                unsaved
              </span>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-[7px] border border-border bg-bg2 text-text1 cursor-pointer flex items-center justify-center text-base leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <CardArt event={draft} height={140} />

          <div className="px-5 pt-5">
            {/* Category */}
            {editMode ? (
              <div className="flex flex-wrap gap-[5px] mb-3.5">
                {Object.entries(CATS).map(([name, cfg]) => {
                  const isSel = draft.category === name;
                  return (
                    <button
                      key={name}
                      onClick={() => upd("category", name)}
                      className="px-[11px] py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors"
                      style={{
                        background: isSel ? cfg.hex + "22" : "#16161E",
                        border: `1px solid ${isSel ? cfg.hex + "55" : "#1E1E2C"}`,
                        color: isSel ? cfg.hex : "#3E3C52",
                      }}
                    >
                      {cfg.emoji} {name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mb-[10px]">
                <span
                  className="px-[11px] py-1 rounded-full text-[11px] font-semibold"
                  style={{ color: cat.hex, background: `${cat.hex}1A`, border: `1px solid ${cat.hex}30` }}
                >
                  {cat.emoji} {draft.category}
                </span>
              </div>
            )}

            {/* Name */}
            <div className="mb-3.5">
              {editMode ? (
                <input
                  value={draft.name}
                  onChange={(e) => upd("name", e.target.value)}
                  className="w-full bg-bg2 rounded-lg px-[10px] py-2 text-text0 text-xl font-extrabold tracking-[-0.025em] outline-none font-sans"
                  style={{ border: `1px solid ${cat.hex}33`, boxSizing: "border-box" }}
                  onFocus={(e) => { e.target.style.borderColor = `${cat.hex}66`; e.target.style.background = "#1E1E28"; }}
                  onBlur={(e) => { e.target.style.borderColor = `${cat.hex}33`; e.target.style.background = ""; }}
                />
              ) : (
                <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.03em] text-text0 leading-tight">
                  {draft.name}
                </h2>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] mb-5 rounded-xl bg-bg2 border border-border overflow-hidden">
              <div className="text-center py-3">
                <div className="text-xl font-extrabold text-text0">{draft.rsvp}</div>
                <div className="text-[10px] text-text2 mt-[3px]">going</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center py-3">
                <div className="text-xl font-extrabold text-text0">{spotsLeft < 0 ? 0 : spotsLeft}</div>
                <div className="text-[10px] text-text2 mt-[3px]">spots left</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center py-3">
                <div className="text-xl font-extrabold" style={{ color: pct >= 82 ? "#F05476" : "#F0EDF8" }}>{pct}%</div>
                <div className="text-[10px] text-text2 mt-[3px]">filled</div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <DrawerSection label="Event details">
            <DetailRow icon={<ClockIcon />} label="Date" value={draft.fullDate} editMode={editMode} onChange={(v) => upd("fullDate", v)} cat={cat} />
            <DetailRow icon={<PinIcon />} label="Location" value={draft.location} editMode={editMode} onChange={(v) => upd("location", v)} cat={cat} />
            <DetailRow icon={<StarIcon />} label="Rating" value={`${draft.rating} / 5`} editMode={false} cat={cat} />
            {editMode && (
              <DetailRow icon={<PeopleIcon />} label="Capacity" value={String(draft.capacity)} editMode={editMode} onChange={(v) => upd("capacity", parseInt(v) || draft.capacity)} cat={cat} type="number" />
            )}
          </DrawerSection>

          {/* About */}
          <DrawerSection label="About">
            {editMode ? (
              <textarea
                value={draft.notes}
                onChange={(e) => upd("notes", e.target.value)}
                rows={5}
                className="w-full bg-bg2 rounded-lg px-3 py-[10px] text-text0 text-sm leading-[1.65] outline-none font-sans resize-y"
                style={{ border: `1px solid ${cat.hex}33`, boxSizing: "border-box" }}
                onFocus={(e) => { e.target.style.borderColor = `${cat.hex}66`; e.target.style.background = "#1E1E28"; }}
                onBlur={(e) => { e.target.style.borderColor = `${cat.hex}33`; e.target.style.background = ""; }}
              />
            ) : (
              <p className="text-sm text-text1 leading-[1.7] m-0">{draft.notes}</p>
            )}
          </DrawerSection>

          {/* Hosts */}
          <DrawerSection label="Hosted by">
            <div className="flex flex-col gap-2">
              {draft.hosts.map((h, i) => (
                <div key={h} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-extrabold"
                    style={{
                      background: `linear-gradient(135deg, ${cat.hex}, ${cat.hex}99)`,
                      color: "#07070A",
                    }}
                  >
                    {h}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text0">{hostName(h)}</div>
                    <div className="text-xs text-text2 mt-0.5">{i === 0 ? "Event organizer" : "Co-host"}</div>
                  </div>
                </div>
              ))}
            </div>
          </DrawerSection>

          {/* Attendees */}
          <DrawerSection label={`Attendees \u00B7 ${draft.rsvp}`}>
            <div className="mb-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-text2">{draft.rsvp} of {draft.capacity} spots taken</span>
                <span className="text-[11px] font-bold" style={{ color: pct >= 82 ? "#F05476" : cat.hex }}>{pct}%</span>
              </div>
              <div className="h-1 bg-bg3 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-500 ease-in-out"
                  style={{
                    width: `${Math.min(100, pct)}%`,
                    background: pct >= 82 ? "#F05476" : cat.hex,
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {roster.map((a, i) => (
                <div key={i} className="flex items-center gap-[10px]">
                  <div
                    className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-extrabold"
                    style={{ background: a.color, color: "#07070A" }}
                  >
                    {a.initials}
                  </div>
                  <div className="text-sm text-text0">{a.name}</div>
                  {i === 0 && (
                    <span className="ml-auto text-[10px] font-semibold px-[7px] py-0.5 rounded" style={{ color: cat.hex, background: `${cat.hex}15` }}>
                      organizer
                    </span>
                  )}
                </div>
              ))}
            </div>
          </DrawerSection>

          <div className="h-5" />
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-bg1 shrink-0 flex gap-2">
          <button
            onClick={() => setRsvped((r) => !r)}
            className="flex-1 py-[11px] rounded-xl text-sm font-bold cursor-pointer border-none transition-colors"
            style={
              rsvped
                ? { background: `${cat.hex}1F`, color: cat.hex, outline: `1px solid ${cat.hex}44` }
                : { background: cat.hex, color: "#07070A" }
            }
          >
            {rsvped ? "\u2713 You're going!" : "RSVP to event"}
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-[11px] rounded-xl text-sm font-semibold cursor-pointer transition-colors shrink-0 min-w-[72px]"
            style={
              copied
                ? { background: "#1E1E28", color: cat.hex, border: `1px solid ${cat.hex}44` }
                : { background: "#16161E", color: "#8A87A0", border: "1px solid #1E1E2C" }
            }
          >
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function HeyAmaraEvents() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedId, setSelectedId] = useState(null);
  const [activeCat, setActiveCat] = useState("All");
  const [activeDate, setActiveDate] = useState(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const selectedEvent = events.find((e) => e.id === selectedId) ?? null;

  const handleSave = (updated) => {
    setEvents((evs) => evs.map((e) => (e.id === updated.id ? updated : e)));
  };

  const filtered = events.filter((e) => {
    const mc = activeCat === "All" || e.category === activeCat;
    const md = !activeDate || e.date === fmtDate(activeDate);
    const ms = !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return mc && md && ms;
  });

  const featured = filtered.filter((e) => e.featured);
  const rest = filtered.filter((e) => !e.featured);

  const liveCount = events.filter((e) => e.status === "Upcoming" || e.status === "Live").length;
  const totalRsvp = events.reduce((s, e) => s + e.rsvp, 0);
  const cities = [...new Set(events.map((e) => e.location))].length;

  return (
    <div className="h-screen flex flex-col bg-bg0 text-text0 font-sans">
      {/* Nav */}
      <nav className="shrink-0 z-50 bg-bg0/93 backdrop-blur-lg border-b border-border h-[54px] px-6 flex items-center justify-between">
        <div className="flex items-center gap-[9px]">
          <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-[#38BDF8] to-[#F472B6] flex items-center justify-center font-extrabold text-[15px] text-[#07070A]">
            A
          </div>
          <span className="font-bold text-[15px] tracking-[-0.025em]">HeyAmara</span>
          <span className="ml-1 px-2 py-0.5 rounded-[5px] text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 tracking-[0.06em]">
            BETA
          </span>
        </div>

        <div
          className="flex items-center gap-2 px-[13px] py-[7px] rounded-xl w-[230px] bg-bg1 transition-colors"
          style={{ border: `1px solid ${searchFocused ? "#8B7FF044" : "#1E1E2C"}` }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3E3C52" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search events, cities\u2026"
            className="bg-transparent border-none outline-none text-sm text-text0 w-full"
          />
          {search && (
            <span onClick={() => setSearch("")} className="cursor-pointer text-text2 text-sm">&times;</span>
          )}
        </div>

        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-1.5">
            <PulseDot />
            <span className="text-xs text-text2">{liveCount} upcoming</span>
          </div>
          <button className="px-4 py-1.5 rounded-[9px] text-xs font-bold bg-gradient-to-r from-[#38BDF8] to-[#F472B6] text-[#07070A] cursor-pointer border-none">
            + Host event
          </button>
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#2ED4A2] to-[#60A5FA] flex items-center justify-center text-[10px] font-extrabold text-[#07070A] cursor-pointer">
            KS
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hero */}
        <div className="shrink-0 px-6 pt-[34px] pb-[22px]">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PulseDot size={6} />
                <span className="text-[10px] font-bold text-text2 tracking-[0.12em] uppercase">Live & Upcoming</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-[-0.035em] leading-none m-0 text-text0">Meetups</h1>
            </div>
            <div className="flex gap-6">
              {[[liveCount, "coming up"], [totalRsvp, "people going"], [`${cities}+`, "cities"]].map(([n, l]) => (
                <div key={l} className="text-right">
                  <div className="text-2xl font-extrabold text-text0 leading-none">{n}</div>
                  <div className="text-[11px] text-text2 mt-[3px]">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Filter + Category Pills */}
        <div className="shrink-0 px-6 pb-6 flex items-start gap-3">
          <CalendarFilter value={activeDate} onChange={setActiveDate} />
          <div className="flex gap-1.5 flex-wrap flex-1">
            {["All", ...Object.keys(CATS)].map((cat) => {
              const cfg = CATS[cat];
              const isA = cat === activeCat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    background: isA ? `${cfg?.hex || "#F0EDF8"}1E` : "#0F0F14",
                    border: `1px solid ${isA ? `${cfg?.hex || "#F0EDF8"}55` : "#1E1E2C"}`,
                    color: isA ? cfg?.hex || "#F0EDF8" : "#8A87A0",
                  }}
                >
                  {cfg && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: cfg.hex }} />
                  )}
                  {cat === "All" ? "\u2726 All events" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grids */}
        <div className="flex-1 overflow-y-auto px-6 pb-16">
          {featured.length > 0 && (
            <div className="mb-8">
              <Divider label="Featured" />
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))" }}>
                {featured.map((e) => <EventCard key={e.id} event={e} featured onOpen={() => setSelectedId(e.id)} />)}
              </div>
            </div>
          )}
          {rest.length > 0 && (
            <div>
              <Divider label="All upcoming" count={rest.length} />
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
                {rest.map((e) => <EventCard key={e.id} event={e} onOpen={() => setSelectedId(e.id)} />)}
              </div>
            </div>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-text2">
              <div className="text-[44px] mb-4">\uD83C\uDF0D</div>
              <div className="text-lg font-bold text-text1 mb-1.5">No events found</div>
              <div className="text-sm">
                Try a different filter, or <span className="text-[#38BDF8] cursor-pointer">host your own \u2192</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {selectedEvent && (
        <DrawerPanel
          key={selectedEvent.id}
          event={selectedEvent}
          onClose={() => setSelectedId(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
