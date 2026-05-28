import axios from 'axios'

let handler = async (conn, m, { text, command, prefix }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, {
        text: `❌ *Contoh Penggunaan*:\n${prefix + command} https://google.com`
      }, { quoted: m })
    }

    const url = text.startsWith('http') ? text : `https://${text}`
    const ssUrl = `https://image.thum.io/get/width/1200/noanimate/${url}`

    await conn.sendMessage(m.chat, {
      image: { url: ssUrl },
      caption: `╭━━━〔 *SS WEB* 〕━━━⬣
┃
┃ 🔗 *URL:* ${url}
┃
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, {
      text: `❌ *Error*: Gagal mengambil screenshot website.`
    }, { quoted: m })
  }
}

handler.command = ['ssweb', 'ss']
handler.help = ['ssweb <url>']
handler.tag = ['tools']

export default handler
