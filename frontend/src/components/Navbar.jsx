import { useState } from "react";

const NAV_LINKS = [
  { label: "Dashboard",    path: "/dashboard",    icon: "⊞" },
  { label: "Applications", path: "/applications", icon: "⬡" },
  { label: "Goals",        path: "/goals",        icon: "◎" },
  { label: "Resumes",      path: "/resumes",      icon: "▤" },
  { label: "AI Analyzer",  path: "/analyzer",     icon: "✦" },
  { label: "Profile",      path: "/profile",      icon: "◉" },
];

export default function Navbar({ activePath = "/dashboard", onNavigate, onLogout, user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = (user?.name || user?.email || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap');
        :root { --bg:#0C0C14; --bg2:#13131F; --border:rgba(255,255,255,0.07); --accent:#7DF9C2; --accent2:#4B8BFF; --danger:#FF6B6B; --text:#F0EDE8; --text-muted:rgba(240,237,232,0.45); }
        .nb { position:fixed; top:0; left:0; right:0; z-index:200; height:60px; background:rgba(12,12,20,0.92); backdrop-filter:blur(24px); border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 28px; font-family:'Syne',sans-serif; }
        .nb-brand { font-size:17px; font-weight:800; color:var(--accent); cursor:pointer; margin-right:28px; display:flex; align-items:center; gap:7px; flex-shrink:0; user-select:none; }
        .nb-brand em { color:var(--text); font-style:normal; }
        .nb-links { display:flex; gap:2px; flex:1; }
        .nb-link { display:flex; align-items:center; gap:5px; padding:6px 10px; border-radius:8px; font-size:12px; font-weight:600; color:var(--text-muted); background:transparent; border:none; cursor:pointer; transition:color .15s,background .15s; white-space:nowrap; font-family:'Syne',sans-serif; }
        .nb-link:hover { color:var(--text); background:rgba(255,255,255,0.05); }
        .nb-link.active { color:var(--accent); background:rgba(125,249,194,0.09); }
        .nb-right { display:flex; align-items:center; gap:10px; margin-left:auto; padding-left:12px; flex-shrink:0; }
        .nb-username { font-family:'DM Mono',monospace; font-size:12px; color:var(--text-muted); max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .nb-avatar { width:30px; height:30px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#0C0C14; cursor:pointer; }
        .nb-logout { padding:5px 13px; border-radius:7px; background:rgba(255,107,107,0.09); border:1px solid rgba(255,107,107,0.22); color:var(--danger); font-size:12px; font-weight:700; cursor:pointer; font-family:'Syne',sans-serif; transition:all .15s; }
        .nb-logout:hover { background:rgba(255,107,107,0.18); }
        .nb-mobile-btn { display:none; background:none; border:none; color:var(--text); font-size:20px; cursor:pointer; margin-left:auto; }
        .nb-mobile-menu { position:fixed; top:60px; left:0; right:0; background:var(--bg2); border-bottom:1px solid var(--border); padding:12px 16px; display:flex; flex-direction:column; gap:4px; z-index:199; }
        @media(max-width:960px) { .nb-links,.nb-username { display:none; } .nb-mobile-btn { display:flex; } }
      `}</style>
      <nav className="nb">
        <div className="nb-brand" onClick={() => onNavigate?.("/dashboard")}>◈ Career<em>OS</em></div>
        <div className="nb-links">
          {NAV_LINKS.map(l => (
            <button key={l.path} className={`nb-link${activePath === l.path ? " active" : ""}`} onClick={() => onNavigate?.(l.path)}>
              <span style={{fontSize:11}}>{l.icon}</span>{l.label}
            </button>
          ))}
        </div>
        <div className="nb-right">
          <span className="nb-username">{user?.name || user?.email || "user"}</span>
          <div className="nb-avatar">{initials}</div>
          <button className="nb-logout" onClick={onLogout}>Logout</button>
        </div>
        <button className="nb-mobile-btn" onClick={() => setMobileOpen(o => !o)}>{mobileOpen ? "✕" : "☰"}</button>
      </nav>
      {mobileOpen && (
        <div className="nb-mobile-menu">
          {NAV_LINKS.map(l => (
            <button key={l.path} className={`nb-link${activePath === l.path ? " active" : ""}`} onClick={() => { onNavigate?.(l.path); setMobileOpen(false); }}>
              <span style={{fontSize:11}}>{l.icon}</span>{l.label}
            </button>
          ))}
          <button className="nb-logout" style={{marginTop:8,width:"100%"}} onClick={onLogout}>Logout</button>
        </div>
      )}
    </>
  );
}
