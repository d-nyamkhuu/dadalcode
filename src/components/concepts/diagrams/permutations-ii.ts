import type { ConceptDrawings } from "../../../types";
const drawings: ConceptDrawings = {
  "the-question": {
    "description": "Canonical first choices. [1,1,2] leads to ['first 1', '2']. ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Canonical first choices",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "[1,1,2]",
        "tone": "active",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 205.0 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 205.0,
        "y": 276,
        "label": "first 1",
        "tone": "context",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 515.0 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 515.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 130
      }
    ]
  },
  "the-obstacle": {
    "description": "Canonical first choices. [1,1,2] leads to ['first 1', '2']. ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Canonical first choices",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "[1,1,2]",
        "tone": "active",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 205.0 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 205.0,
        "y": 276,
        "label": "first 1",
        "tone": "context",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 515.0 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 515.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 130
      }
    ]
  },
  "the-useful-observation": {
    "description": "Two equal copies can both appear. Sorted occurrences: 1, 1, 2. First ordering: 1, 1, 2",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Two equal copies can both appear",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Sorted occurrences",
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
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "First ordering",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "two-equal-copies-can-both-appear": {
    "description": "Two equal copies can both appear. Sorted occurrences: 1, 1, 2. First ordering: 1, 1, 2",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Two equal copies can both appear",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Sorted occurrences",
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
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "First ordering",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "move-the-two-between-the-ones": {
    "description": "Move the two between the ones. Seat choices: 1, 2, remaining 1. Second ordering: 1, 2, 1",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Move the two between the ones",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Seat choices",
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
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "remaining 1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Second ordering",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "skip-an-interchangeable-root": {
    "description": "Skip an interchangeable root. Root choices: 1, 1, 2. Third ordering: 2, 1, 1. Three distinct value orderings",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Skip an interchangeable root",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Root choices",
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
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Third ordering",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Three distinct value orderings",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "why-the-answer-is-complete": {
    "description": "Skip an interchangeable root. Root choices: 1, 1, 2. Third ordering: 2, 1, 1. Three distinct value orderings",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Skip an interchangeable root",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Root choices",
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
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Third ordering",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Three distinct value orderings",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "a-boundary-to-remember": {
    "description": "All values equal. Occurrences: 1, 1, 1. One distinct permutation: 1,1,1",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "All values equal",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Occurrences",
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
        "label": "One distinct permutation",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "1,1,1",
        "tone": "context",
        "width": 84
      }
    ]
  }
};
export default drawings;
