import axios from 'axios'

const handler = async (conn, m, { args, prefix, command }) => {
  try {
    const query = args.join(' ')

    if (!query) {
      return await conn.sendMessage(
        m.chat,
        {
          text:
`*Cara Penggunaan*

${prefix + command} <judul lagu>

*Contoh:*
${prefix + command} Radiohead No Surprises`
        },
        { quoted: m }
      )
    }

    await conn.sendMessage(
      m.chat,
      { text: `🔍 Mencari: *${query}*...` },
      { quoted: m }
    )

    const { data } = await axios.get(
      `https://api.lexcode.biz.id/api/dwn/ytplay?q=${encodeURIComponent(query)}`,
      { timeout: 30000 }
    )

    if (!data.status || !data.result) {
      throw new Error('Lagu tidak ditemukan.')
    }

    const result = data.result
    const title = result.title || 'Unknown'
    const audioUrl = result.download?.audio

    if (!audioUrl) {
      throw new Error('Link audio tidak tersedia.')
    }

    await conn.sendMessage(
      m.chat,
      { text: '📤 Mengupload audio ke status WhatsApp...' },
      { quoted: m }
    )

    await conn.sendMessage('status@broadcast', {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `${title}.mp3`
    })

    await conn.sendMessage(
      m.chat,
      { text: `✅ *${title}* berhasil diupload ke status!` },
      { quoted: m }
    )
  } catch (e) {
    console.log(e)
    await conn.sendMessage(
      m.chat,
      {
        text:
`❌ *SW Play Gagal*

📌 *Detail Error :*
${e.message}`
      },
      { quoted: m }
    )
  }
}

handler.command = ['swplay']
handler.help = ['swplay <judul lagu>']
handler.tag = ['tools']

export default handler
