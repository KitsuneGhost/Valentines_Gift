import { useEffect, useMemo, useRef, useState } from "react";

function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReduced(!!mq.matches);
        onChange();
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);
    return reduced;
}

export default function PolaroidGallery({ items = [] }) {
    const reducedMotion = usePrefersReducedMotion();
    const [active, setActive] = useState(null);

    const activeItem = useMemo(
        () => items.find((x) => x.id === active) || null,
        [items, active]
    );

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setActive(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <section className="polaroidSection">
            <h2 className="h2">Polaroids</h2>
            <p className="muted">Little snapshots with the meaning left inside💓</p>

            <div className="polaroidGrid">
                {items.map((it, idx) => (
                    <PolaroidCard
                        key={it.id}
                        item={it}
                        index={idx}
                        reducedMotion={reducedMotion}
                        onOpen={() => setActive(it.id)}
                    />
                ))}
            </div>

            {activeItem && (
                <div className="pModalOverlay" onMouseDown={() => setActive(null)}>
                    <div className="pModal" onMouseDown={(e) => e.stopPropagation()}>
                        <button className="pX" onClick={() => setActive(null)} aria-label="Close">
                            ✕
                        </button>

                        <div className="pModalTop">
                            <div className="pModalTitle">{activeItem.title}</div>
                            <div className="pModalDate">{activeItem.date}</div>
                        </div>

                        <div className="pModalPhoto">
                            <img
                                className="pModalImg"
                                src={activeItem.image}
                                alt={activeItem.title}
                                draggable="false"
                            />
                        </div>


                        <div className="pModalNote">{activeItem.note}</div>
                    </div>
                </div>
            )}
        </section>
    );
}

function PolaroidCard({ item, index, reducedMotion, onOpen }) {
    const ref = useRef(null);
    const [style, setStyle] = useState({});

    // slight variety without randomness (stable)
    const baseRot = (index % 2 === 0 ? -1 : 1) * (1.8 + (index % 3) * 0.6);

    const onMove = (e) => {
        if (reducedMotion) return;
        const el = ref.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width; // 0..1
        const py = (e.clientY - r.top) / r.height; // 0..1

        const rx = clamp((0.5 - py) * 10, -8, 8); // tilt X
        const ry = clamp((px - 0.5) * 12, -10, 10); // tilt Y

        setStyle({
            transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${baseRot}deg) translateY(-2px)`,
        });
    };

    const onLeave = () => {
        setStyle({
            transform: `perspective(900px) rotateX(0deg) rotateY(0deg) rotate(${baseRot}deg)`,
        });
    };

    useEffect(() => {
        onLeave();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <button
            ref={ref}
            className="polaroidCard"
            style={style}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onFocus={onLeave}
            onClick={onOpen}
            type="button"
        >
            <div className="polaroidPhoto">
                <img
                    className="polaroidImg"
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    draggable="false"
                />
            </div>

            <div className="polaroidCaption">
                <div className="polaroidTitle">{item.title}</div>
                <div className="polaroidDate">{item.date}</div>
            </div>
        </button>
    );
}
