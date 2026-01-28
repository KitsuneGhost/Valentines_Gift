import { useEffect, useMemo, useState } from "react";

function normalize(s) {
    return (s || "").trim().toLowerCase();
}

export default function MemoryVault({ chapters = [] }) {
    const storageKey = "valentine_vault_unlocked";

    const [unlocked, setUnlocked] = useState(() => {
        try {
            const raw = sessionStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    const [inputs, setInputs] = useState(() => Object.fromEntries(chapters.map(c => [c.id, ""])));
    const [wrong, setWrong] = useState({}); // per-chapter shake

    useEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(unlocked));
    }, [unlocked]);

    useEffect(() => {
        // if chapters change, ensure inputs has keys
        setInputs((prev) => {
            const next = { ...prev };
            for (const c of chapters) if (!(c.id in next)) next[c.id] = "";
            return next;
        });
    }, [chapters]);

    const onUnlock = (chapter) => {
        const ok = normalize(inputs[chapter.id]) === normalize(chapter.code);
        if (ok) {
            setUnlocked((u) => ({ ...u, [chapter.id]: true }));
            setWrong((w) => ({ ...w, [chapter.id]: false }));
        } else {
            setWrong((w) => ({ ...w, [chapter.id]: true }));
            window.setTimeout(() => setWrong((w) => ({ ...w, [chapter.id]: false })), 420);
        }
    };

    const allUnlocked = useMemo(
        () => chapters.length > 0 && chapters.every((c) => unlocked[c.id]),
        [chapters, unlocked]
    );

    return (
        <section className="vaultSection">
            <h2 className="h2">Memory Vault</h2>
            <p className="muted">Little chapters. No cringe passwords — just our words.</p>

            <div className="vaultGrid">
                {chapters.map((c) => {
                    const isOpen = !!unlocked[c.id];
                    return (
                        <div key={c.id} className={`vaultCard ${isOpen ? "open" : ""}`}>
                            <div className="vaultHeader">
                                <div className="vaultTitle">{c.title}</div>
                                <div className="vaultLock">{isOpen ? "Unlocked" : "Locked"}</div>
                            </div>

                            {!isOpen ? (
                                <>
                                    <div className="vaultHint">Hint: {c.hint}</div>

                                    <div className={`vaultForm ${wrong[c.id] ? "shake" : ""}`}>
                                        <input
                                            className="vaultInput"
                                            value={inputs[c.id] || ""}
                                            onChange={(e) => setInputs((m) => ({ ...m, [c.id]: e.target.value }))}
                                            placeholder="Type the word…"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") onUnlock(c);
                                            }}
                                        />
                                        <button className="vaultBtn" onClick={() => onUnlock(c)}>
                                            Unlock
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="vaultContent">{c.content}</div>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                className="vaultBtn"
                style={{ marginTop: 10 }}
                onClick={() => {
                    setUnlocked({});
                    try { sessionStorage.removeItem("valentine_vault_unlocked"); } catch {}
                }}
            >
                Reset Vault
            </button>

            {allUnlocked && (
                <div className="vaultFinal">
                    <div className="vaultFinalTitle">You found them all.</div>
                    <div className="vaultFinalText">Okay. One more thing is hidden in the next section.</div>
                </div>
            )}
        </section>
    );
}
