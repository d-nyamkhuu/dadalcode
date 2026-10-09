import type { ConceptDrawings } from "../../../types";
const drawings: ConceptDrawings = {
  "the-question": {
    "description": "Keep or omit the first letter. abc leads to ['omit a', 'keep a']. Each later letter makes the same two-way choice.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep or omit the first letter",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "abc",
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
        "label": "omit a",
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
        "label": "keep a",
        "tone": "context",
        "width": 130
      },
      {
        "type": "text",
        "x": 360,
        "y": 378,
        "label": "Each later letter makes the same two-way choice.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "the-obstacle": {
    "description": "Keep or omit the first letter. abc leads to ['omit a', 'keep a']. Each later letter makes the same two-way choice.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep or omit the first letter",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "abc",
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
        "label": "omit a",
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
        "label": "keep a",
        "tone": "context",
        "width": 130
      },
      {
        "type": "text",
        "x": 360,
        "y": 378,
        "label": "Each later letter makes the same two-way choice.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "the-useful-observation": {
    "description": "Keep or omit the first letter. abc leads to ['omit a', 'keep a']. Each later letter makes the same two-way choice.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep or omit the first letter",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "abc",
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
        "label": "omit a",
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
        "label": "keep a",
        "tone": "context",
        "width": 130
      },
      {
        "type": "text",
        "x": 360,
        "y": 378,
        "label": "Each later letter makes the same two-way choice.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "three-binary-decisions": {
    "description": "Keep or omit the first letter. abc leads to ['omit a', 'keep a']. Each later letter makes the same two-way choice.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep or omit the first letter",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "abc",
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
        "label": "omit a",
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
        "label": "keep a",
        "tone": "context",
        "width": 130
      },
      {
        "type": "text",
        "x": 360,
        "y": 378,
        "label": "Each later letter makes the same two-way choice.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "all-omitted-or-keep-the-final-letter": {
    "description": "All omitted, or keep the final letter. Decisions: omit a,b,c, omit a,b; keep c. Abbreviations: 3, 2c",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "All omitted, or keep the final letter",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Decisions",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "omit a,b,c",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 138,
        "label": "omit a,b; keep c",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Abbreviations",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "2c",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "finish-every-branch": {
    "description": "Finish every branch. First four branches: 3, 2c, 1b1, 1bc. Other four branches: a2, a1c, ab1, abc",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Finish every branch",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "First four branches",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "2c",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 138,
        "label": "1b1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 138,
        "label": "1bc",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Other four branches",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "a2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "a1c",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "ab1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 276,
        "label": "abc",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "why-the-answer-is-complete": {
    "description": "Finish every branch. First four branches: 3, 2c, 1b1, 1bc. Other four branches: a2, a1c, ab1, abc",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Finish every branch",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "First four branches",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 138,
        "label": "3",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "2c",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 138,
        "label": "1b1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 138,
        "label": "1bc",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Other four branches",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "a2",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "a1c",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "ab1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 276,
        "label": "abc",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "a-boundary-to-remember": {
    "description": "Separate one-letter example. Word: x. Abbreviations: 1, x",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Separate one-letter example",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Word",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "x",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Abbreviations",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "x",
        "tone": "context",
        "width": 84
      }
    ]
  }
};
export default drawings;
