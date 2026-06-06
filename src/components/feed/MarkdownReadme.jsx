import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import CodeBlock from "../ui/CodeBlock";
import remarkEmoji from "remark-emoji";
import remarkSupersub from "remark-supersub";
import remarkIns from "remark-ins";
import { remarkHighlightMark } from "remark-highlight-mark";
import remarkDeflist from "remark-deflist";
import remarkDirective from "remark-directive";
import remarkContainerDirective from "../../lib/remarkContainerDirective";
import remarkAbbr from "@syenchuk/remark-abbr";

export default function MarkdownReadme({ content = "" }) {
  const safe = String(content || "");
  if (!safe.trim()) return null;

  const schema = useMemo(() => {
    const base = defaultSchema || {};
    return {
      ...base,
      tagNames: [...(base.tagNames || []), "img", "ins", "mark", "sup", "sub", "abbr", "dl", "dt", "dd"],
      attributes: {
        ...(base.attributes || {}),
        img: [...new Set([...(base.attributes?.img || []), "src", "alt", "title", "width", "height", "loading"])],
      },
    };
  }, []);

  return (
    <div className="prose prose-sm max-w-none prose-slate dark:prose-invert prose-headings:font-semibold prose-pre:rounded-xl prose-pre:bg-slate-900 prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[
          [remarkGfm, { singleTilde: false }],
          remarkSmartypants,
          remarkEmoji,
          remarkSupersub,
          remarkIns,
          remarkHighlightMark,
          remarkDeflist,
          remarkDirective,
          remarkContainerDirective,
          remarkAbbr,
        ]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={{
          img({ src, alt, title, ...props }) {
            return (
              <img
                src={src}
                alt={alt || ""}
                title={title}
                loading="lazy"
                className="max-w-full rounded-xl"
                {...props}
              />
            );
          },
          code({ inline, className, children, ...props }) {
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock className={className} {...props}>
                {children}
              </CodeBlock>
            );
          },
        }}
      >
        {safe}
      </ReactMarkdown>
    </div>
  );
}
