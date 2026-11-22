import { describe, it, expect, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import App from "./App";

describe("App", () => {
  it("renders the title", () => {
    render(<App />);
    expect(screen.getByText("Nexus Pilot LLM Course Platform")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays health status after fetch", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "ok", service: "nexus-pilot-144-alan-vo" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{
          id: 1,
          title: "Introduction to LLMs",
          description: "Fundamentals of Large Language Models",
          order: 1,
          lessons: [
            {
              id: 1,
              module_id: 1,
              title: "What are LLMs?",
              content: "LLMs are large language models...",
              colab_url: "https://colab.research.google.com/example",
              order: 1,
              progress: { completed: true, completed_at: "2024-01-01T00:00:00Z" },
            },
          ],
        }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { lesson_id: 1, completed: 1, completed_at: "2024-01-01T00:00:00Z" },
        ],
      })
    );

    render(<App />);

    await waitFor(() => {
      const container = screen.getByText("System Health").closest("section");
      expect(container).toBeInTheDocument();
      expect(container!.textContent).toContain("ok");
      expect(container!.textContent).toContain("nexus-pilot-144-alan-vo");
    });
  });
});
