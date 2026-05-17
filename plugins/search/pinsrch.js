const handler = async (conn, m, { text }) => {
  const query = text?.trim()

  if (!query) {
    return await conn.sendMessage(
      m.chat,
      {
        text:
`*Cara Penggunaan*

=pinsrch <kata kunci>

*Contoh:*
=pinsrch kucing lucu`
      },
      { quoted: m }
    )
  }

  await conn.sendMessage(m.chat, { text: `🔍 Mencari gambar Pinterest: *${query}*...` }, { quoted: m })

  try {
    const res = await fetch(`https://api.lexcode.biz.id/api/search/pinterest?q=${encodeURIComponent(query)}`)
    const json = await res.json()

    if (!json.success || !json.results?.length) {
      return await conn.sendMessage(
        m.chat,
        { text: '❌ Tidak ada hasil ditemukan.' },
        { quoted: m }
      )
    }

    const results = json.results.slice(0, 5)

    for (const pin of results) {
      const caption = `
*📌 Pinterest Search*

*No* : ${pin.no}
*Caption* : ${pin.caption || 'No caption'}
*Pin ID* : ${pin.pinId}
*Link* : ${pin.link}

👤 *Author* : ${pin.author.fullname} (@${pin.author.username})
👥 *Followers* : ${pin.author.followers.toLocaleString('id-ID')}`.trim()

      await conn.sendMessage(
        m.chat,
        {
          image: { url: pin.image },
          caption
        },
        { quoted: m }
      )
    }
  } catch (e) {
    await conn.sendMessage(
      m.chat,
      { text: `❌ Gagal mencari gambar:\n${e.message}` },
      { quoted: m }
    )
  }
}

handler.command = ['pinsrch', 'pinterest']
handler.help = ['pinsrch <query>']
handler.tag = ['search']

export default handler
