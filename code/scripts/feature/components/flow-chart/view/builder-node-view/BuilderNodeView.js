import { TeamAssembly } from './workshop-assembly/TeamAssembly.js';

const teamAssembly = Symbol();

class BuilderNodeView {
  constructor() {
    this[teamAssembly] = new TeamAssembly();
  }
  buildNodeView() {
    this[teamAssembly].drawGroupOfNode();
  }
}

export { BuilderNodeView };
