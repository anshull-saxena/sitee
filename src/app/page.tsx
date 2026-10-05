import linksData from "@/data/links.json";
import type { LinkItem } from "@/types/link";
import { MainCatalog } from "@/components/MainCatalog";

export default function HomePage() {
  const links = linksData as LinkItem[];

  return <MainCatalog links={links} />;
}
