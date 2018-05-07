import _axios from 'axios'
import qs from 'qs'
import FormData from 'form-data'

let req = _axios.create()
req.defaults.withCredentials = true
req.defaults.headers.post['Content-Type'] = 'application/json'

export const axios = req
export const parseForm = qs.stringify

export function PostForm (url, formData, successCbfn = res => res, failCbfn = res => res) {
  return req.post(url, parseForm(formData))
            .then(res => res.data)
            .then(successCbfn)
            .catch(err => {
              failCbfn(err)
              console.log(`get: ${url}`)
              console.log(err)
            })
}

export function Get (url, params, successCbfn = res => res, failCbfn = res => res) {
  return req.get(url, {
    params
  }).then(res => res.data)
    .then(successCbfn)
    .catch(err => {
      failCbfn(err)
      console.log(`get: ${url}`)
      console.log(err)
    })
}

// 提交
export function Post (url, formData, successCbfn = res => res, failCbfn = res => res) {
  let jsonString = ''

  try {
    jsonString = typeof formData === 'string' ? formData : JSON.stringify(formData)
  } catch (err) {
    failCbfn(err)
    console.error('JH: 提交的对象不是可以序列化的。')
    console.warn(err)
  }

  return req.post(url, jsonString)
            .then(res => res.data)
            .then(successCbfn)
            .catch(err => {
              failCbfn(err)
              console.log(`postJson: ${url}`)
              console.log(err)
            })
}

// 修改
export function Put (url, formData, successCbfn = res => res, failCbfn = res => res) {
  let jsonString = ''

  try {
    jsonString = typeof formData === 'string' ? formData : JSON.stringify(formData)
  } catch (err) {
    failCbfn(err)
    console.error('JH: 提交的对象不是可以序列化的。')
    console.warn(err)
  }

  return req.put(url, jsonString, {headers: {'Content-Type': 'application/json'}})
            .then(res => res.data)
            .then(successCbfn)
            .catch(err => {
              failCbfn(err)
              console.log(`postJson: ${url}`)
              console.log(err)
            })
}

// 删除
export function Delete (url, formData, successCbfn = res => res, failCbfn = res => res) {
  let jsonString = ''

  try {
    jsonString = typeof formData === 'string' ? formData : JSON.stringify(formData)
  } catch (err) {
    failCbfn(err)
    console.error('JH: 提交的对象不是可以序列化的。')
    console.warn(err)
  }

  return req.delete(url, jsonString)
            .then(res => res.data)
            .then(successCbfn)
            .catch(err => {
              failCbfn(err)
              console.log(`postJson: ${url}`)
              console.log(err)
            })
}

export function PostFile (url, file, successCbfn = res => res, failCbfn = res => res) {
  let instance = _axios.create()
  instance.defaults.withCredentials = true

  let data = new FormData()
  data.append('file', file)
  return instance.post(url, data, {headers: {'Content-Type': 'multipart/form-data'}})
          .then(res => res.data)
          .then(successCbfn)
          .catch(err => {
            failCbfn(err)
            console.log(`post file to url ${url}`)
            console.log(err)
          })
}
