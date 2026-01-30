import { useEffect, useMemo, useState } from "react";

function pickRandom(list) {
    if (!list.length) return null;
    const i = Math.floor(Math.random() * list.length);
    return list[i];
}

export default function DailyReasons({ pool = [] }) {
    const storageKey = "valentine_reasons_favs";

    const [current, setCurrent] = useState("");
    const [favs, setFavs] = useState(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(favs));
    }, [favs]);

    const favSet = useMemo(() => new Set(favs), [favs]);

    const generate = () => {
        const next = pickRandom(pool) || "…";
        setCurrent(next);
    };

    const save = () => {
        const v = (current || "").trim();
        if (!v) return;
        if (favSet.has(v)) return;
        setFavs((prev) => [v, ...prev]);
    };

    const remove = (text) => {
        setFavs((prev) => prev.filter((x) => x !== text));
    };

    return (
        <section className="reasonsSection">
            <h2 className="h2">Daily Reasons</h2>
            <p className="muted">Reasons why I love you. Save the ones you want to keep.</p>

            <div className="reasonCard">
                <div className={`reasonText ${current ? "show" : ""}`}>
                    {current || "Click “Give me one reason”."}
                </div>

                <div className="reasonActions">
                    <button className="reasonBtn primary" onClick={generate}>
                        Give me one reason
                    </button>
                    <button
                        className="reasonBtn"
                        onClick={save}
                        disabled={!current || favSet.has(current)}
                        title={!current ? "Generate one first" : favSet.has(current) ? "Already saved" : "Save"}
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className="reasonsListWrap">
                <div className="reasonsListTitle">Saved</div>

                {favs.length === 0 ? (
                    <div className="muted" style={{ marginTop: 8 }}>
                        Nothing saved yet.
                    </div>
                ) : (
                    <ul className="reasonsList">
                        {favs.map((t) => (
                            <li key={t} className="reasonItem">
                                <span className="reasonItemText">{t}</span>
                                <button className="reasonRemove" onClick={() => remove(t)} aria-label="Remove">
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
