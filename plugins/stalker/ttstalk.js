const handler = async (conn, m, { args, text }) => {
  const username = text?.trim() || args[0]

  if (!username) {
    return await conn.sendMessage(
      m.chat,
      {
        text:
`*Cara Penggunaan*

=ttstalk <username>

*Contoh:*
=ttstalk hdrf404`
      },
      { quoted: m }
    )
  }

  await conn.sendMessage(m.chat, { text: '⏳ Mengambil data TikTok...' }, { quoted: m })

  try {
    const res = await fetch(`https://api.lexcode.biz.id/api/stalker/tiktok?username=${encodeURIComponent(username)}`)
    const json = await res.json()

    if (!json.success || !json.result) {
      return await conn.sendMessage(
        m.chat,
        { text: '❌ Username tidak ditemukan atau terjadi kesalahan.' },
        { quoted: m }
      )
    }

    const r = json.result
    const text = `
*🎵 TikTok Stalker*

👤 *Username* : @${r.username}
📛 *Nickname* : ${r.nickname}
📝 *Bio* : ${r.bio || '-'}
🌐 *Bahasa* : ${r.language || '-'}
✅ *Verified* : ${r.verified ? 'Ya' : 'Tidak'}
🔒 *Private* : ${r.privateAccount ? 'Ya' : 'Tidak'}

📊 *Statistik :*
➥ Followers  : ${r.stats.followers.toLocaleString('id-ID')}
➥ Following  : ${r.stats.following.toLocaleString('id-ID')}
➥ Likes      : ${r.stats.likes.toLocaleString('id-ID')}
➥ Videos     : ${r.stats.videos.toLocaleString('id-ID')}

🔗 *Profil* : ${r.profileUrl}`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: r.avatar.medium },
        caption: text
      },
      { quoted: m }
    )
  } catch (e) {
    await conn.sendMessage(
      m.chat,
      { text: `❌ Gagal mengambil data:\n${e.message}` },
      { quoted: m }
    )
  }
}

handler.command = ['ttstalk']
handler.help = ['ttstalk <username>']
handler.tag = ['stalker']

export default handler
