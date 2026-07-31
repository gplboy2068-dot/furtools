import { createFileRoute } from '@tanstack/react-router';
import { TranslationManager } from '@/components/admin/translation-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const Route = createFileRoute('/admin/translations')({
  head: () => ({
    meta: [
      { title: 'Translation Manager — FurTools Admin' },
      { name: 'robots', content: 'noindex,nofollow' },
    ],
  }),
  errorComponent: ({ error, reset }) => (
    <Card className="m-6 border-amber-500/50 bg-amber-500/10">
      <CardHeader>
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
          <CardTitle className="text-base font-semibold">Translation Manager Error</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          An error occurred while rendering the Translation Manager: <code className="font-mono text-xs text-foreground">{error?.message || String(error)}</code>
        </p>
        <Button size="sm" onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </CardContent>
    </Card>
  ),
  component: AdminTranslationsPage,
});

function AdminTranslationsPage() {
  return <TranslationManager />;
}
