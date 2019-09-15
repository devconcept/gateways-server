FROM node:boron

WORKDIR /usr/src/app

COPY package.json /usr/src/app

COPY package-lock.json /usr/src/app

RUN npm install

RUN npm install pm2 -g

COPY . /usr/src/app

EXPOSE 3100

CMD ["pm2-runtime", "start", "process.json"]

# CMD ["npm", "run", "start-prod"]
