const makeSetOptions = pdfjs => (options) => {
  if (!(options instanceof Object)) return;

  /* eslint-disable no-param-reassign */
  Object.keys(options).forEach((property) => { pdfjs.PDFJS[property] = options[property]; });
};

export default makeSetOptions;
