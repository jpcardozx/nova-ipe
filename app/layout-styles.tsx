/**
 * Layout Styles Module
 * Módulo central de gerenciamento de estilos para o layout principal
 * 
 * Este componente centraliza todas as importações CSS necessárias
 * para o layout da aplicação, garantindo que sejam carregadas na ordem correta
 * e evitando importações duplicadas.
 * 
 * @version 2.0.0
 * @date 17/05/2025
 */

// Não importamos globals.css aqui para evitar importações duplicadas
// O globals.css deve ser importado diretamente apenas no layout.tsx
import './cls-optimizations.css';

// Import critical CSS files in proper order
import '../public/critical-speed.css';
import '../public/critical.css';

// Import optimizations CSS files
import '../public/styles/mobile-optimizations.css';
import '../public/styles/loading-fix.css';
import '../public/styles/loading-states.css';
import '../public/styles/loading-effects.css';

export default function LayoutStyles() {
  return null;
}
