# Meu Progresso — Backend Requirements

## Endpoints utilizados

- `GET /aluno/progresso`

--------------------------------------------

## Endpoint

GET /aluno/progresso

Retorna todos os dados da página Meu Progresso em uma única chamada: resumo (meta mensal, horas estudadas, ofensiva, XP total), evolução de acertos por matéria, horas estudadas por dia da semana, ranking de matérias, mapa de calor de dias estudados e metas mensais.

--------------------------------------------
Query Params
--------------------------------------------

Nenhum.

--------------------------------------------
Payload
--------------------------------------------

Nenhum (GET).

--------------------------------------------
Response
--------------------------------------------

```json
{
  "resumo": {
    "meta_mensal_percentual": 62,
    "horas_estudadas": "47h",
    "ofensiva_dias": 8,
    "xp_total": 4820
  },
  "evolucao_acertos": {
    "categories": ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    "series": [
      { "name": "Matemática", "color": "blue", "values": [58, 62, 65, 70] },
      { "name": "Biologia", "color": "green", "values": [72, 70, 74, 78] },
      { "name": "História", "color": "red", "values": [62, 64, 68, 70] }
    ]
  },
  "horas_por_dia": [
    { "label": "Seg", "value": 2.6 },
    { "label": "Ter", "value": 1.8 },
    { "label": "Qua", "value": 3.2 },
    { "label": "Qui", "value": 2.2 },
    { "label": "Sex", "value": 2.9 },
    { "label": "Sab", "value": 1.3 },
    { "label": "Dom", "value": 0.6 }
  ],
  "ranking_materias": [
    { "label": "Biologia", "percent": 78, "color": "green" },
    { "label": "Português", "percent": 72, "color": "gold" },
    { "label": "História", "percent": 65, "color": "red" },
    { "label": "Matemática", "percent": 58, "color": "blue" },
    { "label": "Física", "percent": 45, "color": "orange" },
    { "label": "Química", "percent": 40, "color": "purple" }
  ],
  "heatmap": {
    "weekday_labels": ["D", "S", "T", "Q", "Q", "S", "S"],
    "weeks": [
      [0, 3, 3, 0, 0, 4, 0],
      [3, 1, 3, 0, 3, 3, 4],
      [4, 0, 4, 3, 3, 3, 4],
      [3, 3, 0, 3, 3, 4, 0],
      [3, 3, 0, 4, 0, 3, 0]
    ]
  },
  "metas_mensais": [
    { "label": "Questões resolvidas", "value": 320, "target": 500, "color": "purple" },
    { "label": "Horas de estudo", "value": 47, "target": 80, "color": "blue" },
    { "label": "Simulados feitos", "value": 2, "target": 4, "color": "teal" }
  ]
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type ProgressoResumo = {
  meta_mensal_percentual: number
  horas_estudadas: string
  ofensiva_dias: number
  xp_total: number
}

type ProgressoEvolucaoSerie = {
  name: string
  color: 'blue' | 'green' | 'red'
  values: number[]
}

type ProgressoEvolucaoAcertos = {
  categories: string[]
  series: ProgressoEvolucaoSerie[]
}

type ProgressoHorasPorDia = {
  label: string
  value: number
}

type ProgressoRankingMateria = {
  label: string
  percent: number
  color: 'purple' | 'teal' | 'gold' | 'red' | 'blue' | 'green' | 'orange'
}

type ProgressoHeatmap = {
  weekday_labels: string[]
  weeks: number[][]
}

type ProgressoMetaMensal = {
  label: string
  value: number
  target: number
  color: 'purple' | 'teal' | 'gold' | 'red' | 'blue' | 'green' | 'orange'
}

type GetProgressoResponse = {
  resumo: ProgressoResumo
  evolucao_acertos: ProgressoEvolucaoAcertos
  horas_por_dia: ProgressoHorasPorDia[]
  ranking_materias: ProgressoRankingMateria[]
  heatmap: ProgressoHeatmap
  metas_mensais: ProgressoMetaMensal[]
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `resumo.meta_mensal_percentual`: percentual da meta mensal atingida; o frontend formata como `62%`.
- `resumo.horas_estudadas`: horas estudadas no período, já formatadas (ex.: `47h`).
- `resumo.ofensiva_dias`: quantidade de dias consecutivos de estudo; o frontend formata como `8 dias`.
- `resumo.xp_total`: XP total acumulado; o frontend formata com separador de milhar (ex.: `4.820`).
- `evolucao_acertos.categories`: rótulos do eixo X do `GroupedBarChart` (ex.: semanas do mês).
- `evolucao_acertos.series[].name` / `color` / `values`: uma série por matéria, com um valor por categoria; `color` restrito à paleta suportada pelo `GroupedBarChart` (`blue`, `green`, `red`).
- `horas_por_dia[]`: um ponto por dia da semana, alimenta o `AreaLineChart`; `value` em horas (aceita decimais).
- `ranking_materias[]`: itens ordenados do maior para o menor `percent`, alimentam o `RankingListCard`; a posição no array define a colocação exibida (1º, 2º, 3º...).
- `heatmap.weekday_labels`: rótulos das colunas do mapa de calor (um por dia da semana).
- `heatmap.weeks[]`: uma linha por semana; cada valor é o nível de estudo do dia, de `0` (nada) a `4` (mais estudado).
- `metas_mensais[]`: uma meta por item, com valor atual (`value`) e alvo (`target`); o frontend calcula o percentual (`value / target`).

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `resumo`, `evolucao_acertos`, `horas_por_dia`, `ranking_materias`, `heatmap`, `metas_mensais`.
- Em `resumo`: `meta_mensal_percentual`, `horas_estudadas`, `ofensiva_dias`, `xp_total`.
- Em `evolucao_acertos`: `categories`, `series` (cada série com `name`, `color`, `values`).
- Em cada item de `horas_por_dia`: `label`, `value`.
- Em cada item de `ranking_materias`: `label`, `percent`, `color`.
- Em `heatmap`: `weekday_labels`, `weeks`.
- Em cada item de `metas_mensais`: `label`, `value`, `target`, `color`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum. Arrays podem ser vazios (`series`, `horas_por_dia`, `ranking_materias`, `weeks`, `metas_mensais`) — o frontend trata o estado vazio nesse caso.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: dados retornados com sucesso.
- `401 Unauthorized`: token ausente ou inválido.

--------------------------------------------
Database
--------------------------------------------

Reutilizar tabelas existentes: histórico de estudos/sessões, respostas de questões (para acertos por matéria e ranking), XP/ofensiva do aluno e metas mensais já previstas na estrutura do banco. Nenhuma tabela nova é necessária.
