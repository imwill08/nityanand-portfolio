"use client";

import { useEffect, useMemo } from "react";

interface TimeTravelTunnelProps {
    direction: number; // 1 = forward (moving to the right), -1 = backward (moving to the left)
    onComplete?: () => void;
}

interface SpeedLine {
    id: number;
    top: number; // percentage 0 - 100
    height: number; // px 1 - 3.5
    width: number; // percentage 50 - 150
    opacity: number; // 0.3 - 0.95
    duration: number; // seconds 0.36 - 0.56
    delay: number; // seconds 0 - 0.12
    colorType: "gargantua" | "singularity" | "tesseract" | "wormhole";
    blur: number; // px
}

export default function TimeTravelTunnel({ direction, onComplete }: TimeTravelTunnelProps) {
    // Generate 64 Interstellar-inspired time warp stream lines
    const lines: SpeedLine[] = useMemo(() => {
        const lineCount = 64;
        const colorPalette: ("gargantua" | "singularity" | "tesseract" | "wormhole")[] = [
            "gargantua",    // Gargantua accretion disk golden amber
            "singularity",  // Cherenkov blue / quantum cyan
            "tesseract",    // 5th-dimension pure white photon beams
            "wormhole",     // Deep cosmic ultraviolet
            "gargantua",    // Heavy amber weighting for Interstellar signature look
            "singularity",
        ];
        
        return Array.from({ length: lineCount }, (_, i) => {
            const baseTop = (i / lineCount) * 100;
            const jitter = ((i * 19) % 9) - 4;
            const top = Math.max(0.5, Math.min(99.5, baseTop + jitter));
            
            const isMajor = i % 4 === 0;
            const height = isMajor ? 2.5 + ((i % 3) * 0.7) : 1 + ((i % 2) * 0.6);
            const width = 80 + ((i * 17) % 70);
            const opacity = isMajor ? 0.85 + ((i % 3) * 0.05) : 0.4 + ((i % 4) * 0.12);
            const duration = 0.4 + ((i * 7) % 15) * 0.012;
            const delay = ((i * 13) % 14) * 0.008;
            const colorType = colorPalette[i % colorPalette.length];
            const blur = isMajor ? 1.8 : 0.6;

            return {
                id: i,
                top,
                height,
                width,
                opacity,
                duration,
                delay,
                colorType,
                blur,
            };
        });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 650);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const isForward = direction > 0;

    return (
        <div className="time-travel-tunnel-container" aria-hidden="true">
            {/* Gargantua / Wormhole Deep Cosmic Backdrop */}
            <div className="time-tunnel-backdrop" />

            {/* Interstellar Accretion Lens Vignette */}
            <div className="time-accretion-lens" />

            {/* Time Warp Horizon Grid Stream */}
            <div className={`time-stream-curtain ${isForward ? "dir-forward" : "dir-backward"}`}>
                {lines.map((line) => (
                    <div
                        key={line.id}
                        className={`stream-line color-${line.colorType}`}
                        style={{
                            top: `${line.top}%`,
                            height: `${line.height}px`,
                            width: `${line.width}%`,
                            opacity: line.opacity,
                            filter: `blur(${line.blur}px)`,
                            animationDuration: `${line.duration}s`,
                            animationDelay: `${line.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* Central Singularity Photon Sphere Rift */}
            <div className={`time-quantum-rift ${isForward ? "rift-forward" : "rift-backward"}`} />

            {/* Relativistic Time-Dilation Horizon Flash */}
            <div className={`time-warp-sweep ${isForward ? "sweep-forward" : "sweep-backward"}`} />
        </div>
    );
}
