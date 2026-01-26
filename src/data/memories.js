export const virgoStars = [
    // LEFT ARM (long, slightly angled)
    { id: 1, title: "Left tip", date: "—", note: "Memory", x: 25, y: 47 },
    { id: 2, title: "Left mid", date: "—", note: "Memory", x: 36, y: 46.5 },

    // TOP SIDE OF RECTANGLE
    { id: 3, title: "Center", date: "—", note: "Memory", x: 43, y: 50 },
    { id: 4, title: "Top", date: "—", note: "Memory", x: 55, y: 43 },

    // RIGHT ARM (longer + more horizontal)
    { id: 5, title: "Right mid", date: "—", note: "Memory", x: 53, y: 30.5 },
    { id: 6, title: "Right tip", date: "—", note: "Memory", x: 61, y: 48 },

    // LOWER LINE OF RECTANGLE
    { id: 7, title: "Lower mid", date: "—", note: "Memory", x: 51, y: 57.5 },

    // SPICA (anchor, clearly separated)
    {
        id: 8,
        title: "Spica",
        date: "—",
        note: "Your anchor memory",
        x: 47,
        y: 62.5,
        type: "anchor",
    },

    // RIGHT ARM
    { id: 9, title: "Tail 1", date: "—", note: "Memory", x: 70, y: 46.5 },
    { id: 10, title: "Tail 2", date: "—", note: "Memory", x: 78, y: 40 },

    // LEFT ZIGZAG ARM
    { id: 11, title: "Tail 2", date: "—", note: "Memory", x: 31.5, y: 61.7 },
    { id: 12, title: "Tail 2", date: "—", note: "Memory", x: 30, y: 57 },
    { id: 13, title: "Tail 2", date: "—", note: "Memory", x: 23, y: 57 },
];

export const virgoLinks = [
    [1, 2],       // left bottom arm
    [2, 3],

    [3, 4],       // top side of rectangle
    [4, 5],

    [4, 6],       // right side of retangle

    [6, 7],       // lower side of rectangle
    [7, 8],

    [3, 8],       // left side of the rectangle

    [6, 9],       // right arm
    [9, 10],

    [8, 11],        // left zigzag
    [11, 12],
    [12, 13]
];

export const virgoSupportStars = [
    { id: "s1", x: 34, y: 36 },
    { id: "s2", x: 52, y: 54 },
    { id: "s3", x: 66, y: 28 },
];
