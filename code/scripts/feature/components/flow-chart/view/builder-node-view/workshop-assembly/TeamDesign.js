class TeamDesign {
  constructor() {
    this.outputRotatingDegree = Math.PI / 4;
    this.stepInterval = 120;
    this.nodeGroupHeight = 250;
    this.stepGoLineYOffset = 95;
    this.nameSymbolBlank = 6;
    this.basePoint = [5, 0];
  }
  get outputRotatingDegree() {
    return this.outputRotatingDegree;
  }
  get stepInterval() {
    return this.stepInterval;
  }
  get nodeGroupHeight() {
    return this.nodeGroupHeight;
  }
  get stepGoLineYOffset() {
    return this.stepGoLineYOffset;
  }
  get nameSymbolBlank() {
    return this.nameSymbolBlank;
  }
  get basePoint() {
    return this.basePoint;
  }
}

export { TeamDesign };
