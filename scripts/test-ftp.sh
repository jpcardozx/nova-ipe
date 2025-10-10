#!/bin/bash
# Teste simples de FTP com credenciais corretas

cat > /tmp/ftp-test.sh << 'SCRIPT'
ftp -inv 187.45.193.173 << 'FTPEOF'
user imobiliariaipe1 Imobiliaria@46933003
pwd
ls
bye
FTPEOF
SCRIPT

bash /tmp/ftp-test.sh
