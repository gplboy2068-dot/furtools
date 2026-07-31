import ReactMarkdown from "react-markdown";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export function FormattedMarkdown({ content, className = "" }: FormattedMarkdownProps) {
  return (
    <div className={`text-foreground leading-relaxed text-sm ${className}`}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-3.5 leading-relaxed text-sm last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-3.5 space-y-1.5 pl-5 list-disc text-sm">{children}</ul>,
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
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
              {children}
            </code>
          ),
          hr: () => <hr className="my-4 border-border/60" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
