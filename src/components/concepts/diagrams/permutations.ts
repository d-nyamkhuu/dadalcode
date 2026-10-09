import type { ConceptDrawings } from "../../../types";
const drawings: ConceptDrawings = {
  "the-question": {
    "description": "Choose the first seat. empty order leads to [1, 2, 3]. ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Choose the first seat",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "empty order",
        "tone": "active",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 153.33333333333334 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 153.33333333333334,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 360.0 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 566.6666666666666 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 566.6666666666666,
        "y": 276,
        "label": "3",
        "tone": "context",
        "width": 130
      }
    ]
  },
  "the-obstacle": {
    "description": "Choose the first seat. empty order leads to [1, 2, 3]. ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Choose the first seat",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "empty order",
        "tone": "active",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 153.33333333333334 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 153.33333333333334,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 360.0 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 130
      },
      {
        "type": "path",
        "d": "M 360 143 L 566.6666666666666 245",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 566.6666666666666,
        "y": 276,
        "label": "3",
        "tone": "context",
        "width": 130
      }
    ]
  },
  "the-useful-observation": {
    "description": "Fill one route. Available numbers: 1, 2, 3. First ordering: 1, 2, 3",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Fill one route",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Available numbers",
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
        "label": "3",
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
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "3",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "fill-one-route": {
    "description": "Fill one route. Available numbers: 1, 2, 3. First ordering: 1, 2, 3",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Fill one route",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Available numbers",
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
        "label": "3",
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
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "3",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "return-to-a-fork": {
    "description": "Return to a fork. First route: 1,2,3. Alternative route: 1,3,2",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Return to a fork",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "First route",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "1,2,3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Alternative route",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "1,3,2",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "every-first-seat-has-its-routes": {
    "description": "Every first seat has its routes. First-seat branches: 1 first, 2 first, 3 first. Completions per branch: 2, 2, 2. Six total orderings",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Every first seat has its routes",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "First-seat branches",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "1 first",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "2 first",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "3 first",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Completions per branch",
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
        "label": "2",
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
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Six total orderings",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "why-the-answer-is-complete": {
    "description": "Every first seat has its routes. First-seat branches: 1 first, 2 first, 3 first. Completions per branch: 2, 2, 2. Six total orderings",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Every first seat has its routes",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "First-seat branches",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "1 first",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "2 first",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "3 first",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Completions per branch",
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
        "label": "2",
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
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Six total orderings",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "a-boundary-to-remember": {
    "description": "One seat, one ordering. Input: 7. Permutation: 7",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "One seat, one ordering",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Input",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "7",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Permutation",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "7",
        "tone": "context",
        "width": 84
      }
    ]
  }
};
export default drawings;
