import { useEffect, useMemo, useRef, useState } from "react";

/**
 * High-end line-by-line reveal (not typewriter).
 * - Reveals one full line at a time.
 * - Soft cursor only on the active line.
 */
export default function TypedLetter({
                                        text,
                                        speed = 14,
                                        linePause = 420,
                                        startDelay = 450,
                                    }) {
    const lines = useMemo(() => String(text ?? "").split("\n"), [text]);

    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [started, setStarted] = useState(false);

    const timerRef = useRef(null);
    const delayRef = useRef(null);

    useEffect(() => {
        // reset when text changes
        setLineIndex(0);
        setCharIndex(0);
        setStarted(false);

        if (timerRef.current) clearTimeout(timerRef.current);
        if (delayRef.current) clearTimeout(delayRef.current);

        delayRef.current = setTimeout(() => setStarted(true), startDelay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (delayRef.current) clearTimeout(delayRef.current);
        };
    }, [text, startDelay]);

    useEffect(() => {
        if (!started) return;

        const currentLine = lines[lineIndex] ?? "";
        const isLastLine = lineIndex >= lines.length - 1;
        const lineDone = charIndex >= currentLine.length;

        if (lineDone) {
            // move to next line after a pause
            if (!isLastLine) {
                timerRef.current = setTimeout(() => {
                    setLineIndex((i) => i + 1);
                    setCharIndex(0);
                }, linePause);
            }
            return;
        }

        timerRef.current = setTimeout(() => {
            setCharIndex((c) => c + 1);
        }, speed);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [started, lines, lineIndex, charIndex, speed, linePause]);

    const done =
        started &&
        lineIndex === lines.length - 1 &&
        charIndex >= (lines[lines.length - 1]?.length ?? 0);

    return (
        <div className="typedWrap">
            <div className="typedCard">
        <pre className="typedPre">
          {lines.map((ln, i) => {
              const isPast = i < lineIndex;
              const isActive = i === lineIndex;
              const isFuture = i > lineIndex;

              const visibleText = isPast
                  ? ln
                  : isActive
                      ? ln.slice(0, charIndex)
                      : "";

              return (
                  <div
                      key={i}
                      className={`typedLine ${isPast ? "past" : ""} ${
                          isActive ? "active" : ""
                      } ${isFuture ? "future" : ""}`}
                  >
                      <span className="typedText">{visibleText}</span>
                      {isActive && !done && <span className="softCursor" />}
                  </div>
              );
          })}
        </pre>

                {done && <div className="typedDone">•</div>}
            </div>
        </div>
    );
}