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
  unexecute() {

  }
  add(singleCommand) {
    if (typeof singleCommand !== 'function') {
      throw new Error('命令僅可爲函數。');
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
