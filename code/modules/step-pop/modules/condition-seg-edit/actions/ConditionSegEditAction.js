define(function() {
  return {
    qryReAttrList: function(success) {
      return fish.get('tp/reAttrs', success);
    },

    qrySortFunctionList: function(request, success) {
      return fish.get('tp/sortFunctions', request, success);
    },

    qrySortOperatorList: function(success) {
      return fish.get('tp/sortOperators', success);
    }
  };
});
