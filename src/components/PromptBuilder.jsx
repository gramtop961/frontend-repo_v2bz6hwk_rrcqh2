import React, { useState } from 'react'

export default function PromptBuilder({ onBuild }) {
  const [genre, setGenre] = useState('business')
  const [topic, setTopic] = useState('')
  const [goal, setGoal] = useState('')
  const [audience, setAudience] = useState('aspiring entrepreneurs')
  const [notes, setNotes] = useState('')

  const handleBuild = () => {
    const prompt = buildPrompt({ genre, topic, goal, audience, notes })
    onBuild({ prompt, meta: { genre, topic, goal, audience, notes } })
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Book Definition & Prompt</h2>
          <p className="text-sm text-gray-500">Provide the essentials. We’ll craft a detailed, multi-layered prompt your AI can use to write chapter-by-chapter.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <input value={genre} onChange={(e)=>setGenre(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" placeholder="e.g., business, self-help, technology" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Audience</label>
            <input value={audience} onChange={(e)=>setAudience(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" placeholder="e.g., first-time founders, hobbyists" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Book Topic</label>
            <input value={topic} onChange={(e)=>setTopic(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" placeholder="What is this book about?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Goal</label>
            <input value={goal} onChange={(e)=>setGoal(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" placeholder="e.g., teach a system, solve a problem, roadmap" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Extra Notes for Style & Scope</label>
            <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" placeholder="Tone, case studies to include, constraints, sources to reference, etc." />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">This builds a reusable base prompt for all chapters.</p>
          <button onClick={handleBuild} className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700">Generate Base Prompt</button>
        </div>
      </div>
    </section>
  )
}

function buildPrompt({ genre, topic, goal, audience, notes }) {
  const role = `You are an expert author and professional book editor with over 20 years of experience in the ${genre} genre. Your writing style is engaging, authoritative, and mimics a seasoned human author. You are tasked with writing a full-length, non-fiction eBook intended for commercial sale.`

  const specs = `The book's topic is ${topic || '[User\'s Book Topic]'}. Its primary goal is to ${goal || '[User\'s Defined Goal]'}. The book is written for ${audience || '[User\'s Target Audience]'}. Tailor the tone and examples to their level of knowledge.`

  const length = `The final book must be extensive, between 150-200 pages (≈35,000–50,000 words) and structured with a logical flow from basic to advanced concepts. Generate content chapter-by-chapter to manage length.`

  const structure = `Include: Title Page, Copyright Page, Table of Contents with clickable links, Introduction, at least 8–12 Chapters with clear titles, Conclusion (summary + call to action), and About the Author.`

  const human = `Avoid repetitive sentence structures and robotic phrasing. Use rhetorical questions, analogies, and varied transitions. The text must read as if written by a skilled human author.`

  const formatting = `Use standard heading styles: Heading 1 for chapter titles and Heading 2 for subheadings to ensure clean conversion to EPUB and DOCX.`

  const kdp = `Ensure images (if any) are high quality (≥300 PPI). Keep fonts/layouts simple for reflow. Provide metadata suggestions: description, categories, and 7 keywords.`

  const extra = notes ? `Additional guidance: ${notes}` : ''

  return [
    'ROLE & CONTEXT:',
    role,
    '',
    'BOOK SPECIFICATIONS:',
    specs,
    length,
    '',
    'CONTENT & FORMATTING INSTRUCTIONS:',
    structure,
    human,
    formatting,
    kdp,
    extra,
    '',
    'OUTPUT MODE:',
    'Work chapter-by-chapter. For each chapter, return: (1) structured outline (H2/H3), (2) a 2–3 paragraph overview, and (3) the full draft (1500–3000 words).'
  ].filter(Boolean).join('\n')
}
