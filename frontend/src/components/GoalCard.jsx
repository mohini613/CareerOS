// components/GoalCard.jsx
import { useState } from "react";

const PRIORITY_META = {
  HIGH:   { color: "#FF6B6B", label: "High"   },
  MEDIUM: { color: "#FFC400", label: "Medium" },
  LOW:    { color: "#4B8BFF", label: "Low"    },
};

export default function GoalCard({ goal, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [progress, setProgress] = useState(goal.progress ?? 0);

  const pMeta = PRIORITY_META[goal.priority] || PRIORITY_META.MEDIUM;
  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / 86400000)
    : null;
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isDone = progress >= 100;

  const handleProgressChange = (val) => {
    setProgress(val);
    onUpdate?.({ ...goal, progress: val });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');
        .goal-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px;
          transition: box-shadow 0.2s, border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }
        .goal-card:hover {
          box-shadow: 0 6px 28px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.12);
        }
        .goal-done { opacity: 0.55; }
        .goal-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; }
        .goal-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #F0EDE8; line-height: 1.3; flex: 1;
        }
        .goal-done-badge {
          font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 20px;
          background: rgba(125,249,194,0.15); color: #7DF9C2;
          border: 1px solid rgba(125,249,194,0.3);
          margin-left: 8px; flex-shrink: 0;
        }
        .goal-desc { font-size: 12px; color: rgba(240,237,232,0.45); margin-bottom:12px; line-height:1.5; }
        .goal-meta { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
        .goal-badge {
          font-size: 11px; font-weight: 600; padding: 2px 8px;
          border-radius: 20px; border: 1px solid; letter-spacing: 0.2px;
        }
        .goal-progress-label {
          display:flex; justify-content:space-between; align-items:center;
          margin-bottom:6px;
        }
        .goal-progress-text { font-size:12px; color:rgba(240,237,232,0.5); }
        .goal-progress-pct { font-family:'DM Mono',monospace; font-size:13px; font-weight:500; }
        .goal-bar-track {
          height: 6px; background: rgba(255,255,255,0.08);
          border-radius: 99px; overflow: hidden; margin-bottom:10px;
        }
        .goal-bar-fill {
          height: 100%; border-radius: 99px;
          transition: width 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .goal-range {
          width: 100%; accent-color: var(--progress-color);
          margin-bottom: 10px; cursor: pointer; display:block;
        }
        .goal-footer { display:flex; justify-content:space-between; align-items:center; margin-top:4px; }
        .goal-deadline { font-size:11px; }
        .goal-actions { display:flex; gap:4px; }
        .goal-btn {
          background:rgba(255,255,255,0.06); border:none; border-radius:6px;
          color:rgba(240,237,232,0.6); font-size:11px; padding:4px 8px;
          cursor:pointer; transition:all .12s; font-family:'Syne',sans-serif;
        }
        .goal-btn:hover { background:rgba(255,255,255,0.12); color:#F0EDE8; }
        .goal-btn.del:hover { background:rgba(255,107,107,0.18); color:#FF6B6B; }
      `}</style>
      <div className={`goal-card${isDone ? " goal-done" : ""}`}>
        <div className="goal-top">
          <div className="goal-title">{goal.title}</div>
          {isDone && <span className="goal-done-badge">✓ Done</span>}
        </div>

        {goal.description && <div className="goal-desc">{goal.description}</div>}

        <div className="goal-meta">
          <span className="goal-badge" style={{ color: pMeta.color, borderColor: `${pMeta.color}44`, background: `${pMeta.color}14` }}>
            {pMeta.label} Priority
          </span>
          {goal.category && (
            <span className="goal-badge" style={{ color: "#A0B4FF", borderColor: "rgba(160,180,255,0.3)", background: "rgba(160,180,255,0.08)" }}>
              {goal.category}
            </span>
          )}
        </div>

        <div className="goal-progress-label">
          <span className="goal-progress-text">Progress</span>
          <span className="goal-progress-pct" style={{ color: isDone ? "#7DF9C2" : "rgba(240,237,232,0.8)" }}>
            {progress}%
          </span>
        </div>

        <div className="goal-bar-track">
          <div
            className="goal-bar-fill"
            style={{
              width: `${progress}%`,
              background: isDone
                ? "linear-gradient(90deg,#7DF9C2,#00E5A0)"
                : `linear-gradient(90deg,${pMeta.color}99,${pMeta.color})`,
              "--progress-color": pMeta.color,
            }}
          />
        </div>

        <input
          type="range" min="0" max="100" step="5"
          value={progress}
          className="goal-range"
          style={{ "--progress-color": pMeta.color }}
          onChange={e => handleProgressChange(Number(e.target.value))}
        />

        <div className="goal-footer">
          <span className="goal-deadline" style={{ color: isOverdue ? "#FF6B6B" : "rgba(240,237,232,0.35)" }}>
            {daysLeft === null
              ? "No deadline"
              : isOverdue
              ? `⚠ ${Math.abs(daysLeft)}d overdue`
              : daysLeft === 0
              ? "⏰ Due today"
              : `📅 ${daysLeft}d left`}
          </span>
          <div className="goal-actions">
            {onDelete && (
              <button className="goal-btn del" onClick={() => onDelete(goal.id)}>✕ Delete</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}