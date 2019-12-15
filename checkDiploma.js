const buttons = require('./buttons')
const text = require('./text')
const functions = require('./functions')
const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const getDipNumber = new Scene('getDipNumber')
const getPass = new Scene('getPass')

getDipNumber.enter(({reply}) => {
  reply(
    text.setDipNumber,
    Extra.markup(Markup.keyboard(buttons.mBack).resize())
  )
})

getDipNumber.hears(buttons.back, ctx => {
  ctx.scene.leave()
  return functions.start(ctx)
})

getDipNumber.hears(/[0-9]/, async ({ db, reply, session, scene, message }) => {
  const inDb = await db.collection('allDiplomas').findOne({dipNumber: +message.text})
  if (inDb == null) {
    await reply(text.notFound)
    return scene.enter('getDipNumber')
  }

  session.inDb = inDb
  session.dipNumber = +message.text
  return scene.enter('getPass')
})

getDipNumber.on('message', ({ scene }) => scene.enter('getDipNumber'))

// --- ---

getPass.enter(({reply}) => {
  reply(
    text.setPass,
    Extra.markup(Markup.keyboard(buttons.mBack).resize())
  )
})

getPass.hears(buttons.back, ({ scene }) => {
  return scene.enter('getDipNumber')
})

getPass.hears(/^[0-9a-zA-Z]{16}$/, async ({ session, message, reply, scene, replyWithPhoto }) => {
  if (session.inDb.pass != message.text) {
    await reply(text.wrongPass)
    return scene.enter('getPass')
  }

  const { lastName, firstName, fathersName, date, faculty, photo_id } = session.inDb

  try {
    replyWithPhoto(photo_id, { caption: 
      `${lastName} ${firstName} ${fathersName} получил диплом выпускника КНИТУ-КАИ им.Туполева на факультете ${faculty} ${date}г.`
    })
  } catch (err) {
    console.log(err)
  }
})

getPass.on('message', ({ scene }) => scene.enter('getPass'))


module.exports = { getDipNumber, getPass }