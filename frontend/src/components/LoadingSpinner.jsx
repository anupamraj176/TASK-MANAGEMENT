import Spinner from './auth/LoadingSpinner'

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist">
      <Spinner />
    </div>
  )
}

export default LoadingSpinner
