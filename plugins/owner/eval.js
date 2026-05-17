import fs from 'fs'
import path from 'path'
import util from 'util'

const handler = async (conn, m, { text, prefix }) => {
  if (!m.isOwner) {
    return await conn.sendMessage(
      m.chat,
      { text: '❌ Owner only command.' },
      { quoted: m }
    )
  }

  const code = text?.trim()

  if (!code) {
    return await conn.sendMessage(
      m.chat,
      {
        text:
`*Cara Penggunaan*

=> <kode javascript>

*Contoh:*
${prefix}> m.reply("hello world")`
      },
      { quoted: m }
    )
  }

  try {
    let result = await eval(`(async () => { ${code} })()`)

    if (typeof result !== 'string') {
      result = util.inspect(result, { depth: 3 })
    }

    if (result !== undefined && result !== 'undefined') {
      await conn.sendMessage(
        m.chat,
        { text: String(result) },
        { quoted: m }
      )
    }

    await conn.sendMessage(
      m.chat,
      { text: '✅ Success!' },
      { quoted: m }
    )
  } catch (e) {
    await conn.sendMessage(
      m.chat,
      {
        text:
`❌ *Eval Error*

📌 *Detail :*
${e.message}`
      },
      { quoted: m }
    )
  }
}

handler.command = ['>']
handler.help = ['=> <code>']
handler.tag = ['owner']

export default handler
