export function trendPrompt(niche: string, targetAudience: string): string {
  return `Você é um especialista em marketing de conteúdo digital.

Seu objetivo é identificar tendências atuais de conteúdo para um nicho específico.

Nicho: ${niche}
Público-alvo: ${targetAudience}

Liste exatamente 3 tendências de conteúdo relevantes para este nicho e público.

Para cada tendência, forneça:
- title: título curto e direto da tendência (máximo 10 palavras)
- description: descrição detalhada explicando a tendência e por que é relevante (2-3 frases)
- keywords: lista de 4 a 6 palavras-chave relacionadas
- score: pontuação de potencial de engajamento de 1 a 10 (10 = maior potencial)

Foque em tendências reais e atuais que gerem alto engajamento.`;
}
