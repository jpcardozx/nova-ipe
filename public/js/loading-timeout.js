/**
 * Script para forçar encerramento de estado de carregamento
 * Este script é um último recurso para garantir visibilidade da página
 */

// Executa logo que possível
setTimeout(function forceLoadingComplete() {
    // Força remoção do estado de carregamento
    document.documentElement.removeAttribute('data-loading-state');
    document.documentElement.setAttribute('data-loaded', 'true');

    // Força visibilidade completa
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
    document.body.classList.add('force-visible');

    console.log('[loading-timeout] Forcing loading state removal after timeout');

    // Força remover qualquer spinner ou indicador de carregamento
    const possibleLoaders = [
        '.loading-indicator',
        '.spinner',
        '.loader',
        '[data-loading]',
        '[data-state="loading"]',
        '.loading'
    ];

    possibleLoaders.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.style.display = 'none';
        });
    });

    // Verifica se a página está estritamente vazia e insere mensagem de backup
    const mainContent = document.querySelector('main');
    const body = document.body;

    // Se o conteúdo principal estiver vazio mas a página existir
    if (mainContent && mainContent.innerHTML.trim() === '') {
        // Cria conteúdo de fallback
        const fallbackContent = document.createElement('div');
        fallbackContent.className = 'emergency-fallback-content';
        fallbackContent.innerHTML = `
      <div style="padding: 2rem; text-align: center; max-width: 500px; margin: 3rem auto;">
        <h2 style="margin-bottom: 1rem;">Nova Ipê Imobiliária</h2>
        <p>Estamos carregando o conteúdo. Por favor, aguarde um momento.</p>
        <p>Se o problema persistir, tente <a href="javascript:location.reload()" style="color: #e5a453; text-decoration: underline;">recarregar a página</a>.</p>
      </div>
    `;
        mainContent.appendChild(fallbackContent);
    }

    // Se por algum motivo todo o body estiver vazio (caso extremo)
    if (body.innerHTML.trim() === '') {
        body.innerHTML = `
      <div style="padding: 2rem; text-align: center; max-width: 500px; margin: 3rem auto;">
        <h1>Nova Ipê Imobiliária</h1>
        <p>Houve um problema ao carregar a página. Por favor, tente novamente.</p>
        <a href="/" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background-color: #e5a453; color: white; text-decoration: none; border-radius: 0.25rem;">Voltar à página inicial</a>
      </div>
    `;
    }
}, 5000);  // 5 segundos máximos
