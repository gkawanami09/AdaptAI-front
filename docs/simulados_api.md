# Simulados — Contrato Backend

> Este repositório é apenas o frontend (React/TS). Este documento é o contrato que o
> backend precisa implementar; nenhum código de backend foi criado a partir daqui.

Todos os endpoints exigem `Authorization: Bearer {token}` e identificam o aluno pelo JWT —
o frontend **nunca** envia `usuario_id`. Toda tentativa deve ser validada contra
`tentativa.usuario_id == usuario_id_do_token`; caso contrário, responder `404` (mesmo
padrão de segurança já usado em `/aluno/**` neste projeto, ex.: revisão de execuções em
`docs/questoes-endpoints.md`).

Reaproveita o mesmo sistema de questões/matérias/provas já usado em Questões e Banco de
Questões — não é um segundo cadastro de questões. Um simulado só define a **configuração**
(prova, duração, distribuição por matéria); as questões de cada tentativa são sorteadas
dinamicamente na hora de iniciar e persistidas junto da tentativa para permitir revisão
exata depois.

IDs sempre como string. Datas em ISO 8601. Tempo em segundos. Percentuais como `number`.

---

## 1. Listar simulados disponíveis

```
GET /aluno/simulados
```

Autenticação: obrigatória (JWT).

**Já existe neste projeto** (usado pela tela `/simulados`). Pedimos 3 campos novos e
opcionais em cada item de `catalogo`, usados na tela de detalhe do simulado antes de
iniciar (`/simulados/{slug}`):

**Response 200**
```json
{
  "resumo": { "nota_estimada": 720, "tempo_medio": "3h10", "taxa_acerto_percentual": 68 },
  "catalogo": [
    {
      "slug": "enem",
      "titulo": "ENEM",
      "descricao": "Simulado completo inspirado na estrutura do ENEM",
      "icone": "target",
      "icone_cor": "purple",
      "tag": "Completo",
      "tag_cor": "purple",
      "duracao": "5h30",
      "duracao_minutos": 330,
      "total_questoes": 90,
      "materias": ["linguagens", "ciencias-humanas", "ciencias-natureza", "matematica"]
    }
  ],
  "historico": [
    { "id": "uuid", "dia": "12/08", "titulo": "ENEM", "tempo": "5h02", "nota": 720, "acertos_percentual": 68 }
  ]
}
```

`duracao_minutos`, `total_questoes` e `materias` são opcionais — se ausentes, a tela de
detalhe simplesmente não mostra esses dados extras (já mostra `descricao`, `tag` e
`duracao` formatada, que já existiam).

`historico[].id` é o `id` da tentativa — o frontend usa para navegar direto ao resultado
(`GET /aluno/simulados/tentativas/{id}/resultado`).

**Erros:** `401` sessão expirada/token inválido.

---

## 2. Iniciar tentativa (também usado para "Refazer")

```
POST /aluno/simulados/{slug}/tentativas
```

Autenticação: obrigatória (JWT). Payload: `{}`.

Cria uma **nova tentativa**, sempre — inclusive quando já existem tentativas anteriores
(concluídas ou não) do mesmo simulado. Nenhuma tentativa anterior é sobrescrita.

Regras de negócio:
1. Validar que o simulado (`slug`) existe e está ativo.
2. Para cada matéria da configuração do simulado, sortear aleatoriamente a quantidade de
   questões definida (ex.: ENEM → Linguagens 22, Ciências Humanas 22, Ciências da Natureza
   23, Matemática 23), sem repetir questão dentro da mesma tentativa.
3. Ao gerar uma nova tentativa (refazer), preferir questões diferentes da tentativa
   anterior do mesmo aluno quando houver banco suficiente; repetição é aceitável apenas se
   não houver questões suficientes.
4. Embaralhar a ordem final das questões.
5. Persistir a seleção e a ordem (`numero`) vinculadas à tentativa, para a revisão futura
   usar exatamente esse conjunto.
6. Definir `iniciado_em = agora` e `tempo_limite_segundos` a partir da configuração do
   simulado (`duracao_minutos * 60`).
7. Status inicial: `"em_andamento"`.

**Response 200**
```json
{
  "id": "uuid",
  "simulado": { "slug": "enem", "nome": "ENEM" },
  "status": "em_andamento",
  "iniciado_em": "2026-08-17T18:00:00Z",
  "tempo_limite_segundos": 19800,
  "total_questoes": 90,
  "questao_atual": 1,
  "questoes": [
    {
      "id": "questao-uuid",
      "numero": 1,
      "materia": "matematica",
      "materia_cor": "purple",
      "enunciado": "...",
      "alternativas": [
        { "id": "a", "texto": "..." },
        { "id": "b", "texto": "..." },
        { "id": "c", "texto": "..." },
        { "id": "d", "texto": "..." },
        { "id": "e", "texto": "..." }
      ]
    }
  ]
}
```

**Nunca** incluir alternativa correta/gabarito nesta resposta. `materia_cor` é opcional —
se ausente, o frontend usa uma cor padrão para o badge da matéria.

**Erros:** `401` sessão expirada/token inválido · `404` simulado inexistente/inativo ·
`422` configuração do simulado sem questões suficientes disponíveis.

---

## 3. Recuperar tentativa em andamento

```
GET /aluno/simulados/tentativas/{id}
```

Autenticação: obrigatória (JWT). Usado quando o aluno atualiza a página ou volta para uma
tentativa que já estava em andamento — precisa devolver exatamente as mesmas questões, na
mesma ordem, incluindo o que ele já tinha marcado em cada uma.

**Response 200**
```json
{
  "id": "uuid",
  "simulado": { "slug": "enem", "nome": "ENEM" },
  "status": "em_andamento",
  "iniciado_em": "2026-08-17T18:00:00Z",
  "tempo_limite_segundos": 19800,
  "tempo_gasto_segundos": 123,
  "total_questoes": 90,
  "respondidas": 15,
  "questoes": [
    {
      "id": "questao-uuid",
      "numero": 1,
      "materia": "matematica",
      "materia_cor": "purple",
      "enunciado": "...",
      "alternativas": [{ "id": "a", "texto": "..." }],
      "alternativa_marcada": "b"
    }
  ]
}
```

Diferença em relação ao contrato original do enunciado: cada item de `questoes` inclui
`alternativa_marcada` (`string | null`) — necessário para o frontend restaurar a seleção
já feita em cada questão ao recarregar a página. Sem esse campo não é possível retomar a
tentativa de forma confiável.

Se `status` não for `"em_andamento"` (já `concluida`/`expirada`), o frontend redireciona
automaticamente para a tela de resultado — o backend pode devolver o mesmo payload (sem
gabarito) ou um `409`/redirecionamento equivalente; o frontend trata os dois casos
tentando o resultado em seguida.

**Erros:** `401` sessão expirada/token inválido · `404` tentativa inexistente ou de outro
aluno.

---

## 4. Responder questão

```
POST /aluno/simulados/tentativas/{id}/respostas
```

Autenticação: obrigatória (JWT).

**Payload**
```json
{ "questao_id": "uuid", "alternativa_id": "b" }
```

Regras:
- validar que `questao_id` pertence à tentativa;
- validar que a tentativa está `"em_andamento"` (senão, `409`);
- salvar ou atualizar a resposta daquela questão (o aluno pode trocar quantas vezes quiser
  antes de finalizar);
- nunca revelar se a alternativa está correta.

**Response 200**
```json
{ "questao_id": "uuid", "alternativa_id": "b", "salva": true }
```

**Erros:** `401` · `404` tentativa/questão não encontrada ou de outro aluno · `409`
tentativa já finalizada/expirada.

---

## 5. Finalizar tentativa

```
POST /aluno/simulados/tentativas/{id}/finalizar
```

Autenticação: obrigatória (JWT). Payload: `{}`.

O backend é a fonte de verdade do tempo: calcula `tempo_gasto_segundos` a partir de
`agora - iniciado_em` (limitado a `tempo_limite_segundos`), corrige todas as respostas
salvas, e marca `status = "concluida"` (ou `"expirada"` se `agora > iniciado_em +
tempo_limite_segundos` no momento da finalização). Idempotente: se já estiver finalizada,
devolver o resultado já calculado em vez de recalcular.

**Response 200**
```json
{
  "id": "uuid",
  "status": "concluida",
  "total_questoes": 90,
  "respondidas": 85,
  "acertos": 62,
  "erros": 23,
  "nao_respondidas": 5,
  "percentual_acerto": 72.94,
  "tempo_gasto_segundos": 18400,
  "desempenho_materias": [
    { "materia": "matematica", "total": 23, "acertos": 18, "erros": 5, "percentual_acerto": 78.26 }
  ]
}
```

`percentual_acerto` (geral e por matéria) é sobre `respondidas`, não sobre `total_questoes`.

**Expiração automática:** se o aluno nunca chamar este endpoint mas o tempo limite for
ultrapassado, a próxima chamada a `GET /aluno/simulados/tentativas/{id}` ou
`POST .../respostas` deve detectar `agora > iniciado_em + tempo_limite_segundos`, finalizar
a tentativa automaticamente como `"expirada"` e responder de acordo (nas respostas, `409`;
no GET, os dados já como tentativa finalizada). O frontend também chama `finalizar`
proativamente quando o cronômetro local chega a zero — é uma otimização de UX, não a
garantia de segurança.

**Erros:** `401` · `404` tentativa de outro aluno.

---

## 6. Resultado de uma tentativa

```
GET /aluno/simulados/tentativas/{id}/resultado
```

Autenticação: obrigatória (JWT). Devolve o resultado **persistido** (não recalcula a cada
chamada). Usado pela tela de resultado e pelo histórico.

**Response 200**
```json
{
  "id": "uuid",
  "simulado": { "slug": "enem", "nome": "ENEM" },
  "status": "concluida",
  "total_questoes": 90,
  "respondidas": 85,
  "acertos": 62,
  "erros": 23,
  "nao_respondidas": 5,
  "percentual_acerto": 72.94,
  "tempo_gasto_segundos": 18400,
  "desempenho_materias": [
    { "materia": "matematica", "total": 23, "acertos": 18, "erros": 5, "percentual_acerto": 78.26 }
  ],
  "iniciado_em": "2026-08-17T18:00:00Z",
  "finalizado_em": "2026-08-17T23:07:00Z"
}
```

Se a tentativa ainda estiver `"em_andamento"`, responder `409` (o frontend mostra um link
de volta para `/simulados/tentativas/{id}` para o aluno terminar/finalizar antes).

**Erros:** `401` · `404` tentativa de outro aluno · `409` tentativa ainda em andamento.

---

## 7. Revisão da tentativa

```
GET /aluno/simulados/tentativas/{id}/revisao
```

Autenticação: obrigatória (JWT). Retorna todas as questões da tentativa, na ordem em que
apareceram, com gabarito e resposta do aluno — só disponível depois de finalizada.

**Response 200**
```json
{
  "id": "uuid",
  "questoes": [
    {
      "numero": 1,
      "questao_id": "uuid",
      "materia": "matematica",
      "enunciado": "...",
      "alternativas": [
        { "id": "a", "texto": "2" },
        { "id": "b", "texto": "4" },
        { "id": "c", "texto": "8" },
        { "id": "d", "texto": "16" }
      ],
      "alternativa_correta": "b",
      "alternativa_marcada": "b",
      "acertou": true,
      "explicacao": "..."
    }
  ]
}
```

Questão não respondida: `"alternativa_marcada": null, "acertou": false`. `explicacao` é
opcional — se a questão não tiver explicação cadastrada, omitir o campo.

**Erros:** `401` · `404` tentativa de outro aluno · `409` tentativa ainda em andamento.

---

## 8. Histórico de tentativas

```
GET /aluno/simulados/tentativas
```

Autenticação: obrigatória (JWT). Ordenado da mais recente para a mais antiga.

**Response 200**
```json
{
  "tentativas": [
    {
      "id": "uuid",
      "simulado_slug": "enem",
      "simulado_nome": "ENEM",
      "status": "concluida",
      "data": "2026-08-17T20:00:00Z",
      "total_questoes": 90,
      "acertos": 62,
      "percentual_acerto": 68.89,
      "tempo_gasto_segundos": 18000
    }
  ]
}
```

Este endpoint ainda não tem consumidor no frontend nesta entrega (a tela `/simulados` usa
o `historico` resumido de `GET /aluno/simulados`) — documentado para uma futura tela de
"histórico completo"/"minhas tentativas".

**Erros:** `401`.

---

## Status possíveis

- `"em_andamento"` — tentativa criada, dentro do prazo, aceita respostas.
- `"concluida"` — aluno finalizou dentro do prazo (ou depois, manualmente).
- `"expirada"` — tempo limite estourou sem finalização explícita; resultado calculado
  automaticamente com o que foi respondido até o limite.
- `"cancelada"` — reservado para uso futuro (ex.: moderação); nenhum endpoint do frontend
  cria esse estado nesta entrega.

## Segurança

- Toda operação sobre uma tentativa exige `tentativa.usuario_id == usuario_id_do_token`;
  caso contrário `404` (nunca `403`, para não confirmar a existência do recurso).
- Bloquear `POST .../respostas` e `POST .../finalizar` em tentativa já `concluida`/`expirada`
  (`409`).
- `GET .../resultado` e `GET .../revisao` só liberados após a tentativa deixar de estar
  `em_andamento`.
