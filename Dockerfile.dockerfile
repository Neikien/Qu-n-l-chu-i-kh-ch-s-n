FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY backend ./backend
COPY frontend ./frontend
RUN cd frontend && npm run build
RUN npm install -g pm2
RUN echo '{"apps":[{"name":"frontend","script":"cd frontend && npm start","env":{"PORT":"3000"}},{"name":"backend","script":"cd backend && node server.js","env":{"PORT":"5000"}}]}' > ecosystem.config.json
EXPOSE 3000
EXPOSE 5000
CMD ["pm2-runtime", "ecosystem.config.json"]