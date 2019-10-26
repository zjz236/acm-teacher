import ajaxUtil from './ajaxUtil'
import {Message} from 'iview';
import {tokenError} from './commonUtil'

const interceptor = (func) => (param, customTipError) => new Promise((resolve, reject) => {
    func(param).then((res = {}) => {
        if (res.error) {
            console.log(res)
            let errorMessage =
                (res.errorMessage) ||
                ('unKnow error');
            let errorType = res.errorType
            if (errorType && errorType == 'Invalid Token') {
                tokenError();
            }
            if (customTipError instanceof Function) {
                customTipError(res);
            } else if (!customTipError && errorMessage) {
                // tipRequestErrorMessage(errorMessage);
            }
            if (process.client)
                Message.error(errorMessage)
            res.errorMessage = errorMessage;
            reject(res);
        } else {
            resolve(res.data);
        }
    }, (...e) => {
        if (customTipError instanceof Function) customTipError(...e);
        reject(...e);
    });
});
const createAssistantApiMethod = (uri, defaultData) => interceptor((data = defaultData) => ajaxUtil.post(uri, data));
const ajaxService = {
    teacherlogin: createAssistantApiMethod('/api/account/teacherlogin'),
    addTeacher: createAssistantApiMethod('/api/account/addTeacher'),
    updateTeacher: createAssistantApiMethod('/api/account/updateTeacher'),
    deleteTeacher: createAssistantApiMethod('/api/account/deleteTeacher'),
    islogin: createAssistantApiMethod('/api/islogin'),
    getUserInfo: createAssistantApiMethod('/api/user/getUserInfo'),
    updateUserInfo: createAssistantApiMethod('/api/user/updateUserInfo'),
    getAllUser: createAssistantApiMethod('/api/user/getAllUser'),
    addExam: createAssistantApiMethod('/api/exam/addExam'),
    getExam: createAssistantApiMethod('/api/exam/getExam'),
    getExamInfo: createAssistantApiMethod('/api/exam/getExamInfo'),
    updateExamInfo: createAssistantApiMethod('/api/exam/updateExamInfo'),
    addStudent: createAssistantApiMethod('/api/student/addStudent'),
    getStudentList: createAssistantApiMethod('/api/student/getStudentList'),
    updateStudent: createAssistantApiMethod('/api/student/updateStudent'),
    deleteStudent: createAssistantApiMethod('/api/student/deleteStudent'),
    addTF: createAssistantApiMethod('/api/topic/addTF'),
    getTFList: createAssistantApiMethod('/api/topic/getTFList'),
    addSelect:createAssistantApiMethod('/api/topic/addSelect'),
    addGap:createAssistantApiMethod('/api/topic/addGap'),
    addProgram:createAssistantApiMethod('/api/topic/addProgram'),
    getSelectList:createAssistantApiMethod('/api/topic/getSelectList'),
    getGapList:createAssistantApiMethod('/api/topic/getGapList'),
    getProgramList:createAssistantApiMethod('/api/topic/getProgramList'),
    getTFInfo:createAssistantApiMethod('/api/topic/getTFInfo'),
    deleteTF:createAssistantApiMethod('/api/topic/deleteTF'),
    deleteSelect:createAssistantApiMethod('/api/topic/deleteSelect'),
    deleteGap:createAssistantApiMethod('/api/topic/deleteGap'),
    deleteProgram:createAssistantApiMethod('/api/topic/deleteProgram'),
    getSelectInfo:createAssistantApiMethod('/api/topic/getSelectInfo'),
    updateSelectInfo:createAssistantApiMethod('/api/topic/updateSelectInfo'),
    getGapInfo:createAssistantApiMethod('/api/topic/getGapInfo'),
    updateGapInfo:createAssistantApiMethod('/api/topic/updateGapInfo'),
    updateProgramInfo:createAssistantApiMethod('/api/topic/updateProgramInfo'),
    getProgramInfo:createAssistantApiMethod('/api/topic/getProgramInfo'),
    updateTFInfo:createAssistantApiMethod('/api/topic/updateTFInfo'),
    getGapData:createAssistantApiMethod('/api/testdata/getGapData'),
    addGapData:createAssistantApiMethod('/api/testdata/addGapData'),
    updateGapData:createAssistantApiMethod('/api/testdata/updateGapData'),
    deleteGapData:createAssistantApiMethod('/api/testdata/deleteGapData'),
    getProgramData:createAssistantApiMethod('/api/testdata/getProgramData'),
    addProgramData:createAssistantApiMethod('/api/testdata/addProgramData'),
    updateProgramData:createAssistantApiMethod('/api/testdata/updateProgramData'),
    getExamGapData:createAssistantApiMethod('/api/testdata/getExamGapData'),
    addExamGapData:createAssistantApiMethod('/api/testdata/addExamGapData'),
    deleteProgramData:createAssistantApiMethod('/api/testdata/deleteProgramData'),
    updateExamGapData:createAssistantApiMethod('/api/testdata/updateExamGapData'),
    deleteExamGapData:createAssistantApiMethod('/api/testdata/deleteExamGapData'),
    getExamProgramData:createAssistantApiMethod('/api/testdata/getExamProgramData'),
    addExamProgramData:createAssistantApiMethod('/api/testdata/addExamProgramData'),
    updateExamProgramData:createAssistantApiMethod('/api/testdata/updateExamProgramData'),
    deleteExamProgramData:createAssistantApiMethod('/api/testdata/deleteExamProgramData'),
    getUserTF:createAssistantApiMethod('/api/examTopic/getUserTF'),
    addExamTF:createAssistantApiMethod('/api/examTopic/addExamTF'),
    getExamTFList:createAssistantApiMethod('/api/examTopic/getExamTFList'),
    getExamTFInfo:createAssistantApiMethod('/api/examTopic/getExamTFInfo'),
    updateExamTFInfo:createAssistantApiMethod('/api/examTopic/updateExamTFInfo'),
    deleteExamTF:createAssistantApiMethod('/api/examTopic/deleteExamTF'),
    getExamSelectList:createAssistantApiMethod('/api/examTopic/getExamSelectList'),
    getUserSelect:createAssistantApiMethod('/api/examTopic/getUserSelect'),
    addExamSelect:createAssistantApiMethod('/api/examTopic/addExamSelect'),
    getExamSelectInfo:createAssistantApiMethod('/api/examTopic/getExamSelectInfo'),
    updateExamSelectInfo:createAssistantApiMethod('/api/examTopic/updateExamSelectInfo'),
    deleteExamSelect:createAssistantApiMethod('/api/examTopic/deleteExamSelect'),
    getUserGap:createAssistantApiMethod('/api/examTopic/getUserGap'),
    addExamGap:createAssistantApiMethod('/api/examTopic/addExamGap'),
    getExamGapList:createAssistantApiMethod('/api/examTopic/getExamGapList'),
    getExamGapInfo:createAssistantApiMethod('/api/examTopic/getExamGapInfo'),
    updateExamGapInfo:createAssistantApiMethod('/api/examTopic/updateExamGapInfo'),
    deleteExamGap:createAssistantApiMethod('/api/examTopic/deleteExamGap'),
    getUserProgram:createAssistantApiMethod('/api/examTopic/getUserProgram'),
    addExamProgram:createAssistantApiMethod('/api/examTopic/addExamProgram'),
    getExamProgramList:createAssistantApiMethod('/api/examTopic/getExamProgramList'),
    getExamProgramInfo:createAssistantApiMethod('/api/examTopic/getExamProgramInfo'),
    deleteExamProgram:createAssistantApiMethod('/api/examTopic/deleteExamProgram'),
    updateExamProgramInfo:createAssistantApiMethod('/api/examTopic/updateExamProgramInfo'),
    getTestPaper:createAssistantApiMethod('/api/examTopic/getTestPaper'),
    statistics:createAssistantApiMethod('/api/examTopic/statistics'),
    getProgramStatus:createAssistantApiMethod('/api/evaluating/getProgramStatus'),
    tfEvaluating:createAssistantApiMethod('/api/evaluating/tfEvaluating'),
    selectEvaluating:createAssistantApiMethod('/api/evaluating/selectEvaluating'),
    gapEvaluating:createAssistantApiMethod('/api/evaluating/gapEvaluating'),
    examAnalysis:createAssistantApiMethod('/api/analysis/examAnalysis'),
}
export default ajaxService
