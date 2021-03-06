'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _util = require('./shared/util');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageSVG = function (_Component) {
  (0, _inherits3.default)(PageSVG, _Component);

  function PageSVG() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, PageSVG);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = PageSVG.__proto__ || (0, _getPrototypeOf2.default)(PageSVG)).call.apply(_ref, [this].concat(args))), _this), _this.onRenderSuccess = function () {
      _this.renderer = null;

      (0, _util.callIfDefined)(_this.props.onRenderSuccess);
    }, _this.onRenderError = function (error) {
      if (error === 'cancelled') {
        return;
      }

      (0, _util.callIfDefined)(_this.props.onRenderError, error);
    }, _this.drawPageOnContainer = function (element) {
      if (!element) {
        return null;
      }

      var page = _this.props.page;
      var _this2 = _this,
          viewport = _this2.viewport;


      _this.renderer = page.getOperatorList();

      return _this.renderer.then(function (operatorList) {
        var svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
        _this.renderer = svgGfx.getSVG(operatorList, viewport).then(function (svg) {
          svg.style.maxWidth = '100%';
          svg.style.height = 'auto';
          element.appendChild(svg);
        }).catch(_this.onRenderError);
      }).catch(_this.onRenderError);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }
  /**
   * Called when a page is rendered successfully.
   */


  /**
   * Called when a page fails to render.
   */


  (0, _createClass3.default)(PageSVG, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', {
        className: 'ReactPDF__Page__svg',
        style: {
          display: 'block',
          backgroundColor: 'white'
        },
        ref: this.drawPageOnContainer
      });
    }
  }, {
    key: 'viewport',
    get: function get() {
      var _props = this.props,
          page = _props.page,
          rotate = _props.rotate,
          scale = _props.scale;


      return page.getViewport(scale, rotate);
    }
  }]);
  return PageSVG;
}(_react.Component);

exports.default = PageSVG;


PageSVG.propTypes = {
  onRenderError: _propTypes2.default.func,
  onRenderSuccess: _propTypes2.default.func,
  page: _propTypes3.pageProp.isRequired,
  rotate: _propTypes3.rotateProp,
  scale: _propTypes2.default.number
};