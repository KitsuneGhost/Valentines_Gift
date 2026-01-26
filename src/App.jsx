import { useMemo, useState } from "react";
import {
    virgoStars,
    virgoLinks,
    virgoSupportStars,
} from "./data/memories";
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
    const [traceMode, setTraceMode] = useState(false);

    const selected = useMemo(
        () => virgoStars.find((m) => m.id === selectedId),
        [selectedId]
    );

    // CLICK → SVG COORDINATES
    function svgCoordsFromClick(e) {
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        console.log(
            "CLICK:",
            Number(svgP.x.toFixed(1)),
            Number(svgP.y.toFixed(1))
        );
    }

    // RANDOM BACKGROUND STARS
    const bgStars = useMemo(() => {
        const r = (a, b) => a + Math.random() * (b - a);
        return Array.from({ length: 300 }).map((_, i) => ({
            id: i,
            x: r(0, 100),
            y: r(0, 100),
            r: r(0.05, 0.25),
            a: r(0.08, 0.35),
        }));
    }, []);

    return (
        <div className="page">
            <header className="hero">
                <h1>Ari’s Constellation ✨</h1>
                <p className="muted">
                    Click a star. Each one is something I’ll never forget.
                </p>
            </header>

            <div className="sky">
                <svg
                    className="skySvg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                    onClick={traceMode ? svgCoordsFromClick : undefined}
                >
                    {/* BACKGROUND STARS */}
                    {bgStars.map((s) => (
                        <circle
                            key={s.id}
                            cx={s.x}
                            cy={s.y}
                            r={s.r}
                            fill={`rgba(255,255,255,${s.a})`}
                        />
                    ))}

                    {/* SUPPORT STARS */}
                    {virgoSupportStars.map((s) => (
                        <circle
                            key={s.id}
                            cx={s.x}
                            cy={s.y}
                            r="0.45"
                            className="supportCore"
                        />
                    ))}

                    {/* LINES */}
                    {virgoLinks.map(([a, b]) => {
                        const A = virgoStars.find((s) => s.id === a);
                        const B = virgoStars.find((s) => s.id === b);
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

                    {/* STARS */}
                    {virgoStars.map((m) => (
                        <g
                            key={m.id}
                            transform={`translate(${m.x} ${m.y})`}
                            className={`starG ${
                                m.type === "anchor" ? "anchor" : ""
                            } ${selectedId === m.id ? "active" : ""}`}
                            onClick={() => !traceMode && setSelectedId(m.id)}
                        >
                            <circle className="hit" r="4.2" />
                            {m.type === "anchor" && <circle className="halo" r="5" />}
                            {m.type === "anchor" && <circle className="ring" r="3.2" />}
                            <g className="starVisual">
                                <polygon
                                    points="0,-2.8 0.6,-1.1 -0.6,-1.1"
                                    className="ray"
                                />
                                <polygon
                                    points="2.8,0 1.1,0.6 1.1,-0.6"
                                    className="ray"
                                />
                                <polygon
                                    points="0,2.8 0.6,1.1 -0.6,1.1"
                                    className="ray"
                                />
                                <polygon
                                    points="-2.8,0 -1.1,0.6 -1.1,-0.6"
                                    className="ray"
                                />
                                <circle r="1.2" className="core" />
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
                    text={`Ari,\n\nI wanted to build something that feels like you.\n\n— Tikhon`}
                />
            </section>
        </div>
    );
}
