import { facebookParaCorretores } from './facebook-para-corretores'
import { googleParaCorretores } from './google-para-corretores'
import { whatsappParaCorretores } from './whatsapp-para-corretores'
import { funilConversaoVisitas } from './funil-conversao-visitas'
import { otimizacaoAnunciosPortais } from './otimizacao-anuncios-portais'

// Export all articles for easy import
export const articles = [
    funilConversaoVisitas,
    otimizacaoAnunciosPortais,
    facebookParaCorretores,
    googleParaCorretores,
    whatsappParaCorretores
]

// Export individual articles
export {
    facebookParaCorretores,
    googleParaCorretores,
    whatsappParaCorretores,
    // estrategiaPrecificacaoImoveis,
    funilConversaoVisitas,
    otimizacaoAnunciosPortais
}