"use strict";

const removeSpaceFromText = (_string) => {
    let a = _string.trim();
    let b = a.replace(/ /g, "");
    return b;
}

module.exports = {
    removeSpaceFromText
}