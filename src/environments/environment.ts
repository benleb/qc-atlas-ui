// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: window['env']['production'] || false,
  nisqAnalyzer: window['env']['nisqAnalyzer'] || true,
  API_URL:
    window['env']['QC_ATLAS_HOST_NAME'] && window['env']['QC_ATLAS_PORT']
      ? `http://${window['env']['QC_ATLAS_HOST_NAME']}:${window['env']['QC_ATLAS_PORT']}/atlas`
      : 'http://localhost:8080/atlas',
  NISQ_API_URL:
    window['env']['NISQ_ANALYZER_HOST_NAME'] &&
    window['env']['NISQ_ANALYZER_PORT']
      ? `http://${window['env']['NISQ_ANALYZER_HOST_NAME']}:${window['env']['NISQ_ANALYZER_PORT']}/nisq-analyzer`
      : 'http://localhost:8081/nisq-analyzer',
  PATTERN_ATLAS_API_URL:
    window['env']['PATTERN_ATLAS_HOST_NAME'] &&
    window['env']['PATTERN_ATLAS_PORT']
      ? `http://${window['env']['PATTERN_ATLAS_HOST_NAME']}:${window['env']['PATTERN_ATLAS_PORT']}/patternpedia`
      : 'http://localhost:8082/patternpedia',
  PATTERN_ATLAS_UI_URL:
    window['env']['PATTERN_ATLAS_HOST_NAME'] &&
    window['env']['PATTERN_ATLAS_PORT']
      ? `http://${window['env']['PATTERN_ATLAS_HOST_NAME']}:${window['env']['PATTERN_ATLAS_UI_PORT']}/patternpedia`
      : 'http://localhost:4201',
  LATEX_RENDERER_API_URL:
    window['env']['LATEX_RENDERER_HOST_NAME'] &&
    window['env']['LATEX_RENDERER_PORT']
      ? `http://${window['env']['LATEX_RENDERER_HOST_NAME']}:${window['env']['LATEX_RENDERER_PORT']}`
      : 'http://localhost:8083',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
