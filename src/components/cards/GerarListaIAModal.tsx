import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { FilterChip } from '../ui/FilterChip'
import type { BancoQuestoesFiltroOpcao } from '../../types/bancoQuestoes'
import type { PostGerarListaComIAParams } from '../../types/bancoQuestoes'
import styles from './SuspensionModal.module.css'

const QUANTIDADE_QUESTOES = 5
const MAX_ITENS_POR_FILTRO = 3
const MAX_CARACTERES_INSTRUCAO = 300

type GerarListaIAModalProps = {
  materias: BancoQuestoesFiltroOpcao[]
  assuntos: BancoQuestoesFiltroOpcao[]
  dificuldades: BancoQuestoesFiltroOpcao[]
  vestibulares: BancoQuestoesFiltroOpcao[]
  enviando?: boolean
  erro?: string | null
  onConfirm: (params: PostGerarListaComIAParams) => void
  onClose: () => void
}

function toggleValue(list: string[], value: string, max: number) {
  if (list.includes(value)) return list.filter((item) => item !== value)
  if (list.length >= max) return list
  return [...list, value]
}

export function GerarListaIAModal({
  materias,
  assuntos,
  dificuldades,
  vestibulares,
  enviando,
  erro,
  onConfirm,
  onClose,
}: GerarListaIAModalProps) {
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([])
  const [assuntosSelecionados, setAssuntosSelecionados] = useState<string[]>([])
  const [dificuldadesSelecionadas, setDificuldadesSelecionadas] = useState<string[]>([])
  const [vestibularesSelecionados, setVestibularesSelecionados] = useState<string[]>([])
  const [instrucao, setInstrucao] = useState('')

  return (
    <Modal title="Gerar lista com IA" onClose={onClose}>
      {erro && (
        <div className={styles.errorBanner} role="alert">
          {erro}
        </div>
      )}

      <div className={styles.field}>
        <span className={styles.label}>Quantidade de questões</span>
        <p className={styles.helperText}>A IA gera {QUANTIDADE_QUESTOES} questões por lista.</p>
      </div>

      {materias.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>
            Matéria (opcional) — {materiasSelecionadas.length}/{MAX_ITENS_POR_FILTRO}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {materias.map((opcao) => {
              const selecionada = materiasSelecionadas.includes(opcao.value)
              return (
                <FilterChip
                  key={opcao.value}
                  label={opcao.label}
                  selected={selecionada}
                  disabled={!selecionada && materiasSelecionadas.length >= MAX_ITENS_POR_FILTRO}
                  onClick={() =>
                    setMateriasSelecionadas((current) => toggleValue(current, opcao.value, MAX_ITENS_POR_FILTRO))
                  }
                />
              )
            })}
          </div>
        </div>
      )}

      {assuntos.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>
            Assunto (opcional) — {assuntosSelecionados.length}/{MAX_ITENS_POR_FILTRO}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {assuntos.map((opcao) => {
              const selecionada = assuntosSelecionados.includes(opcao.value)
              return (
                <FilterChip
                  key={opcao.value}
                  label={opcao.label}
                  selected={selecionada}
                  disabled={!selecionada && assuntosSelecionados.length >= MAX_ITENS_POR_FILTRO}
                  onClick={() =>
                    setAssuntosSelecionados((current) => toggleValue(current, opcao.value, MAX_ITENS_POR_FILTRO))
                  }
                />
              )
            })}
          </div>
        </div>
      )}

      {dificuldades.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>
            Dificuldade (opcional) — {dificuldadesSelecionadas.length}/{MAX_ITENS_POR_FILTRO}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {dificuldades.map((opcao) => {
              const selecionada = dificuldadesSelecionadas.includes(opcao.value)
              return (
                <FilterChip
                  key={opcao.value}
                  label={opcao.label}
                  selected={selecionada}
                  disabled={!selecionada && dificuldadesSelecionadas.length >= MAX_ITENS_POR_FILTRO}
                  onClick={() =>
                    setDificuldadesSelecionadas((current) => toggleValue(current, opcao.value, MAX_ITENS_POR_FILTRO))
                  }
                />
              )
            })}
          </div>
        </div>
      )}

      {vestibulares.length > 0 && (
        <div className={styles.field}>
          <span className={styles.label}>
            Vestibular (opcional) — {vestibularesSelecionados.length}/{MAX_ITENS_POR_FILTRO}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {vestibulares.map((opcao) => {
              const selecionada = vestibularesSelecionados.includes(opcao.value)
              return (
                <FilterChip
                  key={opcao.value}
                  label={opcao.label}
                  selected={selecionada}
                  disabled={!selecionada && vestibularesSelecionados.length >= MAX_ITENS_POR_FILTRO}
                  onClick={() =>
                    setVestibularesSelecionados((current) => toggleValue(current, opcao.value, MAX_ITENS_POR_FILTRO))
                  }
                />
              )
            })}
          </div>
        </div>
      )}

      <div className={styles.field}>
        <span className={styles.label}>Instruções para a IA (opcional)</span>
        <textarea
          className={styles.textarea}
          placeholder="Ex: foque em questões de interpretação de texto, no estilo ENEM..."
          value={instrucao}
          maxLength={MAX_CARACTERES_INSTRUCAO}
          onChange={(event) => setInstrucao(event.target.value)}
        />
        <span className={styles.charCount}>
          {instrucao.length}/{MAX_CARACTERES_INSTRUCAO}
        </span>
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
              quantidade: QUANTIDADE_QUESTOES,
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
