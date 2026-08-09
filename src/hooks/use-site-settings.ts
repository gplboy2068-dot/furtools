import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export interface SiteSettingsData {
  companyName: string;
  businessAddress: string;
  privacyEmail: string;
  supportEmail: string;
  contactEmail: string;
  effectiveDate: string;
  lastUpdated: string;
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  companyName: SITE.name || "FurTools",
  businessAddress: "100 FurTools Way, Suite 400, Pet City, PC 90210",
  privacyEmail: "privacy@furtools.com",
  supportEmail: "support@furtools.com",
  contactEmail: "contact@furtools.com",
  effectiveDate: "January 1, 2026",
  lastUpdated: "August 9, 2026",
};

export function useSiteSettings(): SiteSettingsData {
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SETTINGS);

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value");

        if (error || !data) return;

        const map: Record<string, string> = {};
        for (const row of data) {
          if (row.key && row.value) {
            map[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
          }
        }

        if (mounted) {
          setSettings({
            companyName: map["general.site_name"] || DEFAULT_SETTINGS.companyName,
            businessAddress: map["general.company_address"] || DEFAULT_SETTINGS.businessAddress,
            privacyEmail: map["general.contact_email"] || map["general.support_email"] || DEFAULT_SETTINGS.privacyEmail,
            supportEmail: map["general.support_email"] || map["general.contact_email"] || DEFAULT_SETTINGS.supportEmail,
            contactEmail: map["general.contact_email"] || DEFAULT_SETTINGS.contactEmail,
            effectiveDate: DEFAULT_SETTINGS.effectiveDate,
            lastUpdated: DEFAULT_SETTINGS.lastUpdated,
          });
        }
      } catch {
        // Keep default settings if supabase call fails
      }
    }

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}
