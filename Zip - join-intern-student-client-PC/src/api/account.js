export const CACHE = {}

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
    let dict = this.accountInfo

    for (let k in dict) {
      dict[k] = undefined
    }
    this.accountInfo = {}
  },
  ListenOnLogout (ev) {
    this.logoutAnnounceList.push(ev)
  },
  SetCache (key, value) {
    CACHE[key] = value
  },
  GetCache (key) {
    return CACHE[key]
  },
}
