import { Card } from "@/lib/srs/types";

export const analysisCards: Card[] = [
  {
    id: "anal-001",
    type: "concept",
    topic: "Nodal Analysis",
    front: "What variables does nodal analysis solve for, and what law is the basis?",
    back: "Solves for node voltages; based on KCL (current balance at each node).",
  },
  {
    id: "anal-002",
    type: "concept",
    topic: "Mesh Analysis",
    front: "What variables does mesh analysis solve for, and what law is the basis?",
    back: "Solves for mesh (loop) currents; based on KVL (voltage balance around each loop).",
  },
  {
    id: "anal-003",
    type: "concept",
    topic: "Superposition",
    front: "State the superposition principle.",
    back: "In a linear circuit, the response due to multiple sources equals the sum of responses to each source acting alone (others deactivated: voltage sources shorted, current sources opened).",
  },
  {
    id: "anal-004",
    type: "concept",
    topic: "Thévenin Equivalent",
    front: "What is the Thévenin equivalent of a linear two-terminal network?",
    back: "A voltage source $V_{Th}$ in series with a resistance $R_{Th}$, equivalent to the network as seen from the two terminals.",
  },
  {
    id: "anal-005",
    type: "concept",
    topic: "Norton Equivalent",
    front: "What is the Norton equivalent of a linear two-terminal network?",
    back: "A current source $I_N$ in parallel with a resistance $R_N$. $I_N = V_{Th}/R_{Th}$ and $R_N = R_{Th}$.",
  },
  {
    id: "anal-006",
    type: "concept",
    topic: "Finding Thévenin Voltage",
    front: "How do you find $V_{Th}$?",
    back: "It is the open-circuit voltage across the two terminals.",
  },
  {
    id: "anal-007",
    type: "concept",
    topic: "Finding Thévenin Resistance",
    front: "Two methods to find $R_{Th}$.",
    back: "1. Deactivate all independent sources, compute resistance looking into terminals. 2. $R_{Th} = V_{oc}/I_{sc}$ (open-circuit voltage divided by short-circuit current).",
  },
  {
    id: "anal-008",
    type: "concept",
    topic: "Max Power Transfer",
    front: "Condition for maximum power transfer to a load from a Thévenin source.",
    back: "$R_L = R_{Th}$. Maximum power delivered: $P_{max} = \\frac{V_{Th}^2}{4 R_{Th}}$",
  },
  {
    id: "anal-009",
    type: "concept",
    topic: "Deactivating Sources",
    front: "How are independent sources deactivated for Thévenin/Norton?",
    back: "Voltage sources are replaced by short circuits; current sources are replaced by open circuits. Dependent sources stay active.",
  },
  {
    id: "anal-010",
    type: "concept",
    topic: "Dependent Sources",
    front: "Four types of dependent sources.",
    back: "VCVS (voltage-controlled voltage source), VCCS (voltage-controlled current source), CCVS (current-controlled voltage source), CCCS (current-controlled current source).",
  },
];