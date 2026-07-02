import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/Login/LoginPage'
import { CadastroPage } from './pages/Cadastro/CadastroPage'
import { VerificarCodigoPage } from './pages/VerificarCodigo/VerificarCodigoPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/verificar-codigo" element={<VerificarCodigoPage />} />
    </Routes>
  )
}

export default App
