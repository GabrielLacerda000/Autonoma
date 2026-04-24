export function writerPrompt(
  title: string,
  description: string,
  keywords: string[],
  toneOfVoice: string,
): string {
  return `Você é um redator especialista em conteúdo para redes sociais.

Escreva um post completo sobre a seguinte tendência:

Título: ${title}
Descrição: ${description}
Palavras-chave: ${keywords.join(', ')}
Tom de voz: ${toneOfVoice}

O post deve ter:
- Um hook forte na primeira linha para prender a atenção
- Um corpo com informações relevantes e valor para o leitor
- Uma chamada para ação (CTA) ao final
- Uso natural das palavras-chave ao longo do texto
- Entre 150 e 300 palavras

Escreva apenas o texto do post, sem título, sem explicações adicionais.`;
}
