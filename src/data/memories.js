export const virgoStars = [
    // LEFT ARM (long, slightly angled)
    { id: 1, title: "Left tip", date: "—", note: "Memory", x: 12, y: 44 },
    { id: 2, title: "Left mid", date: "—", note: "Memory", x: 26, y: 42 },

    // CENTRAL HUB
    { id: 3, title: "Center", date: "—", note: "Memory", x: 42, y: 44 },

    // TOP SPIKE (vertical)
    { id: 4, title: "Top", date: "—", note: "Memory", x: 42, y: 24 },

    // RIGHT ARM (longer + more horizontal)
    { id: 5, title: "Right mid", date: "—", note: "Memory", x: 60, y: 40 },
    { id: 6, title: "Right tip", date: "—", note: "Memory", x: 78, y: 34 },

    // LOWER CONNECTOR (diagonal down)
    { id: 7, title: "Lower mid", date: "—", note: "Memory", x: 36, y: 60 },

    // SPICA (anchor, clearly separated)
    {
        id: 8,
        title: "Spica",
        date: "—",
        note: "Your anchor memory",
        x: 30,
        y: 78,
        type: "anchor",
    },

    // LEFT TAIL (small zig-zag)
    { id: 9, title: "Tail 1", date: "—", note: "Memory", x: 18, y: 56 },
    { id: 10, title: "Tail 2", date: "—", note: "Memory", x: 24, y: 58 },
];

export const virgoLinks = [
    [1, 2],
    [2, 3],

    [3, 4],       // top spike
    [3, 5],
    [5, 6],       // right arm

    [3, 7],
    [7, 8],       // Spica stem

    [1, 9],
    [9, 10],
    [10, 2],      // left tail
];

export const virgoSupportStars = [
    { id: "s1", x: 34, y: 36 },
    { id: "s2", x: 52, y: 54 },
    { id: "s3", x: 66, y: 28 },
];
