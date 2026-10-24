import { z } from "zod";

export const TARIFF_TYPES = ["hourly", "package", "night", "morning"] as const;

const price = z.coerce
  .number({ invalid_type_error: "Некорректная цена" })
  .positive("Цена должна быть больше нуля")
  .max(100000, "Слишком большая цена");

const duration = z.coerce
  .number({ invalid_type_error: "Некорректная длительность" })
  .int("Длительность — целое число минут")
  .positive("Длительность должна быть больше нуля")
  .max(24 * 60, "Длительность не больше 24 часов");

export const tariffCreateSchema = z.object({
  name: z.string({ required_error: "Missing required fields" }).trim().min(1, "Название обязательно").max(100),
  durationMinutes: duration,
  price,
  type: z.enum(TARIFF_TYPES, { message: "Некорректный тип тарифа" }),
  categoryId: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const tariffUpdateSchema = tariffCreateSchema.partial();

/**
 * Изменение тарифа не затрагивает существующие брони: цена копируется в `bookings.price`
 * в момент создания брони.
 */
export function toTariffData(input: z.infer<typeof tariffUpdateSchema>) {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.durationMinutes !== undefined && { duration_minutes: input.durationMinutes }),
    ...(input.price !== undefined && { price: input.price }),
    ...(input.type !== undefined && { type: input.type }),
    ...(input.categoryId !== undefined && { category_id: input.categoryId || null }),
    ...(input.isActive !== undefined && { is_active: input.isActive }),
  };
}
