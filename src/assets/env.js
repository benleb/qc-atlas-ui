// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
(function (window) {
  window['env'] = window['env'] || {};

  // Environment variables

  window['env']['production'] = false;
  window['env']['nisqAnalyzer'] = true;
  window['env']['QC_ATLAS_HOST_NAME'] = 'localhost';
  window['env']['NISQ_ANALYZER_HOST_NAME'] = 'localhost';
  window['env']['PATTERN_ATLAS_HOST_NAME'] = 'localhost';
  window['env']['LATEX_RENDERER_HOST_NAME'] = 'localhost';
  window['env']['QC_ATLAS_PORT'] = 8080;
  window['env']['NISQ_ANALYZER_PORT'] = 8081;
  window['env']['PATTERN_ATLAS_PORT'] = 8082;
  window['env']['LATEX_RENDERER_PORT'] = 8083;
})(this);
