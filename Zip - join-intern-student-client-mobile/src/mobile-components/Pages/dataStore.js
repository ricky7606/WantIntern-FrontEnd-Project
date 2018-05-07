const data = {}

export function Get (key) {
  return data[key]
}
export function Set (key, value) {
  data[key] = value
}
