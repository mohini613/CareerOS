CREATE TABLE analysis_results (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_title VARCHAR(200),
    company_name VARCHAR(200),
    job_description TEXT NOT NULL,
    match_score INTEGER,
    strengths TEXT,
    weaknesses TEXT,
    suggestions TEXT,
    missing_keywords TEXT,
    full_analysis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
