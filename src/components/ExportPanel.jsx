import React from 'react'

export default function ExportPanel({ meta, chapters }) {
  const hasContent = (chapters || []).some(c => (c.content || '').trim().length > 0)

  const handleDownloadWord = () => {
    const html = buildDocHTML(meta, chapters)
    const blob = new Blob([html], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sanitize(meta?.topic || 'ebook')}.docx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handlePrintPDF = () => {
    const html = buildPrintableHTML(meta, chapters)
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    // Give the window a tick to render before printing
    setTimeout(() => printWindow.print(), 400)
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Export</h3>
          <p className="mt-1 text-sm text-gray-500">Download a Word file or print to PDF. Use Heading styles for clean conversion.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleDownloadWord} className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700">Download Word (.docx)</button>
            <button onClick={handlePrintPDF} className="rounded-lg bg-gray-900 px-4 py-2 text-white shadow hover:bg-black">Print / Save as PDF</button>
          </div>
          {!hasContent && (
            <p className="mt-3 text-xs text-amber-600">You haven't added any chapter content yet. You can still download the template and fill it later.</p>
          )}
        </div>

        <div className="md:col-span-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">KDP Readiness Checklist</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>• Cover: 2560 × 1600 px minimum, legible title/author at thumbnail size.</li>
            <li>• Images: 300 PPI at intended display size; avoid heavy compression.</li>
            <li>• Manuscript: Use Heading 1 for chapters, Heading 2 for subheads.</li>
            <li>• Table of Contents: Will be inferred from Heading styles.</li>
            <li>• Metadata: Compelling description, correct categories, 7 keywords.</li>
            <li>• Proofread: Run a human edit pass for tone, accuracy, citations.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function sanitize(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function buildDocHTML(meta = {}, chapters = []) {
  const { topic = 'Untitled', genre = '', audience = '', goal = '' } = meta
  const toc = chapters.map((c, i) => `<p><a href="#ch${i+1}">${escapeHTML(c.title || `Chapter ${i+1}`)}</a></p>`).join('')
  const body = chapters.map((c, i) => `
    <h1 id="ch${i+1}">${escapeHTML(c.title || `Chapter ${i+1}`)}</h1>
    ${c.summary ? `<h2>Overview</h2><p>${escapeHTML(c.summary)}</p>` : ''}
    ${c.content ? `<div>${toHTML(c.content)}</div>` : '<p><em>Draft this chapter and paste content here.</em></p>'}
  `).join('\n')
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHTML(topic)}</title>
      <style>
        body{font-family: Georgia, serif; line-height:1.6; color:#111}
        h1{font-size: 28px; margin: 28px 0 10px;}
        h2{font-size: 20px; margin: 20px 0 8px;}
        .page{page-break-after: always}
      </style>
    </head>
    <body>
      <div class="page">
        <h1>${escapeHTML(topic)}</h1>
        <p><strong>Genre:</strong> ${escapeHTML(genre)} · <strong>Audience:</strong> ${escapeHTML(audience)}</p>
        <p><strong>Goal:</strong> ${escapeHTML(goal)}</p>
      </div>
      <div class="page">
        <h1>Table of Contents</h1>
        ${toc}
      </div>
      ${body}
      <div class="page">
        <h1>About the Author</h1>
        <p>Write a concise, credible bio highlighting relevant expertise and published work.</p>
      </div>
    </body>
  </html>`
}

function buildPrintableHTML(meta = {}, chapters = []) {
  const inner = buildDocHTML(meta, chapters)
  return inner
}

function escapeHTML(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function toHTML(text) {
  // Convert simple plaintext paragraphs to HTML paragraphs and basic headings markers like #, ##
  const lines = String(text || '').split(/\n\n+/).map(block => block.trim()).filter(Boolean)
  return lines.map(block => {
    if (/^###\s/.test(block)) return `<h3>${escapeHTML(block.replace(/^###\s/, ''))}</h3>`
    if (/^##\s/.test(block)) return `<h2>${escapeHTML(block.replace(/^##\s/, ''))}</h2>`
    if (/^#\s/.test(block)) return `<h1>${escapeHTML(block.replace(/^#\s/, ''))}</h1>`
    return `<p>${escapeHTML(block)}</p>`
  }).join('\n')
}
