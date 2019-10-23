const express = require("express");

const server = express();

server.use(express.json());

let reqCount = 0;

server.use((req, res, next) => {
  reqCount++;

  console.log(`${reqCount} requests so far`);

  next();
});

function checkProjectIdExists(req, res, next) {
  const project = projects.filter(item => {
    return item.id === req.params.id;
  });

  if (!project.length > 0) {
    return res.status(400).json({ error: "The project does not exists" });
  }

  next();
}

function checkProjectIdIsUnique(req, res, next) {
  const project = projects.filter(item => {
    return item.id === req.body.id;
  });

  if (project.length > 0) {
    return res.status(400).json({ error: "The id already exists" });
  }

  next();
}

const projects = [
  {
    id: "1",
    title: "First project",
    tasks: ["first task", "second task"]
  }
];

server.get("/projects", (req, res) => {
  return res.json(projects);
});

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

server.get("/projects/:id", checkProjectIdExists, (req, res) => {
  const project = projects.filter(item => {
    return item.id === req.params.id;
  });

  return res.json(project);
});

server.put("/projects/:id", checkProjectIdExists, (req, res) => {
  const index = projects.findIndex(item => {
    return item.id === req.params.id;
  });

  projects[index].title = req.body.title;

  return res.json(projects[index]);
});

server.delete("/projects/:id", checkProjectIdExists, (req, res) => {
  const index = projects.findIndex(item => {
    return item.id === req.params.id;
  });

  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectIdExists, (req, res) => {
  const index = projects.findIndex(item => {
    return item.id === req.params.id;
  });

  projects[index].tasks.push(req.body.title);

  return res.json(projects[index]);
});

server.listen(3000);
