import { FactoryEntityData } from './FactoryEntityData.js';
import { CompositeData } from '../composite-data/CompositeData.js';

const factoryEntityData = new FactoryEntityData();
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
  let compositeList = [];
  let currentData = Object.assign(workflowData);
  let children = [];
  if (componentHierarchy.length >= 2) {
    if (currentData[`${componentHierarchy[1]}List`]) {
      children.push(...currentData[`${componentHierarchy[1]}List`]);
    }
    Reflect.deleteProperty(currentData, `${componentHierarchy[1]}List`);
  }

  const userData = factoryEntityData.produceUserData(currentData, currentData[`${componentHierarchy[0]}Name`]);

  compositeList.push(
    new CompositeData(userData.name, userData.entityData, hierarchy.length - componentHierarchy.length));
  if (children.length >= 1) {
    for (let child of children) {
      compositeList.push(...produceComponent(child, componentHierarchy.slice(1)));
    }
  }
  return compositeList;
}

class FactoryCompositeData {
  // constructor() {
  //   this[factoryUserData] = new FactoryUserData();
  // }

  produceCompositeData(workflowData) {
    let composites = produceComponent(workflowData, hierarchy);
    for (let composite of composites) {
      switch (composite.getGrade()) {
        case 0:
          for (let vertex of composites.filter(
              value => value.getId() !== vertex.getId() &&
              value.setEntityData().workflowId === composite.setEntityData().workflowId)) {
            composite.addAdjacentVertices(vertex.getId());
          }
          break;
        case 1:
          for (let vertex of composites.filter(
              value => value.getId() !== vertex.getId() &&
              value.setEntityData().nodeId === composite.setEntityData().nodeId)) {
            composite.addAdjacentVertices(vertex.getId());
          }
          break;
        case 2:
          for (let vertex of composites.filter(
              value => value.getId() !== vertex.getId() &&
              value.setEntityData().nodeId === composite.setEntityData().outputNodeId)) {
            composite.addAdjacentVertices(vertex.getId());
          }
          break;
        default:
          break;
      }
    }
    return composites;
  }
}

export { FactoryCompositeData };
