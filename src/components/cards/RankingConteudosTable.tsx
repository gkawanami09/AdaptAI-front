import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import type { RelatoriosRankingConteudo } from '../../types/relatorios'
import styles from './RankingConteudosTable.module.css'

type RankingConteudosTableProps = {
  itens: RelatoriosRankingConteudo[]
  paginaOffset: number
}

function getTaxaColor(taxa: number): BadgeColor {
  if (taxa >= 80) return 'teal'
  if (taxa >= 70) return 'gold'
  return 'red'
}

function formatarTempo(segundos: number) {
  const minutos = Math.floor(segundos / 60)
  const resto = segundos % 60
  return `${String(minutos).padStart(2, '0')}m ${String(resto).padStart(2, '0')}s`
}

export function RankingConteudosTable({ itens, paginaOffset }: RankingConteudosTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rankCol}></th>
            <th>Matéria</th>
            <th>Aula</th>
            <th>Questões</th>
            <th>Taxa de Acerto</th>
            <th>Tempo Médio</th>
            <th>Acessos</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item, index) => (
            <tr key={`${item.materia_id}-${item.aula_id}`}>
              <td>
                <span className={styles.rankBadge}>{paginaOffset + index + 1}</span>
              </td>
              <td className={styles.materia}>{item.materia}</td>
              <td className={styles.aula}>{item.aula}</td>
              <td>{item.total_questoes.toLocaleString('pt-BR')}</td>
              <td>
                <Badge color={getTaxaColor(item.taxa_acerto_pct)}>{item.taxa_acerto_pct.toFixed(0)}%</Badge>
              </td>
              <td>{formatarTempo(item.tempo_medio_seg)}</td>
              <td>{item.total_acessos.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
