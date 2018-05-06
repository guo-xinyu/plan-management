define([
  'hbs!../templates/ConditionSegEditTpl.html',
  '../actions/ConditionSegEditAction',
  'i18n!../i18n/conditionSegEdit'
], function(AddConditionSegPopTpl, action, i18n) {
  return fish.View.extend({
    template: AddConditionSegPopTpl,
    serialize: i18n,
    events: {
      'change input[name="isConst"]': 'changeRValueType',
      'combobox:change input[name="function"]': 'changerlFunctionId',
      'combobox:change input[name="rFunction"]': 'changerRFunctionId',
      'click .js-ok-condition-seg': 'okFunc',
      'click .js-cancel-condition-seg': 'cancelFunc'
    },

    afterRender: function() {
      this.initReAttr().then(function() {
        this.initSortFunctionCombobox().then(function() {
          this.initSortOperatorCombobox().then(function() {
            this.loadFormData();
          }.bind(this));
        }.bind(this));
      }.bind(this));
      this.$('input[name="isConst"]').icheck();
    },

    initSortFunctionCombobox: function() {
      var functionRequest = {
        functionType: this.getFunctionType(),
        usage: 'A%'
      };
      return action.qrySortFunctionList(functionRequest, function(functionList) {
        this.functionList = fish.sortBy(functionList, function(reAttr) {
          return reAttr.function.toUpperCase();
        });
        this.$('.js-function-id').combobox({
          dataTextField: 'function',
          dataValueField: 'function',
          dataSource: this.functionList,
          placeholder: i18n.RATING_CONDITION_FUNCTION
        });
      }.bind(this));
    },

    initSortOperatorCombobox: function() {
      return action.qrySortOperatorList(function(sortOperatorList) {
        this.operatorList = sortOperatorList;
        this.$('form').find('[name=\'sortOperator\']').combobox({
          dataTextField: 'sortOperatorName',
          dataValueField: 'sortOperator',
          dataSource: sortOperatorList,
          placeholder: i18n.RATING_CONDITION_OPERATOR
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

    loadFormData: function() {
      if (fish.isEmpty(this.options.bwfCond)) {
        return;
      }
      this.$('form').form('value', fish.clone(this.options.bwfCond));
      if (fish.isEqual(this.options.bwfCond.isConst, 'N')) {
        this.functionShowMode();
      } else {
        this.constantShowMode();
      }
      this.changerlFunctionId();
      this.changerRFunctionId();
    },

    initReAttr: function() {
      return action.qryReAttrList(function(data) {
        this.reAttrList = fish.sortBy(data, function(reAttr) {
          return reAttr.reAttrName.toUpperCase();
        });
        this.$('.js-re-attr').combobox({
          dataTextField: 'reAttrName',
          dataValueField: 'reAttr',
          dataSource: this.reAttrList,
          placeholder: i18n.RATING_CONDITION_OBJECT_EVENT_PROPERTY
        });
      }.bind(this));
    },

    changeRValueType: function(e) {
      var type = e.target.value;
      switch (type) {
        case 'Y':
          this.constantShowMode();
          break;
        case 'N':
          this.functionShowMode();
          break;
        default:
          break;
      }
    },

    constantShowMode: function() {
      this.showInput('operand');
      this.hideInput('rReAttr');
      this.hideInput('rFunction');
      this.hideInput('rParam1');
      this.hideInput('rParam2');
      this.$('.js-bracket-left-right-function').hide();
      this.$('.js-bracket-right-right-function').hide();
    },

    functionShowMode: function() {
      this.hideInput('operand');
      this.showInput('rReAttr');
      this.showInput('rFunction');
      this.showInput('rParam1');
      this.showInput('rParam2');
      this.$('.js-bracket-left-right-function').show();
      this.$('.js-bracket-right-right-function').show();
    },

    changerlFunctionId: function() {
      var selFuncId = this.$('input[name=\'function\']').combobox('getSelectedItem');
      var paramNum = 0;
      if (!fish.isEmpty(selFuncId)) {
        paramNum = selFuncId.paramNum;
      }
      if (paramNum === 0) {
        this.$('input[name="param1"]').addClass('disabled');
        this.$('input[name="param1"]').val('');
        this.$('input[name="param2"]').addClass('disabled');
        this.$('input[name="param2"]').val('');
        return;
      }
      if (paramNum === 1) {
        this.$('input[name="param1"]').removeClass('disabled');
        this.$('input[name="param2"]').addClass('disabled');
        this.$('input[name="param2"]').val('');
        return;
      }
      if (paramNum === 2) {
        this.$('input[name="param1"]').removeClass('disabled');
        this.$('input[name="param2"]').removeClass('disabled');
      }
    },

    changerRFunctionId: function() {
      var selFuncId = this.$('input[name=\'rFunction\']').combobox('getSelectedItem');
      var paramNum = 0;
      if (!fish.isEmpty(selFuncId)) {
        paramNum = selFuncId.paramNum;
      }
      if (paramNum === 0) {
        this.$('input[name="rParam1"]').addClass('disabled');
        this.$('input[name="rParam2"]').addClass('disabled');
        return;
      }
      if (paramNum === 1) {
        this.$('input[name="rParam1"]').removeClass('disabled');
        this.$('input[name="rParam2"]').addClass('disabled');
        return;
      }
      if (paramNum === 2) {
        this.$('input[name="rParam1"]').removeClass('disabled');
        this.$('input[name="rParam2"]').removeClass('disabled');
      }
    },

    showInput: function(inputName) {
      this.$('.js-' + inputName).show();
      if (fish.isEqual(inputName, 'operand') || fish.isEqual(inputName, 'rReAttr') ||
        fish.isEqual(inputName, 'reAttr')) {
        this.$('form').validator('setField', inputName, 'required');
      }
    },

    hideInput: function(inputName) {
      this.$('.js-' + inputName).hide();
      if (fish.isEqual(inputName, 'operand') || fish.isEqual(inputName, 'rReAttr') ||
        fish.isEqual(inputName, 'reAttr')) {
        this.$('form').validator('setField', inputName);
      }
    },

    okFunc: function() {
      if (!this.$('form').isValid()) {
        return;
      }
      var formdata = fish.extend(this.$('form').form('value'), {
        reAttrName: this.$('input[name="reAttr"]').combobox('text'),
        sortOperatorName: this.$('input[name="sortOperator"]').combobox('text')
      });
      if (formdata.isConst === 'Y') {
        delete formdata.rFunction;
        delete formdata.rReAttr;
        delete formdata.rParam1;
        delete formdata.rParam2;
      } else if (formdata.isConst === 'N') {
        delete formdata.operand;
        formdata = fish.extend(formdata, {
          rReAttrName: this.$('input[name="rReAttr"]').combobox('text')
        });
      }
      return this.trigger('closeConditionEdit', formdata);
    },

    cancelFunc: function() {
      this.trigger('closeConditionEdit');
    }
  });
});
