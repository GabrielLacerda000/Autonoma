export type EditorPromptInput = {
  content: string;
  title: string;
  keywords: string[];
  toneOfVoice: string;
};

export function editorPrompt(input: EditorPromptInput): string {
  return `Você é um editor especialista em copywriting para redes sociais.

Você recebeu o seguinte rascunho de post:

---
${input.content}
---

Contexto:
- Tema: ${input.title}
- Tom de voz: ${input.toneOfVoice}
- Palavras-chave relevantes: ${input.keywords.join(', ')}

Sua tarefa:
1. Melhore a clareza e fluidez do texto sem alterar o significado
2. Fortaleça o hook (primeira frase) para prender a atenção
3. Garanta que o tom de voz seja consistente e envolvente
4. Mantenha entre 150-300 palavras
5. Preserve a estrutura: hook → desenvolvimento → CTA

Retorne apenas o post editado, sem explicações adicionais.`;
}
