import FlowChartController from './controller/FlowChartController.js';
import FlowChartModel from './model/FlowChartModel.js';
import FlowChartView from './view/FlowChartView.js';

const flowChartController = Symbol();
const flowChartModel = Symbol();
const flowChartView = Symbol();

class FlowChart {
  constructor(canvasDom) {
    if (!(canvasDom instanceof HTMLCanvasElement)) {
      throw new Error('FlowChart僅可以canvas的dom元素構造。');
    }
    this.canvasDom = canvasDom;

    // 私有成員
    this[flowChartController] = new FlowChartController();
    this[flowChartModel] = new FlowChartModel();
    this[flowChartView] = new FlowChartView();
  }
}

export { FlowChart };
