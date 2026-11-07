import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PERSON, PERSON_JSON_LD, SITE_TITLE } from './person'

const indexHtml = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')

describe('personal search identity', () => {
  it('uses the full name and the handle in the home title', () => {
    expect(SITE_TITLE).toBe('Iván Jesús Sevillano Plaza | IvanSevill')
    expect(indexHtml).toContain(`<title>${SITE_TITLE}</title>`)
  })

  it('lists the name and handle spellings people search for', () => {
    expect(PERSON.name).toBe('Iván Jesús Sevillano Plaza')
    expect(PERSON.alternateName).toEqual(expect.arrayContaining([
      'Iván Sevillano', 'Ivan Sevillano', 'Ivan Jesus Sevillano Plaza', 'IvanSevill', 'ivansevil',
      'Iban Sevillano', 'IbanSevill',
    ]))
  })

  it('ships the Person JSON-LD in the static HTML so crawlers see it without JavaScript', () => {
    const match = indexHtml.match(/<script id="portfolio-json-ld" type="application\/ld\+json">([\s\S]*?)<\/script>/)
    expect(match).not.toBeNull()
    expect(JSON.parse(match[1])).toEqual(PERSON_JSON_LD)
  })
})
