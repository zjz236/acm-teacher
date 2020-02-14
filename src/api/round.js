import ajaxService from './ajaxServices'

export default {
  runner: ajaxService.createAssistantApiMethodPost('/oj/round/runner'),
  getRunnerStatus: ajaxService.createAssistantApiMethodGet('/oj/round/getRunnerStatus')
}
