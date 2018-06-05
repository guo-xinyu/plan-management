// define([
//   '../actions/BwfWorkflowAction',
//   '../modules/step-pop/actions/BwfStepAction',
//   '../modules/node-pop/actions/BwfNodeAction',
//   '../components/DrawControl',
//   '../components/WorkflowCanvasDataProto',
//   'tp/components/topo-contextmenu',
//   'text!../const/drawMode.json',
//   'text!../const/nodePathType.json',
//   'text!../const/animationMode.json'
// ], function(bwfWorkflowAction, stepAction, bwfNodeAction, drawControl,
//   workflowCanvasDataProto, Contextmenu, drawMode, nodePathType, animationMode) {
//   return fish.View.extend({
//     events: {
//       'click #js-workflow-new-node': 'newNode',
//       'combobox:change .js-combobox-workflow-node': 'locateNode'
//     },

//     initialize: function() {
//       this.bwfWorkflow = {};
//       this.modulePath = 'tp/modules/bwf-workflow-chart/modules/bwf-workflow-entity/';

//       this.drawMode = JSON.parse(drawMode);
//       this.nodePathType = JSON.parse(nodePathType);
//       this.animationMode = JSON.parse(animationMode);
//       this.basePoint = [5, 0];

//       this.bwfWorkflowGroupNode = {};
//     },

//     afterRender: function() {
//       this.initView();
//       setTimeout(function() {
//         let newNodeDom = document.getElementById('js-workflow-new-node');
//         newNodeDom.setAttribute('style', 'display:inline');
//       }, 50);
//     },

//     initBwfNodeCombobox: function() {
//       this.$('.js-combobox-workflow-node').combobox({
//         dataTextField: 'nodeName',
//         dataValueField: 'nodeId',
//         placeholder: i18n.BWF_WORKFLOW_LOCATE_NODE,
//         dataSource: fish.sortBy(this.bwfWorkflow.bwfNodeList, function(eligibilityBwfNode) {
//           return eligibilityBwfNode.nodeId;
//         })
//       });
//     },

//     initView: function() {
//       this.initConTextmenu();
//       this.initWorkflow().then(function() {
//         this.initBwfNodeCombobox();
//       }.bind(this));
//     },

//     locateNode: function(event) {
//       var nodeId = this.$('.js-combobox-workflow-node').combobox('value');
//       var realNodeNameId = this.nodePathType.bwfRealNodeName + '_' + nodeId;
//       var canvas = document.getElementById('js-plan-management-chart');
//       var ctx = canvas.getContext('2d');
//       this.jumpToBwfNode(realNodeNameId, this.bwfWorkflowGroupNode, ctx);
//     },

//     initConTextmenu: function() {
//       var that = this;
//       this.stepContextmenu = new Contextmenu({
//         items: {
//           item1: {
//             name: i18n.BWF_WORKFLOW_INSERT_STEP,
//             callback: function(e, item) {
//               var userData = this;
//               that.popupStepEditor({}, userData.nodeId, userData.execOrder + 1);
//             }
//           },
//           item2: {
//             name: i18n.BWF_WORKFLOW_EDIT_STEP,
//             callback: function(e, item) {
//               var userData = this;
//               that.popupStepEditor(userData, userData.nodeId);
//             }
//           },
//           item3: {
//             name: i18n.BWF_WORKFLOW_DELETE_STEP,
//             callback: function(e, item) {
//               var userData = this;
//               fish.confirm(i18n.CONFIRM_DEL, function() {
//                 stepAction.delBwfStep(that.options.workflowId, userData.nodeId, userData.stepId,
//                   function() {
//                     that.bwfWorkflow = that.deleteBwfStepInBwfWorkflowData(that.bwfWorkflow,
//                       userData);
//                     var canvas = document.getElementById('js-plan-management-chart');
//                     var ctx = canvas.getContext('2d');
//                     that.bwfWorkflowGroupNode = drawControl.draw(that.constructBwfWorkflowGroupNode(that.bwfWorkflow),
//                       ctx, {}, this.basePoint);
//                   });
//               });
//             }
//           }
//         }
//       });
//       this.nodeContextmenu = new Contextmenu({
//         items: {
//           item1: {
//             name: i18n.BWF_WORKFLOW_INSERT_STEP,
//             callback: function(e, item) {
//               var userData = this;
//               that.popupStepEditor({}, userData.nodeId, 1);
//             }
//           },
//           item2: {
//             name: i18n.BWF_WORKFLOW_EDIT_NODE,
//             callback: function(e, item) {
//               that.popupNodeEditor(this);
//             }
//           },
//           item3: {
//             name: i18n.BWF_WORKFLOW_DELETE_NODE,
//             callback: function(e, item) {
//               var userData = this;
//               that.prepareTodeleteBwfNode(userData.nodeId);
//             }
//           }
//         }
//       });
//     },

//     prepareTodeleteBwfNode: function(nodeId) {
//       var hasStepFlag = this.bwfNodeHasBwfStep(this.bwfWorkflow, nodeId);
//       var referStepList = this.bwfStepListReferedBwfNode(this.bwfWorkflow, nodeId);
//       var isReferedFlag = !fish.isEmpty(referStepList);
//       var confirmMessage = '';
//       if (hasStepFlag && isReferedFlag) {
//         confirmMessage += i18n.RATING_DEL_NODE_REASON_STEP_REFER;
//       } else if (hasStepFlag) {
//         confirmMessage += i18n.RATING_DEL_NODE_REASON_STEP;
//       } else if (isReferedFlag) {
//         confirmMessage += i18n.RATING_DEL_NODE_REASON_REFER;
//       }
//       if (hasStepFlag || isReferedFlag) {
//         confirmMessage += '\t' + i18n.RATING_CONFIRM_DEL_NODE;
//         fish.confirm(fish.substitute(confirmMessage, this.splitJointsortRuleNames(referStepList)), function() {
//           this.deleteBwfNode(nodeId);
//         }.bind(this));
//       } else {
//         fish.confirm(i18n.CONFIRM_DEL, function() {
//           this.deleteBwfNode(nodeId);
//         }.bind(this));
//       }
//     },

//     splitJointsortRuleNames: function(bwfStepList) {
//       var stepNamesString = '';
//       for (var count = 0; count <= bwfStepList.length - 1; ++count) {
//         if (count >= 1) {
//           stepNamesString += i18n.TP_COMMA + '\t';
//         }
//         stepNamesString += tpUtil.highlightStyle(bwfStepList[count].sortRuleName);
//         if (count >= 2) {
//           stepNamesString += i18n.TP_ELLIPSIS;
//           break;
//         }
//       }
//       return stepNamesString;
//     },

//     bwfNodeHasBwfStep: function(bwfWorkflow, nodeId) {
//       for (var count = 0; count <= bwfWorkflow.bwfNodeList.length - 1; ++count) {
//         if (bwfWorkflow.bwfNodeList[count].nodeId === nodeId) {
//           return !fish.isEmpty(bwfWorkflow.bwfNodeList[count].bwfStepList);
//         }
//       }
//       return false;
//     },

//     bwfStepListReferedBwfNode: function(bwfWorkflow, nodeId) {
//       var bwfStepList = [];
//       for (var nodeCount = 0; nodeCount <= bwfWorkflow.bwfNodeList.length - 1; ++nodeCount) {
//         var bwfNode = bwfWorkflow.bwfNodeList[nodeCount];
//         if (fish.isEmpty(bwfNode.bwfStepList)) {
//           continue;
//         }
//         for (var stepCount = 0; stepCount <= bwfNode.bwfStepList.length - 1; ++stepCount) {
//           var bwfStep = bwfNode.bwfStepList[stepCount];
//           if (bwfStep.outputNodeId === nodeId) {
//             bwfStepList.push(bwfStep);
//           }
//         }
//       }
//       return bwfStepList;
//     },

//     deleteBwfNode: function(nodeId) {
//       bwfNodeAction.delBwfNode(this.options.workflowId, nodeId, function() {
//         this.bwfWorkflow = this.deleteBwfNodeInBwfWorkflowData(this.bwfWorkflow, nodeId);
//         var canvas = document.getElementById('js-plan-management-chart');
//         var ctx = canvas.getContext('2d');
//         this.bwfWorkflowGroupNode = drawControl.draw(this.constructBwfWorkflowGroupNode(this.bwfWorkflow),
//           ctx, {}, this.basePoint);
//         // this.addEventListener();
//         this.initBwfNodeCombobox();
//       }.bind(this));
//     },

//     deleteBwfNodeInBwfWorkflowData: function(bwfWorkflow, nodeId) {
//       bwfWorkflow.bwfNodeList = fish.filter(bwfWorkflow.bwfNodeList, function(item) {
//         return item.nodeId !== nodeId;
//       });
//       bwfWorkflow.bwfNodeList = fish.sortBy(bwfWorkflow.bwfNodeList, function(item) {
//         return item.nodeId;
//       });
//       fish.each(bwfWorkflow.bwfNodeList, function(bwfNodeItem) {
//         fish.each(bwfNodeItem.bwfStepList, function(bwfStepItem) {
//           if (bwfStepItem.outputNodeId === nodeId) {
//             delete bwfStepItem.outputNodeId;
//           }
//         });
//       });
//       if (!fish.isEmpty(bwfWorkflow.bwfNodeList)) {
//         bwfWorkflow.bwfNodeList[0].firstNode = 'Y';
//       }
//       return bwfWorkflow;
//     },

//     deleteBwfStepInBwfWorkflowData: function(bwfWorkflow, bwfStep) {
//       var bwfNode = {};
//       for (var nodeCount = 0; nodeCount <= bwfWorkflow.bwfNodeList.length - 1; ++nodeCount) {
//         if (bwfWorkflow.bwfNodeList[nodeCount].nodeId !== bwfStep.nodeId) {
//           continue;
//         }
//         bwfNode = bwfWorkflow.bwfNodeList[nodeCount];
//         break;
//       }
//       var stepList = [];
//       fish.each(bwfNode.bwfStepList, function(item) {
//         if (item.stepId === bwfStep.stepId) {
//           return;
//         }
//         if (item.execOrder > bwfStep.execOrder) {
//           --item.execOrder;
//         }
//         stepList.push(item);
//       });
//       bwfNode.bwfStepList = stepList;
//       return bwfWorkflow;
//     },

//     initWorkflow: function() {
//       return bwfWorkflowAction.qryWorkflowDetail(this.options.workflowId, function(bwfWorkflow) {
//         if (fish.isEmpty(bwfWorkflow)) {
//           return;
//         }
//         this.bwfWorkflow = bwfWorkflow;
//         this.drawExistWorkflow(this.bwfWorkflow);
//       }.bind(this));
//     },

//     constructBwfWorkflowGroupNode: function(bwfWorkflow) {
//       var bwfWorkflowGroupNode = workflowCanvasDataProto.constructor(this.nodePathType.bwfWorkflowGroup,
//         new Path2D(), bwfWorkflow, 'workflowName', bwfWorkflow.workflowId);
//       if (!bwfWorkflow.bwfNodeList) {
//         bwfWorkflow.bwfNodeList = [];
//       }
//       for (let bwfNode of bwfWorkflow.bwfNodeList) {
//         let bwfNodeGroupNode = workflowCanvasDataProto.constructor(this.nodePathType.bwfNodeGroup, new Path2D(),
//           bwfNode, 'nodeName', bwfNode.nodeId);
//         bwfNodeGroupNode.children.push(workflowCanvasDataProto.constructor(this.nodePathType.bwfRealNodeName,
//           new Path2D(), {}, '', bwfNode.nodeId));
//         if (!bwfNode.bwfStepList) {
//           bwfNode.bwfStepList = [];
//         }
//         for (let bwfStep of bwfNode.bwfStepList) {
//           let bwfStepGroupNode = workflowCanvasDataProto.constructor(this.nodePathType.bwfStepGroup, new Path2D(),
//             bwfStep, 'sortRuleName', bwfStep.stepId);
//           bwfStepGroupNode.children.push(workflowCanvasDataProto.constructor(this.nodePathType.bwfStepName,
//             new Path2D(), {}, '', bwfStep.stepId));
//           if (bwfStep.outputNodeId) {
//             bwfStepGroupNode.children.push(workflowCanvasDataProto.constructor(this.nodePathType.bwfReferedNodeName,
//               new Path2D(), {}, '', bwfStep.stepId));
//           }
//           bwfStepGroupNode.children.push(workflowCanvasDataProto.constructor(this.nodePathType.bwfStepSymbol,
//             new Path2D(), {}, '', bwfStep.stepId));
//           bwfNodeGroupNode.children.push(bwfStepGroupNode);
//         }
//         bwfWorkflowGroupNode.children.push(bwfNodeGroupNode);
//       }
//       return bwfWorkflowGroupNode;
//     },

//     drawExistWorkflow: function(bwfWorkflow) {
//       var canvas = document.getElementById('js-plan-management-chart');
//       if (canvas.getContext) {
//         var ctx = canvas.getContext('2d');

//         this.bwfWorkflowGroupNode = drawControl.draw(this.constructBwfWorkflowGroupNode(bwfWorkflow), ctx, {},
//           this.basePoint);

//         canvas.addEventListener('contextmenu', this.buildMenu.bind(this));

//         canvas.addEventListener('mousedown', function(e) {
//           if (e.button !== 0) {
//             return;
//           }
//           this.onMouseDown(e);
//         }.bind(this));

//         canvas.addEventListener('dblclick', function(e) {
//           var ctx = e.target.getContext('2d');
//           var bwfWorkflowGroupNode = drawControl.draw(this.constructBwfWorkflowGroupNode(this.bwfWorkflow), ctx, {},
//             this.basePoint);
//           var clickedElement = this.captureEventArea(e.offsetX, e.offsetY, bwfWorkflowGroupNode, ctx);
//           if (!clickedElement) {
//             return;
//           }
//           if (clickedElement.type === this.nodePathType.bwfReferedNodeName) {
//             this.jumptoOutputNode(clickedElement, bwfWorkflowGroupNode, ctx);
//           } else if (clickedElement.type === this.nodePathType.bwfStepSymbol ||
//             clickedElement.type === this.nodePathType.bwfStepName) {
//             let stepData = this.getUserDataById(bwfWorkflowGroupNode, clickedElement.id);
//             this.popupStepEditor(stepData, stepData.nodeId);
//           } else if (clickedElement.type === this.nodePathType.bwfRealNodeName) {
//             let nodeData = this.getUserDataById(bwfWorkflowGroupNode, clickedElement.id);
//             this.popupNodeEditor(nodeData);
//           }

//         }.bind(this));

//       }
//     },

//     jumptoOutputNode: function(clickedElement, bwfWorkflowGroupNode, ctx) {
//       if (clickedElement && clickedElement.type === this.nodePathType.bwfReferedNodeName) {
//         let stepData = _getStepData(bwfWorkflowGroupNode, clickedElement.id);
//         let realNodeNameId = this.nodePathType.bwfRealNodeName + '_' + stepData.outputNodeId;
//         this.jumpToBwfNode(realNodeNameId, bwfWorkflowGroupNode, ctx);
//       }

//       function _getStepData(bwfWorkflowGroupNode, id) {
//         for (let workflowChild of bwfWorkflowGroupNode.children) {
//           for (let nodeChild of workflowChild.children) {
//             for (let stepChild of nodeChild.children) {
//               if (stepChild.id === id) {
//                 return nodeChild.userData;
//               }
//             }
//           }
//         }
//       }
//     },

//     buildMenu: function(event) {
//       var ctx = event.target.getContext('2d');
//       var bwfWorkflowGroupNode = drawControl.draw(this.constructBwfWorkflowGroupNode(this.bwfWorkflow), ctx, {},
//         this.basePoint);
//       var clickedElement = this.captureEventArea(event.offsetX, event.offsetY, bwfWorkflowGroupNode, ctx);
//       if (!clickedElement) {
//         return;
//       }
//       var userData = this.getUserDataById(bwfWorkflowGroupNode, clickedElement.id);

//       event.preventDefault();
//       event.stopPropagation();
//       if ([this.nodePathType.bwfStepName, this.nodePathType.bwfStepSymbol].includes(clickedElement.type)) {
//         this.stepContextmenu.buildMenu(event, userData);
//       } else if (clickedElement.type === this.nodePathType.bwfRealNodeName) {
//         this.nodeContextmenu.buildMenu(event, userData);
//       }
//     },

//     getUserDataById: function(node, id) {
//       if (node.id === id) {
//         if (fish.isEmpty(node.userData)) {
//           return {};
//         }
//         return node.userData;
//       }
//       for (let element of node.children) {
//         var userData = this.getUserDataById(element, id);
//         if (fish.isEmpty(userData) && typeof userData === 'object') {
//           if (fish.isEmpty(node.userData)) {
//             return {};
//           }
//           return node.userData;
//         } else if (!fish.isEmpty(userData)) {
//           return userData;
//         }
//       }
//     },

//     jumpToBwfNode: function(id, bwfWorkflowGroupNode, ctx) {
//       var animationState = {
//         animationMode: this.animationMode.jumpTo,
//         id: id,
//         offsetX: 0,
//         offsetY: 0
//       };

//       var result = drawControl.animate(animationState, bwfWorkflowGroupNode, ctx, this.basePoint);
//       this.basePoint = result.basePoint;
//       delete result.basePoint;
//       this.bwfWorkflowGroupNode = result;
//     },

//     onMouseDown: function(e) {
//       const startPosition = [e.offsetX, e.offsetY];
//       var ctx = e.target.getContext('2d');
//       var selectedNode = this.captureEventArea(e.offsetX, e.offsetY, this.bwfWorkflowGroupNode, ctx);
//       if (selectedNode && selectedNode.type !== this.nodePathType.bwfStepName &&
//         selectedNode.type !== this.nodePathType.bwfStepSymbol &&
//         selectedNode.type !== this.nodePathType.bwfReferedNodeName) {
//         return;
//       }
//       var that = this;

//       function drag(moveEvent) {
//         if (!selectedNode) {
//           let basePoint = [
//             that.basePoint[0] + moveEvent.offsetX - startPosition[0],
//             that.basePoint[1] + moveEvent.offsetY - startPosition[1]
//           ];
//           drawControl.draw(that.constructBwfWorkflowGroupNode(that.bwfWorkflow), ctx, {}, basePoint);
//           return;
//         }

//         var animationState = {
//           animationMode: that.animationMode.drag,
//           id: selectedNode.id,
//           offsetX: moveEvent.offsetX - startPosition[0],
//           offsetY: 0
//         };
//         var bwfWorkflowGroupNode = drawControl.draw(that.constructBwfWorkflowGroupNode(that.bwfWorkflow), ctx, {},
//           that.basePoint);
//         window.requestAnimationFrame(function() {
//           drawControl.animate(animationState, bwfWorkflowGroupNode, ctx);
//         });
//       }
//       e.target.addEventListener('mousemove', drag);
//       e.target.addEventListener('mouseup', function(mouseupEvent) {
//         mouseupEvent.target.removeEventListener('mousemove', drag);
//         if (!selectedNode) {
//           that.basePoint = [
//             that.basePoint[0] + mouseupEvent.offsetX - startPosition[0],
//             that.basePoint[1] + mouseupEvent.offsetY - startPosition[1]
//           ];
//           that.bwfWorkflowGroupNode = drawControl.draw(that.constructBwfWorkflowGroupNode(that.bwfWorkflow), ctx, {},
//             that.basePoint);
//           return;
//         }
//         var bwfWorkflowGroupNode = drawControl.draw(that.constructBwfWorkflowGroupNode(that.bwfWorkflow), ctx,
//           that.basePoint);
//         var offsetX = mouseupEvent.offsetX - startPosition[0];
//         if (offsetX === 0) {
//           return;
//         }
//         var animationState = {
//           animationMode: '',
//           id: selectedNode.id,
//           offsetX: offsetX,
//           offsetY: 0
//         };
//         bwfWorkflowGroupNode = drawControl.animate(animationState, bwfWorkflowGroupNode, ctx);
//         var toModStepArray = [];
//         var currentNode = 0;
//         for (let bwfNodeGroupNode of bwfWorkflowGroupNode.children) {
//           let stepIndex = 0;
//           for (let bwfStepGroupNode of bwfNodeGroupNode.children) {
//             if (bwfStepGroupNode.type === that.nodePathType.bwfStepGroup) {
//               if (stepIndex !== bwfStepGroupNode.userData.execOrder) {
//                 currentNode = bwfNodeGroupNode.userData;
//                 toModStepArray.push({
//                   stepId: bwfStepGroupNode.userData.stepId,
//                   execOrder: stepIndex
//                 });
//               }
//               ++stepIndex;
//             }
//           }
//           if (!fish.isEmpty(toModStepArray)) {
//             break;
//           }
//         }
//         if (!fish.isEmpty(toModStepArray)) {
//           stepAction.patchBwfStepList(currentNode.workflowId, currentNode.nodeId, toModStepArray, function() {
//             for (let bwfNode of that.bwfWorkflow.bwfNodeList) {
//               if (bwfNode.nodeId !== currentNode.nodeId) {
//                 continue;
//               }
//               for (let bwfStep of bwfNode.bwfStepList) {
//                 for (let toModStep of toModStepArray) {
//                   if (bwfStep.stepId === toModStep.stepId) {
//                     bwfStep.execOrder = toModStep.execOrder;
//                   }
//                 }
//               }
//               bwfNode.bwfStepList = fish.sortBy(bwfNode.bwfStepList, function(element) {
//                 return element.execOrder;
//               });
//             }
//             that.bwfWorkflowGroupNode = drawControl.draw(that.constructBwfWorkflowGroupNode(that.bwfWorkflow),
//               ctx, {}, that.basePoint);
//           });
//         }
//       }, { once: true });
//     },

//     selectNode: function(e) {
//       var ctx = e.target.getContext('2d');
//       var bwfWorkflowGroupNode = drawControl.draw(this.constructBwfWorkflowGroupNode(this.bwfWorkflow), ctx, {},
//         this.basePoint);

//       var clickedElement = this.captureEventArea(e.offsetX, e.offsetY, bwfWorkflowGroupNode, ctx);
//       if (clickedElement && clickedElement.type === this.nodePathType.bwfStepName) {
//         let animationState = {
//           animationMode: this.animationMode.select,
//           id: clickedElement.id
//         };
//         drawControl.animate(animationState, bwfWorkflowGroupNode, ctx);
//       } else if (!clickedElement) {
//         drawControl.draw(bwfWorkflowGroupNode, ctx, {}, this.basePoint);
//       }
//     },

//     captureEventArea: function(offsetX, offsetY, node, ctx) {
//       if (fish.isEmpty(node.children)) {
//         return node;
//       }
//       for (let element of node.children) {
//         if (ctx.isPointInPath(element.path, offsetX, offsetY)) {
//           return this.captureEventArea(offsetX, offsetY, element, ctx);
//         }
//       }
//     },

//     resize: function(delta) {
//       var canvas = document.getElementById('js-plan-management-chart');
//       // var height = canvas.getAttribute('height');
//       canvas.setAttribute('height', this.$el.parents('.js-billing-workflow-chart-select').parent().parent().height() -
//         30);
//       canvas.setAttribute('width', this.$el.parents('.js-billing-workflow-chart-select').parent().parent().width() -
//         5);
//       var ctx = canvas.getContext('2d');
//       this.bwfWorkflowGroupNode = drawControl.draw(this.constructBwfWorkflowGroupNode(this.bwfWorkflow), ctx, {},
//         this.basePoint);
//       // portal.utils.incHeight(this.$('#js-billing-workflow-chart'), delta);
//     },

//     newNode: function(event) {
//       this.popupNodeEditor();
//     },

//     popupNodeEditor: function(userData = {}) {
//       var firstNode = '';
//       if (fish.isEmpty(userData)) {
//         firstNode = fish.isEmpty(this.bwfWorkflow.bwfNodeList) ? 'Y' : 'N';
//       } else {
//         firstNode = userData.firstNode;
//       }
//       fish.popupView({
//         url: this.modulePath + 'modules/node-pop/views/NodePopView',
//         width: '45%',
//         viewOption: {
//           workflowId: this.options.workflowId,
//           firstNode: firstNode,
//           bwfNode: userData
//         },
//         close: function(result) {
//           if (fish.isEmpty(result)) {
//             return;
//           }
//           if (!this.bwfWorkflow.bwfNodeList) {
//             this.bwfWorkflow.bwfNodeList = [];
//           }
//           for (let bwfNode of this.bwfWorkflow.bwfNodeList) {
//             if (bwfNode.nodeId === result.nodeId) {
//               bwfNode = Object.assign(bwfNode, result);
//               break;
//             }
//           }
//           if (!this.bwfWorkflow.bwfNodeList.find(bwfNode => bwfNode.nodeId === result.nodeId)) {
//             this.bwfWorkflow.bwfNodeList.push(result);
//           }
//           var canvas = document.getElementById('js-plan-management-chart');
//           var ctx = canvas.getContext('2d');
//           this.bwfWorkflowGroupNode = drawControl.draw(this.constructBwfWorkflowGroupNode(this.bwfWorkflow), ctx, {},
//             this.basePoint);
//         }.bind(this)
//       });
//     },

//     popupStepEditor: function(userData, nodeId, execOrder) {
//       fish.popupView({
//         url: this.modulePath + 'modules/step-pop/views/StepPopView',
//         width: '85%',
//         viewOption: {
//           workflowType: this.options.workflowType,
//           workflowId: this.options.workflowId,
//           nodeId: nodeId,
//           stepId: fish.isEmpty(userData) ? null : userData.stepId,
//           execOrder: execOrder
//         },
//         close: function(result) {
//           if (fish.isEmpty(result)) {
//             return;
//           }
//           var canvas = document.getElementById('js-plan-management-chart');
//           var ctx = canvas.getContext('2d');
//           this.bwfWorkflow = this.updateBwfWorkflowData(result);
//           this.bwfWorkflowGroupNode = drawControl.draw(this.constructBwfWorkflowGroupNode(this.bwfWorkflow), ctx, {},
//             this.basePoint);
//         }.bind(this)
//       });
//     },

//     updateBwfWorkflowData: function(bwfStep) {
//       for (var count = 0; count <= this.bwfWorkflow.bwfNodeList.length - 1; ++count) {
//         if (this.bwfWorkflow.bwfNodeList[count].nodeId !== bwfStep.nodeId) {
//           continue;
//         }
//         var bwfNode = this.bwfWorkflow.bwfNodeList[count];
//         if (fish.isEmpty(bwfNode.bwfStepList)) {
//           bwfNode.bwfStepList = [];
//           bwfNode.bwfStepList.push(bwfStep);
//           return this.bwfWorkflow;
//         }
//         for (var stepCount = 0; stepCount <= bwfNode.bwfStepList.length - 1; ++stepCount) {
//           if (bwfNode.bwfStepList[stepCount].execOrder < bwfStep.execOrder) {
//             continue;
//           }
//           if (bwfNode.bwfStepList[stepCount].stepId === bwfStep.stepId) {
//             bwfNode.bwfStepList[stepCount] = bwfStep;
//             return this.bwfWorkflow;
//           }
//           ++bwfNode.bwfStepList[stepCount].execOrder;
//         }
//         bwfNode.bwfStepList.push(bwfStep);
//         bwfNode.bwfStepList = fish.sortBy(bwfNode.bwfStepList, function(item) {
//           return item.execOrder;
//         });
//         return this.bwfWorkflow;
//       }
//     }
//   });
// });

import { FlowChart } from './components/flow-chart/FlowChart.js';

main();

function main() {
  const flowChart = new FlowChart(document.getElementById('js-plan-management-chart'));
  if (flowChart.main) {
    flowChart.main();
  }
  // console.log(flowChart);
}
