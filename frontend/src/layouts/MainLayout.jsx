import Navbar from '../components/layout/Navbar'


function MainLayout({ children, className = '' }) {
  return (
    <div className={`min-h-screen ${className}`}>
      <Navbar />
      {children}

    </div>
  )
}

export default MainLayout
