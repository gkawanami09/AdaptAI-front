import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { FiltersCard } from '../../components/cards/FiltersCard'
import type { FilterGroup } from '../../components/cards/FiltersCard'
import { QuestionListItem } from '../../components/cards/QuestionListItem'
import { PlayIcon, SparklesIcon } from '../../components/ui/icons'
import styles from './Questoes.module.css'

import { getBancoQuestoesFiltros, getBancoQuestoesListas, postGerarListaComIA } from '../../services/bancoQuestoes'
import type { GetBancoQuestoesFiltrosResponse, GetBancoQuestoesListasResponse } from '../../types/bancoQuestoes'

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function Questoes() {
  const navigate = useNavigate()
  const [vestibulares, setVestibulares] = useState<string[]>([])
  const [dificuldades, setDificuldades] = useState<string[]>([])
  const [materias, setMaterias] = useState<string[]>([])
  const [apenasErradas, setApenasErradas] = useState(false)
  const [apenasFavoritas, setApenasFavoritas] = useState(false)

  const [filtros, setFiltros] = useState<GetBancoQuestoesFiltrosResponse | null>(null)
  const [listas, setListas] = useState<GetBancoQuestoesListasResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)
  const [gerandoComIA, setGerandoComIA] = useState(false)

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
        apenas_erradas: apenasErradas,
        apenas_favoritas: apenasFavoritas,
      })
      setListas(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarListas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vestibulares, dificuldades, materias, apenasErradas, apenasFavoritas])

  async function handleGerarListaComIA() {
    setGerandoComIA(true)
    try {
      const resultado = await postGerarListaComIA()
      await carregarListas()
      navigate(`/questoes/${resultado.slug ?? resultado.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setGerandoComIA(false)
    }
  }

  function handleAbrirLista(id: string, slug: string | null) {
    navigate(`/questoes/${slug ?? id}`)
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
          onClick={handleGerarListaComIA}
          disabled={gerandoComIA}
        >
          Gerar lista com IA
        </Button>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.sideColumn}>
          <FiltersCard
            title="Filtros"
            groups={grupos}
            shortcuts={[
              { label: 'Questões erradas', onClick: () => setApenasErradas((value) => !value) },
              { label: 'Questões favoritas', onClick: () => setApenasFavoritas((value) => !value) },
            ]}
          />
        </div>

        <div className={styles.mainColumn}>
          {carregando ? (
            <CardDiv>
              <p>Carregando listas de questões...</p>
            </CardDiv>
          ) : erro || !listas ? (
            <CardDiv>
              <p>Não foi possível carregar as listas de questões.</p>
              <Button fullWidth={false} onClick={carregarListas}>
                Tentar novamente
              </Button>
            </CardDiv>
          ) : (
            <>
              <div className={styles.listsHeader}>
                <span className={styles.listsCount}>{listas.total} listas disponíveis</span>
                {listas.listas.length > 0 && (
                  <Button
                    variant="outline"
                    pill
                    fullWidth={false}
                    icon={<PlayIcon />}
                    iconPosition="left"
                    onClick={() => handleAbrirLista(listas.listas[0].id, listas.listas[0].slug)}
                  >
                    Começar lista
                  </Button>
                )}
              </div>

              <div className={styles.lists}>
                {listas.listas.length === 0 ? (
                  <CardDiv>
                    <p>Nenhuma lista encontrada para os filtros selecionados.</p>
                  </CardDiv>
                ) : (
                  listas.listas.map((lista) => (
                    <QuestionListItem
                      key={lista.id}
                      icon={lista.icone}
                      iconColor={lista.icone_cor}
                      title={lista.titulo}
                      difficulty={lista.dificuldade}
                      difficultyColor={lista.dificuldade_cor}
                      exam={lista.vestibular}
                      completed={lista.questoes_concluidas}
                      total={lista.questoes_totais}
                      progressColor={lista.progresso_cor}
                      onClick={() => handleAbrirLista(lista.id, lista.slug)}
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
