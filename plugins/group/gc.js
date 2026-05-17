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

  const action = args[0]?.toLowerCase()

  if (!action || !['open', 'close'].includes(action)) {
    return await conn.sendMessage(
      m.chat,
      {
        text:
`*Cara Penggunaan*

=gc open  — Membuka grup (semua bisa kirim)
=gc close — Menutup grup (hanya admin)`
      },
      { quoted: m }
    )
  }

  const setting = action === 'close' ? 'announcement' : 'not_announcement'
  await conn.groupSettingUpdate(m.chat, setting)

  const msg = action === 'close'
    ? '🔒 Grup telah *ditutup*. Hanya admin yang bisa mengirim pesan.'
    : '🔓 Grup telah *dibuka*. Semua anggota bisa mengirim pesan.'

  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.command = ['gc']
handler.help = ['gc <open/close>']
handler.tag = ['group']

export default handler
