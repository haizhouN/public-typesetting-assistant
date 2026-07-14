export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)

    if (url.pathname === '/activate' && request.method === 'POST') {
      return handleActivate(request, env, corsHeaders)
    }

    if (url.pathname === '/verify' && request.method === 'POST') {
      return handleVerify(request, env, corsHeaders)
    }

    if (url.pathname === '/claim' && request.method === 'POST') {
      return handleClaim(request, env, corsHeaders)
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  },
}

interface Env {
  ACTIVATION_KV: KVNamespace
  SECRET_KEY: string
}

async function handleActivate(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  try {
    const { code, deviceId } = await request.json() as { code: string; deviceId: string }

    if (!code || !deviceId) {
      return json({ success: false, error: '缺少参数' }, 400, headers)
    }

    const normalizedCode = code.toUpperCase().trim()

    const existing = await env.ACTIVATION_KV.get(`code:${normalizedCode}`, 'json') as ActivationRecord | null

    if (!existing) {
      return json({ success: false, error: '激活码无效' }, 200, headers)
    }

    if (existing.used) {
      if (existing.deviceId === deviceId) {
        const token = await generateToken(deviceId, normalizedCode, env.SECRET_KEY)
        return json({ success: true, message: '已激活（你的设备）', token }, 200, headers)
      }
      return json({ success: false, error: '激活码已被使用' }, 200, headers)
    }

    await env.ACTIVATION_KV.put(`code:${normalizedCode}`, JSON.stringify({
      used: true,
      deviceId,
      activatedAt: Date.now(),
    }))

    const token = await generateToken(deviceId, normalizedCode, env.SECRET_KEY)
    return json({ success: true, message: '激活成功', token }, 200, headers)
  } catch (e) {
    return json({ success: false, error: '服务器错误' }, 500, headers)
  }
}

async function handleVerify(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  try {
    const { token, deviceId } = await request.json() as { token: string; deviceId: string }

    if (!token || !deviceId) {
      return json({ success: false, error: '缺少参数' }, 400, headers)
    }

    const parts = token.split('.')
    if (parts.length !== 2) {
      return json({ success: false }, 200, headers)
    }

    const payload = atob(parts[0])
    const { code, did, exp } = JSON.parse(payload) as { code: string; did: string; exp: number }

    if (did !== deviceId) {
      return json({ success: false }, 200, headers)
    }

    if (Date.now() > exp) {
      return json({ success: false }, 200, headers)
    }

    const expectedSig = await hmacSha256(parts[0], env.SECRET_KEY)
    if (expectedSig !== parts[1]) {
      return json({ success: false }, 200, headers)
    }

    const record = await env.ACTIVATION_KV.get(`code:${code}`, 'json') as ActivationRecord | null
    if (!record || !record.used || record.deviceId !== deviceId) {
      return json({ success: false }, 200, headers)
    }

    return json({ success: true }, 200, headers)
  } catch {
    return json({ success: false }, 200, headers)
  }
}

async function handleClaim(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  try {
    const { deviceId } = await request.json() as { deviceId: string }

    if (!deviceId) {
      return json({ success: false, error: '缺少参数' }, 400, headers)
    }

    const poolData = await env.ACTIVATION_KV.get('codes:pool')
    if (!poolData) {
      return json({ success: false, error: '暂无可用激活码' }, 200, headers)
    }

    const pool: string[] = JSON.parse(poolData)
    if (pool.length === 0) {
      return json({ success: false, error: '激活码已领完' }, 200, headers)
    }

    const code = pool.shift()!

    await env.ACTIVATION_KV.put('codes:pool', JSON.stringify(pool))

    await env.ACTIVATION_KV.put(`code:${code}`, JSON.stringify({
      used: true,
      deviceId,
      activatedAt: Date.now(),
    }))

    const token = await generateToken(deviceId, code, env.SECRET_KEY)
    return json({ success: true, code, token, message: '领取成功' }, 200, headers)
  } catch {
    return json({ success: false, error: '服务器错误' }, 500, headers)
  }
}

interface ActivationRecord {
  used: boolean
  deviceId?: string
  activatedAt?: number
}

async function generateToken(deviceId: string, code: string, secret: string): Promise<string> {
  const payload = {
    code,
    did: deviceId,
    exp: Date.now() + 365 * 24 * 60 * 60 * 1000,
  }
  const encoded = btoa(JSON.stringify(payload))
  const sig = await hmacSha256(encoded, secret)
  return `${encoded}.${sig}`
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

function json(data: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  })
}
