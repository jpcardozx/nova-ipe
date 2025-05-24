// Arquivo de instrumentação simplificado para desenvolvimento
export function register() {
    // Verificar se as métricas estão habilitadas explicitamente
    const enableVitals = process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS === 'true';

    if (!enableVitals) {
        // Não fazer nada em desenvolvimento normal para acelerar
        console.log("Instrumentação está desativada para acelerar o desenvolvimento");
        return;
    }

    // Se explicitamente habilitado, carregamos a instrumentação
    console.log("Instrumentação ativada para coleta de métricas");
    // Aqui você poderia importar dinamicamente código de instrumentação se necessário
}
