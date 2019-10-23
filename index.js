const express = require("express");

const server = express();

server.use(express.json());

/**
 * Variável responsável por armazenar os projetos.
 */
const projects = [];

/**
 * Midleware que dá log de quantas requisições a aplicação recebeu.
 */
server.use((req, res, next) => {
  console.count("Número de requisições");

  next();
});

/**
 * Midleware que checa se o projeto existe.
 */
function checkProjectIdExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "The project does not exists" });
  }

  next();
}

/**
 * Midleware que checa se o id informado no cadastro já existe.
 */
function checkProjectIdIsUnique(req, res, next) {
  const { id } = req.body;

  const project = projects.find(p => p.id == id);

  if (project) {
    return res.status(400).json({ error: "The id already exists" });
  }

  next();
}

/**
 * Retorna todos os projetos
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * Request body: id, title
 * Cadastra um novo projeto.
 */
server.post("/projects", checkProjectIdIsUnique, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

/**
 * Route params: id
 * Retorna o projeto associado ao id presente nos parâmetros da rota.
 */
server.get("/projects/:id", checkProjectIdExists, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  return res.json(project);
});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put("/projects/:id", checkProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete("/projects/:id", checkProjectIdExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();
});

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id.
 */
server.post("/projects/:id/tasks", checkProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
