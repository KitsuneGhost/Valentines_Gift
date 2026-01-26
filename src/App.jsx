import { useMemo, useState } from "react";
import { virgoStars, virgoLinks, virgoSupportStars } from "./data/memories";
import "./App.css";
import TypedLetter from "./components/TypedLetter.jsx";

function Modal({ open, onClose, memory }) {
    if (!open) return null;
    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="x" onClick={onClose}>
                    ✕
                </button>
                <h2>{memory?.title ?? "—"}</h2>
                <p className="muted">{memory?.date ?? "—"}</p>
                <p className="note">{memory?.note ?? ""}</p>
            </div>
        </div>
    );
}

export default function App() {
    const [selectedId, setSelectedId] = useState(null);

    const selected = useMemo(
        () => virgoStars.find((m) => m.id === selectedId),
        [selectedId]
    );

    // Map id -> star (prevents O(n) finds and avoids crashes)
    const starById = useMemo(() => {
        const map = new Map();
        virgoStars.forEach((s) => map.set(s.id, s));
        return map;
    }, []);

    // Natural-looking random starfield
    const bgStars = useMemo(() => {
        const rand = (min, max) => min + Math.random() * (max - min);

        const tiny = Array.from({ length: 220 }).map((_, i) => ({
            id: `t-${i}`,
            x: rand(0, 100),
            y: rand(0, 100),
            r: rand(0.05, 0.12),
            a: rand(0.08, 0.18),
        }));

        const small = Array.from({ length: 120 }).map((_, i) => ({
            id: `s-${i}`,
            x: rand(0, 100),
            y: rand(0, 100),
            r: rand(0.12, 0.22),
            a: rand(0.15, 0.35),
        }));

        const rare = Array.from({ length: 18 }).map((_, i) => ({
            id: `r-${i}`,
            x: rand(0, 100),
            y: rand(0, 100),
            r: rand(0.25, 0.42),
            a: rand(0.25, 0.55),
        }));

        return [...tiny, ...small, ...rare];
    }, []);

    return (
        <div className="page">
            <header className="hero">
                <h1>Ari’s Constellation ✨</h1>
                <p className="muted">Click a star. Each one is something I’ll never forget.</p>
            </header>

            <div className="sky">
                <svg className="skySvg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    {/* background random stars */}
                    {bgStars.map((s) => (
                        <circle
                            key={s.id}
                            cx={s.x}
                            cy={s.y}
                            r={s.r}
                            fill={`rgba(255,255,255,${s.a})`}
                        />
                    ))}

                    {/* support stars */}
                    {(virgoSupportStars ?? []).map((s) => (
                        <g key={s.id} transform={`translate(${s.x} ${s.y})`} className="supportStar">
                            <circle r="0.5" className="supportCore" />
                        </g>
                    ))}

                    {/* constellation lines (SAFE: cannot crash) */}
                    {virgoLinks.map(([a, b]) => {
                        const A = starById.get(a);
                        const B = starById.get(b);
                        if (!A || !B) return null;
                        return (
                            <line
                                key={`${a}-${b}`}
                                x1={A.x}
                                y1={A.y}
                                x2={B.x}
                                y2={B.y}
                                className="line"
                            />
                        );
                    })}

                    {/* constellation stars */}
                    {virgoStars.map((m) => (
                        <g
                            key={m.id}
                            transform={`translate(${m.x} ${m.y})`}
                            className={`starG ${m.type === "anchor" ? "anchor" : ""}`}
                            onClick={() => setSelectedId(m.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setSelectedId(m.id);
                            }}
                        >
                            {/* stable hit target */}
                            <circle className="hit" r="4.2" />

                            {/* ring only on Spica (smaller). Other stars get r=0 */}
                            <circle className="ring" r={m.type === "anchor" ? 3.1 : 0} />

                            {/* star visuals */}
                            <g className="starVisual">
                                {/* optional halo for Spica */}
                                {m.type === "anchor" && <circle r="2.6" className="halo" />}

                                <polygon points="0,-2.8 0.55,-1.15 -0.55,-1.15" className="ray" />
                                <polygon points="2.8,0 1.15,0.55 1.15,-0.55" className="ray" />
                                <polygon points="0,2.8 0.55,1.15 -0.55,1.15" className="ray" />
                                <polygon points="-2.8,0 -1.15,0.55 -1.15,-0.55" className="ray" />

                                {/* radii set in JSX (no CSS r:) */}
                                <circle r={m.type === "anchor" ? 2.1 : 1.5} className="glow" />
                                <circle r={m.type === "anchor" ? 1.0 : 0.8} className="core" />
                            </g>
                        </g>
                    ))}
                </svg>
            </div>

            <Modal open={selectedId !== null} onClose={() => setSelectedId(null)} memory={selected || virgoStars[0]} />

            <section className="letterSection">
                <h2 className="h2">A letter</h2>
                <p className="muted">I wrote this slowly. You should read it slowly.</p>

                <TypedLetter
                    speed={14}
                    text={`Ari,\n\nI wanted to build something that feels like you: beautiful, intentional, and a little unreal.\n\nYou make me feel calm and hungry for the future at the same time. I love how your mind works, how your heart shows up, how you keep going.\n\nThis is me, choosing you — loudly, carefully, and forever.\n\n— Tikhon`}
                />
            </section>
        </div>
    );
}
