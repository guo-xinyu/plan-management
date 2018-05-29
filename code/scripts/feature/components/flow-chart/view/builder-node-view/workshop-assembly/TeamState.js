class TeamState {
  constructor() {
    this.drawStepNameMode = {
      usual: 'usual',
      selected: 'selected'
    };
    this.drawBwfNodeNameMode = {
      real: 'real',
      refered: 'refered'
    };
    this.drawBwfStepGoLineMode = {
      go: 'go',
      output: 'output'
    };
    this.drawBwfStepSymbolMode = {
      usual: 'usual',
      hasOutput: 'hasOutput'
    };
  }
}

export { TeamState };
