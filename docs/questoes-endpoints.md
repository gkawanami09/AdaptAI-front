# Questões — Contratos Backend

Todos os endpoints exigem o header `Authorization: Bearer {token}`. O aluno é identificado
pelo JWT — o frontend **nunca** envia `usuario_id`. Um aluno nunca pode acessar uma execução
de outro aluno — se `execucao_id` não pertencer ao usuário autenticado, responder `404`
(mesmo padrão de segurança já usado nos demais endpoints `/aluno/**`).

Esta funcionalidade reaproveita os prefixos já existentes e documentados no projeto
(`/aluno/banco-questoes` para listagem/filtros/execuções, `/aluno/questoes/{slug}` para
resolver uma lista) em vez de criar um novo domínio `/aluno/questoes/planos` — o conceito de
"plano" do enunciado é o que o backend já expõe como **lista de questões**, e "execução" é
uma tentativa daquela lista.

---

## 1. Listar planos (listas de questões)

```
GET /aluno/banco-questoes/listas
```

Autenticação: obrigatória (JWT).

**Query params** (todos opcionais, repetíveis quando array)
| Nome | Tipo | Descrição |
|---|---|---|
| `vestibulares` | string[] | Filtra por vestibular |
| `dificuldades` | string[] | Filtra por dificuldade |
| `materias` | string[] | Filtra por matéria |
| `apenas_favoritas` | `"true"` | Apenas listas com questão favoritada |

**Response 200**
```json
{
  "total": 42,
  "listas": [
    {
      "id": "uuid",
      "slug": "enem-2023-linguagens",
      "icone": "book",
      "icone_cor": "purple",
      "titulo": "Matemática — Álgebra",
      "descricao": "Questões de álgebra do ENEM",
      "dificuldade": "Médio",
      "dificuldade_cor": "gold",
      "vestibular": "ENEM",
      "status": "concluido",
      "questoes_totais": 20,
      "questoes_concluidas": 20,
      "questoes_corretas": 15,
      "progresso_cor": "purple",
      "ultima_execucao_id": "uuid"
    }
  ]
}
```

Campo novo nesta revisão: `ultima_execucao_id` (opcional) — id da execução mais recente do
aluno naquela lista. É o que o frontend usa para abrir o botão **"Revisar"**. Sem ele, o
card não mostra o botão de revisão (mesmo que `status` seja `concluido`).

`status`:
- `"nao_iniciado"` — aluno nunca respondeu nenhuma questão da lista → card mostra **[Começar]**
- `"em_andamento"` — aluno respondeu parte das questões da execução atual → card mostra **[Continuar]**
- `"concluido"` — aluno respondeu todas as questões da execução atual → card mostra **[Revisar] [Refazer]**

`questoes_corretas` — corretas **dentre as já respondidas** (não dentre `questoes_totais`).
Se omitido, o frontend não mostra percentual de acerto. Quando presente, o frontend calcula
`questoes_corretas / questoes_concluidas * 100` (arredondado).

**Erros:** `401` sessão expirada/token inválido.

---

## 2. Criar/refazer execução

```
POST /aluno/banco-questoes/listas/{lista_id}/refazer
```

Autenticação: obrigatória (JWT).

Cria uma **nova execução/tentativa**, limpa, da lista para o aluno logado — sem apagar
execuções/respostas anteriores. Todas as questões da nova execução começam como não
respondidas; nenhuma resposta de execuções anteriores é reaproveitada ou exibida.

Equivale ao endpoint `POST /aluno/questoes/planos/{plano_id}/execucoes` do enunciado —
mesmo contrato, reaproveitando o prefixo já usado neste projeto.

**Path params**
| Nome | Tipo | Descrição |
|---|---|---|
| `lista_id` | string | ID da lista a ser refeita |

**Payload:** nenhum.

**Response 200**
```json
{
  "execucao_id": "uuid",
  "lista_id": "uuid",
  "slug": "enem-2023-linguagens",
  "status": "em_andamento"
}
```

Após a resposta, o frontend navega para `/questoes/{slug}` (fallback para o `slug`/`id` já
conhecido no card caso venha nulo) para iniciar a nova execução do zero.

**Erros:** `401` sessão expirada/token inválido · `404` lista inexistente.

---

## 3. Revisar uma execução específica

```
GET /aluno/banco-questoes/execucoes/{execucao_id}/revisao
```

Autenticação: obrigatória (JWT).

Retorna as questões **já respondidas naquela execução** (não cria execução nova, apenas
consulta). Deve funcionar mesmo muito tempo depois da execução ter sido concluída.

**Path params**
| Nome | Tipo | Descrição |
|---|---|---|
| `execucao_id` | string | ID da execução a revisar |

**Query params** (todos opcionais — filtram as questões daquela execução, nunca de outras)
| Nome | Tipo | Descrição |
|---|---|---|
| `status` | `"acertada" \| "errada"` | Omitido = todas |
| `materia` | string | Slug da matéria |
| `assunto` | string | Slug do assunto/sub-tópico |
| `dificuldade` | string | Nível da questão |
| `pagina` | number | Página atual, padrão `1` |
| `limite` | number | Itens por página, padrão `20` |

Exemplo:
```
GET /aluno/banco-questoes/execucoes/{execucao_id}/revisao?status=errada&materia=matematica&assunto=algebra&pagina=1&limite=20
```

**Response 200**
```json
{
  "execucao": {
    "id": "uuid",
    "lista_id": "uuid",
    "lista_titulo": "Matemática — Álgebra",
    "status": "concluido",
    "questoes_totais": 20,
    "respondidas": 20,
    "acertadas": 15,
    "percentual_acerto": 75
  },
  "questoes": [
    {
      "id": "uuid",
      "enunciado": "Qual é o resultado de x² = 16?",
      "materia": "Matemática",
      "materia_cor": "purple",
      "assunto": "Álgebra",
      "dificuldade": "Médio",
      "dificuldade_cor": "gold",
      "alternativas": [
        { "letra": "A", "texto": "2" },
        { "letra": "B", "texto": "4" },
        { "letra": "C", "texto": "8" },
        { "letra": "D", "texto": "16" }
      ],
      "resposta_aluno": "B",
      "resposta_correta": "B",
      "acertou": true
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 20,
    "total_paginas": 1
  }
}
```

`resposta_aluno` e `resposta_correta` são **obrigatórios** (o frontend monta a revisão a
partir dos dois, destacando a alternativa correta mesmo quando o aluno errou).
`assunto`, `dificuldade`/`dificuldade_cor` e `percentual_acerto` são opcionais — se
ausentes, o frontend simplesmente não exibe aquele dado.

**Erros:** `401` sessão expirada/token inválido · `404` execução inexistente ou pertencente
a outro aluno.

---

## 4. Filtros disponíveis

```
GET /aluno/banco-questoes/filtros
```

**Já existe.** Usado tanto na listagem de planos quanto nas telas de revisão (Assunto é
usado pela primeira vez nesta revisão do contrato).

**Response 200**
```json
{
  "vestibulares": [{ "value": "enem", "label": "ENEM" }],
  "dificuldades": [{ "value": "dificil", "label": "Difícil" }],
  "materias": [{ "value": "matematica", "label": "Matemática" }],
  "assuntos": [{ "value": "algebra", "label": "Álgebra" }]
}
```

---

## 5. Questões corretas/erradas (todas as execuções, com paginação)

```
GET /aluno/banco-questoes/questoes-respondidas
```

**Já existe** (contrato anterior, sem alterações) — usado pelos atalhos "Questões corretas"
/"Questões erradas" da tela principal, que olham o histórico completo do aluno em todas as
listas, diferente da seção 3 que olha apenas uma execução específica.

---

## 6. Abrir/resolver uma lista

```
GET /aluno/questoes/{slug}
PATCH /aluno/questoes/{slug}/questoes/{questao_id}
```

**Já existem, reutilizados sem alterações.** É a resposta de `PATCH .../questoes/{id}` que
deve alimentar o histórico consumido pelas seções 3 e 5.
