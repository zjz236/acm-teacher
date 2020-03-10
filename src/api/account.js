import ajaxService from './ajaxServices'

export default {
  login: ajaxService.createAssistantApiMethodPost('/oj/account/login'),
  getPublicKey: ajaxService.createAssistantApiMethodGet('/oj/account/getPublicKey'),
  addUser: ajaxService.createAssistantApiMethodPost('/oj/account/addUser'),
  getUserInfo: ajaxService.createAssistantApiMethodGet('/oj/account/getUserInfo'),
  deleteUser: ajaxService.createAssistantApiMethodGet('/oj/account/deleteUser'),
  getUserList: ajaxService.createAssistantApiMethodGet('/oj/account/getUserList')
}
