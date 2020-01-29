import ajaxService from './ajaxServices'

export default {
  login: ajaxService.createAssistantApiMethodPost('/oj/account/login'),
  getUserInfo: ajaxService.createAssistantApiMethodGet('/oj/account/getUserInfo')
}
