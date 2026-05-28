import axios from 'axios'

let handler = async (conn, m, { text, command, prefix }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, {
        text: `❌ *Contoh Penggunaan*:\n${prefix + command} 2 + 3 * 4`
      }, { quoted: m })
    }

    const { data } = await axios.get(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(text)}`)

    await conn.sendMessage(m.chat, {
      text: `╭━━━〔 *CALCULATOR* 〕━━━⬣
┃
┃ 🔢 *Input:* ${text}
┃ 📤 *Hasil:* ${data}
┃
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, {
      text: `❌ *Error*: Ekspresi matematika tidak valid atau terjadi masalah pada API.`
    }, { quoted: m })
  }
}

handler.command = ['calc', 'kalkulator']
handler.help = ['calc <ekspresi>']
handler.tag = ['tools']

export default handler
