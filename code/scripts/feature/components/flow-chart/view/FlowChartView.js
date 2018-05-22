const modelClass = Symbol();

class FlowChartView {
  constructor(flowChartModel) {
    this[modelClass] = flowChartModel;
  }
  draw(data) {
    if (!(data instanceof this[modelClass])) {
      throw new Error('');
    }
  }
}

export { FlowChartView };
