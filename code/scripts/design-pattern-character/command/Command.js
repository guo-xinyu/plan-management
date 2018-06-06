const commandStack = Symbol();

class Command {
  constructor() {
    this[commandStack] = [];
  }
  execute() {
    for (let singleCommand of this[commandStack]) {
      singleCommand.command();
    }
  }
  getCommandStack() {
    return this[commandStack];
  }
  unexecute() {

  }
  add(singleCommand) {
    if (typeof singleCommand !== 'object') {
      throw new Error('命令僅可爲對象。');
    }
    this[commandStack].push({
      id: Symbol(),
      command: singleCommand
    });
  }
  remove() {

  }
}

export { Command };
