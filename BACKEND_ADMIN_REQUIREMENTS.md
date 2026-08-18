# Requisitos de Backend — Área Administrativa

Autenticação padrão em todos os endpoints: header `Authorization: Bearer {token}` (JWT do
admin autenticado). Nenhum endpoint recebe `usuario_id`/`admin_id` no payload — o autor da
ação é sempre identificado pelo token.

---

## Endpoints existentes utilizados

Estes já são chamados pelo frontend hoje. Esta seção documenta apenas os **campos novos**
que passaram a ser exibidos/enviados pela UI; o restante do contrato já existente permanece
inalterado.

### GET /admin/usuarios
### GET /admin/usuarios/{id}

Já utilizados (`UsuarioResumo`/`UsuarioDetalhe`). A tela de usuários agora tenta exibir 3
campos adicionais, **opcionais** — se o backend não enviá-los, a UI simplesmente omite essa
informação (não quebra, não inventa valor):

```json
{
  "id": "uuid",
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "nivel": 12,
  "escola": "Colégio Exemplo",
  "ano_enem": "2026",
  "...": "demais campos já existentes (cargo, status, xp, ofensiva_atual, etc.)"
}
```

- `nivel` (number) — nível/level do aluno, hoje já calculado para o perfil do aluno
  (`GET /aluno/configuracoes` retorna `nivel`); pedimos o mesmo dado aqui.
- `escola` (string | null) — mesma origem do campo já usado em `/aluno/configuracoes`.
- `ano_enem` (string | null) — idem.

**Observação:** se esses 3 campos já existem no modelo de usuário (são usados no perfil do
próprio aluno), o ideal é apenas incluí-los também na resposta administrativa.

---

### GET /admin/materias
### GET /admin/materias/{id}
### POST /admin/materias
### PATCH /admin/materias/{id}

Já utilizados. A tela de cadastro/edição de matéria agora envia e exibe 1 campo novo:

- `descricao` (string | null, opcional no payload de `POST`/`PATCH`) — descrição livre da
  matéria, mostrada num textarea no formulário.

E passa a **exibir** (somente leitura, se o backend já tiver esse dado — não é enviado pelo
formulário):

- `slug` (string, opcional na resposta) — se a matéria já possui um slug usado em outras
  partes do sistema (banco de questões, plano de estudos), inclua-o na resposta de
  `GET /admin/materias/{id}` e de `GET /admin/materias` para exibição.

Response esperada (campos novos em negrito no destaque abaixo):
```json
{
  "sucesso": true,
  "materia": {
    "id": "uuid",
    "nome": "Matemática",
    "area": "matematica",
    "icone": "📐",
    "cor": "#6C5CE7",
    "ordem": 1,
    "ativo": true,
    "slug": "matematica",
    "descricao": "Álgebra, geometria e estatística do ensino médio."
  }
}
```

**Observação:** o endpoint atual de `GET /admin/materias/{id}` retorna a chave acentuada
`matéria` em vez de `materia` — o frontend já normaliza isso, mas o ideal é o backend
padronizar para `materia` (sem acento) como todo o resto da API.

---

### GET /admin/monitoramento

Já utilizado. Todo outro endpoint administrativo do projeto retorna um envelope com
`sucesso: boolean`; este é o único que não retorna. Pedimos que passe a seguir o mesmo
padrão:

```json
{
  "sucesso": true,
  "rotas": [{ "rota": "/aluno/questoes", "metodo": "GET", "latencia_media_ms": 120, "taxa_erro_pct": 0.4, "total_requisicoes": 1500 }],
  "operacoes_ia": [{ "operacao": "gerar-lista", "latencia_media_ms": 2300, "taxa_erro_pct": 1.2, "total_chamadas": 300 }]
}
```

**Motivo:** sem o campo `sucesso`, se o backend um dia envelopar a resposta como as demais
rotas administrativas (`{"sucesso": true, "dados": {...}}` ou similar), a tela quebra porque
espera `rotas`/`operacoes_ia` na raiz. Alinhar isso agora evita o problema.

---

## Novos endpoints necessários

### CRUD de Área do Conhecimento

Hoje "área do conhecimento" existe apenas como uma lista fixa de 5 valores no frontend
(`matematica`, `natureza`, `humanas`, `linguagens`, `redacao`, usada no campo `area` de
matéria) — não há entidade nem CRUD no backend. Os endpoints abaixo criam essa entidade,
seguindo exatamente o mesmo padrão já usado em `/admin/tipos-prova`.

#### GET /admin/areas-conhecimento

Autenticação: Bearer JWT (admin).

Query params:
| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `busca` | string | não | Filtro por nome |
| `ativo` | boolean | não | Filtra por status |
| `pagina` | number | não | Página, padrão 1 |
| `limite` | number | não | Itens por página, padrão 6 |

Response 200:
```json
{
  "sucesso": true,
  "pagina": 1,
  "limite": 6,
  "total_registros": 5,
  "total_paginas": 1,
  "areas": [
    {
      "id": "uuid",
      "nome": "Ciências da Natureza",
      "slug": "ciencias-natureza",
      "descricao": "Física, Química e Biologia",
      "ativo": true,
      "criado_em": "2026-01-10T12:00:00Z"
    }
  ]
}
```

Erros: `401`, `403`.

#### GET /admin/areas-conhecimento/resumo

Autenticação: Bearer JWT (admin).

Response 200:
```json
{ "sucesso": true, "total_areas": 5, "areas_ativas": 4, "areas_inativas": 1 }
```

Erros: `401`, `403`.

#### GET /admin/areas-conhecimento/{id}

Autenticação: Bearer JWT (admin).

Response 200: `{ "sucesso": true, "area": { ... mesmo shape acima } }`

Erros: `401`, `403`, `404`.

#### POST /admin/areas-conhecimento

Autenticação: Bearer JWT (admin).

Payload:
```json
{ "nome": "Ciências da Natureza", "descricao": "Física, Química e Biologia", "ativo": true }
```
(`descricao` e `ativo` opcionais; `slug` é gerado pelo backend a partir do `nome`.)

Response 201:
```json
{ "sucesso": true, "mensagem": "Área do conhecimento criada com sucesso.", "area": { "...": "..." } }
```

Erros: `401`, `403`, `422` (nome ausente/duplicado).

#### PATCH /admin/areas-conhecimento/{id}

Autenticação: Bearer JWT (admin). Payload: qualquer subconjunto de `{ nome, descricao, ativo }`.

Response 200: `{ "sucesso": true, "mensagem": "Área do conhecimento atualizada com sucesso.", "area": { "...": "..." } }`

Erros: `401`, `403`, `404`, `422`.

#### DELETE /admin/areas-conhecimento/{id}

Autenticação: Bearer JWT (admin).

Regra de negócio: exclusão lógica preferencialmente (mesmo padrão de "excluir" já usado em
`/admin/tipos-prova`, que apenas remove a referência das entidades vinculadas em vez de
bloquear a exclusão). Matérias que apontam para essa área apenas perdem a referência.

Response 200: `{ "sucesso": true, "mensagem": "Área do conhecimento excluída com sucesso." }`

Erros: `401`, `403`, `404`.

---

## Observações gerais

- Nenhum endpoint documentado aqui foi inventado por precaução — todos correspondem a uma
  tela real implementada nesta entrega (Usuários, Matérias, Áreas do Conhecimento,
  Monitoramento).
- As seções "Conteúdo", "IA", "Notificações" e "Integrações" de Configurações já têm
  endpoints implementados e em uso (`/admin/configuracoes/{conteudo,ia,notificacoes,integracoes}`)
  mas foram **removidas da navegação** nesta entrega a pedido do produto — nenhuma mudança
  de contrato é necessária nelas, o código de frontend permanece intacto e pode ser
  reativado apenas reinserindo as abas em `AdminConfiguracoes.tsx`.
- A aba "Permissões" reaproveita `GET /admin/usuarios` e `PATCH /admin/usuarios/{id}`
  (cargo/status, tipo `UsuarioAdminCargo`) já existentes — nenhum endpoint novo de
  permissões foi criado, pois o sistema de cargos já cumpre esse papel.
