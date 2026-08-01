# Endpoints — Módulo Usuários

---

## Listar usuários

GET `/admin/usuarios`

Query Params
- `busca` (string, opcional)
- `cargo` (`aluno`|`moderador`|`editor`|`administrador`, opcional)
- `status` (`ativo`|`suspenso`|`banido`, opcional)
- `ofensiva_min` (number, opcional)
- `ordenar` (`nome-az`|`nome-za`|`recentes`|`xp-desc`|`ofensiva-desc`, opcional)
- `pagina` (number, opcional, default 1)
- `limite` (number, opcional, default 8)

Response 200
```json
{
  "sucesso": true,
  "pagina": 1,
  "limite": 8,
  "total_paginas": 16,
  "total_usuarios": 124,
  "total_ativos": 118,
  "total_suspensos": 4,
  "ofensiva_media": 14,
  "usuarios": [
    {
      "id": "8f3c1d2a-4b5e-4a8f-9c3e-1b2d3e4f5a6b",
      "nome": "João Silva",
      "email": "joao.silva@email.com",
      "avatar_url": null,
      "cargo": "aluno",
      "status": "ativo",
      "ofensiva_atual": 38,
      "xp": 12540,
      "ultimo_acesso": "Hoje, 09:20"
    }
  ]
}
```

---

## Criar usuário

POST `/admin/usuarios`

Payload
```json
{ "nome": "João Silva", "email": "joao.silva@email.com", "cargo": "aluno" }
```

Response 201
```json
{ "sucesso": true, "mensagem": "Usuário criado com sucesso.", "usuario": { "...": "UsuarioDetalhe" } }
```

---

## Detalhe do usuário

GET `/admin/usuarios/{id}`

Response 200
```json
{
  "sucesso": true,
  "usuario": {
    "id": "8f3c1d2a-4b5e-4a8f-9c3e-1b2d3e4f5a6b",
    "id_publico": "8f3c1d2a-4b5e-4a8f-9c3e-1b2d3e4f5a6b",
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "avatar_url": null,
    "cargo": "aluno",
    "status": "ativo",
    "criado_em": "10/01/2026 às 14:30",
    "ultimo_acesso": "Hoje, 09:20",
    "email_verificado": true,
    "ofensiva_atual": 38,
    "maior_ofensiva": 108,
    "xp": 12540,
    "questoes_respondidas": 2145,
    "taxa_acerto": 81,
    "tempo_estudo_min": 8062,
    "listas_concluidas": 42,
    "provas_realizadas": 16,
    "ranking_geral": 128
  }
}
```

---

## Atualizar usuário

PATCH `/admin/usuarios/{id}`

Payload (todos opcionais)
```json
{ "nome": "João Silva", "email": "joao.silva@email.com", "cargo": "aluno" }
```

Response 200
```json
{ "sucesso": true, "mensagem": "Usuário atualizado com sucesso.", "usuario": { "...": "UsuarioDetalhe" } }
```

---

## Alterar cargo

PATCH `/admin/usuarios/{id}/cargo`

Payload
```json
{ "cargo": "moderador" }
```

Response 200
```json
{ "sucesso": true, "mensagem": "Cargo atualizado.", "usuario": { "...": "UsuarioDetalhe" } }
```

---

## Histórico de ofensiva (90 dias)

GET `/admin/usuarios/{id}/ofensiva-historico`

Response 200
```json
{
  "sucesso": true,
  "historico": [
    { "data": "01/06", "ofensiva": 20 },
    { "data": "16/05", "ofensiva": 25 }
  ]
}
```

---

## Conquistas do usuário

GET `/admin/usuarios/{id}/conquistas`

Response 200
```json
{
  "sucesso": true,
  "conquistas": [
    { "id": "c1", "nome": "Maratonista", "descricao": "30 dias de ofensiva", "icone": "🔥", "conquistada_em": "12/05/2026" }
  ]
}
```

---

## Histórico de atividades (paginado)

GET `/admin/usuarios/{id}/historico`

Query Params
- `pagina` (number, opcional, default 1)
- `limite` (number, opcional, default 8)

Response 200
```json
{
  "sucesso": true,
  "pagina": 1,
  "limite": 8,
  "total_paginas": 5,
  "itens": [
    { "id": "h1", "tipo": "questao", "descricao": "Respondeu a questão de Matemática", "data": "Hoje, 09:20" }
  ]
}
```

---

## Medidas administrativas

GET `/admin/usuarios/{id}/medidas`

Response 200
```json
{
  "sucesso": true,
  "medidas": [
    {
      "id": "m1",
      "tipo": "suspensao",
      "motivo": "Uso de linguagem inadequada no chat",
      "administrador": "Guilherme Silva",
      "data": "23/07/2026",
      "status": "expirada"
    }
  ]
}
```

---

## Timeline do usuário

GET `/admin/usuarios/{id}/timeline`

Response 200
```json
{
  "sucesso": true,
  "eventos": [
    { "id": "t1", "tipo": "conta_criada", "titulo": "Conta criada", "descricao": "Usuário se cadastrou na plataforma", "data": "10/01/2026" },
    { "id": "t2", "tipo": "primeiro_login", "titulo": "Primeiro login", "descricao": "Primeiro acesso à plataforma", "data": "10/01/2026" }
  ]
}
```

---

## Suspender usuário

POST `/admin/usuarios/{id}/suspender`

Payload
```json
{ "motivo": "Uso de linguagem inadequada no chat", "duracao_dias": 7 }
```

Response 200
```json
{ "sucesso": true, "mensagem": "Usuário suspenso com sucesso.", "usuario": { "...": "UsuarioDetalhe" } }
```

---

## Banir usuário

POST `/admin/usuarios/{id}/banir`

Payload
```json
{ "motivo": "Reincidência em violação das diretrizes" }
```

Response 200
```json
{ "sucesso": true, "mensagem": "Usuário banido com sucesso.", "usuario": { "...": "UsuarioDetalhe" } }
```

---

## Reativar usuário

POST `/admin/usuarios/{id}/reativar`

Response 200
```json
{ "sucesso": true, "mensagem": "Usuário reativado com sucesso.", "usuario": { "...": "UsuarioDetalhe" } }
```

---

## Resetar senha

POST `/admin/usuarios/{id}/resetar-senha`

Response 200
```json
{ "sucesso": true, "mensagem": "Email de redefinição de senha enviado." }
```

---

## Resetar ofensiva

POST `/admin/usuarios/{id}/resetar-ofensiva`

Response 200
```json
{ "sucesso": true, "mensagem": "Ofensiva resetada com sucesso.", "usuario": { "...": "UsuarioDetalhe" } }
```
