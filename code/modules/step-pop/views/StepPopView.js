define([
  'hbs!../templates/StepPopTpl.html',
  'hbs!../templates/ConditionGroupTpl.html',
  'hbs!../templates/ConditionItemTpl.html',
  'hbs!../templates/AndBtnTpl.html',
  'hbs!../templates/OrBtnTpl.html',
  '../actions/BwfSysActionAction',
  '../actions/BwfStepAction',
  '../../../modules/node-pop/actions/BwfNodeAction',
  'i18n!../i18n/stepPop'
], function(AddConditionPopTpl, ConditionGroupTpl, ConditionItemTpl, AndBtnTpl, OrBtnTpl, sysActionAction,
  bwfStepAction, bwfNodeAction, i18n) {
  return fish.View.extend({
    template: AddConditionPopTpl,
    groupTpl: ConditionGroupTpl,
    conditionItemTpl: ConditionItemTpl,
    andBtnTpl: AndBtnTpl,
    orBtnTpl: OrBtnTpl,
    serialize: i18n,
    events: {
      'grid:beforeeditrow .js-grid-action': 'editAction',
      'grid:ondblclickrow .js-grid-action': 'editAction',
      'click .js-add-action': 'addAction',
      'click .js-add-unit': 'addConditionUnit',
      'click .js-or-link': 'addCon',
      'click .js-and-link': 'addCon',
      'click .js-delete-condition-seg': 'delCon',
      'click .js-title-condition-seg': 'modCon',
      'click .js-ok': 'okFunc'
    },

    initialize: function() {
      this.lineIndex = 0;
      this.conIndex = 0;
      this.conditionList = [];

      this.actionLineNum = 0;
      this.bwfStep = {};
    },

    afterRender: function() {
      this.$('.js-tabs-expression-result').tabs();
      this.$('.js-datetime').datetimepicker({
        viewType: 'date',
        format: 'yyyy-mm-dd hh:ii:ss',
        todayBtn: true
      });
      this.initOutputNodeCombobox().then(function() {
        this.initSysActionCombobox().then(function() {
          this.qryBwfStepDetail().then(function(bwfStepData) {
            if (fish.isEmpty(bwfStepData)) {
              return;
            }
            this.bwfStep = bwfStepData;
            var bwfStep = fish.extend(bwfStepData, {
              effDate: fish.dateutil.format(fish.dateutil.parse(bwfStepData.effDate, 'yyyy-mm-dd hh:ii:ss'),
                'yyyy-mm-dd'),
              expDate: bwfStepData.expDate ?
                fish.dateutil.format(fish.dateutil.parse(bwfStepData.expDate, 'yyyy-mm-dd hh:ii:ss'), 'yyyy-mm-dd') : ''
            });
            this.fillUpExistsCondition(bwfStepData.bwfCondGroupList);
            this.$('form').form('value', fish.extend(bwfStep, {
              sysActionName: fish.isEmpty(bwfStep.bwfSysAction) ? '' : bwfStep.bwfSysAction.sysActionName
            }));
            if (!fish.isEmpty(bwfStep.bwfActionList)) {
              this.initActionGrid(bwfStep.bwfActionList);
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));
    },

    qryBwfStepDetail: function() {
      if (!this.options.stepId) {
        return this.toPromise();
      }
      return bwfStepAction.qryBwfStepDetail(this.options.workflowId, this.options.nodeId, this.options.stepId);
    },

    initOutputNodeCombobox: function() {
      return bwfNodeAction.qryBwfNodeList(this.options.workflowId, function(bwfNodeList) {
        var eligibilityBwfNodes = fish.filter(bwfNodeList, function(beforeFilterBwfNode) {
          return beforeFilterBwfNode.nodeId > this.options.nodeId;
        }.bind(this));
        this.$('.js-combobox-output-node').combobox({
          dataTextField: 'nodeName',
          dataValueField: 'nodeId',
          placeholder: i18n.RATING_STEP_NODE_AFTER_THIS_NODE,
          dataSource: fish.sortBy(eligibilityBwfNodes, function(eligibilityBwfNode) {
            return eligibilityBwfNode.nodeName.toUpperCase();
          })
        });
        if (fish.isEmpty(eligibilityBwfNodes)) {
          this.$('.js-combobox-output-node').combobox('disable');
        }
      }.bind(this));
    },

    initActionGrid: function(bwfActionList) {
      fish.each(bwfActionList, function(item) {
        ++this.actionLineNum;
        item = fish.extend(item, {
          segTitle: this.generateActionSegTitle(item)
        });
      }.bind(this));
      var colModel = [{
        name: 'seq',
        hidden: true,
        key: true
      }, {
        name: 'segTitle',
        editable: false,
        width: '80%'
      }, {
        formatter: 'actions',
        width: '20%',
        formatoptions: {
          editbutton: true,
          delbutton: true
        }
      }];
      var option = {
        data: bwfActionList,
        altRows: true,
        forceFit: true,
        colModel: colModel,
        height: 'auto',
        editIcons: {
          edit: 'iconfont icon-pencil',
          del: 'iconfont icon-trash',
          save: 'iconfont icon-ok',
          cancel: 'iconfont icon-delete'
        }
      };
      this.$('.js-grid-action').grid(option);
      this.$('.js-grid-action').grid('sortableRows');
    },

    editAction: function(event, rowId) {
      var theRowId = Number(rowId);
      this.showActionEditView(theRowId, this.$('.js-grid-action').grid('getRowData', theRowId));
    },

    initSysActionCombobox: function() {
      return sysActionAction.qryAllSysActionFunction(function(data) {
        this.$('.js-combobox-system-action').combobox({
          dataTextField: 'sysActionName',
          dataValueField: 'sysActionName',
          dataSource: fish.sortBy(data, function(item) {
            return item.sysActionName.toUpperCase();
          }),
          placeholder: i18n.RATING_ACTION_SYSTEM_ACTION
        });
      }.bind(this));
    },

    addAction: function(event) {
      this.showActionEditView(++this.actionLineNum);
    },

    showActionEditView: function(actionLineNum, bwfAction) {
      this.requireView({
        url: 'tp/modules/bwf-workflow-chart/modules/bwf-workflow-entity/modules/step-pop/modules/' +
          'action-seg-edit/views/ActionSegEditView',
        selector: '.js-action-edit',
        viewOption: {
          workflowType: this.options.workflowType,
          bwfAction: bwfAction
        },
        callback: function(view) {
          this.listenTo(view, 'closeActionEdit', function(result) {
            this.removeView(view);
            if (fish.isEmpty(result)) {
              return;
            }
            var bwfAction = fish.extend(result, {
              seq: actionLineNum
            });
            var gridInstance = this.$('.js-grid-action').grid('instance');
            if (fish.isEmpty(gridInstance)) {
              this.initActionGrid([]);
            }
            // this.replaceOrAddActionItem(bwfAction);
            var gridRowData = this.$('.js-grid-action').grid('getRowData', actionLineNum);
            if (fish.isEmpty(gridRowData)) {
              this.$('.js-grid-action').grid('addRowData', fish.extend(bwfAction, {
                segTitle: this.generateActionSegTitle(bwfAction)
              }));
            } else {
              this.$('.js-grid-action').grid('setRowData', actionLineNum, fish.extend(bwfAction, {
                segTitle: this.generateActionSegTitle(bwfAction)
              }));
            }
          }.bind(this));
        }.bind(this)
      });
    },

    generateActionSegTitle: function(bwfAction) {
      return bwfAction.objReAttrName + '\t=\t' + (bwfAction['function'] ? bwfAction['function'] : '') + '(' +
        bwfAction.srcReAttrName + (bwfAction.param1 ? ',\t' + bwfAction.param1 : '') + (bwfAction.param2 ? ',\t' +
          bwfAction.param2 : '') + ')';
    },

    fillUpExistsCondition: function(bwfCondGroupList) {
      if (fish.isEmpty(bwfCondGroupList)) {
        return;
      }
      fish.each(bwfCondGroupList, function(groupItem, groupIndex) {
        var bwfCondList = [];
        fish.each(groupItem.bwfCondList, function(condItem, index) {
          var showData = fish.extend(condItem, {
            index: ++this.conIndex,
            lineIndex: groupIndex + 1
          });
          this.showContent(showData);
          bwfCondList.push(showData);
        }.bind(this));
        this.conditionList.push({
          condGroupId: groupItem.condGroupId,
          stepId: groupItem.stepId,
          spId: groupItem.spId,
          lineIndex: groupIndex + 1,
          bwfCondList: bwfCondList
        });
      }.bind(this));
    },

    generateConditionSegTitle: function(bwfCond) {
      var expression = (bwfCond['function'] ? bwfCond['function'] : '') + '(' + bwfCond.reAttrName +
        (bwfCond.param1 ? ',\t' + bwfCond.param1 : '') + (bwfCond.param2 ? ',\t' + bwfCond.param2 : '') + ')\t' +
        bwfCond.sortOperatorName + '\t';
      if (fish.isEqual(bwfCond.isConst, 'Y')) {
        expression += bwfCond.operand;
      } else {
        expression += (bwfCond.rFunction ? bwfCond.rFunction : '') + '(' + bwfCond.rReAttrName +
          (bwfCond.rParam1 ? ',\t' + bwfCond.rParam1 : '') + (bwfCond.rParam2 ? ',\t' + bwfCond.rParam2 : '') +
          ')';
      }
      return expression;
    },

    addConditionUnit: function(event) {
      this.showConditionEditView(1, ++this.conIndex);
    },

    addCon: function(e) {
      if (this.$(e.target).hasClass('add-static')) {
        return;
      }
      var selLineIndex = Number(this.$(e.target).parents('.js-condition-group').attr('data-index'));
      this.showConditionEditView(selLineIndex, ++this.conIndex);
    },

    showConditionEditView: function(lineIndex, conIndex, bwfCond) {
      this.requireView({
        url: 'tp/modules/bwf-workflow-chart/modules/bwf-workflow-entity/modules/step-pop/modules/' +
          'condition-seg-edit/views/ConditionSegEditView',
        selector: '.js-area-condition-edit',
        viewOption: {
          workflowType: this.options.workflowType,
          bwfCond: bwfCond
        },
        callback: function(view) {
          this.listenTo(view, 'closeConditionEdit', function(result) {
            this.removeView(view);
            if (fish.isEmpty(result)) {
              return;
            }
            var addData = fish.extend(result, {
              index: conIndex,
              lineIndex: lineIndex
            });
            this.showContent(addData);
            delete addData.segTitle;
            this.replaceOrAddItem(this.conditionList, addData);
          }.bind(this));
        }.bind(this)
      });
    },

    showFirstAndBtnSpace: function() {
      this.$(this.$('.js-and-link')[0]).html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    },

    showContent: function(data) {
      if (!this.$('.js-condition-content').is(':visible')) {
        this.$('.js-condition-content').show();
        this.$('.js-add-unit').hide();
        this.$('.js-condition-content').append(this.groupTpl({
          lineIndex: ++this.lineIndex
        }));
        this.$('.js-cond-group-' + this.lineIndex).append(this.andBtnTpl(i18n));
      }
      if (!fish.isEmpty(data)) {
        var toDisplay = {
          title: this.generateConditionSegTitle(data),
          conIndex: data.index,
          lineIndex: data.lineIndex
        };
        if (this.$('.js-condition-seg-' + data.lineIndex + '-' + data.index).length >= 1) {
          this.$('.js-condition-seg-' + data.lineIndex + '-' + data.index)
            .replaceWith(this.conditionItemTpl(toDisplay));
          return;
        }
        this.$('.js-cond-group-' + data.lineIndex).append(this.conditionItemTpl(toDisplay));
        this.$('.js-cond-group-' + data.lineIndex).append(this.orBtnTpl(i18n));
      }
      var conditionGroupLabelContainers = this.$('.js-condition-group');
      for (var count = 0; count <= conditionGroupLabelContainers.length - 1; ++count) {
        if (this.$(conditionGroupLabelContainers[count]).find('.js-condition-seg').length === 0) {
          this.disableAndOr();
          return;
        }
      }
      this.$('.js-condition-content').append(this.groupTpl({
        lineIndex: ++this.lineIndex
      }));
      this.$('.js-cond-group-' + this.lineIndex).append(this.andBtnTpl(i18n));
      // 灰化按钮
      this.disableAndOr();
      this.showFirstAndBtnSpace();
    },

    modCon: function(event) {
      var selLineIndex = Number(this.$(event.target).parents('.js-condition-seg').attr('data-line-index'));
      var selConIndex = Number(this.$(event.target).parents('.js-condition-seg').attr('data-index'));
      var bwfCond = this.searchCondInGroupByIndex(this.conditionList, selLineIndex, selConIndex);
      this.showConditionEditView(selLineIndex, selConIndex, bwfCond);
    },

    delCon: function(e) {
      var selConIndex = Number(this.$(e.target).parents('.js-condition-seg').attr('data-index'));
      var selLineIndex = Number(this.$(e.target).parents('.js-condition-seg').attr('data-line-index'));
      delete this.searchCondInGroupByIndex(this.conditionList, selLineIndex, selConIndex);
      fish.each(this.conditionList, function(groupItem) {
        groupItem.bwfCondList = fish.filter(groupItem.bwfCondList, function(condItem) {
          return condItem.index !== selConIndex || condItem.lineIndex !== selLineIndex;
        });
      });
      this.conditionList = fish.filter(this.conditionList, function(item) {
        return !fish.isEmpty(item.bwfCondList);
      });
      var liSize = this.$(e.target).parents('.js-condition-group').find('.js-condition-seg').length;
      if (liSize === 1) {
        this.$(e.target).parents('.js-condition-group').remove();
      } else {
        this.$(e.target).parents('.js-condition-seg').next().remove();
        this.$(e.target).parents('.js-condition-seg').remove();
      }
      if (this.$('.js-condition-content').find('.js-condition-seg').length === 0) {
        this.$('.js-condition-content').empty();
        this.$('.js-condition-content').hide();
        this.$('.js-add-unit').show();
        this.lineIndex = 0;
      }
      this.disableAndOr();
      this.showFirstAndBtnSpace();
    },

    disableAndOr: function() {
      var that = this;
      // 与
      var orLength = this.$('.js-and-link').length;
      if (orLength > 0) {
        this.$('.js-and-link').each(function(i, orBtn) {
          if (i === orLength - 1) {
            that.$(orBtn).removeClass('add-static');
          } else {
            that.$(orBtn).addClass('add-static');
          }
        });
      }

      // 或
      this.$('.js-condition-group').each(function(i, conditionGroup) {
        var andLength = that.$(conditionGroup).find('.js-or-link').length;
        if (andLength > 0) {
          that.$(conditionGroup).find('.js-or-link').each(function(j, andBtn) {
            if (j === andLength - 1) {
              that.$(andBtn).removeClass('add-static');
            } else {
              that.$(andBtn).addClass('add-static');
            }
          });
        }
      });
    },

    okFunc: function() {
      if (!this.$('form').isValid()) {
        return;
      }
      var value = this.$('form').form('value');
      var bwfStepData = {
        sortRuleName: value.sortRuleName,
        nodeId: this.options.nodeId,
        stepId: this.options.stepId,
        outputNodeId: value.outputNodeId,
        effDate: fish.dateutil.format(fish.dateutil.getStartOfDay(fish.dateutil.parse(value.effDate, 'yyyy-mm-dd')),
          'yyyy-mm-dd hh:ii:ss'),
        expDate: value.expDate ? fish.dateutil.format(fish.dateutil.getStartOfDay(fish.dateutil.parse(value.expDate,
          'yyyy-mm-dd')), 'yyyy-mm-dd hh:ii:ss') : '',
        execOrder: this.options.execOrder || this.bwfStep.execOrder,
        bwfSysAction: this.generateBwfSysAction(),
        bwfActionList: this.generateBwfActionList(),
        bwfCondGroupList: this.generateBwfCondGroupList(),
        comments: value.comments
      };
      bwfStepAction.addOrModBwfStep(this.options.workflowId, bwfStepData, function(data) {
        this.popup.close(data);
      }.bind(this));
    },

    generateBwfSysAction: function() {
      var sysActionName = this.$('form').form('value').sysActionName;
      if (fish.isEmpty(sysActionName)) {
        return;
      }
      var sysAction = {
        sysActionName: sysActionName
      };
      if (fish.isEmpty(this.bwfStep)) {
        return sysAction;
      }
      sysAction = fish.extend(sysAction, { stepId: this.bwfStep.stepId });
      if (!fish.isEmpty(this.bwfStep.bwfSysAction)) {
        sysAction = fish.extend(sysAction, { sysActionId: this.bwfStep.bwfSysAction.sysActionId });
      }
      return sysAction;
    },

    generateBwfActionList: function() {
      var bwfActionGridDataList = this.$('.js-grid-action').grid('getRowData');
      var bwfActionList = [];
      fish.each(bwfActionGridDataList, function(item, index) {
        bwfActionList.push(fish.extend(fish.omit(item, ['segTitle']), {
          seq: index + 1,
          stepId: this.bwfStep.stepId
        }));
      }.bind(this));
      return bwfActionList;
    },

    generateBwfCondGroupList: function() {
      this.deleteIndexLineIndexFieldAndAddStepId(this.conditionList);
      var condGroupList = [];
      if (fish.isEmpty(this.bwfStep.bwfCondGroupList)) {
        return this.conditionList;
      }
      fish.each(this.conditionList, function(bwfCondGroup, condGroupIndex) {
        if (!fish.isEmpty(this.bwfStep)) {
          bwfCondGroup = fish.extend(bwfCondGroup, { stepId: this.bwfStep.stepId });
          var bwfCondList = [];
          fish.each(bwfCondGroup.bwfCondList, function(bwfCond, condIndex) {
            bwfCond = fish.extend(bwfCond, {
              seq: condIndex + 1
            });
            bwfCondList.push(fish.omit(bwfCond, ['lineIndex', 'index']));
          });
          bwfCondGroup = fish.extend(bwfCondGroup, {
            bwfCondList: bwfCondList
          });
        }
        condGroupList.push(fish.omit(bwfCondGroup, ['lineIndex']));
      }.bind(this));
      return condGroupList;
    },

    deleteIndexLineIndexFieldAndAddStepId: function(conditionList, stepId) {
      fish.each(conditionList, function(item) {
        fish.each(item.bwfCondList, function(condItem) {
          delete condItem.lineIndex;
          delete condItem.index;
        });
        delete item.lineIndex;
      });
    },

    replaceOrAddItem: function(list, item) {
      for (var count1 = 0; count1 <= list.length - 1; ++count1) {
        for (var count2 = 0; count2 <= list[count1].bwfCondList.length - 1; ++count2) {
          if (list[count1].bwfCondList[count2].lineIndex === item.lineIndex &&
            list[count1].bwfCondList[count2].index === item.index) {
            list[count1].bwfCondList[count2] = item;
            return;
          }
        }
        if (list[count1].lineIndex === item.lineIndex) {
          list[count1].bwfCondList.push(item);
          return;
        }
      }
      var newCondList = [];
      newCondList.push(item);
      list.push({
        lineIndex: item.lineIndex,
        bwfCondList: newCondList
      });
    },

    searchCondInGroupByIndex: function(condGroup, lineIndex, index) {
      for (var count1 = 0; count1 <= condGroup.length - 1; ++count1) {
        for (var count2 = 0; count2 <= condGroup[count1].bwfCondList.length - 1; ++count2) {
          if (condGroup[count1].bwfCondList[count2].lineIndex === lineIndex &&
            condGroup[count1].bwfCondList[count2].index === index) {
            return condGroup[count1].bwfCondList[count2];
          }
        }
      }
    },

    toPromise: function() {
      var defer = new $.Deferred();
      defer.resolve();
      return defer.promise();
    }
  });
});
