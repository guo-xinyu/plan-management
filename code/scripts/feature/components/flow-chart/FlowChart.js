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

    // 模型（model）觀察控制器（controller），視圖（view）觀察模型和控制器
    this[flowChartController] = new ControllerFlowChart(this[canvas]);
    this[flowChartModel] = new ModelFlowChart(this[flowChartController]);
    this[flowChartView] = new ViewFlowChart(this[flowChartModel], this[flowChartController],
      this[canvas].getContext('2d'));
  }
}

export { FlowChart };
