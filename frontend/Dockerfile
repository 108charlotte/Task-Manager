FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
# need to change this to yarn
RUN npm install

COPY . .

# default port from npm run dev
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]