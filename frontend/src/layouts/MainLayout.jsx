import Navbar from '../components/Navbar'

function MainLayout({ children, className = '' }) {
  return (
    <div className={`min-h-screen ${className}`}>
      <Navbar />
      {children}
    </div>
  )
}

export default MainLayout
