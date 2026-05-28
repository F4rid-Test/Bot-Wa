import axios from 'axios'

let handler = async (conn, m, { text, command, prefix }) => {
  try {
    let [lang, ...query] = text.split(' ')
    if (!lang || query.length === 0) {
      return await conn.sendMessage(m.chat, {
        text: `❌ *Contoh Penggunaan*:\n${prefix + command} id hello world\n\n(id = target bahasa, hello world = teks yang diterjemahkan)`
      }, { quoted: m })
    }

    query = query.join(' ')
    const { data } = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(query)}`)

    const translation = data[0].map(item => item[0]).join('')

    await conn.sendMessage(m.chat, {
      text: `╭━━━〔 *TRANSLATION* 〕━━━⬣
┃
┃ 🌐 *Target:* ${lang}
┃ 📥 *Input:* ${query}
┃ 📤 *Hasil:* ${translation}
┃
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, {
      text: `❌ *Error*: Gagal menerjemahkan teks.`
    }, { quoted: m })
  }
}

handler.command = ['translate', 'tr']
handler.help = ['translate <lang> <text>']
handler.tag = ['tools']

export default handler
