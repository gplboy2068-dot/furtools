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
          ul: ({ children }) => <ul className="mb-3.5 space-y-2 pl-5 list-disc text-sm">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 space-y-3 pl-5 list-decimal text-sm font-medium">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed text-sm font-normal text-foreground/90">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          h1: ({ children }) => <h1 className="mt-5 mb-2.5 font-display text-lg font-bold tracking-tight text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-4 mb-2 font-display text-base font-bold tracking-tight text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-3.5 mb-1.5 font-display text-sm font-semibold text-foreground">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="my-3.5 border-l-3 border-primary/60 bg-muted/40 py-2 pl-3.5 pr-2 rounded-r-md italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted/80 px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
              {children}
            </code>
          ),
          hr: () => <hr className="my-4 border-border/60" />,
          table: ({ children }) => (
            <div className="my-4 w-full overflow-x-auto rounded-xl border border-border/80 bg-background shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/80 text-muted-foreground font-semibold border-b border-border/80">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody className="divide-y divide-border/50">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-muted/30 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-3.5 py-2.5 font-semibold text-foreground whitespace-nowrap">{children}</th>,
          td: ({ children }) => <td className="px-3.5 py-2.5 text-foreground/90 align-top">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
