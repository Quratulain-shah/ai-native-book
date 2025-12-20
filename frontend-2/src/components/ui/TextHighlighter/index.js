
import React from "react";
import { useTextHighlighter } from "../../../hooks/useTextHighlighter";
import { motion, AnimatePresence } from "framer-motion";

const TextHighlighter = () => {
  const { currentSelection, addHighlight } = useTextHighlighter();

  // Calculate position for the highlighter pill
  const getPositionStyles = () => {
    if (!currentSelection || !currentSelection.rect) return {};

    const rect = currentSelection.rect;
    const top = rect.top + window.scrollY - 60;
    const left = rect.left + window.scrollX + rect.width / 2 - 80;

    return {
      top: `${top}px`,
      left: `${left}px`,
      position: "fixed",
      zIndex: 10000,
    };
  };

  const highlightColors = [
    {
      name: "Important",
      color: "yellow",
      cssColor: "#FFD700",
      label: "!",
      glowColor: "0 0 10px #FFD700, 0 0 20px #FFD700",
    },
    {
      name: "Definition",
      color: "blue",
      cssColor: "#00BFFF",
      label: "D",
      glowColor: "0 0 10px #00BFFF, 0 0 20px #00BFFF",
    },
    {
      name: "Revision",
      color: "green",
      cssColor: "#32CD32",
      label: "R",
      glowColor: "0 0 10px #32CD32, 0 0 20px #32CD32",
    },
    {
      name: "Question",
      color: "pink",
      cssColor: "#FF69B4",
      label: "?",
      glowColor: "0 0 10px #FF69B4, 0 0 20px #FF69B4",
    },
  ];

  // 🔥 Removed: global mouseup listener — now handled by hook

  return (
    <AnimatePresence>
      {currentSelection && (
        <motion.div
          style={getPositionStyles()}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-highlighter-container"
        >
          <div
            className="text-highlighter-pill"
            style={{
              background: "rgba(34, 34, 34, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0, 255, 255, 0.3)",
              borderRadius: "8px",
              padding: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              className="highlight-buttons"
              style={{ display: "flex", gap: "4px" }}
            >
              {highlightColors.map((highlightColor) => (
                <button
                  key={highlightColor.color}
                  className={`highlight-button highlight-button-${highlightColor.color}`}
                  style={{
                    backgroundColor: highlightColor.cssColor,
                    color: highlightColor.color === "yellow" ? "#000" : "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "4px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    transition: "all 0.2s ease",
                    boxShadow: highlightColor.glowColor,
                    textShadow:
                      highlightColor.color === "yellow"
                        ? "0 0 2px #000"
                        : "0 0 2px #000",
                  }}
                  onClick={() => addHighlight(highlightColor.color)}
                  aria-label={`Highlight as ${highlightColor.name}`}
                  title={highlightColor.name}
                >
                  {highlightColor.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TextHighlighter;
