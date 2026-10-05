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
import { getActiveLanguage, setWebsiteLanguage, NATIVE_LANGUAGES } from '@/lib/google-translate';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'select' | 'compact';
  className?: string;
}

// Only languages with complete native translations are offered.
const AVAILABLE = SUPPORTED_LANGUAGES.filter((l) =>
  (NATIVE_LANGUAGES as readonly string[]).includes(l.code)
);

export function LanguageSwitcher({ variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const [currentLangCode, setCurrentLangCode] = useState('en');

  useEffect(() => {
    setCurrentLangCode(getActiveLanguage());
  }, []);

  const currentLang =
    AVAILABLE.find((l) => l.code === currentLangCode) || AVAILABLE[0];

  const handleLanguageChange = (lang: LanguageConfig) => {
    setCurrentLangCode(lang.code);
    setWebsiteLanguage(lang.code);
  };

  if (variant === 'select') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <Globe className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
        <select
          value={currentLang.code}
          onChange={(e) => {
            const selected = AVAILABLE.find((l) => l.code === e.target.value);
            if (selected) handleLanguageChange(selected);
          }}
          className="h-9 w-full rounded-md border border-input bg-background py-1.5 pr-3 pl-9 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          aria-label="Select language"
        >
          {AVAILABLE.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
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
          <span className="hidden sm:inline">{currentLang.flag} {currentLang.nativeName}</span>
          <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {AVAILABLE.map((lang) => {
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
              </span>
              {isSelected && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
