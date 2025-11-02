import React from 'react'

export default function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              eBook Studio – Prompt-to-Book Builder
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Plan your book, generate expert prompts, draft chapter-by-chapter, and export a
              market-ready manuscript for Amazon KDP.
            </p>
          </div>
          <div className="rounded-xl bg-indigo-50 text-indigo-700 px-4 py-3 text-sm shadow-sm">
            <p className="font-semibold">Workflow</p>
            <p>1) Define book → 2) Plan chapters → 3) Draft & edit → 4) Export</p>
          </div>
        </div>
      </div>
    </header>
  )
}
