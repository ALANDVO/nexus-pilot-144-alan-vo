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
        json: async () => [],
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