// pages/Goals.jsx
import { useState } from "react";
import GoalCard from "../components/GoalCard";

const MOCK_GOALS = [
  { id:1, title:"Land a Senior Engineer role", description:"Target FAANG or top-tier startup", priority:"HIGH", category:"Job Search", progress:65, deadline:"2024-03-31" },
  { id:2, title:"Complete System Design course", description:"Finish Grokking the System Design Interview", priority:"HIGH", category:"Learning", progress:40, deadline:"2024-02-15" },
  { id:3, title:"Build 2 side projects for portfolio", description:"One fullstack app, one open source contribution", priority:"MEDIUM", category:"Portfolio", progress:50, deadline:"2024-04-30" },
  { id:4, title:"Improve LeetCode to 200 problems", description:"Focus on medium/hard dynamic programming", priority:"MEDIUM", category:"Interview Prep", progress:30, deadline:"2024-03-01" },
  { id:5, title:"Expand professional network", description:"Reach out to 20 engineers at target companies", priority:"LOW", category:"Networking", progress:20, deadline:"2024-05-01" },
  { id:6, title:"Update LinkedIn & resume", description:"Refresh all profiles with recent work", priority:"HIGH", category:"Branding", progress:100, deadline:"2024-01-20" },
];

function AddGoalModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ title:"", description:"", priority:"MEDIUM", category:"", deadline:"" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <style>{`
        .modal-backdrop2{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:500;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
        .modal-box2{background:#13131F;border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:28px;width:100%;max-width:440px;font-family:'DM Sans',sans-serif;animation:modal-in2 .2s ease;}
        @keyframes modal-in2{from{opacity:0;transform:scale(0.96)translateY(8px)}to{opacity:1;transform:none}}
        .ml{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:#F0EDE8;margin-bottom:20px;}
        .mr{margin-bottom:14px;}
        .mlb{font-size:11px;font-weight:700;color:rgba(240,237,232,0.45);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px;display:block;}
        .mi,.ms{width:100%;padding:10px 13px;border-radius:9px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);color:#F0EDE8;font-size:13px;outline:none;transition:border-color .15s;box-sizing:border-box;font-family:'DM Sans',sans-serif;}
        .mi:focus,.ms:focus{border-color:rgba(125,249,194,0.4);}
        .ms option{background:#13131F;}
        .mf{display:flex;gap:10px;margin-top:20px;}
        .mb{flex:1;padding:10px;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;transition:all .15s;border:1px solid;}
        .mb-p{background:rgba(125,249,194,0.12);border-color:rgba(125,249,194,0.35);color:#7DF9C2;}
        .mb-p:hover{background:rgba(125,249,194,0.2);}
        .mb-c{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);color:rgba(240,237,232,0.5);}
        .mb-c:hover{background:rgba(255,255,255,0.08);}
      `}</style>
      <div className="modal-backdrop2" onClick={onClose}>
        <div className="modal-box2" onClick={e => e.stopPropagation()}>
          <div className="ml">+ New Goal</div>
          <div className="mr">
            <label className="mlb">Title</label>
            <input className="mi" value={form.title} onChange={e => set("title",e.target.value)} placeholder="What do you want to achieve?" />
          </div>
          <div className="mr">
            <label className="mlb">Description</label>
            <input className="mi" value={form.description} onChange={e => set("description",e.target.value)} placeholder="Optional details" />
          </div>
          <div className="mr">
            <label className="mlb">Category</label>
            <input className="mi" value={form.category} onChange={e => set("category",e.target.value)} placeholder="e.g. Learning, Job Search, Portfolio" />
          </div>
          <div className="mr">
            <label className="mlb">Priority</label>
            <select className="ms" value={form.priority} onChange={e => set("priority",e.target.value)}>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div className="mr">
            <label className="mlb">Deadline</label>
            <input type="date" className="mi" value={form.deadline} onChange={e => set("deadline",e.target.value)} />
          </div>
          <div className="mf">
            <button className="mb mb-c" onClick={onClose}>Cancel</button>
            <button className="mb mb-p" onClick={() => { if(form.title){ onAdd({...form,id:Date.now(),progress:0}); onClose(); }}}>Add Goal</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  const updateGoal = (updated) => setGoals(gs => gs.map(g => g.id === updated.id ? updated : g));
  const deleteGoal = (id) => setGoals(gs => gs.filter(g => g.id !== id));

  const categories = ["ALL", ...new Set(goals.map(g => g.category).filter(Boolean))];
  const filtered = filter === "ALL" ? goals : goals.filter(g => g.category === filter);

  const done = goals.filter(g => g.progress >= 100).length;
  const avgProgress = goals.length ? Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
        .gp { min-height:100vh; background:#0C0C14; padding:80px 24px 40px; font-family:'DM Sans',sans-serif; }
        .gp-inner { max-width:960px; margin:0 auto; }
        .gp-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:28px; }
        .gp-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#F0EDE8; letter-spacing:-0.5px; margin-bottom:4px; }
        .gp-sub { font-size:13px; color:rgba(240,237,232,0.4); }
        .gp-stats { display:flex; gap:24px; align-items:center; flex-wrap:wrap; }
        .gp-stat { text-align:center; }
        .gp-stat-num { font-family:'DM Mono',monospace; font-size:22px; font-weight:500; }
        .gp-stat-lbl { font-size:11px; color:rgba(240,237,232,0.4); text-transform:uppercase; letter-spacing:0.5px; }
        .gp-add { padding:9px 20px; border-radius:10px; background:rgba(125,249,194,0.1); border:1px solid rgba(125,249,194,0.3); color:#7DF9C2; font-size:13px; font-weight:700; cursor:pointer; font-family:'Syne',sans-serif; transition:all .15s; }
        .gp-add:hover { background:rgba(125,249,194,0.18); }
        .gp-overall { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:18px; margin-bottom:24px; }
        .gp-overall-label { display:flex; justify-content:space-between; font-size:13px; color:rgba(240,237,232,0.5); margin-bottom:8px; }
        .gp-overall-pct { font-family:'DM Mono',monospace; font-weight:500; color:#7DF9C2; }
        .gp-bar-track { height:8px; background:rgba(255,255,255,0.06); border-radius:99px; overflow:hidden; }
        .gp-bar-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,#4B8BFF,#7DF9C2); transition:width .8s cubic-bezier(0.34,1.56,0.64,1); }
        .gp-filters { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:24px; }
        .gp-filter {
          padding:5px 14px; border-radius:20px; font-size:12px; font-weight:600;
          border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04);
          color:rgba(240,237,232,0.5); cursor:pointer; transition:all .15s;
          font-family:'Syne',sans-serif;
        }
        .gp-filter:hover { border-color:rgba(255,255,255,0.2); color:rgba(240,237,232,0.8); }
        .gp-filter.active { background:rgba(125,249,194,0.1); border-color:rgba(125,249,194,0.35); color:#7DF9C2; }
        .gp-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px; }
        .gp-empty { text-align:center; padding:60px; color:rgba(240,237,232,0.25); font-size:14px; }
      `}</style>

      <div className="gp">
        <div className="gp-inner">
          <div className="gp-header">
            <div>
              <div className="gp-title">Career Goals</div>
              <div className="gp-sub">{done} of {goals.length} goals completed</div>
            </div>
            <div className="gp-stats">
              <div className="gp-stat">
                <div className="gp-stat-num" style={{ color:"#7DF9C2" }}>{done}</div>
                <div className="gp-stat-lbl">Done</div>
              </div>
              <div className="gp-stat">
                <div className="gp-stat-num" style={{ color:"#FFC400" }}>{goals.length - done}</div>
                <div className="gp-stat-lbl">In Progress</div>
              </div>
              <div className="gp-stat">
                <div className="gp-stat-num" style={{ color:"#4B8BFF" }}>{avgProgress}%</div>
                <div className="gp-stat-lbl">Avg Progress</div>
              </div>
            </div>
            <button className="gp-add" onClick={() => setShowModal(true)}>+ New Goal</button>
          </div>

          <div className="gp-overall">
            <div className="gp-overall-label">
              <span>Overall Progress</span>
              <span className="gp-overall-pct">{avgProgress}%</span>
            </div>
            <div className="gp-bar-track">
              <div className="gp-bar-fill" style={{ width: `${avgProgress}%` }} />
            </div>
          </div>

          <div className="gp-filters">
            {categories.map(c => (
              <button key={c} className={`gp-filter${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="gp-grid">
            {filtered.length === 0
              ? <div className="gp-empty">No goals yet. Add your first career goal!</div>
              : filtered.map(g => (
                  <GoalCard key={g.id} goal={g} onUpdate={updateGoal} onDelete={deleteGoal} />
                ))}
          </div>
        </div>
      </div>

      {showModal && (
        <AddGoalModal onAdd={g => setGoals(gs => [...gs, g])} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}