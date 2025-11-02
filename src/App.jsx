import React, { useState } from 'react'
import Header from './components/Header'
import PromptBuilder from './components/PromptBuilder'
import ChapterManager from './components/ChapterManager'
import ExportPanel from './components/ExportPanel'

function App() {
  const [basePrompt, setBasePrompt] = useState('')
  const [meta, setMeta] = useState(null)
  const [chapters, setChapters] = useState([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50">
      <Header />

      <PromptBuilder
        onBuild={({ prompt, meta }) => {
          setBasePrompt(prompt)
          setMeta(meta)
        }}
      />

      {basePrompt && (
        <section className="mx-auto max-w-6xl px-6 -mt-4">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-900">
            <p className="text-sm font-medium">Base Prompt</p>
            <p className="mt-1 text-xs opacity-80">Use this with your AI to frame the entire book. Chapter-specific prompts are provided below.</p>
            <pre className="mt-3 whitespace-pre-wrap text-xs">{basePrompt}</pre>
          </div>
        </section>
      )}

      <ChapterManager basePrompt={basePrompt} onUpdateChapters={setChapters} />

      <ExportPanel meta={meta} chapters={chapters} />

      <footer className="mx-auto max-w-6xl px-6 pb-8 text-center text-xs text-gray-500">
        <p>
          Built for long-form, chapter-by-chapter writing with a required human editing step. Follow the checklist before publishing to KDP.
        </p>
      </footer>
    </div>
  )
}

export default App
