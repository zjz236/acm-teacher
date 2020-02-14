import ajaxService from './ajaxServices'

export default {
  gapTest: ajaxService.createAssistantApiMethodPost('/oj/testData/gapTest'),
  gapTestSubmit: ajaxService.createAssistantApiMethodPost('/oj/testData/gapTestSubmit'),
  gapTestStatus: ajaxService.createAssistantApiMethodGet('/oj/testData/gapTestStatus'),
  deleteGapTest: ajaxService.createAssistantApiMethodGet('/oj/testData/deleteGapTest'),
  getGapTestInfo: ajaxService.createAssistantApiMethodGet('/oj/testData/getGapTestInfo'),
  getProgramTest: ajaxService.createAssistantApiMethodGet('/oj/testData/getProgramTest'),
  deleteProgramTest: ajaxService.createAssistantApiMethodGet('/oj/testData/deleteProgramTest'),
  programTest: ajaxService.createAssistantApiMethodPost('/oj/testData/programTest')
}
