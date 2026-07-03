import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useOutletContext } from 'react-router-dom'

import { LoginPage } from './pages/Login/LoginPage'
import { CadastroPage } from './pages/Cadastro/CadastroPage'
import { VerificarCodigoPage } from './pages/VerificarCodigo/VerificarCodigoPage'
import { DashboardPage } from './pages/Dashboard/DashboardPage'

import { Header } from './components/layout/Header'
import { Loading } from './components/ui/Loading'

import { fetchCurrentUser, isMockAuthEnabled } from './services/auth'
import { getCookie, removeCookie, TOKEN_COOKIE_NAME } from './utils/cookies'
import type { UserProfile } from './types/auth'

// 🔒 Camada 1: garante que existe um token válido e carrega o perfil do usuário
function GaranteAutenticacao() {
  const [carregando, setCarregando] = useState(true)
  const [autenticado, setAutenticado] = useState(false)
  const [perfil, setPerfil] = useState<UserProfile | null>(null)
  const location = useLocation()

  useEffect(() => {
    async function checarPerfil() {
      const token = getCookie(TOKEN_COOKIE_NAME)
      //retirar isMock depois de integrar com o back
      if (!token && !isMockAuthEnabled()) {
        setAutenticado(false)
        setCarregando(false)
        return
      }

      try {
        // implemente fetchCurrentUser quando conexao do back estiver pronta
        const usuario = await fetchCurrentUser()
        setPerfil(usuario)
        setAutenticado(true)
      } catch (error) {
        console.error('Token inválido ou expirado', error)
        removeCookie(TOKEN_COOKIE_NAME)
        setAutenticado(false)
      } finally {
        setCarregando(false)
      }
    }

    checarPerfil()
  }, [location])

  if (carregando) return <Loading fullScreen text="Verificando credenciais..." />

  // 📥 Passa o perfil encontrado no contexto do Outlet para os filhos usarem
  return autenticado ? <Outlet context={perfil} /> : <Navigate to="/login" replace />
}

// 🌐 Camada 2: layout com header para as áreas autenticadas
function LayoutComHeader() {
  const perfil = useOutletContext<UserProfile | null>()

  return (
    <>
      <Header perfil={perfil} />
      <Outlet context={perfil} />
    </>
  )
}

// 🛡️ Camada 3: bloqueio por tela, conforme as permissões do perfil
function PermissaoDaPagina({ idPagina }: { idPagina: string }) {
  const perfil = useOutletContext<UserProfile | null>()
  const permitido = perfil?.telasPermitidas?.includes(idPagina) ?? false

  return permitido ? <Outlet /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route path="/verificar-codigo" element={<VerificarCodigoPage />} />

      {/* 🔒 Camada 1: garante que está logado e pega o perfil */}
      <Route element={<GaranteAutenticacao />}>
        {/* 🌐 Camada 2: aplica o Header passando o perfil recebido */}
        <Route element={<LayoutComHeader />}>
          {/* 🛡️ Camada 3: bloqueios individuais por tela */}
          <Route element={<PermissaoDaPagina idPagina="dashboard" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Novas telas autenticadas entram aqui, seguindo o mesmo padrão:
              <Route element={<PermissaoDaPagina idPagina="id-da-tela" />}>
                <Route path="/rota" element={<SuaPagina />} />
              </Route> */}
        </Route>
      </Route>
    </Routes>
  )
}

export default App
