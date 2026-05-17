const isGroupAdmin = (meta, number) =>
  meta.participants.some(p => {
    const isAdminRole = p.admin === 'admin' || p.admin === 'superadmin'
    if (!isAdminRole) return false
    if (p.id.split('@')[0] === number) return true
    if (p.id.endsWith('@lid') && global.lidMap?.[p.id])
      return global.lidMap[p.id].split('@')[0] === number
    return false
  })

const handler = async (conn, m, { text }) => {
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

  const num = text?.replace(/[^0-9]/g, '')

  if (!num) {
    return await conn.sendMessage(
      m.chat,
      { text: '❌ Sertakan nomor yang ingin ditambahkan.\n\nContoh: =add 628xxxxxxxxxx' },
      { quoted: m }
    )
  }

  const target = `${num}@s.whatsapp.net`

  const alreadyMember = meta.participants.some(p => p.id.split('@')[0] === num)
  if (alreadyMember) {
    return await conn.sendMessage(m.chat, { text: '❌ Nomor tersebut sudah menjadi anggota grup.' }, { quoted: m })
  }

  const result = await conn.groupParticipantsUpdate(m.chat, [target], 'add')
  const status = result?.[0]?.status

  if (status === '200') {
    await conn.sendMessage(
      m.chat,
      { text: `✅ @${num} berhasil ditambahkan ke grup.`, mentions: [target] },
      { quoted: m }
    )
  } else if (status === '403') {
    await conn.sendMessage(m.chat, { text: '❌ Privasi pengguna mencegah penambahan ke grup.' }, { quoted: m })
  } else if (status === '408') {
    await conn.sendMessage(m.chat, { text: '❌ Nomor tidak terdaftar di WhatsApp.' }, { quoted: m })
  } else {
    await conn.sendMessage(m.chat, { text: `⚠️ Gagal menambahkan anggota. Status: ${status}` }, { quoted: m })
  }
}

handler.command = ['add']
handler.help = ['add <nomor>']
handler.tag = ['group']

export default handler
