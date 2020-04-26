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

export default {
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
          component: Index
        },
        {
          path: '/examList',
          name: 'examList',
          component: ExamList
        },
        {
          path: '/addExam',
          name: 'addExam',
          component: ExamModify
        },
        {
          path: '/classes',
          name: 'classes',
          component: Classes
        },
        {
          path: '/addClasses',
          name: 'addClasses',
          component: ClassesModify
        },
        {
          path: '/editClasses/:id',
          name: 'editClasses',
          component: ClassesModify
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
              component: ExamEdit
            },
            {
              path: 'examinee/:examId',
              name: 'examinee',
              component: Examinee
            },
            {
              path: 'examineeAdd/:examId',
              name: 'examineeAdd',
              component: ExamineeAdd
            },
            {
              path: 'examineeModify/add/:examId',
              name: 'examineeModifyAdd',
              component: ExamineeModify
            },
            {
              path: 'examineeModify/edit/:examId/:examineeId',
              name: 'examineeModifyEdit',
              component: ExamineeModify
            },
            {
              path: 'tfTopic/:examId',
              name: 'examTFTopic',
              component: ExamTFTopic
            },
            {
              path: 'selectTopic/:examId',
              name: 'examSelectTopic',
              component: ExamSelectTopic
            },
            {
              path: 'gapTopic/:examId',
              name: 'examGapTopic',
              component: ExamGapTopic
            },
            {
              path: 'programTopic/:examId',
              name: 'examProgramTopic',
              component: ExamProgramTopic
            },
            {
              path: 'examGrade/:examId',
              name: 'examGrade',
              component: ExamGrade
            },
            {
              path: 'examReader/:examId',
              name: 'examReader',
              component: ExamReader
            },
            {
              path: 'examAnalysis/:examId',
              name: 'examAnalysis',
              component: ExamAnalysis
            },
            {
              path: 'examNotice/:examId',
              name: 'examNotice',
              component: ExamNotice
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
              component: TFTopic
            },
            {
              path: 'selectTopic',
              name: 'mineSelect',
              component: SelectTopic
            },
            {
              path: 'gapTopic',
              name: 'mineGap',
              component: GapTopic
            },
            {
              path: 'programTopic',
              name: 'mineProgram',
              component: ProgramTopic
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
              component: TFTopic
            },
            {
              path: 'selectTopic',
              name: 'commonSelect',
              component: SelectTopic
            },
            {
              path: 'gapTopic',
              name: 'commonGap',
              component: GapTopic
            },
            {
              path: 'programTopic',
              name: 'commonProgram',
              component: ProgramTopic
            }
          ]
        },
        {
          path: '/ide',
          name: 'ide',
          component: IDE
        },
        {
          path: '/userManage',
          name: 'userManage',
          component: UserManage
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
}
