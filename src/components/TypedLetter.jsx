import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Smooth, premium reveal:
 * - Reveals characters in the active line
 * - Adds a short pause between lines
 * - StrictMode-safe (cleans timers)
 */
export default function TypedLetter({
                                        text = "",
                                        speed = 18,         // ms per char
                                        linePause = 280,    // pause after finishing a line
                                        startDelay = 450,   // initial delay
                                    }) {
    const lines = useMemo(() => text.split("\n"), [text]);

    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);

    const timersRef = useRef([]);

    const clearTimers = () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    };

    useEffect(() => {
        clearTimers();
        setLineIndex(0);
        setCharIndex(0);
        setStarted(false);
        setDone(false);

        const t = setTimeout(() => setStarted(true), startDelay);
        timersRef.current.push(t);

        return () => clearTimers();
    }, [text, startDelay]);

    useEffect(() => {
        if (!started || done) return;

        const currentLine = lines[lineIndex] ?? "";

        // finished everything
        if (lineIndex >= lines.length) {
            setDone(true);
            return;
        }

        // reveal next char
        if (charIndex < currentLine.length) {
            const t = setTimeout(() => setCharIndex((c) => c + 1), speed);
            timersRef.current.push(t);
            return;
        }

        // line finished -> pause, then go next line
        const t = setTimeout(() => {
            setLineIndex((l) => l + 1);
            setCharIndex(0);
        }, linePause);
        timersRef.current.push(t);
    }, [started, done, lines, lineIndex, charIndex, speed, linePause]);

    return (
        <div className="typedWrap">
            <div className="typedCard">
        <pre className="typedPre" aria-label="Letter">
          {lines.map((ln, i) => {
              const isPast = i < lineIndex;
              const isActive = i === lineIndex && !done;
              const visible = isPast ? ln : isActive ? ln.slice(0, charIndex) : "";

              return (
                  <div
                      key={i}
                      className={[
                          "typedLine",
                          isPast && "past",
                          isActive && "active",
                      ]
                          .filter(Boolean)
                          .join(" ")}
                  >
                      <span className="typedText">{visible}</span>
                      {isActive && <span className="softCursor" aria-hidden="true" />}
                  </div>
              );
          })}
        </pre>
            </div>
        </div>
    );
}
