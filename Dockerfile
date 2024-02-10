FROM node:20

WORKDIR /home/ayyubi/SchoolSystem/
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3002
EXPOSE 3001
CMD ["npm", "run", "dev"]
