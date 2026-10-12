/**
 * Hands a generated file to the browser.
 *
 * The object URL is revoked on the next tick rather than immediately: Safari
 * has not started reading it by the time `click()` returns, and revoking in the
 * same frame gives it an empty download.
 */
export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  document.body.append(link)
  link.click()
  link.remove()

  setTimeout(() => URL.revokeObjectURL(url), 0)
}
