import ajaxService from './ajaxServices'

export default {
  examineeAdd: ajaxService.createAssistantApiMethodPost('/oj/examinee/examineeAdd'),
  examineeModify: ajaxService.createAssistantApiMethodPost('/oj/examinee/examineeModify'),
  getExamineeAddInfo: ajaxService.createAssistantApiMethodGet('/oj/examinee/getExamineeAddInfo'),
  getExamineeList: ajaxService.createAssistantApiMethodGet('/oj/examinee/getExamineeList'),
  getExamineeInfo: ajaxService.createAssistantApiMethodGet('/oj/examinee/getExamineeInfo'),
  deleteExaminee: ajaxService.createAssistantApiMethodGet('/oj/examinee/deleteExaminee')
}
