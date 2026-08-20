import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export function FormattedMarkdown({ content, className = "" }: FormattedMarkdownProps) {
  return (
    <div className={`text-foreground leading-relaxed text-sm ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-3.5 leading-relaxed text-sm last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-3.5 space-y-1.5 pl-5 list-disc text-sm">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 space-y-2 pl-5 list-decimal text-sm font-medium">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed text-sm font-normal text-foreground/90">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          h1: ({ children }) => <h1 className="mt-5 mb-2.5 font-display text-lg font-bold tracking-tight text-foreground border-b pb-1">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-4 mb-2 font-display text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-3.5 mb-1.5 font-display text-sm font-semibold text-foreground">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="my-3.5 border-l-4 border-primary/70 bg-primary/5 py-2.5 pl-4 pr-3 rounded-r-xl italic text-muted-foreground text-xs sm:text-sm">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className && typeof children === "string" && !children.includes("\n");
            if (isInline) {
              return (
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                  {children}
                </code>
              );
            }
            return (
              <pre className="my-3.5 overflow-x-auto rounded-xl border border-border/80 bg-muted/60 p-3.5 font-mono text-xs text-foreground">
                <code>{children}</code>
              </pre>
            );
          },
          hr: () => <hr className="my-4 border-border/60" />,
          table: ({ children }) => (
            <div className="my-4 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">{children}</table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/90 text-foreground font-semibold border-b border-border text-xs uppercase tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody className="divide-y divide-border/60 bg-card">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-muted/40 transition-colors even:bg-muted/15">{children}</tr>,
          th: ({ children }) => <th className="px-4 py-3 font-bold text-foreground whitespace-nowrap">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3 text-foreground/90 align-top leading-normal">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

