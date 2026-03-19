// components/ApplicationCard.jsx

const STATUS_META = {
  APPLIED:   { color: "#4B8BFF", bg: "rgba(75,139,255,0.12)"  },
  SCREENING: { color: "#FFC400", bg: "rgba(255,196,0,0.12)"   },
  INTERVIEW: { color: "#7DF9C2", bg: "rgba(125,249,194,0.12)" },
  TECHNICAL: { color: "#B46FFF", bg: "rgba(180,111,255,0.12)" },
  OFFER:     { color: "#00E5A0", bg: "rgba(0,229,160,0.12)"   },
  REJECTED:  { color: "#FF6B6B", bg: "rgba(255,107,107,0.1)"  },
};

export default function ApplicationCard({ app, onDelete, onMove, allStatuses }) {
  const meta = STATUS_META[app.status] || STATUS_META.APPLIED;
  const appliedDate = app.appliedDate
    ? new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .app-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 14px;
          cursor: grab;
          transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .app-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: var(--card-accent);
          border-radius: 3px 0 0 3px;
        }
        .app-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          border-color: rgba(255,255,255,0.13);
        }
        .app-card:active { cursor: grabbing; }
        .card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
        .card-role {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #F0EDE8; line-height: 1.3;
        }
        .card-company {
          font-size: 12px; color: rgba(240,237,232,0.55);
          margin-bottom: 10px; font-weight: 500;
        }
        .card-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
        .card-tag {
          padding: 2px 8px; border-radius: 20px;
          font-size: 11px; font-weight: 600;
          border: 1px solid;
          letter-spacing: 0.2px;
        }
        .card-footer {
          display: flex; align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .card-date { font-size: 11px; color: rgba(240,237,232,0.35); font-family: 'DM Mono', monospace; }
        .card-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
        .app-card:hover .card-actions { opacity: 1; }
        .card-btn {
          background: rgba(255,255,255,0.06);
          border: none; border-radius: 6px;
          color: rgba(240,237,232,0.6);
          font-size: 11px; padding: 3px 7px;
          cursor: pointer; transition: all 0.12s;
        }
        .card-btn:hover { background: rgba(255,255,255,0.12); color: #F0EDE8; }
        .card-btn.del:hover { background: rgba(255,107,107,0.18); color: #FF6B6B; }
        .card-move-select {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px; color: rgba(240,237,232,0.7);
          font-size: 11px; padding: 2px 6px; cursor: pointer;
          outline: none;
        }
      `}</style>
      <div className="app-card" style={{ "--card-accent": meta.color }}>
        <div className="card-header">
          <div className="card-role">{app.role || "Role"}</div>
        </div>
        <div className="card-company">🏢 {app.company || "Company"}</div>
        <div className="card-tags">
          {app.location && (
            <span className="card-tag" style={{ color: "#A0B4C8", borderColor: "rgba(160,180,200,0.3)", background: "rgba(160,180,200,0.08)" }}>
              📍 {app.location}
            </span>
          )}
          {app.salary && (
            <span className="card-tag" style={{ color: "#7DF9C2", borderColor: "rgba(125,249,194,0.3)", background: "rgba(125,249,194,0.08)" }}>
              💰 {app.salary}
            </span>
          )}
          {app.type && (
            <span className="card-tag" style={{ color: "#FFC400", borderColor: "rgba(255,196,0,0.3)", background: "rgba(255,196,0,0.08)" }}>
              {app.type}
            </span>
          )}
        </div>
        <div className="card-footer">
          <span className="card-date">{appliedDate}</span>
          <div className="card-actions">
            {allStatuses && onMove && (
              <select
                className="card-move-select"
                value={app.status}
                onChange={e => onMove(app.id, e.target.value)}
              >
                {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            {onDelete && (
              <button className="card-btn del" onClick={() => onDelete(app.id)}>✕</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}