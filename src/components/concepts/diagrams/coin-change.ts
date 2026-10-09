import type { ConceptDrawings } from "../../../types";
const drawings: ConceptDrawings = {
  "the-destination-is-six": {
    "description": "Build six with as few coins as possible. Choices: 1, 3, 4. Compare total coin counts: 6. Unlimited coins of each denomination.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Build six with as few coins as possible",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Choices",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "4",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Compare total coin counts",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "6",
        "tone": "active",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Unlimited coins of each denomination.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "the-tempting-shortcut-fails": {
    "description": "Build six with as few coins as possible. Choices: 4, 1, 1. Compare total coin counts: 3, 3. Largest first: 3 coins. Better: 2 coins.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Build six with as few coins as possible",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Choices",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "4",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Compare total coin counts",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "3",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "3",
        "tone": "active",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Largest first: 3 coins. Better: 2 coins.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "look-at-the-final-move": {
    "description": "Build six with as few coins as possible. Choices: amount 0, amount 3, amount 6. Compare total coin counts: 0 coins, 1 coin, 2 coins. A last coin joins a solved smaller amount.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Build six with as few coins as possible",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Choices",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "amount 0",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "amount 3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "amount 6",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Compare total coin counts",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "0 coins",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "1 coin",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "2 coins",
        "tone": "active",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "A last coin joins a solved smaller amount.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "build-the-smaller-answers": {
    "description": "Build six with as few coins as possible. Amounts / last coins: 0, 1, 2, 3, 4, 5. Compare total coin counts: 0, 1, 2, 1, 1, 2. Save the cheapest answer for every smaller amount.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Build six with as few coins as possible",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Amounts / last coins",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 100.0,
        "y": 138,
        "label": "0",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 138,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 138,
        "label": "4",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 620.0,
        "y": 138,
        "label": "5",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Compare total coin counts",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 100.0,
        "y": 276,
        "label": "0",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "1",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "2",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "1",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 276,
        "label": "1",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 620.0,
        "y": 276,
        "label": "2",
        "tone": "active",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Save the cheapest answer for every smaller amount.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "compare-all-routes-to-six": {
    "description": "Build six with as few coins as possible. Amounts / last coins: last coin 1, last coin 3, last coin 4. Compare total coin counts: 3 coins, 2 coins, 3 coins. The last coin 3 reuses the answer for amount 3.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Build six with as few coins as possible",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Amounts / last coins",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "last coin 1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "last coin 3",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "last coin 4",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Compare total coin counts",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "3 coins",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "2 coins",
        "tone": "active",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "3 coins",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "The last coin 3 reuses the answer for amount 3.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "the-winning-route": {
    "description": "Build six with as few coins as possible. Amounts / last coins: 3, 3. Compare total coin counts: 2 coins. 3 + 3 = 6. Minimum: two coins.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Build six with as few coins as possible",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Amounts / last coins",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Compare total coin counts",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "2 coins",
        "tone": "active",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "3 + 3 = 6. Minimum: two coins.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "why-the-comparison-is-complete": {
    "description": "Build six with as few coins as possible. Amounts / last coins: 6 → 5, 6 → 3, 6 → 2. Compare total coin counts: try every last coin. Every possible composition has a last coin.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Build six with as few coins as possible",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Amounts / last coins",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "6 → 5",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "6 → 3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "6 → 2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Compare total coin counts",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "try every last coin",
        "tone": "active",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Every possible composition has a last coin.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "zero-is-the-starting-destination": {
    "description": "Build six with as few coins as possible. Amounts / last coins: amount 0. Compare total coin counts: 0 coins. Boundary example: no money needs no coins.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Build six with as few coins as possible",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Amounts / last coins",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "amount 0",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Compare total coin counts",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "0 coins",
        "tone": "active",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Boundary example: no money needs no coins.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  }
};
export default drawings;
