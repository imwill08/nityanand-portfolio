"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

type Page = "center" | "left" | "right" | "top" | "bottom";
type Direction = "center" | "left" | "right" | "up" | "down";

interface NavProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
    onNavigateDir: (dir: Direction) => void;
}

const NAV_LINKS: { page: Page; label: string; hiLabel: string }[] = [
    { page: "center", label: "Home", hiLabel: "मुख्य" },
    { page: "left", label: "Timeline", hiLabel: "समयरेखा" },
    { page: "bottom", label: "Skills", hiLabel: "कौशल" },
    { page: "right", label: "Projects", hiLabel: "प्रोजेक्ट्स" },
    { page: "top", label: "Admin", hiLabel: "एडमिन" },
];

export default function Navigation({ activePage, onNavigate }: NavProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    useEffect(() => {
        const saved = localStorage.getItem("portfolio_theme") as "dark" | "light" | null;
        if (saved) {
            setTheme(saved);
            document.documentElement.setAttribute("data-theme", saved);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initTheme = prefersDark ? "dark" : "light";
            setTheme(initTheme);
            document.documentElement.setAttribute("data-theme", initTheme);
        }

        const el = document.getElementById("portfolio-scroll");
        if (!el) return;
        const handler = () => setScrolled(el.scrollTop > 30);
        el.addEventListener("scroll", handler);
        return () => el.removeEventListener("scroll", handler);
    }, []);

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("portfolio_theme", next);
    };

    const handleClick = (page: Page) => {
        onNavigate(page);
        setMobileOpen(false);
    };

    return (
        <nav className={`pf-nav${scrolled ? " is-scrolled" : ""}`}>
            <button className="pf-nav-logo" onClick={() => handleClick("center")}>
                Nityanand<span>.</span>
            </button>

            {/* Desktop links + Theme Toggle */}
            <div className="pf-nav-actions">
                <div className="pf-nav-links">
                    {NAV_LINKS.map(({ page, label }) => (
                        <button
                            key={page}
                            onClick={() => handleClick(page)}
                            className={`pf-nav-link${activePage === page ? " is-active" : ""}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="pf-theme-toggle"
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                >
                    {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </button>
            </div>

            {/* Mobile action bar */}
            <div className="pf-nav-mobile-bar">
                <button
                    onClick={toggleTheme}
                    className="pf-theme-toggle"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button
                    className="pf-nav-toggle"
                    onClick={() => setMobileOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {mobileOpen && (
                <div className="pf-nav-mobile">
                    {NAV_LINKS.map(({ page, label }) => (
                        <button
                            key={page}
                            onClick={() => handleClick(page)}
                            className={`pf-nav-mobile-link${activePage === page ? " is-active" : ""}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            <style>{`
                .pf-nav {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    height: var(--nav-height);
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    background: var(--bg);
                    border-bottom: 1px solid transparent;
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                }
                .pf-nav.is-scrolled {
                    border-bottom-color: var(--border);
                }
                .pf-nav-logo {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    font-family: var(--serif);
                    font-size: 1.35rem;
                    font-weight: 500;
                    letter-spacing: -0.01em;
                    color: var(--text-bright);
                }
                .pf-nav-logo span { color: var(--accent); }

                .pf-nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 2.25rem;
                }

                .pf-nav-links {
                    display: flex;
                    gap: 1.85rem;
                }
                .pf-nav-link {
                    position: relative;
                    background: none;
                    border: none;
                    padding: 0.4rem 0;
                    cursor: pointer;
                    font-family: var(--sans);
                    font-size: 0.875rem;
                    color: var(--text-dim);
                    transition: color 0.15s ease;
                }
                .pf-nav-link:hover { color: var(--text-bright); }
                .pf-nav-link.is-active { color: var(--text-bright); }
                .pf-nav-link.is-active::after {
                    content: '';
                    position: absolute;
                    left: 0; right: 0; bottom: -2px;
                    height: 1px;
                    background: var(--accent);
                }

                .pf-theme-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    background: var(--surface);
                    color: var(--text-dim);
                    cursor: pointer;
                    transition: all 0.18s ease;
                }
                .pf-theme-toggle:hover {
                    color: var(--text-bright);
                    border-color: var(--border-hover);
                    background: var(--surface-hover);
                }

                .pf-nav-mobile-bar {
                    display: none;
                    align-items: center;
                    gap: 0.75rem;
                }

                .pf-nav-toggle {
                    background: transparent;
                    border: none;
                    color: var(--text-main);
                    cursor: pointer;
                    padding: 0.3rem;
                }

                .pf-nav-mobile {
                    position: absolute;
                    top: var(--nav-height);
                    left: 0; right: 0;
                    background: var(--bg);
                    border-bottom: 1px solid var(--border);
                    padding: 0.5rem 1.25rem 1rem;
                    display: flex;
                    flex-direction: column;
                }
                .pf-nav-mobile-link {
                    background: none;
                    border: none;
                    border-bottom: 1px solid var(--border);
                    text-align: left;
                    padding: 0.9rem 0;
                    font-family: var(--serif);
                    font-size: 1.25rem;
                    color: var(--text-dim);
                    cursor: pointer;
                }
                .pf-nav-mobile-link:last-child { border-bottom: none; }
                .pf-nav-mobile-link.is-active { color: var(--accent); }

                @media (max-width: 640px) {
                    .pf-nav { padding: 0 1.25rem; }
                    .pf-nav-actions { display: none; }
                    .pf-nav-mobile-bar { display: flex; }
                }
            `}</style>
        </nav>
    );
}
