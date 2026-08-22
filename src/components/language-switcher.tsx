import { useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SUPPORTED_LANGUAGES, LanguageConfig } from '@/lib/i18n-config';
import { getActiveLanguage, setWebsiteLanguage } from '@/lib/google-translate';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'select' | 'compact';
  className?: string;
}

export function LanguageSwitcher({ variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const [currentLangCode, setCurrentLangCode] = useState('en');

  useEffect(() => {
    setCurrentLangCode(getActiveLanguage());
  }, []);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) ||
    SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === currentLangCode.toLowerCase()) ||
    SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (lang: LanguageConfig) => {
    setCurrentLangCode(lang.code);
    setWebsiteLanguage(lang.code);
  };

  if (variant === 'select') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <Globe className="absolute left-3 size-4 text-muted-foreground rtl:right-3 rtl:left-auto pointer-events-none" />
        <select
          value={currentLang.code}
          onChange={(e) => {
            const selected = SUPPORTED_LANGUAGES.find((l) => l.code === e.target.value);
            if (selected) handleLanguageChange(selected);
          }}
          className="h-9 w-full rounded-md border border-input bg-background py-1.5 pr-3 pl-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary rtl:pr-9 rtl:pl-3 notranslate cursor-pointer"
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
          className={`gap-2 rounded-full px-3 text-xs font-medium notranslate ${className}`}
          aria-label="Change language"
        >
          <Globe className="size-4" />
          <span className="hidden sm:inline notranslate">{currentLang.flag} {currentLang.nativeName}</span>
          <span className="sm:hidden notranslate">{currentLang.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-56 overflow-y-auto notranslate">
        {SUPPORTED_LANGUAGES.filter((l) => l.isEnabled).map((lang) => {
          const isSelected = currentLang.code === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className="flex items-center justify-between text-xs cursor-pointer notranslate"
            >
              <span className="flex items-center gap-2 notranslate">
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
