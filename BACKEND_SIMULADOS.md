# Simulados — Backend Requirements

## Endpoints utilizados

- `GET /aluno/simulados`

--------------------------------------------

## Endpoint

GET /aluno/simulados

Retorna todos os dados da página Simulados: resumo de desempenho (nota estimada, tempo médio, taxa de acerto), catálogo de simulados disponíveis e histórico de simulados já realizados pelo aluno.

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
    "nota_estimada": 620,
    "tempo_medio": "5h22",
    "taxa_acerto_percentual": 68
  },
  "catalogo": [
    {
      "slug": "enem-completo",
      "titulo": "Simulado ENEM Completo",
      "descricao": "180 questões · 4 áreas",
      "icone": "📋",
      "icone_cor": "purple",
      "tag": "Completo",
      "tag_cor": "purple",
      "duracao": "5h30"
    },
    {
      "slug": "rapido-matematica",
      "titulo": "Simulado Rápido — Matemática",
      "descricao": "30 questões · 1 área",
      "icone": "📐",
      "icone_cor": "blue",
      "tag": "Rápido",
      "tag_cor": "blue",
      "duracao": "1h"
    }
  ],
  "historico": [
    {
      "id": "uuid-simulado-realizado-1",
      "dia": "02",
      "titulo": "Simulado ENEM — 02/06",
      "tempo": "5h12",
      "nota": 620,
      "acertos_percentual": 68
    },
    {
      "id": "uuid-simulado-realizado-2",
      "dia": "25",
      "titulo": "Simulado ENEM — 25/05",
      "tempo": "5h30",
      "nota": 598,
      "acertos_percentual": 64
    }
  ]
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type SimuladosResumo = {
  nota_estimada: number
  tempo_medio: string
  taxa_acerto_percentual: number
}

type SimuladoCatalogoItem = {
  slug: string
  titulo: string
  descricao: string
  icone: string
  icone_cor: 'purple' | 'green' | 'blue' | 'gold' | 'red'
  tag: string
  tag_cor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
  duracao: string
}

type SimuladoHistoricoItem = {
  id: string
  dia: string
  titulo: string
  tempo: string
  nota: number
  acertos_percentual: number
}

type GetSimuladosResponse = {
  resumo: SimuladosResumo
  catalogo: SimuladoCatalogoItem[]
  historico: SimuladoHistoricoItem[]
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `resumo.nota_estimada`: nota estimada do aluno com base nos simulados realizados; alimenta o `StatHighlightCard` "Nota estimada".
- `resumo.tempo_medio`: tempo médio de duração dos simulados realizados, já formatado (ex.: `5h22`); alimenta o `StatHighlightCard` "Tempo médio".
- `resumo.taxa_acerto_percentual`: percentual médio de acertos; alimenta o `StatHighlightCard` "Taxa de acerto" (o frontend formata como `68%`).
- `catalogo[].slug`: identificador amigável do simulado, usado para navegação (`/simulados/{slug}`). Nunca utilizar `id`.
- `catalogo[].icone` / `icone_cor`: emoji e cor do ícone exibidos no `SimuladoCard`.
- `catalogo[].tag` / `tag_cor`: rótulo e cor do badge do simulado (ex.: Completo, Rápido, Personalizado, Flexível).
- `catalogo[].duracao`: duração estimada já formatada (ex.: `5h30`, `45 min`).
- `historico[].id`: identificador do simulado já realizado, usado apenas como `key` de lista (não usado para navegação).
- `historico[].dia`: dia do mês em que o simulado foi realizado, exibido no badge circular.
- `historico[].tempo` / `nota` / `acertos_percentual`: métricas do simulado realizado exibidas no `HistoricoCard`.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `resumo`, `catalogo`, `historico`.
- Em `resumo`: `nota_estimada`, `tempo_medio`, `taxa_acerto_percentual`.
- Em cada item de `catalogo`: `slug`, `titulo`, `descricao`, `icone`, `icone_cor`, `tag`, `tag_cor`, `duracao`.
- Em cada item de `historico`: `id`, `dia`, `titulo`, `tempo`, `nota`, `acertos_percentual`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum. `catalogo` e `historico` podem ser arrays vazios (estado vazio tratado pelo frontend).

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: dados retornados com sucesso.
- `401 Unauthorized`: token ausente ou inválido.

--------------------------------------------
Database
--------------------------------------------

Reutilizar tabelas existentes: `simulados` (catálogo), `tentativas_simulado` ou equivalente (histórico de execuções do aluno, origem de `resumo` e `historico`). Nenhuma tabela nova é necessária.
