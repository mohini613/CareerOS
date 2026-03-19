// pages/AIAnalyzer.jsx
import { useState } from "react";
import AnalysisResult from "../components/AnalysisResult";

// Mock resume skills for demo — replace with actual user profile data
const MOCK_USER_SKILLS = ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "Git", "CSS", "HTML", "Python", "Docker"];

function analyzeLocally(jd, userSkills) {
  // Simple keyword matching for mock — replace with real API call
  const jdLower = jd.toLowerCase();
  const techKeywords = [
    "react","typescript","javascript","node.js","python","java","go","rust","c++",
    "postgresql","mysql","mongodb","redis","graphql","rest","api","docker","kubernetes",
    "aws","azure","gcp","git","ci/cd","agile","scrum","microservices","sql","nosql",
    "css","html","nextjs","vue","angular","express","fastapi","django","spring",
    "machine learning","ai","data structures","algorithms","system design","linux",
    "terraform","jenkins","figma","ui","ux","product","leadership","communication",
    "problem solving","testing","jest","cypress","webpack","vite","tailwind",
  ];

  const foundKeywords = techKeywords.filter(k => jdLower.includes(k));
  const matched = foundKeywords.filter(k => userSkills.some(s => s.toLowerCase().includes(k)));
  const gaps = foundKeywords.filter(k => !userSkills.some(s => s.toLowerCase().includes(k))).slice(0, 5);

  const score = Math.min(95, Math.max(20, Math.round((matched.length / Math.max(foundKeywords.length, 1)) * 100)));

  const strengths = matched.slice(0, 5).map(k => `Strong proficiency in ${k.charAt(0).toUpperCase() + k.slice(1)}`);
  if (strengths.length === 0) strengths.push("General software engineering fundamentals");

  const suggestions = [
    gaps.length > 0 && `Add ${gaps[0]} experience to your resume if you have any`,
    score < 70 && "Consider highlighting relevant project experience more prominently",
    "Tailor your summary section to mirror the job description language",
    "Quantify your achievements with metrics (e.g. 'reduced load time by 40%')",
    gaps.length > 1 && `Build a small project using ${gaps[1]} to demonstrate capability`,
  ].filter(Boolean).slice(0, 4);

  return {
    score,
    strengths: strengths.slice(0, 4),
    gaps: gaps.slice(0, 4).map(k => `Limited evidence of ${k.charAt(0).toUpperCase() + k.slice(1)} experience`),
    keywords: matched.map(k => k.charAt(0).toUpperCase() + k.slice(1)).slice(0, 12),
    suggestions,
  };
}

const EXAMPLE_JD = `We're looking for a Senior Frontend Engineer to join our team.

Requirements:
- 4+ years of experience with React and TypeScript
- Strong knowledge of Node.js and RESTful APIs
- Experience with PostgreSQL or similar databases
- Familiarity with Docker and AWS
- Excellent problem-solving skills and communication
- Experience with system design and scalable architecture
- Bonus: GraphQL, Redis, Kubernetes`;

export default function AIAnalyzer() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handleAnalyze = async () => {
    if (!jd.trim() || jd.trim().length < 50) {
      setError("Please paste a complete job description (at least 50 characters).");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 1600));

    const analysis = analyzeLocally(jd, MOCK_USER_SKILLS);
    setResult(analysis);
    setHistory(h => [{ id: Date.now(), jd: jd.slice(0, 80) + "...", score: analysis.score, date: new Date() }, ...h.slice(0, 4)]);
    setLoading(false);
  };

  const handleExample = () => {
    setJd(EXAMPLE_JD);
    setResult(null);
    setError("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
        .aa-page { min-height:100vh; background:#0C0C14; padding:80px 24px 40px; font-family:'DM Sans',sans-serif; }
        .aa-inner { max-width:840px; margin:0 auto; }
        .aa-header { margin-bottom:28px; }
        .aa-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#F0EDE8; letter-spacing:-0.5px; margin-bottom:4px; }
        .aa-sub { font-size:13px; color:rgba(240,237,232,0.4); }
        .aa-input-card {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
          border-radius:16px; padding:22px; margin-bottom:16px;
        }
        .aa-input-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .aa-input-label { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:rgba(240,237,232,0.55); text-transform:uppercase; letter-spacing:0.6px; }
        .aa-example-btn {
          font-size:12px; font-weight:600; padding:4px 11px; border-radius:7px;
          background:rgba(75,139,255,0.1); border:1px solid rgba(75,139,255,0.25);
          color:#7EB5FF; cursor:pointer; font-family:'Syne',sans-serif; transition:all .15s;
        }
        .aa-example-btn:hover { background:rgba(75,139,255,0.18); }
        .aa-textarea {
          width:100%; min-height:180px; padding:14px; border-radius:10px;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          color:#F0EDE8; font-size:13px; font-family:'DM Mono',monospace;
          resize:vertical; outline:none; transition:border-color .15s; box-sizing:border-box;
          line-height:1.6;
        }
        .aa-textarea:focus { border-color:rgba(125,249,194,0.35); }
        .aa-textarea::placeholder { color:rgba(240,237,232,0.2); }
        .aa-footer { display:flex; align-items:center; justify-content:space-between; margin-top:14px; flex-wrap:wrap; gap:10px; }
        .aa-char { font-family:'DM Mono',monospace; font-size:11px; color:rgba(240,237,232,0.25); }
        .aa-error { font-size:12px; color:#FF6B6B; font-weight:500; }
        .aa-analyze-btn {
          padding:10px 26px; border-radius:10px; font-size:14px; font-weight:700;
          background:linear-gradient(135deg,rgba(125,249,194,0.15),rgba(75,139,255,0.15));
          border:1px solid rgba(125,249,194,0.35); color:#7DF9C2;
          cursor:pointer; font-family:'Syne',sans-serif; transition:all .2s;
          display:flex; align-items:center; gap:8px; letter-spacing:0.2px;
        }
        .aa-analyze-btn:hover:not(:disabled) { background:linear-gradient(135deg,rgba(125,249,194,0.22),rgba(75,139,255,0.22)); transform:translateY(-1px); }
        .aa-analyze-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .aa-spinner {
          width:14px; height:14px; border:2px solid rgba(125,249,194,0.25);
          border-top-color:#7DF9C2; border-radius:50%;
          animation:aa-spin .6s linear infinite; flex-shrink:0;
        }
        @keyframes aa-spin { to{transform:rotate(360deg)} }
        .aa-history { margin-top:32px; }
        .aa-history-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.7px; color:rgba(240,237,232,0.35); margin-bottom:12px; }
        .aa-history-list { display:flex; flex-direction:column; gap:8px; }
        .aa-history-item {
          display:flex; align-items:center; gap:12px;
          background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);
          border-radius:10px; padding:10px 14px; font-size:12px;
        }
        .aa-h-score { font-family:'DM Mono',monospace; font-size:14px; font-weight:500; flex-shrink:0; }
        .aa-h-jd { color:rgba(240,237,232,0.45); flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .aa-h-date { font-family:'DM Mono',monospace; color:rgba(240,237,232,0.25); font-size:11px; flex-shrink:0; }
        .aa-skills-note {
          background:rgba(75,139,255,0.07); border:1px solid rgba(75,139,255,0.15);
          border-radius:12px; padding:14px 18px; margin-bottom:16px;
          font-size:12px; color:rgba(240,237,232,0.5); display:flex; gap:10px;
        }
        .aa-skills-list { display:flex; flex-wrap:wrap; gap:5px; margin-top:8px; }
        .aa-skill-tag { font-family:'DM Mono',monospace; font-size:11px; padding:2px 7px; border-radius:5px; background:rgba(75,139,255,0.1); border:1px solid rgba(75,139,255,0.2); color:#7EB5FF; }
      `}</style>

      <div className="aa-page">
        <div className="aa-inner">
          <div className="aa-header">
            <div className="aa-title">✦ AI Job Analyzer</div>
            <div className="aa-sub">Paste a job description to get your match score and personalized suggestions</div>
          </div>

          <div className="aa-skills-note">
            <span>🎯</span>
            <div>
              <div>Analyzing against your profile skills:</div>
              <div className="aa-skills-list">
                {MOCK_USER_SKILLS.map(s => <span key={s} className="aa-skill-tag">{s}</span>)}
              </div>
            </div>
          </div>

          <div className="aa-input-card">
            <div className="aa-input-header">
              <span className="aa-input-label">Job Description</span>
              <button className="aa-example-btn" onClick={handleExample}>Load Example</button>
            </div>
            <textarea
              className="aa-textarea"
              placeholder="Paste the full job description here…&#10;&#10;Include: role requirements, responsibilities, tech stack, and qualifications for best results."
              value={jd}
              onChange={e => setJd(e.target.value)}
            />
            <div className="aa-footer">
              <div>
                <span className="aa-char">{jd.length} chars</span>
                {error && <span className="aa-error" style={{ marginLeft:12 }}>⚠ {error}</span>}
              </div>
              <button
                className="aa-analyze-btn"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading
                  ? <><div className="aa-spinner" /> Analyzing…</>
                  : <>✦ Analyze Match</>}
              </button>
            </div>
          </div>

          {result && <AnalysisResult result={result} />}

          {history.length > 0 && (
            <div className="aa-history">
              <div className="aa-history-title">Recent Analyses</div>
              <div className="aa-history-list">
                {history.map(h => (
                  <div key={h.id} className="aa-history-item">
                    <span className="aa-h-score" style={{ color: h.score >= 70 ? "#7DF9C2" : h.score >= 50 ? "#FFC400" : "#FF6B6B" }}>
                      {h.score}%
                    </span>
                    <span className="aa-h-jd">{h.jd}</span>
                    <span className="aa-h-date">{h.date.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}