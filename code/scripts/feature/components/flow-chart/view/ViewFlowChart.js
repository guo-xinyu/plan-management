const modelClass = Symbol();

class ViewFlowChart {
  constructor(flowChartModel) {
    this[modelClass] = flowChartModel;
  }
  draw(data) {
    if (!(data instanceof this[modelClass])) {
      throw new Error('');
    }
  }
}

export { ViewFlowChart };
