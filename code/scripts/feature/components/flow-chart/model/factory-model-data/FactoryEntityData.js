// function finalComposite(entity, name) {
//   if (typeof entity !== 'object') {
//     throw new Error('finalComposite的第一個參數必須是對象。');
//   }
//   if (typeof name !== 'string') {
//     throw new Error('finalComposite的第一個參數必須是字符串。');
//   }
//   return { entity, name };
// }

class FactoryEntityData {
  produceUserData(entityData, name) {
    if (typeof entityData !== 'object') {
      throw new Error('finalComposite的第一個參數必須是對象。');
    }
    if (typeof name !== 'string') {
      throw new Error('finalComposite的第一個參數必須是字符串。');
    }
    return { entityData, name };
  }
  // produceNodeCompositeData(nodeData) {
  //   return finalComposite(nodeData, nodeData.nodeName);
  // }
  // produceStepCompositeData(stepData) {
  //   return finalComposite(stepData, stepData.sortRuleName);
  // }
}

export { FactoryEntityData };
