# Contratos de backend — Configurações e Recuperação de senha

Todos os endpoints abaixo prefixados com `/aluno/**` exigem o header:

```
Authorization: Bearer {token}
```

O usuário é identificado pelo JWT — o frontend **nunca** envia `usuario_id`.

---

## 1. Perfil

### `GET /aluno/configuracoes`

Autenticação: obrigatória (JWT).

Retorna perfil, notificações e preferência de aparência do aluno logado.

**Response 200**
```json
{
  "perfil": {
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "nivel": 12,
    "xp_total": 4820,
    "escola": "Colégio Exemplo",
    "ano_enem": "2026",
    "avatar_url": null
  },
  "notificacoes": [
    { "id": "lembrete-diario", "label": "Lembrete diário de estudos", "description": "Receba um lembrete todo dia", "enabled": true },
    { "id": "alerta-ofensiva", "label": "Alerta de ofensiva", "description": "Avise quando eu estiver perto de perder a ofensiva", "enabled": true },
    { "id": "novas-conquistas", "label": "Novas conquistas", "description": "Avise quando eu desbloquear uma conquista", "enabled": true },
    { "id": "novidades", "label": "Novidades do AdaptAI", "description": "Novidades e atualizações da plataforma", "enabled": false }
  ],
  "aparencia": { "tema": "sistema" }
}
```

**Erros:** `401` sessão expirada/token inválido.

> Observação: a seção **"Relatório semanal"** e o objeto **"metas"** foram removidos da resposta consumida pelo frontend. Se o backend ainda retornar um item de notificação com `id: "relatorio-semanal"`, o frontend o filtra e não o exibe — o ideal é o backend deixar de enviá-lo.

---

### `PATCH /aluno/configuracoes/perfil`

Autenticação: obrigatória (JWT).

Atualiza nome, escola e ano do ENEM do aluno logado. **Email não é editável por este endpoint.**

**Payload**
```json
{
  "nome": "Maria Silva",
  "escola": "Colégio Exemplo",
  "ano_enem": "2026"
}
```

**Response 200**
```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "nivel": 12,
  "xp_total": 4820,
  "escola": "Colégio Exemplo",
  "ano_enem": "2026"
}
```

**Erros:** `400` dados inválidos, `401` sessão expirada.

---

### `POST /aluno/configuracoes/avatar`

Autenticação: obrigatória (JWT). `Content-Type: multipart/form-data`.

Faz upload/substitui a foto de perfil do aluno logado.

**Payload (multipart/form-data)**
```
avatar: <arquivo de imagem>
```

**Response 200**
```json
{ "avatar_url": "https://cdn.adaptai.com/avatars/aluno-123.jpg" }
```

**Erros:**
- `400` arquivo ausente, formato não suportado ou maior que o limite permitido
- `401` sessão expirada

---

## 2. Notificações

### `PATCH /aluno/configuracoes/notificacoes`

Autenticação: obrigatória (JWT).

Ativa/desativa uma preferência de notificação (in-app **e** email associados àquela categoria).

**Payload**
```json
{ "id": "lembrete-diario", "enabled": false }
```

**Response 200**
```json
{ "id": "lembrete-diario", "enabled": false }
```

**Erros:** `400` id inválido, `401` sessão expirada, `404` preferência não encontrada.

> O campo `enabled` deve ser tratado pelo backend como controle único de "recebo esta categoria" — cobrindo tanto o alerta quanto o email correspondente. Não há endpoint separado para email; se no futuro for necessário desacoplar canal push/email, sugerimos evoluir o payload para `{ id, canal: "push"|"email", enabled }` mantendo compatibilidade.

---

## 3. Aparência

### `PATCH /aluno/configuracoes/aparencia`

Já existente — sem alterações.

```json
{ "tema": "claro" | "escuro" | "sistema" }
```

---

## 4. Alterar senha

### `POST /aluno/configuracoes/senha`

Autenticação: obrigatória (JWT).

**Payload**
```json
{
  "senha_atual": "SenhaAtual123",
  "nova_senha": "NovaSenhaSegura456"
}
```

**Response 200**
```json
{ "sucesso": true }
```

**Erros:**
- `400` nova senha não atende aos requisitos mínimos
- `401` sessão expirada
- `403` senha atual incorreta

---

## 5. Excluir conta

### `DELETE /aluno/conta`

Autenticação: obrigatória (JWT). Ação destrutiva e irreversível.

**Payload**
```json
{ "senha": "SenhaAtual123" }
```

**Response 200/204:** conta e dados do aluno excluídos (ou marcados para exclusão), sessão deve ser invalidada no backend (revogar token/refresh token).

**Erros:**
- `401` sessão expirada
- `403` senha incorreta

Após sucesso, o frontend limpa cookie/localStorage locais e redireciona para `/login`.

---

## 6. Dados utilizados pela IA

### `GET /aluno/configuracoes/dados-ia`

Autenticação: obrigatória (JWT).

Retorna quais categorias de dados são usadas pela IA para personalizar a experiência do aluno, e os insights já identificados sobre ele. **Não deve expor prompts, nomes de modelo, tokens ou detalhes técnicos internos.**

**Response 200**
```json
{
  "dados": [
    { "id": "desempenho-matematica", "nome": "Desempenho em Matemática", "descricao": "Resultados em questões e simulados de Matemática", "categoria": "desempenho", "utilizado": true },
    { "id": "questoes-erradas", "nome": "Questões erradas", "descricao": "Histórico de questões respondidas incorretamente", "categoria": "questoes", "utilizado": true },
    { "id": "tempo-estudo", "nome": "Tempo de estudo", "descricao": "Duração e frequência das suas sessões de estudo", "categoria": "habitos", "utilizado": true },
    { "id": "redacoes", "nome": "Histórico de redações", "descricao": "Correções e evolução das suas redações", "categoria": "redacao", "utilizado": false }
  ],
  "insights": [
    { "id": "insight-1", "titulo": "Maior dificuldade em Álgebra", "descricao": "Você apresenta maior dificuldade em Matemática, principalmente em Álgebra.", "materia": "Matemática", "tipo": "dificuldade" },
    { "id": "insight-2", "titulo": "Sessões curtas funcionam melhor", "descricao": "Seu desempenho melhora quando realiza sessões de estudo menores e mais frequentes.", "tipo": "habito" }
  ]
}
```

**Erros:** `401` sessão expirada.

### `PATCH /aluno/configuracoes/dados-ia` (opcional — só implementar se o backend puder de fato respeitar a preferência ao gerar recomendações)

Ativa/desativa o uso de uma categoria específica de dado pela IA.

**Payload**
```json
{ "id": "redacoes", "utilizado": false }
```

**Response 200**
```json
{ "id": "redacoes", "utilizado": false }
```

**Erros:** `400` id inválido, `401` sessão expirada, `404` não encontrado.

> Se o backend ainda não conseguir respeitar essa preferência na geração de recomendações da IA, **não implementar este PATCH agora** — o frontend está preparado para chamá-lo, mas a ausência do endpoint apenas resulta em erro tratado (toast de erro) ao tentar alternar o switch, sem quebrar a tela.

---

## 7. Recuperação de senha (fluxo público, sem autenticação)

### `POST /auth/esqueci-senha`

Autenticação: **nenhuma**. Deve ser seguro contra enumeração de emails (sempre responder 200 com a mesma mensagem, exista ou não o email).

**Payload**
```json
{ "email": "maria@email.com" }
```

**Response 200** (sempre, independentemente de o email existir)
```json
{ "mensagem": "Se este email estiver cadastrado, enviaremos instruções para redefinir sua senha." }
```

Comportamento esperado no backend: se o email existir, gerar um token de redefinição com expiração curta (ex.: 30-60 min) e enviar por email um link no formato:

```
https://app.adaptai.com/redefinir-senha?token={token}
```

**Erros:** `429` rate limit (recomendado, para evitar abuso), nunca `404`.

---

### `POST /auth/redefinir-senha`

Autenticação: **nenhuma** (o token do link substitui a autenticação).

**Payload**
```json
{
  "token": "abc123...",
  "nova_senha": "NovaSenhaSegura456"
}
```

**Response 200**
```json
{ "sucesso": true }
```

**Erros:**
- `400` senha não atende aos requisitos mínimos
- `401`/`410` token inválido ou expirado (o frontend exibe mensagem amigável e oferece solicitar um novo link)

---

## 8. Notificações do navegador (Web Notifications API)

A ativação/permissão de notificações do navegador é feita **inteiramente no frontend** via `Notification.requestPermission()` — não exige endpoint novo. Nenhum backend adicional foi implementado ou é necessário nesta etapa.

Caso no futuro seja necessário enviar **push notifications reais** (via Service Worker + Push API), será necessário adicionalmente:

- `POST /aluno/configuracoes/push/subscricao` — registrar a subscription do navegador (endpoint, chaves `p256dh`/`auth`) associada ao aluno logado.
- `DELETE /aluno/configuracoes/push/subscricao` — remover a subscription ao desativar.

Esses dois endpoints **não foram implementados nem chamados pelo frontend agora** — documentados apenas para referência futura, caso a plataforma evolua para push real.

---

## 9. Logout

### `POST /auth/logout`

Autenticação: obrigatória (JWT).

Invalida a sessão atual no servidor (revoga o token/refresh token). O frontend chama este
endpoint antes de limpar o cookie/localStorage locais e redirecionar para `/login`; se a chamada
falhar (ex.: backend fora do ar), o frontend limpa a sessão local mesmo assim para não travar o
usuário.

**Response 200/204**
```json
{ "sucesso": true }
```

**Erros:** `401` sessão já expirada (tratado como sucesso silencioso pelo frontend).

---

## Removido desta etapa (não implementar)

- Qualquer endpoint de **exportação de dados** (`/aluno/exportar-dados` ou similar).
- Qualquer endpoint de **metas/plano de estudo** dentro de `/aluno/configuracoes` — a configuração de metas passa a ser feita exclusivamente pela página de criação/edição do Plano de Estudos, com seus próprios endpoints (fora do escopo deste documento).
- Notificação de **"Relatório semanal"** — não deve mais ser enviada nem exibida.
