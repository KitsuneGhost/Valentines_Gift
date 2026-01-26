import { useEffect, useMemo, useState } from "react";

export default function TypedLetter({
                                        text,
                                        speed = 18, // ms per character (lower = faster)
                                    }) {
    const [i, setI] = useState(0);
    const [playing, setPlaying] = useState(true);

    const done = i >= text.length;
    const visible = useMemo(() => text.slice(0, i), [text, i]);

    useEffect(() => {
        if (!playing || done) return;

        const t = setTimeout(() => setI((prev) => prev + 1), speed);
        return () => clearTimeout(t);
    }, [playing, done, speed]);

    const restart = () => {
        setI(0);
        setPlaying(true);
    };

    return (
        <div className="letterCard">
            <div className="letterText">
                {visible}
                {!done && <span className="cursor">▍</span>}
            </div>

            <div className="letterControls">
                <button className="btn" onClick={() => setPlaying((p) => !p)}>
                    {playing ? "Pause" : "Play"}
                </button>
                <button className="btn ghost" onClick={() => setI(text.length)}>
                    Skip
                </button>
                <button className="btn ghost" onClick={restart}>
                    Restart
                </button>
            </div>
        </div>
    );
}
