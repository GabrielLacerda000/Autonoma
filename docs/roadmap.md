# Roadmap — MVP Funcional

Objetivo: pipeline de conteúdo 100% funcional com IA real, do trigger ao post salvo no banco.

---

## Estado atual

A estrutura de filas e handlers existe, mas todos os agentes são stubs.
O fan-out por trend já está implementado em `generate-trends.handler.ts`.

```
generate_content_for_project   ← job de conclusão (pai)
  └── generate_trends           ← roda primeiro; cria fan-out por trend
        └── post_pipeline_N
              └── optimize_seo  ← 3°
                    └── edit    ← 2°
                          └── draft ← 1°
```

---

## Etapas para o MVP funcional

### 1. TrendResearcherAgent

**Arquivo:** `src/modules/ai/agents/trend-researcher.agent.ts`

- Recebe: `{ niche, targetAudience }` do projeto
- Chama Gemini Flash via Vercel AI SDK com `generateObject`
- Retorna: array de trends com `{ title, description, keywords[], score }`
- Salva cada trend na tabela `trends` (via Drizzle)

**Handler a atualizar:** `src/content-pipeline/handlers/generate-trends.handler.ts`
- Buscar o projeto no banco pelo `projectId`
- Chamar `TrendResearcherAgent.execute()`
- Salvar trends e usar os IDs reais no fan-out de posts

---

### 2. WriterAgent

**Arquivo:** `src/modules/ai/agents/writer.agent.ts`

- Recebe: `{ trend, toneOfVoice }`
- Chama Gemini Flash com `generateText`
- Retorna: post completo (texto)
- Salva na tabela `posts` com `stage = 'draft'`

**Handler a atualizar:** `src/content-pipeline/handlers/generate-draft-post.handler.ts`

---

### 3. EditorAgent

**Arquivo:** `src/modules/ai/agents/editor.agent.ts`

- Recebe: `{ postId, content }`
- Busca o draft no banco
- Melhora clareza e copywriting via Gemini Flash
- Salva nova versão na tabela `posts` com `stage = 'edited'`

**Handler a atualizar:** `src/content-pipeline/handlers/edit-post.handler.ts`

---

### 4. SeoOptimizerAgent

**Arquivo:** `src/modules/ai/agents/seo-optimizer.agent.ts`

- Recebe: `{ postId, content }`
- Gera hashtags, keywords e versão otimizada para redes sociais
- Salva na tabela `posts` com `stage = 'seo'`

**Handler a atualizar:** `src/content-pipeline/handlers/optimize-post-seo.handler.ts`

---

## Interface base dos agentes

```ts
// src/modules/ai/agents/agent.interface.ts
export interface Agent<Input, Output> {
  name: string;
  execute(input: Input): Promise<Output>;
}
```

---

## Prompts (criar junto com cada agente)

```
src/modules/ai/prompts/
  trend.prompt.ts
  writer.prompt.ts
  editor.prompt.ts
  seo.prompt.ts
```

---

## Ordem de implementação

1. [ ] Interface base `Agent<Input, Output>`
2. [ ] `TrendResearcherAgent` + prompt + salvar `trends` no banco
3. [ ] Atualizar `generate-trends.handler.ts` para usar dados reais do projeto
4. [ ] `WriterAgent` + prompt + salvar `posts` (draft)
5. [ ] `EditorAgent` + prompt + salvar `posts` (edited)
6. [ ] `SeoOptimizerAgent` + prompt + salvar `posts` (seo)
7. [ ] Teste end-to-end: `POST /pipeline/:projectId` → banco populado

---

## Arquivos de referência

| Arquivo | Papel |
|---|---|
| `src/db/schema.ts` | Tabelas `trends` e `posts` já definidas |
| `src/content-pipeline/handlers/generate-trends.handler.ts` | Fan-out por trend |
| `src/content-pipeline/handlers/generate-draft-post.handler.ts` | Stub a implementar |
| `src/content-pipeline/handlers/edit-post.handler.ts` | Stub a implementar |
| `src/content-pipeline/handlers/optimize-post-seo.handler.ts` | Stub a implementar |
| `src/queue/queue.service.ts` | `startContentPipeline()` — entrada do flow |
