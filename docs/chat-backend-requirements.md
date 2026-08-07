# Integração — Chat da Ada

Especificação dos endpoints necessários para o Chat da Ada funcionar como uma
conversa real com IA, seguindo o mesmo padrão arquitetural usado nas demais
páginas do aluno (Aulas, Questões, Simulados, Redação).

Área: `/aluno` (não usa `/admin`).

## Autenticação

Todos os endpoints abaixo exigem:

```
Authorization: Bearer <JWT>
```

Igual ao restante do sistema (`requestAuthJson`). Resposta `401` deve seguir o
mesmo formato de erro já usado (`{ "detail": "string" }`), tratado no frontend
como "Sessao expirada. Faca login novamente.".

## Persistência

- Toda conversa fica salva no backend, associada ao usuário autenticado.
- O aluno pode reabrir conversas antigas (`GET /aluno/chat/conversas/:id`).
- A IA mantém contexto por conversa (histórico completo enviado/mantido pelo backend).
- Uma conversa pertence exclusivamente ao usuário que a criou; qualquer acesso
  cruzado deve retornar `404` (não `403`, para não revelar existência do recurso).

## Interfaces TypeScript (referência — `src/types/chat.ts`)

```ts
type ChatRole = 'ada' | 'user' | 'system'

type ChatAttachmentType = 'imagem' | 'pdf' | 'arquivo' | 'audio'

type ChatAttachment = {
  id: string
  tipo: ChatAttachmentType
  nome: string
  url: string
}

type ChatFeedback = 'positivo' | 'negativo'

type ChatFerramenta =
  | 'questoes'
  | 'resumo'
  | 'revisao'
  | 'plano-estudos'
  | 'redacao'
  | 'explicacao'
  | 'lista'
  | 'simulados'

type ChatSugestaoAcao = {
  tipo: ChatFerramenta
  label: string
}

type ChatMensagem = {
  id: string
  sender: ChatRole
  texto: string
  timestamp: string
  anexos?: ChatAttachment[]
  sugestoes?: ChatSugestaoAcao[]
  tokens?: number
  modelo?: string
}

type ChatConversaResumo = {
  id: string
  slug: string
  titulo: string
  atualizadoEm: string
}

type ChatModelo = {
  id: string
  nome: string
  descricao: string
  padrao: boolean
}
```

---

## Endpoints

### 1. Listar conversas

```
GET /aluno/chat/conversas
```

**Response 200**

```json
{
  "conversas": [
    {
      "id": "string",
      "slug": "string",
      "titulo": "string",
      "atualizadoEm": "2026-08-07T12:00:00Z"
    }
  ]
}
```

Ordenado por `atualizadoEm` decrescente. Lista vazia (`"conversas": []`) quando
o aluno nunca conversou com a Ada — o frontend cria a primeira conversa
automaticamente (`POST /aluno/chat/conversas`).

**Status HTTP**

- `200` — sempre, mesmo com lista vazia
- `401` — sessão expirada

---

### 2. Criar conversa

```
POST /aluno/chat/conversas
```

**Payload**

```json
{
  "titulo": "string opcional"
}
```

Se `titulo` não for enviado, o backend deve gerar um título padrão (ex.: "Nova
conversa") e atualizá-lo automaticamente após a primeira mensagem trocada
(ex.: resumo da primeira pergunta do aluno).

**Response 201**

```json
{
  "id": "string",
  "slug": "string",
  "titulo": "string",
  "atualizadoEm": "2026-08-07T12:00:00Z"
}
```

**Status HTTP**

- `201` — conversa criada
- `401` — sessão expirada

---

### 3. Buscar histórico de uma conversa

```
GET /aluno/chat/conversas/:id
```

**Response 200**

```json
{
  "id": "string",
  "slug": "string",
  "titulo": "string",
  "mensagens": [
    {
      "id": "string",
      "sender": "ada | user | system",
      "texto": "string",
      "timestamp": "2026-08-07T12:00:00Z",
      "anexos": [],
      "sugestoes": [{ "tipo": "questoes", "label": "Gerar questões sobre o tema" }],
      "tokens": 0,
      "modelo": "string"
    }
  ]
}
```

`mensagens` vazio quando a conversa acabou de ser criada — o frontend exibe
apenas a mensagem inicial fixa da Ada nesse caso.

**Status HTTP**

- `200` — encontrada
- `404` — id inexistente ou pertence a outro usuário
- `401` — sessão expirada

---

### 4. Enviar mensagem para a IA

```
POST /aluno/chat/conversas/:id/mensagens
```

**Payload**

```json
{
  "mensagem": "Explique função do segundo grau"
}
```

**Response 200**

```json
{
  "user": {
    "id": "string",
    "sender": "user",
    "texto": "Explique função do segundo grau",
    "timestamp": "2026-08-07T12:00:00Z"
  },
  "assistant": {
    "id": "string",
    "sender": "ada",
    "texto": "string",
    "timestamp": "2026-08-07T12:00:01Z"
  },
  "tempoProcessamentoMs": 1200,
  "tokensUsados": 340,
  "modelo": "ada-1",
  "sugestoes": [
    { "tipo": "questoes", "label": "Gerar questões sobre o tema" }
  ]
}
```

`sugestoes` é opcional — a IA retorna quando identifica uma próxima ação útil
(ex.: gerar questões, montar revisão). Ver seção "Ferramentas da IA".

**Status HTTP**

- `200` — resposta gerada com sucesso
- `404` — conversa inexistente ou de outro usuário
- `422` — `mensagem` vazia
- `401` — sessão expirada
- `503` — IA indisponível (frontend exibe erro com opção de reenviar)

---

### 5. Excluir conversa

```
DELETE /aluno/chat/conversas/:id
```

**Status HTTP**

- `204` — excluída
- `404` — inexistente ou de outro usuário
- `401` — sessão expirada

---

### 6. Renomear conversa

```
PATCH /aluno/chat/conversas/:id
```

**Payload**

```json
{
  "titulo": "string"
}
```

**Response 200**

```json
{
  "id": "string",
  "slug": "string",
  "titulo": "string",
  "atualizadoEm": "2026-08-07T12:00:00Z"
}
```

**Status HTTP**

- `200` — renomeada
- `404` — inexistente ou de outro usuário
- `422` — título vazio
- `401` — sessão expirada

---

### 7. Regenerar última resposta

```
POST /aluno/chat/conversas/:id/regenerar
```

Descarta a última resposta da Ada e gera uma nova a partir da última mensagem
do usuário na conversa.

**Response 200**

```json
{
  "assistant": {
    "id": "string",
    "sender": "ada",
    "texto": "string",
    "timestamp": "2026-08-07T12:00:00Z"
  }
}
```

**Status HTTP**

- `200` — nova resposta gerada
- `404` — conversa inexistente ou sem mensagens para regenerar
- `401` — sessão expirada

---

### 8. Feedback da resposta (curtir / não curtir)

```
POST /aluno/chat/conversas/:id/feedback
```

**Payload**

```json
{
  "mensagemId": "string",
  "feedback": "positivo | negativo"
}
```

**Status HTTP**

- `204` — feedback registrado
- `404` — conversa ou mensagem inexistente
- `401` — sessão expirada

---

### 9. Listar modelos disponíveis

```
GET /aluno/chat/modelos
```

**Response 200**

```json
{
  "modelos": [
    { "id": "ada-1", "nome": "Ada", "descricao": "Modelo padrão", "padrao": true },
    { "id": "ada-pro", "nome": "Ada Pro", "descricao": "Respostas mais detalhadas", "padrao": false }
  ]
}
```

Preparado para futura seleção de modelo pelo aluno (GPT, Claude, etc. podem
ser adicionados à lista sem mudança de contrato).

**Status HTTP**

- `200` — sempre
- `401` — sessão expirada

---

## Ferramentas da IA (tool calling)

Endpoints que a Ada poderá acionar dentro da conversa para executar ações
concretas na plataforma. Devem existir desde já retornando `501 Not
Implemented` até serem implementados, para o frontend já estar preparado para
consumi-los.

Todos seguem o mesmo formato de resposta enquanto não implementados:

```json
{ "status": "not_implemented" }
```

| Endpoint | Descrição | Payload |
| --- | --- | --- |
| `POST /aluno/chat/tools/questoes` | Gerar questões sobre um tema | `{ "tema": "string", "quantidade": 10 }` |
| `POST /aluno/chat/tools/resumo` | Gerar resumo de um conteúdo | `{ "conteudo": "string" }` |
| `POST /aluno/chat/tools/revisao` | Criar revisão personalizada | `{ "materia": "string" }` |
| `POST /aluno/chat/tools/plano-estudos` | Gerar plano de estudos | `{ "objetivo": "string" }` |
| `POST /aluno/chat/tools/redacao` | Corrigir redação (delega ao fluxo de [Redação](./redacao-integracao.md)) | `{ "texto": "string" }` |
| `POST /aluno/chat/tools/explicacao` | Explicar um conteúdo/tópico | `{ "topico": "string" }` |
| `POST /aluno/chat/tools/lista` | Gerar lista de exercícios | `{ "tema": "string", "quantidade": 10 }` |
| `POST /aluno/chat/tools/simulados` | Montar simulado personalizado | `{ "materias": ["string"], "quantidadeQuestoes": 20 }` |

**Status HTTP**

- `501` — ferramenta ainda não implementada (comportamento atual)
- `200` — ferramenta implementada, corpo específico por ferramenta (a definir
  quando cada uma for implementada)
- `401` — sessão expirada

---

## Streaming (evolução futura)

A implementação atual é request/response simples (`POST
/aluno/chat/conversas/:id/mensagens` retorna a resposta completa). Para reduzir
a percepção de latência, o backend pode evoluir para respostas em streaming.
Duas abordagens possíveis:

### Opção 1 — Server-Sent Events (preferencial)

```
POST /aluno/chat/conversas/:id/mensagens/stream
Accept: text/event-stream
```

O backend mantém a conexão aberta e envia eventos incrementais:

```
event: token
data: {"token": "Fun"}

event: token
data: {"token": "ção"}

event: done
data: {"id": "string", "tokensUsados": 340, "tempoProcessamentoMs": 1200, "modelo": "ada-1"}
```

No frontend, `streamChatResposta` (já presente em `services/chat.ts` como TODO)
passará a abrir um `EventSource`/`fetch` com leitura de stream e invocar um
callback por token recebido, atualizando a última mensagem da Ada
incrementalmente.

### Opção 2 — WebSocket

```
WS /aluno/chat/conversas/:id/ws
```

Cliente envia `{ "mensagem": "string" }` e recebe múltiplos frames
`{ "token": "string" }` seguidos de um frame final `{ "done": true, ... }`.
Mais adequado se o backend também quiser suportar cancelamento de geração em
tempo real (`POST /aluno/chat/conversas/:id/cancelar`, já previsto no frontend
como `cancelarChatGeracao`).

**Recomendação:** SSE é suficiente para o caso de uso atual (resposta
unidirecional da IA) e mais simples de operar atrás de proxies/load balancers
existentes. WebSocket só se torna necessário se cancelamento em tempo real ou
comunicação bidirecional constante for um requisito.

Nenhuma das duas opções deve ser implementada agora — o frontend permanece no
modelo request/response até o backend anunciar suporte a streaming.

---

## Mapeamento Backend → Frontend

| Campo backend | Uso no frontend |
| --- | --- |
| `conversas[].id` | `useChat` — identifica a conversa ativa |
| `conversas[].titulo` | futura lista de conversas (sidebar) |
| `mensagens[].sender` | `ChatMessage.sender` (`'ada' \| 'user'`) |
| `mensagens[].texto` | `ChatMessage.text` |
| `mensagens[].timestamp` | `ChatMessage.time` (formatado via `formatarHora`) |
| `assistant.sugestoes` | botões de ação sugerida abaixo da resposta (preparado, não renderizado ainda) |
| `tokensUsados` / `modelo` | telemetria/debug, não exibido na UI atual |
