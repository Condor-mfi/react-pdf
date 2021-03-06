"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeSetOptions = function makeSetOptions() {
  var pdfjs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.PDFJS;
  return function (options) {
    if (!(options instanceof Object)) return;
    if (!pdfjs) return;
    /* eslint-disable no-param-reassign */
    (0, _keys2.default)(options).forEach(function (property) {
      pdfjs[property] = options[property];
    });
  };
};

exports.default = makeSetOptions;