import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { AulaCard } from '../../components/cards/AulaCard'
import styles from './Aulas.module.css'

import { getBibliotecaAulas } from '../../services/bibliotecaAulas'
import type { GetBibliotecaAulasResponse } from '../../types/bibliotecaAulas'

export function Aulas() {
  const navigate = useNavigate()
  const [categoriaId, setCategoriaId] = useState<string | undefined>(undefined)
  const [dados, setDados] = useState<GetBibliotecaAulasResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregarAulas() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getBibliotecaAulas({ categoria_id: categoriaId })
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarAulas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaId])

  function handleAcessarAula(aula: GetBibliotecaAulasResponse['aulas'][number]) {
    navigate(`/aulas/${aula.slug ?? aula.id}`)
  }

  return (
    <main className={styles.page}>
      <TitlePage title="Biblioteca de Aulas" subtitle={dados?.subtitulo ?? ''} />

      {carregando ? (
        <CardDiv>
          <p className={styles.emptyState}>Carregando aulas...</p>
        </CardDiv>
      ) : erro || !dados ? (
        <CardDiv>
          <p className={styles.emptyState}>Não foi possível carregar as aulas.</p>
          <div className={styles.retryRow}>
            <Button fullWidth={false} onClick={carregarAulas}>
              Tentar novamente
            </Button>
          </div>
        </CardDiv>
      ) : (
        <>
          <div className={styles.filters}>
            <Button
              variant={categoriaId === undefined ? 'primary' : 'outline'}
              pill
              fullWidth={false}
              onClick={() => setCategoriaId(undefined)}
            >
              Todas
            </Button>
            {dados.categorias.map((categoria) => (
              <Button
                key={categoria.id}
                variant={categoria.id === categoriaId ? 'primary' : 'outline'}
                pill
                fullWidth={false}
                onClick={() => setCategoriaId(categoria.id)}
              >
                {categoria.nome}
              </Button>
            ))}
          </div>

          {dados.aulas.length === 0 ? (
            <CardDiv>
              <p className={styles.emptyState}>Nenhuma aula encontrada para esta categoria.</p>
            </CardDiv>
          ) : (
            <div className={styles.grid}>
              {dados.aulas.map((aula) => (
                <AulaCard
                  key={aula.id}
                  icon={aula.icone}
                  iconColor={aula.icone_cor}
                  title={aula.titulo}
                  subject={aula.materia}
                  subjectColor={aula.materia_cor}
                  duration={`${aula.duracao_min} min`}
                  difficulty={aula.dificuldade}
                  progress={aula.progresso}
                  status={aula.status === 'concluida' ? 'concluida' : 'em-andamento'}
                  featured={aula.destaque}
                  onAction={() => handleAcessarAula(aula)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
