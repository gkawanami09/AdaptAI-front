# Contrato de backend — Reordenar aulas de um módulo (admin)

## `PATCH /admin/modulos/:topicoId/aulas/ordem`

Autenticação: obrigatória (JWT, papel admin).

Atualiza a ordem de exibição das aulas dentro de um módulo (tópico), a partir do reordenamento
feito via drag-and-drop na tela `AdminModuloDetalhe`.

**Parâmetros de rota**
- `topicoId` — id do módulo/tópico cujas aulas foram reordenadas.

**Payload**
```json
{
  "ordem": [
    { "id": "aula-1", "ordem": 1 },
    { "id": "aula-3", "ordem": 2 },
    { "id": "aula-2", "ordem": 3 }
  ]
}
```

**Response 200/204:** sem corpo, ou confirmação simples.
```json
{ "sucesso": true }
```

**Erros:**
- `400` lista de ordem inválida (ids duplicados, aula fora do módulo, etc.)
- `401` sessão expirada
- `403` usuário sem permissão de admin
- `404` módulo não encontrado

**Comportamento no frontend:** a reordenação é otimista — a lista já é reordenada localmente ao
soltar o item, e o `PATCH` é disparado em seguida. Se a chamada falhar, a lista volta para a ordem
anterior e uma mensagem de erro é exibida acima da tabela de aulas.
