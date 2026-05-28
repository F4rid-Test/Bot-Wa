import axios from 'axios'

let handler = async (conn, m, { text, command, prefix }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, {
        text: `❌ *Contoh Penggunaan*:\n${prefix + command} hello world`
      }, { quoted: m })
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`

    await conn.sendMessage(m.chat, {
      image: { url: qrUrl },
      caption: `╭━━━〔 *QR CODE* 〕━━━⬣
┃
┃ 📥 *Input:* ${text}
┃
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, {
      text: `❌ *Error*: Gagal membuat QR Code.`
    }, { quoted: m })
  }
}

handler.command = ['qrcode', 'qr']
handler.help = ['qrcode <teks>']
handler.tag = ['tools']

export default handler
