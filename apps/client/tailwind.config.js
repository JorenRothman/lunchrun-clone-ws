/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        fontFamily: {
            geist: "Geist Variable",
        },
        colors: {
            purple: "hsl(240, 46%, 30%)",
            blue: "hsl(220, 30%, 95%)",
            blue2: "hsl(220, 30%, 90%)",
            yellow: "hsl(40, 100%, 60%)",
            white: "hsl(0, 0%, 96%)",
            black: "hsl(0, 0%, 4%)",
        },
        container: {},
        extend: {
            minHeight: {
                dvh: ["100vh", "100dvh"],
            },
        },
    },
    plugins: [import("tailwindcss-animate")],
};
