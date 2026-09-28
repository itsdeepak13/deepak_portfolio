export const LINKS = {
  linkedin: "https://www.linkedin.com/in/deepak-sharma-3a7a10257/",
  github: "https://github.com/itsdeepak13",
  email: "deepaksharma786gi@gmail.com",
  resume: "/resume.pdf",
};
export const ROLES = ["Security Researcher", "Developer", "Cryptography Enthusiast", "Poet"];
export const NAV = ["Home", "About", "Experience", "Projects", "Skills", "Education", "Contact"];
export const EXPERIENCE = [
  { org: "Indian Institute of Science (IISc)", role: "Research Intern", date: "Jan 2026 – May 2026", featured: true, points: [
    "Deployed an ICS/OT security testbed using OpenPLC, Raspberry Pi, and Modbus TCP with SPAN port mirroring.",
    "Executed Modbus flooding, TCP SYN, and payload injection attacks to quantify OT service disruption.",
    "Built a custom Python ICS attack suite integrated with multi-IED Conpot honeypots (Modbus, S7Comm, BACnet) for passive threat intelligence capture."] },
  { org: "Adysoft", role: "Software Development Engineer Intern", date: "Dec 2024 – Feb 2025", points: [
    "Built and optimized a PHP-based online billing application with scalable, reusable modules.",
    "Improved application performance and reduced billing cycle errors.",
    "Refactored legacy code with the development team, improving maintainability and user experience."] },
  { org: "Centre for Development of Advanced Computing (CDAC)", role: "Cybersecurity Intern", date: "Jun 2024 – Jul 2024", points: [
    "Designed and applied security measures to strengthen data protection and system reliability.",
    "Partnered with senior engineers to analyze and mitigate active threat vectors, contributing to a 40% reduction in identified vulnerabilities."] },
];
export const PROJECTS = [
  { id: "medi", title: "MediCrypt Lattice", sub: "Medical Image Encryption", span: "md:col-span-7", tech: ["Python", "Flask", "PWLCM", "Lattice Cryptography", "NumPy", "SHA-256"], url: "https://github.com/itsdeepak13/Medicrypt",
    desc: "Hybrid PWLCM–Lattice encryption with chaotic permutation and lattice-based keystream generation. A Flask pipeline handles upload, encryption, decryption, hash validation, and histogram analysis, with lossless recovery." },
  { id: "twit", title: "TwitPersona", sub: "AI Tweet Reply Chrome Extension", span: "md:col-span-5", tech: ["JavaScript", "Chrome Extension APIs", "Google Gemini API"], url: "https://github.com/itsdeepak13/TwitPersona",
    desc: "Generates persona-driven, context-aware tweet replies with the Gemini API. Uses real-time DOM manipulation and Chrome storage for persistent personas and cross-session settings." },
  { id: "enc", title: "EncryptEase", sub: "Secure File Encryption Tool", span: "md:col-span-12", tech: ["C++", "OpenSSL", "File Security"], url: "https://github.com/itsdeepak13/encryptease",
    desc: "File encryption and storage with OpenSSL, SHA-256 password hashing, and Base64 encoding. Includes masked password input, password recovery, and role-based access control across Windows, Linux, and macOS." },
];
export const SKILLS = [
  { g: "Programming", s: 0.5, t: ["Python", "C/C++", "SQL", "PHP", "HTML/XML"] },
  { g: "Frameworks & Libraries", s: 1.2, t: ["Flask", "NumPy", "Pandas", "Matplotlib", "OpenCV", "C++ STL"] },
  { g: "Databases & Tools", s: 0.8, t: ["MySQL", "MongoDB", "Git", "Linux", "Raspberry Pi"] },
  { g: "Cybersecurity & ICS", s: 1.5, t: ["OpenPLC", "Modbus TCP", "Conpot", "S7Comm", "BACnet", "SPAN Port Mirroring", "TCP SYN/Flooding", "Payload Injection"] },
  { g: "Core CS & Analytics", s: 0.6, t: ["Data Structures & Algorithms", "Operating Systems", "OOP", "DBMS", "Computer Networks", "NLP", "Excel"] },
];
export const STATS = [
  { v: "3", l: "Professional / Research Experiences" }, { v: "3", l: "Flagship Projects" },
  { v: "40%", l: "Reported Vulnerability Reduction at CDAC" }, { v: "8.66/10", l: "CGPA" },
];
