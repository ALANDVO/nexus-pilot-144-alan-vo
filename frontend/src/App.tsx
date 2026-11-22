import { useState, useEffect } from "react";

interface HealthResponse {
  status: string;
  service: string;
}

interface LessonProgress {
  completed: boolean;
  completed_at: string | null;
}

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  content: string;
  colab_url: string | null;
  order: number;
  progress: LessonProgress;
}

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface ProgressSummary {
  user_id: number;
  total_lessons: number;
  completed_lessons: number;
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Map<number, boolean>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const response = await fetch("/api/health");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  useEffect(() => {
    async function fetchModules() {
      try {
        const response = await fetch("/api/courses/modules");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setModules(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }
    fetchModules();
  }, []);

  useEffect(() => {
    async function fetchProgress() {
      // Fetch progress for user_id=1 (demo user; in production would use authenticated user)
      try {
        const response = await fetch("/api/courses/progress?user_id=1");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const progressMap = new Map<number, boolean>();
        data.forEach((p: any) => {
          progressMap.set(p.lesson_id, p.completed === 1);
        });
        setProgress(progressMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }
    fetchProgress();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Nexus Pilot LLM Course Platform</h1>
        <p>Learn Large Language Models with roadmaps and Colab notebooks</p>
      </header>

      <main>
        <section style={{ marginBottom: "2rem" }}>
          <h2>System Health</h2>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {health && (
            <div style={{ padding: "1rem", background: "#1e1e1e", borderRadius: "8px" }}>
              <p><strong>Status:</strong> {health.status}</p>
              <p><strong>Service:</strong> {health.service}</p>
            </div>
          )}
        </section>

        <section>
          <h2>Course Roadmap</h2>
          {modules.length === 0 ? (
            <p>No modules available. Check backend connection.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {modules.map((module) => (
                <div key={module.id} style={{ padding: "1rem", background: "#1e1e1e", borderRadius: "8px" }}>
                  <h3>{module.order}. {module.title}</h3>
                  <p>{module.description}</p>
                  <ul style={{ margin: "0.5rem 0" }}>
                    {module.lessons?.map((lesson) => {
                      const completed = progress.get(lesson.id) || false;
                      return (
                        <li key={lesson.id} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.25rem",
                        }}>
                          <span
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: completed ? "#4ade80" : "#6b7280",
                              flexShrink: "0",
                            }}
                          />
                          <strong>{lesson.order}. {lesson.title}</strong>
                          {lesson.colab_url && (
                            <a href={lesson.colab_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "0.5rem", color: "#a78bfa" }}>
                              Open in Colab
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer style={{ marginTop: "3rem", paddingTop: "1rem", borderTop: "1px solid #333" }}>
        <p>Nexus Pilot LLM Course Platform | Alan Vo | AI & Machine Learning</p>
      </footer>
    </div>
  );
}

export default App;
