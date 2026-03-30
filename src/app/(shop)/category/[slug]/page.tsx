import { FilterSidebar } from "@/components/category/FilterSidebar";
import { CategoryProductSection } from "@/components/category/CategoryProductSection";
import { CategoryProductCount } from "@/components/category/CategoryProductCount";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  fashion: {
    title: "Fashion",
    description: "Stylische Mode für starke Frauen — von Tops und Kleidern bis hin zu Hosen und Röcken.",
  },
  dessous: {
    title: "Dessous",
    description: "Verführerische Unterwäsche, Babydolls, Bodies und Dessous-Sets — feel your best.",
  },
  korsetts: {
    title: "Korsetts & Corsagen",
    description: "Elegante Korsetts und Corsagen in Satin, Jacquard und Brokat für jeden Anlass.",
  },
  africanstyle: {
    title: "Africanstyle",
    description: "Afrikanisch inspirierter Style — Schmuck, Accessoires, Wax-Stoffe und Heimdekoration.",
  },
  lifestyle: {
    title: "Lifestyle",
    description: "Wellness, Pflege und Wohnaccents für einen bewussten, stilvollen Alltag.",
  },
  "gothic-costumes": {
    title: "Gothic / Costumes",
    description: "Gothic-Mode, Steampunk und Burlesque-Kostüme — Drama und dunkle Eleganz.",
  },
  sale: {
    title: "Sale / Outlet",
    description: "Tolle Angebote und Ausverkaufsartikel — entdecke Schnäppchen auf ausgewählte Kollektionen.",
  },
  auslaufmodelle: {
    title: "Auslaufmodelle",
    description: "Letzte verfügbare Stücke aus abgelaufenen Kollektionen — solange Vorrat reicht.",
  },
  isabelle: {
    title: "Isabelle",
    description: "Kuratierte Kollektion von Sonja Isabelle — Curvy Model & Coach. Sexy kennt keine Regeln, nur dich.",
  },
};

function titleCaseSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  return {
    title: meta ? `${meta.title} — Marife` : `${titleCaseSlug(slug)} — Marife`,
    description: meta?.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span className="font-medium text-[#1A1A1A]">{meta?.title ?? titleCaseSlug(slug)}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1A1A1A]">{meta?.title ?? titleCaseSlug(slug)}</h1>
        {meta?.description ? (
          <p className="mt-2 text-gray-500 max-w-xl text-sm">{meta.description}</p>
        ) : (
          <p className="mt-2 text-gray-500 max-w-xl text-sm">Produkte in dieser Kategorie.</p>
        )}
        <CategoryProductCount slug={slug} className="mt-2 text-sm text-gray-400" />
      </div>

      {/* Layout: Sidebar + Grid */}
      <div className="flex gap-8">
        {/* Filter Sidebar (desktop) */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <CategoryProductCount slug={slug} className="text-sm text-gray-500" />
            <button className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-[#F7F7F7] transition-colors">
              Filter & Sortierung
            </button>
          </div>

          <CategoryProductSection slug={slug} />
        </div>
      </div>
    </div>
  );
}
