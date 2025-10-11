# Sons de Notificação

## notification.mp3

Este arquivo deve conter o som de notificação do sistema.

### Como adicionar:

1. Encontre ou crie um arquivo de som MP3 para notificações
2. Renomeie-o para `notification.mp3`
3. Coloque-o nesta pasta

### Alternativa - Usar som do sistema:

Se não quiser adicionar um arquivo de som personalizado, você pode:

1. Desabilitar o som nas configurações do useAgendaSystem:
   ```typescript
   const agenda = useAgendaSystem({
     userId: user.id,
     playSound: false, // <-- Desabilitar som
     showBrowserNotification: true
   })
   ```

2. Ou simplesmente ignorar o aviso 404 - o sistema continuará funcionando normalmente

### Recomendação de som:

- Duração: 0.5 - 1 segundo
- Formato: MP3
- Tamanho: < 50KB
- Tom: Suave e discreto

### Recursos gratuitos de sons:

- https://freesound.org/
- https://www.zapsplat.com/
- https://mixkit.co/free-sound-effects/
