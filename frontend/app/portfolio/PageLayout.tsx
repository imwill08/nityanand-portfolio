"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Navigation from "./Navigation";
import TimeTravelTunnel from "./components/TimeTravelTunnel";
import HomePage from "./pages/HomePage";
import TimelinePage from "./pages/TimelinePage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import AdminPage from "./pages/AdminPage";
import "../portfolio/portfolio.css";

// ── Page map ─────────────────────────────────────────────────────────────────
// center = Home, left = Timeline, right = Projects, bottom = Skills, top = Admin
// ──────────────────────────────────────────────────────────────────────────────

type Page = "center" | "left" | "right" | "top" | "bottom";
type Direction = "center" | "left" | "right" | "up" | "down";

const PAGE_TRANSITIONS: Record<Page, Partial<Record<Direction, Page>>> = {
    center: { left: "left", right: "right", up: "top", down: "bottom" },
    left: { left: "right", right: "center", up: "top", down: "bottom" },
    right: { left: "center", right: "left", up: "top", down: "bottom" },
    top: { up: "bottom", down: "center", left: "left", right: "right" },
    bottom: { up: "center", down: "top", left: "left", right: "right" },
};

const PAGE_ORDER: Record<Page, number> = {
    center: 0,  // Home
    left: 1,    // Timeline
    bottom: 2,  // Skills
    right: 3,   // Projects
    top: 4,     // Admin
};

// ── Time-Travel Warp 3D Variants (Whole Page & Panels Travel & Disappear) ─────
const timeTravelVariants: Variants = {
    initial: (dir: number) => ({
        x: dir > 0 ? "85vw" : "-85vw",
        scaleX: 1.55,
        scaleY: 0.8,
        skewX: dir > 0 ? 15 : -15,
        rotateY: dir > 0 ? 24 : -24,
        opacity: 0,
        filter: "blur(20px) brightness(1.7)",
        transformOrigin: dir > 0 ? "left center" : "right center",
    }),
    animate: {
        x: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        rotateY: 0,
        opacity: 1,
        filter: "blur(0px) brightness(1)",
        transformOrigin: "center center",
        transition: {
            duration: 0.54,
            ease: [0.14, 1, 0.28, 1] as const, // hyperspace arrival deceleration
        },
    },
    exit: (dir: number) => ({
        x: dir > 0 ? "-85vw" : "85vw",
        scaleX: 1.55,
        scaleY: 0.8,
        skewX: dir > 0 ? -15 : 15,
        rotateY: dir > 0 ? -24 : 24,
        opacity: 0,
        filter: "blur(20px) brightness(1.7)",
        transformOrigin: dir > 0 ? "right center" : "left center",
        transition: {
            duration: 0.42,
            ease: [0.42, 0, 0.18, 1] as const, // explosive warp acceleration into the time lines
        },
    }),
};

export default function PageLayout() {
    const [activePage, setActivePage] = useState<Page>("center");
    const [direction, setDirection] = useState<number>(1);
    const [warpKey, setWarpKey] = useState<number>(0);

    /** Navigate by page name (center/left/right/top/bottom) */
    const navigateTo = useCallback(
        (target: Page, explicitDir?: number) => {
            if (target === activePage) return;
            const dir = explicitDir !== undefined
                ? explicitDir
                : (PAGE_ORDER[target] >= PAGE_ORDER[activePage] ? 1 : -1);
            setDirection(dir);
            setWarpKey((k) => k + 1);
            setActivePage(target);
        },
        [activePage]
    );

    /** Navigate by direction (up/down/left/right) */
    const navigateDir = useCallback(
        (dir: Direction) => {
            const target = PAGE_TRANSITIONS[activePage]?.[dir];
            if (target) {
                const dirVal = (dir === "left" || dir === "up") ? -1 : 1;
                navigateTo(target, dirVal);
            }
        },
        [activePage, navigateTo]
    );

    // ── Keyboard navigation ────────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                return;
            }

            const map: Partial<Record<string, Direction>> = {
                ArrowLeft: "left",
                ArrowRight: "right",
                ArrowUp: "up",
                ArrowDown: "down",
            };
            const dir = map[e.key];
            if (dir) {
                e.preventDefault();
                navigateDir(dir);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [navigateDir]);

    // ── Scroll to top after each page change ──────────────────────────────────
    useEffect(() => {
        const el = document.getElementById("portfolio-scroll");
        if (el) el.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, [activePage]);

    const renderPage = () => {
        switch (activePage) {
            case "center": return <HomePage onNavigate={(p) => navigateTo(p)} />;
            case "left": return <TimelinePage />;
            case "right": return <ProjectsPage />;
            case "top": return <AdminPage />;
            case "bottom": return <SkillsPage />;
        }
    };

    return (
        <div className="portfolio-wrapper">
            {/* Fixed navigation */}
            <Navigation
                activePage={activePage}
                onNavigate={(page: Page) => navigateTo(page)}
                onNavigateDir={navigateDir}
            />

            {/* Full-Screen Time Travel Speed Lines & Quantum Rift Tunnel */}
            {warpKey > 0 && (
                <TimeTravelTunnel key={warpKey} direction={direction} />
            )}

            {/* Scrollable page content with Relativistic Time-Travel Warp */}
            <div className="portfolio-content" id="portfolio-scroll">
                <div className="time-travel-stage">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activePage}
                            custom={direction}
                            variants={timeTravelVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="time-travel-page"
                        >
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

