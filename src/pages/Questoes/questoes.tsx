import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { FiltersCard } from '../../components/cards/FiltersCard'
import type { FilterGroup } from '../../components/cards/FiltersCard'
import { QuestionListItem } from '../../components/cards/QuestionListItem'
import { AnsweredQuestionListItem } from '../../components/cards/AnsweredQuestionListItem'
import { GerarListaIAModal } from '../../components/cards/GerarListaIAModal'
import { Pagination } from '../../components/ui/Pagination'
import { Toast } from '../../components/ui/Toast'
import type { ToastType } from '../../components/ui/Toast'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { SparklesIcon } from '../../components/ui/icons'
import styles from './Questoes.module.css'

import {
  deletarLista,
  getBancoQuestoesFiltros,
  getBancoQuestoesListas,
  getBancoQuestoesRespondidas,
  getGeracaoListaIA,
  postGerarListaComIA,
  postRefazerLista,
} from '../../services/bancoQuestoes'
import type {
  BancoQuestoesRespondidaStatus,
  GetBancoQuestoesFiltrosResponse,
  GetBancoQuestoesListasResponse,
  GetBancoQuestoesRespondidasResponse,
  PostGerarListaComIAParams,
} from '../../types/bancoQuestoes'

const INTERVALO_POLL_GERACAO_MS = 2500
const TIMEOUT_POLL_GERACAO_MS = 120000

const LIMITE_POR_PAGINA = 20

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function Questoes() {
  const navigate = useNavigate()
  const [vestibulares, setVestibulares] = useState<string[]>([])
  const [dificuldades, setDificuldades] = useState<string[]>([])
  const [materias, setMaterias] = useState<string[]>([])
  const [assuntos, setAssuntos] = useState<string[]>([])
  const [apenasFavoritas, setApenasFavoritas] = useState(false)
  const [apenasPersonalizadas, setApenasPersonalizadas] = useState(false)
  const [statusRevisao, setStatusRevisao] = useState<BancoQuestoesRespondidaStatus | null>(null)
  const [paginaRevisao, setPaginaRevisao] = useState(1)

  const [filtros, setFiltros] = useState<GetBancoQuestoesFiltrosResponse | null>(null)
  const [listas, setListas] = useState<GetBancoQuestoesListasResponse | null>(null)
  const [respondidas, setRespondidas] = useState<GetBancoQuestoesRespondidasResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [gerandoComIA, setGerandoComIA] = useState(false)
  const [modalGerarIAAberto, setModalGerarIAAberto] = useState(false)
  const [listaEmAcao, setListaEmAcao] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)
  const [listaParaExcluir, setListaParaExcluir] = useState<string | null>(null)
  const [excluindoLista, setExcluindoLista] = useState(false)

  useEffect(() => {
    getBancoQuestoesFiltros()
      .then(setFiltros)
      .catch((err) => console.error(err))
  }, [])

  async function carregarListas() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getBancoQuestoesListas({
        vestibulares,
        dificuldades,
        materias,
        apenas_favoritas: apenasFavoritas,
        apenas_personalizadas: apenasPersonalizadas,
      })
      setListas(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  async function carregarRespondidas(status: BancoQuestoesRespondidaStatus, pagina: number) {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getBancoQuestoesRespondidas({
        status,
        vestibulares,
        dificuldades,
        materias,
        assuntos,
        apenas_favoritas: apenasFavoritas,
        pagina,
        limite: LIMITE_POR_PAGINA,
      })
      setRespondidas(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (statusRevisao) carregarRespondidas(statusRevisao, paginaRevisao)
    else carregarListas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vestibulares, dificuldades, materias, assuntos, apenasFavoritas, apenasPersonalizadas, statusRevisao, paginaRevisao])

  useEffect(() => {
    setPaginaRevisao(1)
  }, [vestibulares, dificuldades, materias, assuntos, apenasFavoritas, apenasPersonalizadas, statusRevisao])

  function aguardar(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function handleGerarListaComIA(params: PostGerarListaComIAParams) {
    setGerandoComIA(true)
    try {
      const job = await postGerarListaComIA(params)
      const inicio = Date.now()

      while (Date.now() - inicio < TIMEOUT_POLL_GERACAO_MS) {
        const status = await getGeracaoListaIA(job.job_id)

        if (status.status === 'concluido') {
          setModalGerarIAAberto(false)
          await carregarListas()
          navigate(`/questoes/${status.slug ?? status.lista_id}`)
          return
        }

        if (status.status === 'erro') {
          setToast({ type: 'error', message: status.erro_mensagem ?? 'Não foi possível gerar a lista com IA.' })
          return
        }

        await aguardar(INTERVALO_POLL_GERACAO_MS)
      }

      setToast({ type: 'error', message: 'A geração da lista está demorando mais que o esperado. Tente novamente em instantes.' })
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Não foi possível gerar a lista com IA.' })
    } finally {
      setGerandoComIA(false)
    }
  }

  function handleAbrirLista(id: string, slug: string | null) {
    navigate(`/questoes/${slug ?? id}`)
  }

  async function handleRefazerLista(id: string, slug: string | null) {
    setListaEmAcao(id)
    try {
      const resultado = await postRefazerLista(id)
      navigate(`/questoes/${resultado.slug ?? slug ?? id}`)
    } catch (err) {
      console.error(err)
      setListaEmAcao(null)
    }
  }

  async function handleExcluirLista() {
    if (!listaParaExcluir) return
    setExcluindoLista(true)

    try {
      await deletarLista(listaParaExcluir)
      setListaParaExcluir(null)
      await carregarListas()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Não foi possível excluir a lista. Tente novamente.' })
    } finally {
      setExcluindoLista(false)
    }
  }

  function handleAbrirQuestaoRespondida(listaId: string, listaSlug: string | null, questaoId: string) {
    navigate(`/questoes/${listaSlug ?? listaId}?questao=${questaoId}`)
  }

  function handleRevisarExecucao(execucaoId: string) {
    navigate(`/questoes/execucoes/${execucaoId}/revisao`)
  }

  function toggleStatusRevisao(status: BancoQuestoesRespondidaStatus) {
    setStatusRevisao((atual) => (atual === status ? null : status))
  }

  const grupos: FilterGroup[] = [
    {
      label: 'Vestibular',
      options: filtros?.vestibulares ?? [],
      selected: vestibulares,
      onToggle: (value) => setVestibulares((current) => toggleValue(current, value)),
    },
    {
      label: 'Dificuldade',
      options: filtros?.dificuldades ?? [],
      selected: dificuldades,
      onToggle: (value) => setDificuldades((current) => toggleValue(current, value)),
    },
    {
      label: 'Matéria',
      options: filtros?.materias ?? [],
      selected: materias,
      onToggle: (value) => setMaterias((current) => toggleValue(current, value)),
      display: 'list',
    },
    {
      label: 'Assunto',
      options: filtros?.assuntos ?? [],
      selected: assuntos,
      onToggle: (value) => setAssuntos((current) => toggleValue(current, value)),
      display: 'list',
    },
  ]

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <TitlePage title="Banco de Questões" subtitle="+12.000 questões do ENEM e vestibulares" />

        <Button
          pill
          fullWidth={false}
          icon={<SparklesIcon />}
          iconPosition="left"
          onClick={() => setModalGerarIAAberto(true)}
          disabled={gerandoComIA}
        >
          Gerar lista com IA
        </Button>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {modalGerarIAAberto && (
        <GerarListaIAModal
          materias={filtros?.materias ?? []}
          assuntos={filtros?.assuntos ?? []}
          dificuldades={filtros?.dificuldades ?? []}
          vestibulares={filtros?.vestibulares ?? []}
          enviando={gerandoComIA}
          onConfirm={handleGerarListaComIA}
          onClose={() => setModalGerarIAAberto(false)}
        />
      )}

      {listaParaExcluir && (
        <ConfirmDialog
          title="Excluir lista"
          description="Tem certeza que deseja excluir esta lista personalizada? Essa ação não pode ser desfeita."
          confirmLabel="Excluir"
          confirmando={excluindoLista}
          onConfirm={handleExcluirLista}
          onClose={() => setListaParaExcluir(null)}
        />
      )}

      <div className={styles.contentRow}>
        <div className={styles.sideColumn}>
          <FiltersCard
            title="Filtros"
            groups={grupos}
            shortcuts={[
              { label: 'Questões corretas', active: statusRevisao === 'corretas', onClick: () => toggleStatusRevisao('corretas') },
              { label: 'Questões erradas', active: statusRevisao === 'erradas', onClick: () => toggleStatusRevisao('erradas') },
              { label: 'Questões favoritas', active: apenasFavoritas, onClick: () => setApenasFavoritas((value) => !value) },
              { label: 'Listas personalizadas', active: apenasPersonalizadas, onClick: () => setApenasPersonalizadas((value) => !value) },
            ]}
          />
        </div>

        <div className={styles.mainColumn}>
          {carregando ? (
            <CardDiv>
              <p>{statusRevisao ? 'Carregando questões...' : 'Carregando listas de questões...'}</p>
            </CardDiv>
          ) : erro ? (
            <CardDiv>
              <p>Não foi possível carregar {statusRevisao ? 'as questões' : 'as listas de questões'}.</p>
              <Button
                fullWidth={false}
                onClick={() => (statusRevisao ? carregarRespondidas(statusRevisao, paginaRevisao) : carregarListas())}
              >
                Tentar novamente
              </Button>
            </CardDiv>
          ) : statusRevisao ? (
            !respondidas ? null : (
              <>
                <div className={styles.listsHeader}>
                  <span className={styles.listsCount}>
                    {respondidas.paginacao.total} {statusRevisao === 'corretas' ? 'questões corretas' : 'questões erradas'}
                  </span>
                </div>

                <div className={styles.lists}>
                  {respondidas.questoes.length === 0 ? (
                    <CardDiv>
                      <p>Nenhuma questão encontrada para esses filtros.</p>
                    </CardDiv>
                  ) : (
                    respondidas.questoes.map((questao) => (
                      <AnsweredQuestionListItem
                        key={questao.id}
                        subject={questao.subject}
                        subjectColor={questao.subjectColor}
                        assunto={questao.assunto}
                        question={questao.question}
                        exam={questao.vestibular}
                        difficulty={questao.dificuldade}
                        difficultyColor={questao.dificuldade_cor}
                        listaTitulo={questao.lista_titulo}
                        correta={questao.correta}
                        respostaAluno={questao.resposta_aluno}
                        respostaCorreta={questao.resposta_correta}
                        respondidaEm={questao.respondida_em}
                        onClick={() => handleAbrirQuestaoRespondida(questao.lista_id, questao.lista_slug, questao.id)}
                      />
                    ))
                  )}
                </div>

                {respondidas.paginacao.total_paginas > 1 && (
                  <div className={styles.paginationRow}>
                    <Pagination page={paginaRevisao} totalPages={respondidas.paginacao.total_paginas} onChange={setPaginaRevisao} />
                  </div>
                )}
              </>
            )
          ) : !listas ? null : (
            <>
              <div className={styles.listsHeader}>
                <span className={styles.listsCount}>{listas.total} listas disponíveis</span>
              </div>

              <div className={styles.lists}>
                {listas.listas.length === 0 ? (
                  <CardDiv>
                    <p>Nenhum plano iniciado ainda.</p>
                  </CardDiv>
                ) : (
                  listas.listas.map((lista) => (
                    <QuestionListItem
                      key={lista.id}
                      icon={lista.icone}
                      iconColor={lista.icone_cor}
                      title={lista.titulo}
                      description={lista.descricao}
                      difficulty={lista.dificuldade}
                      difficultyColor={lista.dificuldade_cor}
                      exam={lista.vestibular}
                      status={lista.status}
                      completed={lista.questoes_concluidas}
                      total={lista.questoes_totais}
                      accuracyPercent={
                        lista.questoes_corretas !== undefined && lista.questoes_concluidas > 0
                          ? (lista.questoes_corretas / lista.questoes_concluidas) * 100
                          : undefined
                      }
                      progressColor={lista.progresso_cor}
                      personalizada={lista.personalizada}
                      refazerLoading={listaEmAcao === lista.id}
                      excluirLoading={excluindoLista && listaParaExcluir === lista.id}
                      onIniciar={() => handleAbrirLista(lista.id, lista.slug)}
                      onRefazer={() => handleRefazerLista(lista.id, lista.slug)}
                      onRevisar={lista.ultima_execucao_id ? () => handleRevisarExecucao(lista.ultima_execucao_id!) : undefined}
                      onExcluir={() => setListaParaExcluir(lista.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
