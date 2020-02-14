import ajaxService from './ajaxServices'

export default {
  addIDEData: ajaxService.createAssistantApiMethodPost('/oj/ide/addIDEData'),
  getIDEData: ajaxService.createAssistantApiMethodGet('/oj/ide/getIDEData')
}
