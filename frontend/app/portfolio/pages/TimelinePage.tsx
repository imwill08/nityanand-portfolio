"use client";

import { useEffect, useState } from "react";
import { getFromStorage } from "@/services/adminData";
import BilingualHeading from "../components/BilingualHeading";
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

export default function TimelinePage() {
    const [entries, setEntries] = useState<TimelineEntry[]>([]);

    useEffect(() => {
        const data = getFromStorage<TimelineEntry[]>("timelines");
        if (Array.isArray(data)) {
            const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
            setEntries(sorted);
        }
    }, []);

    return (
        <div className="page-container timeline-page">
            <BilingualHeading as="h1" en="Timeline" hi="समयरेखा एवं अनुभव" className="section-title" />
            <BilingualHeading as="p" en="My journey — education, work & milestones" hi="मेरी यात्रा — शिक्षा, कार्य एवं अनुभव" className="section-subtitle" />

            {entries.length === 0 ? (
                <div className="empty-state glass-card">
                    <p>No timeline data yet. Add entries via the Admin panel.</p>
                </div>
            ) : (
                <div className="timeline-list">
                    {entries.map((entry, idx) => (
                        <div className="timeline-item glass-card" key={entry.id ?? idx}>
                            <div className="timeline-row">
                                <span className="timeline-dates">{entry.date}</span>

                                <div className="timeline-logo">
                                    {entry.logo_path ? (
                                        <img
                                            src={entry.logo_path.startsWith('http') || entry.logo_path.startsWith('blob:') ? entry.logo_path : `${(process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')}/static${entry.logo_path.startsWith('/') ? '' : '/'}${entry.logo_path}`}
                                            alt={entry.header}
                                        />
                                    ) : (
                                        <span>{(entry.header ?? "·").charAt(0)}</span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="timeline-title">{entry.header}</h3>
                                    {entry.subheader && (
                                        <p className="timeline-org">{entry.subheader}</p>
                                    )}
                                    {entry.description && (
                                        <p className="timeline-desc">{entry.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
