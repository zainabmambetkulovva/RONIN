-- Insert avatars with correct image URLs
-- Clear existing avatars first
DELETE FROM avatars;

-- Insert 12 avatars with image URLs matching the files in public/avatars
INSERT INTO avatars (id, code, image_url, is_active) VALUES
  (gen_random_uuid()::text, 'NINJA', '/avatars/ninja_transparent.png', true),
  (gen_random_uuid()::text, 'WIZARD', '/avatars/Загадочный маг с сияющими глазами.png', true),
  (gen_random_uuid()::text, 'CYBER_LYNX', '/avatars/Кибернетическая рысь Ронин с неоновым хвостом.png', true),
  (gen_random_uuid()::text, 'NEON_PANDA', '/avatars/Неоновая киберпанк-панда ROXIN.png', true),
  (gen_random_uuid()::text, 'NEON_R', '/avatars/Неоновая эмблема R с кристаллическим разрезом.png', true),
  (gen_random_uuid()::text, 'SPIRIT_GUARD', '/avatars/Неоновый дух-страж с питомцем.png', true),
  (gen_random_uuid()::text, 'CYBER_CAT', '/avatars/Неоновый киберпанк-кот в наушниках.png', true),
  (gen_random_uuid()::text, 'PANDA_NINJA', '/avatars/Неоновый киберпанк-панда-ниндзя.png', true),
  (gen_random_uuid()::text, 'SNOW_LEOPARD', '/avatars/Неоновый киберснежный леопард-котенок.png', true),
  (gen_random_uuid()::text, 'ASSASSIN_CAT', '/avatars/Неоновый кот-ассасин в фиолетовой энергии.png', true),
  (gen_random_uuid()::text, 'GHOST', '/avatars/Неоновый фиолетовый призрак в капюшоне.png', true),
  (gen_random_uuid()::text, 'NECROMANCER', '/avatars/Скелет-некромант в вихре синего огня.png', true),
  (gen_random_uuid()::text, 'DARK_RABBIT', '/avatars/Суровый чёрный кролик в худи.png', true);

-- Verify insertion
SELECT code, image_url FROM avatars ORDER BY code;
