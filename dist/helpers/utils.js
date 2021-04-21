"use strict";

var removeSpaceFromText = function removeSpaceFromText(_string) {
  var a = _string.trim();

  var b = a.replaceAll(" ", "");
  return b;
};

module.exports = {
  removeSpaceFromText: removeSpaceFromText
};