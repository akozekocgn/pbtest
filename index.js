require('dotenv').config()

const server = require('./server')
const port = process.env.PORT || process.env.APPLICATION_PORT || 5000

//start server
server.listen(port, (req, res) => {
  console.log( `server listening on port: ${port}`)
  // db.sequelize.sync({ logging: console.log })
  // .then(() => {
  //   console.log('Database has started')
  // })
  // .catch(err => console.error('Database error', err))
})
