Excelente dúvida — porque aqui você tocou num ponto de **modelagem de produto**, não só backend. E é exatamente aqui que muitos projetos de IA ficam errados sem perceber.

Você percebeu o “cheiro estranho”:

> “Por que estou enviando só projectId se quem usa o sistema vai informar nicho e empresa?”

Isso mostra que você começou a enxergar a separação entre **input do usuário** vs **execução do pipeline**.

Vamos organizar mentalmente.

---

# A pergunta central

Quem é o `projectId` na vida real?

Ele NÃO é um dado técnico.
Ele é um **container de contexto do cliente**.

Seu banco já está dizendo isso claramente 👇

## Tabela projects

```ts
projects {
  id
  name
  niche
  targetAudience
  toneOfVoice
}
```

Isso aqui é literalmente o **briefing do cliente**.

Você sem querer modelou um mini-Notion interno.

---

# Como isso funciona no produto real

Imagine o fluxo do usuário:

## 1️⃣ Usuário cria um projeto (briefing)

Tela do app:

Formulário:

* Nome da marca
* Nicho
* Público alvo
* Tom de voz

Exemplo:

```
Nome: Emitfy
Nicho: SaaS financeiro para freelancers
Público: freelancers iniciantes
Tom: simples e educativo
```

Quando ele salva → você cria um registro em `projects`.

👉 Aqui nasce o `projectId`.

---

## 2️⃣ Usuário clica: "Gerar conteúdo"

Agora sim o pipeline entra.

O frontend chama:

```
POST /pipeline/{projectId}
```

O backend NÃO precisa pedir nicho, tom etc.

Porque o pipeline busca sozinho no banco.

Isso é MUITO importante arquiteturalmente.

---

# Por que isso é MUITO melhor do que enviar nicho na requisição?

Se você pedisse:

```
POST /pipeline
{
  niche: "...",
  tone: "...",
  audience: "..."
}
```

Você teria vários problemas sérios:

### ❌ Problema 1 — Reprodutibilidade

Você não conseguiria reproduzir o job depois.

Com projectId você consegue:

* reprocessar
* auditar
* debugar
* refazer pipeline antigo

Sem isso → você perde histórico.

---

### ❌ Problema 2 — Versionamento de conteúdo

Hoje você já tem isso preparado sem perceber:

Tabela posts:

```ts
version
stage
```

Você pode gerar conteúdo várias vezes para o mesmo projeto.

Sem `projectId` isso vira caos.

---

### ❌ Problema 3 — Custos de IA

Isso é gigante.

Se amanhã você quiser:

* limitar geração por projeto
* cobrar por projeto
* medir tokens por cliente

Tudo depende do `projectId`.

Ele é sua unidade de billing futura.

---

# Agora vem a parte que talvez esteja te confundindo

Você pensou:

> então o pipeline não recebe dados?

Recebe sim — mas de forma indireta.

Fluxo real do primeiro job:

## find_trends_for_project

Ele recebe:

```ts
{ projectId }
```

Primeira coisa que ele deveria fazer (e ainda não fizemos):

```ts
const project = await db.query.projects.findFirst({
  where: eq(projects.id, projectId)
})
```

E agora você tem:

```ts
project.niche
project.targetAudience
project.toneOfVoice
project.name
```

Agora a IA recebe o briefing completo.

Ou seja:

O pipeline é **stateful via banco**, não via request.

Isso é padrão de sistemas assíncronos.

---

# O papel de cada tabela no pipeline

Agora tudo começa a encaixar:

## projects → briefing

Contexto permanente do cliente.

## trends → pesquisa de mercado

Output do agente Trend Researcher.

Ligado ao projeto:

```
project → many trends
```

## posts → produção de conteúdo

Output dos agentes Writer / Editor / SEO.

Ligado à trend:

```
trend → many post versions
```

Você criou uma cadeia hierárquica:

```
Project
  └── Trends
        └── Posts (draft → edited → seo)
```

Isso é MUITO poderoso para analytics depois.

---

# Insight importante (nível produto)

Você está construindo um sistema de IA **orientado a contexto persistente**, não prompts soltos.

Isso muda tudo:

Sem projects → você tem um chatbot.
Com projects → você tem um SaaS.

Grande diferença.

---

# O ajuste que precisamos fazer agora

O primeiro job precisa começar assim:

```ts
async findTrends(projectId: string) {
  const project = await this.getProject(projectId)

  const briefing = `
  Brand: ${project.name}
  Niche: ${project.niche}
  Audience: ${project.targetAudience}
  Tone: ${project.toneOfVoice}
  `
}
```

Ou seja: a IA sempre trabalha com briefing completo.

---
