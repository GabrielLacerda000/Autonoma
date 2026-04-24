Perfeito. Esse projeto é ótimo porque força **orquestração real + agentes + filas + RAG + integrações**. Vamos transformar isso num plano de engenharia pronto pra começar a codar no Nest.

Vou estruturar como se fosse o início de um SaaS real.

---

# Visão do produto (MVP realista)

Usuário entra → informa nicho/empresa → clica em "Gerar plano de conteúdo".

Pipeline roda assíncrono e entrega:

1. Trends relevantes do nicho
2. Posts completos
3. Versões revisadas
4. Versão otimizada para SEO/social

Tudo salvo e versionado.

Sem publisher por enquanto — mas já vamos deixar arquitetura preparada.

---

# Fluxo do usuario

Formulário:

Nome da marca
Nicho
Público alvo
Tom de voz

## Exemplo

Nome: Emitfy
Nicho: SaaS financeiro para freelancers
Público: freelancers iniciantes
Tom: simples e educativo

# Conceito central: Orquestração de pipeline

Você NÃO vai chamar agentes direto via controller.

Você vai criar um **Content Generation Pipeline** assíncrono com fila.

Fluxo real:

```
POST /projects/:id/generate-content

→ cria job "content_pipeline"
→ BullMQ executa etapas sequenciais
→ cada etapa chama um agent
→ resultados salvos no banco
```

Isso já coloca o projeto em nível profissional.

---

# Arquitetura de módulos Nest

Estrutura sugerida:

```
src/
  modules/
    ai/
      agents/
      prompts/
      ai.module.ts

    content-pipeline/
      processors/
      pipeline.service.ts
      pipeline.module.ts

    projects/
    posts/
    trends/

    queue/
    database/
```

---

# Stack técnica definida

* NestJS
* Vercel AI SDK + Gemini Flash
* BullMQ (fila)
* Redis
* Drizzle ORM
* Postgres
* pgvector (memória vetorial)
* OpenSpec (docs/contratos)

Sim — isso parece startup.

---

# Banco de dados (Drizzle)

Entidades principais:

## projects

Representa o "cliente/nicho"

```
projects
- id
- name
- niche
- target_audience
- tone_of_voice
- created_at
```

---

## trends

Saída do TrendResearcher

```
trends
- id
- project_id
- title
- description
- keywords (json)
- source
- score
- created_at
```

---

## posts (múltiplas versões!)

Aqui fica interessante.

```
posts
- id
- trend_id
- version
- stage (draft | edited | seo)
- content
- created_at
```

Isso permite mostrar evolução do agente 😈

---

# Camada AI (padronização)

Crie um padrão de agente reutilizável.

## Interface base de Agent

```ts
export interface Agent<Input, Output> {
  name: string;
  execute(input: Input): Promise<Output>;
}
```

---

# Lista de agentes (MVP)

## 1️⃣ TrendResearcherAgent

Entrada:

```
niche + target audience
```

Saída:

```
Top trends da semana
keywords
ângulos de conteúdo
```

Prompt mental:

"Liste tendências recentes do nicho X com potencial de conteúdo."

Salvar → tabela trends.

---

## 2️⃣ WriterAgent

Entrada:

* trend (topic + keywords)
* tone_of_voice

Saída:

* post completo

Salvar → posts (stage=draft)

---

## 3️⃣ EditorAgent

Entrada:

* post draft

Saída:

* versão melhorada (clareza + copywriting)

Salvar → posts (stage=edited)

---

## 4️⃣ SeoOptimizerAgent

Entrada:

* post editado

Saída:

* hashtags
* keywords
* versão otimizada

Salvar → posts (stage=seo)

---

# Pipeline com BullMQ (o coração)

Fila:

```
content-pipeline
```

Processor:

```
Job: generate_content_for_project

steps:
1 → generate trends (faz fan-out de posts por trend)
2 → generate drafts
3 → edit posts
4 → optimize seo
```

Cada step é um job filho.

Isso mostra domínio de sistemas distribuídos.

---

# Estrutura do PipelineService

Pseudo-fluxo:

```ts
async runPipeline(projectId) {
  const trends = await this.trendAgent.execute(...)

  for (trend of trends) {
    const draft = await this.writer.execute(trend)
    const edited = await this.editor.execute(draft)
    const seo = await this.seo.execute(edited)
  }
}
```

Depois vamos quebrar isso em jobs independentes.

---

# Padronização de prompts (importantíssimo)

Crie pasta:

```
ai/prompts/
  trend.prompt.ts
  writer.prompt.ts
  editor.prompt.ts
  seo.prompt.ts
```

Isso mostra maturidade absurda.

---

# OpenSpec — onde entra

Você vai documentar:

* contratos de agentes
* contratos de pipeline
* schemas JSON de output
* fluxo assíncrono

Isso vira documentação profissional.

---

# Primeiros passos de implementação (ordem perfeita)

1️⃣ Setup Nest + Drizzle + Postgres
2️⃣ Setup BullMQ + Redis
3️⃣ Criar módulo AI + Gemini provider
4️⃣ Criar Agent base class
5️⃣ Implementar TrendResearcherAgent
6️⃣ Criar endpoint → dispara pipeline
7️⃣ Criar primeiro processor da fila

Comece pequeno e funcional.

---
