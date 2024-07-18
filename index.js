const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json());
// Configura Morgan con el formato 'tiny'
app.use(morgan('tiny'));
app.use(express.static('dist'))


let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request,response) => {
  response.json(phonebook)
})

app.post('/api/persons', (request,response) => {
  const body = request.body

  console.log(request.body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  } else
  
  if ( phonebook.some(person => person.name === body.name) ) {
    return response.status(400).json({ 
      error: 'name does exists' 
    })
  } else {

  const generateId = () => {
    const maxId = phonebook.length > 0
      ? Math.floor(Math.random()*1000)
      : 0
    return maxId
  }

  const telefono = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  phonebook = phonebook.concat(telefono)

  response.json(telefono)

}})


app.get('/api/persons/:id', (request,response) => {

  const id=Number(request.params.id)
  const phone = phonebook.find(phone => phone.id === id )
  if(phone){
    response.json(phone)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request,response) => {
  response.send(`<p>Phonebook has info for ${phonebook.length} people<br>${Date()} </p>` 
  )
})

morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})