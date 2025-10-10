#!/bin/bash
# Discovery completo dos recursos LocaWeb

sshpass -p "Imobiliaria@46933003" ssh -p 22 -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa -o StrictHostKeyChecking=no imobiliariaipe1@187.45.193.173 << 'ENDSSH'

echo "=== ESTRUTURA DE DIRETÓRIOS ==="
ls -lh ~/

echo -e "\n=== SITES ENCONTRADOS ==="
find ~ -maxdepth 2 -type d -name "public_html" -o -name "www" -o -name "blog*"

echo -e "\n=== CONFIGS WORDPRESS ==="
find ~ -name "wp-config.php" 2>/dev/null

echo -e "\n=== TAMANHO TOTAL ==="
du -sh ~/*

echo -e "\n=== ESPAÇO USADO ==="
df -h ~/

echo -e "\n=== BASES DE DADOS (se tiver mysql local) ==="
mysql -V 2>/dev/null || echo "MySQL client não encontrado localmente"

ENDSSH
