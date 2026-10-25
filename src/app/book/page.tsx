import { redirect } from "next/navigation";

// Страница объединена с новым разделом; старые ссылки ведут туда
export default function LegacyPage() {
  redirect("/booking");
}
