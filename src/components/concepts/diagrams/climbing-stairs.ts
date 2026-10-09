import type { ConceptDrawings } from "../../../types";
const drawings: ConceptDrawings = {
  "the-question": {
    "description": "Last moves into stair five. stair 5 leads to ['from stair 4', 'from stair 3']. ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Last moves into stair five",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "stair 5",
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
        "label": "from stair 4",
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
        "label": "from stair 3",
        "tone": "context",
        "width": 130
      }
    ]
  },
  "the-obstacle": {
    "description": "Last moves into stair five. stair 5 leads to ['from stair 4', 'from stair 3']. ",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Last moves into stair five",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "box",
        "x": 360,
        "y": 112,
        "label": "stair 5",
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
        "label": "from stair 4",
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
        "label": "from stair 3",
        "tone": "context",
        "width": 130
      }
    ]
  },
  "the-useful-observation": {
    "description": "Two ways reach stair two. Counts at ground and stair one: 1, 1. Count at stair two: 2",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Two ways reach stair two",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Counts at ground and stair one",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "1",
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
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Count at stair two",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "two-ways-reach-stair-two": {
    "description": "Two ways reach stair two. Counts at ground and stair one: 1, 1. Count at stair two: 2",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Two ways reach stair two",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Counts at ground and stair one",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "1",
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
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Count at stair two",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "2",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "add-predecessor-groups": {
    "description": "Add predecessor groups. Earlier counts: 2, 1. Counts at stairs three and four: 3, 5",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Add predecessor groups",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Earlier counts",
        "size": 14,
        "tone": "context",
        "anchor": "start"
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
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Counts at stairs three and four",
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
        "label": "5",
        "tone": "context",
        "width": 84
      }
    ]
  },
  "stair-five-receives-eight-routes": {
    "description": "Stair five receives eight routes. Counts at stairs four and three: 5, 3. Count at stair five: 8. 5 + 3 = 8",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Stair five receives eight routes",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Counts at stairs four and three",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "5",
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
        "label": "Count at stair five",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "8",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "5 + 3 = 8",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "why-the-answer-is-complete": {
    "description": "Stair five receives eight routes. Counts at stairs four and three: 5, 3. Count at stair five: 8. 5 + 3 = 8",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Stair five receives eight routes",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Counts at stairs four and three",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "5",
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
        "label": "Count at stair five",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 360.0,
        "y": 276,
        "label": "8",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "5 + 3 = 8",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "a-boundary-to-remember": {
    "description": "Base counts. Locations: ground, stair 1. Route counts: 1, 1",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Base counts",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Locations",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "ground",
        "tone": "context",
        "width": 84
      },
      {
        "type": "box",
        "x": 412.0,
        "y": 138,
        "label": "stair 1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Route counts",
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
        "label": "1",
        "tone": "context",
        "width": 84
      }
    ]
  }
};
export default drawings;
