export const SITE_URL = 'https://ivansevill.com'

export const PERSON = {
  name: 'Iván Jesús Sevillano Plaza',
  givenName: 'Iván Jesús',
  familyName: 'Sevillano Plaza',
  alternateName: [
    'Iván Sevillano',
    'Ivan Sevillano',
    'Iván Sevillano Plaza',
    'Ivan Sevillano Plaza',
    'Iván Jesús Sevillano',
    'Ivan Jesus Sevillano',
    'Ivan Jesus Sevillano Plaza',
    // Common misspellings, so typo searches still match.
    'Iban Sevillano',
    'Iban Sevillano Plaza',
    'Iban Jesus Sevillano Plaza',
    'Ivan Sevilano',
    'IvanSevill',
    'ivansevil',
    'IbanSevill',
    'ibansevil',
  ],
  sameAs: ['https://github.com/IvanSevill'],
}

export const SITE_TITLE = `${PERSON.name} | IvanSevill`

// Keep in sync with the static copy in index.html; person.test.js enforces it.
export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  ...PERSON,
  url: SITE_URL,
  image: `${SITE_URL}/images/profile.jpg`,
  jobTitle: 'Estudiante de Ingeniería del Software',
}
