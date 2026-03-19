// pages/Resumes.jsx
import { useState } from "react";
import ResumeUploader from "../components/ResumeUploader";

const MOCK_RESUMES = [
  { id:1, name:"John_Doe_Resume_2024.pdf", size:"142.3 KB", type:"PDF", uploadedAt:"2024-01-10T10:30:00", isActive:true },
  { id:2, name:"John_Doe_Resume_SWE.docx", size:"98.7 KB", type:"DOCX", uploadedAt:"2024-01-05T09:00:00", isActive:false },
  { id:3, name:"John_Doe_Resume_Design.pdf", size:"210.5 KB", type:"PDF", uploadedAt:"2023-12-20T14:45:00", isActive:false },
];

const TYPE_META = {
  PDF:  { color:"#FF6B6B", bg:"rgba(255,107,107,0.1)", icon:"📄" },
  DOCX: { color:"#4B8BFF", bg:"rgba(75,139,255,0.1)",  icon:"📝" },
};

function ResumeRow({ resume, onDelete, onSetActive }) {
  const meta = TYPE_META[resume.type] || TYPE_META.PDF;
  const date = new Date(resume.uploadedAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });

  return (
    <>
      <style>{`
        .rr-row {
          display:flex; align-items:center; gap:14px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:12px; padding:14px 18px;
          transition:all .15s; position:relative;
          font-family:'DM Sans',sans-serif;
        }
        .rr-row:hover { border-color:rgba(255,255,255,0.12); background:rgba(255,255,255,0.04); }
        .rr-row.active-resume { border-color:rgba(125,249,194,0.3); background:rgba(125,249,194,0.04); }
        .rr-icon { font-size:28px; flex-shrink:0; }
        .rr-info { flex:1; min-width:0; }
        .rr-name {
          font-family:'Syne',sans-serif; font-size:14px; font-weight:700;
          color:#F0EDE8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          margin-bottom:3px;
        }
        .rr-meta { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
        .rr-badge {
          font-size:11px; font-weight:700; padding:2px 7px;
          border-radius:5px; letter-spacing:0.2px;
        }
        .rr-date { font-family:'DM Mono',monospace; font-size:11px; color:rgba(240,237,232,0.35); }
        .rr-size { font-size:11px; color:rgba(240,237,232,0.35); }
        .rr-active-badge {
          font-size:11px; font-weight:700; padding:3px 8px; border-radius:20px;
          background:rgba(125,249,194,0.12); color:#7DF9C2;
          border:1px solid rgba(125,249,194,0.3);
        }
        .rr-actions { display:flex; gap:6px; flex-shrink:0; }
        .rr-btn {
          padding:5px 11px; border-radius:7px; font-size:12px; font-weight:700;
          cursor:pointer; border:1px solid; font-family:'Syne',sans-serif; transition:all .15s;
        }
        .rr-btn-set { background:rgba(125,249,194,0.07); border-color:rgba(125,249,194,0.2); color:rgba(125,249,194,0.7); }
        .rr-btn-set:hover { background:rgba(125,249,194,0.15); border-color:rgba(125,249,194,0.4); color:#7DF9C2; }
        .rr-btn-del { background:rgba(255,107,107,0.06); border-color:rgba(255,107,107,0.15); color:rgba(255,107,107,0.6); }
        .rr-btn-del:hover { background:rgba(255,107,107,0.15); border-color:rgba(255,107,107,0.35); color:#FF6B6B; }
      `}</style>
      <div className={`rr-row${resume.isActive ? " active-resume" : ""}`}>
        <div className="rr-icon">{meta.icon}</div>
        <div className="rr-info">
          <div className="rr-name">{resume.name}</div>
          <div className="rr-meta">
            <span className="rr-badge" style={{ color:meta.color, background:meta.bg }}>{resume.type}</span>
            <span className="rr-size">{resume.size}</span>
            <span className="rr-date">{date}</span>
            {resume.isActive && <span className="rr-active-badge">✓ Active</span>}
          </div>
        </div>
        <div className="rr-actions">
          {!resume.isActive && (
            <button className="rr-btn rr-btn-set" onClick={() => onSetActive(resume.id)}>
              Set Active
            </button>
          )}
          <button className="rr-btn rr-btn-del" onClick={() => onDelete(resume.id)}>Delete</button>
        </div>
      </div>
    </>
  );
}

export default function Resumes() {
  const [resumes, setResumes] = useState(MOCK_RESUMES);

  const handleUpload = (r) => setResumes(rs => [{ ...r, isActive: rs.length === 0 }, ...rs]);
  const handleDelete = (id) => setResumes(rs => rs.filter(r => r.id !== id));
  const handleSetActive = (id) => setResumes(rs => rs.map(r => ({ ...r, isActive: r.id === id })));

  const activeResume = resumes.find(r => r.isActive);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
        .rp { min-height:100vh; background:#0C0C14; padding:80px 24px 40px; font-family:'DM Sans',sans-serif; }
        .rp-inner { max-width:760px; margin:0 auto; }
        .rp-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#F0EDE8; letter-spacing:-0.5px; margin-bottom:4px; }
        .rp-sub { font-size:13px; color:rgba(240,237,232,0.4); margin-bottom:28px; }
        .rp-section-title {
          font-family:'Syne',sans-serif; font-size:13px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.7px;
          color:rgba(240,237,232,0.4); margin-bottom:14px;
          display:flex; align-items:center; gap:8px;
        }
        .rp-divider { border:none; border-top:1px solid rgba(255,255,255,0.06); margin:28px 0; }
        .rp-list { display:flex; flex-direction:column; gap:10px; }
        .rp-active-banner {
          background:rgba(125,249,194,0.06); border:1px solid rgba(125,249,194,0.2);
          border-radius:12px; padding:14px 18px; margin-bottom:28px;
          display:flex; align-items:center; gap:12px;
          font-size:13px; color:rgba(240,237,232,0.6);
        }
        .rp-active-name { font-family:'Syne',sans-serif; font-weight:700; color:#7DF9C2; }
        .rp-empty { text-align:center; padding:40px; color:rgba(240,237,232,0.25); font-size:14px; }
        .rp-count { font-family:'DM Mono',monospace; font-size:11px; padding:2px 7px; border-radius:20px; background:rgba(255,255,255,0.07); color:rgba(240,237,232,0.4); }
      `}</style>

      <div className="rp">
        <div className="rp-inner">
          <div className="rp-title">Resumes</div>
          <div className="rp-sub">Upload and manage your resume versions</div>

          {activeResume && (
            <div className="rp-active-banner">
              <span>📌</span>
              <span>Active resume: <span className="rp-active-name">{activeResume.name}</span></span>
            </div>
          )}

          <div className="rp-section-title">↑ Upload New Resume</div>
          <ResumeUploader onUpload={handleUpload} />

          <hr className="rp-divider" />

          <div className="rp-section-title">
            All Resumes <span className="rp-count">{resumes.length}</span>
          </div>

          {resumes.length === 0
            ? <div className="rp-empty">No resumes uploaded yet.</div>
            : (
              <div className="rp-list">
                {resumes.map(r => (
                  <ResumeRow key={r.id} resume={r} onDelete={handleDelete} onSetActive={handleSetActive} />
                ))}
              </div>
            )}
        </div>
      </div>
    </>
  );
}