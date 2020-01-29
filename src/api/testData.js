import ajaxService from './ajaxServices'

export default {
  gapTest: ajaxService.createAssistantApiMethodPost('/oj/testData/gapTest'),
  gapTestSubmit: ajaxService.createAssistantApiMethodPost('/oj/testData/gapTestSubmit'),
  gapTestStatus: ajaxService.createAssistantApiMethodGet('/oj/testData/gapTestStatus'),
  deleteGapTest: ajaxService.createAssistantApiMethodGet('/oj/testData/deleteGapTest'),
  getGapTestInfo: ajaxService.createAssistantApiMethodGet('/oj/testData/getGapTestInfo')
}
