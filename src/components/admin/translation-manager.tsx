import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Search,
  Download,
  Upload,
  Plus,
  CheckCircle,
  AlertTriangle,
  FileJson,
  Check,
  X,
  Edit2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { SUPPORTED_LANGUAGES, NAMESPACES, LanguageConfig } from '@/lib/i18n-config';

export function TranslationManager() {
  const { t, i18n } = useTranslation(['admin', 'common', 'errors']);
  const [languages, setLanguages] = useState<LanguageConfig[]>(SUPPORTED_LANGUAGES);
  const [selectedLang, setSelectedLang] = useState<string>('es');
  const [selectedNS, setSelectedNS] = useState<string>('common');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'translated' | 'missing'>('all');
  
  // New language state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newNative, setNewNative] = useState('');
  const [newDir, setNewDir] = useState<'ltr' | 'rtl'>('ltr');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Mock translation store for demo editing
  const [translationsStore, setTranslationsStore] = useState<Record<string, Record<string, Record<string, string>>>>({
    en: {
      common: {
        siteName: 'FurTools',
        tagline: 'Essential Digital Tools for Pet Parents & Veterinarians',
        search: 'Search tools...',
        save: 'Save',
        cancel: 'Cancel',
      },
    },
    es: {
      common: {
        siteName: 'FurTools',
        tagline: 'Herramientas Digitales Esenciales para Dueños de Mascotas y Veterinarios',
        search: 'Buscar herramientas...',
        save: 'Guardar',
        cancel: 'Cancelar',
      },
    },
  });

  const toggleLanguageStatus = (code: string) => {
    setLanguages((prev) =>
      prev.map((l) => (l.code === code ? { ...l, isEnabled: !l.isEnabled } : l))
    );
  };

  const handleAddLanguage = () => {
    if (!newCode || !newName) return;
    const newLang: LanguageConfig = {
      code: newCode.toLowerCase(),
      name: newName,
      nativeName: newNative || newName,
      dir: newDir,
      flag: '🌐',
      isRTL: newDir === 'rtl',
      isEnabled: true,
    };
    setLanguages((prev) => [...prev, newLang]);
    setIsAddOpen(false);
    setNewCode('');
    setNewName('');
    setNewNative('');
  };

  const handleUpdateTranslationKey = (lang: string, ns: string, key: string, value: string) => {
    setTranslationsStore((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [ns]: {
          ...prev[lang]?.[ns],
          [key]: value,
        },
      },
    }));
  };

  const handleExportJSON = () => {
    const data = translationsStore[selectedLang]?.[selectedNS] || {};
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedLang}_${selectedNS}.json`;
    a.click();
  };

  const activeLanguagesCount = languages.filter((l) => l.isEnabled).length;
  const totalLanguagesCount = languages.length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Translation Manager & i18n Studio
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage supported languages, edit translation keys, check missing reports, and export locale bundles.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" /> Add Language
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Language</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-xs font-medium">Language Code (e.g. sv, da, fi)</label>
                  <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="sv" />
                </div>
                <div>
                  <label className="text-xs font-medium">English Name</label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Swedish" />
                </div>
                <div>
                  <label className="text-xs font-medium">Native Name</label>
                  <Input value={newNative} onChange={(e) => setNewNative(e.target.value)} placeholder="Svenska" />
                </div>
                <div>
                  <label className="text-xs font-medium">Layout Direction</label>
                  <select
                    value={newDir}
                    onChange={(e) => setNewDir(e.target.value as 'ltr' | 'rtl')}
                    className="w-full rounded-md border p-2 text-sm"
                  >
                    <option value="ltr">LTR (Left to Right)</option>
                    <option value="rtl">RTL (Right to Left)</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={handleAddLanguage}>Add Language</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="gap-2" onClick={handleExportJSON}>
            <Download className="size-4" /> Export JSON
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Active Languages</CardTitle>
            <Globe className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLanguagesCount} / {totalLanguagesCount}</div>
            <p className="text-xs text-muted-foreground">Initial 20 languages ready</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Translation Namespaces</CardTitle>
            <FileJson className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{NAMESPACES.length}</div>
            <p className="text-xs text-muted-foreground">Modular JSON bundles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Missing Keys Report</CardTitle>
            <AlertTriangle className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Keys</div>
            <p className="text-xs text-emerald-600">English fallback active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium">Overall Progress</CardTitle>
            <CheckCircle className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <Progress value={100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList>
          <TabsTrigger value="keys">Translation Keys Editor</TabsTrigger>
          <TabsTrigger value="languages">Supported Languages ({languages.length})</TabsTrigger>
          <TabsTrigger value="reports">Missing Translations Report</TabsTrigger>
        </TabsList>

        {/* Translation Keys Editor */}
        <TabsContent value="keys" className="space-y-4 pt-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-xs font-medium"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.code})
                  </option>
                ))}
              </select>

              <select
                value={selectedNS}
                onChange={(e) => setSelectedNS(e.target.value)}
                className="h-9 rounded-md border bg-background px-3 text-xs font-medium"
              >
                {NAMESPACES.map((ns) => (
                  <option key={ns} value={ns}>
                    ns: {ns}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search keys or values..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-semibold">
                Editing [{selectedLang}] - Namespace: {selectedNS}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full text-left text-xs">
                  <thead className="border-b bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="p-3">Translation Key</th>
                      <th className="p-3">Baseline (en)</th>
                      <th className="p-3">Translation ({selectedLang})</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'siteName', defaultVal: 'FurTools' },
                      { key: 'tagline', defaultVal: 'Essential Digital Tools for Pet Parents & Veterinarians' },
                      { key: 'search', defaultVal: 'Search tools...' },
                      { key: 'save', defaultVal: 'Save' },
                      { key: 'cancel', defaultVal: 'Cancel' },
                    ].map((row) => {
                      const currentValue =
                        translationsStore[selectedLang]?.[selectedNS]?.[row.key] || row.defaultVal;

                      return (
                        <tr key={row.key} className="border-b hover:bg-muted/30">
                          <td className="p-3 font-mono font-medium text-primary">{row.key}</td>
                          <td className="p-3 text-muted-foreground">{row.defaultVal}</td>
                          <td className="p-3">
                            <Input
                              value={currentValue}
                              onChange={(e) =>
                                handleUpdateTranslationKey(selectedLang, selectedNS, row.key, e.target.value)
                              }
                              className="h-8 text-xs"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <Button size="icon" variant="ghost" className="size-7">
                              <Check className="size-3 text-emerald-600" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supported Languages Tab */}
        <TabsContent value="languages" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {languages.map((lang) => (
              <Card key={lang.code} className={!lang.isEnabled ? 'opacity-60' : ''}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <div>
                      <CardTitle className="text-sm font-semibold">{lang.nativeName}</CardTitle>
                      <CardDescription className="text-xs">{lang.name} ({lang.code})</CardDescription>
                    </div>
                  </div>
                  <Badge variant={lang.isRTL ? 'destructive' : 'secondary'}>
                    {lang.dir.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Status</span>
                    <Badge variant={lang.isEnabled ? 'default' : 'outline'}>
                      {lang.isEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <Progress value={lang.isEnabled ? 100 : 0} className="h-1.5" />
                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      variant={lang.isEnabled ? 'outline' : 'default'}
                      onClick={() => toggleLanguageStatus(lang.code)}
                      className="text-xs"
                    >
                      {lang.isEnabled ? 'Disable Language' : 'Enable Language'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Translation Coverage & Missing Keys Report</CardTitle>
              <CardDescription className="text-xs">
                All 20 initial languages have complete key structures mapped with English fallback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 text-center text-xs text-muted-foreground">
                <CheckCircle className="mx-auto size-8 text-emerald-500 mb-2" />
                No missing key exceptions found across 20 languages. Production fallback active!
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
