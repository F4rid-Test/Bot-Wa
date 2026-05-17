const handler = async (conn, m) => {

  const runtime = (seconds) => {
    seconds = Number(seconds)

    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor(seconds % (3600 * 24) / 3600)
    const mnt = Math.floor(seconds % 3600 / 60)
    const s = Math.floor(seconds % 60)

    return [
      d ? `${d} Hari` : '',
      h ? `${h} Jam` : '',
      mnt ? `${mnt} Menit` : '',
      s ? `${s} Detik` : ''
    ].filter(Boolean).join(' ')
  }
  
  const start = Date.now()
  const end = Date.now()
  const speed = end - start

  await conn.sendMessage(m.chat, {
    text: `
Ping Pong

Runtime :  ${runtime(process.uptime())}
Speed : ${speed} ms`
  }, {
    quoted: m
  })
}

handler.command = ['ping', 'p']
handler.help = ['ping']
handler.tag = ['info']

export default handler
