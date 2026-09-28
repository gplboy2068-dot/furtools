-- Seed species catalog
INSERT OR REPLACE INTO species_catalog (id, slug, singular, plural, description, icon, color, enabled, live) VALUES ('species_dog', 'dog', 'Dog', 'Dogs', 'From working shepherds to lap-loving companions — explore every dog breed in depth.', 'Dog', 'terracotta', 1, 1);
INSERT OR REPLACE INTO species_catalog (id, slug, singular, plural, description, icon, color, enabled, live) VALUES ('species_cat', 'cat', 'Cat', 'Cats', 'Long-haired royalty, chatty companions, and gentle giants — cat breeds unpacked.', 'Cat', 'amber', 1, 1);
INSERT OR REPLACE INTO species_catalog (id, slug, singular, plural, description, icon, color, enabled, live) VALUES ('species_bird', 'bird', 'Bird', 'Birds', 'Parrots, finches, cockatiels, canaries and more — companion bird breeds unpacked.', 'Bird', 'sky', 1, 1);
INSERT OR REPLACE INTO species_catalog (id, slug, singular, plural, description, icon, color, enabled, live) VALUES ('species_rabbit', 'rabbit', 'Rabbit', 'Rabbits', 'Lop, angora, dwarf and beyond — friendly, plain-language rabbit breed profiles.', 'Rabbit', 'rose', 1, 1);
INSERT OR REPLACE INTO species_catalog (id, slug, singular, plural, description, icon, color, enabled, live) VALUES ('species_fish', 'fish', 'Fish', 'Fish', 'Freshwater and saltwater fish species — tank size, diet, and care at a glance.', 'Fish', 'sky', 1, 1);
INSERT OR REPLACE INTO species_catalog (id, slug, singular, plural, description, icon, color, enabled, live) VALUES ('species_hamster', 'hamster', 'Hamster', 'Hamsters', 'Syrian, dwarf, and robo hamsters — nocturnal pocket pets with big personalities.', 'Squirrel', 'amber', 1, 1);
INSERT OR REPLACE INTO species_catalog (id, slug, singular, plural, description, icon, color, enabled, live) VALUES ('species_horse', 'horse', 'Horse', 'Horses', 'Draft, gaited, sport, and pony breeds — care, feed, and management guides.', 'PawPrint', 'sage', 1, 1);

-- Seed site settings
INSERT OR REPLACE INTO site_settings (key, value, category, description) VALUES ('site_name', 'FurTools', 'general', 'Website title');
INSERT OR REPLACE INTO site_settings (key, value, category, description) VALUES ('site_tagline', 'Free tools for happy pets', 'general', 'Website tagline');
INSERT OR REPLACE INTO site_settings (key, value, category, description) VALUES ('site_url', 'https://www.furtools.com', 'general', 'Canonical production URL');
INSERT OR REPLACE INTO site_settings (key, value, category, description) VALUES ('author_name', 'Firoz Khan', 'author', 'Primary author name');
INSERT OR REPLACE INTO site_settings (key, value, category, description) VALUES ('author_role', 'Founder / Content Creator', 'author', 'Author professional role');
INSERT OR REPLACE INTO site_settings (key, value, category, description) VALUES ('author_linkedin', 'https://www.linkedin.com/in/firoz-khan-1153358a/', 'author', 'Author LinkedIn');
INSERT OR REPLACE INTO site_settings (key, value, category, description) VALUES ('author_instagram', 'https://www.instagram.com/rtibyfiroz/', 'author', 'Author Instagram');
