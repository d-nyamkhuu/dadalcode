import type { ConceptDrawings } from "../../../types";
const drawings: ConceptDrawings = {
  "the-question": {
    "description": "Three pairs, valid at every prefix. Pair budget: 3. Current string: ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Three pairs, valid at every prefix",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Pair budget",
        "size": 14,
        "tone": "context",
        "anchor": "start"
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
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Current string",
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
    "description": "Three pairs, valid at every prefix. Pair budget: 3. Current string: ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Three pairs, valid at every prefix",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Pair budget",
        "size": 14,
        "tone": "context",
        "anchor": "start"
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
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Current string",
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
    "description": "Open the available pairs. Budget: 3 pairs. Current prefix: (, (, (",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Open the available pairs",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Budget",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "3 pairs",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Current prefix",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "(",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "(",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "(",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "open-the-available-pairs": {
    "description": "Open the available pairs. Budget: 3 pairs. Current prefix: (, (, (",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Open the available pairs",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Budget",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "3 pairs",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Current prefix",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "(",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "(",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 276,
        "label": "(",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "complete-one-nested-string": {
    "description": "Complete one nested string. Prefix: (, (, (. First completion: ((()))",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Complete one nested string",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Prefix",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "(",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "(",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 464.0,
        "y": 138,
        "label": "(",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "First completion",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "((()))",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "follow-every-legal-alternative": {
    "description": "Follow every legal alternative. First answer: ((())). Other answers: (()()), (())(), ()(()), ()()()",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Follow every legal alternative",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "First answer",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "((()))",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Other answers",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "(()())",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "(())()",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "()(())",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 276,
        "label": "()()()",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "why-the-answer-is-complete": {
    "description": "Follow every legal alternative. First answer: ((())). Other answers: (()()), (())(), ()(()), ()()()",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Follow every legal alternative",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "First answer",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "((()))",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Other answers",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "(()())",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 276,
        "label": "(())()",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 276,
        "label": "()(())",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 516.0,
        "y": 276,
        "label": "()()()",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "a-boundary-to-remember": {
    "description": "One pair. Only legal first move: (. Only completion: ()",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "One pair",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Only legal first move",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 138,
        "label": "(",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Only completion",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "()",
        "tone": "context",
        "width": 84
      }
    ]
  }
};
export default drawings;
