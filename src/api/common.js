import ajaxService from './ajaxServices'

export default {
  ide: ajaxService.createAssistantApiMethodPost('/oj/ide')
}
