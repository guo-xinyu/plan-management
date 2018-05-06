define([
  'hbs!../templates/ActionSegEditTpl.html',
  '../actions/ActionSegEditAction',
  'i18n!../i18n/actionSegEdit'
], function(template, action, i18n) {
  return fish.View.extend({
    template: template,
    serialize: i18n,
    events: {
      'combobox:change input[name="function"]': 'changeFunction',
      'click .js-ok-action-seg': 'okFunc',
      'click .js-cancel-action-seg': 'cancelFunc'
    },

    afterRender: function() {
      this.initReAttr().then(function() {
        this.initSortFunctionCombobox().then(function() {
          this.$('form').form('value', this.options.bwfAction);
          this.changeFunction();
        }.bind(this));
      }.bind(this));
    },

    initReAttr: function() {
      return action.qryReAttrList(function(data) {
        this.allReAttr = fish.sortBy(data, function(item) {
          return item.reAttrName.toUpperCase();
        });
        this.$('input[name="objReAttr"]').combobox({
          dataTextField: 'reAttrName',
          dataValueField: 'reAttr',
          dataSource: this.allReAttr,
          placeholder: i18n.RATING_ACTION_OBJECT_PROPERTY
        });
        this.$('input[name="srcReAttr"]').combobox({
          dataTextField: 'reAttrName',
          dataValueField: 'reAttr',
          dataSource: this.allReAttr,
          placeholder: i18n.RATING_ACTION_SOURCE_PROPERTY
        });
      }.bind(this));
    },

    initSortFunctionCombobox: function() {
      var functionRequest = {
        functionType: this.getFunctionType(),
        usage: '_A%'
      };
      return action.qrySortFunctionList(functionRequest, function(functionList) {
        this.sortFunctionList = fish.sortBy(functionList, function(item) {
          return item.function.toUpperCase();
        });
        this.$('.js-combobox-function').combobox({
          dataTextField: 'function',
          dataValueField: 'function',
          dataSource: this.sortFunctionList,
          placeholder: i18n.RATING_ACTION_FUNCTION
        });
      }.bind(this));
    },

    getFunctionType: function() {
      switch (this.options.workflowType) {
        case 'B':
          return '__A%';
        case 'C':
          return '_A%';
        case 'E':
          return '___A%';
        case 'D':
          return '____A%';
        default:
          return 'A%';
      }
    },

    changeFunction: function() {
      var selFuncId = this.$('input[name="function"]').combobox('getSelectedItem');
      var paramNum = 0;
      if (!fish.isEmpty(selFuncId)) {
        paramNum = selFuncId.paramNum;
      }
      if (paramNum === 0) {
        this.$('input[name="param1"]').addClass('disabled');
        this.$('input[name="param2"]').addClass('disabled');
      } else if (paramNum === 1) {
        this.$('input[name="param1"]').removeClass('disabled');
        this.$('input[name="param2"]').addClass('disabled');
      } else if (paramNum === 2) {
        this.$('input[name="param1"]').removeClass('disabled');
        this.$('input[name="param2"]').removeClass('disabled');
      }
    },

    okFunc: function() {
      if (!this.$('form').isValid()) {
        return;
      }
      var formdata = fish.extend(this.$('form').form('value'), {
        objReAttrName: this.$('input[name="objReAttr"]').combobox('text'),
        srcReAttrName: this.$('input[name="srcReAttr"]').combobox('text')
      });
      return this.trigger('closeActionEdit', formdata);
    },

    cancelFunc: function() {
      this.trigger('closeActionEdit');
    }
  });
});
