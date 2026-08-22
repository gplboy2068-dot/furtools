/**
 * IndexNow Bulk URL Submitter for FurTools
 * Submits all active URLs to Bing, Yandex, and IndexNow engines.
 */

const INDEXNOW_KEY = "e8f49a2b7c6d5e1f0a3b8c9d2e4f6a7b";
const HOSTS = ["furtools.com", "www.furtools.com"];

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

const STATIC_PATHS = [
  "/",
  "/categories",
  "/breeds",
  "/foods",
  "/names",
  "/compare",
  "/cost-planner",
  "/care",
  "/ai",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/categories/dogs",
  "/categories/cats",
  "/categories/birds",
  "/categories/fish",
  "/categories/small-pets",
  "/categories/reptiles",
  "/categories/horses",
  "/categories/farm",
  "/categories/general",
  "/tools/duck-pond-size-calculator",
  "/tools/dog-age-calculator",
  "/tools/dog-food-calculator",
  "/tools/dog-name-generator",
  "/tools/cat-age-calculator",
  "/tools/cat-food-calculator",
  "/tools/cat-coat-pattern-identifier",
  "/tools/snake-tank-size-calculator",
  "/tools/chicken-coop-size-calculator",
  "/tools/reptile-enclosure-size-calculator",
  "/tools/rabbit-food-calculator",
  "/tools/pet-loss-memorial-generator",
  "/tools/pet-sitter-rate-calculator",
  "/tools/horse-farrier-schedule",
  "/tools/aquarium-nitrate-calculator",
  "/tools/multi-pet-cost-calculator",
  "/tools/dog-life-expectancy-calculator",
  "/tools/pet-body-condition-photo",
  "/tools/chinchilla-dust-bath-schedule",
  "/tools/goat-feed-calculator",
  "/tools/smart-collar-qr",
  "/tools/local-vet-finder",
  "/blog/lifetime-pet-budget",
  "/blog/pet-emergency-kit-guide",
  "/blog/pet-insurance-worth-it",
  "/blog/dog-body-language",
  "/blog/healthiest-dog-breeds",
  "/blog/puppy-socialization-guide",
  "/blog/wet-vs-dry-cat-food",
  "/blog/shy-cat-settling-in",
  "/blog/duck-pond-size-guide",
  "/blog/snake-enclosure-size-guide",
  "/blog/chicken-coop-space-guide",
  "/blog/aquarium-nitrate-control-guide",
  "/ai/dog-training",
  "/ai/cat-care",
  "/ai/bird-care",
  "/ai/fish-care",
  "/ai/rabbit-care",
  "/ai/snake-care",
  "/ai/lizard-care",
  "/ai/chicken-care",
  "/ai/duck-care",
  "/ai/goat-care",
  "/ai/sheep-care",
  "/ai/horse-care",
  "/ai/hamster-care",
  "/ai/guinea-pig-care",
  "/ai/ferret-care",
  "/ai/turtle-care",
];

async function runIndexNow() {
  for (const host of HOSTS) {
    const keyLocation = `https://${host}/${INDEXNOW_KEY}.txt`;
    const fullUrls = STATIC_PATHS.map((p) => `https://${host}${p}`);
    console.log(`\n🚀 [IndexNow] Submitting ${fullUrls.length} URLs for ${host}...`);

    const payload = {
      host: host,
      key: INDEXNOW_KEY,
      keyLocation: keyLocation,
      urlList: fullUrls,
    };

    for (const endpoint of ENDPOINTS) {
      try {
        console.log(`📡 Pinging ${endpoint} for ${host}...`);
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        });

        console.log(`   ➔ Response: ${response.status} ${response.statusText}`);
        if (response.status === 200 || response.status === 202) {
          console.log(`   ✅ Successfully submitted ${fullUrls.length} URLs!`);
        } else {
          const text = await response.text();
          console.log(`   ℹ️ Note: ${text || response.statusText}`);
        }
      } catch (err) {
        console.error(`   ❌ Failed to ping ${endpoint}:`, err.message);
      }
    }
  }

  console.log(`\n✨ [IndexNow] Process completed.\n`);
}

runIndexNow();
