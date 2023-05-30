FROM node:18.16.0

RUN mkdir frontend
WORKDIR frontend

COPY . .

RUN npm ci --ignore-scripts

EXPOSE 5173

CMD ["npm", "run", "dev"]
