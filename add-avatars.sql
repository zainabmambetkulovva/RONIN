-- Delete old avatars first
DELETE FROM avatars;

-- Insert avatars with actual image files from public/avatars (URL encoded)
INSERT INTO avatars (id, code, image_url, is_active) VALUES
('avatar-1', 'NINJA', '/avatars/ninja_transparent.png', true),
('avatar-2', 'MAGE', '/avatars/%D0%97%D0%B0%D0%B3%D0%B0%D0%B4%D0%BE%D1%87%D0%BD%D1%8B%D0%B9%20%D0%BC%D0%B0%D0%B3%20%D1%81%20%D1%81%D0%B8%D1%8F%D1%8E%D1%89%D0%B8%D0%BC%D0%B8%20%D0%B3%D0%BB%D0%B0%D0%B7%D0%B0%D0%BC%D0%B8.png', true),
('avatar-3', 'LYNX', '/avatars/%D0%9A%D0%B8%D0%B1%D0%B5%D1%80%D0%BD%D0%B5%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%80%D1%8B%D1%81%D1%8C%20%D0%A0%D0%BE%D0%BD%D0%B8%D0%BD%20%D1%81%20%D0%BD%D0%B5%D0%BE%D0%BD%D0%BE%D0%B2%D1%8B%D0%BC%20%D1%85%D0%B2%D0%BE%D1%81%D1%82%D0%BE%D0%BC.png', true),
('avatar-4', 'PANDA', '/avatars/%D0%9D%D0%B5%D0%BE%D0%BD%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BA%D0%B8%D0%B1%D0%B5%D1%80%D0%BF%D0%B0%D0%BD%D0%BA-%D0%BF%D0%B0%D0%BD%D0%B4%D0%B0%20ROXIN.png', true),
('avatar-5', 'GUARDIAN', '/avatars/%D0%9D%D0%B5%D0%BE%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%B4%D1%83%D1%85-%D1%81%D1%82%D1%80%D0%B0%D0%B6%20%D1%81%20%D0%BF%D0%B8%D1%82%D0%BE%D0%BC%D1%86%D0%B5%D0%BC.png', true),
('avatar-6', 'CAT', '/avatars/%D0%9D%D0%B5%D0%BE%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BA%D0%B8%D0%B1%D0%B5%D1%80%D0%BF%D0%B0%D0%BD%D0%BA-%D0%BA%D0%BE%D1%82%20%D0%B2%20%D0%BD%D0%B0%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%B0%D1%85.png', true),
('avatar-7', 'PANDA_NINJA', '/avatars/%D0%9D%D0%B5%D0%BE%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BA%D0%B8%D0%B1%D0%B5%D1%80%D0%BF%D0%B0%D0%BD%D0%BA-%D0%BF%D0%B0%D0%BD%D0%B4%D0%B0-%D0%BD%D0%B8%D0%BD%D0%B4%D0%B7%D1%8F.png', true),
('avatar-8', 'LEOPARD', '/avatars/%D0%9D%D0%B5%D0%BE%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BA%D0%B8%D0%B1%D0%B5%D1%80%D1%81%D0%BD%D0%B5%D0%B6%D0%BD%D1%8B%D0%B9%20%D0%BB%D0%B5%D0%BE%D0%BF%D0%B0%D1%80%D0%B4-%D0%BA%D0%BE%D1%82%D0%B5%D0%BD%D0%BE%D0%BA.png', true)
ON CONFLICT (id) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  code = EXCLUDED.code,
  is_active = EXCLUDED.is_active;
