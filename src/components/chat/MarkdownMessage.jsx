import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const EXTRA_ALLOWED_TAGS = [
  "sub",
  "sup",
  "ins",
  "details",
  "summary",
  "kbd",
  "mark",
  "input",
];

export default function MarkdownMessage({ text = "" }) {
  const value = String(text || "");
  const trimmed = value.trim();
  const schema = useMemo(() => {
    const base = defaultSchema || {};
    return {
      ...base,
      tagNames: Array.from(
        new Set([...(base.tagNames || []), ...EXTRA_ALLOWED_TAGS]),
      ),
      attributes: {
        ...(base.attributes || {}),
        a: Array.from(
          new Set([...(base.attributes?.a || []), "target", "rel"]),
        ),
        img: Array.from(
          new Set([...(base.attributes?.img || []), "src", "alt", "title"]),
        ),
        code: Array.from(
          new Set([...(base.attributes?.code || []), "className"]),
        ),
        details: Array.from(
          new Set([...(base.attributes?.details || []), "open"]),
        ),
        input: Array.from(
          new Set([
            ...(base.attributes?.input || []),
            "type",
            "checked",
            "disabled",
          ]),
        ),
      },
    };
  }, []);

  if (!trimmed) return null;

  return (
    <div className="break-words text-[13px] leading-[1.45] text-inherit">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={{
          a({ href = "", className = "", ...props }) {
            const external = /^https*:\/\//i.test(String(href || ""));
            return (
              <a
                {...props}
                href={href}
                target={external ? "_blank" : props.target}
                rel={external ? "noreferrer noopener" : props.rel}
                className={`underline underline-offset-2 ${className}`.trim()}
              />
            );
          },
          p({ className = "", ...props }) {
            return <p {...props} className={`my-1 ${className}`.trim()} />;
          },
          blockquote({ className = "", ...props }) {
            return (
              <blockquote
                {...props}
                className={[
                  "my-1 pl-3",
                  "shadow-[inset_3px_0_0_rgba(148,163,184,0.75)] dark:shadow-[inset_3px_0_0_rgba(255,255,255,0.12)]",
                  "opacity-95",
                  className,
                ]
                  .join(" ")
                  .trim()}
              />
            );
          },
          pre({ className = "", ...props }) {
            return (
              <pre
                {...props}
                className={[
                  "my-1 overflow-x-auto rounded-xl bg-[#0b1020] p-3 text-slate-100",
                  "dark:bg-black/35",
                  className,
                ]
                  .join(" ")
                  .trim()}
              />
            );
          },
          code({ inline = false, className = "", ...props }) {
            if (inline) {
              return (
                <code
                  {...props}
                  className={[
                    "rounded bg-slate-900/5 px-1 py-0.5 font-mono text-[0.92em]",
                    "dark:bg-black/35",
                    className,
                  ]
                    .join(" ")
                    .trim()}
                />
              );
            }
            return (
              <code {...props} className={`font-mono ${className}`.trim()} />
            );
          },
          table({ className = "", ...props }) {
            return (
              <table
                {...props}
                className={`my-2 w-full border-collapse text-[12px] ${className}`.trim()}
              />
            );
          },
          th({ className = "", ...props }) {
            return (
              <th
                {...props}
                className={[
                  "bg-slate-900/5 font-bold",
                  "shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35)] dark:bg-white/5 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
                  "px-2 py-1 text-left align-top",
                  className,
                ]
                  .join(" ")
                  .trim()}
              />
            );
          },
          td({ className = "", ...props }) {
            return (
              <td
                {...props}
                className={[
                  "shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
                  "px-2 py-1 align-top",
                  className,
                ]
                  .join(" ")
                  .trim()}
              />
            );
          },
          img({ className = "", ...props }) {
            return (
              <img
                {...props}
                className={`max-w-full rounded-xl shadow-borderless dark:shadow-borderlessDark ${className}`.trim()}
                loading="lazy"
              />
            );
          },
          input({ type = "checkbox", checked = false, ...props }) {
            return (
              <input
                {...props}
                type={type}
                checked={Boolean(checked)}
                disabled
                readOnly
                className="mr-2 align-middle accent-gtBlue"
              />
            );
          },
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
}
