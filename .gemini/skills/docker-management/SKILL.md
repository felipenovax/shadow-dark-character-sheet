---
name: shadow-dark-docker-management
description: Instruções e comandos para gerenciar o contêiner Docker do projeto Shadow Dark. Acione esta skill quando o usuário pedir para subir, parar, reconstruir ou investigar logs do contêiner Docker local.
---

# Gerenciamento do Contêiner Docker (Shadow Dark)

A aplicação foi containerizada utilizando Docker. O servidor de desenvolvimento Vite roda internamente na porta `5173` e é exposto na porta especificada pelo usuário (padrão atual: `1234`).

## Comandos Principais

### Construir a Imagem
Para compilar ou atualizar a imagem Docker (ex: após mudar dependências):
```bash
docker build -t shadow-dark-sheet .
```

### Subir o Contêiner
Para criar e iniciar o contêiner em modo detached (`-d`) mapeando para a porta 1234 e sincronizando os arquivos locais para hot-reload:
```bash
docker run -d -p 1234:5173 -v "$PWD":/app -v /app/node_modules --env-file .env.local --name shadow-dark-app shadow-dark-sheet
```
*Observação: O `-v "$PWD":/app` garante que as edições no código reflitam instantaneamente na aplicação sem precisar fazer rebuild da imagem toda vez.*
*Observação: O projeto necessita de variáveis do Supabase. O Vite conseguirá puxar as variáveis se o arquivo `.env.local` for passado no comando (`--env-file .env.local`), mas em desenvolvimento com volumes montados, o arquivo em si já é suficiente.*

### Parar o Contêiner
```bash
docker stop shadow-dark-app
```

### Remover o Contêiner
```bash
docker rm shadow-dark-app
```

### Visualizar os Logs
Para verificar possíveis erros durante o runtime (ex: problemas no Vite):
```bash
docker logs -f shadow-dark-app
```

### Acesso Remoto (Exec)
Para abrir uma sessão de shell e debugar dentro do contêiner:
```bash
docker exec -it shadow-dark-app sh
```

### Fluxo de Reconstrução Completa (Clean Restart)
Em caso de quebras extremas ou atualização de pacotes no `package.json`:
```bash
docker stop shadow-dark-app
docker rm shadow-dark-app
docker build -t shadow-dark-sheet .
docker run -d -p 1234:5173 --name shadow-dark-app shadow-dark-sheet
```
