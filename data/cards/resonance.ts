import { Card } from "@/lib/srs/types";

export const resonanceCards: Card[] = [
  {
    id: "res-001",
    type: "concept",
    topic: "Resonance",
    front: "What defines resonance in an RLC circuit?",
    back: "The frequency at which the imaginary part of impedance is zero — circuit behaves purely resistively.",
  },
  {
    id: "res-002",
    type: "formula",
    topic: "Resonant Frequency",
    front: "Resonant angular frequency of a series or parallel RLC circuit.",
    back: "$\\omega_0 = \\frac{1}{\\sqrt{LC}}$",
  },
  {
    id: "res-003",
    type: "formula",
    topic: "Quality Factor (series)",
    front: "Quality factor $Q$ of a series RLC circuit.",
    back: "$Q = \\frac{\\omega_0 L}{R} = \\frac{1}{\\omega_0 R C}$",
  },
  {
    id: "res-004",
    type: "formula",
    topic: "Quality Factor (parallel)",
    front: "Quality factor $Q$ of a parallel RLC circuit.",
    back: "$Q = \\frac{R}{\\omega_0 L} = \\omega_0 R C$",
  },
  {
    id: "res-005",
    type: "formula",
    topic: "Bandwidth",
    front: "Bandwidth of a resonant circuit in terms of $\\omega_0$ and $Q$.",
    back: "$\\text{BW} = \\frac{\\omega_0}{Q}$",
  },
  {
    id: "res-006",
    type: "concept",
    topic: "Series vs Parallel",
    front: "At resonance, what is the impedance of a series vs parallel RLC circuit?",
    back: "Series: minimum impedance = $R$ (maximum current). Parallel: maximum impedance (minimum current from source).",
  },
];