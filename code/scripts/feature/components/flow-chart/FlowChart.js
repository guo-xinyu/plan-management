import { ControllerFlowChart } from './controller/ControllerFlowChart.js';
import { ModelFlowChart } from './model/ModelFlowChart.js';
import { ViewFlowChart } from './view/ViewFlowChart.js';

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
    this[flowChartModel] = new ModelFlowChart();
    this[flowChartView] = new ViewFlowChart(this[flowChartModel], this[canvas].getContext('2d'));
    this[flowChartController] = new ControllerFlowChart(this[canvas], this[flowChartModel], this[flowChartView]);
  }
}

export { FlowChart };
