'use client'

export function downloadAsTxt(altText: string, fileName: string) {
  const blob = new Blob([altText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName.replace(/\.[^/.]+$/, '')}_alt-text.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadAsJson(altText: string, fileName: string, metadata?: Record<string, unknown>) {
  const data = {
    fileName,
    altText,
    generatedAt: new Date().toISOString(),
    ...metadata,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName.replace(/\.[^/.]+$/, '')}_alt-text.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

