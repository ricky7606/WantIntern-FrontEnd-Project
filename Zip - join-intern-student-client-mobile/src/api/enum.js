export const mapPhotoType = {
  STU_AVATAR: 'STU_AVATAR',
  STU_CARD: 'STU_CARD',
  STU_CERT: 'STU_CERT',
  COMPANY_LOGO: 'COMPANY_LOGO',
  COMPANY_CERT: 'COMPANY_CERT',
  OTHER: 'OTHER',
}

// 关于Resume state各个状态的解释如下：
// 0 - 新简历 NEW
//     企业拒绝 -> 7 CANCELED [State]
//     企业发送面试邀请 -> 1 WAIT_STU_CONFIRM
//       [State, interviewTime, interviewPlace, contact, contactPhone]
//
// 1 - 待学生确认面试时间 WAIT_STU_CONFIRM
//     学生修改时间 -> 2 WAIT_COMPANY_CONFIRM [state, interviewTime, commentStu]
//     学生确认 -> 3 CONFIRMED [state]
//
// 2 - 待企业确认面试时间 WAIT_COMPANY_CONFIRM
//     企业修改时间 -> 1 [后期流程简化，这个不用了]
//     企业确认 -> 3 [state]
// 3 - 已确认面试时间 CONFIRMED
//     企业发送offer -> 4 [state, offerTime, offerPlace, contact, contactPhone]
//     企业拒绝 -> 7 CANCELED [state]
//
// 4 - 待接受offer OFFERED
//     学生接受offer -> 5 [state]
//     学生拒绝 -> 7 [state]
//
// 5 - 实习中 WORKING
//     企业确认结束 -> 6 [state]
//
// 6 - 实习结束 ENDED （这个地方，会结合commentStu, commentComp字段）
//     学生评价 -> 评价 [state, commentStu]
//         -> 如果commentComp为 "企业已评价" state改为 8 COMMNETED
//         -> 如果commentComp为空 state改为 6 ENDED
//     企业评价 -> 评价 [state, commentComp]
//         -> 如果commentStu为 "学生已评价" state改为 8 COMMNETED
//         -> 如果commentStu为空 state改为 6 ENDED
//
// 7 - 实习未进行 CANCELED
// 8 - 评论 COMMENTED

export const mapResumeState = {
  NEW: 'NEW',
  WAIT_STU_CONFIRM: 'WAIT_STU_CONFIRM',
  WAIT_COMP_CONFIRM: 'WAIT_COMP_CONFIRM',
  CONFIRMED: 'CONFIRMED',
  OFFERED: 'OFFERED',
  WORKING: 'WORKING',
  ENDED: 'ENDED',
  CANCELED: 'CANCELED',
  COMMENTED: 'COMMENTED',

  list: [
    'NEW',
    'WAIT_STU_CONFIRM',
    'WAIT_COMPANY_CONFIRM',
    'CONFIRMED',
    'OFFERED',
    'WORKING',
    'ENDED',
    'CANCELED',
    'COMMENTED',
  ]
}
// "id": 123,
// "state": "NEW",
// "interviewTime": "2017-10-01 08:00:00",
// "commentStu": "string",
// "commentComp": "string",
// "positionId": 0,
// "stuId": 0,
// "createTime": "2017-10-01 08:00:00",
// "updateTime": "2017-10-01 08:00:00"

export const mapRankState = {
  titleList: [
    '同事氛围',
    '学习机会',
    '职业发展',
    '办公环境',
    '福利待遇',
  ],
}
