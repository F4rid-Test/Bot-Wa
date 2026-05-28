import axios from 'axios'

let handler = async (conn, m, { text, command, prefix }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, {
        text: `❌ *Contoh Penggunaan*:\n${prefix + command} Jakarta`
      }, { quoted: m })
    }

    const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(text)}?format=%l:+%c+%t+%w+%h`)

    await conn.sendMessage(m.chat, {
      text: `╭━━━〔 *WEATHER INFO* 〕━━━⬣
┃
┃ 📍 *Lokasi:* ${data}
┃
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, {
      text: `❌ *Error*: Gagal mengambil data cuaca. Pastikan nama kota benar.`
    }, { quoted: m })
  }
}

handler.command = ['weather', 'cuaca']
handler.help = ['weather <kota>']
handler.tag = ['tools']

export default handler
