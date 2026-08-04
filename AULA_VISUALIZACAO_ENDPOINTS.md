# Endpoints utilizados

GET /aluno/aulas/{slug}

PATCH /aluno/aulas/{slug}/concluir

PATCH /aluno/aulas/{slug}/progresso

PATCH /aluno/aulas/{slug}/conceitos/{conceitoId}

---

## GET /aluno/aulas/{slug}

Retorna o detalhe completo da aula para a página de visualização, localizando a aula pelo `slug` (nunca por `id`).

### Parâmetros

| Nome | Tipo | Local | Obrigatório | Descrição |
|---|---|---|---|---|
| `slug` | string | rota | Sim | Slug único da aula (ex.: `funcao-quadratica`). |

### Payload

Nenhum (GET).

### Response esperado

```json
{
  "slug": "funcao-quadratica",
  "titulo": "Função Quadrática",
  "materia": "Matemática",
  "materia_cor": "blue",
  "duracao_min": 35,
  "dificuldade": "Médio",
  "progresso": 60,
  "status": "em-andamento",
  "video_url": "https://.../video.mp4",
  "resumo": [
    "A função quadrática é definida por f(x) = ax² + bx + c, onde a ≠ 0.",
    "Para encontrar as raízes, usamos a Fórmula de Bhaskara: x = (-b ± √Δ) / 2a."
  ],
  "conceitos": [
    { "id": "definicao", "label": "Definição de função quadrática f(x) = ax² + bx + c", "concluido": false },
    { "id": "discriminante", "label": "Cálculo do discriminante (Δ = b² - 4ac)", "concluido": false }
  ],
  "modulo": {
    "titulo": "Funções",
    "aulas": [
      { "ordem": 1, "titulo": "Função Afim", "status": "concluida" },
      { "ordem": 2, "titulo": "Função Quadrática", "status": "atual" },
      { "ordem": 3, "titulo": "Função Exponencial", "status": "bloqueada" }
    ]
  },
  "proxima_aula": {
    "slug": "funcao-exponencial",
    "titulo": "Função Exponencial",
    "duracao_min": 28,
    "dificuldade": "Médio"
  },
  "dica_ada": "Preste atenção no sinal de 'a' — ele define se a parábola abre para cima ou para baixo."
}
```

### Interfaces TypeScript

```ts
export type AulaVisualizacaoStatus = 'concluida' | 'em-andamento' | 'nao-iniciada'

export type AulaVisualizacaoConceito = {
    id: string
    label: string
    concluido: boolean
}

export type AulaVisualizacaoModuloAula = {
    ordem: number
    titulo: string
    status: 'concluida' | 'atual' | 'bloqueada'
}

export type AulaVisualizacaoModulo = {
    titulo: string
    aulas: AulaVisualizacaoModuloAula[]
}

export type AulaVisualizacaoProximaAula = {
    slug: string
    titulo: string
    duracao_min: number
    dificuldade: string
} | null

export type GetAulaVisualizacaoResponse = {
    slug: string
    titulo: string
    materia: string
    materia_cor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
    duracao_min: number
    dificuldade: string
    progresso: number
    status: AulaVisualizacaoStatus
    video_url: string | null
    resumo: string[]
    conceitos: AulaVisualizacaoConceito[]
    modulo: AulaVisualizacaoModulo | null
    proxima_aula: AulaVisualizacaoProximaAula
    dica_ada: string | null
}
```

### Status HTTP utilizados

- `200 OK`: aula encontrada.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: nenhuma aula encontrada para o `slug` informado.

---

## PATCH /aluno/aulas/{slug}/concluir

Marca a aula como concluída para o aluno autenticado. Após a chamada, o frontend recarrega o detalhe da aula (`GET /aluno/aulas/{slug}`) para refletir progresso, módulo e próxima aula atualizados.

### Parâmetros

| Nome | Tipo | Local | Obrigatório | Descrição |
|---|---|---|---|---|
| `slug` | string | rota | Sim | Slug da aula a ser concluída. |

### Payload

Nenhum.

### Response esperado

```json
{
  "slug": "funcao-quadratica",
  "titulo": "Função Quadrática",
  "materia": "Matemática",
  "materia_cor": "blue",
  "duracao_min": 35,
  "dificuldade": "Médio",
  "progresso": 100,
  "status": "concluida",
  "video_url": "https://.../video.mp4",
  "resumo": ["..."],
  "conceitos": [{ "id": "definicao", "label": "...", "concluido": true }],
  "modulo": { "titulo": "Funções", "aulas": [{ "ordem": 2, "titulo": "Função Quadrática", "status": "concluida" }] },
  "proxima_aula": { "slug": "funcao-exponencial", "titulo": "Função Exponencial", "duracao_min": 28, "dificuldade": "Médio" },
  "dica_ada": null
}
```

### Interfaces TypeScript

```ts
export type PatchAulaConcluirResponse = GetAulaVisualizacaoResponse
```

### Status HTTP utilizados

- `200 OK`: aula marcada como concluída.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: aula não encontrada para o `slug` informado.

---

## PATCH /aluno/aulas/{slug}/progresso

Atualiza o progresso de visualização do vídeo da aula. Chamado pelo callback de progresso do `VideoPlayer`, com envio limitado a mudanças significativas (variação mínima de 5%).

### Parâmetros

| Nome | Tipo | Local | Obrigatório | Descrição |
|---|---|---|---|---|
| `slug` | string | rota | Sim | Slug da aula. |

### Payload

```json
{
  "progresso": 63
}
```

### Response esperado

```json
{
  "slug": "funcao-quadratica",
  "progresso": 63,
  "status": "em-andamento"
}
```

### Interfaces TypeScript

```ts
export type PatchAulaProgressoParams = {
    progresso: number
}

export type PatchAulaProgressoResponse = {
    slug: string
    progresso: number
    status: AulaVisualizacaoStatus
}
```

### Status HTTP utilizados

- `200 OK`: progresso atualizado.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: aula não encontrada para o `slug` informado.
- `422 Unprocessable Entity`: `progresso` fora do intervalo válido (0-100).

---

## PATCH /aluno/aulas/{slug}/conceitos/{conceitoId}

Marca ou desmarca um conceito específico da aula como concluído. Atualiza apenas o conceito alterado — não recarrega a página inteira (atualização otimista no frontend, com rollback em caso de erro).

### Parâmetros

| Nome | Tipo | Local | Obrigatório | Descrição |
|---|---|---|---|---|
| `slug` | string | rota | Sim | Slug da aula. |
| `conceitoId` | string | rota | Sim | Identificador do conceito. |

### Payload

```json
{
  "concluido": true
}
```

ou

```json
{
  "concluido": false
}
```

### Response esperado

```json
{
  "id": "definicao",
  "label": "Definição de função quadrática f(x) = ax² + bx + c",
  "concluido": true
}
```

### Interfaces TypeScript

```ts
export type PatchAulaConceitoParams = {
    concluido: boolean
}

export type PatchAulaConceitoResponse = {
    id: string
    label: string
    concluido: boolean
}
```

### Status HTTP utilizados

- `200 OK`: conceito atualizado.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: aula ou conceito não encontrado.
