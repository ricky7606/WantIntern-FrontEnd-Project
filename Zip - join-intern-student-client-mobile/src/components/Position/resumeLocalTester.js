const SUBMIT_RESUME_ID_LIST = 'SUBMIT_RESUME_ID_LIST'
export function updateResumeItem (id) {
  let d = getResumeItem() || {}
  let now = new Date().getTime()

  if (!d[id]) {
    d[id] = now
  } else {
    d[id] = now
  }
  setResumeItem(d)
}
export function checkResumeItem (id) {
  let d = getResumeItem() || {}
  return d[id]
}
export function refreshResumeItem () {
  let d = getResumeItem() || {}
  let now = new Date().getTime()

  for (let k in d) {
    if (now - d[k] > (3 * 24 * 60 * 60 * 1000)) {
      d[k] = false
    }
  }
  setResumeItem(d)
}

export function getResumeItem () {
  try {
    return JSON.parse(localStorage.getItem(SUBMIT_RESUME_ID_LIST)) || {}
  } catch (err) {
    console.log(err)
    return {}
  }
}
export function setResumeItem (d) {
  try {
    localStorage.setItem(SUBMIT_RESUME_ID_LIST, JSON.stringify(d))
  } catch (err) {
    console.log(err)
    return {}
  }
}
