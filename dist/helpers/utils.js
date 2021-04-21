"use strict";

var removeSpaceFromText = function removeSpaceFromText(_string) {
  var a = _string.trim();

  var b = a.replace(/ /g, "");
  return b;
};

module.exports = {
  removeSpaceFromText: removeSpaceFromText
};