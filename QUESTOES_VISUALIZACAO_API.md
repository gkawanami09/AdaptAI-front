# Visualização de Questões — Backend Requirements

## Endpoint

GET /aluno/questoes/{slug}

Retorna os dados completos de uma lista de questões para exibição na página de Visualização de Questões: informações da lista, progresso e todas as questões com suas alternativas e estado (respondida, favorita, correta).

--------------------------------------------
Parâmetros
--------------------------------------------

- `slug` (obrigatório, rota): identificador amigável da lista de questões. Nunca utilizar `id`.

--------------------------------------------
Payload
--------------------------------------------

Nenhum (GET).

--------------------------------------------
Response
--------------------------------------------

```json
{
  "slug": "lista-funcoes",
  "titulo": "Lista: Funções",
  "materia": "Matemática",
  "dificuldade": "Médio",
  "vestibular": "ENEM",
  "status": "em_andamento",
  "questoes_totais": 12,
  "questoes_concluidas": 8,
  "progresso_percentual": 66,
  "questoes": [
    {
      "id": "uuid-questao-1",
      "subject": "Matemática",
      "subjectColor": "blue",
      "examInfo": "ENEM 2020 · Fácil",
      "question": "Resolva a equação do 2º grau x² - 7x + 12 = 0 e identifique suas raízes.",
      "options": [
        "As raízes são x = 3 e x = 4.",
        "As raízes são x = 2 e x = 6.",
        "A equação não possui raízes reais.",
        "As raízes são x = -3 e x = -4.",
        "A raiz é única: x = 7."
      ],
      "hint": "Use a Fórmula de Bhaskara com a = 1, b = -7 e c = 12.",
      "respondida": true,
      "opcaoSelecionada": 0,
      "correta": true,
      "favorita": false
    }
  ]
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type QuestoesVisualizacaoStatus = 'em_andamento' | 'finalizada'

type QuestoesVisualizacaoQuestao = {
  id: string
  subject: string
  subjectColor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
  examInfo: string
  question: string
  options: string[]
  hint: string
  respondida: boolean
  opcaoSelecionada: number | null
  correta: boolean | null
  favorita: boolean
}

type GetListaQuestoesResponse = {
  slug: string
  titulo: string
  materia: string
  dificuldade: string
  vestibular: string
  status: QuestoesVisualizacaoStatus
  questoes_totais: number
  questoes_concluidas: number
  progresso_percentual: number
  questoes: QuestoesVisualizacaoQuestao[]
}
```

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `slug`, `titulo`, `materia`, `dificuldade`, `vestibular`, `status`, `questoes_totais`, `questoes_concluidas`, `progresso_percentual`, `questoes`.
- Em cada questão: `id`, `subject`, `subjectColor`, `examInfo`, `question`, `options`, `hint`, `respondida`, `opcaoSelecionada`, `correta`, `favorita`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum. `opcaoSelecionada` e `correta` são `null` quando a questão ainda não foi respondida.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: lista retornada com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `403 Forbidden`: lista não pertence ao aluno autenticado.
- `404 Not Found`: nenhuma lista encontrada para o `slug` informado.

---

## Endpoint

PATCH /aluno/questoes/{slug}/questoes/{questaoId}

Registra a resposta escolhida pelo aluno para uma questão da lista e retorna o novo estado da questão e do progresso da lista.

--------------------------------------------
Parâmetros
--------------------------------------------

- `slug` (obrigatório, rota): identificador amigável da lista.
- `questaoId` (obrigatório, rota): identificador da questão.

--------------------------------------------
Payload
--------------------------------------------

```json
{
  "opcao_selecionada": 0
}
```

--------------------------------------------
Response
--------------------------------------------

```json
{
  "id": "uuid-questao-1",
  "respondida": true,
  "opcaoSelecionada": 0,
  "correta": true,
  "questoes_concluidas": 9,
  "progresso_percentual": 75
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type ResponderQuestaoPayload = {
  opcao_selecionada: number
}

type ResponderQuestaoResponse = {
  id: string
  respondida: boolean
  opcaoSelecionada: number | null
  correta: boolean | null
  questoes_concluidas: number
  progresso_percentual: number
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `opcao_selecionada`: índice (0-based) da alternativa escolhida pelo aluno.
- `questoes_concluidas` / `progresso_percentual`: valores atualizados da lista, usados para atualizar apenas o progresso sem recarregar a página inteira.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- Payload: `opcao_selecionada`.
- Response: `id`, `respondida`, `opcaoSelecionada`, `correta`, `questoes_concluidas`, `progresso_percentual`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: resposta registrada com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `403 Forbidden`: lista não pertence ao aluno autenticado.
- `404 Not Found`: lista ou questão não encontrada.
- `422 Unprocessable Entity`: `opcao_selecionada` inválido (fora do intervalo de alternativas) ou questão já finalizada.

---

## Endpoint

PATCH /aluno/questoes/favoritos/{questaoId}

Alterna o estado de favorito de uma questão para o aluno autenticado.

--------------------------------------------
Parâmetros
--------------------------------------------

- `questaoId` (obrigatório, rota): identificador da questão.

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
  "id": "uuid-questao-1",
  "favorita": true
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type FavoritarQuestaoResponse = {
  id: string
  favorita: boolean
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `favorita`: novo estado do favorito após a alternância. O frontend aplica a alteração de forma otimista e desfaz caso a chamada falhe.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- Response: `id`, `favorita`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: favorito atualizado com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: questão não encontrada.

---

## Endpoint

POST /aluno/questoes/{slug}/finalizar

Finaliza a lista de questões quando todas as questões foram respondidas, atualizando o status e o progresso finais da lista.

--------------------------------------------
Parâmetros
--------------------------------------------

- `slug` (obrigatório, rota): identificador amigável da lista.

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
  "status": "finalizada",
  "progresso_percentual": 100,
  "questoes_concluidas": 12,
  "questoes_totais": 12
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type FinalizarListaResponse = {
  status: QuestoesVisualizacaoStatus
  progresso_percentual: number
  questoes_concluidas: number
  questoes_totais: number
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `status`: novo status da lista (`finalizada`).
- `progresso_percentual`, `questoes_concluidas`, `questoes_totais`: valores finais usados para atualizar a página sem necessidade de nova busca completa. Caso não exista tela de resultado dedicada, o frontend apenas atualiza esses dados na página atual.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `status`, `progresso_percentual`, `questoes_concluidas`, `questoes_totais`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: lista finalizada com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `403 Forbidden`: lista não pertence ao aluno autenticado.
- `404 Not Found`: lista não encontrada.
- `422 Unprocessable Entity`: existem questões pendentes de resposta.
