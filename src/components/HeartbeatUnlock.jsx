import { useEffect, useMemo, useRef, useState } from "react";

export default function HeartbeatUnlock() {
    const storageKey = "valentine_heartbeat_unlocked";
    const HOLD_MS = 2200;

    const [unlocked, setUnlocked] = useState(() => {
        try {
            return localStorage.getItem(storageKey) === "1";
        } catch {
            return false;
        }
    });

    const [holding, setHolding] = useState(false);
    const [progress, setProgress] = useState(0); // 0..1

    const rafRef = useRef(null);
    const startRef = useRef(0);

    const stop = () => {
        setHolding(false);
        setProgress(0);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    };

    const tick = (now) => {
        const elapsed = now - startRef.current;
        const p = Math.min(1, elapsed / HOLD_MS);
        setProgress(p);

        if (p >= 1) {
            setUnlocked(true);
            try {
                localStorage.setItem(storageKey, "1");
            } catch { /* empty */ }
            setHolding(false);
            rafRef.current = null;
            return;
        }

        rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
        if (unlocked || holding) return;
        setHolding(true);
        setProgress(0);
        startRef.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);
    };

    // Space to hold
    useEffect(() => {
        const onDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                start();
            }
        };
        const onUp = (e) => {
            if (e.code === "Space") stop();
        };

        window.addEventListener("keydown", onDown, { passive: false });
        window.addEventListener("keyup", onUp);

        return () => {
            window.removeEventListener("keydown", onDown);
            window.removeEventListener("keyup", onUp);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unlocked, holding]);

    const pct = useMemo(() => Math.round(progress * 100), [progress]);

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
                    onTouchEnd={stop}
                    aria-label="Hold to sync heartbeat"
                >
                    <div className="heartPulse" />
                    <div className="heartIcon">♥</div>

                    <svg className="heartRing" viewBox="0 0 120 120" aria-hidden="true">
                        <circle className="ringBg" cx="60" cy="60" r="46" />
                        <circle
                            className="ringFg"
                            cx="60"
                            cy="60"
                            r="46"
                            style={{
                                strokeDasharray: 2 * Math.PI * 46,
                                strokeDashoffset: (1 - progress) * 2 * Math.PI * 46,
                            }}
                        />
                    </svg>

                    {!unlocked && holding && <div className="heartPct">{pct}%</div>}
                    {unlocked && <div className="heartDone">Unlocked</div>}
                </button>

                <div className="heartMessage">
                    {unlocked ? (
                        <div className="heartCard">
                            <div className="heartTitle">In sync.</div>
                            <div className="heartText">
                                Even when everything is loud, you’re the rhythm I come back to.
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
