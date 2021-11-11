FROM node:14

COPY . /app
WORKDIR /app
ENV PORT="80"
RUN npm install

ENTRYPOINT ["npm", "run", "web"] 
