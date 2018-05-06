define([
  'hbs!../templates/NodePopTpl.html',
  '../actions/BwfNodeAction',
  'i18n!../i18n/nodePop'
], function(template, action, i18n) {
  return fish.View.extend({
    template: template,
    serialize: i18n,
    events: {
      'click .js-ok': 'okFunc',
      'keypress .js-bwf-node-name': 'onKeyPress'
    },

    afterRender: function() {
      if (!fish.isEmpty(this.options.bwfNode)) {
        this.$('form').form('value', { bwfNodeName: this.options.bwfNode.nodeName });
      }
    },

    onKeyPress: function(event) {

    },

    okFunc: function() {
      if (!this.$('form').isValid()) {
        return;
      }
      var formData = fish.extend(this.options.bwfNode || {}, {
        workflowId: this.options.workflowId,
        firstNode: this.options.firstNode,
        nodeName: this.$('form').form('value').bwfNodeName
      });
      var transmissionData = fish.omit(formData, ['bwfStepList']);
      if (formData.nodeId) {
        action.modBwfNode(transmissionData, function() {
          this.popup.close(formData);
        }.bind(this));
      } else {
        action.addBwfNode(transmissionData, function(data) {
          this.popup.close(data);
        }.bind(this));
      }
    }
  });
});
