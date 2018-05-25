import { View } from '../../../../design-pattern-character/model-view-controller/View.js';
import { ModelFlowChart } from '../model/ModelFlowChart.js';

const handleModelUpdate = Symbol();

class ViewFlowChart extends View {
  constructor(flowChartModel) {
    if (!(flowChartModel instanceof ModelFlowChart)) {
      throw new Error('');
    }
    super(flowChartModel);
    // this[modelClass] = flowChartModel;
  }
  [handleModelUpdate](data) {
    this.draw(data);
  }
  draw(data) {
    if (!(data instanceof ModelFlowChart)) {
      throw new Error('');
    }
  }
}

export { ViewFlowChart };
