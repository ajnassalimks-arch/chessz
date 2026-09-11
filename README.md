# ♟️ ChessZ — 100% Free Core Chess Training Platform

> **"Why Pay ₹1,500/yr For Diamond? Unlimited Training • No Subscription Needed."**  
> Built by FIDE rated coaches at Premier Chess Academy (PCA), Ernakulam.

[![Live Production](https://img.shields.io/badge/Production-Live%20on%20Vercel-emerald)](https://chesszapp.vercel.app/)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-blue.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Framework: Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016-black)](https://nextjs.org/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase%20Free%20Tier-green)](https://supabase.com/)

---

## 🌐 Live URLs & Links
* **Production App:** [https://chesszapp.vercel.app/](https://chesszapp.vercel.app/)
* **GitHub Repository:** [https://github.com/ajnassalimks-arch/chessz](https://github.com/ajnassalimks-arch/chessz)

---

## 💡 The Vision & Disruption Hook
Existing chess platforms cap free users at **3 puzzles per day** and charge ₹1,500 to ₹10,000/year for unlimited training. 

**ChessZ** eliminates this paywall with a Jio-style disruption model:
* **100% Free Core Access:** Unlimited tactical and positional training forever.
* **Zero Paywall & Zero Ads:** Clean, distraction-free mobile training.
* **No Initial Friction:** No forced signup; start playing within 15 seconds.

---

## ⚡ Core Features & User Journey

### 1. 60-Second Onboarding & FIDE Coach Calibration
Instead of asking for confusing rating numbers, players select from 4 rating bands:
* **Tier 1 (Beginner):** Chess.com 400–900 • Lichess 600–1200 (Unrated FIDE)
* **Tier 2 (Advanced Beginner):** Chess.com 900–1200 • Lichess 1200–1500 (Unrated FIDE)
* **Tier 3 (Intermediate):** Chess.com 1200–1600 • Lichess 1500–1850 • ~1400–1650 FIDE
* **Tier 4 (Advanced):** Chess.com 1900+ • Lichess 2100+ • 1700–2000+ FIDE

A rapid 3-question quiz diagnoses their exact cognitive chess leak (*"The 'Free Gift' Habit"*, *"The 'Knight Geometry' Blindspot"*, *"Confirmation Bias in Deep Lines"*), reveals their personal **Golden Rule**, and presents an instant **"Share My Coach Diagnosis 📸"** card for Instagram bio & stories.

### 2. Instant Learning & Opponent Refutation Engine
* **Correct Moves:** Triggers instant victory celebration chimes and a tactical coaching breakdown.
* **Wrong Moves (Cause & Effect):** Instead of just saying "Incorrect", the board pauses for **650ms** and automatically plays the **opponent's punishment move** on the board, followed by a Coach Refutation card explaining why the attempt failed.

### 3. Dual Control & Visual Polish
* **Touchscreen Optimized:** Seamless support for both **Drag-and-Drop** AND **Tap-to-Move**.
* **Piece Selection Glow:** Warm gold border (`#eab308`) highlights the selected piece.
* **Legal Move Dots:** Soft emerald dots for quiet moves, red target rings for capture targets.
* **Hint System:** Highlights the key piece without giving away the exact solution.

### 4. Dual Training Tracks
* **Tactics ⚡:** Forks, pins, skewers, Greek gift sacrifices, back-rank corridor mates, clearance blows.
* **Strategy 🧭:** Positional play, open file control, outposts, pawn chain tension, 7th-rank invasion, and queenside majorities.
* **Dynamic Switcher:** 1-tap toggle immediately loads a relevant puzzle for that track.

### 5. Zero-Latency Audio Synthesizer
* Zero external audio files to download; runs entirely via Web Audio API oscillators.
* Wooden move clicks, deep capture thuds, refutation alarms, and victory arpeggios.
* Header **Mute / Unmute** toggle with `localStorage` preference sync.

### 6. Cloud Sync & Anonymous Persistence
* Works out-of-the-box for guest players using local browser storage.
* Magic Link passwordless authentication via Supabase free tier to sync progress across phones, tablets, and laptops.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Cost |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) | ₹0 / mo |
| **Deployment** | Vercel Global Edge Network (Hobby Plan) | ₹0 / mo |
| **Database & Auth** | Supabase Postgres with Row Level Security (RLS) | ₹0 / mo |
| **Chess Engines** | `chess.js` & `react-chessboard` | ₹0 / mo |
| **Audio** | Web Audio API Synthesizer (Zero-dependency) | ₹0 / mo |
| **Styling** | Tailwind CSS & Lucide React Icons | ₹0 / mo |

---

## 📁 Repository Structure

```
chessz-app/
├── app/
│   ├── layout.tsx         # Root layout with Geist font & metadata
│   ├── page.tsx           # Full interactive 3-screen platform flow
│   └── globals.css        # Tailwind CSS styles & animations
├── lib/
│   ├── puzzles.ts         # 12 calibration hook puzzles + continuous streams
│   ├── sounds.ts          # Zero-dependency Web Audio API synthesizer
│   └── supabase.ts        # Cloud database client & marketplace integration
├── public/                # Static assets & icons
├── scripts/
│   ├── audit-full-system.js   # Automated end-to-end production audit
│   └── validate-puzzles.js    # FEN and move validator with chess.js
├── schema.sql             # Supabase database schema & RLS policies
└── package.json           # Dependencies & build scripts
```

---

## 🚀 Local Development Setup

```bash
# Clone the repository
git clone https://github.com/ajnassalimks-arch/chessz.git
cd chessz/chessz-app

# Install dependencies
npm install

# Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app locally.

---

## ⚖️ License & Attribution
* **Puzzles & Positions:** Powered by open chess datasets including [Lichess.org](https://lichess.org) (licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)).
* **Libraries:** `chess.js` (MIT License, Jeff Hlywa), `react-chessboard` (MIT License, Clariity).
* **Pedagogy:** Diagnostic framework and Golden Rules designed by FIDE Academy certified coaches at Premier Chess Academy (PCA).
