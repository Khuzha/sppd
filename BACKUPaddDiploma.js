const buttons = require('./buttons')
const text = require('./text')
const WizardScene = require('telegraf/scenes/wizard')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const addDiploma = new WizardScene('addDiploma', 

  async ({ message, reply, scene, wizard }) => {
    if (message.text == buttons.back) {
      await reply('Нажмите /start')
      return scene.leave()
    }

    if (message.text == buttons.admin.add[0][0]) {
      await reply(
        text.getDipNum,
        Extra.markup(Markup.keyboard(buttons.mBack).resize())  
      )
      return wizard.next()
    }
  },

  async ({ message, reply, scene, wizard, session }) => { // get diploma's number
    if (message.text == buttons.back || +message.text == NaN) {
      return wizard.back()
    }

    await reply(
      text.getLastName,
      Extra.markup(Markup.keyboard(buttons.mBack).resize())
    )
    session.dipNum = +message.text
    return wizard.next()
  },

  async ({ message, reply, wizard, session }) => { // get last name
    if (message.text == buttons.back) {
      return wizard.back()
    }

    await reply(
      text.getFirstName,
      Extra.markup(Markup.keyboard(buttons.mBack).resize())
    )
    session.lastName = message.text
    return wizard.next()
  },

  async ({ message, reply, wizard, session }) => { // get first name
    if (message.text == buttons.back) {
      return wizard.back()
    }

    await reply(
      text.getFathersName,
      Extra.markup(Markup.keyboard(buttons.mBack).resize())
    )
    session.firstName = message.text
    return wizard.next()
  },

  async ({ message, reply, wizard, session }) => { // get fathers name
    if (message.text == buttons.back) {
      return wizard.back()
    }

    await reply(
      text.getDate,
      Extra.markup(Markup.keyboard(buttons.mBack).resize())
    )
    session.fathersName = message.text
    return wizard.next()
  },

  async ({ message, reply, wizard, session }) => { // get date of issue
    if (message.text == buttons.back) {
      return wizard.back()
    }

    await reply(
      text.getFaculty,
      Extra.markup(Markup.keyboard(buttons.admin.getFaculty).resize())
    )
    session.date = message.text
    return wizard.next()
  },
  
  async ({ message, reply, wizard, session }) => { // get fathers name
    if (message.text == buttons.back) {
      return wizard.back()
    }
    session.faculty = message.text

    await reply(
      JSON.stringify(session),
      Extra.markup(Markup.keyboard(buttons.mBack).resize())
    )
    return wizard.next()
  },

)


module.exports = addDiploma
