import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { SliderField } from '../ui/SliderField'
import { FilterChip } from '../ui/FilterChip'
import type { BancoQuestoesFiltroOpcao } from '../../types/bancoQuestoes'
import type { PostGerarListaComIAParams } from '../../types/bancoQuestoes'
import styles from './SuspensionModal.module.css'

const QUANTIDADE_STEPS = [
  { value: 5, label: '5 questões' },
  { value: 10, label: '10 questões' },
  { value: 15, label: '15 questões' },
  { value: 20, label: '20 questões' },
]

type GerarListaIAModalProps = {
  materias: BancoQuestoesFiltroOpcao[]
  assuntos: BancoQuestoesFiltroOpcao[]
  dificuldades: BancoQuestoesFiltroOpcao[]
  vestibulares: BancoQuestoesFiltroOpcao[]
  enviando?: boolean
  onConfirm: (params: PostGerarListaComIAParams) => void
  onClose: () => void
}

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function GerarListaIAModal({
  materias,
  assuntos,
  dificuldades,
  vestibulares,
  enviando,
  onConfirm,
  onClose,
}: GerarListaIAModalProps) {
  const [quantidade, setQuantidade] = useState(10)
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([])
  const [assuntosSelecionados, setAssuntosSelecionados] = useState<string[]>([])
  const [dificuldadesSelecionadas, setDificuldadesSelecionadas] = useState<string[]>([])
  const [vestibularesSelecionados, setVestibularesSelecionados] = useState<string[]>([])
  const [instrucao, setInstrucao] = useState('')

  return (
    <Modal title="Gerar lista com IA" onClose={onClose}>
      <div className={styles.field}>
        <span className={styles.label}>Quantidade de questões</span>
        <SliderField
          steps={QUANTIDADE_STEPS}
          value={quantidade}
          onChange={setQuantidade}
          valueLabel={`${quantidade} questões`}
        />
      </div>

      {materias.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>Matéria (opcional)</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {materias.map((opcao) => (
              <FilterChip
                key={opcao.value}
                label={opcao.label}
                selected={materiasSelecionadas.includes(opcao.value)}
                onClick={() => setMateriasSelecionadas((current) => toggleValue(current, opcao.value))}
              />
            ))}
          </div>
        </div>
      )}

      {assuntos.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>Assunto (opcional)</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {assuntos.map((opcao) => (
              <FilterChip
                key={opcao.value}
                label={opcao.label}
                selected={assuntosSelecionados.includes(opcao.value)}
                onClick={() => setAssuntosSelecionados((current) => toggleValue(current, opcao.value))}
              />
            ))}
          </div>
        </div>
      )}

      {dificuldades.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>Dificuldade (opcional)</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {dificuldades.map((opcao) => (
              <FilterChip
                key={opcao.value}
                label={opcao.label}
                selected={dificuldadesSelecionadas.includes(opcao.value)}
                onClick={() => setDificuldadesSelecionadas((current) => toggleValue(current, opcao.value))}
              />
            ))}
          </div>
        </div>
      )}

      {vestibulares.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>Vestibular (opcional)</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {vestibulares.map((opcao) => (
              <FilterChip
                key={opcao.value}
                label={opcao.label}
                selected={vestibularesSelecionados.includes(opcao.value)}
                onClick={() => setVestibularesSelecionados((current) => toggleValue(current, opcao.value))}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.field}>
        <span className={styles.label}>Instruções para a IA (opcional)</span>
        <textarea
          className={styles.textarea}
          placeholder="Ex: foque em questões de interpretação de texto, no estilo ENEM..."
          value={instrucao}
          onChange={(event) => setInstrucao(event.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" fullWidth={false} onClick={onClose} disabled={enviando}>
          Cancelar
        </Button>
        <Button
          type="button"
          fullWidth={false}
          disabled={enviando}
          onClick={() =>
            onConfirm({
              quantidade,
              materias: materiasSelecionadas.length > 0 ? materiasSelecionadas : undefined,
              assuntos: assuntosSelecionados.length > 0 ? assuntosSelecionados : undefined,
              dificuldades: dificuldadesSelecionadas.length > 0 ? dificuldadesSelecionadas : undefined,
              vestibulares: vestibularesSelecionados.length > 0 ? vestibularesSelecionados : undefined,
              instrucao: instrucao.trim() || undefined,
            })
          }
        >
          {enviando ? 'Gerando...' : 'Gerar lista'}
        </Button>
      </div>
    </Modal>
  )
}
