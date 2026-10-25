import { redirect } from "next/navigation";

// Редактирование профиля встроено в страницу профиля
export default function ProfileEditPage() {
  redirect("/profile");
}
