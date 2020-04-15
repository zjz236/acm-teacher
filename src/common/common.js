export const userKey = {
  username: '用户名',
  trueName: '姓名',
  sex: '性别',
  school: '学校',
  email: '邮箱',
  isAdmin: '用户信息',
  createTime: '注册时间'
}
export const getSex = {
  1: '男',
  0: '女'
}
export const routerMenu = {
  index: 'index',
  examList: 'examList',
  classes: 'classes',
  mine: 'mineTopic',
  common: 'commonTopic',
  ide: 'ide'
}
export const languages = {c: 'C语言', cpp: 'C++', java: 'Java', python: 'Python'}
export const routerActive = {
  index: ['index'],
  examList: ['examList',
    'addExam', 'examEdit',
    'examinee',
    'examineeAdd',
    'examineeModifyAdd',
    'examineeModifyEdit',
    'examTFTopic',
    'examSelectTopic',
    'examGapTopic',
    'examProgramTopic',
    'examGrade',
    'examReader',
    'examAnalysis',
    'examNotice'],
  classes: ['classes', 'addClasses'],
  mine: ['mineTopic', 'mineTF', 'mineSelect', 'mineGap', 'mineProgram'],
  common: ['commonTopic', 'commonTF', 'commonSelect', 'commonGap', 'commonProgram'],
  ide: ['ide']
}
export const examMenu = {
  examEdit: ['examEdit', 'examTFTopic', 'examSelectTopic', 'examGapTopic', 'examProgramTopic'],
  examinee: ['examinee', 'examineeAdd', 'examineeModifyAdd', 'examineeModifyEdit'],
  examGrade: ['examGrade'],
  examReader: ['examReader'],
  examAnalysis: ['examAnalysis'],
  examNotice: ['examNotice']
}
export const topicMenu = {
  tfTopic: ['mineTF', 'commonTF'],
  selectTopic: ['mineSelect', 'commonSelect'],
  gapTopic: ['mineGap', 'commonGap'],
  programTopic: ['mineProgram', 'commonProgram']
}
export const examStatus = (start, end) => {
  if (new Date() < new Date(start)) {
    return 'pending'
  }
  if (new Date() > new Date(start) && new Date() < new Date(end)) {
    return 'starting'
  }
  if (new Date() > new Date(end)) {
    return 'ending'
  }
}
export const examineeTable = [
  {
    value: 'username',
    label: '用户名',
    type: 'input'
  },
  {
    value: 'password',
    label: '密码',
    type: 'input'
  },
  {
    value: 'school',
    label: '学校',
    type: 'input'
  },
  {
    value: 'college',
    label: '学院',
    type: 'input'
  },
  {
    value: 'major',
    label: '专业',
    type: 'input'
  },
  {
    value: 'className',
    label: '班级',
    type: 'input'
  },
  {
    value: 'name',
    label: '姓名',
    type: 'input'
  },
  {
    value: 'studentId',
    label: '学号',
    type: 'input'
  },
  {
    value: 'sex',
    label: '性别',
    type: 'select',
    options: [
      {
        key: 0,
        value: '女'
      },
      {
        key: 1,
        value: '男'
      }
    ]
  },
  {
    value: 'notes',
    label: '备注',
    type: 'input'
  }
]

export const section = [
  {
    text: '无',
    value: 999
  },
  {
    text: 'C-输入/输出',
    value: 0
  },
  {
    text: 'C-数组',
    value: 1
  },
  {
    text: 'C-函数',
    value: 2
  },
  {
    text: 'C-位运算',
    value: 3
  },
  {
    text: 'C-指针',
    value: 4
  },
  {
    text: 'C-文件操作',
    value: 5
  },
  {
    text: 'C-综合考查',
    value: 6
  },
  {
    text: 'C-字符串处理',
    value: 7
  },
  {
    text: 'C-运算符与表达式',
    value: 8
  },
  {
    text: 'C-结构体与共用体',
    value: 9
  },
  {
    text: 'C-编译预处理',
    value: 10
  },
  {
    text: 'C++-基本数据类型与表达式',
    value: 11
  },
  {
    text: 'C++-控制结构',
    value: 12
  },
  {
    text: 'C++-数组与字符串',
    value: 13
  },
  {
    text: 'C++-函数',
    value: 14
  },
  {
    text: 'C++-指针',
    value: 15
  },
  {
    text: 'C++-结构体与共用体',
    value: 16
  },
  {
    text: 'C++-编译预处理',
    value: 17
  },
  {
    text: 'C++-类和对象',
    value: 18
  },
  {
    text: 'C++-继承与派生',
    value: 19
  },
  {
    text: 'C++-多态性与虚函数',
    value: 20
  },
  {
    text: 'C++-模板与异常处理',
    value: 21
  },
  {
    text: 'C++-标准库和输入/输出流',
    value: 22
  },
  {
    text: '数据结构-绪论',
    value: 23
  },
  {
    text: '数据结构-查找和排序',
    value: 24
  },
  {
    text: '数据结构-线性表',
    value: 25
  },
  {
    text: '数据结构-栈和队列',
    value: 26
  },
  {
    text: '数据结构-串',
    value: 27
  },
  {
    text: '数据结构-数组和广义表',
    value: 28
  },
  {
    text: '数据结构-树和二叉树',
    value: 29
  },
  {
    text: '数据结构-图',
    value: 30
  },
  {
    text: '数据结构-文件',
    value: 31
  },
  {
    text: 'Java-数据类型与表达式',
    value: 32
  },
  {
    text: 'Java-流程控制',
    value: 33
  },
  {
    text: 'Java-数组',
    value: 34
  },
  {
    text: 'Java-类与对象',
    value: 35
  },
  {
    text: 'Java-继承与多态',
    value: 36
  },
  {
    text: 'Java-异常处理',
    value: 37
  },
  {
    text: 'Java-综合',
    value: 38
  },
  {
    text: 'C++-NOIP模拟',
    value: 39
  }
]

export const difficulty = [0, 60, 70, 80, 90, 100]

export const baseUrl = () => {
  return process.env.VUE_APP_URL
}

export const matchReg = (str) => {
  const reg = /<\/?.+?\/?>/g
  return str.replace(reg, '')
}

export const languageModel = {
  c: '#include <stdio.h>\nint main()\n{\n    printf("Hello, World!");\n    return 0;\n}',
  cpp: '#include <iostream>\nusing namespace std;\nint main()\n{\n    cout << "Hello, World!";\n    return 0;\n}',
  java: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
  python: '#Hello, World\n \nprint("Hello, World!")'
}

export const gapCodeShow = (code, gaps) => {
  for (const index in gaps) {
    const gap = gaps[parseInt(index)]
    if (gap && code.indexOf(`_(${parseInt(index) + 1})_`) >= 0) {
      code = code.replace(`_(${parseInt(index) + 1})_`, gap)
    }
  }
  return code
}
