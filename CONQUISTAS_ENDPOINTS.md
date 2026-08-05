# Conquistas — Backend Requirements

## Endpoint

GET /aluno/conquistas

Retorna todos os dados da página Conquistas em uma única chamada: subtítulo, resumo (ofensiva, XP, nível, medalhas), progresso de nível, conquistas desbloqueadas/bloqueadas e missões diárias/semanais.

--------------------------------------------
Query Params
--------------------------------------------

Nenhum.

--------------------------------------------
Payload
--------------------------------------------

Nenhum (GET).

--------------------------------------------
Response
--------------------------------------------

```json
{
  "subtitulo": "4 de 9 conquistas encontradas",
  "ofensiva_dias": 8,
  "xp_total": 4820,
  "nivel_atual": 12,
  "xp_proximo_nivel": 5000,
  "total_medalhas": 4,
  "conquistas_desbloqueadas": [
    { "icone": "🏆", "titulo": "Primeira Semana", "descricao": "Complete 7 dias de estudo", "raridade": "comum", "xp": 100 },
    { "icone": "💯", "titulo": "100 Questões", "descricao": "Resolva 100 questões", "raridade": "incomum", "xp": 200 }
  ],
  "conquistas_bloqueadas": [
    { "icone": "🛡️", "titulo": "Matemática Sem Medo", "descricao": "Acerte 80% em Matemática", "raridade": "epico" },
    { "icone": "🔍", "titulo": "Revisor de Erros", "descricao": "Revise 50 questões erradas", "raridade": "incomum" }
  ],
  "missoes_diarias": [
    { "label": "Resolver 10 questões", "xp": 50, "completed": true },
    { "label": "Estudar 1h30", "xp": 80, "completed": false }
  ],
  "missoes_semanais": [
    { "label": "Completar plano semanal", "xp": 200, "current": 5, "target": 7 },
    { "label": "Resolver 50 questões", "xp": 150, "current": 32, "target": 50 }
  ]
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type ConquistaRaridade = 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'

type ConquistaDesbloqueada = {
  icone: string
  titulo: string
  descricao: string
  raridade: ConquistaRaridade
  xp: number
}

type ConquistaBloqueada = {
  icone: string
  titulo: string
  descricao: string
  raridade: ConquistaRaridade
}

type MissaoDiaria = {
  label: string
  xp: number
  completed: boolean
}

type MissaoSemanal = {
  label: string
  xp: number
  current: number
  target: number
}

type GetConquistasResponse = {
  subtitulo: string
  ofensiva_dias: number
  xp_total: number
  nivel_atual: number
  xp_proximo_nivel: number
  total_medalhas: number
  conquistas_desbloqueadas: ConquistaDesbloqueada[]
  conquistas_bloqueadas: ConquistaBloqueada[]
  missoes_diarias: MissaoDiaria[]
  missoes_semanais: MissaoSemanal[]
}
```

--------------------------------------------
Mapeamento Backend → Frontend
--------------------------------------------

- `subtitulo` → `TitlePage.subtitle`.
- `ofensiva_dias` → card de resumo 🔥, `value` = `` `${ofensiva_dias} dias` ``, `label` = "Ofensiva".
- `xp_total` → card de resumo ⚡, `value` = `xp_total` formatado (`toLocaleString('pt-BR')`), `label` = "XP total"; também usado em `LevelProgressCard.currentXp`.
- `nivel_atual` → card de resumo 🏆, `value` = `` `Nível ${nivel_atual}` ``, `label` = "Nível atual"; também usado em `LevelProgressCard.level`.
- `total_medalhas` → card de resumo 🥇, `value` = `total_medalhas`, `label` = "Medalhas".
- `xp_proximo_nivel` → `LevelProgressCard.targetXp`.
- `conquistas_desbloqueadas[].icone/titulo/descricao/raridade/xp` → `AchievementCard.icon/title/description/rarity/xp`, `locked` não informado.
- `conquistas_bloqueadas[].icone/titulo/descricao/raridade` → `AchievementCard.icon/title/description/rarity`, `locked={true}`, `xp` não informado.
- `missoes_diarias[].label/xp/completed` → `DailyMissionsCard.missions[].label/xp/completed`.
- `missoes_semanais[].label/xp/current/target` → `WeeklyMissionsCard.missions[].label/xp/current/target`.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `subtitulo`, `ofensiva_dias`, `xp_total`, `nivel_atual`, `xp_proximo_nivel`, `total_medalhas`, `conquistas_desbloqueadas`, `conquistas_bloqueadas`, `missoes_diarias`, `missoes_semanais`.
- Em cada conquista desbloqueada: `icone`, `titulo`, `descricao`, `raridade`, `xp`.
- Em cada conquista bloqueada: `icone`, `titulo`, `descricao`, `raridade`.
- Em cada missão diária: `label`, `xp`, `completed`.
- Em cada missão semanal: `label`, `xp`, `current`, `target`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum. Os arrays (`conquistas_desbloqueadas`, `conquistas_bloqueadas`, `missoes_diarias`, `missoes_semanais`) podem vir vazios — o frontend renderiza os componentes normalmente sem quebrar a interface.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: dados retornados com sucesso.
- `401 Unauthorized`: token ausente ou inválido.

--------------------------------------------
Observações
--------------------------------------------

- `conquistas_bloqueadas` nunca deve conter `xp` — o campo é omitido pelo backend, não enviado como `null`.
- A página realiza apenas uma chamada (`GET /aluno/conquistas`); nenhum outro endpoint é usado por esta tela.
- `raridade` deve ser sempre um dos 5 valores suportados pelo `AchievementCard` (`comum`, `incomum`, `raro`, `epico`, `lendario`); qualquer outro valor não é mapeado pelo componente.
