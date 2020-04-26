import VueRouter from 'vue-router'
import Vue from 'vue'

const Home = () => import('@/pages/Home')
const Login = () => import('@/pages/Login')
const Index = () => import('@/pages/Index')
const ExamList = () => import('@/pages/ExamList')
const ExamModify = () => import('@/pages/ExamModify')
const Classes = () => import('@/pages/Classes')
const ClassesModify = () => import('@/pages/ClassesModify')
const ExamManage = () => import('@/pages/ExamManage')
const ExamEdit = () => import('@/pages/examManage/ExamEdit')
const Examinee = () => import('@/pages/examManage/examinee/Examinee')
const ExamineeAdd = () => import('@/pages/examManage/examinee/ExamineeAdd')
const ExamineeModify = () => import('@/pages/examManage/examinee/ExamineeModify')
const Topic = () => import('@/pages/topic/Topic')
const TFTopic = () => import('@/pages/topic/TFTopic')
const SelectTopic = () => import('@/pages/topic/SelectTopic')
const GapTopic = () => import('@/pages/topic/GapTopic')
const ProgramTopic = () => import('@/pages/topic/ProgramTopic')
const ExamTFTopic = () => import('@/pages/examManage/topic/TFTopic')
const ExamSelectTopic = () => import('@/pages/examManage/topic/SelectTopic')
const ExamGapTopic = () => import('@/pages/examManage/topic/GapTopic')
const ExamProgramTopic = () => import('@/pages/examManage/topic/ProgramTopic')
const ExamGrade = () => import('@/pages/examManage/ExamGrade')
const ExamReader = () => import('@/pages/examManage/ExamReader')
const ExamAnalysis = () => import('@/pages/examManage/ExamAnalysis')
const ExamNotice = () => import('@/pages/examManage/ExamNotice')
const UserManage = () => import('@/pages/UserManage')
const IDE = () => import('@/pages/IDE')

const router = {
  mode: 'history',
  base: '/admin/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/',
          name: 'index',
          component: Index,
          meta: {
            title: '首页'
          }
        },
        {
          path: '/examList',
          name: 'examList',
          component: ExamList,
          meta: {
            title: '考试管理'
          }
        },
        {
          path: '/addExam',
          name: 'addExam',
          component: ExamModify,
          meta: {
            title: '添加考试'
          }
        },
        {
          path: '/classes',
          name: 'classes',
          component: Classes,
          meta: {
            title: '班级管理'
          }
        },
        {
          path: '/addClasses',
          name: 'addClasses',
          component: ClassesModify,
          meta: {
            title: '添加班级'
          }
        },
        {
          path: '/editClasses/:id',
          name: 'editClasses',
          component: ClassesModify,
          meta: {
            title: '修改班级'
          }
        },
        {
          path: '/examManage',
          name: 'examManage',
          component: ExamManage,
          redirect: '/examManage/examEdit/:examId',
          children: [
            {
              path: 'examEdit/:examId',
              name: 'examEdit',
              component: ExamEdit,
              meta: {
                title: '考试修改'
              }
            },
            {
              path: 'examinee/:examId',
              name: 'examinee',
              component: Examinee,
              meta: {
                title: '考生管理'
              }
            },
            {
              path: 'examineeAdd/:examId',
              name: 'examineeAdd',
              component: ExamineeAdd,
              meta: {
                title: '考生批量修改'
              }
            },
            {
              path: 'examineeModify/add/:examId',
              name: 'examineeModifyAdd',
              component: ExamineeModify,
              meta: {
                title: '单个考生添加'
              }
            },
            {
              path: 'examineeModify/edit/:examId/:examineeId',
              name: 'examineeModifyEdit',
              component: ExamineeModify,
              meta: {
                title: '单个考生修改'
              }
            },
            {
              path: 'tfTopic/:examId',
              name: 'examTFTopic',
              component: ExamTFTopic,
              meta: {
                title: '考试判断题'
              }
            },
            {
              path: 'selectTopic/:examId',
              name: 'examSelectTopic',
              component: ExamSelectTopic,
              meta: {
                title: '考试选择题'
              }
            },
            {
              path: 'gapTopic/:examId',
              name: 'examGapTopic',
              component: ExamGapTopic,
              meta: {
                title: '考试程序填空题'
              }
            },
            {
              path: 'programTopic/:examId',
              name: 'examProgramTopic',
              component: ExamProgramTopic,
              meta: {
                title: '考试程序设计题'
              }
            },
            {
              path: 'examGrade/:examId',
              name: 'examGrade',
              component: ExamGrade,
              meta: {
                title: '考试评测'
              }
            },
            {
              path: 'examReader/:examId',
              name: 'examReader',
              component: ExamReader,
              meta: {
                title: '试卷预览'
              }
            },
            {
              path: 'examAnalysis/:examId',
              name: 'examAnalysis',
              component: ExamAnalysis,
              meta: {
                title: '试卷分析'
              }
            },
            {
              path: 'examNotice/:examId',
              name: 'examNotice',
              component: ExamNotice,
              meta: {
                title: '发布通知'
              }
            }
          ]
        },
        {
          path: '/topic',
          redirect: '/topic/mine'
        },
        {
          name: 'mineTopic',
          path: '/topic/mine',
          component: Topic,
          redirect: '/topic/mine/tfTopic',
          children: [
            {
              path: 'tfTopic',
              name: 'mineTF',
              component: TFTopic,
              meta: {
                title: '我的题库-判断题'
              }
            },
            {
              path: 'selectTopic',
              name: 'mineSelect',
              component: SelectTopic,
              meta: {
                title: '我的题库-选择题'
              }
            },
            {
              path: 'gapTopic',
              name: 'mineGap',
              component: GapTopic,
              meta: {
                title: '我的题库-程序填空题'
              }
            },
            {
              path: 'programTopic',
              name: 'mineProgram',
              component: ProgramTopic,
              meta: {
                title: '我的题库-程序设计题'
              }
            }
          ]
        },
        {
          name: 'commonTopic',
          path: '/topic/common',
          component: Topic,
          redirect: '/topic/common/tfTopic',
          children: [
            {
              path: 'tfTopic',
              name: 'commonTF',
              component: TFTopic,
              meta: {
                title: '公共题库-判断题'
              }
            },
            {
              path: 'selectTopic',
              name: 'commonSelect',
              component: SelectTopic,
              meta: {
                title: '公共题库-选择题'
              }
            },
            {
              path: 'gapTopic',
              name: 'commonGap',
              component: GapTopic,
              meta: {
                title: '公共题库-程序填空题'
              }
            },
            {
              path: 'programTopic',
              name: 'commonProgram',
              component: ProgramTopic,
              meta: {
                title: '公共题库-程序设计题'
              }
            }
          ]
        },
        {
          path: '/ide',
          name: 'ide',
          component: IDE,
          meta: {
            title: '在线IDE'
          }
        },
        {
          path: '/userManage',
          name: 'userManage',
          component: UserManage,
          meta: {
            title: '用户管理'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录'
      }
    }
  ]
}
Vue.use(VueRouter)
export default new VueRouter(router)