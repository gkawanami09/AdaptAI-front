import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { FilterChip } from '../../components/ui/FilterChip'
import { SelectableCard } from '../../components/ui/SelectableCard'
import { SliderField } from '../../components/ui/SliderField'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { CardIcon } from '../../components/cards/CardIcon'
import { Badge } from '../../components/ui/Badge'
import { Loading } from '../../components/ui/Loading'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  TargetIcon,
} from '../../components/ui/icons'
import styles from './PlanoEstudosCriar.module.css'

import { getOpcoesPlanoEstudos, postCriarPlanoEstudos } from '../../services/planoEstudos'
import { PROVAS_FALLBACK, MATERIAS_FALLBACK } from './planoEstudosCriarFallback'
import type { DiaSemana, GetPlanoEstudosOpcoesResponse } from '../../types/planoEstudosCriar'

type DiaSemanaOpcao = { value: DiaSemana; label: string }

const DIAS_SEMANA: DiaSemanaOpcao[] = [
  { value: 'monday', label: 'Seg' },
  { value: 'tuesday', label: 'Ter' },
  { value: 'wednesday', label: 'Qua' },
  { value: 'thursday', label: 'Qui' },
  { value: 'friday', label: 'Sex' },
  { value: 'saturday', label: 'Sáb' },
  { value: 'sunday', label: 'Dom' },
]

const TEMPO_OPCOES = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1h' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2h' },
  { value: 180, label: '3h' },
  { value: 240, label: '4h+' },
]

function formatarTempo(minutos: number) {
  const opcao = TEMPO_OPCOES.find((item) => item.value === minutos)
  if (opcao) return opcao.label
  return minutos < 60 ? `${minutos} min` : `${Math.floor(minutos / 60)}h${minutos % 60 || ''}`
}

const PROGRESSO_ETAPAS = [
  { numero: 1, titulo: 'Prova', subtitulo: 'Escolha a prova que quer focar' },
  { numero: 2, titulo: 'Matérias', subtitulo: 'Selecione o que precisa focar' },
  { numero: 3, titulo: 'Rotina', subtitulo: 'Defina seu tempo e frequência' },
  { numero: 4, titulo: 'Revisão', subtitulo: 'Revise e gere seu plano' },
]

type Etapa = 'formulario' | 'revisao'

export function PlanoEstudosCriar() {
  const navigate = useNavigate()

  const [opcoes, setOpcoes] = useState<GetPlanoEstudosOpcoesResponse>({ provas: PROVAS_FALLBACK, materias: MATERIAS_FALLBACK })
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true)

  const [selectedProvas, setSelectedProvas] = useState<string[]>([])
  const [selectedMaterias, setSelectedMaterias] = useState<string[]>([])
  const [tempoPorDiaMinutos, setTempoPorDiaMinutos] = useState(120)
  const [diasEstudo, setDiasEstudo] = useState<DiaSemana[]>([])

  const [etapa, setEtapa] = useState<Etapa>('formulario')
  const [validacoes, setValidacoes] = useState<{ provas?: string; materias?: string; dias?: string }>({})

  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    let ativo = true

    getOpcoesPlanoEstudos()
      .then((resposta) => {
        if (ativo) setOpcoes(resposta)
      })
      .catch(() => {
        // falha ao carregar /aluno/plano-estudos/opcoes — mantém o fallback local
      })
      .finally(() => {
        if (ativo) setCarregandoOpcoes(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  function toggleProva(slug: string) {
    setSelectedProvas((atual) => (atual.includes(slug) ? atual.filter((item) => item !== slug) : [...atual, slug]))
  }

  function toggleMateria(slug: string) {
    setSelectedMaterias((atual) => (atual.includes(slug) ? atual.filter((item) => item !== slug) : [...atual, slug]))
  }

  function toggleDia(dia: DiaSemana) {
    setDiasEstudo((atual) => (atual.includes(dia) ? atual.filter((item) => item !== dia) : [...atual, dia]))
  }

  function handleContinuar() {
    const novasValidacoes: typeof validacoes = {}
    if (selectedProvas.length === 0) novasValidacoes.provas = 'Selecione ao menos uma prova.'
    if (selectedMaterias.length === 0) novasValidacoes.materias = 'Selecione ao menos uma matéria.'
    if (diasEstudo.length === 0) novasValidacoes.dias = 'Selecione ao menos um dia da semana.'

    setValidacoes(novasValidacoes)
    if (Object.keys(novasValidacoes).length > 0) return

    setEtapa('revisao')
  }

  async function handleGerarPlano() {
    setEnviando(true)
    setErroEnvio(null)

    try {
      await postCriarPlanoEstudos({
        provas: selectedProvas,
        materias: selectedMaterias,
        tempo_por_dia_minutos: tempoPorDiaMinutos,
        dias_estudo: diasEstudo,
      })
      setSucesso(true)
    } catch (err) {
      setErroEnvio(err instanceof Error ? err.message : 'Não foi possível gerar o plano. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  const nomeProva = (slug: string) => opcoes.provas.find((item) => item.slug === slug)?.nome ?? slug
  const nomeMateria = (slug: string) => opcoes.materias.find((item) => item.slug === slug)?.nome ?? slug
  const labelDia = (dia: DiaSemana) => DIAS_SEMANA.find((item) => item.value === dia)?.label ?? dia

  const etapaAtivaNumero = etapa === 'revisao' ? 4 : 1

  if (sucesso) {
    return (
      <div className={styles.container}>
        <CardDiv>
          <div className={styles.successState}>
            <span className={styles.successIcon}>
              <CheckCircleIcon />
            </span>
            <CardHeading>Seu plano está sendo gerado!</CardHeading>
            <p className={styles.successText}>
              Assim que a IA terminar de montar seu cronograma, ele vai aparecer na página de Plano de Estudos.
            </p>
            <div className={styles.successActions}>
              <Button fullWidth={false} onClick={() => navigate('/plano-de-estudos')}>
                Ir para o Plano de Estudos
              </Button>
            </div>
          </div>
        </CardDiv>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Link to="/plano-de-estudos" className={styles.backLink}>
        <ArrowLeftIcon className={styles.backIcon} />
        Voltar
      </Link>

      <div className={styles.header}>
        <TitlePage title="Criar plano de estudos" subtitle="Personalize seu plano conforme seus objetivos e disponibilidade." />

        <div className={styles.infoCard}>
          <CardIcon color="purple">
            <CalendarIcon />
          </CardIcon>
          <p>Seu plano será gerado com base nas suas escolhas e poderá ser ajustado sempre que precisar.</p>
        </div>
      </div>

      <div className={styles.progress}>
        {PROGRESSO_ETAPAS.map((item, index) => (
          <div key={item.numero} className={styles.progressItem}>
            <div className={styles.progressStep}>
              <span className={`${styles.progressNumber}${item.numero === etapaAtivaNumero ? ` ${styles.progressNumberActive}` : ''}`}>
                {item.numero}
              </span>
              <span className={styles.progressText}>
                <strong>{item.titulo}</strong>
                <small>{item.subtitulo}</small>
              </span>
            </div>
            {index < PROGRESSO_ETAPAS.length - 1 && <span className={styles.progressLine} />}
          </div>
        ))}
      </div>

      {etapa === 'formulario' ? (
        <>
          <CardDiv>
            <CardHeading>1. Qual prova você quer focar?</CardHeading>
            <p className={styles.stepDescription}>Você pode escolher mais de uma prova.</p>

            <div className={styles.optionsGrid}>
              {opcoes.provas.map((prova) => (
                <SelectableCard
                  key={prova.slug}
                  title={prova.nome}
                  description={prova.descricao}
                  icon={<TargetIcon />}
                  selected={selectedProvas.includes(prova.slug)}
                  onClick={() => toggleProva(prova.slug)}
                />
              ))}
            </div>
            {validacoes.provas && <p className={styles.validationMessage}>{validacoes.provas}</p>}
          </CardDiv>

          <CardDiv>
            <CardHeading>2. Quais matérias você precisa focar?</CardHeading>
            <p className={styles.stepDescription}>Selecione as matérias que deseja priorizar no seu plano.</p>

            <div className={`${styles.optionsGrid} ${styles.optionsGridCompact}`}>
              {opcoes.materias.map((materia) => (
                <SelectableCard
                  key={materia.slug}
                  title={materia.nome}
                  icon={<BookIcon />}
                  selected={selectedMaterias.includes(materia.slug)}
                  onClick={() => toggleMateria(materia.slug)}
                />
              ))}
            </div>
            {validacoes.materias && <p className={styles.validationMessage}>{validacoes.materias}</p>}
          </CardDiv>

          <div className={styles.splitRow}>
            <CardDiv>
              <CardHeading>3. Quanto tempo por dia você pode estudar?</CardHeading>
              <p className={styles.stepDescription}>Defina a quantidade média de tempo disponível por dia.</p>

              <SliderField
                steps={TEMPO_OPCOES}
                value={tempoPorDiaMinutos}
                onChange={setTempoPorDiaMinutos}
                valueLabel={formatarTempo(tempoPorDiaMinutos)}
              />

              <div className={styles.tipBanner}>
                <ClockIcon />
                <p>
                  <strong>Dica:</strong> consistência é mais importante que quantidade. Estude um pouco todos os dias.
                </p>
              </div>
            </CardDiv>

            <CardDiv>
              <CardHeading>4. Em quais dias da semana você vai estudar?</CardHeading>
              <p className={styles.stepDescription}>Escolha os dias da semana que você pretende manter sua rotina.</p>

              <div className={styles.diasGrid}>
                {DIAS_SEMANA.map((dia) => (
                  <FilterChip
                    key={dia.value}
                    label={dia.label}
                    size="md"
                    selected={diasEstudo.includes(dia.value)}
                    onClick={() => toggleDia(dia.value)}
                  />
                ))}
              </div>
              {validacoes.dias && <p className={styles.validationMessage}>{validacoes.dias}</p>}

              <div className={styles.tipBanner}>
                <CalendarIcon />
                <p>Recomendamos pelo menos 4 dias por semana para melhores resultados.</p>
              </div>
            </CardDiv>
          </div>

          {carregandoOpcoes && <p className={styles.loadingHint}>Carregando opções atualizadas...</p>}

          <div className={styles.actions}>
            <Button variant="outline" fullWidth={false} onClick={() => navigate('/plano-de-estudos')}>
              Cancelar
            </Button>
            <Button fullWidth={false} icon={<ArrowRightIcon />} iconPosition="right" onClick={handleContinuar}>
              Continuar
            </Button>
          </div>
        </>
      ) : (
        <CardDiv>
          <CardHeading>Revise seu plano</CardHeading>
          <p className={styles.stepDescription}>Confira as informações antes de gerar seu plano de estudos.</p>

          <div className={styles.reviewSection}>
            <span className={styles.reviewLabel}>Provas selecionadas</span>
            <div className={styles.reviewBadges}>
              {selectedProvas.map((slug) => (
                <Badge key={slug}>{nomeProva(slug)}</Badge>
              ))}
            </div>
          </div>

          <div className={styles.reviewSection}>
            <span className={styles.reviewLabel}>Matérias selecionadas</span>
            <div className={styles.reviewBadges}>
              {selectedMaterias.map((slug) => (
                <Badge key={slug} color="teal">
                  {nomeMateria(slug)}
                </Badge>
              ))}
            </div>
          </div>

          <div className={styles.reviewSection}>
            <span className={styles.reviewLabel}>Tempo por dia</span>
            <p className={styles.reviewValue}>{formatarTempo(tempoPorDiaMinutos)}</p>
          </div>

          <div className={styles.reviewSection}>
            <span className={styles.reviewLabel}>Dias da semana</span>
            <div className={styles.reviewBadges}>
              {diasEstudo.map((dia) => (
                <Badge key={dia} color="gold">
                  {labelDia(dia)}
                </Badge>
              ))}
            </div>
          </div>

          {erroEnvio && <p className={styles.validationMessage}>{erroEnvio}</p>}

          {enviando ? (
            <Loading text="Gerando seu plano..." />
          ) : (
            <div className={styles.actions}>
              <Button variant="outline" fullWidth={false} onClick={() => setEtapa('formulario')}>
                Voltar e editar
              </Button>
              <Button fullWidth={false} icon={<SparklesIcon />} iconPosition="left" onClick={handleGerarPlano}>
                Gerar meu plano
              </Button>
            </div>
          )}
        </CardDiv>
      )}
    </div>
  )
}
