import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getPageMeta } from '../data/seo'

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    const [key, rawName] = attribute.split('=')
    element.setAttribute(key, rawName)
    document.head.appendChild(element)
  }
  element.setAttribute('content', value)
}

export default function Seo({ project, notFound = false }) {
  const { i18n } = useTranslation()
  const spanish = i18n.resolvedLanguage?.startsWith('es')
  const { title, description, canonical, robots, jsonLd } = getPageMeta({ project, notFound, spanish })
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : null

  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'name=description', description)
    setMeta('meta[property="og:title"]', 'property=og:title', title)
    setMeta('meta[property="og:description"]', 'property=og:description', description)
    setMeta('meta[name="robots"]', 'name=robots', robots)

    if (canonical) {
      setMeta('meta[property="og:url"]', 'property=og:url', canonical)
      let link = document.head.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
    } else {
      document.head.querySelector('meta[property="og:url"]')?.remove()
      document.head.querySelector('link[rel="canonical"]')?.remove()
    }

    const id = 'portfolio-json-ld'
    document.getElementById(id)?.remove()
    if (!jsonLdText) return undefined

    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.text = jsonLdText
    document.head.appendChild(script)
    return () => script.remove()
  }, [canonical, description, jsonLdText, robots, title])

  return null
}
