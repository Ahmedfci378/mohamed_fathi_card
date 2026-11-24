import { redirect } from "next/navigation";
import { getAllSlugs } from "@/data/cards";

export default function Home() {
  redirect(`/${getAllSlugs()[0]}`);
}
