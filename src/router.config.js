import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Index from '@/pages/Index'
import ExamList from '@/pages/ExamList'
import ExamModify from '@/pages/ExamModify'
import Classes from '@/pages/Classes'
import ClassesModify from '@/pages/ClassesModify'
import ExamManage from '@/pages/ExamManage'
import ExamEdit from '@/pages/examManage/ExamEdit'
import Examinee from '@/pages/examManage/examinee/Examinee'
import ExamineeAdd from "@/pages/examManage/examinee/ExamineeAdd"
import ExamineeModify from "@/pages/examManage/examinee/ExamineeModify"
import Topic from "@/pages/topic/Topic"
import TFTopic from "@/pages/topic/TFTopic"
import SelectTopic from "@/pages/topic/SelectTopic"
import GapTopic from "@/pages/topic/GapTopic"
import ProgramTopic from "@/pages/topic/ProgramTopic"
import ExamTFTopic from "@/pages/examManage/topic/TFTopic"
import ExamSelectTopic from "@/pages/examManage/topic/SelectTopic"
import ExamGapTopic from "@/pages/examManage/topic/GapTopic"
import ExamProgramTopic from "@/pages/examManage/topic/ProgramTopic"
import ExamGrade from "@/pages/examManage/ExamGrade"
import ExamReader from "@/pages/examManage/ExamReader"
import ExamAnalysis from "@/pages/examManage/ExamAnalysis"
import UserManage from '@/pages/UserManage'
import IDE from "@/pages/IDE"

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
