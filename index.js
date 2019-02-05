const express = require('express');
const app = express(); // app is technically your server

const Sequelize = require('sequelize')

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString, {define: { timestamps: false }})

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const port = 4000
app.listen(port, () => `Listening on port ${port}`);


const House = sequelize.define('house', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  size: Sequelize.INTEGER,
  price: Sequelize.INTEGER
}, {
  tableName: 'houses'
});

House.sync() // this creates the houses table in your database when your app starts

app.get('/houses', function (req, res, next) {
  House.findAll()
    .then(houses => {
      res.json({
        houses: houses
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err
      })
    })
})

app.get('/houses/:id', function (req, res, next) {
  const id = req.params.id
  House.findById(id)
    .then(house => {
      res.json({
        message: `Read house ${id}`,
        house
      })
    })
    .catch(err => {
      res.status(500).json({
        message: 'House not found',
        error: err
      })
    })
})


app.post('/houses', function (req, res) {
  House
    .create(req.body)
    .then(house => res.status(201).json(house))
    .catch(err => {
      res.status(500).json({
        message: 'Internal Server Error',
        error: err
      })
    })
});

// House.create({
//   title: 'Multi Million Estate',
//   description: 'This was build by a super-duper rich programmer',
//   size: 1235,
//   price: 98400000
// }).then(house => console.log(`The house is now created. The ID = ${house.id}`))

// app.put('/houses/:id', function (req, res) {
//   const id = req.params.id
//   res.json({ message: `Update house ${id}` })
// })

// // retrieve a house via findById, then...
// house.update({
//   title: 'Super Duper Million Dollar Mainson'
// }).then(house => console.log(`The house with ID ${house.id} is now updated`, house))

app.put('/houses/:id', function (req, res) {
  const id = req.params.id

  House
    .findById(id)
    .then(house => {
      house.update({
          title: 'Super Duper Million Dollar Mainson',
        })
        .then(house => res.status(200).json({
          message: `The house with ID ${id} is now updated`
        }))
        .catch(err => {
          res.status(500).json({
            message: 'House not found',
            error: err
          })
        })
    })
})

app.delete('/houses/:id', function (req, res) {
  const id = req.params.id

  House
    .findById(id)
    .then(house => {
      house.destroy({})
        .then(house => res.status(200).json({
          message: `The house with ID ${id} was removed`
        }))
        .catch(err => {
          res.status(500).json({
            message: 'House not found',
            error: err
          })
        })
    })
})