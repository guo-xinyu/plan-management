import { Controller } from '../../../../design-pattern-character/model-view-controller/Controller.js';
import { CommandDragFlowChart } from './command-flow-chart/CommandDragFlowChart.js';

const observerTypes = Symbol();

function hitPattern(x, y, patternDesigns, canvasDom) {
  if (!patternDesigns) {
    // console.log(patternDesigns);
    return false;
  }
  for (let pattern of patternDesigns) {
    if (canvasDom.isPointInPath(pattern.border.path, x, y)) {
      return true;
    }
  }
}

function hitOnChart(x, y, datas, ctx) {
  for (let data of datas) {
    if (!data.getViewData()) {
      continue;
    }
    for (let refer of data.getViewData().refer) {
      if (hitPattern(x, y, refer.patternDesign, ctx)) {
        return true;
      }
    }
    if (hitPattern(x, y, data.getViewData().self.patternDesign, ctx)) {
      return true;
    }
  }
}

function drag(moveEvent, mouseDownX, mouseDownY, command, state) {
  // if (!selectedNode) {
  // let basePoint = [
  const moveHorizon = moveEvent.offsetX - mouseDownX;
  const moveVertical = moveEvent.offsetY - mouseDownY;
  // console.log(mouseDownX, mouseDownY);
  // console.log(moveEvent.offsetX, moveEvent.offsetY);

  command.execute(moveHorizon, moveVertical, state);
  // ];
  //   drawControl.draw(that.constructBwfWorkflowGroupNode(that.bwfWorkflow), ctx, {}, basePoint);
  //   return;
  // }

}

class ControllerFlowChart extends Controller {
  constructor(flowChartDom) {
    if (!(flowChartDom instanceof HTMLCanvasElement)) {
      throw new Error('ControllerFlowChart僅可控制HTMLCanvasElement。');
    }
    super();
    this[observerTypes] = {
      dragChart: Symbol()
    };
    this._commandFlowChart = new CommandDragFlowChart();
    this._viewData = {};
    this._flowChartDom = flowChartDom;
    this._initEventHandler(flowChartDom);
  }
  _initEventHandler(flowChartDom) {
    flowChartDom.addEventListener('mousedown', event => {
      if (event.button !== 0) {
        return;
      }
      let ctx = flowChartDom.getContext('2d');
      const startPoint = [
        event.offsetX, event.offsetY
      ];
      if (hitOnChart(...startPoint, this._viewData, ctx)) {
        return;
      }
      // console.log(event.offsetX, event.offsetY);
      let that = this;

      function onDrag(moveEvent) {
        // console.log(event.offsetX, event.offsetY);
        drag(moveEvent, ...startPoint, that._commandFlowChart, 'moving');
      }
      flowChartDom.addEventListener('mousemove', onDrag);

      function onMouseUp(mouseUpEvent) {
        flowChartDom.removeEventListener('mousemove', onDrag);
        flowChartDom.removeEventListener('mouseup', onMouseUp);
        drag(mouseUpEvent, ...startPoint, that._commandFlowChart, 'finished');
      }
      flowChartDom.addEventListener('mouseup', onMouseUp);
    });

  }
  setViewData(oViewData) {
    this._viewData = oViewData;
  }
  getObserverTypes() {
    return this[observerTypes];
  }
  addObserver(observer, type) {
    if (!Object.values(this[observerTypes]).includes(type)) {
      throw new Error('請指定正確的觀察者類型。');
    }
    super.addObserver(observer, type);
    this._addCommand(observer, type);
  }
  _addCommand(command, type) {
    switch (type) {
      case this[observerTypes].dragChart:
        this._commandFlowChart.add(command);
        break;
      default:
        break;
    }
  }
}

export { ControllerFlowChart };
