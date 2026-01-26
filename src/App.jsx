import { useState } from "react";

export default function App() {
    const [revealed, setRevealed] = useState(false);

    return (
        <div>
            <h1>Hi Ari ❤️</h1>

            <button onClick={() => setRevealed(true)}>
                Click me
            </button>

            {revealed && <p>I love you.</p>}
        </div>
    );
}
