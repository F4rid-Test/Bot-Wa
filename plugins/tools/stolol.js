import axios from 'axios'

let handler = async (conn, m, { command, prefix, args }) => {
  try {
    const text = args.join(' ')

    if (!text) {
      return await conn.sendMessage(m.chat, {
        text:
`*Contoh Penggunaan*

${prefix + command} <nama>

Contoh: ${prefix + command} Budi Santoso`
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, { text: '⏳ Membuat sertifikat...' }, { quoted: m })

    const { data } = await axios.get('https://api.siputzx.my.id/api/canvas/sertifikat-tolol', {
      params: { text },
      responseType: 'arraybuffer',
      timeout: 30000
    })

    await conn.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption:
`╭━━━〔 *SERTIFIKAT TOLOL* 〕━━━⬣
┃
┃ 🏆 *Selamat!*
┃ *${text}*
┃ telah resmi mendapatkan
┃ Sertifikat Tolol 🎓
┃
╰━━━━━━━━━━━━━━━━⬣`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363424411396051@newsletter',
          newsletterName: 'Sertifikat Tolol',
          serverMessageId: 1
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, {
      text:
`❌ *Gagal membuat sertifikat*

📌 *Error:*
${e.message}`
    }, { quoted: m })
  }
}

handler.command = ['stolol', 'sertolol']
handler.help = ['stolol <nama>']
handler.tag = ['tools']

export default handler
