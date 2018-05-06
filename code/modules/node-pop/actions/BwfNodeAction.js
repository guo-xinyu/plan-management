define(function() {
  return {
    qryBwfNodeList: function(workflowId, success) {
      return fish.get('tp/bwfWorkflow/' + workflowId + '/bwfNodes', success);
    },

    addBwfNode: function(bwfNode, success) {
      return fish.post('tp/bwfWorkflow/' + bwfNode.workflowId + '/bwfNode', bwfNode, success);
    },

    modBwfNode: function(bwfNode, success) {
      return fish.patch('tp/bwfWorkflow/' + bwfNode.workflowId + '/bwfNode/' + bwfNode.nodeId, bwfNode, success);
    },

    delBwfNode: function(workflowId, nodeId, success) {
      return fish.remove('tp/bwfWorkflow/' + workflowId + '/bwfNode/' + nodeId, success);
    }
  };
});
