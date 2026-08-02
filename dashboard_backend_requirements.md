# Dashboard — Backend Requirements

## 1. GET /admin/dashboard

Retorna KPIs, gráfico de crescimento, atividade do dia, atividades recentes, resumo de conteúdo e alertas para a página Dashboard.

**Query Params**
- `periodo`: `7d` | `30d` | `90d` | `12m` (default: `30d`)

**Response 200**
```json
{
  "sucesso": true,
  "kpis": {
    "total_usuarios": 12458,
    "total_usuarios_variacao_pct": 8.4,
    "questoes_respondidas": 24521,
    "questoes_respondidas_variacao_pct": 12.6,
    "provas_realizadas": 148,
    "provas_realizadas_variacao_pct": 6.1,
    "ofensiva_media_dias": 14,
    "ofensiva_media_variacao_dias": -1
  },
  "crescimento": [
    { "data": "01/07", "usuarios": 5200, "questoes_respondidas": 3100, "listas_concluidas": 1200, "provas_realizadas": 60 },
    { "data": "08/07", "usuarios": 5400, "questoes_respondidas": 3400, "listas_concluidas": 1350, "provas_realizadas": 68 },
    { "data": "15/07", "usuarios": 5900, "questoes_respondidas": 4100, "listas_concluidas": 1600, "provas_realizadas": 82 },
    { "data": "22/07", "usuarios": 6300, "questoes_respondidas": 4700, "listas_concluidas": 1850, "provas_realizadas": 91 },
    { "data": "29/07", "usuarios": 6800, "questoes_respondidas": 5300, "listas_concluidas": 2050, "provas_realizadas": 100 }
  ],
  "atividade_hoje": {
    "usuarios_online": 342,
    "questoes_respondidas": 2145,
    "novos_cadastros": 28,
    "provas_iniciadas": 76,
    "tempo_medio_estudo_min": 102
  },
  "atividades_recentes": [
    {
      "id": "uuid",
      "tipo": "materia_criada",
      "titulo": "Nova matéria criada",
      "descricao": "Matemática Financeira",
      "criado_em": "2026-08-02T10:21:00Z"
    },
    {
      "id": "uuid",
      "tipo": "questao_editada",
      "titulo": "Questão editada",
      "descricao": "Funções – Questão #12345",
      "criado_em": "2026-08-02T09:48:00Z"
    },
    {
      "id": "uuid",
      "tipo": "usuario_suspenso",
      "titulo": "Usuário suspenso",
      "descricao": "joao.silva@email.com",
      "criado_em": "2026-08-02T09:30:00Z"
    },
    {
      "id": "uuid",
      "tipo": "prova_criada",
      "titulo": "Nova prova criada",
      "descricao": "Simulado ENEM – Julho",
      "criado_em": "2026-08-02T08:15:00Z"
    },
    {
      "id": "uuid",
      "tipo": "lista_publicada",
      "titulo": "Lista publicada",
      "descricao": "Matemática Básica – Lista 07",
      "criado_em": "2026-08-01T22:10:00Z"
    }
  ],
  "conteudo": {
    "questoes": 18452,
    "aulas": 1245,
    "topicos": 312,
    "materias": 52,
    "provas": 148,
    "listas": 362
  },
  "alertas": [
    {
      "id": "uuid",
      "tipo": "storage",
      "severidade": "alta",
      "descricao": "Storage acima de 85%",
      "detalhe": "Uso atual: 82%",
      "link": "/admin/configuracoes"
    },
    {
      "id": "uuid",
      "tipo": "provas_sem_questoes",
      "severidade": "media",
      "descricao": "8 provas sem questões",
      "link": "/admin/tipos-prova"
    },
    {
      "id": "uuid",
      "tipo": "aulas_sem_conteudo",
      "severidade": "media",
      "descricao": "5 aulas sem conteúdo",
      "link": "/admin/aulas"
    },
    {
      "id": "uuid",
      "tipo": "usuarios_denunciados",
      "severidade": "alta",
      "descricao": "3 usuários denunciados",
      "link": "/admin/usuarios"
    },
    {
      "id": "uuid",
      "tipo": "integracoes_desconectadas",
      "severidade": "media",
      "descricao": "2 integrações desconectadas",
      "link": "/admin/configuracoes"
    }
  ]
}
```

Campos de `tipo` em `atividades_recentes`: `materia_criada`, `questao_editada`, `usuario_suspenso`, `prova_criada`, `lista_publicada`.

Campos de `tipo` em `alertas`: `storage`, `provas_sem_questoes`, `aulas_sem_conteudo`, `usuarios_denunciados`, `integracoes_desconectadas`. Campo `severidade`: `alta` | `media` (define a cor do ícone no frontend). `detalhe` é opcional (texto secundário abaixo da descrição, ex.: "Uso atual: 82%"). `link` aponta para a rota do admin onde o alerta pode ser resolvido.

`crescimento` deve retornar pontos agregados conforme o `periodo` (ex.: diário para `7d`/`30d`, semanal para `90d`, mensal para `12m`).

**Status HTTP**: 200 (sucesso), 401 (não autenticado), 403 (não admin).
