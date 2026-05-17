const isGroupAdmin = (meta, number) =>
  meta.participants.some(p => {
    const isAdminRole = p.admin === 'admin' || p.admin === 'superadmin'
    if (!isAdminRole) return false
    if (p.id.split('@')[0] === number) return true
    if (p.id.endsWith('@lid') && global.lidMap?.[p.id])
      return global.lidMap[p.id].split('@')[0] === number
    return false
  })

const handler = async (conn, m) => {
  if (!m.isGroup) {
    return await conn.sendMessage(m.chat, { text: '❌ Command ini hanya bisa digunakan di grup.' }, { quoted: m })
  }

  const meta = await conn.groupMetadata(m.chat)
  const botNum = conn.user.id.replace(/:\d+/, '').split('@')[0]

  if (!isGroupAdmin(meta, botNum)) {
    return await conn.sendMessage(m.chat, { text: '❌ Bot harus menjadi admin terlebih dahulu.' }, { quoted: m })
  }
  if (!isGroupAdmin(meta, m.number)) {
    return await conn.sendMessage(m.chat, { text: '❌ Hanya admin grup yang bisa menggunakan command ini.' }, { quoted: m })
  }

  const ctx =
    m.message?.extendedTextMessage?.contextInfo ||
    m.message?.imageMessage?.contextInfo ||
    m.message?.videoMessage?.contextInfo ||
    m.message?.documentMessage?.contextInfo

  if (!ctx?.stanzaId) {
    return await conn.sendMessage(
      m.chat,
      { text: '❌ Reply pesan yang disematkan yang ingin dibatalkan.' },
      { quoted: m }
    )
  }

  const quotedKey = {
    remoteJid: m.chat,
    fromMe: false,
    id: ctx.stanzaId,
    participant: ctx.participant
  }

  // type 2 = UNPIN_FOR_ALL
  await conn.sendMessage(m.chat, { pin: quotedKey, type: 2 })
  await conn.sendMessage(m.chat, { text: '📌 Sematan pesan berhasil dibatalkan.' }, { quoted: m })
}

handler.command = ['unpin']
handler.help = ['unpin (reply pesan yang disematkan)']
handler.tag = ['group']

export default handler
