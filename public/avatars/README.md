# Персонаж Аватарлары

Бул папкага персонаждардын фотолорун салыңыз.

## Формат:
- `avatar1.png` - Биринчи персонаж
- `avatar2.png` - Экинчи персонаж
- `avatar3.png` - Үчүнчү персонаж
- ж.б.у.с.

## Талаптар:
- Формат: PNG же JPG
- Өлчөм: 512x512px (оптималдуу)
- Прозрачный фон (PNG)

## Мисал код:
```tsx
<img src="/avatars/avatar1.png" alt="Avatar 1" />
```

## Database de:
```sql
UPDATE users SET avatar = 'avatar1' WHERE id = 'user-id';
```
