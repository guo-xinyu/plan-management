import { Model } from '../../../../design-pattern-character/model-view-controller/Model.js';
// import { FactoryUserData } from './factory-data/FactoryUserData.js';
import { FlowChartAction } from '../actions/FlowChartAction.js';

// const factoryUserData = Symbol();
const flowChartAction = Symbol();

class FlowChartModel extends Model {
  constructor(data) {
    // const userData=
    super();
    this[flowChartAction] = new FlowChartAction();
  }
}

export { FlowChartModel };
