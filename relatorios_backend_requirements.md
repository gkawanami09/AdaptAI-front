# Relatórios — Backend Requirements

## 1. GET /admin/relatorios

Retorna KPIs, gráficos e listas de destaque da página de Relatórios.

**Query Params**
- `periodo`: `7d` | `30d` | `90d` | `12m` (default: `30d`)

**Response 200**
```json
{
  "sucesso": true,
  "kpis": {
    "total_usuarios": 12458,
    "total_usuarios_variacao_pct": 8.4,
    "questoes_respondidas": 1284920,
    "questoes_respondidas_variacao_pct": 12.7,
    "listas_concluidas": 38421,
    "listas_concluidas_variacao_pct": 15.3,
    "taxa_media_acerto_pct": 78,
    "taxa_media_acerto_variacao_pct": 3.6
  },
  "questoes_por_dia": [
    { "data": "29/06", "total": 18450 },
    { "data": "30/06", "total": 20310 }
  ],
  "distribuicao_dificuldade": [
    { "dificuldade": "facil", "total": 312540, "percentual": 24.3 },
    { "dificuldade": "medio", "total": 741652, "percentual": 57.7 },
    { "dificuldade": "dificil", "total": 230728, "percentual": 18.0 }
  ],
  "materias_mais_estudadas": [
    { "materia_id": "uuid", "nome": "Matemática", "percentual": 32.6 }
  ],
  "tipos_prova": [
    { "tipo_prova_id": "uuid", "nome": "ENEM", "percentual": 58.4 }
  ],
  "atividades_recentes": [
    {
      "id": "uuid",
      "tipo": "prova_criada",
      "titulo": "Nova prova criada",
      "descricao": "ENEM 2024 - 2° dia",
      "criado_em": "2026-07-31T14:32:00Z"
    }
  ]
}
```

Campos de `tipo` em `atividades_recentes`: `prova_criada`, `lista_publicada`, `questao_editada`, `lista_concluida`, `questao_criada`.

**Status HTTP**: 200 (sucesso), 401 (não autenticado), 403 (não admin).

------------------------------------------------

## 2. GET /admin/relatorios/ranking-conteudos

Retorna a tabela paginada de ranking de conteúdos (matéria/aula) por desempenho.

**Query Params**
- `periodo`: `7d` | `30d` | `90d` | `12m` (default: `30d`)
- `pagina`: number (default: 1)
- `limite`: number (default: 5)

**Response 200**
```json
{
  "sucesso": true,
  "pagina": 1,
  "limite": 5,
  "total_paginas": 12,
  "total_registros": 58,
  "ranking": [
    {
      "materia_id": "uuid",
      "materia": "Matemática",
      "aula_id": "uuid",
      "aula": "Funções - 1º Grau",
      "total_questoes": 2451,
      "taxa_acerto_pct": 82,
      "tempo_medio_seg": 272,
      "total_acessos": 12845
    }
  ]
}
```

Ordenado por `total_acessos` desc (ou métrica definida pelo backend para "ranking").

**Status HTTP**: 200 (sucesso), 401 (não autenticado), 403 (não admin).

------------------------------------------------

## 3. GET /admin/relatorios/exportar

Gera e retorna o arquivo de exportação do relatório (PDF ou XLSX).

**Query Params**
- `periodo`: `7d` | `30d` | `90d` | `12m` (default: `30d`)

**Response 200**
Binário do arquivo (`Content-Type: application/pdf` ou `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`), com header `Content-Disposition: attachment; filename="relatorio-{periodo}.pdf"`.

**Status HTTP**: 200 (sucesso), 401 (não autenticado), 403 (não admin), 500 (falha ao gerar arquivo).
