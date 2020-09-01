import defaultSettings from '@/settings'

const title = defaultSettings.title || '农业物联网监控平台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
