import { Model } from '../../../../design-pattern-character/model-view-controller/Model.js';
import { FactoryCompositeData } from './factory-model-data/FactoryCompositeData.js';
import { ProxyFlowChartModel } from './proxy-remote-model/ProxyFlowChartModel.js';

const factoryCompositeData = new FactoryCompositeData();
const proxyFlowChartModel = new ProxyFlowChartModel();

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
    proxyFlowChartModel.qryWorkflowDetail().then(result => {
      const compositeData = factoryCompositeData.produceCompositeData(result);
      this.updateData(compositeData);
    });
  }
  updateRemoteModel() {

  }
}

export { ModelFlowChart };
