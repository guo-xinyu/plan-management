define(function() {
  function _constructor(type, path, data, nameField, idNumber) {
    return {
      id: type + '_' + idNumber,
      type: type,
      name: data[nameField],
      path: path,
      animatedSteps: 0,
      userData: data,
      children: []
    };
  }

  return {
    constructor: _constructor
  };
});
