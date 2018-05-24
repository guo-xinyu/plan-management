import { Model } from '../../../../design-pattern-character/model-view-controller/Model.js';
import { FactoryCompositeData } from './factory-model-data/FactoryCompositeData.js';
// import { FlowChartAction } from './actions/FlowChartAction.js';

const factoryCompositeData = new FactoryCompositeData();
// const flowChartAction = new FlowChartAction();

class FlowChartModel extends Model {
  constructor(data) {
    // super();
    // flowChartAction.qryWorkflowDetail().then(result => {
    const compositeData = factoryCompositeData.produceCompositeData(data);
    super(compositeData);
    this.publish(compositeData);
    // });
  }
}

export { FlowChartModel };
