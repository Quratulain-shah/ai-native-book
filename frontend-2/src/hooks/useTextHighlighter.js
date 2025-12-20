// src/hooks/useTextHighlighter.js
import { useState, useEffect, useCallback } from "react";
import { useHighlight } from "../contexts/HighlightContext";

export const useTextHighlighter = () => {
  const { state, dispatch } = useHighlight();
  const [currentSelection, setCurrentSelection] = useState(null);
  const [currentPagePath, setCurrentPagePath] = useState("");

  // Get current page path and load highlights
  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPagePath(path);

    const savedHighlights = localStorage.getItem(`highlights_${path}`);
    if (savedHighlights) {
      try {
        const parsedHighlights = JSON.parse(savedHighlights);
        dispatch({
          type: "SET_HIGHLIGHTS",
          highlights: { [path]: parsedHighlights },
        });
      } catch (error) {
        console.error("Error loading highlights from localStorage:", error);
      }
    }
  }, []);

  // Save highlights to localStorage when they change
  useEffect(() => {
    if (currentPagePath && state.highlights[currentPagePath]) {
      try {
        localStorage.setItem(
          `highlights_${currentPagePath}`,
          JSON.stringify(state.highlights[currentPagePath])
        );
      } catch (error) {
        console.error("Error saving highlights to localStorage:", error);
      }
    }
  }, [state.highlights, currentPagePath]);

  // Calculate range info for persistence
  const calculateRangeInfo = useCallback((range) => {
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    const endContainer = range.endContainer;
    const endOffset = range.endOffset;
    const textContent = range.toString().trim();

    const rangeInfo = {
      startContainerInfo: {
        nodeType: startContainer.nodeType,
        nodeValue: startContainer.nodeValue
          ? startContainer.nodeValue.slice(0, 50)
          : null,
        parentElementTag: startContainer.parentElement
          ? startContainer.parentElement.tagName
          : null,
        parentElementId: startContainer.parentElement
          ? startContainer.parentElement.id
          : null,
        parentElementClass: startContainer.parentElement
          ? startContainer.parentElement.className
          : null,
      },
      startOffset: startOffset,
      endContainerInfo: {
        nodeType: endContainer.nodeType,
        nodeValue: endContainer.nodeValue
          ? endContainer.nodeValue.slice(0, 50)
          : null,
        parentElementTag: endContainer.parentElement
          ? endContainer.parentElement.tagName
          : null,
        parentElementId: endContainer.parentElement
          ? endContainer.parentElement.id
          : null,
        parentElementClass: endContainer.parentElement
          ? endContainer.parentElement.className
          : null,
      },
      endOffset: endOffset,
      textContent: textContent,
    };

    const rangeId = `${rangeInfo.startContainerInfo.nodeType}-${
      rangeInfo.startContainerInfo.nodeValue || "element"
    }-${startOffset}-${endOffset}-${textContent.slice(0, 30)}`;
    return {
      id: btoa(encodeURIComponent(rangeId)).replace(/[+/=]/g, "_"),
      info: rangeInfo,
    };
  }, []);

  // Handle text selection
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === "") {
      setCurrentSelection(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();

    if (selectedText) {
      const commonAncestor = range.commonAncestorContainer;
      const codeElement = commonAncestor.closest?.(
        "code, pre, .code-block, .prism-code, .docusaurus-code-block"
      );

      if (codeElement) {
        setCurrentSelection(null);
        return;
      }

      const rangeInfo = calculateRangeInfo(range);
      const rect = range.getBoundingClientRect();

      setCurrentSelection({
        text: selectedText,
        id: rangeInfo.id,
        rangeInfo: rangeInfo.info,
        rect: rect,
      });
    }
  }, [calculateRangeInfo]);

  // Add highlight to state and localStorage
  const addHighlight = useCallback(
    (color) => {
      if (!currentSelection) return;

      const highlight = {
        id: currentSelection.id,
        text: currentSelection.text,
        color: color,
        rangeInfo: currentSelection.rangeInfo,
        createdAt: new Date().toISOString(),
      };

      dispatch({
        type: "ADD_HIGHLIGHT",
        pagePath: currentPagePath,
        highlight: highlight,
      });

      setCurrentSelection(null);
      window.getSelection().removeAllRanges();
    },
    [currentSelection, currentPagePath, dispatch]
  );

  // 🔥 CRITICAL: Attach global mouseup listener HERE
  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(handleTextSelection, 0);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleTextSelection]); // Re-attach if handler changes

  return {
    currentSelection,
    handleTextSelection,
    addHighlight,
    highlights: state.highlights[currentPagePath] || [],
    currentPagePath,
  };
};
