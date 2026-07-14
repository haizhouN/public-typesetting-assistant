const API_BASE = 'https://public-typesetting-api.2964635766.workers.dev'

function generateDeviceId(): string {
  const stored = localStorage.getItem('device_id')
  if (stored) return stored
  const id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
  localStorage.setItem('device_id', id)
  return id
}

function getDeviceId(): string {
  return localStorage.getItem('device_id') || generateDeviceId()
}

export async function activateCode(code: string): Promise<{ success: boolean; message: string; token?: string }> {
  const deviceId = getDeviceId()
  const response = await fetch(`${API_BASE}/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code.toUpperCase().trim(), deviceId }),
  })
  const data = await response.json()
  return data
}

export async function verifyToken(token: string): Promise<boolean> {
  const deviceId = getDeviceId()
  try {
    const response = await fetch(`${API_BASE}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, deviceId }),
    })
    const data = await response.json()
    return data.success === true
  } catch {
    return false
  }
}

export { getDeviceId }
