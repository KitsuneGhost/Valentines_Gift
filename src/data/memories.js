export const virgoStars = [
    // LEFT ARM (horizontal)
    { id: 1, title: "Left 1", x: 18, y: 42 },
    { id: 2, title: "Left 2", x: 30, y: 40 },

    // CENTRAL HUB (junction)
    { id: 3, title: "Hub", x: 44, y: 42 },

    // TOP SPIKE
    { id: 4, title: "Top", x: 44, y: 26 },

    // RIGHT ARM
    { id: 5, title: "Right mid", x: 60, y: 40 },
    { id: 6, title: "Far right", x: 76, y: 34 },

    // LOWER CONNECTOR (diagonal down-left)
    { id: 7, title: "Lower mid", x: 38, y: 58 },

    // SPICA (anchor, bottom-left-ish)
    { id: 8, title: "Spica", x: 30, y: 72, type: "anchor" },

    // LEFT TAIL (small zigzag)
    { id: 9, title: "Tail 1", x: 22, y: 54 },
    { id: 10, title: "Tail 2", x: 28, y: 56 },
];

export const virgoLinks = [
    // left arm
    [1, 2],
    [2, 3],

    // hub structure
    [3, 4], // up
    [3, 5], // right
    [5, 6],

    // down to Spica
    [3, 7],
    [7, 8],

    // left tail
    [1, 9],
    [9, 10],
    [10, 2],
];
