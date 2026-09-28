import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LINKS, ROLES, NAV, EXPERIENCE, PROJECTS, SKILLS, STATS } from "./data";
gsap.registerPlugin(ScrollTrigger);

const HLS = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
const ease = [0.25, 0.1, 0.25, 1] as const;
const NAVID: Record<string, string> = { Home: "home", About: "about", Experience: "experience", Projects: "projects", Skills: "skills", Education: "education", Contact: "contact" };

/* ---------- shared ---------- */
function Ring({ children, className = "", solid = false, href, onClick, ...rest }: { children: ReactNode; className?: string; solid?: boolean; href?: string; onClick?: () => void; target?: string; rel?: string; download?: boolean }) {
  const cls = `group relative inline-flex items-center justify-center rounded-full text-sm px-7 py-3.5 transition-transform hover:scale-105 ${className}`;
  const inner = (<>
    <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className={`relative rounded-full px-7 py-3.5 -mx-7 -my-3.5 transition-colors ${solid ? "bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary" : "bg-bg border-2 border-stroke group-hover:border-transparent"}`}>{children}</span>
  </>);
  return href ? <a href={href} className={cls} {...rest}>{inner}</a> : <button onClick={onClick} className={cls}>{inner}</button>;
}
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function Header({ eyebrow, children, sub }: { eyebrow: string; children: ReactNode; sub?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease }} className="mb-10 md:mb-14">
      <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-stroke" /><span className="text-xs text-muted uppercase tracking-[0.3em]">{eyebrow}</span></div>
      <h2 className="text-4xl md:text-6xl font-display tracking-tight">{children}</h2>
      {sub && <p className="text-sm md:text-base text-muted max-w-xl mt-4">{sub}</p>}
    </motion.div>
  );
}
const Wrap = ({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) => (
  <section id={id} className={`bg-bg py-14 md:py-20 ${className}`}><div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">{children}</div></section>
);

/* ---------- video with fallback ---------- */
function VideoBg({ flip = false, dim = "bg-black/40" }: { flip?: boolean; dim?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const skip = matchMedia("(max-width: 768px)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches || nav.connection?.saveData;
    const v = ref.current; if (skip || !v) { setFailed(true); return; }
    let hls: { destroy(): void } | undefined; let dead = false;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || hls || dead) return; io.disconnect();
      try {
        if (v.canPlayType("application/vnd.apple.mpegurl")) { v.src = HLS; }
        else { const { default: Hls } = await import("hls.js");
          if (!Hls.isSupported()) throw 0;
          const h = new Hls({ capLevelToPlayerSize: true, maxBufferLength: 10 }); hls = h; h.loadSource(HLS); h.attachMedia(v);
          h.on(Hls.Events.ERROR, (_, d) => { if (d.fatal) setFailed(true); }); }
        v.play().catch(() => setFailed(true));
      } catch { setFailed(true); }
    }, { rootMargin: "200px" });
    io.observe(v);
    return () => { dead = true; io.disconnect(); hls?.destroy(); };
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 30%, #1b2a3d 0%, #0a0a0a 70%)" }} />
      {!failed && <video ref={ref} muted loop playsInline preload="none" onError={() => setFailed(true)} className={`absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 ${flip ? "scale-y-[-1]" : ""}`} />}
      <div className={`absolute inset-0 ${dim}`} />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}

/* ---------- navbar ---------- */
function Navbar() {
  const [y, setY] = useState(0); const [active, setActive] = useState("Home");
  useEffect(() => {
    const f = () => setY(scrollY); addEventListener("scroll", f, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(Object.keys(NAVID).find((k) => NAVID[k] === e.target.id)!)), { rootMargin: "-45% 0px -50% 0px" });
    Object.values(NAVID).forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => { removeEventListener("scroll", f); io.disconnect(); };
  }, []);
  const link = "text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap transition-colors";
  return (
    <nav aria-label="Primary" className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div className={`inline-flex items-center max-w-full rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 ${y > 100 ? "shadow-md shadow-black/10" : ""}`}>
        <button onClick={() => go("home")} aria-label="Home" className="group shrink-0 w-9 h-9 rounded-full p-[2px] accent-gradient hover:scale-110 transition-transform"><span className="flex w-full h-full items-center justify-center rounded-full bg-bg font-display italic text-[13px]">DS</span></button>
        <span className="hidden sm:block w-px h-5 bg-stroke mx-1 shrink-0" />
        <div className="flex items-center overflow-x-auto [scrollbar-width:none]">
          {NAV.map((n) => <button key={n} onClick={() => go(NAVID[n])} className={`${link} ${active === n ? "text-text-primary bg-stroke/50" : "text-muted hover:text-text-primary hover:bg-stroke/50"}`}>{n}</button>)}
        </div>
        <span className="w-px h-5 bg-stroke mx-1 shrink-0" />
        <a href={LINKS.resume} target="_blank" rel="noreferrer" className={`${link} group relative shrink-0`}>
          <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative block bg-surface rounded-full px-3 sm:px-4 py-1.5 sm:py-2 -mx-3 sm:-mx-4 -my-1.5 sm:-my-2 text-text-primary">Resume ↗</span>
        </a>
      </div>
    </nav>
  );
}

/* ---------- hero ---------- */
function Hero() {
  const [i, setI] = useState(0); const root = useRef<HTMLElement>(null);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2200); return () => clearInterval(t); }, []);
  useEffect(() => {
    const c = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".name-reveal", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.1 })
        .fromTo(".blur-in", { opacity: 0, filter: "blur(10px)", y: 20 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 }, 0.3);
    }, root); return () => c.revert();
  }, []);
  return (
    <section id="home" ref={root} className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-6 pt-24">
      <VideoBg />
      <div className="relative z-10 flex flex-col items-center">
        <p className="blur-in text-[10px] sm:text-xs text-muted uppercase tracking-[0.3em] mb-8">Software Engineer • Cybersecurity • AI &amp; Data Science</p>
        <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight mb-6">Deepak<br className="md:hidden" /> Sharma</h1>
        <p className="blur-in text-lg md:text-2xl text-text-primary/90 mb-2">A <span key={i} className="font-display italic inline-block animate-role-fade-in">{ROLES[i]}</span> from Rohtak, Haryana, India.</p>
        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12">Building secure systems at the intersection of software, AI, and cybersecurity.</p>
        <div className="blur-in flex flex-wrap justify-center gap-4">
          <Ring solid onClick={() => go("projects")}>View Projects</Ring>
          <Ring onClick={() => go("contact")}>Contact Me</Ring>
          <Ring href={LINKS.resume} download>Download Resume</Ring>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-xs text-muted uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-10 bg-stroke overflow-hidden"><div className="w-full h-1/2 accent-gradient animate-scroll-down" /></div>
      </div>
    </section>
  );
}

/* ---------- about ---------- */
function About() {
  return (
    <Wrap id="about">
      <Header eyebrow="About">Secure by <em>design</em>, from code to protocol.</Header>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease }} className="grid md:grid-cols-12 gap-8">
        <p className="md:col-span-7 text-lg md:text-xl text-text-primary/85 leading-relaxed max-w-[62ch]">I'm a software engineer and cybersecurity researcher finishing a B.Tech in CSE (AI &amp; Data Science). My work spans industrial control system security at IISc, applied cryptography, and full-stack development, from a lattice-based medical image cipher to an OpenPLC attack-and-defence testbed.</p>
        <div className="md:col-span-5 rounded-3xl border border-stroke bg-surface p-6 text-sm text-muted space-y-2">
          <p><span className="text-text-primary">Based in</span> Rohtak, Haryana, India</p>
          <p><span className="text-text-primary">Focus</span> ICS/OT security, cryptography, AI/data</p>
          <p><span className="text-text-primary">Also</span> Leads a campus poetry club</p>
        </div>
      </motion.div>
    </Wrap>
  );
}

/* ---------- IISc ICS diagram ---------- */
function ICSDiagram() {
  const node = (x: number, y: number, w: number, t: string, s: string, hi = false) => (
    <g><rect x={x} y={y} width={w} height={54} rx={14} fill="hsl(0 0% 8%)" stroke={hi ? "#4E85BF" : "hsl(0 0% 20%)"} strokeWidth={hi ? 1.5 : 1} />
      <text x={x + w / 2} y={y + 24} textAnchor="middle" fill="#f5f5f5" fontSize="13" fontFamily="Inter">{t}</text>
      <text x={x + w / 2} y={y + 42} textAnchor="middle" fill="#888" fontSize="10.5" fontFamily="Inter">{s}</text></g>
  );
  const ln = (d: string, dash = true) => <path d={d} stroke="#4E85BF" strokeWidth="1.5" fill="none" className={dash ? "flow" : ""} opacity={0.8} />;
  return (
    <figure className="mt-6 rounded-2xl border border-stroke bg-bg/60 p-3 overflow-x-auto">
      <svg viewBox="0 0 760 270" className="min-w-[600px] w-full" role="img" aria-label="Simplified diagram of the ICS testbed: attack suite and switch with SPAN mirroring, OpenPLC on Raspberry Pi, Conpot honeypots, and a capture monitor">
        {ln("M170 60 H270")}{ln("M420 60 H520")}{ln("M345 87 V150 H210 V180")}{ln("M345 87 V150 H545 V180", false)}{ln("M345 87 V150 H375 V180")}
        {node(20, 33, 150, "Python attack suite", "flood · SYN · injection")}
        {node(270, 33, 150, "Managed switch", "SPAN port mirroring", true)}
        {node(520, 33, 200, "OpenPLC · Raspberry Pi", "Modbus TCP process", true)}
        {node(105, 180, 210, "Conpot honeypots", "Modbus · S7Comm · BACnet")}
        {node(330, 180, 90, "Monitor", "traffic capture")}
        {node(470, 180, 150, "Threat intel", "passive capture")}
        <text x="20" y="250" fill="#666" fontSize="10.5" fontFamily="Inter">Simplified illustration of the testbed concept, not an exact network diagram.</text>
      </svg>
    </figure>
  );
}

/* ---------- experience ---------- */
function Experience() {
  const [open, setOpen] = useState(0);
  return (
    <Wrap id="experience">
      <Header eyebrow="Experience" sub="Research and engineering internships across ICS security, cybersecurity, and software development.">Where I've <em>worked</em></Header>
      <div className="space-y-4">
        {EXPERIENCE.map((e, i) => {
          const on = open === i;
          return (
            <motion.div key={e.org} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease }}
              className={`border border-stroke transition-colors ${on ? "bg-surface" : "bg-surface/30 hover:bg-surface"} ${on ? "rounded-[32px]" : "rounded-[40px] sm:rounded-full"} ${e.featured ? "ring-1 ring-[#4E85BF]/40" : ""}`}>
              <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="w-full flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 p-5 sm:px-8 sm:py-5 text-left">
                <span className="flex-1"><span className="block text-xl md:text-2xl font-display">{e.org}</span><span className="text-sm text-muted">{e.role}</span></span>
                <span className="text-xs text-muted">{e.date}</span>
                <span className={`hidden sm:flex w-8 h-8 rounded-full border border-stroke items-center justify-center transition-transform ${on ? "rotate-45" : ""}`}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                    <div className="px-5 sm:px-8 pb-6">
                      <ul className="space-y-2 text-sm md:text-base text-text-primary/80 max-w-[70ch] list-disc pl-5">{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
                      {e.featured && <ICSDiagram />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Wrap>
  );
}

/* ---------- projects ---------- */
const P = "#4E85BF", L = "#89AACC";
function Art({ id }: { id: string }) {
  if (id === "medi") return (
    <svg viewBox="0 0 600 340" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs><pattern id="ld" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill={L} opacity=".35" /></pattern><radialGradient id="mg"><stop offset="0" stopColor={P} stopOpacity=".5" /><stop offset="1" stopColor={P} stopOpacity="0" /></radialGradient></defs>
      <rect width="600" height="340" fill="url(#ld)" /><circle cx="300" cy="170" r="150" fill="url(#mg)" />
      {[60, 95, 130].map((r) => <ellipse key={r} cx="300" cy="170" rx={r * 1.05} ry={r} fill="none" stroke={L} strokeOpacity={0.5} />)}
      <path d="M300 110 c-40 0 -50 40 -30 70 c15 20 45 20 60 0 c20 -30 10 -70 -30 -70z" fill="none" stroke={L} strokeWidth="2" />
      <path d="M170 170 H430 M300 40 V300" stroke={P} strokeOpacity=".5" strokeDasharray="4 6" />
      {Array.from({ length: 40 }).map((_, k) => <rect key={k} x={40 + (k % 10) * 8} y={250 + Math.floor(k / 10) * 8} width="6" height="6" fill={k % 3 ? P : L} opacity={0.25 + ((k * 37) % 10) / 14} />)}
    </svg>);
  if (id === "twit") return (
    <svg viewBox="0 0 600 340" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect x="60" y="50" width="480" height="240" rx="16" fill="none" stroke={L} strokeOpacity=".4" /><path d="M60 84 H540" stroke={L} strokeOpacity=".4" />
      {[80, 98, 116].map((x) => <circle key={x} cx={x} cy="67" r="4" fill={L} opacity=".6" />)}
      <rect x="90" y="110" width="250" height="44" rx="14" fill={P} opacity=".25" /><rect x="105" y="128" width="150" height="7" rx="3" fill={L} opacity=".7" />
      <rect x="260" y="170" width="250" height="60" rx="14" fill="none" stroke={P} strokeWidth="1.5" /><rect x="276" y="186" width="190" height="7" rx="3" fill={L} opacity=".7" /><rect x="276" y="204" width="120" height="7" rx="3" fill={L} opacity=".4" />
      <path d="M470 258 l10 -10 l10 10 l10 -18 l10 18 M380 262 h60" stroke={L} strokeWidth="2" fill="none" /><text x="90" y="262" fill={L} fontSize="22" fontFamily="monospace">{"</>"}</text>
      <circle cx="520" cy="130" r="14" fill="none" stroke={P} /><path d="M514 130 l5 5 l9 -10" stroke={L} fill="none" strokeWidth="2" />
    </svg>);
  return (
    <svg viewBox="0 0 600 340" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {["4E85BF", "89AACC"].map((_, k) => <rect key={k} x={200 + k * 30} y={60 - k * 14} width="150" height="190" rx="14" fill="hsl(0 0% 8%)" stroke={k ? L : P} strokeOpacity=".7" />)}
      <rect x="245" y="120" width="90" height="70" rx="10" fill={P} opacity=".3" stroke={L} /><path d="M265 120 v-16 a25 25 0 0 1 50 0 v16" fill="none" stroke={L} strokeWidth="3" /><circle cx="290" cy="152" r="7" fill={L} />
      {Array.from({ length: 9 }).map((_, k) => <text key={k} x="20" y={40 + k * 30} fill={L} opacity={0.15 + (k % 3) * 0.1} fontSize="13" fontFamily="monospace">{["a3f9 c21e 77b0 e4d8", "9b1c 5f02 d3a7 18ee", "e0c4 8a91 4b7d f26a"][k % 3]}</text>)}
      {Array.from({ length: 9 }).map((_, k) => <text key={k} x="440" y={60 + k * 30} fill={L} opacity={0.15 + (k % 3) * 0.1} fontSize="13" fontFamily="monospace">{["SHA-256", "AES-256", "base64"][k % 3]}</text>)}
    </svg>);
}
function Projects() {
  return (
    <Wrap id="projects">
      <Header eyebrow="Selected Work" sub="Cryptography, browser automation, and secure storage. Card visuals are illustrative artwork, not screenshots.">Featured <em>projects</em></Header>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
        {PROJECTS.map((p) => (
          <motion.article key={p.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease }}
            className={`group ${p.span} bg-surface border border-stroke rounded-3xl overflow-hidden flex flex-col`}>
            <div className="relative aspect-[16/8] bg-bg overflow-hidden"><div className="w-full h-full transition-transform duration-700 group-hover:scale-105"><Art id={p.id} /></div>
              <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: "radial-gradient(circle,#000 1px,transparent 1px)", backgroundSize: "4px 4px" }} /></div>
            <div className="p-6 md:p-8 flex flex-col gap-4 flex-1">
              <div><h3 className="text-3xl font-display italic">{p.title}</h3><p className="text-sm text-muted">{p.sub}</p></div>
              <p className="text-sm text-text-primary/80 max-w-[65ch]">{p.desc}</p>
              <ul className="flex flex-wrap gap-2">{p.tech.map((t) => <li key={t} className="text-xs text-muted border border-stroke rounded-full px-3 py-1">{t}</li>)}</ul>
              <div className="mt-auto pt-2"><Ring href={p.url} target="_blank" rel="noreferrer" className="!px-5 !py-2.5">GitHub ↗</Ring></div>
            </div>
          </motion.article>
        ))}
      </div>
    </Wrap>
  );
}

/* ---------- skills (parallax) ---------- */
function Skills() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || innerWidth < 768) return;
    const c = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => gsap.to(el, { y: -Number(el.dataset.speed) * 70, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }));
    }, root); return () => c.revert();
  }, []);
  return (
    <Wrap id="skills" className="overflow-hidden">
      <Header eyebrow="Skills & Tools" sub="The stack behind my software, cryptography, and ICS security work.">Technical <em>stack</em></Header>
      <div ref={root} className="grid md:grid-cols-6 gap-5 md:pb-24">
        {SKILLS.map((s, i) => (
          <div key={s.g} data-speed={s.s} className={`${i < 3 ? "md:col-span-2" : "md:col-span-3"} ${i % 2 ? "md:mt-16" : ""} relative rounded-3xl border border-stroke bg-surface/60 backdrop-blur-md p-6 overflow-hidden`}>
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #89AACC 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
            <h3 className="relative font-display text-2xl mb-4">{s.g}</h3>
            <ul className="relative flex flex-wrap gap-2">{s.t.map((t, k) => <li key={t} style={{ animation: `float ${3 + (k % 3)}s ease-in-out ${k * 0.2}s infinite` }} className="text-xs sm:text-sm border border-stroke bg-bg/70 rounded-full px-3 py-1.5 hover:border-[#4E85BF] transition-colors">{t}</li>)}</ul>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

/* ---------- education + stats ---------- */
function Education() {
  const items = [
    ["B.Tech, CSE — AI & Data Science", "Indian Institute of Information Technology, Senapati Manipur (IIITM)", "Nov 2022 – May 2026", "Cumulative CGPA: 8.66 / 10"],
    ["All India Senior School Certificate (Class XII)", "Saraswati Vidya Mandir Sr. Secondary School, Meham, Rohtak", "Apr 2019 – Mar 2020", "Score: 94.2%"],
  ];
  const ach = [
    "Ranked 1st in department in Year 1, earning a merit-based branch change from ECE (VLSI) to CSE (AI & DS).",
    "Lead, Qurbat Poetry Club (IIIT Senapati): mentored 50+ students and organized poetry workshops and campus events.",
    "Public Relations Co-Lead, Techfest Ahouba 2.0 (IIIT Senapati): led digital outreach and artist onboarding, driving 5,000+ event engagements.",
  ];
  return (
    <Wrap id="education">
      <Header eyebrow="Education">Learning & <em>leadership</em></Header>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">{items.map((e) => (
          <div key={e[0]} className="rounded-3xl border border-stroke bg-surface p-6"><h3 className="font-display text-2xl">{e[0]}</h3><p className="text-sm text-muted mt-1">{e[1]}</p><p className="text-xs text-muted mt-1">{e[2]}</p><p className="text-sm mt-3">{e[3]}</p></div>))}</div>
        <div className="rounded-3xl border border-stroke bg-surface p-6"><h3 className="font-display text-2xl mb-3">Achievements</h3><ul className="space-y-3 text-sm text-text-primary/80 list-disc pl-5">{ach.map((a) => <li key={a}>{a}</li>)}</ul></div>
      </div>
      <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((s) => <div key={s.l} className="border-t border-stroke pt-5"><p className="text-5xl md:text-6xl font-display">{s.v}</p><p className="text-xs text-muted mt-2 max-w-[22ch]">{s.l}</p></div>)}
      </div>
    </Wrap>
  );
}

/* ---------- contact ---------- */
function Contact() {
  const m = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = gsap.to(m.current, { xPercent: -50, duration: 40, ease: "none", repeat: -1 }); return () => { t.kill(); };
  }, []);
  return (
    <section id="contact" className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">
      <VideoBg flip dim="bg-black/60" />
      <div className="relative z-10">
        <div className="overflow-hidden mb-14" aria-hidden><div ref={m} className="flex whitespace-nowrap w-max text-6xl md:text-8xl font-display italic text-text-primary/15">
          {Array.from({ length: 10 }).map((_, i) => <span key={i} className="pr-8">SECURING THE FUTURE •</span>)}</div></div>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <h2 className="text-4xl md:text-6xl font-display mb-8">Let's build something <em>secure.</em></h2>
          <Ring solid href={`mailto:${LINKS.email}`}>{LINKS.email}</Ring>
          <div className="mt-16 pt-6 border-t border-stroke flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
            <div className="flex gap-6"><a className="hover:text-text-primary" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a className="hover:text-text-primary" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a></div>
            <p className="flex items-center gap-2"><span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" /><span className="relative w-2 h-2 rounded-full bg-green-500" /></span>Open to opportunities</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- loading + app ---------- */
function Loader({ done }: { done: () => void }) {
  const [n, setN] = useState(0); const [w, setW] = useState(0);
  useEffect(() => {
    const s = performance.now(); let raf = 0;
    const tick = (t: number) => { const p = Math.min((t - s) / 2700, 1); setN(Math.round(p * 100)); if (p < 1) raf = requestAnimationFrame(tick); else setTimeout(done, 400); };
    raf = requestAnimationFrame(tick); const iv = setInterval(() => setW((x) => (x + 1) % 3), 900);
    return () => { cancelAnimationFrame(raf); clearInterval(iv); };
  }, [done]);
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[9999] bg-bg">
      <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-8 left-8 text-xs text-muted uppercase tracking-[0.3em]">Portfolio</motion.p>
      <div className="absolute inset-0 flex items-center justify-center"><AnimatePresence mode="wait"><motion.span key={w} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80">{["Secure", "Build", "Research"][w]}</motion.span></AnimatePresence></div>
      <p className="absolute bottom-10 right-8 text-6xl md:text-8xl lg:text-9xl font-display tabular-nums">{String(n).padStart(3, "0")}</p>
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-stroke/50"><div className="h-full accent-gradient origin-left" style={{ transform: `scaleX(${n / 100})`, boxShadow: "0 0 8px rgba(137,170,204,.35)" }} /></div>
    </motion.div>
  );
}
export default function App() {
  const [loading, setLoading] = useState(true);
  return (<>
    <AnimatePresence>{loading && <Loader done={() => setLoading(false)} />}</AnimatePresence>
    <Navbar /><main><Hero /><About /><Experience /><Projects /><Skills /><Education /></main><Contact />
  </>);
}
