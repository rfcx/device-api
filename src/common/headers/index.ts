import { AppInfo } from 'src/types'

export const userAgentToAppInfo = function (userAgent: string | undefined): AppInfo | undefined {
  if (userAgent === undefined) return undefined
  const appInfo = userAgent.split('/')
  return { name: appInfo[0], versionName: appInfo[1], versionCode: +appInfo[2] }
}
