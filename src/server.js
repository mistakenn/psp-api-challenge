const app = require('./app')
const moment = require('moment')

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`[server] started at ${moment()}`)
  console.log(`[server] listening on port ${port}`)
})
