import { useState, useEffect } from "react";

interface HealthResponse {
  status: string;
  service: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  content: string;
  colab_url: string | null;
  order: number;
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
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
                    {module.lessons?.map((lesson) => (
                      <li key={lesson.id}>
                        <strong>{lesson.order}. {lesson.title}</strong>
                        {lesson.colab_url && (
                          <a href={lesson.colab_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "0.5rem" }}>
                            Open in Colab
                          </a>
                        )}
                      </li>
                    ))}
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