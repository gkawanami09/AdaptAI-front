# Banco de Questões — Backend Requirements

## Endpoint

GET /aluno/banco-questoes/filtros

Retorna as opções disponíveis para os filtros da página Banco de Questões (vestibular, dificuldade e matéria), usadas para montar os grupos do `FiltersCard` dinamicamente.

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
  "vestibulares": [
    { "value": "enem", "label": "ENEM" },
    { "value": "fuvest", "label": "Fuvest" }
  ],
  "dificuldades": [
    { "value": "facil", "label": "Fácil" },
    { "value": "medio", "label": "Médio" },
    { "value": "dificil", "label": "Difícil" }
  ],
  "materias": [
    { "value": "matematica", "label": "Matemática" },
    { "value": "biologia", "label": "Biologia" }
  ]
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type BancoQuestoesFiltroOpcao = {
  value: string
  label: string
}

type GetBancoQuestoesFiltrosResponse = {
  vestibulares: BancoQuestoesFiltroOpcao[]
  dificuldades: BancoQuestoesFiltroOpcao[]
  materias: BancoQuestoesFiltroOpcao[]
}
```

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `vestibulares`, `dificuldades`, `materias`: arrays sempre presentes (podem ser vazios).
- Cada opção: `value` e `label`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: filtros retornados com sucesso.
- `401 Unauthorized`: token ausente ou inválido.

---

## Endpoint

GET /aluno/banco-questoes/listas

Retorna as listas de questões disponíveis para o aluno, já filtradas pelos parâmetros informados, com o total de listas encontradas para exibição no contador da página ("N listas disponíveis").

--------------------------------------------
Query Params
--------------------------------------------

- `vestibulares` (opcional, repetível): filtra por um ou mais `value` de vestibular (ex.: `?vestibulares=enem&vestibulares=fuvest`).
- `dificuldades` (opcional, repetível): filtra por um ou mais `value` de dificuldade.
- `materias` (opcional, repetível): filtra por um ou mais `value` de matéria.
- `apenas_erradas` (opcional): `true` retorna apenas listas com questões que o aluno respondeu errado (shortcut "Questões erradas").
- `apenas_favoritas` (opcional): `true` retorna apenas listas com questões marcadas como favoritas pelo aluno (shortcut "Questões favoritas").

--------------------------------------------
Payload
--------------------------------------------

Nenhum (GET).

--------------------------------------------
Response
--------------------------------------------

```json
{
  "total": 3,
  "listas": [
    {
      "id": "uuid-lista-1",
      "slug": "lista-funcoes",
      "icone": "📐",
      "icone_cor": "purple",
      "titulo": "Lista: Funções",
      "dificuldade": "Médio",
      "dificuldade_cor": "blue",
      "vestibular": "ENEM",
      "questoes_concluidas": 8,
      "questoes_totais": 15,
      "progresso_cor": "purple"
    },
    {
      "id": "uuid-lista-2",
      "slug": null,
      "icone": "🌿",
      "icone_cor": "green",
      "titulo": "Lista: Ecologia",
      "dificuldade": "Fácil",
      "dificuldade_cor": "teal",
      "vestibular": "ENEM",
      "questoes_concluidas": 20,
      "questoes_totais": 20,
      "progresso_cor": "teal"
    }
  ]
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type BancoQuestoesIconeCor = 'purple' | 'green' | 'blue' | 'gold' | 'red'
type BancoQuestoesBadgeCor = 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
type BancoQuestoesProgressoCor = 'purple' | 'teal' | 'gold' | 'red' | 'blue' | 'green' | 'orange'

type BancoQuestoesLista = {
  id: string
  slug: string | null
  icone: string
  icone_cor: BancoQuestoesIconeCor
  titulo: string
  dificuldade: string
  dificuldade_cor: BancoQuestoesBadgeCor
  vestibular: string
  questoes_concluidas: number
  questoes_totais: number
  progresso_cor: BancoQuestoesProgressoCor
}

type GetBancoQuestoesListasParams = {
  vestibulares?: string[]
  dificuldades?: string[]
  materias?: string[]
  apenas_erradas?: boolean
  apenas_favoritas?: boolean
}

type GetBancoQuestoesListasResponse = {
  total: number
  listas: BancoQuestoesLista[]
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `total`: total de listas encontradas para os filtros aplicados; exibido no contador "N listas disponíveis".
- `listas[].id`: identificador da lista, usado como fallback de navegação quando `slug` for `null`.
- `listas[].slug`: identificador amigável da lista; quando presente, é usado na navegação `/questoes/{slug}` (o frontend nunca usa rota fixa).
- `listas[].icone` / `icone_cor`: emoji e cor do ícone exibidos no card da lista.
- `listas[].dificuldade` / `dificuldade_cor`: rótulo e cor do badge de dificuldade.
- `listas[].vestibular`: rótulo do vestibular associado à lista.
- `listas[].questoes_concluidas` / `questoes_totais`: usados para calcular a barra de progresso do card.
- `listas[].progresso_cor`: cor da barra de progresso.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `total`, `listas`.
- Em cada lista: `id`, `icone`, `icone_cor`, `titulo`, `dificuldade`, `dificuldade_cor`, `vestibular`, `questoes_concluidas`, `questoes_totais`, `progresso_cor`.

--------------------------------------------
Campos opcionais
--------------------------------------------

- `listas[].slug`: pode ser `null` quando a lista não possui identificador amigável; nesse caso o frontend navega usando `id`.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: listas retornadas com sucesso (inclusive quando `listas` é um array vazio).
- `401 Unauthorized`: token ausente ou inválido.

---

## Endpoint

POST /aluno/banco-questoes/listas/gerar-ia

Aciona a geração automática (via IA) de uma nova lista de questões personalizada para o aluno, com base no seu histórico de desempenho. Botão "Gerar lista com IA".

--------------------------------------------
Query Params
--------------------------------------------

Nenhum.

--------------------------------------------
Payload
--------------------------------------------

```json
{}
```

--------------------------------------------
Response
--------------------------------------------

```json
{
  "id": "uuid-lista-nova",
  "slug": "lista-gerada-ia-2026-08-05"
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type PostGerarListaComIAResponse = {
  id: string
  slug: string | null
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `id`: identificador da lista recém-criada.
- `slug`: identificador amigável da lista recém-criada, pode ser `null`. Após a chamada, o frontend recarrega `GET /aluno/banco-questoes/listas` e navega para `/questoes/{slug ?? id}`.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `id`.

--------------------------------------------
Campos opcionais
--------------------------------------------

- `slug`.

--------------------------------------------
Status HTTP
--------------------------------------------

- `201 Created`: lista gerada com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `422 Unprocessable Entity`: não há dados suficientes do aluno para gerar uma lista personalizada.

--------------------------------------------
Database
--------------------------------------------

Reutilizar tabelas existentes: `questoes`, `listas_questoes`, `tipos_prova`, `materias`, além das tabelas de respostas do aluno (para os filtros `apenas_erradas`/`apenas_favoritas`) e de progresso já previstas na estrutura do banco. Nenhuma tabela nova é necessária além de uma relação aluno/questão para marcação de favoritos, caso ainda não exista.
