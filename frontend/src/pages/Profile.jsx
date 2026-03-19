import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SKILL_COLORS = [
  "#7DF9C2","#4B8BFF","#FFC400","#B46FFF","#FF6B6B","#00E5A0","#7EB5FF","#FFD166",
];

function SkillTag({ skill, color, onRemove }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"4px 10px 4px 12px", borderRadius:7,
      fontSize:12, fontWeight:600, fontFamily:"'Syne',sans-serif",
      border:`1px solid ${color}44`, background:`${color}14`, color,
    }}>
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)} style={{
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          width:14, height:14, borderRadius:"50%", background:"rgba(0,0,0,0.2)",
          border:"none", cursor:"pointer", fontSize:9, color:"inherit", padding:0,
        }}>✕</button>
      )}
    </span>
  );
}

export default function Profile() {
  const { user } = useAuth();

  const defaultProfile = {
    name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "User",
    email: user?.email || "",
    title: "",
    location: "",
    bio: "",
    linkedin: "",
    github: "",
    website: "",
    experience: "",
    education: "",
    skills: [],
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(defaultProfile);
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !draft.skills.includes(s)) set("skills", [...draft.skills, s]);
    setNewSkill("");
  };

  const removeSkill = (s) => set("skills", draft.skills.filter(sk => sk !== s));

  const fields = [
    ["name","Full Name"],["title","Job Title"],["location","Location"],
    ["experience","Years of Experience"],["education","Education"],
    ["linkedin","LinkedIn"],["github","GitHub"],["website","Website"],
  ];

  const current = editing ? draft : profile;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
        .pp { min-height:100vh; background:#0C0C14; padding:80px 24px 40px; font-family:'DM Sans',sans-serif; }
        .pp-inner { max-width:720px; margin:0 auto; }
        .pp-hero { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:18px; padding:28px; margin-bottom:16px; display:flex; align-items:center; gap:24px; flex-wrap:wrap; position:relative; overflow:hidden; }
        .pp-hero::before { content:''; position:absolute; top:-40px; right:-40px; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle,rgba(125,249,194,0.07),transparent 70%); pointer-events:none; }
        .pp-avatar { width:72px; height:72px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#7DF9C2,#4B8BFF); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#0C0C14; }
        .pp-hero-info { flex:1; min-width:200px; }
        .pp-name { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#F0EDE8; margin-bottom:3px; }
        .pp-role { font-size:14px; color:rgba(240,237,232,0.55); margin-bottom:4px; }
        .pp-email { font-family:'DM Mono',monospace; font-size:12px; color:rgba(240,237,232,0.35); }
        .pp-actions { display:flex; gap:8px; flex-shrink:0; }
        .pp-btn { padding:8px 18px; border-radius:9px; font-size:13px; font-weight:700; cursor:pointer; font-family:'Syne',sans-serif; transition:all .15s; border:1px solid; }
        .pp-btn-edit { background:rgba(125,249,194,0.1); border-color:rgba(125,249,194,0.3); color:#7DF9C2; }
        .pp-btn-edit:hover { background:rgba(125,249,194,0.18); }
        .pp-btn-save { background:rgba(125,249,194,0.15); border-color:rgba(125,249,194,0.4); color:#7DF9C2; }
        .pp-btn-cancel { background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.1); color:rgba(240,237,232,0.5); }
        .pp-section { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:22px; margin-bottom:14px; }
        .pp-sec-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.7px; color:rgba(240,237,232,0.4); margin-bottom:16px; }
        .pp-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(max-width:540px) { .pp-grid { grid-template-columns:1fr; } }
        .pp-field { display:flex; flex-direction:column; gap:5px; }
        .pp-field-label { font-size:11px; font-weight:700; color:rgba(240,237,232,0.35); text-transform:uppercase; letter-spacing:0.5px; }
        .pp-field-val { font-size:13px; color:rgba(240,237,232,0.8); font-family:'DM Mono',monospace; }
        .pp-field-empty { font-size:13px; color:rgba(240,237,232,0.2); font-style:italic; }
        .pp-input { padding:9px 12px; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); color:#F0EDE8; font-size:13px; outline:none; transition:border-color .15s; font-family:'DM Sans',sans-serif; width:100%; box-sizing:border-box; }
        .pp-input:focus { border-color:rgba(125,249,194,0.4); }
        .pp-bio-view { font-size:13px; color:rgba(240,237,232,0.6); line-height:1.7; }
        .pp-bio-empty { font-size:13px; color:rgba(240,237,232,0.2); font-style:italic; }
        .pp-skills-wrap { display:flex; flex-wrap:wrap; gap:7px; }
        .pp-skill-add { display:flex; gap:8px; margin-top:12px; }
        .pp-skill-input { flex:1; padding:8px 12px; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); color:#F0EDE8; font-size:13px; outline:none; font-family:'DM Sans',sans-serif; }
        .pp-skill-input:focus { border-color:rgba(125,249,194,0.4); }
        .pp-skill-add-btn { padding:8px 16px; border-radius:8px; background:rgba(125,249,194,0.1); border:1px solid rgba(125,249,194,0.3); color:#7DF9C2; font-size:13px; font-weight:700; cursor:pointer; font-family:'Syne',sans-serif; transition:all .15s; }
        .pp-skill-add-btn:hover { background:rgba(125,249,194,0.18); }
        .pp-saved { position:fixed; bottom:24px; right:24px; z-index:300; background:rgba(125,249,194,0.15); border:1px solid rgba(125,249,194,0.4); color:#7DF9C2; padding:10px 20px; border-radius:10px; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; animation:pp-toast .25s ease; }
        @keyframes pp-toast { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .pp-empty-notice { text-align:center; padding:12px; background:rgba(125,249,194,0.05); border:1px dashed rgba(125,249,194,0.2); border-radius:10px; font-size:13px; color:rgba(125,249,194,0.6); margin-bottom:14px; }
      `}</style>

      <div className="pp">
        <div className="pp-inner">

          {/* Prompt to complete profile if empty */}
          {!profile.title && !editing && (
            <div className="pp-empty-notice">
              👋 Welcome, {user?.firstName}! Complete your profile to get personalized job matches.
              <button onClick={() => setEditing(true)} style={{ marginLeft:10, background:"none", border:"none", color:"#7DF9C2", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                Fill it out →
              </button>
            </div>
          )}

          {/* Hero */}
          <div className="pp-hero">
            <div className="pp-avatar">
              {(current.name || user?.firstName || "U").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <div className="pp-hero-info">
              <div className="pp-name">{current.name || `${user?.firstName} ${user?.lastName}`}</div>
              {current.title
                ? <div className="pp-role">{current.title}</div>
                : <div className="pp-role" style={{color:"rgba(240,237,232,0.25)",fontStyle:"italic"}}>No title set</div>}
              <div className="pp-email">{user?.email}</div>
            </div>
            <div className="pp-actions">
              {editing
                ? <>
                    <button className="pp-btn pp-btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button className="pp-btn pp-btn-save" onClick={handleSave}>Save</button>
                  </>
                : <button className="pp-btn pp-btn-edit" onClick={() => setEditing(true)}>✎ Edit Profile</button>
              }
            </div>
          </div>

          {/* Bio */}
          <div className="pp-section">
            <div className="pp-sec-title">About</div>
            {editing
              ? <textarea className="pp-input" style={{width:"100%",minHeight:80,resize:"vertical",lineHeight:1.6}} value={draft.bio} onChange={e => set("bio", e.target.value)} placeholder="Write a short bio..." />
              : current.bio
                ? <div className="pp-bio-view">{current.bio}</div>
                : <div className="pp-bio-empty">No bio added yet. Click Edit Profile to add one.</div>
            }
          </div>

          {/* Details */}
          <div className="pp-section">
            <div className="pp-sec-title">Details</div>
            <div className="pp-grid">
              {fields.map(([key, label]) => (
                <div className="pp-field" key={key}>
                  <span className="pp-field-label">{label}</span>
                  {editing
                    ? <input className="pp-input" value={draft[key] || ""} onChange={e => set(key, e.target.value)} placeholder={label} />
                    : current[key]
                      ? <span className="pp-field-val">{current[key]}</span>
                      : <span className="pp-field-empty">Not set</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="pp-section">
            <div className="pp-sec-title">Skills</div>
            <div className="pp-skills-wrap">
              {current.skills.length > 0
                ? current.skills.map((s, i) => (
                    <SkillTag key={s} skill={s} color={SKILL_COLORS[i % SKILL_COLORS.length]} onRemove={editing ? removeSkill : null} />
                  ))
                : <span style={{fontSize:13,color:"rgba(240,237,232,0.25)"}}>
                    {editing ? "Add your first skill below" : "No skills added yet."}
                  </span>
              }
            </div>
            {editing && (
              <div className="pp-skill-add">
                <input className="pp-skill-input" placeholder="e.g. React, Python, SQL"
                  value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSkill()} />
                <button className="pp-skill-add-btn" onClick={addSkill}>+ Add</button>
              </div>
            )}
          </div>

        </div>
      </div>
      {saved && <div className="pp-saved">✓ Profile saved</div>}
    </>
  );
}
