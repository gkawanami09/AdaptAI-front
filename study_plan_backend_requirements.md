# Plano de Estudos — Backend Requirements

## Endpoint

GET /aluno/plano-estudos

Retorna todos os dados da página Plano de Estudos para o período e data de referência informados: progresso, dias da semana, tarefas do dia selecionado, visão geral da semana, prioridades e estatísticas.

--------------------------------------------
Query Params
--------------------------------------------

- `periodo` (obrigatório): `dia` | `semana` | `mes`
- `data` (obrigatório): data de referência no formato `YYYY-MM-DD`. Para `semana`, o backend deve calcular a semana (dom-sáb ou seg-dom, conforme regra de negócio) que contém essa data. Para `mes`, o mês que contém essa data.

--------------------------------------------
Payload
--------------------------------------------

Nenhum (GET).

--------------------------------------------
Response
--------------------------------------------

```json
{
  "intervalo_label": "Semana de 09 a 15 de julho · 2/11 tarefas concluídas",
  "tarefas_concluidas_total": 2,
  "tarefas_totais": 11,
  "progresso": {
    "percentual": 18,
    "label": "18% da semana"
  },
  "dias_da_semana": [
    { "label": "Dom", "data": 15, "data_iso": "2026-07-15", "tem_tarefas": false },
    { "label": "Seg", "data": 9, "data_iso": "2026-07-09", "tem_tarefas": true },
    { "label": "Ter", "data": 10, "data_iso": "2026-07-10", "tem_tarefas": true },
    { "label": "Qua", "data": 11, "data_iso": "2026-07-11", "tem_tarefas": true },
    { "label": "Qui", "data": 12, "data_iso": "2026-07-12", "tem_tarefas": true },
    { "label": "Sex", "data": 13, "data_iso": "2026-07-13", "tem_tarefas": true },
    { "label": "Sáb", "data": 14, "data_iso": "2026-07-14", "tem_tarefas": false }
  ],
  "tarefas_do_dia": [
    {
      "id": "uuid-tarefa-1",
      "icone": "📐",
      "icone_cor": "blue",
      "titulo": "Função quadrática",
      "materia": "Matemática",
      "materia_cor": "blue",
      "duracao_min": 45,
      "concluida": true,
      "progresso": 100,
      "tipo": "aula"
    },
    {
      "id": "uuid-tarefa-2",
      "icone": "✍️",
      "icone_cor": "purple",
      "titulo": "Repertório sociocultural",
      "materia": "Redação",
      "materia_cor": "purple",
      "duracao_min": 30,
      "concluida": true,
      "progresso": 100,
      "tipo": "redacao"
    }
  ],
  "visao_geral_semana": [
    {
      "dia": "Seg",
      "badges": [
        { "label": "Concluído", "color": "teal" },
        { "label": "Matemática", "color": "blue" }
      ],
      "concluidas": 2,
      "total": 2
    },
    {
      "dia": "Dom",
      "badges": [],
      "descanso_label": "Descanso",
      "concluidas": 0,
      "total": 0
    }
  ],
  "prioridades_da_semana": [
    {
      "materia": "Matemática",
      "descricao": "Abaixo da meta — 58%",
      "prioridade": "alta",
      "tom": "blue"
    },
    {
      "materia": "Química",
      "descricao": "Muitos erros recentes",
      "prioridade": "alta",
      "tom": "purple",
      "icone": "🧪"
    }
  ],
  "estatisticas": [
    { "label": "Horas planejadas", "valor": "14h", "cor": "purple" },
    { "label": "Horas concluídas", "valor": "3h15", "cor": "teal" },
    { "label": "Tarefas restantes", "valor": "9", "cor": "gold" }
  ]
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `intervalo_label`: texto pronto exibido no subtítulo da página (período + contagem de tarefas).
- `tarefas_concluidas_total` / `tarefas_totais`: totais do período usados para compor `intervalo_label`.
- `progresso.percentual` / `progresso.label`: progresso do período selecionado (dia/semana/mês).
- `dias_da_semana[]`: dias exibidos no seletor de semana; `data` é o dia do mês (número), `data_iso` a data completa usada para navegação, `tem_tarefas` indica os pontos indicadores.
- `tarefas_do_dia[]`: tarefas do dia atualmente selecionado (baseado em `data`/`periodo=dia`, ou primeiro dia com tarefas quando `periodo=semana`/`mes`). `icone` é um emoji, `icone_cor`/`materia_cor` seguem paleta de cores dos badges/ícones do design system, `tipo` referencia a origem da tarefa (aula, lista de questões, prova, redação, revisão).
- `visao_geral_semana[]`: uma linha por dia da semana; `badges` lista as matérias/situação do dia, `descanso_label` é exibido quando não há badges (dia de descanso), `concluidas`/`total` contam tarefas do dia.
- `prioridades_da_semana[]`: matérias priorizadas pelo algoritmo de recomendação (desempenho baixo, erros recentes, pouco tempo dedicado), com `tom` de cor e `icone` opcional.
- `estatisticas[]`: métricas agregadas do período (horas planejadas, horas concluídas, tarefas restantes).

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: dados retornados com sucesso.
- `400 Bad Request`: `periodo` ou `data` inválidos/ausentes.
- `401 Unauthorized`: token ausente ou inválido.

---

## Endpoint

POST /aluno/plano-estudos/reorganizar-ia

Aciona a reorganização automática (via IA) do plano de estudos do aluno, redistribuindo tarefas pendentes conforme desempenho e prioridades.

--------------------------------------------
Query Params
--------------------------------------------

Nenhum.

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
  "sucesso": true
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `sucesso`: indica se a reorganização foi aplicada. Após a chamada, o frontend recarrega `GET /aluno/plano-estudos` para refletir o novo plano.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: reorganização concluída.
- `401 Unauthorized`: token ausente ou inválido.
- `422 Unprocessable Entity`: não há tarefas suficientes para reorganizar.

---

## Endpoint

PATCH /aluno/plano-estudos/tarefas/{tarefa_id}/concluir

Marca uma tarefa do plano de estudos como concluída, atualizando progresso, XP e ofensiva do aluno.

--------------------------------------------
Query Params
--------------------------------------------

Nenhum. `tarefa_id` é parâmetro de rota.

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
  "sucesso": true
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `sucesso`: indica se a tarefa foi marcada como concluída.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: tarefa concluída com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: tarefa não encontrada para o aluno autenticado.

---

## Endpoint (preparado para futura implementação)

POST /aluno/plano-estudos/tarefas

Cria uma nova tarefa manual no plano de estudos do aluno (botão "Adicionar tarefa"). Endpoint ainda não consumido pelo frontend — chamada de service não implementada até definição do formulário de criação.

--------------------------------------------
Query Params
--------------------------------------------

Nenhum.

--------------------------------------------
Payload
--------------------------------------------

```json
{
  "materia_id": "uuid-materia",
  "titulo": "Questões ENEM: 20 questões",
  "tipo": "questoes",
  "duracao_min": 50,
  "data": "2026-07-11"
}
```

--------------------------------------------
Response
--------------------------------------------

```json
{
  "id": "uuid-tarefa-nova",
  "sucesso": true
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `materia_id`: id da matéria (tabela `materias`) vinculada à tarefa.
- `titulo`: título livre da tarefa.
- `tipo`: `aula` | `questoes` | `lista` | `prova` | `redacao` | `revisao`.
- `duracao_min`: duração estimada em minutos.
- `data`: dia em que a tarefa deve aparecer no plano.

--------------------------------------------
Status HTTP
--------------------------------------------

- `201 Created`: tarefa criada.
- `400 Bad Request`: dados inválidos.
- `401 Unauthorized`: token ausente ou inválido.

--------------------------------------------
Database
--------------------------------------------

Reutilizar tabelas existentes: `materias`, `topicos`, `aulas`, `questoes`, `listas_questoes`, `tipos_prova`, `perfis`, além das tabelas de plano de estudos, progresso, XP, ofensiva e histórico de estudos já previstas na estrutura do banco. Nenhuma tabela nova é necessária além de uma tabela de itens do plano de estudos (relacionando aluno, matéria/conteúdo de origem, data, tipo, duração e status de conclusão), caso ainda não exista.
