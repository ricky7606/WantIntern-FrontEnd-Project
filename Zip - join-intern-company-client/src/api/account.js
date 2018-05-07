import {
  PersonalInfomation,
  AccountInfomation
} from '../components/Account/AccountData.js'

export const Account = {
  phone: '',
  password: '',
  accountInfo: {},
  anounceList: [
    log => console.log(log),
  ],
  announce (data) {
    let list = this.anounceList
    list.forEach(item => item(data || this.acountInfo))
  },
  checkInfoFull () {
    let info = this.accountInfo
    if (!info.id) {
      return false
    }

    let result = !!PersonalInfomation.find(item => {
      let key = item.key
      let isAllowNull = item.isAllowNull

      if (isAllowNull) return false
      if (!info[key]) return true
      return false
    })
    if (result) return false

    result = !!AccountInfomation.find(item => {
      let key = item.key
      let isAllowNull = item.isAllowNull

      if (isAllowNull) return false
      if (!info[key]) return true
      return false
    })
    if (result) return false

    return true
  },
  changeAndAnnounce (data) {
    if (data) {
      this.accountInfo = data
      this.announce(data)
    }
  },
  logoutAnnounceList: [],
  logout () {
    console.log('logout')
    this.logoutAnnounceList.forEach(item => item())
  },
}
