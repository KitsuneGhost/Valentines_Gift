import { useMemo, useState } from "react";
import { memories, links } from "./data/memories";
import "./App.css";
import TypedLetter from "./components/TypedLetter.jsx";

function Modal({ open, onClose, memory }) {
    if (!open) return null;
    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="x" onClick={onClose}>✕</button>
                <h2>{memory.title}</h2>
                <p className="muted">{memory.date}</p>
                <p className="note">{memory.note}</p>
            </div>
        </div>
    );
}

export default function App() {
    const [selectedId, setSelectedId] = useState(null);

    const selected = useMemo(
        () => memories.find((m) => m.id === selectedId),
        [selectedId]
    );

    // Natural-looking random starfield (no grid)
    const bgStars = useMemo(() => {
        const rand = (min, max) => min + Math.random() * (max - min);
        return Array.from({ length: 140 }).map((_, i) => ({
            id: i,
            x: rand(2, 98),
            y: rand(2, 98),
            r: rand(0.08, 0.22),
            a: rand(0.12, 0.45),
        }));
    }, []);

    const byId = useMemo(() => {
        const m = new Map();
        memories.forEach((s) => m.set(s.id, s));
        return m;
    }, []);

    return (
        <div className="page">
            <header className="hero">
                <h1>Ari’s Constellation ✨</h1>
                <p className="muted">Click a star. Each one is something I’ll never forget.</p>
            </header>

            <div className="sky">
                <svg className="skySvg" viewBox="0 0 100 100" preserveAspectRatio="none">
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

                    {/* constellation lines */}
                    {links.map(([a, b]) => {
                        const A = byId.get(a);
                        const B = byId.get(b);
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

                    {/* constellation stars (4 spikes + core) */}
                    {memories.map((m) => (
                        <g
                            key={m.id}
                            className={`starG ${selectedId === m.id ? "active" : ""}`}
                            transform={`translate(${m.x} ${m.y})`}
                            onClick={() => setSelectedId(m.id)}
                            role="button"
                            tabIndex={0}
                        >
                            {/* stable hit area (does NOT scale) */}
                            <circle className="hit" r="3.2" />

                            {/* visuals (this scales) */}
                            <g className="starVisual">
                                {/* top ray */}
                                <polygon points="0,-2.6 0.45,-1.1 -0.45,-1.1" className="ray" />
                                {/* right ray */}
                                <polygon points="2.6,0 1.1,0.45 1.1,-0.45" className="ray" />
                                {/* bottom ray */}
                                <polygon points="0,2.6 0.45,1.1 -0.45,1.1" className="ray" />
                                {/* left ray */}
                                <polygon points="-2.6,0 -1.1,0.45 -1.1,-0.45" className="ray" />

                                <circle r="1.35" className="glow" />
                                <circle r="0.75" className="core" />
                            </g>
                        </g>

                    ))}
                </svg>
            </div>

            <Modal
                open={selectedId !== null}
                onClose={() => setSelectedId(null)}
                memory={selected || memories[0]}
            />

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