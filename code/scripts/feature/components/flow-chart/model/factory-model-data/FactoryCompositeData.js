import { FactoryUserData } from './FactoryUserData.js';
// import { CompositeData } from '../composite-data/CompositeData.js';

const factoryUserData = Symbol();

class FactoryCompositeData {
  constructor() {
    this[factoryUserData] = new FactoryUserData();
  }
  produceCompositeData(workflowData) {
    // let workflowComposite = new CompositeData();
  }
}

export { FactoryCompositeData };
