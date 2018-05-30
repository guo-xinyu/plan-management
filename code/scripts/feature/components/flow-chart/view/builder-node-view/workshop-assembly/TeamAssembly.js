import { TeamBasicUnit } from '../workshop-prefabrication/TeamBasicUnit.js';
import { TeamConcept } from './TeamConcept.js';
import { TeamState } from './TeamState.js';
import { TeamAnimationState } from './TeamAnimationState.js';
import { TeamDesign } from './TeamDesign.js';

function containNode(node, id) {
  if (node.id === id) {
    return true;
  }
  for (let element of node.children) {
    let childContainNode = containNode(element, id);
    if (childContainNode) {
      return true;
    }
  }
  return false;
}

function addChildrenPath(node, children) {
  for (let child of children) {
    node.path.addPath(child.path);
  }
  return node;
}

function getIndexOfBwfNodeListByNodeId(bwfNodeList, nodeId) {
  for (let [index, element] of bwfNodeList.entries()) {
    if (element.nodeId === nodeId) {
      return index;
    }
  }
}

const teamBasicUnit = Symbol();
const teamConcept = Symbol();
const teamState = Symbol();
const teamAnimationState = Symbol();
const teamDesign = Symbol();

class TeamAssembly {
  constructor() {
    this[teamBasicUnit] = new TeamBasicUnit();
    this[teamConcept] = new TeamConcept();
    this[teamState] = new TeamState();
    this[teamAnimationState] = new TeamAnimationState();
    this[teamDesign] = new TeamDesign();
    // this._drawMode = JSON.parse(drawMode);
    // this._nodePathType = JSON.parse(nodePathType);
    // this._animationMode = JSON.parse(animationMode);
    // this._outputRotatingDegree = Math.PI / 4;
    // this._stepInterval = 120;
    // this._nodeGroupHeight = 250;
    // this._stepGoLineYOffset = 95;
    // this._nameSymbolBlank = 6;
    // this.this.this._basePoint = [5, 0];
    this._animationState = {
      animationMode: '',
      id: '',
      offsetX: 0,
      offsetY: 0
    };
  }

  drawGroupOfNode(bwfNodeGroupNode, nodeBasePosition, nodeIndex, ctx, bwfNodeList) {
    var bwfStepGroupArray = [];
    var newBwfNodeGroupChidren = [];
    for (let child of bwfNodeGroupNode.children) {
      if (child.type === this[teamConcept].bwfRealNodeName) {
        child.path.addPath(this[teamBasicUnit].drawBwfNodeName(bwfNodeGroupNode.userData.nodeName, nodeBasePosition,
          nodeIndex, ctx, this[teamState].drawBwfNodeNameMode.real));
        newBwfNodeGroupChidren.push(child);
      } else if (child.type === this[teamConcept].bwfStepGroup) {
        bwfStepGroupArray.push(child);
      }
    }

    var containNodeFlag = false;
    var draggedStepIndex = -1;
    for (let [stepIndex, bwfStepGroupNode] of bwfStepGroupArray.entries()) {
      if (stepIndex >= 1) {
        this._drawStepGoLine(stepIndex, nodeIndex, nodeBasePosition, ctx);
      }
      if (containNode(bwfStepGroupNode, this._animationState.id)) {
        containNodeFlag = true;
        draggedStepIndex = stepIndex;
      }
    }

    var stepOffsetIndex = 0;
    if (containNodeFlag) {
      let offsetAbs = Math.abs(this._animationState.offsetX / this[teamDesign].stepInterval);
      let indexOffset = Math.floor(offsetAbs) * (this._animationState.offsetX / Math.abs(this._animationState.offsetX));
      if (draggedStepIndex + indexOffset >= bwfStepGroupArray.length) {
        stepOffsetIndex = bwfStepGroupArray.length - 1 - draggedStepIndex;
      } else if (draggedStepIndex + indexOffset <= -1) {
        stepOffsetIndex = draggedStepIndex;
      } else {
        stepOffsetIndex = indexOffset;
      }
    }

    var newBwfStepGroupArray = [];
    for (let [stepIndex, bwfStepGroupNode] of bwfStepGroupArray.entries()) {
      if (stepOffsetIndex === 0) {
        newBwfStepGroupArray.push(bwfStepGroupNode);
        continue;
      }
      if (stepIndex === draggedStepIndex + stepOffsetIndex) {
        if (stepOffsetIndex > 0) {
          newBwfStepGroupArray.push(bwfStepGroupNode);
          newBwfStepGroupArray.push(bwfStepGroupArray[draggedStepIndex]);
        } else if (stepOffsetIndex < 0) {
          newBwfStepGroupArray.push(bwfStepGroupArray[draggedStepIndex]);
          newBwfStepGroupArray.push(bwfStepGroupNode);
        }
      } else if (stepIndex === draggedStepIndex) {
        continue;
      } else {
        newBwfStepGroupArray.push(bwfStepGroupNode);
      }
    }

    for (let [stepIndex, bwfStepGroupNode] of newBwfStepGroupArray.entries()) {
      let stepBasePosition = [
        nodeBasePosition[0] + (this[teamDesign].stepInterval / 2) + (stepIndex * this[teamDesign].stepInterval),
        nodeBasePosition[1] + this._stepGoLineYOffset
      ];
      if (this._animationState.animationMode === this[teamAnimationState].drag &&
        stepIndex === draggedStepIndex + stepOffsetIndex) {
        stepBasePosition[0] = nodeBasePosition[0] + (this[teamDesign].stepInterval / 2) +
          (draggedStepIndex * this[teamDesign].stepInterval) + this._animationState.offsetX;
        if (stepBasePosition[0] > nodeBasePosition[0] + (this[teamDesign].stepInterval / 2) +
          ((newBwfStepGroupArray.length - 1) * this[teamDesign].stepInterval)) {
          stepBasePosition[0] = nodeBasePosition[0] + (this[teamDesign].stepInterval / 2) +
            ((newBwfStepGroupArray.length - 1) * this[teamDesign].stepInterval);
        }
        if (stepBasePosition[0] < nodeBasePosition[0] + (this[teamDesign].stepInterval / 2)) {
          stepBasePosition[0] = nodeBasePosition[0] + (this[teamDesign].stepInterval / 2);
        }
      }
      newBwfNodeGroupChidren.push(this._drawGroupOfStep(bwfStepGroupNode, stepBasePosition, nodeIndex, ctx,
        bwfNodeList));
    }

    bwfNodeGroupNode.children = newBwfNodeGroupChidren;

    return addChildrenPath(bwfNodeGroupNode, bwfNodeGroupNode.children);
  }

  _drawGroupOfStep(bwfStepGroupNode, stepBasePosition, index, ctx, bwfNodeList) {
    const nameBasePosition = [
      stepBasePosition[0],
      stepBasePosition[1] - this._nameSymbolBlank
    ];
    for (let child of bwfStepGroupNode.children) {
      if (child.type === this[teamConcept].bwfStepName) {
        let drawStepNameMode = '';
        if (this._animationState.animationMode === this[teamAnimationState].select &&
          this._animationState.id === child.id) {
          drawStepNameMode = this[teamState].drawStepNameMode.selected;
          ++child.animatedSteps;
        } else {
          drawStepNameMode = this[teamState].drawStepNameMode.usual;
        }
        child.path.addPath(this[teamBasicUnit].drawBwfStepName(bwfStepGroupNode.userData.sortRuleName, nameBasePosition,
          ctx, drawStepNameMode, this[teamDesign].stepInterval));
      } else if (child.type === this[teamConcept].bwfStepSymbol) {
        child.path.addPath(this[teamBasicUnit].drawBwfStepSymbol(stepBasePosition,
          this[teamDesign].outputRotatingDegree, index, ctx,
          this[teamState].drawBwfStepSymbolMode[bwfStepGroupNode.userData.outputNodeId ? 'hasOutput' : 'usual']));
      } else if (child.type === this[teamConcept].bwfReferedNodeName) {
        let outputNodeIndex = getIndexOfBwfNodeListByNodeId(bwfNodeList, bwfStepGroupNode.userData.outputNodeId);
        this[teamBasicUnit].drawBwfStepGoLine(stepBasePosition, this[teamDesign].stepInterval,
          this[teamDesign].outputRotatingDegree, outputNodeIndex, ctx, this[teamState].drawBwfStepGoLineMode.output);
        const referedNodeNameBasePosition = [
          stepBasePosition[0] + (this[teamDesign].stepInterval * Math.cos(this[teamDesign].outputRotatingDegree)),
          stepBasePosition[1] + (this[teamDesign].stepInterval * Math.sin(this[teamDesign].outputRotatingDegree))
        ];
        child.path.addPath(this[teamBasicUnit].drawBwfNodeName(bwfNodeList[outputNodeIndex].nodeName,
          referedNodeNameBasePosition, outputNodeIndex, ctx, this[teamState].drawBwfNodeNameMode.refered,
          this[teamDesign].stepInterval));
      }
    }
    return addChildrenPath(bwfStepGroupNode, bwfStepGroupNode.children);
  }

  // draw(bwfWorkflowGroupNode, ctx, animationState = {}, basePoint = this._basePoint) {
  //   this._basePoint = basePoint;
  //   ctx.clearRect(0, 0, ctx.canvas.getAttribute('width'), ctx.canvas.getAttribute('height'));
  //   this._animationState.id = animationState.id;
  //   this._animationState.animationMode = animationState.animationMode;
  //   this._animationState.offsetX = animationState.offsetX;
  //   this._animationState.offsetY = animationState.offsetY;

  //   var bwfNodeGroupNodeArray = [];
  //   for (let child of bwfWorkflowGroupNode.children) {
  //     if (child.type === this[teamConcept].bwfNodeGroup) {
  //       bwfNodeGroupNodeArray.push(child);
  //     }
  //   }

  //   for (let [index, bwfNodeGroupNode] of bwfNodeGroupNodeArray.entries()) {
  //     const nodeBasePosition = [
  //       basePoint[0],
  //       basePoint[1] + (index * this._nodeGroupHeight)
  //     ];
  //     bwfNodeGroupNode = this.drawGroupOfNode(bwfNodeGroupNode, nodeBasePosition, index, ctx,
  //       bwfWorkflowGroupNode.userData.bwfNodeList);
  //   }
  //   return addChildrenPath(bwfWorkflowGroupNode, bwfWorkflowGroupNode.children);
  // }

  // animate(animationState, bwfWorkflowGroupNode, ctx) {
  //   if (animationState.animationMode === this[teamAnimationState].jumpTo) {
  //     let basePoint = [];
  //     let idArray = animationState.id.split('_');
  //     // var bwfStep = _getNodeId(bwfWorkflowGroupNode, animationState.id);
  //     basePoint = [
  //       5, -this._nodeGroupHeight *
  //       getIndexOfBwfNodeListByNodeId(bwfWorkflowGroupNode.userData.bwfNodeList, Number(idArray[1]))
  //     ];
  //     var result = this.draw(bwfWorkflowGroupNode, ctx, animationState, basePoint);
  //     result.basePoint = basePoint;
  //     return result;
  //   }

  //   return this.draw(bwfWorkflowGroupNode, ctx, animationState);
  //   // window.requestAnimationFrame(function() {

  //   // });
  // }

  _drawStepGoLine(stepIndex, nodeIndex, nodeBasePosition, ctx) {
    const startPosition = [
      nodeBasePosition[0] + (this[teamDesign].stepInterval / 2) + ((stepIndex - 1) * this[teamDesign].stepInterval),
      nodeBasePosition[1] + this._stepGoLineYOffset
    ];
    this[teamBasicUnit].drawBwfStepGoLine(startPosition, this[teamDesign].stepInterval, 0, nodeIndex, ctx,
      this[teamState].drawBwfStepGoLineMode.go);
  }
}

export { TeamAssembly };
