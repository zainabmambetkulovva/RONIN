/**
 * Загрузка прайса RONIN в базу из командной строки.
 *
 *   npm run db:price-list            — показать, что изменится (без записи)
 *   npm run db:price-list -- --apply — применить
 *
 * Использует DATABASE_URL из окружения. То же самое делает кнопка в админке
 * («Тарифы» → «Загрузить прайс RONIN»).
 */
import { applyPriceList, planPriceList, type PriceListPlan } from "../src/server/services/price-list";
import { prisma } from "../src/lib/prisma";

function print(plan: PriceListPlan) {
  for (const c of plan.categories) {
    const head =
      c.action === "create"
        ? "создать категорию"
        : `категория «${c.matchedName}»${c.rename ? ` → будет переименована в «${c.name}»` : ""}`;
    console.log(`\n${c.name} — ${head}`);
    for (const t of c.tariffs) {
      const old = t.oldPrice !== undefined && t.oldPrice !== t.price ? ` (было ${t.oldPrice})` : "";
      console.log(`  [${t.action}] ${t.name}: ${t.price} сом, ${t.durationMinutes} мин${old}`);
    }
    for (const e of c.extraActiveTariffs) {
      console.log(`  [не в прайсе, не изменяется] ${e.name}: ${e.price} сом`);
    }
  }
}

async function main() {
  const apply = process.argv.includes("--apply");
  if (apply) {
    print(await applyPriceList());
    console.log("\n✅ Прайс загружен.");
  } else {
    print(await planPriceList());
    console.log("\nПредпросмотр. Для применения: npm run db:price-list -- --apply");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
