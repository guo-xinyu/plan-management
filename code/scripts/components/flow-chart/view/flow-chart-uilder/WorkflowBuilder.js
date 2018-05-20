// define([
//   './DrawBasicElement',
//   'text!../const/drawMode.json',
//   'text!../const/nodePathType.json',
//   'text!../const/animationMode.json'
// ], function(drawBasicElement, drawMode, nodePathType, animationMode) {
//   const _drawMode = JSON.parse(drawMode);
//   const _nodePathType = JSON.parse(nodePathType);
//   const _animationMode = JSON.parse(animationMode);
//   const _outputRotatingDegree = Math.PI / 4;
//   const _stepInterval = 120;
//   const _nodeGroupHeight = 250;
//   const _stepGoLineYOffset = 95;
//   const _nameSymbolBlank = 6;
//   var _basePoint = [5, 0];
//   var _animationState = {
//     animationMode: '',
//     id: '',
//     offsetX: 0,
//     offsetY: 0
//   };

//   function _drawGroupOfNode(bwfNodeGroupNode, nodeBasePosition, nodeIndex, ctx, bwfNodeList) {
//     var bwfStepGroupArray = [];
//     var newBwfNodeGroupChidren = [];
//     for (let child of bwfNodeGroupNode.children) {
//       if (child.type === _nodePathType.bwfRealNodeName) {
//         child.path.addPath(drawBasicElement.drawBwfNodeName(bwfNodeGroupNode.userData.nodeName, nodeBasePosition,
//           nodeIndex, ctx, _drawMode.drawBwfNodeNameMode.real));
//         newBwfNodeGroupChidren.push(child);
//       } else if (child.type === _nodePathType.bwfStepGroup) {
//         bwfStepGroupArray.push(child);
//       }
//     }

//     var containNodeFlag = false;
//     var draggedStepIndex = -1;
//     for (let [stepIndex, bwfStepGroupNode] of bwfStepGroupArray.entries()) {
//       if (stepIndex >= 1) {
//         _drawStepGoLine(stepIndex, nodeIndex, nodeBasePosition, ctx);
//       }
//       if (_containNode(bwfStepGroupNode, _animationState.id)) {
//         containNodeFlag = true;
//         draggedStepIndex = stepIndex;
//       }
//     }

//     var stepOffsetIndex = 0;
//     if (containNodeFlag) {
//       let offsetAbs = Math.abs(_animationState.offsetX / _stepInterval);
//       let indexOffset = Math.floor(offsetAbs) * (_animationState.offsetX / Math.abs(_animationState.offsetX));
//       if (draggedStepIndex + indexOffset >= bwfStepGroupArray.length) {
//         stepOffsetIndex = bwfStepGroupArray.length - 1 - draggedStepIndex;
//       } else if (draggedStepIndex + indexOffset <= -1) {
//         stepOffsetIndex = draggedStepIndex;
//       } else {
//         stepOffsetIndex = indexOffset;
//       }
//     }

//     var newBwfStepGroupArray = [];
//     for (let [stepIndex, bwfStepGroupNode] of bwfStepGroupArray.entries()) {
//       if (stepOffsetIndex === 0) {
//         newBwfStepGroupArray.push(bwfStepGroupNode);
//         continue;
//       }
//       if (stepIndex === draggedStepIndex + stepOffsetIndex) {
//         if (stepOffsetIndex > 0) {
//           newBwfStepGroupArray.push(bwfStepGroupNode);
//           newBwfStepGroupArray.push(bwfStepGroupArray[draggedStepIndex]);
//         } else if (stepOffsetIndex < 0) {
//           newBwfStepGroupArray.push(bwfStepGroupArray[draggedStepIndex]);
//           newBwfStepGroupArray.push(bwfStepGroupNode);
//         }
//       } else if (stepIndex === draggedStepIndex) {
//         continue;
//       } else {
//         newBwfStepGroupArray.push(bwfStepGroupNode);
//       }
//     }

//     for (let [stepIndex, bwfStepGroupNode] of newBwfStepGroupArray.entries()) {
//       let stepBasePosition = [
//         nodeBasePosition[0] + (_stepInterval / 2) + (stepIndex * _stepInterval),
//         nodeBasePosition[1] + _stepGoLineYOffset
//       ];
//       if (_animationState.animationMode === _animationMode.drag && stepIndex === draggedStepIndex + stepOffsetIndex) {
//         stepBasePosition[0] = nodeBasePosition[0] + (_stepInterval / 2) + (draggedStepIndex * _stepInterval) +
//           _animationState.offsetX;
//         if (stepBasePosition[0] > nodeBasePosition[0] + (_stepInterval / 2) + ((newBwfStepGroupArray.length - 1) *
//             _stepInterval)) {
//           stepBasePosition[0] = nodeBasePosition[0] + (_stepInterval / 2) + ((newBwfStepGroupArray.length - 1) *
//             _stepInterval);
//         }
//         if (stepBasePosition[0] < nodeBasePosition[0] + (_stepInterval / 2)) {
//           stepBasePosition[0] = nodeBasePosition[0] + (_stepInterval / 2);
//         }
//       }
//       newBwfNodeGroupChidren.push(_drawGroupOfStep(bwfStepGroupNode, stepBasePosition, nodeIndex, ctx, bwfNodeList));
//     }

//     bwfNodeGroupNode.children = newBwfNodeGroupChidren;

//     return _addChildrenPath(bwfNodeGroupNode, bwfNodeGroupNode.children);
//   }

//   function _containNode(node, id) {
//     if (node.id === id) {
//       return true;
//     }
//     for (let element of node.children) {
//       let containNode = _containNode(element, id);
//       if (containNode) {
//         return true;
//       }
//     }
//     return false;
//   }

//   function _addChildrenPath(node, children) {
//     for (let child of children) {
//       node.path.addPath(child.path);
//     }
//     return node;
//   }

//   function _drawStepGoLine(stepIndex, nodeIndex, nodeBasePosition, ctx) {
//     const startPosition = [
//       nodeBasePosition[0] + (_stepInterval / 2) + ((stepIndex - 1) * _stepInterval),
//       nodeBasePosition[1] + _stepGoLineYOffset
//     ];
//     drawBasicElement.drawBwfStepGoLine(startPosition, _stepInterval, 0, nodeIndex, ctx,
//       _drawMode.drawBwfStepGoLineMode.go);
//   }

//   function _drawGroupOfStep(bwfStepGroupNode, stepBasePosition, index, ctx, bwfNodeList) {
//     const nameBasePosition = [
//       stepBasePosition[0],
//       stepBasePosition[1] - _nameSymbolBlank
//     ];
//     for (let child of bwfStepGroupNode.children) {
//       if (child.type === _nodePathType.bwfStepName) {
//         let drawStepNameMode = '';
//         if (_animationState.animationMode === _animationMode.select && _animationState.id === child.id) {
//           drawStepNameMode = _drawMode.drawStepNameMode.selected;
//           ++child.animatedSteps;
//         } else {
//           drawStepNameMode = _drawMode.drawStepNameMode.usual;
//         }
//         child.path.addPath(drawBasicElement.drawBwfStepName(bwfStepGroupNode.userData.sortRuleName, nameBasePosition,
//           ctx, drawStepNameMode, _stepInterval));
//       } else if (child.type === _nodePathType.bwfStepSymbol) {
//         child.path.addPath(drawBasicElement.drawBwfStepSymbol(stepBasePosition, _outputRotatingDegree, index, ctx,
//           _drawMode.drawBwfStepSymbolMode[bwfStepGroupNode.userData.outputNodeId ? 'hasOutput' : 'usual']));
//       } else if (child.type === _nodePathType.bwfReferedNodeName) {
//         let outputNodeIndex = _getIndexOfBwfNodeListByNodeId(bwfNodeList, bwfStepGroupNode.userData.outputNodeId);
//         drawBasicElement.drawBwfStepGoLine(stepBasePosition, _stepInterval, _outputRotatingDegree,
//           outputNodeIndex, ctx, _drawMode.drawBwfStepGoLineMode.output);
//         const referedNodeNameBasePosition = [
//           stepBasePosition[0] + (_stepInterval * Math.cos(_outputRotatingDegree)),
//           stepBasePosition[1] + (_stepInterval * Math.sin(_outputRotatingDegree))
//         ];
//         child.path.addPath(drawBasicElement.drawBwfNodeName(bwfNodeList[outputNodeIndex].nodeName,
//           referedNodeNameBasePosition, outputNodeIndex, ctx, _drawMode.drawBwfNodeNameMode.refered, _stepInterval));
//       }
//     }
//     return _addChildrenPath(bwfStepGroupNode, bwfStepGroupNode.children);
//   }

//   function _getIndexOfBwfNodeListByNodeId(bwfNodeList, nodeId) {
//     for (let [index, element] of bwfNodeList.entries()) {
//       if (element.nodeId === nodeId) {
//         return index;
//       }
//     }
//   }

//   function _draw(bwfWorkflowGroupNode, ctx, animationState = {}, basePoint = _basePoint) {
//     _basePoint = basePoint;
//     ctx.clearRect(0, 0, ctx.canvas.getAttribute('width'), ctx.canvas.getAttribute('height'));
//     _animationState.id = animationState.id;
//     _animationState.animationMode = animationState.animationMode;
//     _animationState.offsetX = animationState.offsetX;
//     _animationState.offsetY = animationState.offsetY;

//     var bwfNodeGroupNodeArray = [];
//     for (let child of bwfWorkflowGroupNode.children) {
//       if (child.type === _nodePathType.bwfNodeGroup) {
//         bwfNodeGroupNodeArray.push(child);
//       }
//     }

//     for (let [index, bwfNodeGroupNode] of bwfNodeGroupNodeArray.entries()) {
//       const nodeBasePosition = [
//         basePoint[0],
//         basePoint[1] + (index * _nodeGroupHeight)
//       ];
//       bwfNodeGroupNode = _drawGroupOfNode(bwfNodeGroupNode, nodeBasePosition, index, ctx,
//         bwfWorkflowGroupNode.userData.bwfNodeList);
//     }
//     return _addChildrenPath(bwfWorkflowGroupNode, bwfWorkflowGroupNode.children);
//   }

//   function _animate(animationState, bwfWorkflowGroupNode, ctx) {
//     if (animationState.animationMode === _animationMode.jumpTo) {
//       let basePoint = [];
//       let idArray = animationState.id.split('_');
//       // var bwfStep = _getNodeId(bwfWorkflowGroupNode, animationState.id);
//       basePoint = [
//         5, -_nodeGroupHeight *
//         _getIndexOfBwfNodeListByNodeId(bwfWorkflowGroupNode.userData.bwfNodeList, Number(idArray[1]))
//       ];
//       var result = _draw(bwfWorkflowGroupNode, ctx, animationState, basePoint);
//       result.basePoint = basePoint;
//       return result;
//     }

//     return _draw(bwfWorkflowGroupNode, ctx, animationState);
//     // window.requestAnimationFrame(function() {

//     // });
//   }

//   return {
//     draw: _draw,
//     animate: _animate
//   };
// });

// class DrawControl {
//   constructor() {
//     this._drawMode = JSON.parse(drawMode);
//     this._nodePathType = JSON.parse(nodePathType);
//     this._animationMode = JSON.parse(animationMode);
//     this._outputRotatingDegree = Math.PI / 4;
//     this._stepInterval = 120;
//     this._nodeGroupHeight = 250;
//     this._stepGoLineYOffset = 95;
//     this._nameSymbolBlank = 6;
//     this._basePoint = [5, 0];
//     this._animationState = {
//       animationMode: '',
//       id: '',
//       offsetX: 0,
//       offsetY: 0
//     };
//   }

//   drawGroupOfNode(bwfNodeGroupNode, nodeBasePosition, nodeIndex, ctx, bwfNodeList) {
//     var bwfStepGroupArray = [];
//     var newBwfNodeGroupChidren = [];
//     for (let child of bwfNodeGroupNode.children) {
//       if (child.type === _nodePathType.bwfRealNodeName) {
//         child.path.addPath(drawBasicElement.drawBwfNodeName(bwfNodeGroupNode.userData.nodeName, nodeBasePosition,
//           nodeIndex, ctx, _drawMode.drawBwfNodeNameMode.real));
//         newBwfNodeGroupChidren.push(child);
//       } else if (child.type === _nodePathType.bwfStepGroup) {
//         bwfStepGroupArray.push(child);
//       }
//     }

//     var containNodeFlag = false;
//     var draggedStepIndex = -1;
//     for (let [stepIndex, bwfStepGroupNode] of bwfStepGroupArray.entries()) {
//       if (stepIndex >= 1) {
//         _drawStepGoLine(stepIndex, nodeIndex, nodeBasePosition, ctx);
//       }
//       if (_containNode(bwfStepGroupNode, _animationState.id)) {
//         containNodeFlag = true;
//         draggedStepIndex = stepIndex;
//       }
//     }

//     var stepOffsetIndex = 0;
//     if (containNodeFlag) {
//       let offsetAbs = Math.abs(_animationState.offsetX / _stepInterval);
//       let indexOffset = Math.floor(offsetAbs) * (_animationState.offsetX / Math.abs(_animationState.offsetX));
//       if (draggedStepIndex + indexOffset >= bwfStepGroupArray.length) {
//         stepOffsetIndex = bwfStepGroupArray.length - 1 - draggedStepIndex;
//       } else if (draggedStepIndex + indexOffset <= -1) {
//         stepOffsetIndex = draggedStepIndex;
//       } else {
//         stepOffsetIndex = indexOffset;
//       }
//     }

//     var newBwfStepGroupArray = [];
//     for (let [stepIndex, bwfStepGroupNode] of bwfStepGroupArray.entries()) {
//       if (stepOffsetIndex === 0) {
//         newBwfStepGroupArray.push(bwfStepGroupNode);
//         continue;
//       }
//       if (stepIndex === draggedStepIndex + stepOffsetIndex) {
//         if (stepOffsetIndex > 0) {
//           newBwfStepGroupArray.push(bwfStepGroupNode);
//           newBwfStepGroupArray.push(bwfStepGroupArray[draggedStepIndex]);
//         } else if (stepOffsetIndex < 0) {
//           newBwfStepGroupArray.push(bwfStepGroupArray[draggedStepIndex]);
//           newBwfStepGroupArray.push(bwfStepGroupNode);
//         }
//       } else if (stepIndex === draggedStepIndex) {
//         continue;
//       } else {
//         newBwfStepGroupArray.push(bwfStepGroupNode);
//       }
//     }

//     for (let [stepIndex, bwfStepGroupNode] of newBwfStepGroupArray.entries()) {
//       let stepBasePosition = [
//         nodeBasePosition[0] + (_stepInterval / 2) + (stepIndex * _stepInterval),
//         nodeBasePosition[1] + _stepGoLineYOffset
//       ];
//       if (_animationState.animationMode === _animationMode.drag && stepIndex === draggedStepIndex + stepOffsetIndex) {
//         stepBasePosition[0] = nodeBasePosition[0] + (_stepInterval / 2) + (draggedStepIndex * _stepInterval) +
//           _animationState.offsetX;
//         if (stepBasePosition[0] > nodeBasePosition[0] + (_stepInterval / 2) + ((newBwfStepGroupArray.length - 1) *
//             _stepInterval)) {
//           stepBasePosition[0] = nodeBasePosition[0] + (_stepInterval / 2) + ((newBwfStepGroupArray.length - 1) *
//             _stepInterval);
//         }
//         if (stepBasePosition[0] < nodeBasePosition[0] + (_stepInterval / 2)) {
//           stepBasePosition[0] = nodeBasePosition[0] + (_stepInterval / 2);
//         }
//       }
//       newBwfNodeGroupChidren.push(_drawGroupOfStep(bwfStepGroupNode, stepBasePosition, nodeIndex, ctx, bwfNodeList));
//     }

//     bwfNodeGroupNode.children = newBwfNodeGroupChidren;

//     return _addChildrenPath(bwfNodeGroupNode, bwfNodeGroupNode.children);
//   }

//   containNode(node, id) {
//     if (node.id === id) {
//       return true;
//     }
//     for (let element of node.children) {
//       let containNode = _containNode(element, id);
//       if (containNode) {
//         return true;
//       }
//     }
//     return false;
//   }

//   addChildrenPath(node, children) {
//     for (let child of children) {
//       node.path.addPath(child.path);
//     }
//     return node;
//   }

//   drawStepGoLine(stepIndex, nodeIndex, nodeBasePosition, ctx) {
//     const startPosition = [
//       nodeBasePosition[0] + (_stepInterval / 2) + ((stepIndex - 1) * _stepInterval),
//       nodeBasePosition[1] + _stepGoLineYOffset
//     ];
//     drawBasicElement.drawBwfStepGoLine(startPosition, _stepInterval, 0, nodeIndex, ctx,
//       _drawMode.drawBwfStepGoLineMode.go);
//   }

//   drawGroupOfStep(bwfStepGroupNode, stepBasePosition, index, ctx, bwfNodeList) {
//     const nameBasePosition = [
//       stepBasePosition[0],
//       stepBasePosition[1] - _nameSymbolBlank
//     ];
//     for (let child of bwfStepGroupNode.children) {
//       if (child.type === _nodePathType.bwfStepName) {
//         let drawStepNameMode = '';
//         if (_animationState.animationMode === _animationMode.select && _animationState.id === child.id) {
//           drawStepNameMode = _drawMode.drawStepNameMode.selected;
//           ++child.animatedSteps;
//         } else {
//           drawStepNameMode = _drawMode.drawStepNameMode.usual;
//         }
//         child.path.addPath(drawBasicElement.drawBwfStepName(bwfStepGroupNode.userData.sortRuleName, nameBasePosition,
//           ctx, drawStepNameMode, _stepInterval));
//       } else if (child.type === _nodePathType.bwfStepSymbol) {
//         child.path.addPath(drawBasicElement.drawBwfStepSymbol(stepBasePosition, _outputRotatingDegree, index, ctx,
//           _drawMode.drawBwfStepSymbolMode[bwfStepGroupNode.userData.outputNodeId ? 'hasOutput' : 'usual']));
//       } else if (child.type === _nodePathType.bwfReferedNodeName) {
//         let outputNodeIndex = _getIndexOfBwfNodeListByNodeId(bwfNodeList, bwfStepGroupNode.userData.outputNodeId);
//         drawBasicElement.drawBwfStepGoLine(stepBasePosition, _stepInterval, _outputRotatingDegree,
//           outputNodeIndex, ctx, _drawMode.drawBwfStepGoLineMode.output);
//         const referedNodeNameBasePosition = [
//           stepBasePosition[0] + (_stepInterval * Math.cos(_outputRotatingDegree)),
//           stepBasePosition[1] + (_stepInterval * Math.sin(_outputRotatingDegree))
//         ];
//         child.path.addPath(drawBasicElement.drawBwfNodeName(bwfNodeList[outputNodeIndex].nodeName,
//           referedNodeNameBasePosition, outputNodeIndex, ctx, _drawMode.drawBwfNodeNameMode.refered, _stepInterval));
//       }
//     }
//     return _addChildrenPath(bwfStepGroupNode, bwfStepGroupNode.children);
//   }

//   getIndexOfBwfNodeListByNodeId(bwfNodeList, nodeId) {
//     for (let [index, element] of bwfNodeList.entries()) {
//       if (element.nodeId === nodeId) {
//         return index;
//       }
//     }
//   }

//   draw(bwfWorkflowGroupNode, ctx, animationState = {}, basePoint = _basePoint) {
//     _basePoint = basePoint;
//     ctx.clearRect(0, 0, ctx.canvas.getAttribute('width'), ctx.canvas.getAttribute('height'));
//     _animationState.id = animationState.id;
//     _animationState.animationMode = animationState.animationMode;
//     _animationState.offsetX = animationState.offsetX;
//     _animationState.offsetY = animationState.offsetY;

//     var bwfNodeGroupNodeArray = [];
//     for (let child of bwfWorkflowGroupNode.children) {
//       if (child.type === _nodePathType.bwfNodeGroup) {
//         bwfNodeGroupNodeArray.push(child);
//       }
//     }

//     for (let [index, bwfNodeGroupNode] of bwfNodeGroupNodeArray.entries()) {
//       const nodeBasePosition = [
//         basePoint[0],
//         basePoint[1] + (index * _nodeGroupHeight)
//       ];
//       bwfNodeGroupNode = _drawGroupOfNode(bwfNodeGroupNode, nodeBasePosition, index, ctx,
//         bwfWorkflowGroupNode.userData.bwfNodeList);
//     }
//     return _addChildrenPath(bwfWorkflowGroupNode, bwfWorkflowGroupNode.children);
//   }

//   animate(animationState, bwfWorkflowGroupNode, ctx) {
//     if (animationState.animationMode === _animationMode.jumpTo) {
//       let basePoint = [];
//       let idArray = animationState.id.split('_');
//       // var bwfStep = _getNodeId(bwfWorkflowGroupNode, animationState.id);
//       basePoint = [
//         5, -_nodeGroupHeight *
//         _getIndexOfBwfNodeListByNodeId(bwfWorkflowGroupNode.userData.bwfNodeList, Number(idArray[1]))
//       ];
//       var result = _draw(bwfWorkflowGroupNode, ctx, animationState, basePoint);
//       result.basePoint = basePoint;
//       return result;
//     }

//     return this.draw(bwfWorkflowGroupNode, ctx, animationState);
//     // window.requestAnimationFrame(function() {

//     // });
//   }
// }
