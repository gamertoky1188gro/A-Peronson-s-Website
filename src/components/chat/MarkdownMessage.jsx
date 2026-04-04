import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

const EXTRA_ALLOWED_TAGS = ['sub', 'sup', 'ins', 'details', 'summary', 'kbd', 'mark', 'input']

export default function MarkdownMessage({ text = '' }) {
  const value = String(text || '')
  const trimmed = value.trim()
  const schema = useMemo(() => {
    const base = defaultSchema || {}
    return {
      ...base,
      tagNames: Array.from(new Set([...(base.tagNames || []), ...EXTRA_ALLOWED_TAGS])),
      attributes: {
        ...(base.attributes || {}),
        a: Array.from(new Set([...(base.attributes?.a || []), 'target', 'rel'])),
        img: Array.from(new Set([...(base.attributes?.img || []), 'src', 'alt', 'title'])),
        code: Array.from(new Set([...(base.attributes?.code || []), 'className'])),
        details: Array.from(new Set([...(base.attributes?.details || []), 'open'])),
        input: Array.from(new Set([...(base.attributes?.input || []), 'type', 'checked', 'disabled'])),
      },
    }
  }, [])

  if (!trimmed) return null

  return (
    <div className="chat-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={{
          a({ href = '', className='', ...props }) {
            const external = /^https*:\/\//i.test(String(href || ''))
            return (
              <a
                {...props}
                href={href}
                target={external ? '_blank' : props.target}
                rel={external ? 'noreferrer noopener' : props.rel}
                className={`underline underline-offset-2 ${className}`.trim()}
              />
            )
          },
        img({ className='', ...props }) {
          return (
            <img
              {...props}
              className={`max-w-full rounded-xl borderless-shadow ${className}`.trim()}
              loading="lazy"
            />
          )
        },
        input({ type = 'checkbox', checked = false, ...props }) {
          return (
            <input
              {...props}
              type={type}
              checked={Boolean(checked)}
              disabled
              readOnly
              className="mr-2 align-middle"
            />
          )
        },
      }}
    >
      {value}
    </ReactMarkdown>
    </div>
  )
}
