define(function() {
  return {
    qryAllSysActionFunction: function(success) {
      return fish.get('tp/sysActionFunctions', success);
    }
  };
});
