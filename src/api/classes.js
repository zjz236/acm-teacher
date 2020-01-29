import ajaxService from './ajaxServices'

export default {
  addClasses: ajaxService.createAssistantApiMethodPost('/oj/classes/addClasses'),
  getClassList: ajaxService.createAssistantApiMethodGet('/oj/classes/getClassList'),
  getClassInfo: ajaxService.createAssistantApiMethodGet('/oj/classes/getClassInfo'),
  deleteClass: ajaxService.createAssistantApiMethodGet('/oj/classes/deleteClass'),
  getClassesStudent: ajaxService.createAssistantApiMethodGet('/oj/classes/getClassesStudent')
}
