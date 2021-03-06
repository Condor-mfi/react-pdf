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

require('./annotation_layer_builder.css');

var _util = require('./shared/util');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageAnnotations = function (_Component) {
  (0, _inherits3.default)(PageAnnotations, _Component);

  function PageAnnotations() {
    (0, _classCallCheck3.default)(this, PageAnnotations);
    return (0, _possibleConstructorReturn3.default)(this, (PageAnnotations.__proto__ || (0, _getPrototypeOf2.default)(PageAnnotations)).apply(this, arguments));
  }

  (0, _createClass3.default)(PageAnnotations, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getAnnotations();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.page !== this.props.page) {
        this.getAnnotations(nextProps);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.runningTask && this.runningTask.cancel) {
        this.runningTask.cancel();
      }
    }
  }, {
    key: 'getAnnotations',
    value: function getAnnotations() {
      var _this2 = this;

      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      this.runningTask = (0, _util.makeCancellable)(props.page.getAnnotations());

      return this.runningTask.promise.then(function (annotations) {
        _this2.renderAnnotations(annotations);
      });
    }
  }, {
    key: 'renderAnnotations',
    value: function renderAnnotations(annotations) {
      var _props = this.props,
          linkService = _props.linkService,
          page = _props.page;

      var viewport = this.viewport.clone({ dontFlip: true });

      var parameters = {
        annotations: annotations,
        div: this.annotationLayer,
        linkService: linkService,
        page: page,
        viewport: viewport
      };

      PDFJS.AnnotationLayer.render(parameters);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement('div', {
        className: 'ReactPDF__Page__annotations annotationLayer',
        ref: function ref(_ref) {
          _this3.annotationLayer = _ref;
        }
      });
    }
  }, {
    key: 'viewport',
    get: function get() {
      var _props2 = this.props,
          page = _props2.page,
          rotate = _props2.rotate,
          scale = _props2.scale;


      return page.getViewport(scale, rotate);
    }
  }]);
  return PageAnnotations;
}(_react.Component);

exports.default = PageAnnotations;


PageAnnotations.propTypes = {
  linkService: _propTypes3.linkServiceProp,
  page: _propTypes3.pageProp,
  rotate: _propTypes3.rotateProp,
  scale: _propTypes2.default.number
};