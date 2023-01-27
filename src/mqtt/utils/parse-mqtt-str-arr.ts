export const parseMqttStrArr = function (str: string | null, delimA: string = '|', delimB: string = '*'): string[][] {
  if ((str === null) || (str === undefined) || (str.length === 0)) { return [] }
  try {
    const rtrnArr: string[][] = []
    const arr = str.split(delimA)
    if (arr.length > 0) {
      arr.forEach((i) => {
        rtrnArr.push(i.split(delimB))
      })
      return rtrnArr
    } else {
      return [[str]]
    }
  } catch (e) {
    console.error(e)
    return []
  }
}
