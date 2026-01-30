import { useMemo, useState } from "react";

export default function Finale({ timeline = [], forget = [], promises = [] }) {
    // Timeline: reveal items one by one
    const [shown, setShown] = useState(1);

    // If You Ever Forget: cycle messages
    const [forgetIndex, setForgetIndex] = useState(0);

    // Promises: reveal sequentially
    const [promiseCount, setPromiseCount] = useState(1);

    const canRevealMoreTimeline = shown < timeline.length;
    const canRevealMorePromises = promiseCount < promises.length;

    const currentForget = useMemo(() => {
        if (!forget.length) return "";
        return forget[forgetIndex % forget.length];
    }, [forget, forgetIndex]);

    return (
        <section className="finaleSection">
            <h2 className="h2">Finale</h2>
            <p className="muted">Three small things to end on.</p>

            {/* TIMELINE */}
            <div className="finalBlock">
                <div className="finalHead">
                    <div className="finalTitle">Timeline of Us</div>
                    <div className="finalSub">Tap to reveal, one at a time.</div>
                </div>

                <div className="timeline">
                    {timeline.slice(0, shown).map((it, i) => (
                        <div key={it.id} className="timelineItem">
                            <div className="timelineDot" />
                            <div className="timelineCard">
                                <div className="timelineTop">
                                    <div className="timelineDate">{it.date}</div>
                                    <div className="timelineName">{it.title}</div>
                                </div>
                                <div className="timelineText">{it.text}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="finalActions">
                    <button
                        className="finalBtn"
                        type="button"
                        onClick={() => setShown((s) => Math.min(timeline.length, s + 1))}
                        disabled={!canRevealMoreTimeline}
                    >
                        {canRevealMoreTimeline ? "Reveal next" : "All revealed"}
                    </button>
                    <button
                        className="finalBtn ghost"
                        type="button"
                        onClick={() => setShown(1)}
                        disabled={shown === 1}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* IF YOU EVER FORGET */}
            <div className="finalBlock">
                <div className="finalHead">
                    <div className="finalTitle">If You Ever Forget</div>
                    <div className="finalSub">A small reminder — anytime.</div>
                </div>

                <div className="forgetCard">
                    <div className="forgetText">{currentForget}</div>
                    <div className="finalActions">
                        <button className="finalBtn" type="button" onClick={() => setForgetIndex((i) => i + 1)}>
                            Another one
                        </button>
                        <button
                            className="finalBtn ghost"
                            type="button"
                            onClick={() => setForgetIndex((i) => (i - 1 + forget.length) % forget.length)}
                            disabled={forget.length < 2}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>

            {/* QUIET PROMISES */}
            <div className="finalBlock">
                <div className="finalHead">
                    <div className="finalTitle">Quiet Promises</div>
                    <div className="finalSub">Not loud. Just real.</div>
                </div>

                <div className="promiseList">
                    {promises.slice(0, promiseCount).map((p, idx) => (
                        <div key={`${idx}-${p}`} className="promiseItem">
                            <span className="promiseBullet" />
                            <span className="promiseText">{p}</span>
                        </div>
                    ))}
                </div>

                <div className="finalActions">
                    <button
                        className="finalBtn"
                        type="button"
                        onClick={() => setPromiseCount((c) => Math.min(promises.length, c + 1))}
                        disabled={!canRevealMorePromises}
                    >
                        {canRevealMorePromises ? "Reveal next" : "All revealed"}
                    </button>
                    <button
                        className="finalBtn ghost"
                        type="button"
                        onClick={() => setPromiseCount(1)}
                        disabled={promiseCount === 1}
                    >
                        Reset
                    </button>
                </div>

                <div className="finalEnd">
                    <div className="finalEndTitle">I choose you.</div>
                    <div className="finalEndSub">Every day, on purpose.</div>
                </div>
            </div>
        </section>
    );
}
