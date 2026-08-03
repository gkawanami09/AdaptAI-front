# Dashboard do Aluno — Backend Requirements

## Endpoint

GET /aluno/dashboard

Retorna todos os dados necessários para a tela inicial (dashboard) do aluno logado: resumo de estudos, evolução semanal, desempenho por matéria, plano de estudos do dia e alertas.

--------------------------------------------
Query Params
--------------------------------------------

Nenhum. Todos os dados são relativos ao usuário autenticado (identificado via token) e à semana corrente.

--------------------------------------------
Payload
--------------------------------------------

Nenhum (GET).

--------------------------------------------
Response
--------------------------------------------

```json
{
  "resumo": {
    "tempo_estudado_min": 750,
    "tarefas_concluidas": 6,
    "tarefas_totais": 9,
    "xp_semana": 1240,
    "ofensiva_dias": 8
  },
  "evolucao_semanal": [
    { "dia_semana": "Seg", "percentual": 65 },
    { "dia_semana": "Ter", "percentual": 55 },
    { "dia_semana": "Qua", "percentual": 90 },
    { "dia_semana": "Qui", "percentual": 60 },
    { "dia_semana": "Sex", "percentual": 85 },
    { "dia_semana": "Sáb", "percentual": 35 },
    { "dia_semana": "Dom", "percentual": 15 }
  ],
  "desempenho_por_materia": [
    { "materia_id": "uuid-biologia", "materia": "Biologia", "percentual": 78, "cor": "teal" },
    { "materia_id": "uuid-portugues", "materia": "Português", "percentual": 72, "cor": "gold" },
    { "materia_id": "uuid-historia", "materia": "História", "percentual": 65, "cor": "red" },
    { "materia_id": "uuid-matematica", "materia": "Matemática", "percentual": 58, "cor": "blue" }
  ],
  "plano_do_dia": [
    {
      "id": "uuid-item-1",
      "icone": "✍️",
      "materia": "Redação",
      "materia_cor": "purple",
      "status": "concluido",
      "titulo": "Repertório sociocultural",
      "duracao_min": 30,
      "progresso": 100
    },
    {
      "id": "uuid-item-2",
      "icone": "🌿",
      "materia": "Biologia",
      "materia_cor": "green",
      "status": "em-andamento",
      "titulo": "Ecologia",
      "duracao_min": 40,
      "progresso": 55
    },
    {
      "id": "uuid-item-3",
      "icone": "📐",
      "materia": "Matemática",
      "materia_cor": "blue",
      "status": "nao-iniciado",
      "titulo": "Questões ENEM: 20 questões",
      "duracao_min": 50
    }
  ],
  "alertas": [
    {
      "id": "uuid-alerta-1",
      "titulo": "Evolução semanal",
      "mensagem": "Matemática e Química estão abaixo da meta. Revise esta semana!"
    }
  ]
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

**resumo**
- `tempo_estudado_min`: soma de minutos estudados pelo aluno na semana corrente (histórico de estudos).
- `tarefas_concluidas` / `tarefas_totais`: itens do plano de estudos da semana concluídos vs. total.
- `xp_semana`: XP acumulado pelo aluno na semana corrente.
- `ofensiva_dias`: dias consecutivos de estudo (tabela de ofensiva).

**evolucao_semanal**
- `dia_semana`: abreviação do dia (Seg, Ter, Qua...).
- `percentual`: percentual de aproveitamento/atividade do aluno naquele dia (0-100).

**desempenho_por_materia**
- `materia_id`: id da matéria (tabela `materias`).
- `materia`: nome da matéria.
- `percentual`: percentual de acerto/desempenho do aluno na matéria (0-100).
- `cor`: cor de exibição da barra de progresso (`teal`, `gold`, `red`, `blue`, `green`, `purple`).

**plano_do_dia**
- `id`: id do item de plano de estudos (tabela de progresso/plano do usuário).
- `icone`: emoji representando a matéria/atividade.
- `materia`: nome da matéria vinculada ao item.
- `materia_cor`: cor de destaque (`purple`, `green`, `blue`).
- `status`: `concluido` | `em-andamento` | `nao-iniciado`.
- `titulo`: título da atividade (aula, lista de questões, etc).
- `duracao_min`: duração estimada em minutos.
- `progresso`: percentual de progresso (0-100), presente apenas quando o item foi iniciado.

**alertas**
- `id`: id do alerta.
- `titulo`: título curto do alerta.
- `mensagem`: mensagem descritiva do alerta (ex.: desempenho abaixo da meta).

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: dados retornados com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: perfil de aluno não encontrado para o usuário autenticado.
