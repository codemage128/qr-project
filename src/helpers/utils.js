"use strict";

const removeSpaceFromText = (_string) => {
    let a = _string.trim();
    let b = a.replaceAll(" ", "");
    return b;
}

module.exports = {
    removeSpaceFromText
}