import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// 1. Mocking the global fetch API
global.fetch = jest.fn();

describe("App Component Logic", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders Header and main navigation", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: "Test Startup", industry: "Tech" }],
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    // Fixed: changed getByTest to getByText
    const titleElement = screen.getByText(/Startup Atlas/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("toggles theme between light and dark", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    // Fixed: changed getByLabelTest to getByLabelText
    const themeBtn = screen.getByLabelText("theme-btn");
    const initialTheme = document.documentElement.getAttribute("data-theme");

    fireEvent.click(themeBtn);

    const newTheme = document.documentElement.getAttribute("data-theme");
    expect(newTheme).not.toBe(initialTheme);
  });

  test("uses fallback data when server fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Server Down"));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      // Logic checks if either Zolar or Canva (from your fallback data) appears
      expect(
        screen.queryByText(/Zolar/i) || screen.queryByText(/Canva/i),
      ).toBeInTheDocument();
    });
  });

  test("filtering by 'Has MVP' checkbox updates the displayed results", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: "MVP Corp", has_mvp: true, industry: "Tech" },
        { id: 2, name: "Idea Corp", has_mvp: false, industry: "Tech" },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/list"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("MVP Corp")).toBeInTheDocument(),
    );
    expect(screen.getByText("Idea Corp")).toBeInTheDocument();

    const mvpCheckbox = screen.getByLabelText(/Has MVP/i);
    fireEvent.click(mvpCheckbox);

    expect(screen.getByText("MVP Corp")).toBeInTheDocument();
    expect(screen.queryByText("Idea Corp")).not.toBeInTheDocument();
  });

  // --- NEW INTEGRATION TEST ---
  test("searching for an industry triggers the API call", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 3, name: "AI Power", industry: "AI" }],
    });

    render(
      <MemoryRouter initialEntries={["/list"]}>
        <App />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText(/Search by industry/i);
    const searchBtn = screen.getByRole("button", { name: /search/i });

    // Simulate typing "AI" and clicking Search
    fireEvent.change(searchInput, { target: { value: "AI" } });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      // Check if fetch was called with the specific industry endpoint
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("http://localhost:8000/api/industry/AI"),
      );
    });
  });
});
