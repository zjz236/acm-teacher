import ajaxService from './ajaxServices'

export default {
  addExam: ajaxService.createAssistantApiMethodPost('/oj/examList/addExam'),
  examEdit: ajaxService.createAssistantApiMethodPost('/oj/examList/examEdit'),
  getExamList: ajaxService.createAssistantApiMethodGet('/oj/examList/getExamList'),
  getExamInfo: ajaxService.createAssistantApiMethodGet('/oj/examList/getExamInfo'),
  examAnalysis: ajaxService.createAssistantApiMethodGet('/oj/examList/examAnalysis'),
  getExamNotice: ajaxService.createAssistantApiMethodGet('/oj/examList/getExamNotice'),
  deleteExamNotice: ajaxService.createAssistantApiMethodGet('/oj/examList/deleteExamNotice'),
  deleteExam: ajaxService.createAssistantApiMethodGet('/oj/examList/deleteExam'),
  examNoticeModify: ajaxService.createAssistantApiMethodPost('/oj/examList/examNoticeModify')
}
