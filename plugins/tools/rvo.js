import { downloadContentFromMessage } from '@dnuzi/baileys'

async function getBuffer(message, type) {
  const stream = await downloadContentFromMessage(message, type)
  let buffer = Buffer.from([])
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
  }
  return buffer
}

const handler = async (conn, m, { prefix, command }) => {
  try {
    const contextInfo =
      m.message?.extendedTextMessage?.contextInfo ||
      m.message?.imageMessage?.contextInfo ||
      m.message?.videoMessage?.contextInfo ||
      null

    const quotedMsg = contextInfo?.quotedMessage

    if (!quotedMsg) {
      return await conn.sendMessage(
        m.chat,
        {
          text:
`*Cara Penggunaan*

Reply pesan media viewonce dengan:
${prefix + command}`
        },
        { quoted: m }
      )
    }

    // Debug: log semua keys yang ada di quotedMsg
    console.log('[RVO] quotedMsg keys:', JSON.stringify(Object.keys(quotedMsg)))
    console.log('[RVO] quotedMsg full:', JSON.stringify(quotedMsg, null, 2))

    // Cek semua kemungkinan struktur viewonce
    const viewOnceMsg =
      quotedMsg?.viewOnceMessage?.message ||
      quotedMsg?.viewOnceMessageV2?.message ||
      quotedMsg?.viewOnceMessageV2Extended?.message

    // Beberapa versi Baileys menyimpan langsung di imageMessage/videoMessage
    // dengan flag viewOnce: true
    const directImage = quotedMsg?.imageMessage
    const directVideo = quotedMsg?.videoMessage

    let imageMsg = null
    let videoMsg = null

    if (viewOnceMsg) {
      imageMsg = viewOnceMsg.imageMessage
      videoMsg = viewOnceMsg.videoMessage
    } else if (directImage?.viewOnce) {
      imageMsg = directImage
    } else if (directVideo?.viewOnce) {
      videoMsg = directVideo
    } else {
      return await conn.sendMessage(
        m.chat,
        { text: '❌ Pesan yang di-reply bukan media viewonce.' },
        { quoted: m }
      )
    }

    if (!imageMsg && !videoMsg) {
      return await conn.sendMessage(
        m.chat,
        { text: '❌ Tipe media viewonce tidak didukung.' },
        { quoted: m }
      )
    }

    await conn.sendMessage(
      m.chat,
      { text: '⏳ Memproses media viewonce...' },
      { quoted: m }
    )

    if (imageMsg) {
      const buffer = await getBuffer(imageMsg, 'image')
      await conn.sendMessage(
        m.chat,
        {
          image: buffer,
          caption: '✅ *RVO — Reveal View Once*',
          mimetype: imageMsg.mimetype || 'image/jpeg'
        },
        { quoted: m }
      )
    } else if (videoMsg) {
      const buffer = await getBuffer(videoMsg, 'video')
      await conn.sendMessage(
        m.chat,
        {
          video: buffer,
          caption: '✅ *RVO — Reveal View Once*',
          mimetype: videoMsg.mimetype || 'video/mp4'
        },
        { quoted: m }
      )
    }
  } catch (e) {
    console.log(e)
    await conn.sendMessage(
      m.chat,
      {
        text:
`❌ *RVO Gagal*

📌 *Detail Error :*
${e.message}`
      },
      { quoted: m }
    )
  }
}

handler.command = ['rvo', '😮']
handler.help = ['rvo (reply viewonce)']
handler.tag = ['tools']

export default handler
