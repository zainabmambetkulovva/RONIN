import { redirect } from "next/navigation";

// Отдельной панели менеджера больше нет: админ и менеджер работают в одной панели (/admin), разделы — по правам
export default function ManagerPage() {
  redirect("/admin");
}
