import { Model } from '../../../../design-pattern-character/model-view-controller/Model.js';
import { FactoryCompositeData } from './factory-model-data/FactoryCompositeData.js';
import { ProxyFlowChartModel } from './proxy-remote-model/ProxyFlowChartModel.js';

const factoryCompositeData = new FactoryCompositeData();
const proxyFlowChartModel = new ProxyFlowChartModel();

const flowData = {
  workflowId: 412,
  workflowName: 'road',
  workflowType: 'E',
  nodeList: [{
    nodeId: 569,
    workflowId: 412,
    nodeName: 'Main Process',
    firstNode: 'Y',
    stepList: [{
      stepId: 590,
      nodeId: 569,
      stepName: 'go out',
      execOrder: 1,
      effDate: '2018-05-06 00:00:00'
    }, {
      stepId: 591,
      nodeId: 569,
      outputNodeId: 570,
      stepName: 'xidan',
      execOrder: 2,
      effDate: '2018-05-06 00:00:00'
    }, {
      stepId: 592,
      nodeId: 569,
      outputNodeId: 571,
      stepName: 'meet',
      execOrder: 3,
      effDate: '2018-05-06 00:00:00'
    }, {
      stepId: 598,
      nodeId: 569,
      outputNodeId: 571,
      stepName: 'play',
      execOrder: 4,
      effDate: '2018-05-06 00:00:00'
    }]
  }, {
    nodeId: 570,
    workflowId: 412,
    nodeName: 'To Libarary',
    firstNode: 'N',
    stepList: [{
      stepId: 593,
      nodeId: 570,
      stepName: 'take subway line 13',
      execOrder: 1,
      effDate: '2018-05-06 00:00:00'
    }, {
      stepId: 594,
      nodeId: 570,
      stepName: 'take subway line 6',
      execOrder: 2,
      effDate: '2018-05-06 00:00:00'
    }, {
      stepId: 595,
      nodeId: 570,
      stepName: 'libarary',
      execOrder: 3,
      effDate: '2018-05-06 00:00:00'
    }, {
      stepId: 596,
      nodeId: 570,
      outputNodeId: 571,
      stepName: 'read book',
      execOrder: 4,
      effDate: '2018-05-06 00:00:00'
    }]
  }, {
    nodeId: 571,
    workflowId: 412,
    nodeName: 'Go Shopping',
    firstNode: 'N',
    stepList: [{
      stepId: 601,
      nodeId: 571,
      outputNodeId: 572,
      stepName: 'Wal-Mart',
      execOrder: 1,
      effDate: '2018-05-06 00:00:00'
    }]
  }, {
    nodeId: 572,
    workflowId: 412,
    nodeName: 'Go Back Home',
    firstNode: 'N',
    stepList: [{
      stepId: 599,
      nodeId: 572,
      stepName: 'line 13',
      execOrder: 1,
      effDate: '2018-05-06 00:00:00'
    }, {
      stepId: 600,
      nodeId: 572,
      stepName: 'home',
      execOrder: 2,
      effDate: '2018-05-06 00:00:00'
    }]
  }]
};

class ModelFlowChart extends Model {
  constructor(data) {
    super();
    this.qryWorkflowDetail();
    // flowChartAction.qryWorkflowDetail().then(result => {
    // const compositeData = factoryCompositeData.produceCompositeData(data);
    // super(compositeData);
    // this.publish(compositeData);
    // });
  }
  qryWorkflowDetail() {
    // proxyFlowChartModel.qryWorkflowDetail().then(result => {
    setTimeout(() => {
      this.updateData(factoryCompositeData.produceCompositeData(flowData));
    }, 10);
    // });
  }
  updateRemoteModel(data) {
    proxyFlowChartModel.modWorkflow(data).then(() => {
      this.updateData(factoryCompositeData.produceCompositeData(data));
    });
  }
}

export { ModelFlowChart };
