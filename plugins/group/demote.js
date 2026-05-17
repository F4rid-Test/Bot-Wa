const isGroupAdmin = (meta, number) =>
  meta.participants.some(p => {
    const isAdminRole = p.admin === 'admin' || p.admin === 'superadmin'
    if (!isAdminRole) return false
    if (p.id.split('@')[0] === number) return true
    if (p.id.endsWith('@lid') && global.lidMap?.[p.id])
      return global.lidMap[p.id].split('@')[0] === number
    return false
  })

const handler = async (conn, m, { args }) => {
  if (!m.isGroup) {
    return await conn.sendMessage(m.chat, { text: '❌ Command ini hanya bisa digunakan di grup.' }, { quoted: m })
  }

  const meta = await conn.groupMetadata(m.chat)

  const botJid = conn.user.id.replace(/:\d+/, '')
  const botNum = botJid.split('@')[0]

  if (!isGroupAdmin(meta, botNum)) {
    return await conn.sendMessage(m.chat, { text: '❌ Bot harus menjadi admin terlebih dahulu.' }, { quoted: m })
  }

  if (!isGroupAdmin(meta, m.number)) {
    return await conn.sendMessage(m.chat, { text: '❌ Hanya admin grup yang bisa menggunakan command ini.' }, { quoted: m })
  }

  const ctx =
    m.message?.extendedTextMessage?.contextInfo ||
    m.message?.imageMessage?.contextInfo ||
    m.message?.videoMessage?.contextInfo

  let target =
    ctx?.participant ||
    ctx?.mentionedJid?.[0]

  if (!target && args[0]) {
    const num = args[0].replace(/[^0-9]/g, '')
    if (num) target = `${num}@s.whatsapp.net`
  }

  if (!target) {
    return await conn.sendMessage(
      m.chat,
      { text: '❌ Tag, reply, atau sertakan nomor admin yang ingin di-demote.\n\nContoh: =demote @tag' },
      { quoted: m }
    )
  }

  if (!isGroupAdmin(meta, target.split('@')[0])) {
    return await conn.sendMessage(m.chat, { text: '❌ Anggota tersebut bukan admin.' }, { quoted: m })
  }

  await conn.groupParticipantsUpdate(m.chat, [target], 'demote')
  await conn.sendMessage(
    m.chat,
    { text: `⬇️ @${target.split('@')[0]} telah diturunkan menjadi anggota biasa.`, mentions: [target] },
    { quoted: m }
  )
}

handler.command = ['demote']
handler.help = ['demote <tag/reply/nomor>']
handler.tag = ['group']

export default handler
