import { Card } from "@/lib/srs/types";

export const magneticsCards: Card[] = [
  {
    id: "mag-001",
    type: "formula",
    topic: "Ideal Transformer Voltage",
    front: "Voltage ratio of an ideal transformer with turns $N_1$ and $N_2$.",
    back: "$\\frac{V_1}{V_2} = \\frac{N_1}{N_2}$",
  },
  {
    id: "mag-002",
    type: "formula",
    topic: "Ideal Transformer Current",
    front: "Current ratio of an ideal transformer.",
    back: "$\\frac{I_1}{I_2} = \\frac{N_2}{N_1}$",
  },
  {
    id: "mag-003",
    type: "formula",
    topic: "Impedance Reflection",
    front: "Impedance $Z_L$ on the secondary, as seen from the primary.",
    back: "$Z_{in} = \\left(\\frac{N_1}{N_2}\\right)^2 Z_L$",
  },
  {
    id: "mag-004",
    type: "concept",
    topic: "Ideal Transformer",
    front: "Three idealizations of an ideal transformer.",
    back: "No losses (100% efficient), perfect coupling (no leakage flux), infinite primary inductance (no magnetizing current).",
  },
  {
    id: "mag-005",
    type: "formula",
    topic: "Faraday's Law",
    front: "Faraday's law of electromagnetic induction.",
    back: "$\\varepsilon = -\\frac{d\\Phi}{dt}$ (EMF equals negative rate of change of magnetic flux).",
  },
  {
    id: "mag-006",
    type: "concept",
    topic: "Magnetic Flux",
    front: "SI unit of magnetic flux and its definition.",
    back: "Weber (Wb). $1\\,\\text{Wb} = 1\\,\\text{V·s}$",
  },
];