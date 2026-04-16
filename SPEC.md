# Ellära Study Hub — Specification

**Author:** Maarvinsho
**Course:** KTH IF1330 — Electrical Principles (Ellära), 7.5 hp
**Timeline:** 38 days to exam
**Repo:** github.com/Maarvinsho/ellara-study-hub
**Live:** ellara-study-hub.vercel.app

---

## 1. Problem Statement

Preparing for the IF1330 tenta requires repeated practice across four distinct activities: memorizing formulas and definitions, understanding transient behavior, solving circuits analytically, and working exam-style problems. Existing tools address these in isolation. This project unifies them into one focused, course-aligned study environment — built by the student, for the student — and doubles as a portfolio piece demonstrating full-stack development, applied linear algebra, and spec-driven workflow.

## 2. Goals & Non-Goals

### Goals
- Pass the IF1330 tenta (primary success metric).
- Produce a portfolio-grade project demonstrating full-stack development, applied math, and disciplined engineering process.
- Stay on free-tier hosting with zero backend maintenance.

### Non-Goals
- Not a replacement for SPICE, LTspice, or professional simulators.
- Not a general EE learning platform — strictly scoped to IF1330 syllabus.
- No accounts, no multi-user features, no cloud sync.
- No coverage of lab content (LAB1) — focus is TEN1 theory only.

## 3. Target User

Single user (the author), on desktop, studying from lecture notes and past tentor. English UI.

## 4. Scope — IF1330 Syllabus Coverage

### In Scope
- Charge, voltage, current, power, energy
- Electric and magnetic fields (conceptual, flashcards only)
- Kirchhoff's laws and Ohm's law
- Passive components: R, L, C
- Ideal transformer (turns ratio, impedance reflection)
- DC and AC analysis
- Independent and dependent sources (CCCS, CCVS, VCCS, VCVS)
- Mesh analysis and nodal analysis
- Superposition
- Thévenin and Norton equivalents
- Transient responses in RC and RL networks
- RLC networks and resonance using the complex (phasor) method

### Out of Scope
- Three-phase systems
- Non-ideal transformers
- Transistor and diode non-linear analysis (follow-up course IE1202)
- Deep op-amp analysis (IE1202)
- Lab/measurement content (LAB1)

## 5. Modules

### 5.1 Review — Flashcards
- Spaced repetition using SM-2 algorithm
- Card types: formula, concept, unit conversion
- LaTeX rendering via KaTeX
- Progress stored in localStorage
- Import/export cards as JSON
- Seed set: ~60 cards covering full IF1330 syllabus

### 5.2 Simulate — Transient & Frequency Response
- Circuit types: RC, RL, series RLC, parallel RLC
- Inputs: component values, source voltage, initial conditions
- Outputs: v(t), i(t) plots over selectable time range
- Closed-form analytical solutions (no numerical ODE solver needed)
- Step response vs natural response toggle
- RLC frequency sweep showing resonance peak
- Impedance-vs-frequency plot (Bode-style magnitude)

### 5.3 Solve — Circuit Analysis
- **Phase 1 (DC, resistive):** nodal analysis, mesh analysis, superposition walkthrough, Thévenin/Norton equivalents
- **Phase 2 (AC steady-state):** complex impedances, phasor analysis, same methods as DC
- Support for dependent sources (CCCS, CCVS, VCCS, VCVS)
- Input: form-based node-and-branch editor (no drag-drop graphical editor in v1)
- Output: all node voltages and branch currents as a table
- Uses math.js for matrix operations

### 5.4 Practice — Problem Generator
- 5–10 circuit templates covering key IF1330 problem types
- Randomized component values on each generation
- Reuses the Solve module for ground-truth answers
- Step-by-step solutions on demand
- Tracks which templates have been practiced

## 6. Tech Stack

| Layer | Choice |
|------|--------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Math | math.js (matrices, complex numbers) |
| Plots | Recharts |
| LaTeX | KaTeX |
| Storage | localStorage only |
| Hosting | Vercel (free tier) |
| License | MIT |

## 7. Architecture

Single Next.js app, client-side only. Four routes:

- `/review` — Flashcards
- `/simulate` — Transient & frequency response
- `/solve` — Circuit analysis
- `/practice` — Problem generator

Shared utilities in `/lib`:
- `/lib/solver` — nodal & mesh analysis, matrix building
- `/lib/srs` — SM-2 algorithm
- `/lib/templates` — problem generator templates
- `/lib/components` — shared React components

No API routes in v1.

## 8. Timeline — 38 Days

| Phase | Days | Deliverable | Study Value |
|-------|------|-------------|-------------|
| 1 | 1–7 | Repo scaffolded, deployed, Flashcards live with 30+ cards | Start SRS immediately |
| 2 | 8–14 | RC/RL/RLC simulator with interactive plots | Master transient analysis |
| 3 | 15–23 | DC solver: nodal, mesh, superposition, Thévenin/Norton | Master core analysis methods |
| 4 | 24–29 | AC solver + problem generator | Master phasors + exam patterns |
| 5 | 30–33 | Polish, README, screenshots, recorded GIFs | Past-exam grinding begins |
| 6 | 34–38 | No coding — pure studying with the tool + past tentor | Exam prep |

## 9. Success Criteria

- Pass the tenta (primary)
- All four modules functional by end of Phase 4 (Day 29)
- Repo has README with live demo link, architecture notes, and one GIF per module
- TypeScript strict mode, ESLint clean
- Components under 200 lines each

## 10. Resume Line

> **Ellära Study Hub** — Built a full-stack web app (Next.js, TypeScript, math.js) featuring an interactive DC/AC circuit solver using nodal and mesh analysis with support for dependent sources, RLC transient and frequency-response simulator, auto-generated practice problems, and spaced-repetition flashcards. Spec-driven development with 38-day timeline. Deployed on Vercel.

---

*This spec is the source of truth. Any scope changes require updating this document first.*
