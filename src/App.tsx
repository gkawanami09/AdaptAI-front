import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/Login/LoginPage'
import { CadastroPage } from './pages/Cadastro/CadastroPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
    </Routes>
  )
}

export default App
