"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ---------------- TYPES ---------------- */

type Q = { id: string; q: string; options: string[] };

type Result = {
  title: string;
  vibe: string;
  roast: string;
  longRead: string[];
  strengths: string[];
  watchouts: string[];
  actions: string[];
  advice: string[];
  mantra: string;
};

type Palette = { name: string; bg: string; chip: string };

/* ---------------- THEMES ---------------- */

const palettes: Palette[] = [
  { name: "Neon Night", bg: "from-fuchsia-600 via-indigo-700 to-cyan-500", chip: "bg-white/15" },
  { name: "Sunset Pop", bg: "from-orange-500 via-pink-600 to-purple-700", chip: "bg-black/20" },
  { name: "Lime Glow", bg: "from-lime-400 via-emerald-600 to-sky-600", chip: "bg-white/15" },
  { name: "Cherry Cola", bg: "from-rose-600 via-red-700 to-slate-900", chip: "bg-white/10" },
  { name: "Ocean Glass", bg: "from-sky-500 via-teal-600 to-indigo-900", chip: "bg-white/10" },
];

/* ---------------- QUESTIONS (3-min flow) ---------------- */

const questions: Q[] = [
  {
    id: "roast",
    q: "If your life had a group chat… what would it roast you for THIS week?",
    options: [
      "Overthinking everything",
      "Procrastinating like it’s cardio",
      "Always tired / burnt out",
      "Acting fine but not fine",
      "Quietly improving (lowkey proud)",
    ],
  },
  {
    id: "avoid",
    q: "What do you keep saying you’ll do… but keep pushing off?",
    options: ["A hard conversation", "Get disciplined", "Start over", "Ask for help", "Commit for real"],
  },
  {
    id: "drain",
    q: "What’s draining you the most right now?",
    options: ["Consistency", "Confidence", "Money stress", "Burnout", "Focus"],
  },
  {
    id: "loop",
    q: "Which loop are you stuck in?",
    options: [
      "All-or-nothing (start big, quit fast)",
      "Overthinking (planning = doing)",
      "People-pleasing (yes to everything)",
      "Dopamine spiral (scroll, snack, avoid)",
      "I’m actually on track (just impatient)",
    ],
  },
  {
    id: "truth",
    q: "Pick the sentence your inner voice keeps replaying:",
    options: [
      "“I’ll lock in tomorrow.”",
      "“I’m tired of this cycle.”",
      "“I need a reset.”",
      "“I feel behind.”",
      "“I’m getting better… slowly.”",
    ],
  },
  {
    id: "sixmo",
    q: "If nothing changed for 6 months… what emotion hits first?",
    options: ["I’m fine", "Annoyed", "Regret", "Panic", "Relief (yikes)"],
  },
];

/* ---------------- RESULTS ---------------- */

const results: Record<string, Result> = {
  spiral: {
    title: "The Funny Spiral",
    vibe: "😂😵‍💫",
    roast: "You’re not lazy — you’re in a committed relationship with ‘tomorrow’.",
    longRead: [
      "You have one of the most dangerous combos: self-awareness + jokes. You can clock the problem instantly… then roast it… then keep living in it. Humor keeps you afloat, but it can also keep you circling instead of landing the plane.",
      "Here’s the truth: your brain is using *thinking* as a safe substitute for *doing*. Planning feels productive. Talking about it feels productive. Imagining the glow-up feels productive. But the only thing that changes your reality is the smallest action you actually complete.",
      "Your power is speed — when you finally move, you move fast. The fix isn’t motivation. It’s friction. Make the first step so small it’s almost embarrassing. Ten minutes. One text. One page. One walk. Your brain needs proof, not promises.",
      "A lot of people in your position are secretly scared of one thing: if you try for real, you can’t blame ‘potential’ anymore. But that’s also where your life opens up. Tonight isn’t about becoming perfect. It’s about becoming *consistent enough* that your future can’t ignore you.",
    ],
    strengths: ["Quick thinker", "Socially sharp", "Resilient under pressure", "Self-aware (rare)"],
    watchouts: ["Avoiding the first hard step", "Turning plans into vibes", "Waiting for the ‘right mood’"],
    actions: [
      "Do 10 minutes of the avoided task (timer on).",
      "Change your environment for 20 minutes.",
      "Text one person: “I’m doing a reset week. Keep me honest.”",
    ],
    advice: [
      "Stop negotiating with yourself. Start tiny and let momentum talk.",
      "Do it slightly scared. That’s the real ‘ready.’",
      "Your life changes when your default changes, not your intentions.",
    ],
    mantra: "If I can joke about it, I can change it.",
  },
  burnout: {
    title: "Burnt-Out Builder",
    vibe: "🔥😮‍💨",
    roast: "You keep ‘pushing through’… and your nervous system is filing a complaint.",
    longRead: [
      "You’ve been surviving on willpower. And you can — you’re tough. But willpower is not a renewable resource. Eventually your body starts collecting payments: sleep problems, irritability, low motivation, numbness, brain fog. That’s not weakness. That’s the bill.",
      "You’re not failing — you’re overloaded. And the scariest part is you’ve probably made exhaustion feel normal. You keep saying “I’ll rest later” like later is a real place you’re going to visit. If you don’t schedule recovery, life schedules it for you.",
      "Your fix is not ‘work harder.’ It’s redesign. Less leaking energy. More boundaries. One protected block of time. One draining thing removed. One system that makes your life easier instead of heavier.",
      "You are not meant to run at 100% forever. The people who win long-term don’t push the hardest — they recover the smartest. Your comeback isn’t dramatic. It’s consistent.",
    ],
    strengths: ["Reliable", "High standards", "Shows up when others don’t", "Built for pressure"],
    watchouts: ["Overcommitting to prove worth", "Ignoring your body", "Saying yes out of guilt"],
    actions: [
      "Do a minimum day: 1 must-do, 1 nice-to-do, everything else = no.",
      "Fuel first (food + water) before you judge your mood.",
      "Say no to ONE draining thing today.",
    ],
    advice: [
      "Rest is not a reward. It’s maintenance.",
      "A boundary isn’t rude — it’s how you stay functional.",
      "You can’t build a new life with an exhausted body.",
    ],
    mantra: "Rest is part of the plan.",
  },
  fake: {
    title: "The ‘I’m Fine’ Phase",
    vibe: "🫠🧍‍♂️",
    roast: "You look stable. Your brain is absolutely not.",
    longRead: [
      "You’re functioning — but it’s the kind of functioning that costs you later. You’re good at showing up, smiling, making it work. Inside? You’re carrying 27 tabs worth of stress and pretending it’s normal.",
      "This phase happens when you’ve trained yourself to be impressive instead of supported. You keep your image steady so you don’t have to feel messy. But the longer you carry it alone, the heavier it gets — and eventually you go numb.",
      "Your next level is honesty with structure. Name the actual problem in one sentence. Then make one small plan that fixes the *real* issue, not just your feelings about it. Feelings follow action more often than we admit.",
      "You don’t need to tell everyone. You just need to stop lying to yourself. Quiet honesty is a superpower.",
    ],
    strengths: ["Composed under pressure", "Resourceful", "Capable", "Gets things done"],
    watchouts: ["Living on autopilot", "Avoiding vulnerability", "Silently carrying everything"],
    actions: [
      "Write the real problem in ONE sentence (no backstory).",
      "Pick ONE change with a 48-hour deadline.",
      "Tell one safe person the short version. No over-explaining.",
    ],
    advice: [
      "Clarity beats coping.",
      "Small systems > big motivation.",
      "You don’t need to be okay for people to love you.",
    ],
    mantra: "I don’t need to impress anyone. I need to improve my life.",
  },
  leveling: {
    title: "The Quiet Upgrade",
    vibe: "📈😌",
    roast: "You’re leveling up silently… and it’s kind of scary (in a good way).",
    longRead: [
      "You’re in the ‘invisible progress’ chapter — where nothing looks dramatic yet, but everything is shifting underneath. Your discipline is getting quieter, and your self-respect is getting louder.",
      "This is the stage where people don’t clap because they don’t see the work. That’s fine. You’re building a life that doesn’t require constant validation.",
      "Your biggest risk is boredom — the urge to shake things up because calm feels unfamiliar. Don’t confuse peace with stagnation. Calm is what progress looks like when it’s stable.",
      "Keep stacking. Results show up late… then show up loud.",
    ],
    strengths: ["Self-led", "Consistent", "Focused", "Not dependent on hype"],
    watchouts: ["Under-crediting yourself", "Isolating too much", "Dropping routines when life gets busy"],
    actions: [
      "Lock one daily habit for 7 days (even 5 minutes).",
      "Cut one distraction that steals your focus (scrolling, late nights).",
      "Track wins daily (proof beats vibes).",
    ],
    advice: [
      "Protect your routines like appointments.",
      "Don’t sabotage quietly built progress with loud distractions.",
      "Keep receipts of your wins for days you forget.",
    ],
    mantra: "Quiet work. Loud results.",
  },
  restart: {
    title: "Restart Season",
    vibe: "🔁✨",
    roast: "You’re not starting over. You’re starting smarter.",
    longRead: [
      "You’re in the in-between chapter. Things feel undefined — which is scary — but it also means you’re not trapped. Undefined is where options live.",
      "You’ve survived every reset you’ve ever had. That’s proof you’re adaptable. The only thing you need now is direction, not perfection.",
      "A restart works when it becomes daily behavior, not a mood. You don’t need a life overhaul. You need a small set of rules you follow even on your worst day.",
      "Pick a north star for one week. Then do actions that match it. That’s how you build a new chapter with receipts.",
    ],
    strengths: ["Adaptable", "Brave enough to change", "Learns from mistakes", "Bounces back"],
    watchouts: ["Overthinking the perfect plan", "Quitting too early", "Letting fear pick for you"],
    actions: [
      "Choose a 7-day north star (money, health, school, peace).",
      "Do ONE action today that matches it.",
      "Remove ONE thing that keeps you looping.",
    ],
    advice: ["Direction > perfection.", "Start messy.", "Repeat the decision daily."],
    mantra: "New chapter. Same me — smarter.",
  },
};

const scienceSnacks = [
  {
    title: "Habit reality",
    text: "Habits don’t “lock in” in 21 days for most people — consistency usually takes longer and varies a lot by behavior.",
  },
  {
    title: "Attention residue",
    text: "When you switch tasks fast, part of your brain stays stuck on the previous thing — so the next thing feels harder than it should.",
  },
  {
    title: "Open loops",
    text: "Unfinished tasks stay louder in your brain than finished ones. Starting for 5 minutes can make returning easier.",
  },
] as const;

const hypeLines = [
  "This read is lowkey too accurate.",
  "Screenshot this before it reads you again.",
  "If you feel attacked, it’s working.",
  "Not a test… but it’s kinda a test.",
  "This is your sign. Yeah, yours.",
] as const;

const compliments = [
  "You have ‘main character with receipts’ energy.",
  "You’re sharper than you think — you just need consistency to match it.",
  "You’ve been surviving. Now it’s time to start building.",
  "You’re not behind — you’re buffering. But the download is almost done.",
  "You’re closer than it feels. Don’t fold on the last stretch.",
] as const;

/* ---------------- HASH / PICKERS (unique per person) ---------------- */

function djb2(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) hash = (hash * 33) ^ str.charCodeAt(i);
  return hash >>> 0;
}

function pick<T>(arr: readonly T[], seed: number, offset: number) {
  return arr[(seed + offset) % arr.length];
}

function scoreResultKey(answers: string[]) {
  const a = answers.join(" | ");
  if (a.includes("Overthinking") || a.includes("Procrastinating")) return "spiral";
  if (a.includes("Burnout") || a.includes("tired") || a.includes("Burnt")) return "burnout";
  if (a.includes("Acting fine") || a.includes("Confidence")) return "fake";
  if (a.includes("improving") || a.includes("proud")) return "leveling";
  if (a.includes("Starting over") || a.includes("reset") || a.includes("Reset")) return "restart";
  return "restart";
}

function focusLabel(score: number) {
  if (score >= 85) return "Locked in";
  if (score >= 70) return "Dialed";
  if (score >= 50) return "Chaotic neutral";
  if (score >= 30) return "Distracted but hopeful";
  return "Gremlin mode";
}

function perceptionFact(score: number) {
  if (score >= 85) return "People read steady focus as confidence — even if you barely speak.";
  if (score >= 70) return "Consistent focus reads as competence more than being loud does.";
  if (score >= 50) return "Frequent switching can make days feel like they disappear (context-loading).";
  if (score >= 30) return "One early win can ‘prime’ your attention for the rest of the day.";
  return "Low focus doesn’t mean low ability — it usually means overload, not laziness.";
}

function modeName(resultKey: string, focusScore: number | null) {
  const focus =
    focusScore == null ? "" : focusScore >= 70 ? "(Focused Edition)" : focusScore <= 40 ? "(Chaotic Edition)" : "";
  const base = {
    spiral: "Comedy Coping Mode",
    burnout: "Overdrive Mode",
    fake: "‘I’m Fine’ Mode",
    leveling: "Stealth Upgrade Mode",
    restart: "Reset Mode",
  }[resultKey as keyof typeof results];
  return `${base} ${focus}`.trim();
}

/* ---------------- CUTE CARTOON MASCOTS (SVG) ---------------- */

function Mascot({ kind }: { kind: "spark" | "doom" | "sage" }) {
  // simple “cartoon sticker” vibe (pure SVG, no assets)
  if (kind === "spark") {
    return (
      <svg viewBox="0 0 180 120" className="w-36 h-auto drop-shadow">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="0.9" />
            <stop offset="1" stopColor="white" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d="M40 95c-12-8-18-18-18-32 0-22 18-40 40-40 10 0 19 3 26 9 8-10 20-16 34-16 24 0 44 20 44 44 0 24-20 44-44 44H62c-9 0-16-3-22-9z" fill="url(#g1)" />
        <circle cx="72" cy="62" r="6" fill="white" />
        <circle cx="108" cy="62" r="6" fill="white" />
        <path d="M77 78c10 10 22 10 32 0" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M145 30l6 10 12 2-10 7 2 12-10-6-10 6 2-12-10-7 12-2z" fill="white" opacity="0.8" />
      </svg>
    );
  }
  if (kind === "doom") {
    return (
      <svg viewBox="0 0 180 120" className="w-36 h-auto drop-shadow">
        <path d="M52 98c-22 0-40-18-40-40s18-40 40-40h76c22 0 40 18 40 40s-18 40-40 40H52z" fill="rgba(0,0,0,0.25)" />
        <circle cx="78" cy="60" r="6" fill="white" />
        <circle cx="116" cy="60" r="6" fill="white" />
        <path d="M78 82c10-10 34-10 44 0" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M30 34c6-10 16-16 28-16" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 180 120" className="w-36 h-auto drop-shadow">
      <path d="M40 95c-16-10-24-24-24-40 0-26 22-48 48-48 12 0 24 4 32 12 10-10 22-16 38-16 28 0 50 22 50 50 0 22-14 40-34 46-6 2-12 2-18 2H74c-14 0-26-4-34-10z" fill="rgba(255,255,255,0.18)" />
      <circle cx="74" cy="60" r="6" fill="white" />
      <circle cx="112" cy="60" r="6" fill="white" />
      <path d="M80 78c8 8 18 8 26 0" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M60 30h60" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

/* ---------------- PAGE ---------------- */

export default function Page() {
  const TOTAL_SECONDS = 180; // 3 minutes
  const GAME_SECONDS = 8;

  // theme: hydration-safe + persists
  const [paletteIndex, setPaletteIndex] = useState(0);
  const palette = palettes[paletteIndex];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mirror_palette_v2");
      if (saved) {
        const idx = Number(saved);
        if (!Number.isNaN(idx)) setPaletteIndex(Math.max(0, Math.min(palettes.length - 1, idx)));
      } else {
        const idx = Math.floor(Math.random() * palettes.length);
        setPaletteIndex(idx);
        localStorage.setItem("mirror_palette_v2", String(idx));
      }
    } catch {
      // ignore
    }
  }, []);

  const [screen, setScreen] = useState<"intro" | "quiz" | "game" | "done">("intro");
  const [nickname, setNickname] = useState("");

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  // mini-game
  const [gameLeft, setGameLeft] = useState(GAME_SECONDS);
  const [needle, setNeedle] = useState(0.5);
  const [focusScore, setFocusScore] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // countdown
  useEffect(() => {
    if (screen !== "quiz") return;
    if (step >= questions.length) {
      setScreen("done");
      return;
    }
    if (secondsLeft <= 0) {
      setStep(questions.length);
      setScreen("done");
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, step, secondsLeft]);

  // game animation
  useEffect(() => {
    if (screen !== "game") return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      setNeedle(0.5 + 0.48 * Math.sin(t * 5.3));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "game") return;
    if (gameLeft <= 0) {
      handleStop();
      return;
    }
    const t = setTimeout(() => setGameLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, gameLeft]);

  const handleAnswer = (answer: string) => {
    setAnswers((a) => [...a, answer]);

    // after Q3 (index 2), do game once
    if (step === 2 && focusScore === null) {
      setStep((s) => s + 1);
      setScreen("game");
      setGameLeft(GAME_SECONDS);
      return;
    }

    setStep((s) => s + 1);
    setSecondsLeft((s) => Math.min(TOTAL_SECONDS, s + 2)); // tiny “bonus seconds” for speed
  };

  const handleStop = () => {
    if (screen !== "game") return;
    const dist = Math.abs(needle - 0.5);
    const raw = Math.max(0, 1 - dist / 0.5);
    const score = Math.round(raw * 100);
    setFocusScore(score);

    setScreen("quiz");
    setSecondsLeft((s) => Math.min(TOTAL_SECONDS, s + 4));
  };

  // unique seed for personalized variation
  const seed = useMemo(() => {
    const base = `${nickname.trim().toLowerCase()}|${answers.join(";")}|${focusScore ?? ""}`;
    return djb2(base || "default");
  }, [nickname, answers, focusScore]);

  const resultKey = useMemo(() => scoreResultKey(answers), [answers]);
  const baseResult = results[resultKey] ?? results.restart;

  // “deep personalization” sprinkling
  const hype = useMemo(() => pick(hypeLines, seed, 3), [seed]);
  const compliment = useMemo(() => pick(compliments, seed, 7), [seed]);
  const science = useMemo(() => pick(scienceSnacks, seed, 11), [seed]);
  const modeTitle = useMemo(() => modeName(resultKey, focusScore), [resultKey, focusScore]);
  const perception = useMemo(() => (focusScore == null ? "" : perceptionFact(focusScore)), [focusScore]);

  const profileCode = useMemo(() => {
    const code = (seed % 0xffffff).toString(16).toUpperCase().padStart(6, "0");
    return `#${code}`;
  }, [seed]);

  const mascotKind = useMemo(() => {
    // pick a mascot based on result + focus (feels “alive”)
    if (resultKey === "burnout") return "doom";
    if (resultKey === "leveling") return "sage";
    return focusScore != null && focusScore >= 70 ? "spark" : "sage";
  }, [resultKey, focusScore]);

  const specialLine = useMemo(() => {
    const name = nickname.trim() ? nickname.trim() : "bestie";
    const a0 = answers[0] ?? "";
    const a1 = answers[1] ?? "";
    const a2 = answers[2] ?? "";
    return `Okay ${name}… because you picked “${a0}”, “${a1}”, and “${a2}”… this is basically your receipt.`;
  }, [nickname, answers]);

  const addOnParagraphs = useMemo(() => {
    const bank = [
      "Your next win won’t come from thinking harder. It comes from making the ‘good choice’ easier to start and the ‘bad choice’ annoying to repeat.",
      "You don’t need more inspiration — you need fewer leaks. Sleep, scrolling, people-pleasing, and messy routines are all energy taxes.",
      "Confidence isn’t a personality trait. It’s the result of showing yourself receipts. One promise kept is worth 20 plans.",
      "If you’ve been feeling stuck, it’s usually because you keep restarting mentally but not physically. Move first, then think.",
      "The fastest glow-ups aren’t loud. They’re boring and consistent. That’s why most people don’t do them.",
      "Your life will look different once you stop needing everyone to understand your choices.",
    ];
    return [pick(bank, seed, 1), pick(bank, seed, 5)];
  }, [seed]);

  const focusText = useMemo(() => {
    if (focusScore == null) return "";
    return `${focusScore}/100 (${focusLabel(focusScore)})`;
  }, [focusScore]);

  const shareText = useMemo(() => {
    const link = typeof window !== "undefined" ? window.location.href : "";
    const name = nickname.trim() ? nickname.trim() : "me";
    return `I did the 3-minute reality check and got: ${baseResult.title} ${baseResult.vibe}
Mode: ${modeTitle} ${profileCode}
Reality check: ${baseResult.roast}
Focus Meter: ${focusText || "N/A"}

Take it: ${link}`;
  }, [nickname, baseResult, modeTitle, profileCode, focusText]);

  const progress = `${Math.min(step + 1, questions.length)}/${questions.length}`;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${palette.bg} text-white relative overflow-hidden`}>
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-black/20 blur-3xl" />

      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-white/90 font-semibold">3-minute reality check</div>
            <div className="text-sm text-white/85">
              {screen === "quiz" ? `⏱ ${step < questions.length ? `${secondsLeft}s` : "Done"}` : screen === "game" ? `🎯 ${gameLeft}s` : ""}
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className={`text-xs px-3 py-1 rounded-full border border-white/20 ${palette.chip}`}>
                Theme: {palette.name}
              </div>
              <button
                onClick={() => {
                  const next = (paletteIndex + 1) % palettes.length;
                  setPaletteIndex(next);
                  try {
                    localStorage.setItem("mirror_palette_v2", String(next));
                  } catch {}
                }}
                className={`text-xs px-3 py-1 rounded-full border border-white/20 ${palette.chip} hover:opacity-90`}
              >
                Change theme 🎨
              </button>
            </div>

            {/* INTRO */}
            {screen === "intro" && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-3xl font-black tracking-tight">Not a survey.</div>
                    <div className="mt-2 text-white/90 leading-relaxed">
                      It’s a 3-minute experience: quick choices + a tiny game + a result you’ll want to screenshot.
                    </div>
                    <div className="mt-3 text-white/85 text-sm">{hype}</div>
                  </div>
                  <Mascot kind="spark" />
                </div>

                <div className="mt-5 rounded-3xl bg-black/20 border border-white/15 p-5">
                  <div className="text-sm font-bold">Optional: drop a nickname</div>
                  <div className="text-sm text-white/80">(So your result feels like it was written for you.)</div>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g., Jaden / Jay / bestie"
                    className="mt-3 w-full rounded-2xl bg-black/25 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 outline-none"
                  />

                  <button
                    onClick={() => {
                      setScreen("quiz");
                      setSecondsLeft(TOTAL_SECONDS);
                      setStep(0);
                      setAnswers([]);
                      setFocusScore(null);
                      setGameLeft(GAME_SECONDS);
                    }}
                    className="mt-4 w-full rounded-2xl bg-white text-black font-extrabold px-4 py-3 hover:opacity-95"
                  >
                    Start → (3 minutes)
                  </button>

                  <div className="mt-3 text-center text-xs text-white/70">No login. No email. No saving your answers.</div>
                </div>
              </>
            )}

            {/* QUIZ */}
            {screen === "quiz" && step < questions.length && (
              <>
                <div className="text-xs text-white/75 mb-2">Tap fast. Don’t overthink. ✋</div>

                <div className="rounded-3xl bg-black/20 border border-white/15 p-5">
                  <div className="text-2xl font-extrabold tracking-tight whitespace-pre-line">{questions[step].q}</div>
                </div>

                <div className="mt-4 grid gap-3">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="group w-full text-left rounded-2xl border border-white/20 bg-black/25 hover:bg-black/35 active:scale-[0.99] transition px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{opt}</span>
                        <span className="text-white/70 group-hover:text-white">→</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-5 h-2 w-full rounded-full bg-black/20 overflow-hidden">
                  <div className="h-full rounded-full bg-white/70" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-white/75">
                  <span>✨ {hype}</span>
                  <span>{progress}</span>
                </div>
              </>
            )}

            {/* GAME */}
            {screen === "game" && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-2xl font-extrabold">Mini-game: Focus Meter 🎯</div>
                    <div className="mt-1 text-white/90">
                      Stop the needle as close to center as possible. Your score changes your “perception” section at the end.
                    </div>
                    <div className="mt-2 text-white/80 text-sm">{science.title}: {science.text}</div>
                  </div>
                  <Mascot kind="sage" />
                </div>

                <div className="mt-5 rounded-3xl bg-black/25 border border-white/15 p-5">
                  <div className="text-xs text-white/75 mb-2">Center = best. Don’t panic.</div>
                  <div className="relative h-4 rounded-full bg-black/35 overflow-hidden">
                    <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-white/70" />
                    <div
                      className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white"
                      style={{ left: `calc(${needle * 100}% - 12px)` }}
                    />
                  </div>

                  <button
                    onClick={handleStop}
                    className="mt-4 w-full rounded-2xl bg-white text-black font-extrabold px-4 py-3 hover:opacity-95"
                  >
                    STOP ✋
                  </button>

                  <div className="mt-3 text-center text-xs text-white/75">Time left: {gameLeft}s</div>
                </div>
              </>
            )}

            {/* DONE */}
            {(screen === "done" || step >= questions.length) && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="text-center sm:text-left w-full">
                    <div className="text-4xl font-black">{baseResult.title}</div>
                    <div className="mt-1 text-2xl">{baseResult.vibe}</div>
                    <div className="mt-2 text-sm text-white/85">{specialLine}</div>
                    <div className="mt-2 text-xs text-white/70">Mode: {modeTitle} • Profile: {profileCode}</div>
                  </div>
                  <Mascot kind={mascotKind} />
                </div>

                <div className="mt-5 rounded-2xl bg-black/25 border border-white/15 p-4 text-left">
                  <div className="text-xs font-bold text-white/80">A message for you</div>
                  <div className="mt-1 text-sm text-white/90">{compliment}</div>
                </div>

                <div className="mt-4 rounded-2xl bg-black/25 border border-white/15 p-4 text-left">
                  <div className="text-xs font-bold text-white/80">Reality check</div>
                  <div className="mt-1 text-base font-extrabold">{baseResult.roast}</div>
                </div>

                <div className="mt-4 space-y-3 text-white/90 leading-relaxed">
                  {baseResult.longRead.map((p) => <p key={p}>{p}</p>)}
                  {addOnParagraphs.map((p) => <p key={p}>{p}</p>)}
                </div>

                <div className="mt-6 grid gap-4">
                  {focusScore !== null && (
                    <div className="rounded-2xl bg-black/20 border border-white/15 p-4">
                      <div className="text-sm font-bold">Your Focus Meter</div>
                      <div className="mt-1 text-2xl font-extrabold">{focusText}</div>
                      <div className="mt-2 text-sm text-white/85">Perception: {perception}</div>
                      <div className="mt-2 text-sm text-white/85">
                        Quick calc: closeness to center → score. (You stopped {Math.round(Math.abs(needle - 0.5) * 200)}% away from center.)
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl bg-black/20 border border-white/15 p-4">
                    <div className="text-sm font-bold">Your strengths</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {baseResult.strengths.map((s) => (
                        <span key={s} className="text-xs px-3 py-1 rounded-full bg-white/15 border border-white/15">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-black/20 border border-white/15 p-4">
                    <div className="text-sm font-bold">Your watch-outs</div>
                    <ul className="mt-2 space-y-2 text-sm text-white/90">
                      {baseResult.watchouts.map((s) => (
                        <li key={s} className="flex gap-2">
                          <span className="mt-[2px]">⚠️</span>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-black/20 border border-white/15 p-4">
                    <div className="text-sm font-bold">Do this today</div>
                    <ul className="mt-2 space-y-2 text-sm text-white/90">
                      {baseResult.actions.map((s) => (
                        <li key={s} className="flex gap-2">
                          <span className="mt-[2px]">✅</span>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-black/20 border border-white/15 p-4">
                    <div className="text-sm font-bold">Advice that actually helps</div>
                    <ul className="mt-2 space-y-2 text-sm text-white/90">
                      {baseResult.advice.map((s) => (
                        <li key={s} className="flex gap-2">
                          <span className="mt-[2px]">🧠</span>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-white/15 border border-white/15 p-4 text-center">
                    <div className="text-sm font-bold">Screenshot line</div>
                    <div className="mt-1 text-base font-semibold">“{baseResult.mantra}”</div>
                  </div>

                  <div className="grid gap-3">
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(shareText);
                        alert("Copied. Screenshot your result & post it 🔥");
                      }}
                      className="w-full rounded-2xl bg-white text-black font-extrabold px-4 py-3 hover:opacity-95"
                    >
                      Copy share text
                    </button>

                    <button
                      onClick={() => {
                        setScreen("intro");
                        setStep(0);
                        setAnswers([]);
                        setSecondsLeft(TOTAL_SECONDS);
                        setFocusScore(null);
                        setGameLeft(GAME_SECONDS);
                      }}
                      className="w-full rounded-2xl border border-white/25 bg-black/20 px-4 py-3 font-semibold hover:bg-black/30"
                    >
                      Try again
                    </button>

                    <div className="text-center text-xs text-white/75">Post it with “what did y’all get?” and watch the replies.</div>
                    <div className="text-center text-[11px] text-white/65">Note: vibe-check tool, not a diagnosis.</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 text-center text-xs text-white/80">Built for screenshots. Built for group chats.</div>
        </div>
      </div>
    </div>
  );
}

