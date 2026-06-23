FROM node:20-alpine

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta padrão do Vite internamente
EXPOSE 5173

# Roda o servidor de desenvolvimento e aceita conexões externas (0.0.0.0)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
