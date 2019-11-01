const express = require('express');
const server = express();
const projectsRouter = require('./projectRouter');
const actionsRouter = require('./actionRouter');

server.use(express.json());
server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
    res.send(`<h1>Web API Sprint Challenge</h1>`)
  });

module.exports = server;