import { FactoryEntityData } from './FactoryEntityData.js';
import { CompositeData } from '../composite-data/CompositeData.js';

const factoryEntityData = new FactoryEntityData();
// const produceComponent = Symbol();
const hierarchy = [
  'workflow',
  'node',
  'step'
];

function produceComponent(workflowData, index, componentHierarchy, oNodeRank) {
  if (!(componentHierarchy instanceof Array)) {
    throw new Error('produceComponent的第三個參數必須爲數組。');
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
  let nodeRank = componentHierarchy.length === 2 ? index : oNodeRank;
  const userData = factoryEntityData.produceUserData(currentData, currentData[`${componentHierarchy[0]}Name`]);
  const rank = index;
  compositeList.push(
    new CompositeData(
      userData.name, userData.entityData, hierarchy.length - componentHierarchy.length, rank, nodeRank));
  if (children.length >= 1) {
    for (let [childIndex, child] of children.entries()) {
      // console.log(child);
      compositeList.push(...produceComponent(child, childIndex, componentHierarchy.slice(1), nodeRank));
    }
  }
  return compositeList;
}

function produceAdjacentVertices(composites) {
  for (let composite of composites) {
    switch (composite.getGrade()) {
      case 0:
        for (let vertex of composites.filter(
            value => value.getId() !== composite.getId() && value.getEntityData().workflowId &&
            value.getEntityData().workflowId === composite.getEntityData().workflowId)) {
          composite.addAdjacentVertices(vertex.getId());
        }
        break;
      case 1:
        for (let vertex of composites.filter(
            value => value.getId() !== composite.getId() && value.getEntityData().nodeId &&
            value.getEntityData().nodeId === composite.getEntityData().nodeId)) {
          composite.addAdjacentVertices(vertex.getId());
        }
        break;
      case 2:
        // console.log(composite);
        for (let vertex of composites.filter(
            value => value.getId() !== composite.getId() && value.getEntityData().nodeId &&
            value.getEntityData().nodeId === composite.getEntityData().outputNodeId)) {
          // console.log(vertex);
          composite.addAdjacentVertices(vertex.getId());
        }
        break;
      default:
        break;
    }
  }
  return composites;
}

class FactoryCompositeData {
  // constructor() {
  //   this[factoryUserData] = new FactoryUserData();
  // }

  produceCompositeData(workflowData) {
    let composites = produceComponent(workflowData, 0, hierarchy);
    return produceAdjacentVertices(composites);
  }
}

export { FactoryCompositeData };
