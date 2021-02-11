var csprng = require('csprng')

export const randomHash = (bits: number) => {
  return csprng(bits, 36)
}

export const randomString = (length: number) => {
  return randomHash(320).substr(0, length)
}
