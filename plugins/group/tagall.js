const handler = async (conn, m, { text }) => {
  if (!m.isGroup) {
    return await conn.sendMessage(m.chat, { text: '❌ Command ini hanya bisa digunakan di grup.' }, { quoted: m })
  }

  if (!m.isOwner) {
    return await conn.sendMessage(m.chat, { text: '❌ Owner only command.' }, { quoted: m })
  }

  const meta = await conn.groupMetadata(m.chat)
  const participants = meta.participants.map(p => p.id)

  const header = text?.trim()
    ? `*${text.trim()}*\n\n`
    : `*📢 Tag Semua Anggota*\n\n`

  const tagList = participants
    .map(jid => `@${jid.split('@')[0]}`)
    .join('\n')

  await conn.sendMessage(
    m.chat,
    {
      text: header + tagList,
      mentions: participants
    },
    { quoted: m }
  )
}

handler.command = ['tagall']
handler.help = ['tagall <teks opsional>']
handler.tag = ['group']

export default handler
