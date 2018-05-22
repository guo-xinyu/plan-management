import FlowChartController from './controller/FlowChartController.js';
import FlowChartModel from './model/FlowChartModel.js';
import FlowChartView from './view/FlowChartView.js';

const flowChartController = Symbol();
const flowChartModel = Symbol();
const flowChartView = Symbol();
const canvas = Symbol();

class FlowChart {
  constructor(canvasDom) {
    if (!(canvasDom instanceof HTMLCanvasElement)) {
      throw new Error('FlowChart僅可構建于canvas元素。');
    }
    this[canvas] = canvasDom;

    // 私有成員
    this[flowChartModel] = new FlowChartModel();
    this[flowChartView] = new FlowChartView();
    this[flowChartController] = new FlowChartController(this[canvas], this[flowChartModel], this[flowChartView]);
  }
}

export { FlowChart };
