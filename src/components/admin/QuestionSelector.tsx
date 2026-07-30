import { CheckIcon, PlusIcon, SearchIcon } from '../ui/icons'
import type { QuestaoResumo } from '../../types/questoes'
import styles from './QuestionSelector.module.css'

type QuestionSelectorProps = {
  questoes: QuestaoResumo[]
  selecionadasIds: string[]
  busca: string
  onBuscaChange: (value: string) => void
  onAdicionar: (questao: QuestaoResumo) => void
}

export function QuestionSelector({ questoes, selecionadasIds, busca, onBuscaChange, onAdicionar }: QuestionSelectorProps) {
  return (
    <>
      <div className={styles.searchRow}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Buscar no banco de questões..."
          aria-label="Buscar questão"
          value={busca}
          onChange={(event) => onBuscaChange(event.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.list}>
        {questoes.length ? (
          questoes.map((questao) => {
            const adicionada = selecionadasIds.includes(questao.id)
            return (
              <div key={questao.id} className={`${styles.item}${adicionada ? ` ${styles.itemAdded}` : ''}`}>
                <div className={styles.body}>
                  <p className={styles.enunciado}>{questao.enunciado}</p>
                </div>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() => onAdicionar(questao)}
                  disabled={adicionada}
                  aria-label={adicionada ? 'Já adicionada' : 'Adicionar questão'}
                >
                  {adicionada ? <CheckIcon /> : <PlusIcon />}
                </button>
              </div>
            )
          })
        ) : (
          <div className={styles.empty}>Nenhuma questão encontrada.</div>
        )}
      </div>
    </>
  )
}
