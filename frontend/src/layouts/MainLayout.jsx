import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

function MainLayout({ children, className = '' }) {
  return (
    <div className={`min-h-screen ${className}`}>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default MainLayout
