// src/theme/DocItem/index.js
import React, { useEffect } from "react";
import OriginalDocItem from "@theme-original/DocItem";
import TextHighlighter from "@site/src/components/ui/TextHighlighter";
import { useHighlight } from "@site/src/contexts/HighlightContext";

// Function to apply highlights to the document content
const applyHighlights = (highlights) => {
  if (!highlights || highlights.length === 0) return;

  // Clear existing highlights first
  clearExistingHighlights();

  highlights.forEach((highlight) => {
    // Find the text node using the stored range information
    const textNode = findTextNodeByRangeInfo(highlight);
    if (textNode) {
      // Create highlight span
      const highlightSpan = document.createElement("span");
      highlightSpan.className = `highlight-${highlight.color}`;
      highlightSpan.style.backgroundColor = getHighlightColor(highlight.color);
      highlightSpan.style.borderRadius = "2px";
      highlightSpan.style.padding = "0 2px";
      highlightSpan.style.margin = "0 1px";
      highlightSpan.style.boxDecorationBreak = "clone";
      highlightSpan.style.WebkitBoxDecorationBreak = "clone";
      highlightSpan.style.borderBottom = `1px solid ${getBorderColor(
        highlight.color
      )}`;
      highlightSpan.style.boxShadow = `0 0 5px ${getShadowColor(
        highlight.color
      )}`;

      // Wrap the text with the highlight
      try {
        const range = document.createRange();
        range.selectNodeContents(textNode);

        // If the text node is longer than our target text, we need to split it
        const text = textNode.nodeValue;
        const targetText = highlight.text;
        const startIndex = text.indexOf(targetText);

        if (startIndex !== -1) {
          // Split the text node if needed
          if (startIndex > 0) {
            textNode.splitText(startIndex);
          }

          if (
            textNode.nextSibling &&
            textNode.nextSibling.nodeValue.length > targetText.length
          ) {
            textNode.nextSibling.splitText(targetText.length);
          }

          // Now wrap the exact text
          const textToWrap = textNode.nextSibling || textNode;
          range.selectNodeContents(textToWrap);
          range.surroundContents(highlightSpan);
        } else {
          // If exact match not found, try to find and wrap the text anyway
          const range = document.createRange();
          range.selectNodeContents(textNode);
          range.surroundContents(highlightSpan);
        }
      } catch (error) {
        console.warn("Error applying highlight:", error);
      }
    }
  });
};

// Helper function to clear existing highlights
const clearExistingHighlights = () => {
  const existingHighlights = document.querySelectorAll(
    'span[class^="highlight-"]'
  );
  existingHighlights.forEach((span) => {
    // Unwrap the highlight span, putting its content back in place
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  });
};

// Helper function to find text node by range information
const findTextNodeByRangeInfo = (highlight) => {
  // First try to find by text content
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        return node.nodeValue && node.nodeValue.includes(highlight.text)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue && node.nodeValue.includes(highlight.text)) {
      // If we have rangeInfo, try to match more specifically
      if (highlight.rangeInfo) {
        // Check if this node matches the stored container info
        const matchesStartContainer =
          node.nodeType === highlight.rangeInfo.startContainerInfo.nodeType &&
          (!highlight.rangeInfo.startContainerInfo.nodeValue ||
            node.nodeValue.includes(
              highlight.rangeInfo.startContainerInfo.nodeValue
            ));

        if (matchesStartContainer) {
          return node;
        }
      } else {
        // Fallback to text matching
        return node;
      }
    }
  }

  // If not found by text, try to find by element structure
  if (highlight.rangeInfo) {
    // Look for the parent element based on stored info
    let element;

    // Try to find by ID first
    if (highlight.rangeInfo.startContainerInfo.parentElementId) {
      element = document.getElementById(
        highlight.rangeInfo.startContainerInfo.parentElementId
      );
    }

    // If not found by ID, try by class
    if (!element && highlight.rangeInfo.startContainerInfo.parentElementClass) {
      const classes =
        highlight.rangeInfo.startContainerInfo.parentElementClass.split(" ");
      for (const className of classes) {
        if (className) {
          element = document.querySelector(`.${className}`);
          if (element) break;
        }
      }
    }

    // If not found by class, try by tag
    if (!element && highlight.rangeInfo.startContainerInfo.parentElementTag) {
      element = document.querySelector(
        highlight.rangeInfo.startContainerInfo.parentElementTag
      );
    }

    if (element) {
      // Find text node within this element that contains the highlighted text
      const elementWalker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            return node.nodeValue && node.nodeValue.includes(highlight.text)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        }
      );

      let elementNode;
      while ((elementNode = elementWalker.nextNode())) {
        if (
          elementNode.nodeValue &&
          elementNode.nodeValue.includes(highlight.text)
        ) {
          return elementNode;
        }
      }
    }
  }

  return null;
};

// Helper function to get highlight color
const getHighlightColor = (color) => {
  const colors = {
    yellow: "rgba(255, 215, 0, 0.3)", // Gold/yellow
    blue: "rgba(0, 191, 255, 0.3)", // Deep sky blue
    green: "rgba(50, 205, 50, 0.3)", // Lime green
    pink: "rgba(255, 105, 180, 0.3)", // Hot pink
  };
  return colors[color] || "rgba(255, 255, 0, 0.3)";
};

// Helper function to get border color
const getBorderColor = (color) => {
  const colors = {
    yellow: "rgba(255, 215, 0, 0.6)",
    blue: "rgba(0, 191, 255, 0.6)",
    green: "rgba(50, 205, 50, 0.6)",
    pink: "rgba(255, 105, 180, 0.6)",
  };
  return colors[color] || "rgba(255, 255, 0, 0.6)";
};

// Helper function to get shadow color
const getShadowColor = (color) => {
  const colors = {
    yellow: "rgba(255, 215, 0, 0.3)",
    blue: "rgba(0, 191, 255, 0.3)",
    green: "rgba(50, 205, 50, 0.3)",
    pink: "rgba(255, 105, 180, 0.3)",
  };
  return colors[color] || "rgba(255, 255, 0, 0.3)";
};

// Separate component to handle the highlighting effect
const HighlightApplier = () => {
  const { state } = useHighlight();
  const currentPagePath = window.location.pathname;

  useEffect(() => {
    const pageHighlights = state.highlights[currentPagePath] || [];
    if (pageHighlights.length > 0) {
      // Apply highlights after a short delay to ensure DOM is ready
      const timer = setTimeout(() => {
        applyHighlights(pageHighlights);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [state.highlights, currentPagePath]);

  return null;
};

const DocItem = (props) => {
  return (
    <>
      <OriginalDocItem {...props} />
      <TextHighlighter />
      <HighlightApplier />
    </>
  );
};

export default DocItem;
