import React, { useMemo, useState } from 'react'

export default function ChapterManager({ basePrompt, onUpdateChapters }) {
  const [chapters, setChapters] = useState([
    { id: crypto.randomUUID(), title: 'Introduction', summary: 'Hook, value, and what readers will learn', content: '' },
    { id: crypto.randomUUID(), title: 'Chapter 1', summary: 'Foundations and key concepts', content: '' },
  ])
  const [activeId, setActiveId] = useState(chapters[0].id)

  const activeChapter = useMemo(
    () => chapters.find(c => c.id === activeId) || chapters[0],
    [chapters, activeId]
  )

  const addChapter = () => {
    const nextIndex = chapters.length + 1
    const newChapter = { id: crypto.randomUUID(), title: `Chapter ${nextIndex}`, summary: '', content: '' }
    const next = [...chapters, newChapter]
    setChapters(next)
    setActiveId(newChapter.id)
    onUpdateChapters(next)
  }

  const removeChapter = (id) => {
    const next = chapters.filter(c => c.id !== id)
    setChapters(next)
    if (activeId === id && next.length) setActiveId(next[0].id)
    onUpdateChapters(next)
  }

  const updateField = (id, field, value) => {
    const next = chapters.map(c => c.id === id ? { ...c, [field]: value } : c)
    setChapters(next)
    onUpdateChapters(next)
  }

  const chapterPrompt = useMemo(() => {
    if (!activeChapter) return ''
    return [
      basePrompt || '',
      '',
      'CHAPTER TASK:',
      `Write the following chapter in full:`,
      `Title: ${activeChapter.title || 'TBD'}`,
      activeChapter.summary ? `Chapter Objective: ${activeChapter.summary}` : '',
      '',
      'Deliverables:',
      '- Structured outline using H2/H3',
      '- 2–3 paragraph overview',
      '- Full chapter draft (1500–3000 words)',
    ].filter(Boolean).join('\n')
  }, [activeChapter, basePrompt])

  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <aside className="md:col-span-4 border-r border-gray-200">
            <div className="flex items-center justify-between px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Chapters</h3>
              <button onClick={addChapter} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700">Add</button>
            </div>
            <ul className="max-h-[360px] overflow-y-auto px-3 pb-3">
              {chapters.map((ch) => (
                <li key={ch.id} className={`group mb-2 flex items-start gap-2 rounded-lg border px-3 py-2 ${activeId===ch.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                  <button onClick={()=>setActiveId(ch.id)} className="flex-1 text-left">
                    <p className="font-medium text-gray-900 line-clamp-1">{ch.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{ch.summary || 'No summary yet'}</p>
                  </button>
                  {chapters.length > 1 && (
                    <button onClick={()=>removeChapter(ch.id)} className="opacity-70 hover:opacity-100 text-gray-500 text-xs">Remove</button>
                  )}
                </li>
              ))}
            </ul>
          </aside>

          <div className="md:col-span-8">
            {activeChapter && (
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chapter Title</label>
                    <input value={activeChapter.title} onChange={(e)=>updateField(activeChapter.id, 'title', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Objective / Summary</label>
                    <input value={activeChapter.summary} onChange={(e)=>updateField(activeChapter.id, 'summary', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Chapter Draft (Human-in-the-loop)</label>
                  <textarea value={activeChapter.content} onChange={(e)=>updateField(activeChapter.id, 'content', e.target.value)} rows={12} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" placeholder="Paste AI output here and refine it manually. Add anecdotes, verify facts, enhance storytelling." />
                  <p className="mt-1 text-xs text-gray-500">Tip: Work section-by-section to build up to 1500–3000 words per chapter.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Chapter-Specific Prompt</label>
                  <textarea value={chapterPrompt} readOnly rows={10} className="mt-1 w-full rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 px-3 py-2 text-indigo-900" />
                  <p className="mt-1 text-xs text-gray-500">Copy this prompt into your AI when drafting this chapter.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
