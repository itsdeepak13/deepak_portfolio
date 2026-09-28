export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    fontFamily: { body: ["Inter", "sans-serif"], display: ["Instrument Serif", "serif"] },
    colors: { bg: "hsl(var(--bg))", surface: "hsl(var(--surface))", "text-primary": "hsl(var(--text))", muted: "hsl(var(--muted))", stroke: "hsl(var(--stroke))" },
    animation: { "scroll-down": "scroll-down 1.5s ease-in-out infinite", "role-fade-in": "role-fade-in .4s ease-out" },
    keyframes: {
      "scroll-down": { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(200%)" } },
      "role-fade-in": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } } } },
};
