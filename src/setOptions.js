const makeSetOptions = (pdfjs = window.PDFJS) => (options) => {
  if (!(options instanceof Object)) return;
  if (!pdfjs) return;
  /* eslint-disable no-param-reassign */
  Object.keys(options).forEach((property) => { pdfjs[property] = options[property]; });
};

export default makeSetOptions;
