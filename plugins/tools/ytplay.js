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
    const channel = result.channel || 'Unknown'
    const views = result.views || '-'
    const duration = result.duration || '-'
    const audioUrl = result.download?.audio
    const thumbnail = result.thumbnail

    if (!audioUrl) {
      throw new Error('Link audio tidak tersedia.')
    }

    const caption =
`╭━━━〔 *YOUTUBE PLAY* 〕━━━⬣
┃
┃ 🎵 *Judul :* ${title}
┃ 👤 *Channel :* ${channel}
┃ ⏱️ *Durasi :* ${duration}
┃ 👁️ *Views :* ${views}
┃
╰━━━━━━━━━━━━━━━━⬣`

    if (thumbnail) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url: thumbnail },
          caption
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        { text: caption },
        { quoted: m }
      )
    }

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: `${title}.mp3`
      },
      { quoted: m }
    )
  } catch (e) {
    console.log(e)
    await conn.sendMessage(
      m.chat,
      {
        text:
`❌ *Play Gagal*

📌 *Detail Error :*
${e.message}`
      },
      { quoted: m }
    )
  }
}

handler.command = ['play']
handler.help = ['play <judul lagu>']
handler.tag = ['tools']

export default handler
