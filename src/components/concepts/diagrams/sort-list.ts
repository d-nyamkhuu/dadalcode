import type { ConceptDrawings } from "../../../types";
const drawings: ConceptDrawings = {
  "the-question": {
    "description": "Sort by merging links. Input chain: 4, 2, 1, 3. Sorted runs: ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Sort by merging links",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Input chain",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 138,
        "label": "4",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 246.0 138 L 266.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
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
        "type": "path",
        "d": "M 350.0 138 L 370.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 138,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 454.0 138 L 474.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Sorted runs",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "text",
        "x": 360,
        "y": 276,
        "label": "empty",
        "size": 18,
        "tone": "muted",
        "anchor": "middle"
      }
    ]
  },
  "the-obstacle": {
    "description": "Sort by merging links. Input chain: 4, 2, 1, 3. Sorted runs: ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Sort by merging links",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Input chain",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 138,
        "label": "4",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 246.0 138 L 266.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
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
        "type": "path",
        "d": "M 350.0 138 L 370.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 138,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 454.0 138 L 474.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Sorted runs",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "text",
        "x": 360,
        "y": 276,
        "label": "empty",
        "size": 18,
        "tone": "muted",
        "anchor": "middle"
      }
    ]
  },
  "the-useful-observation": {
    "description": "Merge singleton neighbors. Initial chain: 4, 2, 1, 3. Sorted size-two runs: 2 → 4, 1 → 3",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Merge singleton neighbors",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Initial chain",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 138,
        "label": "4",
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
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Sorted size-two runs",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "2 → 4",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "1 → 3",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "merge-singleton-neighbors": {
    "description": "Merge singleton neighbors. Initial chain: 4, 2, 1, 3. Sorted size-two runs: 2 → 4, 1 → 3",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Merge singleton neighbors",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Initial chain",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 138,
        "label": "4",
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
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Sorted size-two runs",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "2 → 4",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "1 → 3",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "merge-the-doubled-runs": {
    "description": "Merge the doubled runs. Two sorted runs: 2, 4, 1, 3. Merged run: 1, 2, 3, 4",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Merge the doubled runs",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Two sorted runs",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 138,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 246.0 138 L 266.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "4",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 350.0 138 L 370.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 138,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 454.0 138 L 474.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Merged run",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 246.0 276 L 266.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 350.0 276 L 370.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 454.0 276 L 474.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 276,
        "label": "4",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "one-run-covers-the-chain": {
    "description": "One run covers the chain. Sorted chain: 1, 2, 3, 4. Completed run size: 4",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "One run covers the chain",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Sorted chain",
        "size": 14,
        "tone": "context",
        "anchor": "start"
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
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Completed run size",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "4",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "why-the-answer-is-complete": {
    "description": "One run covers the chain. Sorted chain: 1, 2, 3, 4. Completed run size: 4",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "One run covers the chain",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Sorted chain",
        "size": 14,
        "tone": "context",
        "anchor": "start"
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
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Completed run size",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "4",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "a-boundary-to-remember": {
    "description": "A short last run. Before: 3, 1, 2. After: 1, 2, 3",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "A short last run",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Before",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 298.0 138 L 318.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
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
        "type": "path",
        "d": "M 402.0 138 L 422.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
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
        "label": "After",
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
        "type": "path",
        "d": "M 298.0 276 L 318.0 276",
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
        "width": 84
      },
      {
        "type": "path",
        "d": "M 402.0 276 L 422.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
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
  }
};
export default drawings;
