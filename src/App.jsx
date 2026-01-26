import { useMemo, useState } from "react";
import { memories, links } from "./data/memories";
import TypedLetter from "./components/TypedLetter";
import "./App.css";

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

function getById(id) {
    return memories.find((m) => m.id === id);
}

export default function App() {
    const [selectedId, setSelectedId] = useState(null);

    const selected = useMemo(
        () => memories.find((m) => m.id === selectedId),
        [selectedId]
    );

    return (
        <div className="page">
            <header className="hero">
                <h1>Ari’s Constellation ✨</h1>
                <p className="muted">Click a star. Each one is something I’ll never forget.</p>
            </header>

            <div className="sky">
                {/* SVG lines (behind stars) */}
                <svg className="lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {links.map(([a, b]) => {
                        const A = getById(a);
                        const B = getById(b);
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
                </svg>

                {/* stars */}
                {memories.map((m) => (
                    <button
                        key={m.id}
                        className={`star ${selectedId === m.id ? "active" : ""}`}
                        style={{ left: `${m.x}%`, top: `${m.y}%` }}
                        onClick={() => setSelectedId(m.id)}
                        aria-label={m.title}
                    />
                ))}
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
