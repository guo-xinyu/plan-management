define(function() {
  return {
    // qryAllBwfStep: function(workFlowId, success) {
    //   return fish.get('tp/bwfWorkflow/' + workFlowId + '/bwfSteps', success);
    // },

    addOrModBwfStep: function(workFlowId, bwfStep, success) {
      return fish.post('tp/bwfWorkflow/' + workFlowId + '/bwfNode/' + bwfStep.nodeId + '/bwfStep', bwfStep,
        success);
    },

    qryBwfStepDetail: function(workFlowId, nodeId, stepId, success) {
      return fish.get('tp/bwfWorkflow/' + workFlowId + '/bwfNode/' + nodeId + '/bwfStep/' + stepId,
        success);
    },

    modBwfStep: function(workFlowId, nodeId, bwfStep, success) {
      return fish.put('tp/bwfWorkflow/' + workFlowId + '/bwfNode/' + nodeId + '/bwfStep', bwfStep,
        success);
    },

    delBwfStep: function(workFlowId, nodeId, stepId, success) {
      return fish.remove('tp/bwfWorkflow/' + workFlowId + '/bwfNode/' + nodeId + '/bwfStep/' + stepId,
        success);
    },

    patchBwfStep: function(workFlowId, nodeId, bwfStep, success) {
      return fish.patch('tp/bwfWorkflow/' + workFlowId + '/bwfNode/' + nodeId + '/bwfStep/' +
        bwfStep.stepId, bwfStep, success);
    },

    patchBwfStepList: function(workFlowId, nodeId, bwfStepList, success) {
      return fish.patch('tp/bwfWorkflow/' + workFlowId + '/bwfNode/' + nodeId + '/bwfSteps', bwfStepList, success);
    }
  };
});
