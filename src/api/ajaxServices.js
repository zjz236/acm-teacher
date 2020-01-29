import ajaxUtil from './ajaxUtil'
import {Message} from 'element-ui';
import context from '@/main'


const interceptor = (func) => (param, customTipError) => new Promise((resolve, reject) => {
  func(param).then((res = {}) => {
    if (res.error) {
      let errorMessage =
        (res.errorMessage) ||
        ('unKnow error');
      let errorType = res.errorType
      if (errorType && errorType === 'Invalid Token') {
        context.$router.replace('/login').then(r => {
          console.log(r)
        })
      }
      if (customTipError instanceof Function) {
        customTipError(res);
      } else if (!customTipError && errorMessage) {
        // tipRequestErrorMessage(errorMessage);
      }
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
const createAssistantApiMethodGet = (uri, defaultData) => interceptor((data = defaultData) => ajaxUtil.get(uri, {params: data}));
const createAssistantApiMethodPost = (uri, defaultData) => interceptor((data = defaultData) => ajaxUtil.post(uri, data));
export default {
  createAssistantApiMethodPost,
  createAssistantApiMethodGet
}
