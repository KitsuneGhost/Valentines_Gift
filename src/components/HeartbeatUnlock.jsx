import { useEffect, useMemo, useRef, useState } from "react";

export default function HeartbeatUnlock() {
    const HOLD_MS = 2200;
    const R = 46;
    const CIRC = 2 * Math.PI * R;

    const [unlocked, setUnlocked] = useState(false); // resets on every page load
    const [holding, setHolding] = useState(false);
    const [progress, setProgress] = useState(0); // 0..1

    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);

    const cleanup = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const stop = () => {
        cleanup();
        setHolding(false);
        setProgress(0);
    };

    const start = () => {
        if (unlocked) return;
        if (intervalRef.current) return; // already holding

        setHolding(true);
        setProgress(0);
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const p = Math.min(1, elapsed / HOLD_MS);
            setProgress(p);

            if (p >= 1) {
                cleanup();
                setHolding(false);
                setUnlocked(true);
            }
        }, 16); // ~60fps
    };

    // Space hold
    useEffect(() => {
        const onDown = (e) => {
            if (e.code !== "Space") return;

            // stop scroll and default "button click" behavior
            e.preventDefault();
            e.stopPropagation();

            start();
        };

        const onUp = (e) => {
            if (e.code !== "Space") return;
            e.preventDefault();
            e.stopPropagation();
            stop();
        };

        window.addEventListener("keydown", onDown, { passive: false, capture: true });
        window.addEventListener("keyup", onUp, { capture: true });

        return () => {
            window.removeEventListener("keydown", onDown, { capture: true });
            window.removeEventListener("keyup", onUp, { capture: true });
            cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unlocked]);

    const pct = useMemo(() => Math.round(progress * 100), [progress]);
    const dashoffset = useMemo(() => (1 - progress) * CIRC, [progress]);

    return (
        <section className="heartSection">
            <h2 className="h2">Heartbeat</h2>
            <p className="muted">
                Hold <b>Space</b>… or press and hold the heart.
            </p>

            <div className={`heartWrap ${holding ? "holding" : ""} ${unlocked ? "unlocked" : ""}`}>
                <button
                    className="heartBtn"
                    type="button"
                    onMouseDown={start}
                    onMouseUp={stop}
                    onMouseLeave={stop}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        start();
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        stop();
                    }}
                    aria-label="Hold to sync heartbeat"
                >
                    <div className="heartPulse" />
                    <div className="heartIcon">♥</div>

                    <svg className="heartRing" viewBox="0 0 120 120" aria-hidden="true">
                        <circle className="ringBg" cx="60" cy="60" r={R} />
                        <circle
                            className="ringFg"
                            cx="60"
                            cy="60"
                            r={R}
                            style={{
                                strokeDasharray: CIRC,
                                strokeDashoffset: dashoffset,
                            }}
                        />
                    </svg>

                    {!unlocked && (
                        <div className="heartHint">{holding ? `${pct}%` : "Hold"}</div>
                    )}
                    {unlocked && <div className="heartDone">Unlocked</div>}
                </button>

                <div className="heartMessage">
                    {unlocked ? (
                        <div className="heartCard">
                            <div className="heartTitle">My heart says...</div>
                            <div className="heartText">
                                When everything is dark, you’re the sun that lights up the darkness❤️☀️.
                            </div>
                        </div>
                    ) : (
                        <div className="muted">It unlocks when you hold long enough.</div>
                    )}
                </div>
            </div>
        </section>
    );
}
