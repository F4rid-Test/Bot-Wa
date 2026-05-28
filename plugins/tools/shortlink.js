import axios from 'axios'

let handler = async (conn, m, { text, command, prefix }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, {
        text: `❌ *Contoh Penggunaan*:\n${prefix + command} https://google.com`
      }, { quoted: m })
    }

    const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`)

    await conn.sendMessage(m.chat, {
      text: `╭━━━〔 *SHORT LINK* 〕━━━⬣
┃
┃ 🔗 *Original:* ${text}
┃ 📤 *Short:* ${data}
┃
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, {
      text: `❌ *Error*: Gagal menyingkat URL. Pastikan URL valid.`
    }, { quoted: m })
  }
}

handler.command = ['shortlink', 'short', 'tinyurl']
handler.help = ['shortlink <url>']
handler.tag = ['tools']

export default handler
