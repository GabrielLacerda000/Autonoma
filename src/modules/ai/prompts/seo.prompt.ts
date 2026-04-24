export type SeoPromptInput = {
  content: string;
  title: string;
  keywords: string[];
};

export function seoPrompt(input: SeoPromptInput): string {
  return `Você é um especialista em SEO e marketing de conteúdo para redes sociais.

Você recebeu o seguinte post editado:

---
${input.content}
---

Contexto:
- Tema: ${input.title}
- Palavras-chave: ${input.keywords.join(', ')}

Sua tarefa:
1. Revise o texto para maximizar o alcance orgânico nas redes sociais
2. Incorpore as palavras-chave de forma natural ao longo do texto
3. Adicione entre 5 e 10 hashtags relevantes ao final do post
4. Mantenha entre 150-300 palavras (sem contar as hashtags)
5. Preserve a estrutura: hook → desenvolvimento → CTA → hashtags

Retorne apenas o post otimizado com as hashtags ao final, sem explicações adicionais.`;
}
