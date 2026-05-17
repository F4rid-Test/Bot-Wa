const handler = async (conn, m, { text }) => {
  if (!m.isGroup) {
    return await conn.sendMessage(m.chat, { text: '❌ Command ini hanya bisa digunakan di grup.' }, { quoted: m })
  }

  if (!m.isOwner) {
    return await conn.sendMessage(m.chat, { text: '❌ Owner only command.' }, { quoted: m })
  }

  const meta = await conn.groupMetadata(m.chat)
  const participants = meta.participants.map(p => p.id)

  const msg = text?.trim() || ''

  await conn.sendMessage(
    m.chat,
    {
      text: msg,
      mentions: participants
    },
    { quoted: m }
  )
}

handler.command = ['ht', 'hidetag']
handler.help = ['ht <teks>']
handler.tag = ['group']

export default handler
