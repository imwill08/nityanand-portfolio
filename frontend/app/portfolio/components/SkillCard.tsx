"use client";

import React, { useState, useEffect } from "react";

interface SkillCardProps {
    logo: string;
    text: string;
    hoverColors?: [string, string?];
}

const SkillCard: React.FC<SkillCardProps> = ({ logo, text }) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [logo]);

    return (
        <div className="skill-card-item">
            <div className="skill-card-icon-wrap">
                {imageError || !logo ? (
                    <div className="skill-card-fallback">
                        {text.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <img
                        src={logo}
                        alt={`${text} logo`}
                        className="skill-card-img"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>
            <span className="skill-card-name">{text}</span>

            <style>{`
                .skill-card-item {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.85rem;
                    padding: 0.65rem 1.1rem;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    transition: border-color 0.2s ease, background 0.2s ease;
                }
                .skill-card-item:hover {
                    border-color: var(--border-hover);
                    background: var(--surface-hover);
                }
                .skill-card-icon-wrap {
                    width: 26px;
                    height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .skill-card-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    filter: grayscale(0.2);
                    transition: filter 0.2s ease;
                }
                .skill-card-item:hover .skill-card-img {
                    filter: grayscale(0);
                }
                .skill-card-fallback {
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    background: var(--surface-2);
                    color: var(--text-dim);
                    font-family: var(--mono);
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--border);
                }
                .skill-card-name {
                    font-size: 0.88rem;
                    font-weight: 400;
                    color: var(--text-main);
                    white-space: nowrap;
                }
            `}</style>
        </div>
    );
};

export default SkillCard;
