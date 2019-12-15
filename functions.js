const data = require('./data')
const text = require('./text')
const buttons = require('./buttons')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const start = (ctx) => {
  if (data.admins.includes(ctx.from.id)) {
    ctx.reply(
      text.hello,
      Extra.markup(Markup.keyboard(buttons.admin.start).resize())
    )
  } else {
    ctx.reply(
      text.hello,
      Extra.markup(Markup.keyboard(buttons.user.start).resize())
    )
  }
}

module.exports = { start }