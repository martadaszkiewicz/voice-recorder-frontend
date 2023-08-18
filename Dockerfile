FROM node:14.9
 
WORKDIR /app
 
COPY package*.json /app/
 
RUN npm install
 
COPY . .
 
EXPOSE 3000
