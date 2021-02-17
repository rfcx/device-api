export const getUserUid = (fullUid: string): string => {
  return fullUid.substring(fullUid.lastIndexOf('|') + 1, fullUid.length)
}
