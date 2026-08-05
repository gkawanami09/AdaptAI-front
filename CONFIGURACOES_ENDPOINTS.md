# Configurações (Aluno) — Backend Requirements

> Tipos e service ficam em `src/types/configuracoesAluno.ts` e `src/services/configuracoesAluno.ts`, distintos do módulo admin já existente (`configuracoes.ts`), que usa o prefixo `/admin/configuracoes`.

## Endpoints utilizados

- `GET /aluno/configuracoes`
- `PATCH /aluno/configuracoes/notificacoes`
- `PATCH /aluno/configuracoes/metas`
- `PATCH /aluno/configuracoes/aparencia`

--------------------------------------------

## Endpoint

GET /aluno/configuracoes

Retorna todos os dados da página Configurações: perfil do aluno, preferências de notificação, metas de estudo e tema de aparência salvo.

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
  "perfil": {
    "nome": "Guilherme Santos",
    "email": "guilherme@email.com",
    "nivel": 12,
    "xp_total": 4820,
    "escola": "Colégio Estadual SP",
    "ano_enem": "2025"
  },
  "notificacoes": [
    {
      "id": "lembrete-diario",
      "label": "Lembrete diário de estudos",
      "description": "Receba um lembrete no horário que você definir",
      "enabled": true
    },
    {
      "id": "alerta-ofensiva",
      "label": "Alerta de ofensiva",
      "description": "Aviso quando sua ofensiva estiver em risco",
      "enabled": true
    }
  ],
  "metas": {
    "objetivo": "Passar em universidade pública",
    "tempo_estudo": "2h",
    "nota_alvo": "700"
  },
  "aparencia": {
    "tema": "sistema"
  }
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type ConfiguracoesAlunoPerfil = {
  nome: string
  email: string
  nivel: number
  xp_total: number
  escola: string
  ano_enem: string
}

type ConfiguracoesAlunoNotificacao = {
  id: string
  label: string
  description: string
  enabled: boolean
}

type ConfiguracoesAlunoMetas = {
  objetivo: string
  tempo_estudo: string
  nota_alvo: string
}

type ConfiguracoesAlunoTema = 'claro' | 'escuro' | 'sistema'

type ConfiguracoesAlunoAparencia = {
  tema: ConfiguracoesAlunoTema
}

type GetConfiguracoesAlunoResponse = {
  perfil: ConfiguracoesAlunoPerfil
  notificacoes: ConfiguracoesAlunoNotificacao[]
  metas: ConfiguracoesAlunoMetas
  aparencia: ConfiguracoesAlunoAparencia
}
```

--------------------------------------------
Mapeamento Backend → Frontend
--------------------------------------------

- `perfil.nome` → `ProfileCard.name`
- `perfil.email` → `ProfileCard.email`
- `perfil.nivel` → `ProfileCard.level`
- `perfil.xp_total` → `ProfileCard.xp`
- `perfil.escola` → `ProfileCard.escola`
- `perfil.ano_enem` → `ProfileCard.anoEnem`
- `notificacoes[]` → `NotificationSettingsCard.items` (mesmo shape: `id`, `label`, `description`, `enabled`)
- `metas.objetivo` → `StudyGoalsCard.objetivo`
- `metas.tempo_estudo` → `StudyGoalsCard.tempoEstudo`
- `metas.nota_alvo` → `StudyGoalsCard.notaAlvo`
- `aparencia.tema` → valor inicial do hook `useTheme` (`ThemePreference`)

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `perfil`, `notificacoes`, `metas`, `aparencia`.
- Em `perfil`: `nome`, `email`, `nivel`, `xp_total`, `escola`, `ano_enem`.
- Em cada notificação: `id`, `label`, `description`, `enabled`.
- Em `metas`: `objetivo`, `tempo_estudo`, `nota_alvo`.
- Em `aparencia`: `tema`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: dados retornados com sucesso.
- `401 Unauthorized`: token ausente ou inválido.

---

## Endpoint

PATCH /aluno/configuracoes/notificacoes

Atualiza o estado (ativado/desativado) de uma preferência de notificação específica.

--------------------------------------------
Payload
--------------------------------------------

```json
{
  "id": "lembrete-diario",
  "enabled": false
}
```

--------------------------------------------
Response
--------------------------------------------

```json
{
  "id": "lembrete-diario",
  "enabled": false
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type PatchNotificacaoAlunoPayload = {
  id: string
  enabled: boolean
}

type PatchNotificacaoAlunoResponse = {
  id: string
  enabled: boolean
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `id`: identificador da notificação alterada (mesmo `id` retornado em `notificacoes[]` do GET).
- `enabled`: novo estado do switch.
- Após sucesso, o frontend atualiza apenas o item correspondente no estado local (sem novo GET). Em caso de falha, o switch retorna ao estado anterior.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `id`, `enabled`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: preferência atualizada com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `404 Not Found`: `id` de notificação inexistente.
- `422 Unprocessable Entity`: payload inválido.

---

## Endpoint

PATCH /aluno/configuracoes/metas

Atualiza uma ou mais metas de estudo do aluno.

--------------------------------------------
Payload
--------------------------------------------

```json
{
  "objetivo": "Passar em universidade pública",
  "tempo_estudo": "2h",
  "nota_alvo": "700"
}
```

--------------------------------------------
Response
--------------------------------------------

```json
{
  "objetivo": "Passar em universidade pública",
  "tempo_estudo": "2h",
  "nota_alvo": "700"
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type PatchMetasAlunoPayload = {
  objetivo?: string
  tempo_estudo?: string
  nota_alvo?: string
}

type PatchMetasAlunoResponse = ConfiguracoesAlunoMetas
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- Todos os campos são opcionais no payload (envia-se apenas o que foi alterado).
- Response retorna sempre o objeto completo de metas já atualizado.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

Nenhum no payload (ao menos um campo deve ser enviado). Response sempre retorna `objetivo`, `tempo_estudo`, `nota_alvo`.

--------------------------------------------
Campos opcionais
--------------------------------------------

- Payload: `objetivo`, `tempo_estudo`, `nota_alvo` (todos opcionais individualmente).

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: metas atualizadas com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `422 Unprocessable Entity`: payload inválido.

--------------------------------------------
Observação de implementação
--------------------------------------------

`StudyGoalsCard` (componente visual, não alterado) não expõe um callback `onSave`/`onSubmit` para o componente pai — o formulário é encapsulado internamente e apenas loga no console. Sem alterar o componente, não é possível conectar esse PATCH à ação de salvar do formulário nesta integração. O service `patchMetas` foi criado e documentado para uso imediato quando o componente for ajustado para expor esse callback.

---

## Endpoint

PATCH /aluno/configuracoes/aparencia

Persiste no backend o tema de aparência escolhido pelo aluno (claro, escuro ou sistema).

--------------------------------------------
Payload
--------------------------------------------

```json
{
  "tema": "escuro"
}
```

--------------------------------------------
Response
--------------------------------------------

```json
{
  "tema": "escuro"
}
```

--------------------------------------------
Interfaces TypeScript
--------------------------------------------

```ts
type PatchAparenciaAlunoPayload = {
  tema: ConfiguracoesAlunoTema
}

type PatchAparenciaAlunoResponse = {
  tema: ConfiguracoesAlunoTema
}
```

--------------------------------------------
Descrição dos campos
--------------------------------------------

- `tema`: um dos valores `claro`, `escuro`, `sistema` — mesmos valores usados pelo hook `useTheme` (`ThemePreference`).
- O tema continua sendo aplicado localmente via `useTheme` (persistido em `localStorage`); o PATCH apenas sincroniza a preferência com o backend. Em caso de falha, o frontend reverte para o tema anterior.

--------------------------------------------
Campos obrigatórios
--------------------------------------------

- `tema`.

--------------------------------------------
Campos opcionais
--------------------------------------------

Nenhum.

--------------------------------------------
Status HTTP
--------------------------------------------

- `200 OK`: tema salvo com sucesso.
- `401 Unauthorized`: token ausente ou inválido.
- `422 Unprocessable Entity`: valor de `tema` inválido.

--------------------------------------------
Observações gerais
--------------------------------------------

- Nenhum endpoint de `/admin` é utilizado nesta tela.
- `handlePrivacyAction` (aba Privacidade) permanece sem integração — nenhum endpoint fictício foi criado; o handler apenas registra a ação (`console.log`) para futura implementação (troca de senha, exportação de dados, exclusão de conta).
- `ProfileCard` também não expõe callback de salvamento; o GET popula os valores iniciais exibidos, mas o PATCH de perfil não está no escopo desta tela (não solicitado) e nenhum endpoint de perfil foi criado.
