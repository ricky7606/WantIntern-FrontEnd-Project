export const mapReqEdu = {
  BACHELOR: '本科',
  COLLEGE: '专科',
  MASTER: '硕士',
  PHD: '博士',
}

export const mapReqGender = {
  MALE: '男',
  FEMALE: '女',
}

export const mapReqLangLevel = {
  NORMAL: '正常',
  GOOD: '较好',
  SKILLED: '流利',
  PROFICIENT: '专业',
}

export function AnalyseNotificationToResume (txt) {
  let keywordDict = {
    '确认面试时间': 'WAIT_STU_CONFIRM',
    '录取通知': 'OFFERED',
    '面试未通过': 'ENDED',
  }

  for (let w in keywordDict) {
    if (txt.indexOf(w) !== -1) {
      return keywordDict[w]
    }
  }
}

export const CollectPosition = {
  loaded: false,
  list: [],
  find (id) {
    let list = this.list
    return list.indexOf(id) !== -1
  },
  add (id) {
    let list = this.list
    if (list.indexOf(id) === -1) {
      list.push(id)
    }
  },
  remove (id) {
    let list = this.list
    let index = list.indexOf(id)
    if (index !== -1) {
      list.splice(index, 1)
      this.list = list
    }
    return list
  },
}
