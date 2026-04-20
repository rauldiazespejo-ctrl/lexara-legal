import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppDataProvider } from './context/AppDataContext'
import { UfProvider } from './context/UfContext'
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
import Abogados from './pages/Abogados'
import EjecutivoPage from './pages/especialidades/Ejecutivo'
import TimeTracking from './pages/TimeTracking'
import Calculadoras from './pages/Calculadoras'
import Tribunales from './pages/Tribunales'
import Biblioteca from './pages/Biblioteca'
import Analytics from './pages/Analytics'
import ClausulasRedactor from './pages/ClausulasRedactor'
import TeoriaDelCaso from './pages/TeoriaDelCaso'

function routerBasename(): string | undefined {
  const b = import.meta.env.BASE_URL
  if (b === '/' || !b) return undefined
  return b.endsWith('/') ? b.slice(0, -1) : b
}

function AppShell() {
  const { user } = useAuth()
  if (!user) return <Login />
  return (
    <BrowserRouter basename={routerBasename()}>
      <UfProvider>
      <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top left,#0d1b3e 0%,#06090e 55%)' }}>
        <Header />
        <Sidebar />
        <main className="pt-14 pb-20 lg:pb-0 lg:ml-60 min-h-screen">
          <div className="p-4 md:p-6 max-w-6xl mx-auto w-full">
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
              <Route path="/ejecutivo" element={<EjecutivoPage />} />
              <Route path="/abogados" element={<Abogados />} />
              <Route path="/analisis" element={<Analysis />} />
              <Route path="/time-tracking" element={<TimeTracking />} />
              <Route path="/calculadoras" element={<Calculadoras />} />
              <Route path="/tribunales" element={<Tribunales />} />
              <Route path="/biblioteca" element={<Biblioteca />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/redactor-contratos" element={<ClausulasRedactor />} />
              <Route path="/teoria-caso" element={<TeoriaDelCaso />} />
              <Route path="/configuracion" element={<Settings />} />
            </Routes>
          </div>
        </main>
        <BottomNav />
      </div>
      </UfProvider>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AppShell />
      </AppDataProvider>
    </AuthProvider>
  )
}
