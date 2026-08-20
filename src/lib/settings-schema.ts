// Central schema for the admin Settings page.
// Every field maps to a row in public.site_settings (key -> jsonb value).
// Keep field IDs stable — they are the database keys.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "email"
  | "url"
  | "password"
  | "color"
  | "tags"
  | "json";

export interface SettingField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  defaultValue?: unknown;
  secret?: boolean; // masked; hint that value is stored but may live in secrets manager
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface SettingSection {
  id: string;
  label: string;
  description?: string;
  fields: SettingField[];
}

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
].map((v) => ({ value: v, label: v }));

const DATE_FORMATS = ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "MMM D, YYYY", "D MMM YYYY"].map(
  (v) => ({ value: v, label: v }),
);
const TIME_FORMATS = [
  { value: "24h", label: "24-hour (14:30)" },
  { value: "12h", label: "12-hour (2:30 PM)" },
];
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
];
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "SGD"].map((v) => ({
  value: v,
  label: v,
}));
const UNIT_SYSTEMS = [
  { value: "metric", label: "Metric (kg, cm)" },
  { value: "imperial", label: "Imperial (lb, in)" },
];
const SPECIES = [
  "dog",
  "cat",
  "bird",
  "rabbit",
  "fish",
  "hamster",
  "guinea-pig",
  "ferret",
  "turtle",
  "snake",
  "lizard",
  "horse",
  "goat",
  "sheep",
  "chicken",
  "duck",
].map((v) => ({ value: v, label: v.replace("-", " ") }));

export const SETTINGS_SECTIONS: SettingSection[] = [
  {
    id: "general",
    label: "General",
    description: "Core identity and defaults for the site.",
    fields: [
      { key: "general.site_name", label: "Website Name", type: "text", defaultValue: "FurTools" },
      { key: "general.site_logo", label: "Website Logo URL", type: "url" },
      { key: "general.favicon", label: "Favicon URL", type: "url" },
      { key: "general.site_description", label: "Site Description", type: "textarea", rows: 3 },
      { key: "general.site_url", label: "Website URL", type: "url" },
      { key: "general.contact_email", label: "Contact Email", type: "email" },
      { key: "general.support_email", label: "Support Email", type: "email" },
      { key: "general.phone_number", label: "Phone Number", type: "text" },
      { key: "general.company_address", label: "Company Address", type: "textarea", rows: 3 },
      { key: "general.timezone", label: "Timezone", type: "select", options: TIMEZONES, defaultValue: "UTC" },
      { key: "general.language", label: "Language", type: "select", options: LANGUAGES, defaultValue: "en" },
      { key: "general.date_format", label: "Date Format", type: "select", options: DATE_FORMATS, defaultValue: "YYYY-MM-DD" },
      { key: "general.time_format", label: "Time Format", type: "select", options: TIME_FORMATS, defaultValue: "24h" },
      { key: "general.maintenance_mode", label: "Maintenance Mode", type: "boolean", defaultValue: false },
      { key: "general.announcement_bar", label: "Announcement Bar Text", type: "text" },
      { key: "general.custom_css", label: "Custom CSS", type: "textarea", rows: 6 },
      { key: "general.custom_js", label: "Custom JavaScript", type: "textarea", rows: 6 },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    description: "Global SEO defaults applied when a page has no override.",
    fields: [
      { key: "seo.meta_title", label: "Global Meta Title", type: "text" },
      { key: "seo.meta_description", label: "Global Meta Description", type: "textarea", rows: 3 },
      { key: "seo.meta_keywords", label: "Meta Keywords", type: "tags" },
      {
        key: "seo.robots",
        label: "Robots Meta",
        type: "select",
        options: [
          { value: "index,follow", label: "index, follow" },
          { value: "noindex,follow", label: "noindex, follow" },
          { value: "index,nofollow", label: "index, nofollow" },
          { value: "noindex,nofollow", label: "noindex, nofollow" },
        ],
        defaultValue: "index,follow",
      },
      { key: "seo.canonical_base", label: "Canonical Base URL", type: "url" },
      { key: "seo.og_default_title", label: "Open Graph Default Title", type: "text" },
      { key: "seo.og_default_description", label: "Open Graph Default Description", type: "textarea", rows: 2 },
      { key: "seo.og_default_image", label: "Default OG Image URL", type: "url" },
      { key: "seo.twitter_handle", label: "Twitter/X Handle", type: "text", placeholder: "@furtools" },
      { key: "seo.twitter_card", label: "Twitter Card Type", type: "select", options: [
        { value: "summary", label: "summary" },
        { value: "summary_large_image", label: "summary_large_image" },
      ], defaultValue: "summary_large_image" },
      { key: "seo.schema_org_type", label: "Organization Schema Type", type: "select", options: [
        { value: "Organization", label: "Organization" },
        { value: "Corporation", label: "Corporation" },
        { value: "LocalBusiness", label: "LocalBusiness" },
      ], defaultValue: "Organization" },
      { key: "seo.organization_name", label: "Organization Name", type: "text" },
      { key: "seo.organization_logo", label: "Organization Logo URL", type: "url" },
      { key: "seo.website_schema_enabled", label: "Enable Website Schema", type: "boolean", defaultValue: true },
      { key: "seo.default_author", label: "Default Author", type: "text" },
      { key: "seo.auto_sitemap", label: "Auto-generate Sitemap", type: "boolean", defaultValue: true },
      { key: "seo.auto_robots", label: "Auto-generate robots.txt", type: "boolean", defaultValue: true },
      { key: "seo.auto_breadcrumb", label: "Auto Breadcrumb Schema", type: "boolean", defaultValue: true },
      { key: "seo.indexing_enabled", label: "Allow Search Engine Indexing", type: "boolean", defaultValue: true },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    fields: [
      { key: "blog.posts_per_page", label: "Posts Per Page", type: "number", min: 1, max: 100, defaultValue: 12 },
      { key: "blog.default_author", label: "Default Author", type: "text" },
      { key: "blog.default_category", label: "Default Category", type: "text" },
      { key: "blog.comments_enabled", label: "Enable Comments", type: "boolean", defaultValue: false },
      { key: "blog.related_posts", label: "Related Posts Count", type: "number", min: 0, max: 20, defaultValue: 4 },
      { key: "blog.featured_posts", label: "Featured Posts Count", type: "number", min: 0, max: 20, defaultValue: 3 },
      { key: "blog.reading_time", label: "Show Reading Time", type: "boolean", defaultValue: true },
      { key: "blog.social_share", label: "Show Social Share Buttons", type: "boolean", defaultValue: true },
      { key: "blog.newsletter_widget", label: "Show Newsletter Widget", type: "boolean", defaultValue: true },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    fields: [
      { key: "tools.enabled_categories", label: "Enabled Categories (comma-separated slugs)", type: "tags" },
      { key: "tools.disabled_tools", label: "Disabled Tool Slugs", type: "tags" },
      { key: "tools.related_count", label: "Related Tools Count", type: "number", min: 0, max: 20, defaultValue: 6 },
      { key: "tools.popular_tools", label: "Popular Tool Slugs", type: "tags" },
      { key: "tools.featured_tools", label: "Featured Tool Slugs", type: "tags" },
      { key: "tools.sort_order", label: "Default Sort", type: "select", options: [
        { value: "popular", label: "Popular" },
        { value: "newest", label: "Newest" },
        { value: "alphabetical", label: "Alphabetical" },
      ], defaultValue: "popular" },
      { key: "tools.calculator_precision", label: "Calculator Decimal Places", type: "number", min: 0, max: 6, defaultValue: 2 },
      { key: "tools.default_units", label: "Default Measurement Units", type: "select", options: UNIT_SYSTEMS, defaultValue: "metric" },
    ],
  },
  {
    id: "breeds",
    label: "Breeds",
    fields: [
      { key: "breeds.enabled_species", label: "Enabled Species", type: "tags", defaultValue: SPECIES.map((s) => s.value) },
      { key: "breeds.default_image", label: "Default Breed Image URL", type: "url" },
      { key: "breeds.related_count", label: "Related Breeds Count", type: "number", min: 0, max: 20, defaultValue: 6 },
      { key: "breeds.comparison_max", label: "Max Breeds in Comparison", type: "number", min: 2, max: 6, defaultValue: 3 },
      { key: "breeds.url_structure", label: "Breed URL Structure", type: "select", options: [
        { value: "/breeds/:slug", label: "/breeds/:slug" },
        { value: "/:species/breeds/:slug", label: "/:species/breeds/:slug" },
      ], defaultValue: "/breeds/:slug" },
    ],
  },
  {
    id: "content",
    label: "Content",
    fields: [
      { key: "content.faq_enabled", label: "Show FAQs Site-wide", type: "boolean", defaultValue: true },
      { key: "content.author_box", label: "Show Author Box", type: "boolean", defaultValue: true },
      { key: "content.disclaimer", label: "General Disclaimer", type: "textarea", rows: 3 },
      { key: "content.medical_disclaimer", label: "Medical Disclaimer", type: "textarea", rows: 4 },
      { key: "content.affiliate_disclosure", label: "Affiliate Disclosure", type: "textarea", rows: 3 },
      { key: "content.copyright", label: "Copyright Notice", type: "text", defaultValue: "© FurTools. All rights reserved." },
      { key: "content.footer_text", label: "Footer Text", type: "textarea", rows: 2 },
      { key: "content.cookie_banner", label: "Cookie Banner Text", type: "textarea", rows: 2 },
    ],
  },
  {
    id: "email",
    label: "Email",
    fields: [
      { key: "email.mail_provider", label: "Mail Provider", type: "select", options: [
        { value: "resend", label: "Resend" },
        { value: "sendgrid", label: "SendGrid" },
        { value: "mailgun", label: "Mailgun" },
        { value: "postmark", label: "Postmark" },
        { value: "smtp", label: "Custom SMTP" },
      ], defaultValue: "resend" },
      { key: "email.smtp_host", label: "SMTP Host", type: "text" },
      { key: "email.smtp_port", label: "SMTP Port", type: "number", defaultValue: 587 },
      { key: "email.smtp_user", label: "SMTP Username", type: "text" },
      { key: "email.smtp_pass", label: "SMTP Password", type: "password", secret: true },
      { key: "email.from_name", label: "From Name", type: "text", defaultValue: "FurTools" },
      { key: "email.from_email", label: "From Email", type: "email" },
      { key: "email.admin_email", label: "Admin Email", type: "email" },
      { key: "email.contact_email", label: "Contact Form Email", type: "email" },
      { key: "email.newsletter_email", label: "Newsletter From Email", type: "email" },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    fields: [
      { key: "notifications.email_enabled", label: "Enable Email Notifications", type: "boolean", defaultValue: true },
      { key: "notifications.reminders_enabled", label: "Enable Reminder Emails", type: "boolean", defaultValue: true },
      { key: "notifications.admin_alerts", label: "Enable Admin Notifications", type: "boolean", defaultValue: true },
      { key: "notifications.new_user_alerts", label: "New User Signup Alerts", type: "boolean", defaultValue: true },
      { key: "notifications.error_alerts", label: "Error / Exception Alerts", type: "boolean", defaultValue: true },
    ],
  },
  {
    id: "ai",
    label: "AI",
    fields: [
      { key: "ai.openai_key", label: "OpenAI API Key", type: "password", secret: true },
      { key: "ai.gemini_key", label: "Gemini API Key", type: "password", secret: true },
      { key: "ai.anthropic_key", label: "Anthropic API Key", type: "password", secret: true },
      { key: "ai.openrouter_key", label: "OpenRouter API Key", type: "password", secret: true, placeholder: "sk-or-..." },
      { key: "ai.deepseek_key", label: "DeepSeek API Key", type: "password", secret: true, placeholder: "sk-..." },
      { key: "ai.deepseek_base_url", label: "DeepSeek Base URL", type: "text", defaultValue: "https://api.deepseek.com/v1", placeholder: "https://api.deepseek.com/v1" },
      { key: "ai.deepseek_model", label: "DeepSeek Default Model", type: "select", options: [
        { value: "deepseek-chat", label: "deepseek-chat (V3)" },
        { value: "deepseek-reasoner", label: "deepseek-reasoner (R1)" },
        { value: "deepseek-v4", label: "deepseek-v4 (V4)" },
      ], defaultValue: "deepseek-chat" },
      { key: "ai.default_provider", label: "Default AI Provider", type: "select", options: [
        { value: "gemini", label: "Google Gemini" },
        { value: "openai", label: "OpenAI" },
        { value: "anthropic", label: "Anthropic Claude" },
        { value: "deepseek", label: "DeepSeek" },
        { value: "openrouter", label: "OpenRouter" },
        { value: "lovable", label: "Lovable AI Gateway" },
      ], defaultValue: "gemini" },
      { key: "ai.default_model", label: "Default Model", type: "text", defaultValue: "google/gemini-2.5-flash" },
      { key: "ai.temperature", label: "Temperature", type: "number", min: 0, max: 2, step: 0.1, defaultValue: 0.7 },
      { key: "ai.max_tokens", label: "Max Tokens", type: "number", min: 64, max: 32000, defaultValue: 2048 },
      { key: "ai.system_prompt", label: "Default System Prompt", type: "textarea", rows: 5 },
      { key: "ai.disclaimer", label: "AI Disclaimer", type: "textarea", rows: 3 },
    ],
  },
  {
    id: "ads",
    label: "Advertising",
    fields: [
      { key: "ads.adsense_client", label: "Google AdSense Client ID", type: "text", placeholder: "ca-pub-XXXXXXXXXXXXXXXX" },
      { key: "ads.enabled", label: "Enable Ads Site-wide", type: "boolean", defaultValue: false },
      { key: "ads.header_slot", label: "Header Ad Slot ID", type: "text" },
      { key: "ads.sidebar_slot", label: "Sidebar Ad Slot ID", type: "text" },
      { key: "ads.in_content_slot", label: "In-content Ad Slot ID", type: "text" },
      { key: "ads.sticky_slot", label: "Sticky Ad Slot ID", type: "text" },
      { key: "ads.footer_slot", label: "Footer Ad Slot ID", type: "text" },
      { key: "ads.frequency", label: "In-content Ad Frequency (paragraphs)", type: "number", min: 1, max: 20, defaultValue: 4 },
    ],
  },
  {
    id: "affiliates",
    label: "Affiliates",
    fields: [
      { key: "affiliate.amazon_tag", label: "Amazon Associate Tag", type: "text" },
      { key: "affiliate.chewy_id", label: "Chewy Publisher ID", type: "text" },
      { key: "affiliate.shareasale_id", label: "ShareASale Merchant ID", type: "text" },
      { key: "affiliate.cj_id", label: "Commission Junction PID", type: "text" },
      { key: "affiliate.impact_id", label: "Impact Campaign ID", type: "text" },
      { key: "affiliate.custom_ids", label: "Other Affiliate IDs (JSON)", type: "json" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    fields: [
      { key: "analytics.ga_id", label: "Google Analytics Measurement ID", type: "text", placeholder: "G-XXXXXXXXXX" },
      { key: "analytics.gtm_id", label: "Google Tag Manager ID", type: "text", placeholder: "GTM-XXXXXXX" },
      { key: "analytics.search_console_id", label: "Search Console Verification", type: "text" },
      { key: "analytics.clarity_id", label: "Microsoft Clarity Project ID", type: "text" },
      { key: "analytics.meta_pixel", label: "Meta Pixel ID", type: "text" },
      { key: "analytics.pinterest_pixel", label: "Pinterest Pixel ID", type: "text" },
      { key: "analytics.tiktok_pixel", label: "TikTok Pixel ID", type: "text" },
      { key: "analytics.custom_head", label: "Custom Tracking Code (<head>)", type: "textarea", rows: 5 },
    ],
  },
  {
    id: "social",
    label: "Social",
    fields: [
      { key: "social.facebook", label: "Facebook URL", type: "url" },
      { key: "social.instagram", label: "Instagram URL", type: "url" },
      { key: "social.x", label: "X (Twitter) URL", type: "url" },
      { key: "social.threads", label: "Threads URL", type: "url" },
      { key: "social.pinterest", label: "Pinterest URL", type: "url" },
      { key: "social.youtube", label: "YouTube URL", type: "url" },
      { key: "social.linkedin", label: "LinkedIn URL", type: "url" },
      { key: "social.tiktok", label: "TikTok URL", type: "url" },
    ],
  },
  {
    id: "media",
    label: "Media",
    fields: [
      { key: "media.max_upload_mb", label: "Max Upload Size (MB)", type: "number", min: 1, max: 500, defaultValue: 10 },
      { key: "media.allowed_types", label: "Allowed File Types", type: "tags", defaultValue: ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg", "pdf"] },
      { key: "media.image_compression", label: "Image Compression Quality (%)", type: "number", min: 10, max: 100, defaultValue: 82 },
      { key: "media.webp_enabled", label: "Serve WebP", type: "boolean", defaultValue: true },
      { key: "media.avif_enabled", label: "Serve AVIF", type: "boolean", defaultValue: false },
      { key: "media.lazy_loading", label: "Lazy Load Images", type: "boolean", defaultValue: true },
      { key: "media.cdn_url", label: "CDN Base URL", type: "url" },
    ],
  },
  {
    id: "cache",
    label: "Cache",
    fields: [
      { key: "cache.image_cache", label: "Enable Image Cache", type: "boolean", defaultValue: true },
      { key: "cache.route_cache", label: "Enable Route Cache", type: "boolean", defaultValue: true },
      { key: "cache.db_cache", label: "Enable Database Cache", type: "boolean", defaultValue: false },
      { key: "cache.redis_url", label: "Redis Connection URL", type: "password", secret: true },
      { key: "cache.ttl_seconds", label: "Cache TTL (seconds)", type: "number", min: 0, max: 604800, defaultValue: 3600 },
    ],
  },
  {
    id: "security",
    label: "Security",
    fields: [
      { key: "security.two_factor", label: "Require 2FA for Admins", type: "boolean", defaultValue: false },
      { key: "security.password_min_length", label: "Password Minimum Length", type: "number", min: 6, max: 64, defaultValue: 10 },
      { key: "security.password_require_symbol", label: "Require Symbol in Password", type: "boolean", defaultValue: true },
      { key: "security.password_require_number", label: "Require Number in Password", type: "boolean", defaultValue: true },
      { key: "security.session_timeout_minutes", label: "Session Timeout (minutes)", type: "number", min: 5, max: 1440, defaultValue: 120 },
      { key: "security.login_attempts", label: "Max Login Attempts", type: "number", min: 3, max: 20, defaultValue: 5 },
      { key: "security.blocked_ips", label: "Blocked IP Addresses", type: "tags" },
      { key: "security.recaptcha_site_key", label: "reCAPTCHA Site Key", type: "text" },
      { key: "security.recaptcha_secret", label: "reCAPTCHA Secret", type: "password", secret: true },
      { key: "security.turnstile_site_key", label: "Cloudflare Turnstile Site Key", type: "text" },
      { key: "security.turnstile_secret", label: "Cloudflare Turnstile Secret", type: "password", secret: true },
    ],
  },
  {
    id: "users",
    label: "Users & Roles",
    fields: [
      { key: "users.allow_signups", label: "Allow Public Signups", type: "boolean", defaultValue: true },
      { key: "users.default_role", label: "Default New User Role", type: "select", options: [
        { value: "user", label: "User" },
        { value: "moderator", label: "Moderator" },
        { value: "author", label: "Author" },
        { value: "editor", label: "Editor" },
      ], defaultValue: "user" },
      { key: "users.roles_enabled", label: "Enabled Roles", type: "tags", defaultValue: ["admin", "editor", "author", "moderator", "user"] },
      { key: "users.perm_admin", label: "Admin Permissions", type: "tags", defaultValue: ["*"] },
      { key: "users.perm_editor", label: "Editor Permissions", type: "tags", defaultValue: ["posts.*", "media.*", "tools.read"] },
      { key: "users.perm_author", label: "Author Permissions", type: "tags", defaultValue: ["posts.create", "posts.update_own"] },
      { key: "users.perm_moderator", label: "Moderator Permissions", type: "tags", defaultValue: ["comments.*", "reports.*"] },
      { key: "users.perm_user", label: "User Permissions", type: "tags", defaultValue: ["profile.*"] },
    ],
  },
  {
    id: "localization",
    label: "Localization",
    fields: [
      { key: "localization.languages", label: "Available Languages", type: "tags", defaultValue: ["en"] },
      { key: "localization.default_country", label: "Default Country (ISO)", type: "text", defaultValue: "US" },
      { key: "localization.currency", label: "Currency", type: "select", options: CURRENCIES, defaultValue: "USD" },
      { key: "localization.units", label: "Measurement System", type: "select", options: UNIT_SYSTEMS, defaultValue: "metric" },
      { key: "localization.date_format", label: "Date Format", type: "select", options: DATE_FORMATS, defaultValue: "YYYY-MM-DD" },
    ],
  },
  {
    id: "backup",
    label: "Backup",
    fields: [
      { key: "backup.db_schedule", label: "Database Backup Schedule (cron)", type: "text", defaultValue: "0 3 * * *" },
      { key: "backup.media_schedule", label: "Media Backup Schedule (cron)", type: "text", defaultValue: "0 4 * * 0" },
      { key: "backup.retention_days", label: "Retention (days)", type: "number", min: 1, max: 365, defaultValue: 30 },
      { key: "backup.storage_url", label: "Backup Storage URL / Bucket", type: "text" },
    ],
  },
  {
    id: "api",
    label: "API",
    fields: [
      { key: "api.rest_enabled", label: "Enable REST API", type: "boolean", defaultValue: true },
      { key: "api.webhook_url", label: "Outgoing Webhook URL", type: "url" },
      { key: "api.webhook_secret", label: "Webhook Signing Secret", type: "password", secret: true },
      { key: "api.rate_limit_per_min", label: "Rate Limit (req/min)", type: "number", min: 1, max: 10000, defaultValue: 120 },
      { key: "api.keys", label: "Issued API Keys (JSON list)", type: "json" },
    ],
  },
  {
    id: "system",
    label: "System",
    fields: [
      { key: "system.version", label: "Application Version", type: "text", defaultValue: "1.0.0" },
      { key: "system.environment", label: "Environment", type: "select", options: [
        { value: "development", label: "Development" },
        { value: "staging", label: "Staging" },
        { value: "production", label: "Production" },
      ], defaultValue: "production" },
      { key: "system.log_level", label: "Log Level", type: "select", options: [
        { value: "debug", label: "debug" },
        { value: "info", label: "info" },
        { value: "warn", label: "warn" },
        { value: "error", label: "error" },
      ], defaultValue: "info" },
      { key: "system.queue_enabled", label: "Enable Job Queue", type: "boolean", defaultValue: false },
      { key: "system.cron_enabled", label: "Enable Cron Jobs", type: "boolean", defaultValue: true },
    ],
  },
  {
    id: "seo_automation",
    label: "SEO Automation",
    fields: [
      { key: "seo_auto.sitemap", label: "Auto Generate Sitemap", type: "boolean", defaultValue: true },
      { key: "seo_auto.image_sitemap", label: "Auto Generate Image Sitemap", type: "boolean", defaultValue: true },
      { key: "seo_auto.rss", label: "Auto Generate RSS Feed", type: "boolean", defaultValue: true },
      { key: "seo_auto.internal_links", label: "Auto Internal Linking", type: "boolean", defaultValue: true },
      { key: "seo_auto.broken_link_check", label: "Broken Link Checker", type: "boolean", defaultValue: false },
      { key: "seo_auto.redirects", label: "Redirect Rules (JSON: from -> to)", type: "json" },
      { key: "seo_auto.canonical_overrides", label: "Canonical Overrides (JSON)", type: "json" },
    ],
  },
  {
    id: "pet",
    label: "Pet Defaults",
    fields: [
      { key: "pet.default_species", label: "Default Species", type: "select", options: SPECIES, defaultValue: "dog" },
      { key: "pet.reminder_defaults", label: "Reminder Defaults (JSON)", type: "json", defaultValue: { vaccination_days: 30, deworming_days: 90 } },
      { key: "pet.vaccination_templates", label: "Vaccination Templates (JSON)", type: "json" },
      { key: "pet.medicine_templates", label: "Medicine Templates (JSON)", type: "json" },
      { key: "pet.growth_templates", label: "Growth Templates (JSON)", type: "json" },
      { key: "pet.weight_units", label: "Weight Units", type: "select", options: [
        { value: "kg", label: "Kilograms (kg)" },
        { value: "lb", label: "Pounds (lb)" },
      ], defaultValue: "kg" },
      { key: "pet.age_units", label: "Age Units", type: "select", options: [
        { value: "years", label: "Years" },
        { value: "months", label: "Months" },
      ], defaultValue: "years" },
    ],
  },
];

export function getDefaults(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const section of SETTINGS_SECTIONS) {
    for (const field of section.fields) {
      if (field.defaultValue !== undefined) out[field.key] = field.defaultValue;
    }
  }
  return out;
}
