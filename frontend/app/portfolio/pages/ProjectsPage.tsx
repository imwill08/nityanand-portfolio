"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { getFromStorage } from "@/services/adminData";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { 
    ChevronLeft, 
    ChevronRight, 
    SlidersHorizontal, 
    Layers, 
    LayoutGrid, 
    Code2, 
    ExternalLink 
} from "lucide-react";
import BilingualHeading from "../components/BilingualHeading";
import "./projects.css";

interface Project {
    id?: string;
    name?: string;
    description?: string;
    skills?: string[];
    github_url?: string;
    demo_url?: string;
    image_link?: string;
    image_preview?: string;
    category_id?: string;
    difficulty?: number;
    enabled?: boolean;
    order?: number;
}

interface Category {
    id?: string;
    name?: string;
    enabled?: boolean;
    order?: number;
}

type ViewMode = "reel" | "stack" | "grid";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("reel");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [stackIndex, setStackIndex] = useState<number>(0);

    const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    function resolveImg(raw?: string) {
        if (!raw) return "";
        if (raw.startsWith("http") || raw.startsWith("blob:")) return raw;
        return BASE.replace(/\/$/, "") + "/static" + (raw.startsWith("/") ? raw : "/" + raw);
    }

    useEffect(() => {
        const p = getFromStorage<Project[]>("projects");
        if (Array.isArray(p)) setProjects(p.filter(pr => pr.enabled !== false));
        const c = getFromStorage<Category[]>("projectCategories");
        if (Array.isArray(c)) setCategories(c.filter(cat => cat.enabled !== false));
    }, []);

    /* Group projects by category, sorted by category order */
    const sortedCats = useMemo(() => {
        return [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [categories]);

    const grouped = useMemo(() => {
        return sortedCats
            .map(cat => ({
                cat,
                items: [...projects.filter(p => p.category_id === cat.id)]
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            }))
            .filter(g => g.items.length > 0);
    }, [sortedCats, projects]);

    /* Flat list of all enabled projects for Stack view */
    const flatProjects = useMemo(() => {
        if (selectedCategory === "all") {
            return grouped.flatMap(g => g.items.map(item => ({ ...item, categoryName: g.cat.name })));
        }
        const found = grouped.find(g => g.cat.id === selectedCategory);
        if (!found) return [];
        return found.items.map(item => ({ ...item, categoryName: found.cat.name }));
    }, [grouped, selectedCategory]);

    // Reset stack index when category changes or reaches boundary
    useEffect(() => {
        setStackIndex(0);
    }, [selectedCategory, viewMode]);

    // Handle Category pill click
    const handleCategoryClick = (catId: string) => {
        setSelectedCategory(catId);
        if (viewMode === "reel" && catId !== "all") {
            const sectionEl = document.getElementById(`cat-section-${catId}`);
            if (sectionEl) {
                sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    return (
        <div className="page-container projects-page">
            <BilingualHeading as="h1" en="Projects" hi="परियोजनाएं" className="section-title" />
            <BilingualHeading as="p" en="Things I've built" hi="जो मैंने बनाया है" className="section-subtitle" />

            {/* ── Toolbar: Category Pills & View Mode Switcher ── */}
            <div className="projects-toolbar">
                {/* Category Filter Pills */}
                <div className="category-filter-pills" role="tablist">
                    <button
                        type="button"
                        className={`cat-pill-btn ${selectedCategory === "all" ? "is-active" : ""}`}
                        onClick={() => handleCategoryClick("all")}
                    >
                        <span>All</span>
                        <span className="pill-count">{projects.length}</span>
                    </button>
                    {grouped.map(({ cat, items }) => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`cat-pill-btn ${selectedCategory === cat.id ? "is-active" : ""}`}
                            onClick={() => handleCategoryClick(cat.id!)}
                        >
                            <span>{cat.name}</span>
                            <span className="pill-count">{items.length}</span>
                        </button>
                    ))}
                </div>

                {/* View Mode Switcher */}
                <div className="view-mode-toggle" aria-label="Project view options">
                    <button
                        type="button"
                        className={`view-mode-btn ${viewMode === "reel" ? "is-active" : ""}`}
                        onClick={() => setViewMode("reel")}
                        title="Horizontal Reel (Down scroll + Right slide)"
                    >
                        <SlidersHorizontal size={14} />
                        <span>Slide Reel</span>
                    </button>
                    <button
                        type="button"
                        className={`view-mode-btn ${viewMode === "stack" ? "is-active" : ""}`}
                        onClick={() => setViewMode("stack")}
                        title="3D Stacked Deck (Card on card)"
                    >
                        <Layers size={14} />
                        <span>3D Stack</span>
                    </button>
                    <button
                        type="button"
                        className={`view-mode-btn ${viewMode === "grid" ? "is-active" : ""}`}
                        onClick={() => setViewMode("grid")}
                        title="Compact Grid"
                    >
                        <LayoutGrid size={14} />
                        <span>Grid</span>
                    </button>
                </div>
            </div>

            {grouped.length === 0 ? (
                <div className="empty-state glass-card">
                    <p>No projects yet. Add them via the Admin panel.</p>
                </div>
            ) : (
                <>
                    {/* MODE 1: HORIZONTAL REEL (Combo Down Scroll + Right Slide) */}
                    {viewMode === "reel" && (
                        <div className="reel-view-wrapper">
                            {grouped
                                .filter(({ cat }) => selectedCategory === "all" || cat.id === selectedCategory)
                                .map(({ cat, items }, catIdx) => (
                                    <CategoryReelSection
                                        key={cat.id ?? catIdx}
                                        cat={cat}
                                        items={items}
                                        resolveImg={resolveImg}
                                    />
                                ))}
                        </div>
                    )}

                    {/* MODE 2: 3D STACKED DECK (One by One Project Stack) */}
                    {viewMode === "stack" && (
                        <StackedDeckView
                            items={flatProjects}
                            currentIndex={stackIndex}
                            onIndexChange={setStackIndex}
                            resolveImg={resolveImg}
                        />
                    )}

                    {/* MODE 3: COMPACT GRID */}
                    {viewMode === "grid" && (
                        <div className="grid-view-wrapper">
                            {grouped
                                .filter(({ cat }) => selectedCategory === "all" || cat.id === selectedCategory)
                                .map(({ cat, items }) => (
                                    <div className="grid-category-section" key={cat.id}>
                                        <div className="grid-cat-header">
                                            <h2 className="grid-cat-title">{cat.name}</h2>
                                            <span className="reel-count-indicator">{items.length} PROJECTS</span>
                                        </div>
                                        <div className="projects-compact-grid">
                                            {items.map((proj, idx) => (
                                                <ProjectCardItem
                                                    key={proj.id ?? idx}
                                                    proj={proj}
                                                    catName={cat.name}
                                                    index={idx + 1}
                                                    resolveImg={resolveImg}
                                                    cardClassName="grid-card"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   CATEGORY HORIZONTAL REEL (Combo of Down Scroll + Right Slide)
   ══════════════════════════════════════════════════════════════ */
interface CategoryReelProps {
    cat: Category;
    items: Project[];
    resolveImg: (raw?: string) => string;
}

function CategoryReelSection({ cat, items, resolveImg }: CategoryReelProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(items.length > 1);
    const [currentSlide, setCurrentSlide] = useState(1);

    const checkScrollBounds = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 15);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 15);

        // Estimate current slide based on card width
        const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 28 : 360;
        const slide = Math.min(items.length, Math.max(1, Math.round(el.scrollLeft / cardWidth) + 1));
        setCurrentSlide(slide);
    }, [items.length]);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        checkScrollBounds();
        el.addEventListener("scroll", checkScrollBounds, { passive: true });
        window.addEventListener("resize", checkScrollBounds);
        return () => {
            el.removeEventListener("scroll", checkScrollBounds);
            window.removeEventListener("resize", checkScrollBounds);
        };
    }, [checkScrollBounds]);

    const slide = (direction: "left" | "right") => {
        const el = trackRef.current;
        if (!el) return;
        const scrollDistance = el.clientWidth * 0.78;
        el.scrollBy({
            left: direction === "right" ? scrollDistance : -scrollDistance,
            behavior: "smooth",
        });
    };

    return (
        <section className="reel-category-section" id={`cat-section-${cat.id}`}>
            {/* Category Header with Title & Arrow Controls */}
            <div className="reel-header">
                <div className="reel-title-group">
                    <span className="reel-cat-tag">Category Showcase</span>
                    <h2 className="reel-cat-name">{cat.name}</h2>
                </div>

                <div className="reel-nav-controls">
                    <span className="reel-count-indicator">
                        {String(currentSlide).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </span>
                    <button
                        type="button"
                        className="reel-arrow-btn"
                        onClick={() => slide("left")}
                        disabled={!canScrollLeft}
                        aria-label={`Previous in ${cat.name}`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        className="reel-arrow-btn"
                        onClick={() => slide("right")}
                        disabled={!canScrollRight}
                        aria-label={`Next in ${cat.name}`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Horizontal Track (Right Slide) */}
            <div className="reel-slider-track" ref={trackRef}>
                {items.map((proj, idx) => (
                    <ProjectCardItem
                        key={proj.id ?? idx}
                        proj={proj}
                        catName={cat.name}
                        index={idx + 1}
                        resolveImg={resolveImg}
                        cardClassName="reel-card"
                    />
                ))}
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════════════════════
   3D STACKED DECK VIEW (One by One Project Stack)
   ══════════════════════════════════════════════════════════════ */
interface StackedDeckProps {
    items: (Project & { categoryName?: string })[];
    currentIndex: number;
    onIndexChange: (idx: number) => void;
    resolveImg: (raw?: string) => string;
}

function StackedDeckView({ items, currentIndex, onIndexChange, resolveImg }: StackedDeckProps) {
    if (items.length === 0) {
        return (
            <div className="empty-state glass-card">
                <p>No projects match this selection.</p>
            </div>
        );
    }

    const currentItem = items[currentIndex] || items[0];
    const canPrev = currentIndex > 0;
    const canNext = currentIndex < items.length - 1;

    const handleNext = () => {
        if (canNext) onIndexChange(currentIndex + 1);
    };

    const handlePrev = () => {
        if (canPrev) onIndexChange(currentIndex - 1);
    };

    // Keyboard navigation when stacked deck is active
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                if (canNext) {
                    e.preventDefault();
                    onIndexChange(currentIndex + 1);
                }
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                if (canPrev) {
                    e.preventDefault();
                    onIndexChange(currentIndex - 1);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [canNext, canPrev, currentIndex, onIndexChange]);

    return (
        <div className="stack-mode-container">
            {/* Meta Header */}
            <div className="stack-meta-header">
                <div className="stack-category-indicator">
                    <span className="stack-cat-badge">{currentItem.categoryName ?? "FEATURED"}</span>
                </div>
                <div className="stack-counter">
                    PROJECT {String(currentIndex + 1).padStart(2, "0")} OF {String(items.length).padStart(2, "0")}
                </div>
            </div>

            {/* 3D Stack Stage */}
            <div className="stack-deck-stage">
                {items.map((proj, idx) => {
                    const diff = idx - currentIndex;
                    let stateClass = "is-hidden";

                    if (diff === 0) stateClass = "is-active";
                    else if (diff === 1) stateClass = "is-second";
                    else if (diff === 2) stateClass = "is-third";
                    else if (diff < 0) stateClass = "is-hidden";

                    if (diff < 0 || diff > 2) return null;

                    return (
                        <div key={proj.id ?? idx} className={`stacked-card ${stateClass}`}>
                            <ProjectCardItem
                                proj={proj}
                                catName={proj.categoryName}
                                index={idx + 1}
                                resolveImg={resolveImg}
                                cardClassName=""
                                isStacked
                            />
                        </div>
                    );
                })}
            </div>

            {/* Navigation & Scrubber Bar */}
            <div className="stack-controls-bar">
                <button
                    type="button"
                    className="stack-nav-btn"
                    onClick={handlePrev}
                    disabled={!canPrev}
                >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                </button>

                {/* Scrubber Dots */}
                <div className="stack-scrubber-dots" role="tablist">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`scrubber-dot ${i === currentIndex ? "is-active" : ""}`}
                            onClick={() => onIndexChange(i)}
                            aria-label={`Jump to project ${i + 1}`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="stack-nav-btn"
                    onClick={handleNext}
                    disabled={!canNext}
                >
                    <span>Next Project</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   PROJECT CARD ITEM (Reusable for Reel, Stack, and Grid)
   ══════════════════════════════════════════════════════════════ */
interface ProjectCardItemProps {
    proj: Project;
    catName?: string;
    index: number;
    resolveImg: (raw?: string) => string;
    cardClassName?: string;
    isStacked?: boolean;
}

function ProjectCardItem({
    proj,
    catName,
    index,
    resolveImg,
    cardClassName = "",
    isStacked = false,
}: ProjectCardItemProps) {
    const imgSrc = resolveImg(proj.image_preview || proj.image_link);

    // Monogram helper (e.g. "Yumzy" -> "YZ", "Smart Report AI" -> "SR")
    const monogram = useMemo(() => {
        if (!proj.name) return "PR";
        const parts = proj.name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return proj.name.slice(0, 2).toUpperCase();
    }, [proj.name]);

    return (
        <article className={cardClassName || undefined}>
            {/* Media / Visual Cover */}
            <div className="card-media-wrapper">
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={proj.name ?? "Project preview"}
                        className="card-media-img"
                        loading="lazy"
                    />
                ) : (
                    <div className="card-media-graphic">
                        <div className="graphic-grid-overlay" />
                        <div className="graphic-center-node">
                            <span className="graphic-monogram">{monogram}</span>
                            <span className="graphic-sub-label">{catName ?? "SYSTEM DESIGN"}</span>
                        </div>
                        <div className="graphic-tech-badge">
                            <span className="graphic-pulse-dot" />
                            <span>SYS.0{index} // PROD</span>
                        </div>
                    </div>
                )}

                {/* Floating Index Chip */}
                <div className="card-index-chip">
                    #{String(index).padStart(2, "0")}
                </div>
            </div>

            {/* Content Body */}
            <div className="card-content">
                <div className="card-title-row">
                    <h3 className="card-title">{proj.name}</h3>
                </div>

                <p className="card-desc" title={proj.description}>{proj.description}</p>

                {/* Tech Pills */}
                {Array.isArray(proj.skills) && proj.skills.length > 0 && (
                    <div className="card-tech-list">
                        {proj.skills.map((skill) => (
                            <span className="card-tech-tag" key={skill}>{skill}</span>
                        ))}
                    </div>
                )}

                {/* Actions Footer */}
                <div className="card-actions-bar">
                    <div className="card-links-left">
                        {proj.demo_url && (
                            <a
                                href={proj.demo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="action-link-btn is-demo"
                                title="Open Live Deployment"
                            >
                                <ExternalLink size={13} />
                                <span>Live Demo</span>
                            </a>
                        )}

                        {proj.github_url && (
                            <a
                                href={proj.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="action-link-btn is-github"
                                title="View Source on GitHub"
                            >
                                <FaGithub size={13} />
                                <span>Source</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
