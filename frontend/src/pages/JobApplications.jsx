// pages/JobApplications.jsx
import { useState } from "react";
import ApplicationCard from "../components/ApplicationCard";

const COLUMNS = ["APPLIED", "SCREENING", "INTERVIEW", "TECHNICAL", "OFFER", "REJECTED"];

const COL_META = {
  APPLIED:   { label: "Applied",    icon: "📤", color: "#4B8BFF" },
  SCREENING: { label: "Screening",  icon: "🔍", color: "#FFC400" },
  INTERVIEW: { label: "Interview",  icon: "🗣",  color: "#7DF9C2" },
  TECHNICAL: { label: "Technical",  icon: "💻", color: "#B46FFF" },
  OFFER:     { label: "Offer",      icon: "🎉", color: "#00E5A0" },
  REJECTED:  { label: "Rejected",   icon: "✕",  color: "#FF6B6B" },
};

const MOCK = [
  { id: 1, role: "Senior Frontend Engineer", company: "Stripe", location: "Remote", salary: "$180k", type: "Full-time", status: "INTERVIEW", appliedDate: "2024-01-10" },
  { id: 2, role: "Product Designer", company: "Figma", location: "SF", salary: "$160k", type: "Full-time", status: "SCREENING", appliedDate: "2024-01-08" },
  { id: 3, role: "Backend Engineer", company: "Vercel", location: "Remote", salary: "$170k", type: "Full-time", status: "APPLIED", appliedDate: "2024-01-12" },
  { id: 4, role: "Staff Engineer", company: "Linear", location: "NYC", salary: "$210k", type: "Full-time", status: "TECHNICAL", appliedDate: "2024-01-05" },
  { id: 5, role: "UX Engineer", company: "Notion", location: "Remote", salary: "$150k", type: "Full-time", status: "OFFER", appliedDate: "2023-12-28" },
  { id: 6, role: "React Developer", company: "Atlassian", location: "Austin", salary: "$140k", type: "Full-time", status: "REJECTED", appliedDate: "2023-12-20" },
  { id: 7, role: "Full Stack Engineer", company: "Loom", location: "Remote", salary: "$155k", type: "Contract", status: "APPLIED", appliedDate: "2024-01-13" },
];

function AddAppModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ role: "", company: "", location: "", salary: "", type: "Full-time", status: "APPLIED" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <style>{`
        .modal-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,0.65);
          z-index:500; display:flex; align-items:center; justify-content:center;
          backdrop-filter:blur(4px);
        }
        .modal-box {
          background:#13131F; border:1px solid rgba(255,255,255,0.1);
          border-radius:18px; padding:28px; width:100%; max-width:440px;
          font-family:'DM Sans',sans-serif;
          animation:modal-in .2s ease;
        }
        @keyframes modal-in { from{opacity:0;transform:scale(0.96)translateY(8px)} to{opacity:1;transform:none} }
        .modal-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#F0EDE8; margin-bottom:20px; }
        .modal-row { margin-bottom:14px; }
        .modal-label { font-size:11px; font-weight:700; color:rgba(240,237,232,0.45); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:5px; display:block; }
        .modal-input,.modal-select {
          width:100%; padding:10px 13px; border-radius:9px;
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
          color:#F0EDE8; font-size:13px; outline:none;
          transition:border-color .15s; box-sizing:border-box;
          font-family:'DM Sans',sans-serif;
        }
        .modal-input:focus,.modal-select:focus { border-color:rgba(125,249,194,0.4); }
        .modal-select option { background:#13131F; }
        .modal-footer { display:flex; gap:10px; margin-top:20px; }
        .modal-btn {
          flex:1; padding:10px; border-radius:9px; font-size:13px; font-weight:700;
          cursor:pointer; font-family:'Syne',sans-serif; transition:all .15s; border:1px solid;
        }
        .modal-btn-primary { background:rgba(125,249,194,0.12); border-color:rgba(125,249,194,0.35); color:#7DF9C2; }
        .modal-btn-primary:hover { background:rgba(125,249,194,0.2); }
        .modal-btn-cancel { background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.1); color:rgba(240,237,232,0.5); }
        .modal-btn-cancel:hover { background:rgba(255,255,255,0.08); }
      `}</style>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="modal-title">+ Add Application</div>
          {[["role","Role / Position"],["company","Company"],["location","Location"],["salary","Salary Range"]].map(([k,lbl]) => (
            <div className="modal-row" key={k}>
              <label className="modal-label">{lbl}</label>
              <input className="modal-input" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={lbl} />
            </div>
          ))}
          <div className="modal-row">
            <label className="modal-label">Type</label>
            <select className="modal-select" value={form.type} onChange={e => set("type", e.target.value)}>
              {["Full-time","Part-time","Contract","Internship","Freelance"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="modal-row">
            <label className="modal-label">Status</label>
            <select className="modal-select" value={form.status} onChange={e => set("status", e.target.value)}>
              {COLUMNS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="modal-footer">
            <button className="modal-btn modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="modal-btn modal-btn-primary" onClick={() => { if(form.role && form.company) { onAdd({...form, id:Date.now(), appliedDate:new Date().toISOString()}); onClose(); } }}>
              Add Application
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function JobApplications() {
  const [apps, setApps] = useState(MOCK);
  const [showModal, setShowModal] = useState(false);
  const [dragId, setDragId] = useState(null);

  const byStatus = (s) => apps.filter(a => a.status === s);
  const totalActive = apps.filter(a => !["REJECTED","OFFER"].includes(a.status)).length;

  const moveApp = (id, newStatus) =>
    setApps(a => a.map(app => app.id === id ? { ...app, status: newStatus } : app));

  const deleteApp = (id) => setApps(a => a.filter(app => app.id !== id));

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (dragId) { moveApp(dragId, status); setDragId(null); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
        .ja-page {
          min-height:100vh; background:#0C0C14; padding:80px 24px 40px;
          font-family:'DM Sans',sans-serif;
        }
        .ja-header {
          max-width:1400px; margin:0 auto 28px;
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
        }
        .ja-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#F0EDE8; letter-spacing:-0.5px; }
        .ja-stats { display:flex; gap:20px; }
        .ja-stat { text-align:center; }
        .ja-stat-num { font-family:'DM Mono',monospace; font-size:22px; font-weight:500; color:#7DF9C2; }
        .ja-stat-lbl { font-size:11px; color:rgba(240,237,232,0.4); text-transform:uppercase; letter-spacing:0.5px; }
        .ja-add-btn {
          padding:9px 20px; border-radius:10px;
          background:rgba(125,249,194,0.1); border:1px solid rgba(125,249,194,0.3);
          color:#7DF9C2; font-size:13px; font-weight:700; cursor:pointer;
          font-family:'Syne',sans-serif; transition:all .15s; letter-spacing:0.2px;
        }
        .ja-add-btn:hover { background:rgba(125,249,194,0.18); }
        .ja-board {
          max-width:1400px; margin:0 auto;
          display:grid; grid-template-columns:repeat(6,1fr);
          gap:14px; overflow-x:auto; padding-bottom:12px;
        }
        @media(max-width:1100px) { .ja-board { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:700px)  { .ja-board { grid-template-columns:repeat(2,1fr); } }
        .ja-col {
          background:rgba(255,255,255,0.02);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:16px; padding:14px;
          min-height:300px; transition:background .15s;
        }
        .ja-col.dragover { background:rgba(125,249,194,0.04); border-color:rgba(125,249,194,0.2); }
        .ja-col-header {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:14px;
        }
        .ja-col-name {
          display:flex; align-items:center; gap:6px;
          font-family:'Syne',sans-serif; font-size:12px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.6px;
        }
        .ja-col-count {
          font-family:'DM Mono',monospace; font-size:11px;
          padding:2px 7px; border-radius:20px;
          background:rgba(255,255,255,0.07); color:rgba(240,237,232,0.5);
        }
        .ja-col-cards { display:flex; flex-direction:column; gap:8px; }
        .ja-empty {
          padding:20px; text-align:center;
          font-size:12px; color:rgba(240,237,232,0.2);
          border:1px dashed rgba(255,255,255,0.07); border-radius:10px;
        }
      `}</style>

      <div className="ja-page">
        <div className="ja-header">
          <div>
            <div className="ja-title">Job Applications</div>
          </div>
          <div className="ja-stats">
            <div className="ja-stat">
              <div className="ja-stat-num">{apps.length}</div>
              <div className="ja-stat-lbl">Total</div>
            </div>
            <div className="ja-stat">
              <div className="ja-stat-num">{totalActive}</div>
              <div className="ja-stat-lbl">Active</div>
            </div>
            <div className="ja-stat">
              <div className="ja-stat-num" style={{ color:"#00E5A0" }}>
                {apps.filter(a => a.status === "OFFER").length}
              </div>
              <div className="ja-stat-lbl">Offers</div>
            </div>
          </div>
          <button className="ja-add-btn" onClick={() => setShowModal(true)}>+ Add Application</button>
        </div>

        <div className="ja-board">
          {COLUMNS.map(col => {
            const meta = COL_META[col];
            const cards = byStatus(col);
            return (
              <div
                key={col}
                className="ja-col"
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("dragover"); }}
                onDragLeave={e => e.currentTarget.classList.remove("dragover")}
                onDrop={e => { e.currentTarget.classList.remove("dragover"); handleDrop(e, col); }}
              >
                <div className="ja-col-header">
                  <div className="ja-col-name" style={{ color: meta.color }}>
                    {meta.icon} {meta.label}
                  </div>
                  <span className="ja-col-count">{cards.length}</span>
                </div>
                <div className="ja-col-cards">
                  {cards.length === 0
                    ? <div className="ja-empty">Drop here</div>
                    : cards.map(app => (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={() => setDragId(app.id)}
                          onDragEnd={() => setDragId(null)}
                        >
                          <ApplicationCard
                            app={app}
                            onDelete={deleteApp}
                            onMove={moveApp}
                            allStatuses={COLUMNS}
                          />
                        </div>
                      ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <AddAppModal onAdd={a => setApps(p => [...p, a])} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}