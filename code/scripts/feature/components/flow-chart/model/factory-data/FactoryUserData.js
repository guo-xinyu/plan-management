import { FactoryViewData } from './FactoryViewData.js';

const factoryViewData = Symbol();

function finalComposite(entity, viewData) {
  return { entity, viewData };
}

class FactoryData {
  constructor() {
    this[factoryViewData] = new FactoryViewData();
  }
  produceWorkflowCompositeData(workflowData, path) {
    return finalComposite(workflowData, this[factoryViewData].produceViewData(workflowData.workflowName, path));
  }
  produceNodeCompositeData(nodeData, path) {
    return finalComposite(nodeData, this[factoryViewData].produceViewData(nodeData.nodeName, path));
  }
  produceStepCompositeData(stepData, path) {
    return finalComposite(stepData, this[factoryViewData].produceViewData(stepData.sortRuleName, path));
  }
}

export { FactoryData };
