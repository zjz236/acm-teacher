import ajaxService from './ajaxServices'

export default {
  topicModify: ajaxService.createAssistantApiMethodPost('/oj/topic/topicModify'),
  getTopicList: ajaxService.createAssistantApiMethodGet('/oj/topic/getTopicList'),
  getTopicInfo: ajaxService.createAssistantApiMethodGet('/oj/topic/getTopicInfo'),
  deleteTopic: ajaxService.createAssistantApiMethodGet('/oj/topic/deleteTopic')
}
