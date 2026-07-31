import { createFileRoute } from '@tanstack/react-router';
import { TranslationManager } from '@/components/admin/translation-manager';

export const Route = createFileRoute('/admin/translations')({
  head: () => ({
    meta: [
      { title: 'Translation Manager — FurTools Admin' },
      { name: 'robots', content: 'noindex,nofollow' },
    ],
  }),
  component: AdminTranslationsPage,
});

function AdminTranslationsPage() {
  return <TranslationManager />;
}
