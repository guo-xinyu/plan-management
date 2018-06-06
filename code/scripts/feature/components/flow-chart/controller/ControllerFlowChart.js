import { Controller } from '../../../../design-pattern-character/model-view-controller/Controller.js';
import { CommandDragFlowChart } from './command-flow-chart/CommandDragFlowChart.js';
import { CommandCheckDetail } from './command-flow-chart/CommandCheckDetail.js';
import { CommandJumpRefer } from './command-flow-chart/CommandJumpRefer.js';

const observerTypes = Symbol();

function hitPattern(x, y, patternDesigns, canvasDom) {
  if (!patternDesigns) {
    return false;
  }
  for (let pattern of patternDesigns) {
    if (canvasDom.isPointInPath(pattern.border.path, x, y)) {
      return true;
    }
  }
}

function hitRefer(x, y, datas, ctx) {
  for (let data of datas) {
    if (!data.getViewData()) {
      continue;
    }
    for (let refer of data.getViewData().refer) {
      if (hitPattern(x, y, refer.patternDesign, ctx)) {
        return refer;
      }
    }
  }
}

function hitEntitySelf(x, y, datas, ctx) {
  for (let data of datas) {
    if (!data.getViewData()) {
      continue;
    }
    if (hitPattern(x, y, data.getViewData().self.patternDesign, ctx)) {
      return data;
    }
  }
}

function drag(moveEvent, mouseDownX, mouseDownY, command, state) {
  const moveHorizon = moveEvent.offsetX - mouseDownX;
  const moveVertical = moveEvent.offsetY - mouseDownY;

  command.execute(moveHorizon, moveVertical, state);
}

class ControllerFlowChart extends Controller {
  constructor(flowChartDom) {
    if (!(flowChartDom instanceof HTMLCanvasElement)) {
      throw new Error('ControllerFlowChart僅可控制HTMLCanvasElement。');
    }
    super();
    this[observerTypes] = {
      dragChart: Symbol(),
      jumpToRefer: Symbol()
    };
    this._commandFlowChart = new CommandDragFlowChart();
    this._commandCheckDetail = new CommandCheckDetail();
    this._commandJumpRefer = new CommandJumpRefer();
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
      if (hitEntitySelf(...startPoint, this._viewData, ctx)) {
        return;
      }
      if (hitRefer(...startPoint, this._viewData, ctx)) {
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

    flowChartDom.addEventListener('dblclick', event => {
      const startPoint = [
        event.offsetX, event.offsetY
      ];
      let ctx = flowChartDom.getContext('2d');
      const hitSelfResult = hitEntitySelf(...startPoint, this._viewData, ctx);
      if (hitSelfResult) {
        this._commandCheckDetail.execute(hitSelfResult.getEntityData());
      }
      const hitReferResult = hitRefer(...startPoint, this._viewData, ctx);
      if (hitReferResult) {
        this._commandJumpRefer.execute(hitReferResult.id);
      }
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
      case this[observerTypes].jumpToRefer:
        this._commandJumpRefer.add(command);
        break;
      default:
        break;
    }
  }
}

export { ControllerFlowChart };
