import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    console.error('Uncaught application error:', error, errorInfo)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    const showDetails = import.meta.env.DEV
    return (
      <main className="error-boundary" role="alert">
        <p className="project-eyebrow">application_error</p>
        <h1>Something went wrong.</h1>
        <p>Reload the page or return to the portfolio home page.</p>
        <a className="btn-primary" href="/">Return home</a>
        {showDetails && (
          <details><summary>Development details</summary><pre>{this.state.error?.toString()}\n{this.state.errorInfo?.componentStack}</pre></details>
        )}
      </main>
    )
  }
}

export default ErrorBoundary
