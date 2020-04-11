const express = require("express");
const { uuid } = require("uuidv4")
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next){
  const { method, url } = request

  const logLabel = `[${method.toUpperCase()} ${url}]`

  console.time(logLabel)
  
  next()
  
  console.timeEnd(logLabel)
}

app.use(logRequests)

app.get("/repositories", (request, response) => {
  console.log(`Listing all repositories.`)

  if(repositories.length === 0){
    console.log(`No repository created.`)
  }
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body

  const repository = { id: uuid(), title, url, techs, likes: 0}

  console.log(`Creating a new repository...`)

  repositories.push(repository)

  console.log(`New repository created.`)

  return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0){
    console.log(`Can't edit this repository.\nRepository not found.`)
    return response.status(400).json({ error: 'Repository not found'})
  }

  console.log(`Editing the repository with id: '${id}'...`)

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository

  console.log(`Repository edited!`)
  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
    
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0){
    console.log(`Can't delete this repository.\nRepository not found.`)
    return response.status(400).json({ error: 'Repository not found'})
  }

  console.log(`Deleting the repository with id: '${id}'...`)
  
  repositories.splice(repositoryIndex, 1)

  console.log(`Repository deleted!`)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if(repositoryIndex < 0){
    console.log(`Can't like this repository.\nRepository not found.`)
    return response.status(400).json({ error: 'Repository not found'})
  }

  console.log(`Giving like to the repository with id: '${id}'...`)

  repositories[repositoryIndex].likes++

  console.log(`Repository liked!`)
  
  return response.status(200).json(repositories[repositoryIndex])
});

module.exports = app;
