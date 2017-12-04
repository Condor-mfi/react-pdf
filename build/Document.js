'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _mergeClassNames = require('merge-class-names');

var _mergeClassNames2 = _interopRequireDefault(_mergeClassNames);

var _LinkService = require('./LinkService');

var _LinkService2 = _interopRequireDefault(_LinkService);

var _util = require('./shared/util');

var _events = require('./shared/events');

var _propTypes3 = require('./shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Document = function (_Component) {
  (0, _inherits3.default)(Document, _Component);

  function Document() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Document);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Document.__proto__ || (0, _getPrototypeOf2.default)(Document)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      pdf: null
    }, _this.viewer = {
      scrollPageIntoView: function scrollPageIntoView(_ref2) {
        var pageNumber = _ref2.pageNumber;

        // Handling jumping to internal links target

        // First, check if custom handling of onItemClick was provided
        if (_this.props.onItemClick) {
          _this.props.onItemClick({ pageNumber: pageNumber });
          return;
        }

        // If not, try to look for target page within the <Document>.
        var page = _this.pages[pageNumber - 1];

        if (page) {
          // Scroll to the page automatically
          page.scrollIntoView();
          return;
        }

        (0, _util.warnOnDev)('Warning: An internal link leading to page ' + pageNumber + ' was clicked, but neither <Document> was provided with onItemClick nor it was able to find the page within itself. Either provide onItemClick to <Document> and handle navigating by yourself or ensure that all pages are rendered within <Document>.');
      }
    }, _this.linkService = new _LinkService2.default(), _this.onSourceSuccess = function (source) {
      (0, _util.callIfDefined)(_this.props.onSourceSuccess);

      if (!window.PDFJS) {
        throw new Error('Could not load the document. PDF.js is not loaded.');
      }

      if (_this.state.pdf !== null) {
        _this.setState({ pdf: null });
      }

      if (!source) {
        return null;
      }

      _this.runningTask = (0, _util.makeCancellable)(window.PDFJS.getDocument(source));

      return _this.runningTask.promise.then(_this.onLoadSuccess).catch(_this.onLoadError);
    }, _this.onSourceError = function (error) {
      if ((error.message || error) === 'cancelled') {
        return;
      }

      (0, _util.errorOnDev)(error.message, error);

      (0, _util.callIfDefined)(_this.props.onSourceError, error);

      _this.setState({ pdf: false });
    }, _this.onLoadSuccess = function (pdf) {
      (0, _util.callIfDefined)(_this.props.onLoadSuccess, pdf);

      _this.pages = new Array(pdf.numPages);
      _this.linkService.setDocument(pdf);
      _this.setState({ pdf: pdf });
    }, _this.onLoadError = function (error) {
      if ((error.message || error) === 'cancelled') {
        return;
      }

      (0, _util.errorOnDev)(error.message, error);

      (0, _util.callIfDefined)(_this.props.onLoadError, error);

      _this.setState({ pdf: false });
    }, _this.findDocumentSource = function () {
      var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props.file;
      return new _promise2.default(function (resolve, reject) {
        if (!file) {
          return resolve(null);
        }

        // File is a string
        if ((0, _util.isString)(file)) {
          if ((0, _util.isDataURI)(file)) {
            var fileUint8Array = (0, _util.dataURItoUint8Array)(file);
            return resolve(fileUint8Array);
          }

          (0, _util.displayCORSWarning)();
          return resolve(file);
        }

        if ((0, _util.isArrayBuffer)(file)) {
          return resolve(file);
        }

        if ((0, _util.isParamObject)(file)) {
          // Prevent from modifying props
          var modifiedFile = (0, _assign2.default)({}, file);

          if ('url' in modifiedFile) {
            // File is data URI
            if ((0, _util.isDataURI)(modifiedFile.url)) {
              var _fileUint8Array = (0, _util.dataURItoUint8Array)(modifiedFile.url);
              return resolve(_fileUint8Array);
            }

            (0, _util.displayCORSWarning)();
          }

          return resolve(modifiedFile);
        }

        /**
         * The cases below are browser-only.
         * If you're running on a non-browser environment, these cases will be of no use.
         */
        if (_util.isBrowser) {
          // File is a Blob
          if ((0, _util.isBlob)(file) || (0, _util.isFile)(file)) {
            var reader = new FileReader();

            reader.onload = function () {
              return resolve(new Uint8Array(reader.result));
            };
            reader.onerror = function (event) {
              switch (event.target.error.code) {
                case event.target.error.NOT_FOUND_ERR:
                  return reject(new Error('Error while reading a file: File not found.'));
                case event.target.error.NOT_READABLE_ERR:
                  return reject(new Error('Error while reading a file: File not readable.'));
                case event.target.error.SECURITY_ERR:
                  return reject(new Error('Error while reading a file: Security error.'));
                case event.target.error.ABORT_ERR:
                  return reject(new Error('cancelled'));
                default:
                  return reject(new Error('Error while reading a file.'));
              }
            };
            reader.readAsArrayBuffer(file);

            return null;
          }
        }

        // No supported loading method worked
        return reject(new Error('Unsupported loading method.'));
      });
    }, _this.registerPage = function (pageIndex, ref) {
      _this.pages[pageIndex] = ref;
    }, _this.unregisterPage = function (pageIndex) {
      delete _this.pages[pageIndex];
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Document, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadDocument();

      this.linkService.setViewer(this.viewer);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.shouldLoadDocument(nextProps)) {
        this.loadDocument(nextProps);
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
    key: 'shouldLoadDocument',
    value: function shouldLoadDocument(nextProps) {
      var nextFile = nextProps.file;
      var file = this.props.file;

      // We got file of different type - clearly there was a change

      if ((typeof nextFile === 'undefined' ? 'undefined' : (0, _typeof3.default)(nextFile)) !== (typeof file === 'undefined' ? 'undefined' : (0, _typeof3.default)(file))) {
        return true;
      }

      // We got an object and previously it was an object too - we need to compare deeply
      if ((0, _util.isParamObject)(nextFile) && (0, _util.isParamObject)(file)) {
        return nextFile.data !== file.data || nextFile.range !== file.range || nextFile.url !== file.url;
        // We either have or had an object - most likely there was a change
      } else if ((0, _util.isParamObject)(nextFile) || (0, _util.isParamObject)(file)) {
        return true;
      }

      /**
       * The cases below are browser-only.
       * If you're running on a non-browser environment, these cases will be of no use.
       */
      if (_util.isBrowser && (
      // File is a Blob or a File
      (0, _util.isBlob)(nextFile) || (0, _util.isFile)(nextFile)) && ((0, _util.isBlob)(file) || (0, _util.isFile)(file))) {
        /**
         * Theoretically, we could compare files here by reading them, but that would severely affect
         * performance. Therefore, we're making a compromise here, agreeing on not loading the next
         * file if its size is identical as the previous one's.
         */
        return nextFile.size !== file.size;
      }

      return nextFile !== file;
    }
  }, {
    key: 'loadDocument',
    value: function loadDocument() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      if (this.runningTask && this.runningTask.cancel) {
        this.runningTask.cancel();
      }

      this.runningTask = (0, _util.makeCancellable)(this.findDocumentSource(props.file));

      return this.runningTask.promise.then(this.onSourceSuccess).catch(this.onSourceError);
    }

    /**
     * Attempts to find a document source based on props.
     */

  }, {
    key: 'renderNoData',
    value: function renderNoData() {
      return _react2.default.createElement(
        'div',
        { className: 'ReactPDF__NoData' },
        this.props.noData
      );
    }
  }, {
    key: 'renderError',
    value: function renderError() {
      return _react2.default.createElement(
        'div',
        { className: 'ReactPDF__Error' },
        this.props.error
      );
    }
  }, {
    key: 'renderLoader',
    value: function renderLoader() {
      return _react2.default.createElement(
        'div',
        { className: 'ReactPDF__Loader' },
        this.props.loading
      );
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren() {
      var _props = this.props,
          children = _props.children,
          className = _props.className,
          inputRef = _props.inputRef,
          rotate = _props.rotate;
      var pdf = this.state.pdf;
      var linkService = this.linkService,
          registerPage = this.registerPage,
          unregisterPage = this.unregisterPage;


      var childProps = {
        linkService: linkService,
        registerPage: registerPage,
        unregisterPage: unregisterPage,
        pdf: pdf,
        rotate: rotate
      };

      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({
          className: (0, _mergeClassNames2.default)('ReactPDF__Document', className),
          ref: inputRef ? function (ref) {
            inputRef(ref);
          } : null
        }, this.eventProps),
        children && _react.Children.map(children, function (child) {
          return _react2.default.cloneElement(child, (0, _assign2.default)({}, childProps, child.props));
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var file = this.props.file;


      if (!file) {
        return this.renderNoData();
      }

      var pdf = this.state.pdf;


      if (pdf === null) {
        return this.renderLoader();
      }

      if (pdf === false) {
        return this.renderError();
      }

      return this.renderChildren();
    }
  }, {
    key: 'eventProps',
    get: function get() {
      return (0, _events.makeEventProps)(this.props, this.state.pdf);
    }

    /**
     * Called when a document source is resolved correctly
     */


    /**
     * Called when a document source failed to be resolved correctly
     */


    /**
     * Called when a document is read successfully
     */


    /**
     * Called when a document failed to read successfully
     */

  }]);
  return Document;
}(_react.Component); /**
                      * Loads a PDF document. Passes it to all children.
                      */


exports.default = Document;


Document.defaultProps = {
  error: 'Failed to load PDF file.',
  loading: 'Loading PDF…',
  noData: 'No PDF file specified.'
};

var fileTypes = [_propTypes2.default.string, _propTypes2.default.instanceOf(ArrayBuffer), _propTypes2.default.shape({
  data: _propTypes2.default.object,
  httpHeaders: _propTypes2.default.object,
  range: _propTypes2.default.object,
  url: _propTypes2.default.string,
  withCredentials: _propTypes2.default.bool
})];
if (typeof File !== 'undefined') {
  fileTypes.push(_propTypes2.default.instanceOf(File));
}
if (typeof Blob !== 'undefined') {
  fileTypes.push(_propTypes2.default.instanceOf(Blob));
}

Document.propTypes = (0, _extends3.default)({
  children: _propTypes2.default.node,
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
  error: _propTypes2.default.node,
  file: _propTypes2.default.oneOfType(fileTypes),
  inputRef: _propTypes2.default.func,
  loading: _propTypes2.default.node,
  noData: _propTypes2.default.node,
  onItemClick: _propTypes2.default.func,
  onLoadError: _propTypes2.default.func,
  onLoadSuccess: _propTypes2.default.func,
  onSourceError: _propTypes2.default.func,
  onSourceSuccess: _propTypes2.default.func,
  rotate: _propTypes2.default.number
}, (0, _propTypes3.eventsProps)());