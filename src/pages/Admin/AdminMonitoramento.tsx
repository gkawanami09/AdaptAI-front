import { useEffect, useState } from 'react'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { CardDiv } from '../../components/cards/CardDiv'
import { CardHeading } from '../../components/cards/CardHeading'
import { Badge } from '../../components/ui/Badge'
import type { BadgeColor } from '../../components/ui/Badge'
import styles from './AdminMonitoramento.module.css'

import { getMonitoramento } from '../../services/monitoramento'
import type { GetMonitoramentoResponse } from '../../types/monitoramento'

function getTaxaErroColor(taxaErroPct: number): BadgeColor {
  if (taxaErroPct <= 1) return 'teal'
  if (taxaErroPct <= 5) return 'gold'
  return 'red'
}

export function AdminMonitoramento() {
  const [dados, setDados] = useState<GetMonitoramentoResponse | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  async function carregarMonitoramento() {
    setCarregando(true)
    setErro(false)

    try {
      const resposta = await getMonitoramento()
      setDados(resposta)
    } catch (err) {
      console.error(err)
      setErro(true)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarMonitoramento()
  }, [])

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Monitoramento' }]} />

        <div className={styles.header}>
          <TitlePage title="Monitoramento" subtitle="Latência e taxa de erro por rota e por operação de IA." />
        </div>

        {carregando ? (
          <CardDiv>
            <p className={styles.emptyState}>Carregando monitoramento...</p>
          </CardDiv>
        ) : erro || !dados ? (
          <CardDiv>
            <p className={styles.emptyState}>Não foi possível carregar o monitoramento.</p>
            <div className={styles.retryRow}>
              <Button fullWidth={false} onClick={carregarMonitoramento}>
                Tentar novamente
              </Button>
            </div>
          </CardDiv>
        ) : (
          <div className={styles.tablesRow}>
            <CardDiv>
              <CardHeading>Rotas da API</CardHeading>

              {dados.rotas.length === 0 ? (
                <p className={styles.emptyState}>Nenhum dado de rota registrado ainda.</p>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Rota</th>
                        <th>Método</th>
                        <th>Latência Média</th>
                        <th>Taxa de Erro</th>
                        <th>Requisições</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.rotas.map((item) => (
                        <tr key={`${item.metodo}-${item.rota}`}>
                          <td className={styles.rota}>{item.rota}</td>
                          <td>{item.metodo}</td>
                          <td>{item.latencia_media_ms.toFixed(0)}ms</td>
                          <td>
                            <Badge color={getTaxaErroColor(item.taxa_erro_pct)}>{item.taxa_erro_pct.toFixed(1)}%</Badge>
                          </td>
                          <td>{item.total_requisicoes.toLocaleString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardDiv>

            <CardDiv>
              <CardHeading>Operações de IA</CardHeading>

              {dados.operacoes_ia.length === 0 ? (
                <p className={styles.emptyState}>Nenhum dado de operação de IA registrado ainda.</p>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Operação</th>
                        <th>Latência Média</th>
                        <th>Taxa de Erro</th>
                        <th>Chamadas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.operacoes_ia.map((item) => (
                        <tr key={item.operacao}>
                          <td className={styles.rota}>{item.operacao}</td>
                          <td>{item.latencia_media_ms.toFixed(0)}ms</td>
                          <td>
                            <Badge color={getTaxaErroColor(item.taxa_erro_pct)}>{item.taxa_erro_pct.toFixed(1)}%</Badge>
                          </td>
                          <td>{item.total_chamadas.toLocaleString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardDiv>
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}
