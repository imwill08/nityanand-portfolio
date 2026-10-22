"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getFromStorage } from "@/services/adminData";
import BilingualHeading from "../components/BilingualHeading";
import { Clock, ArrowDown, Sparkles, GraduationCap, Briefcase, Award } from "lucide-react";
import "./timeline.css";

interface TimelineEntry {
    id?: number | string;
    header?: string;
    subheader?: string;
    description?: string;
    date?: string;
    logo_path?: string;
    order?: number;
}

// Helper to determine the era and icon
function getEraMeta(order: number, header?: string, subheader?: string) {
    const text = `${header ?? ""} ${subheader ?? ""}`.toLowerCase();
    if (order === 1 || text.includes("present")) {
        return {
            badge: "PRESENT ERA",
            isLive: true,
            icon: Sparkles,
            accentClass: "era-present",
        };
    }
    if (text.includes("intern")) {
        return {
            badge: "INTERNSHIP ERA",
            isLive: false,
            icon: Award,
            accentClass: "era-intern",
        };
    }
    if (text.includes("b.e.") || text.includes("university") || text.includes("school") || text.includes("matriculation") || text.includes("intermediate")) {
        return {
            badge: "ACADEMIC ROOTS",
            isLive: false,
            icon: GraduationCap,
            accentClass: "era-academic",
        };
    }
    return {
        badge: "CAREER EXP.",
        isLive: false,
        icon: Briefcase,
        accentClass: "era-career",
    };
}

export default function TimelinePage() {
    const [entries, setEntries] = useState<TimelineEntry[]>([]);
    const [beamProgress, setBeamProgress] = useState(0);
    const [activeIdx, setActiveIdx] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const data = getFromStorage<TimelineEntry[]>("timelines");
        if (Array.isArray(data)) {
            const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
            setEntries(sorted);
        }
    }, []);

    // ── Track scrolling container to move light beam dynamically ───────────────
    useEffect(() => {
        const scrollEl = document.getElementById("portfolio-scroll");
        if (!scrollEl) return;

        let rafId: number;

        const handleScroll = () => {
            rafId = requestAnimationFrame(() => {
                const container = containerRef.current;
                if (!container) return;

                const containerRect = container.getBoundingClientRect();
                const scrollElRect = scrollEl.getBoundingClientRect();

                // Focal line: middle-upper portion of visible screen (45%)
                const focalY = scrollElRect.top + scrollElRect.height * 0.45;

                // Distance from timeline container top to focal line
                const currentY = focalY - containerRect.top;
                const totalHeight = Math.max(1, containerRect.height);

                const progress = Math.max(0, Math.min(1, currentY / totalHeight));
                setBeamProgress(progress);

                // Highlight milestone closest to beam position
                if (entries.length > 0) {
                    const nearest = Math.round(progress * (entries.length - 1));
                    setActiveIdx(Math.max(0, Math.min(entries.length - 1, nearest)));
                }
            });
        };

        handleScroll();
        scrollEl.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            cancelAnimationFrame(rafId);
            scrollEl.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [entries]);

    return (
        <div className="page-container timeline-page">
            <BilingualHeading as="h1" en="Timeline" hi="समयरेखा एवं अनुभव" className="section-title" />
            <BilingualHeading as="p" en="My journey — education, work & milestones" hi="मेरी यात्रा — शिक्षा, कार्य एवं अनुभव" className="section-subtitle" />

            {/* Interactive Temporal Drift Header */}
            <div className="timeline-drift-bar">
                <div className="drift-indicator">
                    <span className="drift-beacon" />
                    <Clock size={14} className="drift-icon" />
                    <span className="drift-text">TEMPORAL CONDUIT: SCROLL TO TRAVEL TIME</span>
                </div>
                <div className="drift-stats">
                    <span className="drift-chip">{entries.length} CHRONICLES (PRESENT &rarr; 2018)</span>
                </div>
            </div>

            {entries.length === 0 ? (
                <div className="empty-state glass-card">
                    <p>No timeline data yet. Add entries via the Admin panel.</p>
                </div>
            ) : (
                <div className="timeline-stream-container" ref={containerRef}>
                    {/* Glowing Temporal Conduit Spine with Scroll-Driven Light Beam */}
                    <div className="timeline-spine-conduit" aria-hidden="true">
                        <div className="timeline-spine-track" />
                        
                        {/* Illuminated trail traveled so far */}
                        <div 
                            className="timeline-spine-active-trail"
                            style={{ height: `${beamProgress * 100}%` }}
                        />

                        {/* Real-time Scroll-Driven Light Beam */}
                        <div 
                            className="timeline-scroll-beam"
                            style={{ top: `${beamProgress * 100}%` }}
                        >
                            <div className="beam-orb" />
                            <div className="beam-corona" />
                            <div className="beam-flare" />
                        </div>
                    </div>

                    <div className="timeline-list">
                        {entries.map((entry, idx) => {
                            const era = getEraMeta(entry.order ?? idx + 1, entry.header, entry.subheader);
                            const EraIcon = era.icon;
                            const isBeamActive = idx === activeIdx;

                            return (
                                <motion.div
                                    className={`timeline-item glass-card ${isBeamActive ? "is-beam-active" : ""}`}
                                    key={entry.id ?? idx}
                                    initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{
                                        duration: 0.5,
                                        delay: idx * 0.08,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                >
                                    <div className="timeline-row">
                                        {/* Temporal date & era badge */}
                                        <div className="timeline-meta-col">
                                            <span className={`timeline-era-badge ${era.accentClass}`}>
                                                {era.isLive && <span className="live-dot" />}
                                                <EraIcon size={12} className="era-icon" />
                                                {era.badge}
                                            </span>
                                            <span className="timeline-dates">{entry.date}</span>
                                        </div>

                                        {/* Center node & company logo */}
                                        <div className="timeline-node-wrapper">
                                            <div className={`timeline-logo ${era.isLive ? "is-live" : ""}`}>
                                                {entry.logo_path ? (
                                                    <img
                                                        src={entry.logo_path.startsWith('http') || entry.logo_path.startsWith('blob:') ? entry.logo_path : `${(process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')}/static${entry.logo_path.startsWith('/') ? '' : '/'}${entry.logo_path}`}
                                                        alt={entry.header}
                                                    />
                                                ) : (
                                                    <span>{(entry.header ?? "·").charAt(0)}</span>
                                                )}
                                            </div>
                                            {/* Glowing node connector */}
                                            <span className={`timeline-connector-ring ${era.isLive ? "ring-live" : ""}`} />
                                        </div>

                                        {/* Description & role details */}
                                        <div className="timeline-content-col">
                                            <div className="timeline-header-wrap">
                                                <h3 className="timeline-title">{entry.header}</h3>
                                                {entry.subheader && (
                                                    <p className="timeline-org">{entry.subheader}</p>
                                                )}
                                            </div>
                                            {entry.description && (
                                                <p className="timeline-desc">{entry.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Timeline Terminal Origin Node */}
                    <div className="timeline-origin-anchor">
                        <div className="origin-node">
                            <ArrowDown size={14} className="origin-icon" />
                        </div>
                        <div className="origin-text">
                            <span className="origin-title">TEMPORAL ORIGIN REACHED</span>
                            <span className="origin-sub">2018 &bull; Army Public School &bull; First Steps in Technology</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
