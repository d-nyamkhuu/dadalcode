import type { ConceptDrawings } from "../../../types";
const drawings: ConceptDrawings = {
  "a-chain-of-five-nodes": {
    "description": "Keep the route forward while turning links back. Already reversed: . Still to visit: 1, 2, 3, 4, 5, end. Reverse the arrows; keep the same nodes.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep the route forward while turning links back",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Already reversed",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "text",
        "x": 360,
        "y": 138,
        "label": "empty",
        "size": 18,
        "tone": "muted",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Still to visit",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 100.0,
        "y": 276,
        "label": "1",
        "tone": "active",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 142.0 276 L 162.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "2",
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
        "label": "3",
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
        "label": "4",
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
        "label": "5",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 558.0 276 L 578.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 620.0,
        "y": 276,
        "label": "end",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Reverse the arrows; keep the same nodes.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "why-replacing-values-misses-the-point": {
    "description": "Keep the route forward while turning links back. Already reversed: . Still to visit: 1, 2, 3, 4, 5, end. Copying values would lose the original node identities.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep the route forward while turning links back",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Already reversed",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "text",
        "x": 360,
        "y": 138,
        "label": "empty",
        "size": 18,
        "tone": "muted",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Still to visit",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 100.0,
        "y": 276,
        "label": "1",
        "tone": "active",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 142.0 276 L 162.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "2",
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
        "label": "3",
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
        "label": "4",
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
        "label": "5",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 558.0 276 L 578.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 620.0,
        "y": 276,
        "label": "end",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Copying values would lose the original node identities.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "keep-a-route-forward": {
    "description": "Keep the route forward while turning links back. Already reversed: . Still to visit: 1, 2, 3, 4, 5, end. Bookmark the next node before changing its link.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep the route forward while turning links back",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Already reversed",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "text",
        "x": 360,
        "y": 138,
        "label": "empty",
        "size": 18,
        "tone": "muted",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Still to visit",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 100.0,
        "y": 276,
        "label": "1",
        "tone": "active",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 142.0 276 L 162.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "2",
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
        "label": "3",
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
        "label": "4",
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
        "label": "5",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 558.0 276 L 578.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 620.0,
        "y": 276,
        "label": "end",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Bookmark the next node before changing its link.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "move-the-first-node": {
    "description": "Keep the route forward while turning links back. Already reversed: 1, end. Still to visit: 2, 3, 4, 5, end. 1 becomes the tail; the route to 2 stays saved.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep the route forward while turning links back",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Already reversed",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 308.0,
        "y": 138,
        "label": "1",
        "tone": "active",
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
        "label": "end",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Still to visit",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 152.0,
        "y": 276,
        "label": "2",
        "tone": "active",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 194.0 276 L 214.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 276,
        "label": "3",
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
        "label": "4",
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
        "label": "5",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 506.0 276 L 526.0 276",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 568.0,
        "y": 276,
        "label": "end",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "1 becomes the tail; the route to 2 stays saved.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "grow-the-reversed-chain": {
    "description": "Keep the route forward while turning links back. Already reversed: 2, 1, end. Still to visit: 3, 4, 5, end. 2 points back to 1; the route to 3 stays saved.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep the route forward while turning links back",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Already reversed",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 256.0,
        "y": 138,
        "label": "2",
        "tone": "active",
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
        "label": "end",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Still to visit",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 204.0,
        "y": 276,
        "label": "3",
        "tone": "active",
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
        "label": "4",
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
        "label": "5",
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
        "label": "end",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "2 points back to 1; the route to 3 stays saved.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "the-last-transfer-completes-it": {
    "description": "Keep the route forward while turning links back. Already reversed: 5, 4, 3, 2, 1, end. Still to visit: . Start from 5 to read the fully reversed chain.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep the route forward while turning links back",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Already reversed",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 100.0,
        "y": 138,
        "label": "5",
        "tone": "active",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 142.0 138 L 162.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
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
        "label": "3",
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
        "label": "2",
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
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 558.0 138 L 578.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 620.0,
        "y": 138,
        "label": "end",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Still to visit",
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
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Start from 5 to read the fully reversed chain.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "why-every-node-survives": {
    "description": "Keep the route forward while turning links back. Already reversed: 5, 4, 3, 2, 1, end. Still to visit: . Each transfer preserves both chains.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep the route forward while turning links back",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Already reversed",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "box",
        "x": 100.0,
        "y": 138,
        "label": "5",
        "tone": "active",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 142.0 138 L 162.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
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
        "label": "3",
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
        "label": "2",
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
        "label": "1",
        "tone": "context",
        "width": 84
      },
      {
        "type": "path",
        "d": "M 558.0 138 L 578.0 138",
        "arrow": true,
        "tone": "context",
        "dashed": false
      },
      {
        "type": "box",
        "x": 620.0,
        "y": 138,
        "label": "end",
        "tone": "context",
        "width": 84
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Still to visit",
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
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Each transfer preserves both chains.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  },
  "when-there-is-no-chain": {
    "description": "Keep the route forward while turning links back. Already reversed: . Still to visit: . Boundary example: an empty list remains empty.",
    "shapes": [
      {
        "type": "text",
        "x": 360,
        "y": 46,
        "label": "Keep the route forward while turning links back",
        "size": 20,
        "tone": "context",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 84,
        "label": "Already reversed",
        "size": 14,
        "tone": "context",
        "anchor": "start"
      },
      {
        "type": "text",
        "x": 360,
        "y": 138,
        "label": "empty",
        "size": 18,
        "tone": "muted",
        "anchor": "middle"
      },
      {
        "type": "text",
        "x": 38,
        "y": 222,
        "label": "Still to visit",
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
      },
      {
        "type": "text",
        "x": 360,
        "y": 374,
        "label": "Boundary example: an empty list remains empty.",
        "size": 16,
        "tone": "active",
        "anchor": "middle"
      }
    ]
  }
};
export default drawings;
