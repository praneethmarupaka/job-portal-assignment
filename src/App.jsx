// App.jsx
import React, { useEffect, useState } from "react";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [role, setRole] = useState("Job Seeker");
  const [applications, setApplications] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetch("https://jsonfakery.com/jobs")
      .then((res) => res.json())
      .then((data) =>
        setJobs(
          data.slice(0, 5).map((j) => ({
            id: j.id || Math.random(),
            title: j.title,
            company: j.company,
            location: j.location,
            type: j.job_type || "Full Time",
            salary: j.salary || "$100k - $150k",
            description: j.description || "No description available",
            tags: ["React", "TypeScript", "Next.js"]
          }))
        )
      )
      .catch(() =>
        setJobs([
          {
            id: 1,
            title: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            type: "Full Time",
            salary: "$120k - $180k",
            description: "We're looking for a skilled Senior Frontend Developer...",
            tags: ["React", "TypeScript", "Next.js"]
          }
        ])
      );
  }, []);

  function toggleRole() {
    setRole((r) => (r === "Job Seeker" ? "Recruiter" : "Job Seeker"));
  }

  function saveJob(job) {
    if (editingJob) {
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...job } : j)));
    } else {
      setJobs((prev) => [...prev, { ...job, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingJob(null);
  }

  function deleteJob(jobId) {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setSelectedJob(null);
  }

  function applyToJob(jobId, applicant) {
    setApplications((prev) => {
      const list = prev[jobId] || [];
      return { ...prev, [jobId]: [...list, applicant] };
    });
    alert("✅ Application submitted!");
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">JobHub</div>
        <nav className="nav">
          <a href="#">Jobs</a>
          <a href="#">Companies</a>
          <a href="#">Salary</a>
          <a href="#">Resources</a>
        </nav>
        <div className="auth">
          <button className="btn secondary" onClick={toggleRole}>
            {role === "Job Seeker"
              ? "👩‍💻 Switch to Recruiter"
              : "🧑‍💼 Switch to Job Seeker"}
          </button>
          {role === "Recruiter" && (
            <button
              className="btn primary"
              onClick={() => {
                setShowForm(true);
                setEditingJob(null);
              }}
            >
              + Add Job
            </button>
          )}
        </div>
      </header>

      <main className="content">
        <aside className="sidebar">
          <h3>Job Type</h3>
          <label><input type="checkbox" /> Full Time</label>
          <label><input type="checkbox" /> Part Time</label>
          <label><input type="checkbox" /> Contract</label>
          <label><input type="checkbox" /> Remote</label>

          <h3>Location</h3>
          <label><input type="checkbox" /> San Francisco</label>
          <label><input type="checkbox" /> New York</label>
          <label><input type="checkbox" /> London</label>
          <label><input type="checkbox" /> Berlin</label>

          <h3>Experience</h3>
          <label><input type="checkbox" /> Entry</label>
          <label><input type="checkbox" /> Mid</label>
          <label><input type="checkbox" /> Senior</label>
        </aside>

        <section className="jobs">
          <h2>Latest Job Openings</h2>
          <p>{jobs.length} jobs found</p>
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div>
                <h3 onClick={() => setSelectedJob(job)} className="job-title">
                  {job.title}
                </h3>
                <p className="company">{job.company}</p>
                <p className="meta">
                  📍 {job.location} | 💼 {job.type} | 💲 {job.salary}
                </p>
                <div className="tags">
                  {job.tags.map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </div>
              </div>
              {role === "Job Seeker" ? (
                <button
                  className="btn primary"
                  onClick={() => setSelectedJob(job)}
                >
                  Apply Now
                </button>
              ) : (
                <div>
                  <button
                    className="btn secondary"
                    onClick={() => {
                      setEditingJob(job);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => deleteJob(job.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>

        <aside className="details">
          {selectedJob ? (
            <div className="detail-card">
              <h2>{selectedJob.title}</h2>
              <p className="company">{selectedJob.company}</p>
              <div className="salary">{selectedJob.salary} / year</div>
              <h3>Description</h3>
              <p>{selectedJob.description}</p>

              {role === "Job Seeker" ? (
                <ApplyForm onApply={(a) => applyToJob(selectedJob.id, a)} />
              ) : (
                <div>
                  <h3>Applications</h3>
                  {(applications[selectedJob.id] || []).length === 0 ? (
                    <p>No applications yet</p>
                  ) : (
                    <ul>
                      {applications[selectedJob.id].map((a, i) => (
                        <li key={i}>
                          <b>{a.name}</b> — {a.email}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>Select a job to see details</p>
          )}
        </aside>
      </main>

      {showForm && (
        <JobForm
          job={editingJob}
          onSave={saveJob}
          onCancel={() => setShowForm(false)}
        />
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; }
        .app { display: flex; flex-direction: column; height: 100vh; }
        .header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 32px; background: #1f6feb; color: #fff;
        }
        .logo { font-size: 22px; font-weight: bold; }
        .nav a { margin: 0 10px; text-decoration: none; color: #fff; font-weight: 500; }
        .auth .btn { margin-left: 10px; }
        .btn { padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; }
        .btn.primary { background: #0366d6; color: #fff; }
        .btn.secondary { background: #fff; color: #0366d6; }
        .btn.danger { background: #ffdddd; color: #b00; }
        .content { display: flex; flex: 1; background: #f5f7fa; }
        .sidebar { width: 220px; background: #fff; padding: 16px; border-right: 1px solid #ddd; }
        .sidebar h3 { margin: 16px 0 8px; font-size: 16px; }
        .sidebar label { display: block; margin: 4px 0; font-size: 14px; }
        .jobs { flex: 1; padding: 20px; }
        .job-card { display: flex; justify-content: space-between; background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .job-title { cursor: pointer; color: #0366d6; }
        .job-title:hover { text-decoration: underline; }
        .company { color: #555; font-size: 14px; margin: 4px 0; }
        .meta { font-size: 13px; color: #777; margin: 6px 0; }
        .tags span { display: inline-block; background: #eaf2fd; color: #0366d6; padding: 2px 8px; border-radius: 12px; margin-right: 6px; font-size: 12px; }
        .details { width: 320px; background: #fff; padding: 20px; border-left: 1px solid #ddd; overflow-y: auto; }
        .detail-card h2 { margin-bottom: 4px; }
        .salary { margin: 12px 0; padding: 8px; background: #eaf2fd; border-radius: 8px; color: #0366d6; font-weight: bold; display: inline-block; }
        .detail-card h3 { margin-top: 16px; margin-bottom: 6px; font-size: 16px; }
        ul { margin-left: 20px; margin-bottom: 12px; }
      `}</style>
    </div>
  );
}

function ApplyForm({ onApply }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!name || !email) return alert("Fill all fields");
    onApply({ name, email });
    setName(""); setEmail("");
  }
  return (
    <form onSubmit={submit}>
      <h3>Apply</h3>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="btn primary" type="submit">Submit</button>
      <style>{`
        form input { display: block; width: 100%; margin: 6px 0; padding: 6px; }
        form button { margin-top: 8px; }
      `}</style>
    </form>
  );
}

function JobForm({ job, onSave, onCancel }) {
  const [form, setForm] = useState(job || {
    title: "", company: "", location: "", type: "Full Time", salary: "", description: "", tags: []
  });

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.company) return alert("Fill required fields");
    onSave(form);
  }

  return (
    <div className="modal">
      <form onSubmit={submit}>
        <h3>{job ? "Edit Job" : "Add Job"}</h3>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}/>
        <input placeholder="Company" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})}/>
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}/>
        <input placeholder="Salary" value={form.salary} onChange={(e) => setForm({...form, salary: e.target.value})}/>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}/>
        <button className="btn primary" type="submit">Save</button>
        <button className="btn secondary" type="button" onClick={onCancel}>Cancel</button>
      </form>
      <style>{`
        .modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; padding: 20px; border: 1px solid #ccc; border-radius: 8px; z-index: 999; width: 300px; }
        .modal form input, .modal form textarea { width: 100%; margin: 6px 0; padding: 6px; }
        .modal form textarea { min-height: 60px; }
        .modal form button { margin-right: 6px; }
      `}</style>
    </div>
  );
}
  