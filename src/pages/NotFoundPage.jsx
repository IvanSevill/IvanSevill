import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'

export default function NotFoundPage({ projectSlug }) {
  const { i18n } = useTranslation()
  const spanish = i18n.resolvedLanguage?.startsWith('es')
  return (
    <main id="main-content" tabIndex="-1" className="not-found container">
      <Seo notFound />
      <p className="project-eyebrow">404 · route_not_found</p>
      <h1>{spanish ? 'Esta ruta no existe' : 'This route does not exist'}</h1>
      <p>
        {projectSlug
          ? spanish ? `No hay un proyecto destacado con el slug “${projectSlug}”.` : `There is no featured project with the slug “${projectSlug}”.`
          : spanish ? 'La dirección solicitada no forma parte del portfolio.' : 'The requested address is not part of this portfolio.'}
      </p>
      <Link className="btn-primary" to={projectSlug ? '/#projects' : '/'}>
        {spanish ? 'Volver al portfolio' : 'Return to portfolio'}
      </Link>
    </main>
  )
}
