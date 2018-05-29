class TeamConcept {
  constructor() {
    // this.bwfWorkflowGroup = 'bwfWorkflowGroup';
    this.bwfNodeGroup = 'bwfNodeGroup';
    this.bwfRealNodeName = 'bwfRealNodeName';
    this.bwfReferedNodeName = 'bwfReferedNodeName';
    this.bwfStepGroup = 'bwfStepGroup';
    this.bwfStepName = 'bwfStepName';
    this.bwfStepSymbol = 'bwfStepSymbol';
  }
  get bwfNodeGroup() {
    return this.bwfNodeGroup;
  }
  get bwfRealNodeName() {
    return this.bwfRealNodeName;
  }
  get bwfReferedNodeName() {
    return this.bwfReferedNodeName;
  }
  get bwfStepGroup() {
    return this.bwfStepGroup;
  }
  get bwfStepName() {
    return this.bwfStepName;
  }
  get bwfStepSymbol() {
    return this.bwfStepSymbol;
  }
}

export { TeamConcept };
