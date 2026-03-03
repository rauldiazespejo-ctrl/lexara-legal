import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import { Sidebar, BottomNav } from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Casos from './pages/Casos'
import CasoDetalle from './pages/CasoDetalle'
import Plazos from './pages/Plazos'
import Agenda from './pages/Agenda'
import Honorarios from './pages/Honorarios'
import Normativa from './pages/Normativa'
import Analysis from './pages/Analysis'
import CivilPage from './pages/especialidades/Civil'
import LaboralPage from './pages/especialidades/Laboral'
import PenalPage from './pages/especialidades/Penal'
import FamiliaPage from './pages/especialidades/Familia'
import TributarioPage from './pages/especialidades/Tributario'
import ComercialPage from './pages/especialidades/Comercial'
import Documentos from './pages/Documentos'
import Settings from './pages/Settings'

function AppShell() {
  const { user } = useAuth()
  if (!user) return <Login />
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top left,#0d1b3e 0%,#06090e 55%)' }}>
        <Header />
        <Sidebar />
        <main className="pt-14 pb-20 lg:pb-0 lg:ml-60 min-h-screen">
          <div className="p-4 md:p-5 max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/casos" element={<Casos />} />
              <Route path="/casos/:id" element={<CasoDetalle />} />
              <Route path="/plazos" element={<Plazos />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/honorarios" element={<Honorarios />} />
              <Route path="/normativa" element={<Normativa />} />
              <Route path="/documentos" element={<Documentos />} />
              <Route path="/civil" element={<CivilPage />} />
              <Route path="/laboral" element={<LaboralPage />} />
              <Route path="/penal" element={<PenalPage />} />
              <Route path="/familia" element={<FamiliaPage />} />
              <Route path="/tributario" element={<TributarioPage />} />
              <Route path="/comercial/*" element={<ComercialPage />} />
              <Route path="/analisis/*" element={<Analysis />} />
              <Route path="/configuracion" element={<Settings />} />
            </Routes>
          </div>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
