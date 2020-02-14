import ajaxService from './ajaxServices'

export default {
  tfGrade: ajaxService.createAssistantApiMethodGet('/oj/grade/tfGrade'),
  selectGrade: ajaxService.createAssistantApiMethodGet('/oj/grade/selectGrade'),
  gapGrade: ajaxService.createAssistantApiMethodGet('/oj/grade/gapGrade'),
  programGrade: ajaxService.createAssistantApiMethodGet('/oj/grade/programGrade')
}
