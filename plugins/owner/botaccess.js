const handler = async (conn, m, { args, prefix, command }) => {
  if (!m.isOwner) {
    return await conn.sendMessage(m.chat, {
      text: '❌ Owner only command.'
    }, { quoted: m })
  }

  const mode = args[0]?.toLowerCase()

  if (!mode || !['public', 'private'].includes(mode)) {
    return await conn.sendMessage(m.chat, {
      text:
`╭━━━〔 *BOT ACCESS* 〕━━━⬣
┃
┃ 📌 *Status Saat Ini:*
┃ ${global.isPublic ? '🟢 PUBLIC — Semua user bisa pakai' : '🔴 PRIVATE — Owner only'}
┃
┣━⬣ *Cara Penggunaan:*
┃ ${prefix + command} public
┃ ${prefix + command} private
┃
┣━⬣ *Keterangan:*
┃ 🟢 *public* — semua user bisa pakai bot
┃ 🔴 *private* — hanya owner yang bisa pakai
┃
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  }

  if (mode === 'public') {
    global.isPublic = true
    await conn.sendMessage(m.chat, {
      text:
`╭━━━〔 *BOT ACCESS* 〕━━━⬣
┃
┃ ✅ *Mode diubah ke PUBLIC*
┃
┃ 🟢 Semua user sekarang bisa
┃ menggunakan bot.
┃
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  } else {
    global.isPublic = false
    await conn.sendMessage(m.chat, {
      text:
`╭━━━〔 *BOT ACCESS* 〕━━━⬣
┃
┃ ✅ *Mode diubah ke PRIVATE*
┃
┃ 🔴 Bot sekarang hanya bisa
┃ digunakan oleh owner.
┃
╰━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m })
  }
}

handler.command = ['bot', 'botaccess']
handler.help = ['bot public/private']
handler.tag = ['owner']

export default handler
