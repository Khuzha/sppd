const data = require('./data')
const buttons = require('./buttons')
const functions = require('./functions')
const mongo = require('mongodb').MongoClient
const Telegraf = require('telegraf')
const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const bot = new Telegraf(data.token)

mongo.connect(data.mongoLink, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.log(err)
  }

  bot.context.db = client.db('sppd')
  bot.startPolling()
})

const { whatToDo, setFaculty, setDipNumber, setPass, setDate, 
  setLastName, setFirstName, setFathersName, setPic } = require('./addDiploma')
const { getDipNumber, getPass } = require('./checkDiploma')

const stage = new Stage()
stage.register(
  whatToDo, setFaculty, setDipNumber, setPass, setDate, setLastName, 
  setFirstName, setFathersName, setPic, getDipNumber, getPass
)

bot.use(session())
bot.use(stage.middleware())

bot.start(ctx => functions.start(ctx))

bot.hears(buttons.admin.start[1][0], ctx => {
  if (!data.admins.includes(ctx.from.id)) {
    return
  }

  ctx.scene.enter('whatToDo')
}) 

bot.hears(buttons.user.start[0][0], ctx => {
  ctx.scene.enter('getDipNumber')
})

bot.on('message', ctx => functions.start(ctx))