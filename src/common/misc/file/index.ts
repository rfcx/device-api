import dayjs from 'dayjs'

export const generateFileName = (streamId: string, deploymentId: string, ext: string): string => {
  const now = dayjs().format('YYYY-MM-DDTHH-mm-ss')
  return `${streamId}-${deploymentId}-${now}.${ext}`
}

export const fileNameToPath = (name: string): string => {
  const splitedName = name.split(/-|T/)
  const year = splitedName[2]
  const month = splitedName[3]
  const day = splitedName[4]
  return `${year}/${month}/${day}/${name}`
}
