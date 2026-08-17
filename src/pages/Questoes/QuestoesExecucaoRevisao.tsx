import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { FiltersCard } from '../../components/cards/FiltersCard'
import type { FilterGroup } from '../../components/cards/FiltersCard'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { QuestionReviewCard } from '../../components/cards/QuestionReviewCard'
import { Pagination } from '../../components/ui/Pagination'
import { ArrowLeftIcon } from '../../components/ui/icons'
import styles from './QuestoesExecucaoRevisao.module.css'

import { getBancoQuestoesFiltros, getExecucaoRevisao } from '../../services/bancoQuestoes'
import type { GetBancoQuestoesFiltrosResponse, GetExecucaoRevisaoResponse, BancoQuestoesRevisaoStatusFiltro } from '../../types/bancoQuestoes'

const LIMITE_POR_PAGINA = 20

const STATUS_OPTIONS: { value: BancoQuestoesRevisaoStatusFiltro; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'acertada', label: 'Acertadas' },
  { value: 'errada', label: 'Erradas' },
]

export function QuestoesExecucaoRevisao() {
  const { execucaoId } = useParams<{ execucaoId: string }>()

  const [status, setStatus] = useState<BancoQuestoesRevisaoStatusFiltro>('todas')
  const [materia, setMateria] = useState<string | null>(null)
  const [assunto, setAssunto] = useState<string | null>(null)
  const [dificuldade, setDificuldade] = useState<string | null>(null)
  const [pagina, setPagina] = useState(1)

  const [filtros, setFiltros] = useState<GetBancoQuestoesFiltrosResponse | null>(null)
  const [dados, setDados] = useState<GetExecucaoRevisaoResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    getBancoQuestoesFiltros()
      .then(setFiltros)
      .catch((err) => console.error(err))
  }, [])

  async function carregarRevisao() {
    if (!execucaoId) return
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getExecucaoRevisao(execucaoId, {
        status: status === 'todas' ? undefined : status,
        materia: materia ?? undefined,
        assunto: assunto ?? undefined,
        dificuldade: dificuldade ?? undefined,
        pagina,
        limite: LIMITE_POR_PAGINA,
      })
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarRevisao()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execucaoId, status, materia, assunto, dificuldade, pagina])

  useEffect(() => {
    setPagina(1)
  }, [status, materia, assunto, dificuldade])

  function toggleSingle(atual: string | null, value: string, setter: (value: string | null) => void) {
    setter(atual === value ? null : value)
  }

  const grupos: FilterGroup[] = [
    {
      label: 'Matéria',
      options: filtros?.materias ?? [],
      selected: materia ? [materia] : [],
      onToggle: (value) => toggleSingle(materia, value, setMateria),
      display: 'list',
    },
    {
      label: 'Assunto',
      options: filtros?.assuntos ?? [],
      selected: assunto ? [assunto] : [],
      onToggle: (value) => toggleSingle(assunto, value, setAssunto),
      display: 'list',
    },
    {
      label: 'Dificuldade',
      options: filtros?.dificuldades ?? [],
      selected: dificuldade ? [dificuldade] : [],
      onToggle: (value) => toggleSingle(dificuldade, value, setDificuldade),
    },
  ]

  return (
    <main className={styles.page}>
      <Link to="/questoes" className={styles.backLink}>
        <ArrowLeftIcon className={styles.backIcon} />
        Banco de Questões
      </Link>

      <div className={styles.header}>
        <TitlePage
          title={dados ? `Revisão — ${dados.execucao.lista_titulo}` : 'Revisão'}
          subtitle={
            dados
              ? `${dados.execucao.respondidas}/${dados.execucao.questoes_totais} questões respondidas${
                  dados.execucao.percentual_acerto !== undefined ? ` · ${Math.round(dados.execucao.percentual_acerto)}% de acerto` : ''
                }`
              : 'Veja suas respostas e confira os erros.'
          }
        />
      </div>

      <SegmentedControl options={STATUS_OPTIONS} value={status} onChange={(value) => setStatus(value as BancoQuestoesRevisaoStatusFiltro)} />

      <div className={styles.contentRow}>
        <div className={styles.sideColumn}>
          <FiltersCard title="Filtros" groups={grupos} />
        </div>

        <div className={styles.mainColumn}>
          {carregando ? (
            <CardDiv>
              <p>Carregando revisão...</p>
            </CardDiv>
          ) : erro || !dados ? (
            <CardDiv>
              <p>Não foi possível carregar a revisão.</p>
              <Button fullWidth={false} onClick={carregarRevisao}>
                Tentar novamente
              </Button>
            </CardDiv>
          ) : dados.questoes.length === 0 ? (
            <CardDiv>
              <p>Nenhuma questão encontrada para esses filtros.</p>
            </CardDiv>
          ) : (
            <>
              <div className={styles.questions}>
                {dados.questoes.map((questao, index) => (
                  <QuestionReviewCard
                    key={questao.id}
                    numero={(pagina - 1) * LIMITE_POR_PAGINA + index + 1}
                    enunciado={questao.enunciado}
                    materia={questao.materia}
                    materiaColor={questao.materia_cor}
                    assunto={questao.assunto}
                    dificuldade={questao.dificuldade}
                    dificuldadeColor={questao.dificuldade_cor}
                    alternativas={questao.alternativas}
                    respostaAluno={questao.resposta_aluno}
                    respostaCorreta={questao.resposta_correta}
                    acertou={questao.acertou}
                  />
                ))}
              </div>

              {dados.paginacao.total_paginas > 1 && (
                <div className={styles.paginationRow}>
                  <Pagination page={pagina} totalPages={dados.paginacao.total_paginas} onChange={setPagina} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
