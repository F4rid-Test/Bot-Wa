export const serialize = async (sock, m) => {

  const rawChat = m.key.remoteJid || ''
  const rawSender = m.key.participant || m.key.remoteJid || ''

  const cleanJid = (jid = '') =>
    jid
      .replace(/:\d+/, '') // multi-device fix
      .toLowerCase()

  // Resolve LID (@lid) → real phone JID (@s.whatsapp.net)
  const resolveLid = async (jid = '') => {
    if (!jid.endsWith('@lid')) return jid
    // Return from cache first
    if (global.lidMap?.[jid]) return global.lidMap[jid]
    // Ask Baileys signal repository
    try {
      const pn = await sock.signalRepository.lidMapping.getPNForLID(jid)
      if (pn) {
        global.lidMap[jid] = pn
        return pn
      }
    } catch {}
    return jid
  }

  const resolvedChat = await resolveLid(rawChat)
  const resolvedSender = await resolveLid(rawSender)

  m.chat = cleanJid(resolvedChat)
  m.fromMe = m.key.fromMe
  m.isGroup = m.chat.endsWith('@g.us')
  m.sender = m.isGroup
    ? cleanJid(resolvedSender)
    : m.chat

  m.number = m.sender.split('@')[0]
  m.isOwner = global.owner.some(num =>
    m.number === num ||
    m.number === num.replace(/^\+/, '') ||
    m.sender?.startsWith(num + '@') ||
    m.sender?.startsWith(num + ':')
  )

  m.body =
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    m.message?.buttonsResponseMessage?.selectedButtonId ||
    m.message?.templateButtonReplyMessage?.selectedId ||
    m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
    ''

  // FIX native flow
  try {
    const flow = JSON.parse(
      m.message?.interactiveResponseMessage
        ?.nativeFlowResponseMessage?.paramsJson
    )
    if (flow?.id) {
      m.body = flow.id
    }
  } catch {}

  m.reply = async (text) => {
    return await sock.sendMessage(
      m.chat,
      { text },
      { quoted: m }
    )
  }

  return m
}
