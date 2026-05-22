import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css'
import { resolveImagePath } from '../../utils/imageResolver'
import type { Annotation } from '../../types'
import { AnnotatedTerm } from './AnnotatedTerm'
import { ReactNode } from 'react'

interface Props {
  content: string
  lessonId: string
  annotations?: Annotation[]
}

export function MarkdownRenderer({ content, lessonId, annotations = [] }: Props) {
  function annotateText(text: string): ReactNode[] {
    if (!annotations.length) return [text]

    const parts: ReactNode[] = []
    let remaining = text
    let key = 0

    while (remaining.length > 0) {
      let earliestMatch: { index: number; length: number; annotation: Annotation } | null = null

      for (const ann of annotations) {
        const regex = new RegExp(ann.pattern)
        const match = regex.exec(remaining)
        if (match && (!earliestMatch || match.index < earliestMatch.index)) {
          earliestMatch = { index: match.index, length: match[0].length, annotation: ann }
        }
      }

      if (!earliestMatch) {
        parts.push(remaining)
        break
      }

      if (earliestMatch.index > 0) {
        parts.push(remaining.slice(0, earliestMatch.index))
      }

      parts.push(
        <AnnotatedTerm key={key++} annotation={earliestMatch.annotation}>
          {remaining.slice(earliestMatch.index, earliestMatch.index + earliestMatch.length)}
        </AnnotatedTerm>
      )

      remaining = remaining.slice(earliestMatch.index + earliestMatch.length)
    }

    return parts
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          img: ({ src, alt, ...props }) => (
            <img
              src={resolveImagePath(src, lessonId)}
              alt={alt || ''}
              loading="lazy"
              {...props}
            />
          ),
          p: ({ children, ...props }) => (
            <p {...props}>
              {Array.isArray(children)
                ? children.map((child, i) =>
                    typeof child === 'string' ? <span key={i}>{annotateText(child)}</span> : child
                  )
                : typeof children === 'string'
                ? annotateText(children)
                : children}
            </p>
          ),
          li: ({ children, ...props }) => (
            <li {...props}>
              {Array.isArray(children)
                ? children.map((child, i) =>
                    typeof child === 'string' ? <span key={i}>{annotateText(child)}</span> : child
                  )
                : typeof children === 'string'
                ? annotateText(children)
                : children}
            </li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
