define(function () {
  return {
    qryWorkflowDetail: function (workFlowId, success) {
      return fish.get('tp/bwfWorkflow/' + workFlowId, success);
    }
  };
});