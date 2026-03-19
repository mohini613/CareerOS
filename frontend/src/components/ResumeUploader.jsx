// components/ResumeUploader.jsx
import { useState, useRef } from "react";

export default function ResumeUploader({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setError("Only PDF or Word documents are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }
    setError("");
    setUploading(true);

    // Simulate upload (replace with real API call)
    await new Promise(r => setTimeout(r, 1200));
    const resume = {
      id: Date.now(),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.type.includes("pdf") ? "PDF" : "DOCX",
      uploadedAt: new Date().toISOString(),
    };
    setUploading(false);
    onUpload?.(resume);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .ru-zone {
          border: 2px dashed rgba(125,249,194,0.25);
          border-radius: 16px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(125,249,194,0.02);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .ru-zone::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(125,249,194,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .ru-zone.drag {
          border-color: #7DF9C2;
          background: rgba(125,249,194,0.06);
          transform: scale(1.01);
          box-shadow: 0 0 32px rgba(125,249,194,0.1);
        }
        .ru-zone.uploading { cursor: default; opacity: 0.8; }
        .ru-icon { font-size: 40px; margin-bottom: 14px; display: block; }
        .ru-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700;
          color: #F0EDE8; margin-bottom: 6px;
        }
        .ru-sub { font-size: 13px; color: rgba(240,237,232,0.4); margin-bottom: 18px; }
        .ru-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 22px; border-radius: 9px;
          background: rgba(125,249,194,0.1);
          border: 1px solid rgba(125,249,194,0.3);
          color: #7DF9C2; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: 'Syne', sans-serif;
          transition: all 0.15s; letter-spacing: 0.2px;
        }
        .ru-btn:hover { background: rgba(125,249,194,0.18); border-color: rgba(125,249,194,0.5); }
        .ru-limit { font-size: 11px; color: rgba(240,237,232,0.25); margin-top: 10px; }
        .ru-error { color: #FF6B6B; font-size: 12px; margin-top: 10px; font-weight: 500; }
        .ru-spinner {
          display: inline-block; width: 20px; height: 20px;
          border: 2px solid rgba(125,249,194,0.2);
          border-top-color: #7DF9C2; border-radius: 50%;
          animation: ru-spin 0.7s linear infinite;
          margin-bottom: 10px;
        }
        @keyframes ru-spin { to { transform: rotate(360deg); } }
        .ru-uploading-text { font-size: 14px; color: #7DF9C2; font-weight: 600; font-family:'Syne',sans-serif; }
      `}</style>

      <div
        className={`ru-zone${dragging ? " drag" : ""}${uploading ? " uploading" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {uploading ? (
          <>
            <div className="ru-spinner" />
            <div className="ru-uploading-text">Uploading…</div>
          </>
        ) : (
          <>
            <span className="ru-icon">📄</span>
            <div className="ru-title">Drop your resume here</div>
            <div className="ru-sub">PDF or Word document · max 5 MB</div>
            <button className="ru-btn" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>
              ↑ Browse Files
            </button>
            <div className="ru-limit">Supported: .pdf · .doc · .docx</div>
            {error && <div className="ru-error">⚠ {error}</div>}
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        style={{ display: "none" }}
        onChange={e => handleFile(e.target.files[0])}
      />
    </>
  );
}