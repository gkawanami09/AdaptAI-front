# Biblioteca de Aulas

## GET /aluno/aulas

Lista as categorias (matérias) disponíveis e o catálogo de aulas do aluno autenticado, com progresso individual.

### Query Params

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `categoria_id` | string | Não | Filtra as aulas por categoria/matéria. Quando ausente, retorna todas as aulas. |

### Payload

Nenhum (GET).

### Response esperado

```json
{
  "total_aulas": 10,
  "total_concluidas": 2,
  "subtitulo": "10 aulas disponíveis · 2 concluídas",
  "categorias": [
    { "id": "uuid-todas-categoria-matematica", "nome": "Matemática" },
    { "id": "uuid-categoria-ciencias-natureza", "nome": "Ciências da Natureza" },
    { "id": "uuid-categoria-ciencias-humanas", "nome": "Ciências Humanas" },
    { "id": "uuid-categoria-linguagens", "nome": "Linguagens" },
    { "id": "uuid-categoria-redacao", "nome": "Redação" }
  ],
  "aulas": [
    {
      "id": "uuid-aula-1",
      "slug": "funcao-afim",
      "titulo": "Função afim",
      "materia": "Matemática",
      "materia_cor": "blue",
      "icone": "📐",
      "icone_cor": "blue",
      "duracao_min": 45,
      "dificuldade": "Básico",
      "progresso": 100,
      "status": "concluida",
      "destaque": true
    },
    {
      "id": "uuid-aula-2",
      "slug": "funcao-quadratica",
      "titulo": "Função Quadrática",
      "materia": "Matemática",
      "materia_cor": "blue",
      "icone": "📐",
      "icone_cor": "blue",
      "duracao_min": 35,
      "dificuldade": "Médio",
      "progresso": 60,
      "status": "em-andamento",
      "destaque": true
    }
  ]
}
```

### Interfaces TypeScript esperadas

```ts
export type BibliotecaAulaStatus = 'concluida' | 'em-andamento' | 'nao-iniciada'

export type BibliotecaCategoria = {
    id: string
    nome: string
}

export type BibliotecaAula = {
    id: string
    slug: string | null
    titulo: string
    materia: string
    materia_cor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
    icone: string
    icone_cor: 'purple' | 'green' | 'blue' | 'gold' | 'red'
    duracao_min: number
    dificuldade: string
    progresso: number
    status: BibliotecaAulaStatus
    destaque: boolean
}

export type GetBibliotecaAulasResponse = {
    total_aulas: number
    total_concluidas: number
    subtitulo: string
    categorias: BibliotecaCategoria[]
    aulas: BibliotecaAula[]
}
```

### Campos obrigatórios

`total_aulas`, `total_concluidas`, `subtitulo`, `categorias`, `aulas`, e dentro de cada aula: `id`, `titulo`, `materia`, `materia_cor`, `icone`, `icone_cor`, `duracao_min`, `dificuldade`, `progresso`, `status`, `destaque`.

### Campos opcionais

`slug` (null quando a aula ainda não possui slug — nesse caso o frontend navega por `id`).

### Status HTTP utilizados

- `200 OK`: dados retornados com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: `categoria_id` informado não corresponde a nenhuma matéria.

---

## GET /aluno/aulas/{slugOuId}

Endpoint necessário para a página de visualização da aula (destino da navegação a partir do card). Ainda não implementado no frontend fora da rota fixa `/aulas/funcao-quadratica`, mas é requisito para a navegação dinâmica funcionar (`/aulas/{slug}` ou `/aulas/{id}`).

### Query Params

Nenhum. `slugOuId` é parâmetro de rota — o backend deve aceitar tanto o `slug` quanto o `id` da aula.

### Payload

Nenhum (GET).

### Response esperado

```json
{
  "id": "uuid-aula-2",
  "slug": "funcao-quadratica",
  "titulo": "Função Quadrática",
  "materia": "Matemática",
  "materia_cor": "blue",
  "dificuldade": "Médio",
  "progresso": 60,
  "status": "em-andamento",
  "conteudos": [
    {
      "tipo": "video",
      "ordem": 1,
      "duracao_min": 20,
      "video_link": "https://...",
      "titulo": "Introdução",
      "descricao": "..."
    },
    {
      "tipo": "texto",
      "ordem": 2,
      "duracao_min": 15,
      "titulo": "Resumo teórico",
      "descricao": "..."
    }
  ]
}
```

### Interfaces TypeScript esperadas

```ts
export type BibliotecaAulaConteudoTipo = 'video' | 'texto'

export type BibliotecaAulaConteudo = {
    tipo: BibliotecaAulaConteudoTipo
    ordem: number
    duracao_min: number
    titulo: string
    descricao: string
    video_link?: string
}

export type GetBibliotecaAulaDetalheResponse = {
    id: string
    slug: string | null
    titulo: string
    materia: string
    materia_cor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
    dificuldade: string
    progresso: number
    status: BibliotecaAulaStatus
    conteudos: BibliotecaAulaConteudo[]
}
```

### Campos obrigatórios

`id`, `titulo`, `materia`, `materia_cor`, `dificuldade`, `progresso`, `status`, `conteudos` (e, por conteúdo: `tipo`, `ordem`, `duracao_min`, `titulo`, `descricao`).

### Campos opcionais

`slug`, `video_link` (obrigatório apenas quando `tipo` for `video`).

### Status HTTP utilizados

- `200 OK`: aula encontrada.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: aula não encontrada para o slug/id informado.
