"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BilingualHeadingProps {
    en: string;
    hi: string;
    as?: "h1" | "h2" | "h3" | "span" | "p";
    className?: string;
    intervalMs?: number;
}

export default function BilingualHeading({
    en,
    hi,
    as = "h2",
    className = "section-title",
    intervalMs = 3600,
}: BilingualHeadingProps) {
    const [isHindi, setIsHindi] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsHindi((prev) => !prev);
        }, intervalMs);
        return () => clearInterval(timer);
    }, [intervalMs]);

    const Tag = as as any;

    return (
        <Tag className={className}>
            <span className="bilingual-switch-container">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isHindi ? "hi" : "en"}
                        initial={{ opacity: 0, y: 7, filter: "blur(2px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -7, filter: "blur(2px)" }}
                        transition={{ duration: 0.38, ease: [0.25, 1, 0.5, 1] }}
                        className={`bilingual-text ${isHindi ? "is-hindi" : "is-english"}`}
                    >
                        {isHindi ? hi : en}
                    </motion.span>
                </AnimatePresence>
            </span>

            <style>{`
                .bilingual-switch-container {
                    display: inline-flex;
                    position: relative;
                    vertical-align: baseline;
                    min-height: 1.15em;
                }
                .bilingual-text {
                    display: inline-block;
                }
                .bilingual-text.is-hindi {
                    font-family: var(--font-sans), 'Noto Sans Devanagari', 'Mukta', system-ui, sans-serif;
                    font-weight: 500;
                    letter-spacing: 0;
                }
            `}</style>
        </Tag>
    );
}
