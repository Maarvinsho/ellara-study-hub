"use client";

import { useState } from "react";
import { Circuit, Element } from "./types";

let elementIdCounter = 0;
function nextElementId(prefix: string): string {
  elementIdCounter += 1;
  return `${prefix}${elementIdCounter}`;
}

export interface CircuitEditorState {
  numNodes: number;
  elements: Element[];
}

export function useCircuitEditor(initial?: CircuitEditorState) {
  const [state, setState] = useState<CircuitEditorState>(
    initial ?? { numNodes: 2, elements: [] }
  );

  const addElement = (type: Element["type"]) => {
    const defaults = {
      resistor: { type: "resistor" as const, resistance: 1000 },
      voltageSource: { type: "voltageSource" as const, voltage: 5 },
      currentSource: { type: "currentSource" as const, current: 0.01 },
    };
    const prefix = { resistor: "R", voltageSource: "V", currentSource: "I" }[type];
    const newElement = {
      id: nextElementId(prefix),
      nPlus: 1,
      nMinus: 0,
      ...defaults[type],
    } as Element;
    setState((s) => ({ ...s, elements: [...s.elements, newElement] }));
  };

  const updateElement = (id: string, patch: Partial<Element>) => {
    setState((s) => ({
      ...s,
      elements: s.elements.map((el) =>
        el.id === id ? ({ ...el, ...patch } as Element) : el
      ),
    }));
  };

  const removeElement = (id: string) => {
    setState((s) => ({ ...s, elements: s.elements.filter((el) => el.id !== id) }));
  };

  const addNode = () => {
    setState((s) => ({ ...s, numNodes: s.numNodes + 1 }));
  };

  const removeNode = () => {
    setState((s) => {
      if (s.numNodes <= 2) return s;
      const newNumNodes = s.numNodes - 1;
      const removedNode = s.numNodes - 1;
      // Remove or clamp elements touching the removed node
      const elements = s.elements
        .filter((el) => el.nPlus !== removedNode && el.nMinus !== removedNode)
        .map((el) => el);
      return { numNodes: newNumNodes, elements };
    });
  };

  const reset = () => setState({ numNodes: 2, elements: [] });

  const loadCircuit = (c: Circuit) => {
    setState({ numNodes: c.numNodes, elements: c.elements });
  };

  const circuit: Circuit = {
    numNodes: state.numNodes,
    elements: state.elements,
  };

  return {
    state,
    circuit,
    addElement,
    updateElement,
    removeElement,
    addNode,
    removeNode,
    reset,
    loadCircuit,
  };
}