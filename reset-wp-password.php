<?php
/**
 * WordPress Password Reset Script for 'admin' user
 *
 * INSTRUCTIONS:
 * 1. Faça upload deste arquivo via FileZilla para a raiz do WordPress (public_html)
 * 2. Acesse: https://portal.imobiliariaipe.com.br/reset-wp-password.php
 * 3. A senha do usuário 'admin' será redefinida.
 * 4. DELETE este arquivo imediatamente após usar!
 */

// Carregar WordPress
require_once('wp-load.php');

// --- CONFIGURAÇÃO ---
$username_to_reset = 'admin';
$new_password      = 'Admin@2025!Reset';
// --- FIM DA CONFIGURAÇÃO ---

// Buscar usuário pelo login
$user = get_user_by('login', $username_to_reset);

if ($user) {
    // Usuário encontrado, resetar a senha
    wp_set_password($new_password, $user->ID);
    
    echo "<h1>✅ Senha do usuário '$username_to_reset' foi redefinida com sucesso!</h1>";
    echo "<p><strong>Usuário:</strong> $username_to_reset</p>";
    echo "<p><strong>Nova Senha:</strong> $new_password</p>";
    echo "<hr>";
    echo "<p><a href='/wp-login.php'>Ir para a página de Login</a></p>";
    echo "<hr>";
    echo "<p style='color:red;'><strong>⚠️ IMPORTANTE: DELETE este arquivo do servidor AGORA!</strong></p>";

} else {
    // Usuário não encontrado
    echo "<h1>❌ Erro: Usuário '$username_to_reset' não encontrado.</h1>";
    echo "<p>Verifique o nome de usuário no arquivo PHP e tente novamente.</p>";
    echo "<p>Se o usuário principal tiver outro nome (ex: 'jpcardozo'), edite a variável 'username_to_reset' neste script.</p>";
}
?>