import { FactoryUserData } from './FactoryUserData.js';
import { CompositeData } from '../composite-data/CompositeData.js';

const factoryUserData = Symbol();
// const produceComponent = Symbol();
const hierarchy = [
  'workflow',
  'node',
  'step'
];

function produceComponent(workflowData, componentHierarchy) {
  if (!(componentHierarchy instanceof Array)) {
    throw new Error('produceComponent的第二個參數必須爲數組。');
  }
  let currentData = Object.assign(workflowData);
  let children = [];
  if (componentHierarchy.length >= 2) {
    if (currentData[`${componentHierarchy[1]}List`]) {
      children.push(...currentData[`${componentHierarchy[1]}List`]);
    }
    Reflect.deleteProperty(currentData, `${componentHierarchy[1]}List`);
  }

  let composite = new CompositeData(this[factoryUserData].produceUserData(currentData,
    currentData[`${componentHierarchy[0]}Name`]));
  if (children.length >= 1) {
    for (let child of children) {
      composite.addChild(produceComponent.call(this, child, componentHierarchy.slice(1)));
    }
  }
  return composite;
}

class FactoryCompositeData {
  constructor() {
    this[factoryUserData] = new FactoryUserData();
  }
  produceCompositeData(workflowData) {
    produceComponent.call(this, workflowData, hierarchy);
  }
}

export { FactoryCompositeData };
