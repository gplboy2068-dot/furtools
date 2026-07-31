import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SUPPORTED_LANGUAGES, LanguageConfig } from '@/lib/i18n-config';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'select' | 'compact';
  className?: string;
}

export function LanguageSwitcher({ variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const currentLangCode = i18n.language || 'en';
  
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) ||
    SUPPORTED_LANGUAGES.find((l) => l.code === 'en') ||
    SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (lang: LanguageConfig) => {
    i18n.changeLanguage(lang.code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('furtools_lang', lang.code);
      document.cookie = `furtools_lang=${lang.code}; path=/; max-age=31536000`;
      
      // Update HTML lang and dir
      document.documentElement.lang = lang.code;
      document.documentElement.dir = lang.dir;
    }
  };

  if (variant === 'select') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <Globe className="absolute left-3 size-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
        <select
          value={currentLang.code}
          onChange={(e) => {
            const selected = SUPPORTED_LANGUAGES.find((l) => l.code === e.target.value);
            if (selected) handleLanguageChange(selected);
          }}
          className="h-9 w-full rounded-md border border-input bg-background py-1.5 pr-3 pl-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary rtl:pr-9 rtl:pl-3"
          aria-label="Select language"
        >
          {SUPPORTED_LANGUAGES.filter((l) => l.isEnabled).map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === 'compact' ? 'sm' : 'default'}
          className={`gap-2 rounded-full px-3 text-xs font-medium ${className}`}
          aria-label="Change language"
        >
          <Globe className="size-4" />
          <span className="hidden sm:inline">{currentLang.nativeName}</span>
          <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-56 overflow-y-auto">
        {SUPPORTED_LANGUAGES.filter((l) => l.isEnabled).map((lang) => {
          const isSelected = currentLang.code === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className="flex items-center justify-between text-xs cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span className="font-medium">{lang.nativeName}</span>
                <span className="text-muted-foreground text-[10px]">({lang.name})</span>
              </span>
              {isSelected && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
