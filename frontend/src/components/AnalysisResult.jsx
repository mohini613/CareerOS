// components/AnalysisResult.jsx

function ScoreRing({ score }) {
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? "#7DF9C2" : score >= 50 ? "#FFC400" : "#FF6B6B";

  return (
    <>
      <style>{`
        .score-ring-wrap {
          display: flex; align-items: center; justify-content: center;
          position: relative; width: 110px; height: 110px;
        }
        .score-ring-svg { transform: rotate(-90deg); }
        .score-ring-track { fill: none; stroke: rgba(255,255,255,0.07); stroke-width: 8; }
        .score-ring-fill {
          fill: none; stroke-width: 8; stroke-linecap: round;
          transition: stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1);
        }
        .score-ring-center {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          text-align: center;
        }
        .score-ring-num {
          font-family: 'Syne', sans-serif;
          font-size: 26px; font-weight: 800;
          line-height: 1;
        }
        .score-ring-label {
          font-size: 10px; font-weight: 600;
          color: rgba(240,237,232,0.4);
          letter-spacing: 0.5px; text-transform: uppercase;
        }
      `}</style>
      <div className="score-ring-wrap">
        <svg className="score-ring-svg" width="110" height="110" viewBox="0 0 110 110">
          <circle className="score-ring-track" cx="55" cy="55" r={radius} />
          <circle
            className="score-ring-fill"
            cx="55" cy="55" r={radius}
            stroke={color}
            strokeDasharray={`${dash} ${circ}`}
          />
        </svg>
        <div className="score-ring-center">
          <div className="score-ring-num" style={{ color }}>{score}</div>
          <div className="score-ring-label">match</div>
        </div>
      </div>
    </>
  );
}

export default function AnalysisResult({ result }) {
  if (!result) return null;
  const { score, strengths = [], gaps = [], suggestions = [], keywords = [] } = result;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
        .ar-wrap {
          font-family: 'DM Sans', sans-serif;
          animation: ar-in 0.4s ease both;
        }
        @keyframes ar-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        .ar-header {
          display: flex; align-items: center; gap: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 24px;
          margin-bottom: 16px;
        }
        .ar-header-text h3 {
          font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800;
          color: #F0EDE8; margin: 0 0 4px;
        }
        .ar-header-text p { font-size: 13px; color: rgba(240,237,232,0.45); margin: 0; }
        .ar-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        @media(max-width:600px) { .ar-grid { grid-template-columns: 1fr; } }
        .ar-section {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 18px;
        }
        .ar-section-title {
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.8px;
          margin-bottom: 12px; display: flex; align-items: center; gap: 7px;
        }
        .ar-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px; }
        .ar-list-item {
          font-size: 13px; color: rgba(240,237,232,0.75);
          display: flex; align-items: flex-start; gap: 8px; line-height: 1.5;
        }
        .ar-list-icon { flex-shrink: 0; font-size: 13px; margin-top: 1px; }
        .ar-keywords { display: flex; flex-wrap: wrap; gap: 6px; }
        .ar-kw {
          font-family: 'DM Mono', monospace;
          font-size: 11px; padding: 3px 9px;
          border-radius: 6px; background: rgba(75,139,255,0.12);
          border: 1px solid rgba(75,139,255,0.25); color: #7EB5FF;
          letter-spacing: 0.3px;
        }
        .ar-suggestions-section {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 18px;
        }
        .ar-suggestion {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px; border-radius: 8px;
          background: rgba(125,249,194,0.04);
          border: 1px solid rgba(125,249,194,0.1);
          margin-bottom: 8px;
        }
        .ar-suggestion:last-child { margin-bottom: 0; }
        .ar-suggestion-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
        .ar-suggestion-text { font-size: 13px; color: rgba(240,237,232,0.75); line-height: 1.5; }
      `}</style>

      <div className="ar-wrap">
        <div className="ar-header">
          <ScoreRing score={score} />
          <div className="ar-header-text">
            <h3>
              {score >= 80 ? "Excellent Match" : score >= 60 ? "Good Match" : score >= 40 ? "Moderate Match" : "Low Match"}
            </h3>
            <p>
              Your profile matches <strong>{score}%</strong> of the job requirements.
              {score < 60 && " Consider addressing the gaps below to improve your chances."}
            </p>
          </div>
        </div>

        <div className="ar-grid">
          <div className="ar-section">
            <div className="ar-section-title" style={{ color: "#7DF9C2" }}>✓ Strengths</div>
            <ul className="ar-list">
              {strengths.length > 0
                ? strengths.map((s, i) => (
                    <li key={i} className="ar-list-item">
                      <span className="ar-list-icon" style={{ color: "#7DF9C2" }}>●</span>{s}
                    </li>
                  ))
                : <li className="ar-list-item" style={{ opacity: 0.4 }}>No strengths identified</li>}
            </ul>
          </div>

          <div className="ar-section">
            <div className="ar-section-title" style={{ color: "#FF6B6B" }}>✗ Gaps</div>
            <ul className="ar-list">
              {gaps.length > 0
                ? gaps.map((g, i) => (
                    <li key={i} className="ar-list-item">
                      <span className="ar-list-icon" style={{ color: "#FF6B6B" }}>●</span>{g}
                    </li>
                  ))
                : <li className="ar-list-item" style={{ opacity: 0.4 }}>No significant gaps</li>}
            </ul>
          </div>
        </div>

        {keywords.length > 0 && (
          <div className="ar-section" style={{ marginBottom: 12 }}>
            <div className="ar-section-title" style={{ color: "#4B8BFF" }}>
              ◈ Matched Keywords
            </div>
            <div className="ar-keywords">
              {keywords.map((kw, i) => <span key={i} className="ar-kw">{kw}</span>)}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="ar-suggestions-section">
            <div className="ar-section-title" style={{ color: "#FFC400", marginBottom: 12 }}>
              ✦ Suggestions
            </div>
            {suggestions.map((s, i) => (
              <div key={i} className="ar-suggestion">
                <span className="ar-suggestion-icon">→</span>
                <span className="ar-suggestion-text">{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}