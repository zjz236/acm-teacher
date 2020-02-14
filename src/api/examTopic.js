import ajaxService from './ajaxServices'

export default {
  getExamTopicNum: ajaxService.createAssistantApiMethodGet('/oj/examTopic/getExamTopicNum'),
  getExamTransferTopic: ajaxService.createAssistantApiMethodGet('/oj/examTopic/getExamTransferTopic'),
  getExamTopicList: ajaxService.createAssistantApiMethodGet('/oj/examTopic/getExamTopicList'),
  getExamTopicInfo: ajaxService.createAssistantApiMethodGet('/oj/examTopic/getExamTopicInfo'),
  deleteExamTopic: ajaxService.createAssistantApiMethodGet('/oj/examTopic/deleteExamTopic'),
  getAllExamTopic: ajaxService.createAssistantApiMethodGet('/oj/examTopic/getAllExamTopic'),
  examTopicTransfer: ajaxService.createAssistantApiMethodPost('/oj/examTopic/examTopicTransfer'),
  modifyExamTopic: ajaxService.createAssistantApiMethodPost('/oj/examTopic/modifyExamTopic')
}
