import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'

export default function BookOverviewError() {
    const err = useRouteError()
    const message = isRouteErrorResponse(err)
        ? err.statusText || `Error ${err.status}`
        : err instanceof Error
          ? err.message
          : 'Something went wrong.'

    return (
        <div style={{ padding: '15rem' }}>
            <h3>Couldn’t load books</h3>
            <p>{message}</p>
            <p>
                <button onClick={() => window.location.reload()}>Retry</button>{' '}
                <Link to="/">Go home</Link>
            </p>
        </div>
    )
}
