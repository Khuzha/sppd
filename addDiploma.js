const buttons = require('./buttons')
const text = require('./text')
const functions = require('./functions')
const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const whatToDo = new Scene('whatToDo')
const setFaculty = new Scene('setFaculty')
const setDipNumber = new Scene('setDipNumber')
const setPass = new Scene('setPass')
const setDate = new Scene('setDate')
const setLastName = new Scene('setLastName')
const setFirstName = new Scene('setFirstName')
const setFathersName = new Scene('setFathersName')
const setPic = new Scene('setPic')

whatToDo.enter(({reply}) => {
  reply(
    text.whatToDo,
    Extra.markup(Markup.keyboard(buttons.admin.add).resize())
  )
})

whatToDo.hears(buttons.back, ctx => {
  ctx.scene.leave()
  return functions.start(ctx)
})

whatToDo.hears(buttons.admin.add[0][0], async ({ reply, scene }) => {
  return scene.enter('setFaculty')
})

whatToDo.on('message', ({ scene }) => scene.enter('whatToDo'))

// --- ---

setFaculty.enter(({ reply }) => {
  reply(
    text.setFaculty,
    Extra.markup(Markup.keyboard(buttons.admin.setFaculty).resize())
  )
})

setFaculty.hears(buttons.back, ({ scene }) => {
  return scene.enter('whatToDo')
})

setFaculty.on('text', ({ message, scene, session }) => {
  session.faculty = message.text
  return scene.enter('setDipNumber')
})

setFaculty.on('message', ({ scene }) => scene.enter('setFaculty'))

// ---  ---

setDipNumber.enter(({ reply }) => {
  reply(
    text.setDipNumber,
    Extra.markup(Markup.keyboard(buttons.mBack).resize())
  )
})

setDipNumber.hears(buttons.back, ({ scene }) => {
  return scene.enter('setFaculty')
})

setDipNumber.hears(/[0-9]/, async ({ message, scene, session, db, reply }) => {
  const inDb = await db.collection('allDiplomas').findOne({dipNumber: +message.text})
  if (inDb != null) {
    await reply(text.alreadyExist)
    return scene.enter('setDipNumber')
  }

  session.dipNumber = +message.text
  return scene.enter('setDate')
})

setDipNumber.on('message', ({ scene }) => scene.enter('setDipNumber'))

// --- --- 

setDate.enter(({ reply }) => {
  reply(
    text.setDate,
    Extra.markup(Markup.keyboard(buttons.mBack).resize())
  )
})

setDate.hears(buttons.back, ({ scene }) => {
  return scene.enter('setDipNumber')
})

setDate.hears(/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/, ({ message, scene, session }) => {
  session.date = message.text
  return scene.enter('setPass')
})

setDate.on('message', ({ scene }) => scene.enter('setDate'))

// ---  ---

setPass.enter(({ reply }) => {
  reply(
    text.setPass,
    Extra.markup(Markup.keyboard(buttons.mBack).resize())
  )
})

setPass.hears(buttons.back, ({ scene }) => {
  return scene.enter('setDate')
})

setPass.hears(/^[0-9a-zA-Z]{16}$/, ({ message, scene, session }) => {
  session.pass = message.text
  return scene.enter('setLastName')
})

setPass.on('message', ({ scene }) => scene.enter('setDipNumber'))

// --- ---

setLastName.enter(({ reply }) => {
  reply(
    text.setLastName,
    Extra.markup(Markup.keyboard(buttons.mBack).resize())
  )
})

setLastName.hears(buttons.back, ({ scene }) => {
  return scene.enter('setDate')
})

setLastName.on('text', ({ message, scene, session }) => {
  session.lastName = message.text
  return scene.enter('setFirstName')
})

setLastName.on('message', ({ scene }) => scene.enter('setLastName'))

// --- ---

setFirstName.enter(({ reply }) => {
  reply(
    text.setFirstName,
    Extra.markup(Markup.keyboard(buttons.mBack).resize())
  )
})

setFirstName.hears(buttons.back, ({ scene }) => {
  return scene.enter('setLastName')
})

setFirstName.on('text', ({ message, scene, session }) => {
  session.firstName = message.text
  return scene.enter('setFathersName')
})

setFirstName.on('message', ({ scene }) => scene.enter('setFirstName'))

// --- ---

setFathersName.enter(({ reply }) => {
  reply(
    text.setFathersName,
    Extra.markup(Markup.keyboard(buttons.mBack).resize())
  )
})

setFathersName.hears(buttons.back, ({ scene }) => {
  return scene.enter('setFirstName')
})

setFathersName.on('text', async ({ message, scene, session, }) => {
  session.fathersName = message.text
  return scene.enter('setPic')
})

setFathersName.on('message', ({ scene }) => scene.enter('setFathersName'))

// --- --- 

setPic.enter(({ reply }) => {
  reply(
    text.setPic,
    Extra.markup(Markup.keyboard(buttons.mBack).resize())
  )
})

setPic.hears(buttons.back, ({ scene }) => {
  return scene.enter('setFathersName')
})

setPic.on('photo', async ({ message, scene, session, reply, db }) => {  
  try {  
    await db.collection('allDiplomas').updateOne(
      { dipNumber: session.dipNumber },
      { $set: { faculty: session.faculty, date: session.date, pass: session.pass, 
        lastName: session.lastName, firstName: session.firstName,
         fathersName: session.fathersName, photo_id: message.photo[message.photo.length - 1].file_id } },
      { new: true, upsert: true }
    )
    
    await reply(text.ready)
    scene.enter('whatToDo')
  } catch (err) {
    console.log(err)
  }
})

setFathersName.on('message', ({ scene }) => scene.enter('setFathersName'))


module.exports = {
  whatToDo, setFaculty, setDipNumber, setDate, setPass, setLastName, setFirstName, setFathersName, setPic
}