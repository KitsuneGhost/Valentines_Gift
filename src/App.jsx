import { useMemo, useState } from "react";
import { virgoStars, virgoLinks, virgoSupportStars } from "./data/memories";
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
        () => virgoStars.find((m) => m.id === selectedId),
        [selectedId]
    );

    // Natural-looking random starfield (no grid)
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
            r: rand(0.25, 0.4),
            a: rand(0.25, 0.5),
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
                <svg className="skySvg" viewBox="0 0 100 100" preserveAspectRatio="none">

                    {/* support stars */}
                    {virgoSupportStars.map((s) => (
                        <g key={s.id} transform={`translate(${s.x} ${s.y})`} className="supportStar">
                            <circle r="0.5" className="supportCore" />
                        </g>
                    ))}

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
                    {virgoLinks.map(([a, b]) => {
                        const A = virgoStars.find(s => s.id === a);
                        const B = virgoStars.find(s => s.id === b);
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
                    {virgoStars.map((m) => (
                        <g
                            key={m.id}
                            transform={`translate(${m.x} ${m.y})`}
                            className={`starG ${m.type === "anchor" ? "anchor" : ""} ${selectedId === m.id ? "active" : ""}`}
                            onClick={() => setSelectedId(m.id)}
                        >
                            {/* stable hover/click target */}
                            <circle className="hit" r="4.2" />

                            {/* ring exists always (we control opacity in CSS) */}
                            <circle className="ring" r={m.type === "anchor" ? 3.9 : 4.2} />

                            {/* visuals (scale these only) */}
                            <g className="starVisual">
                                {m.type === "anchor" && <circle r="2.4" className="halo" />}

                                <polygon points="0,-2.8 0.55,-1.15 -0.55,-1.15" className="ray" />
                                <polygon points="2.8,0 1.15,0.55 1.15,-0.55" className="ray" />
                                <polygon points="0,2.8 0.55,1.15 -0.55,1.15" className="ray" />
                                <polygon points="-2.8,0 -1.15,0.55 -1.15,-0.55" className="ray" />

                                <circle r={m.type === "anchor" ? 1.05 : 1.5} className="glow" />
                                <circle r={m.type === "anchor" ? 0.95 : 0.8} className="core" />

                            </g>
                        </g>
                    ))}
                </svg>
            </div>

            <Modal
                open={selectedId !== null}
                onClose={() => setSelectedId(null)}
                memory={selected || virgoStars[0]}
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