function _get (key = '') {
  if (!key) return null
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (err) {
    console.warn('ERROR: on storage.js when trying to GET key "' + key + '" on localStorage')
  }
}
function _set (value, key = '') {
  if (!key) return null
  try {
    return localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn('ERROR: on storage.js when trying to SET key "' + key + '" on localStorage')
  }
}

export const Get = _get
export const Set = _set

export const OPENID_STORAGE_TAG = 'OPENID_STORAGE_TAG'
