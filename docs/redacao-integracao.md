# Integração — Redação

Documentação da integração do fluxo de Redação com o backend, seguindo o mesmo
padrão arquitetural usado nas demais páginas do aluno (Aulas, Questões, Simulados).

## Fluxo de navegação

```
/redacao
  → Lista de temas de redação (RedacaoTemas)
  → Usuário clica em um tema
/redacao/:slug
  → Página de escrita (Redacao), busca o tema pelo slug
  → Usuário escreve o texto (estado local no WritingCard)
  → Usuário clica em "Enviar para correção"
  → POST /aluno/redacao/temas/:slug/envios (slug do tema + texto da redação)
  → Backend responde com o envio criado (id, status "pendente")
/redacao/:slug/processando/:envioId
  → Página de processamento (RedacaoProcessando)
  → Tela de loading com frases rotativas enquanto a IA corrige
  → Faz polling em GET /aluno/redacao/envios/:envioId a cada 4s
  → status "concluida" → navega para /redacao/:slug/resultado/:envioId
  → status "erro" → navega de volta para /redacao/:slug
/redacao/:slug/resultado/:envioId
  → Página de resultado (RedacaoResultado)
  → Busca a correção completa via GET /aluno/redacao/envios/:envioId
  → Exibe nota, competências, insights, pontos de melhoria, repertórios e resumo da Ada
```

A navegação entre as páginas usa exclusivamente o **slug** do tema. O `id` nunca
é usado para montar rotas.

## Endpoints

Área: `/aluno` (não usa `/admin`).

### 1. Listar temas de redação

```
GET /aluno/redacao/temas
```

**Response 200**

```json
{
  "temas": [
    {
      "id": "string",
      "slug": "string",
      "titulo": "string",
      "tag": "string",
      "tag_cor": "purple | green | blue | teal | gold | red | gray",
      "descricao": "string"
    }
  ]
}
```

**Mapeamento Backend → Frontend**

| Campo backend       | Uso no frontend                          |
| -------------------- | ----------------------------------------- |
| `titulo`             | `TemaRedacaoCard.title`                   |
| `tag` / `tag_cor`    | `TemaRedacaoCard.tag` / `TemaRedacaoCard.tagColor` |
| `descricao`          | `TemaRedacaoCard.description`             |
| `slug`               | usado para `navigate("/redacao/" + slug)` |

### 2. Buscar detalhes de um tema

```
GET /aluno/redacao/temas/:slug
```

**Response 200**

```json
{
  "slug": "string",
  "titulo": "string",
  "tag": "string",
  "tag_cor": "purple | green | blue | teal | gold | red | gray",
  "descricao": "string",
  "competencias": [
    {
      "number": 1,
      "title": "string",
      "description": "string",
      "color": "blue | teal | purple | gold | red"
    }
  ],
  "repertorios": ["string"],
  "dica_ada": "string | null"
}
```

**Status HTTP**

- `200` — tema encontrado
- `404` — slug inexistente (tratado como erro de carregamento na página)
- `401` — sessão expirada (tratado pelo `requestAuthJson`, mensagem "Sessao expirada. Faca login novamente.")

**Mapeamento Backend → Frontend**

| Campo backend   | Uso no frontend            |
| --------------- | --------------------------- |
| `tag`           | `ThemeCard.tag`             |
| `titulo`        | `ThemeCard.title`           |
| `descricao`     | `ThemeCard.description`     |
| `competencias`  | `CompetenciasCard.items`    |
| `repertorios`   | `RepertorioCard.items`      |
| `dica_ada`      | `DicaCard.message`          |

### 3. Enviar redação para correção

```
POST /aluno/redacao/temas/:slug/envios
```

**Payload**

```json
{
  "texto": "string"
}
```

**Response 200/201**

```json
{
  "id": "string",
  "slug": "string",
  "status": "pendente",
  "texto": "string"
}
```

> **TODO (futura IA de correção):** quando o motor de correção estiver disponível,
> o backend passará a retornar também a nota e o feedback da IA neste mesmo
> endpoint (ou em um endpoint de consulta do envio, ex.: `GET /aluno/redacao/envios/:id`).
> Nenhuma lógica de correção é implementada no frontend até lá — o service
> `enviarRedacao` apenas envia `slug` + `texto` e devolve a resposta crua do backend.

### 4. Consultar resultado da correção

```
GET /aluno/redacao/envios/:envioId
```

**Response 200**

```json
{
  "id": "string",
  "slug": "string",
  "status": "pendente | processando | concluida | erro",
  "notaTotal": 0,
  "notaMaxima": 1000,
  "statusLabel": "string",
  "mensagemMotivacional": "string",
  "competencias": [
    {
      "number": 1,
      "title": "string",
      "description": "string",
      "color": "blue | teal | purple | gold | red",
      "nota": 0,
      "notaMaxima": 200
    }
  ],
  "insights": [
    { "id": "string", "icon": "string", "iconColor": "purple | green | blue | gold | red", "title": "string", "description": "string" }
  ],
  "pontosMelhoria": [
    { "id": "string", "icon": "string", "iconColor": "purple | green | blue | gold | red", "title": "string", "description": "string" }
  ],
  "repertoriosSugeridos": [
    { "id": "string", "nome": "string", "descricao": "string" }
  ],
  "resumoAda": "string"
}
```

> **TODO (futura IA de correção):** este endpoint ainda não existe no backend.
> Enquanto `status` não for `"concluida"`, a tela de processamento
> (`RedacaoProcessando`) deve permanecer exibindo o loading — via polling
> periódico ou assinatura websocket (ver TODOs em `src/services/redacaoCorrecao.ts`,
> `src/hooks/useRedacaoCorrecao.ts` e `src/pages/Redacao/RedacaoProcessando.tsx`).
> Quando `status` chegar a `"concluida"`, o frontend deve navegar para
> `/redacao/:slug/resultado/:envioId`, que consome esta mesma resposta.

**Status HTTP**

- `200` — envio encontrado (mesmo que ainda `pendente`/`processando`)
- `404` — `envioId` inexistente
- `401` — sessão expirada / token inválido

**Mapeamento Backend → Frontend**

| Campo backend           | Uso no frontend                              |
| ------------------------ | --------------------------------------------- |
| `notaTotal`/`notaMaxima` | `ScoreHeaderCard` (nota em destaque)          |
| `statusLabel`/`mensagemMotivacional` | `ScoreHeaderCard` (coluna de status) |
| `competencias`           | `CompetenciaScoreCard` (grid de competências) |
| `insights`               | `InsightCard` (seção "Principais insights")   |
| `pontosMelhoria`         | `InsightCard` (seção "Pontos de melhoria")    |
| `repertoriosSugeridos`   | `RepertorioSugeridoCard`                      |
| `resumoAda`              | Card final "Resumo da Ada"                    |

## Interfaces (types)

Ver `src/types/redacaoTemas.ts` (listagem e detalhe do tema),
`src/types/redacao.ts` (envio da redação) e `src/types/redacaoCorrecao.ts`
(resultado da correção pela IA).

## Services

Ver `src/services/redacaoTemas.ts` (`getRedacaoTemas`, `getRedacaoTema`),
`src/services/redacao.ts` (`enviarRedacao`) e `src/services/redacaoCorrecao.ts`
(`getRedacaoCorrecao`, com TODO de polling/websocket). Toda comunicação HTTP
fica centralizada nesses arquivos — nenhuma página faz `fetch` diretamente.

## Hooks

- `src/hooks/useRedacaoCorrecao.ts` — busca o resultado da correção por `envioId`,
  seguindo o mesmo padrão de `useConquistas` (estados `dados`/`carregando`/`erro`
  + função `recarregar`).

## Páginas

- `src/pages/Redacao/RedacaoTemas.tsx` — listagem de temas (`/redacao`)
- `src/pages/Redacao/redacao.tsx` — escrita da redação (`/redacao/:slug`)
- `src/pages/Redacao/RedacaoProcessando.tsx` — loading da correção (`/redacao/:slug/processando/:envioId`)
- `src/pages/Redacao/RedacaoResultado.tsx` — resultado da correção (`/redacao/:slug/resultado/:envioId`)

## Rotas

```tsx
<Route path="/redacao" element={<RedacaoTemas />} />
<Route path="/redacao/:slug" element={<Redacao />} />
<Route path="/redacao/:slug/processando/:envioId" element={<RedacaoProcessando />} />
<Route path="/redacao/:slug/resultado/:envioId" element={<RedacaoResultado />} />
```

## Loading e erro

Segue o mesmo padrão de `Aulas`/`AulaVisualizacao`: estados locais
`carregando`/`erro` por página, com botão "Tentar novamente" que rechama o
service. Erros não quebram a página — o último estado válido é mantido até
uma nova tentativa bem-sucedida.
