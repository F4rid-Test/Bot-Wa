const isGroupAdmin = (meta, number) =>
  meta.participants.some(p => {
    const isAdminRole = p.admin === 'admin' || p.admin === 'superadmin'
    if (!isAdminRole) return false
    if (p.id.split('@')[0] === number) return true
    if (p.id.endsWith('@lid') && global.lidMap?.[p.id])
      return global.lidMap[p.id].split('@')[0] === number
    return false
  })

const DURATION = {
  '1': { label: '24 jam',  time: 86400   },
  '2': { label: '7 hari',  time: 604800  },
  '3': { label: '30 hari', time: 2592000 }
}

const handler = async (conn, m, { args }) => {
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

  const durationKey = args[0]
  const duration = DURATION[durationKey]

  if (!duration) {
    return await conn.sendMessage(
      m.chat,
      {
        text:
`*Cara Penggunaan*

Reply pesan yang ingin disematkan, lalu:

=pin 1 — Sematkan selama *24 jam*
=pin 2 — Sematkan selama *7 hari*
=pin 3 — Sematkan selama *30 hari*`
      },
      { quoted: m }
    )
  }

  const ctx =
    m.message?.extendedTextMessage?.contextInfo ||
    m.message?.imageMessage?.contextInfo ||
    m.message?.videoMessage?.contextInfo ||
    m.message?.documentMessage?.contextInfo

  if (!ctx?.stanzaId) {
    return await conn.sendMessage(
      m.chat,
      { text: `❌ Reply pesan yang ingin disematkan, lalu ketik:\n=pin ${durationKey}` },
      { quoted: m }
    )
  }

  const quotedKey = {
    remoteJid: m.chat,
    fromMe: false,
    id: ctx.stanzaId,
    participant: ctx.participant
  }

  await conn.sendMessage(m.chat, { pin: quotedKey, type: 1, time: duration.time })
  await conn.sendMessage(
    m.chat,
    { text: `📌 Pesan berhasil disematkan selama *${duration.label}*.` },
    { quoted: m }
  )
}

handler.command = ['pin']
handler.help = ['pin <1/2/3> (reply pesan)']
handler.tag = ['group']

export default handler
