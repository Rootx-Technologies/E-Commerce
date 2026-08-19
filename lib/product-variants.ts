export interface VariantOption {
  id?: string;
  size?: string;
  sizeLabel?: string;
  color?: string;
  colorHex?: string;
  stock?: number;
  price?: number;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface SizeOption {
  id: string; // e.g. "S", "M", "L", "XL", "42"
  label: string; // e.g. "Small", "Medium", "Large", "Extra Large", "EU 42 / UK 8"
  shortLabel: string; // e.g. "S", "M", "L", "XL"
}

// ── Standard Size Sets ──
export const APPAREL_SIZES: SizeOption[] = [
  { id: "S", shortLabel: "S", label: "Small" },
  { id: "M", shortLabel: "M", label: "Medium" },
  { id: "L", shortLabel: "L", label: "Large" },
  { id: "XL", shortLabel: "XL", label: "Extra Large" },
  { id: "XXL", shortLabel: "XXL", label: "Double XL" },
];

export const KIDS_APPAREL_SIZES: SizeOption[] = [
  { id: "S", shortLabel: "S", label: "Small (3-4 Yrs)" },
  { id: "M", shortLabel: "M", label: "Medium (5-6 Yrs)" },
  { id: "L", shortLabel: "L", label: "Large (7-8 Yrs)" },
  { id: "XL", shortLabel: "XL", label: "Extra Large (9-10 Yrs)" },
];

export const MENS_SHOE_SIZES: SizeOption[] = [
  { id: "39", shortLabel: "39", label: "39 (UK 6)" },
  { id: "40", shortLabel: "40", label: "40 (UK 7)" },
  { id: "41", shortLabel: "41", label: "41 (UK 8)" },
  { id: "42", shortLabel: "42", label: "42 (UK 9)" },
  { id: "43", shortLabel: "43", label: "43 (UK 10)" },
  { id: "44", shortLabel: "44", label: "44 (UK 11)" },
];

export const WOMENS_SHOE_SIZES: SizeOption[] = [
  { id: "36", shortLabel: "36", label: "36 (UK 3)" },
  { id: "37", shortLabel: "37", label: "37 (UK 4)" },
  { id: "38", shortLabel: "38", label: "38 (UK 5)" },
  { id: "39", shortLabel: "39", label: "39 (UK 6)" },
  { id: "40", shortLabel: "40", label: "40 (UK 7)" },
  { id: "41", shortLabel: "41", label: "41 (UK 8)" },
];

export const KIDS_SHOE_SIZES: SizeOption[] = [
  { id: "28", shortLabel: "28", label: "28 (Kids S)" },
  { id: "29", shortLabel: "29", label: "29 (Kids M)" },
  { id: "30", shortLabel: "30", label: "30 (Kids L)" },
  { id: "31", shortLabel: "31", label: "31 (Kids XL)" },
  { id: "32", shortLabel: "32", label: "32 (Youth)" },
];

// ── Color Swatch Map (Name -> Hex) ──
export const COLOR_HEX_MAP: Record<string, string> = {
  // Classics
  "Black": "#18181b",
  "Jet Black": "#09090b",
  "White": "#ffffff",
  "Pure White": "#f8fafc",
  "Off White": "#f1f5f9",
  "Grey": "#6b7280",
  "Charcoal": "#374151",
  "Silver": "#cbd5e1",

  // Blues
  "Navy Blue": "#1e3a8a",
  "Navy": "#1e3a8a",
  "Royal Blue": "#2563eb",
  "Sky Blue": "#38bdf8",
  "Midnight Blue": "#0f172a",

  // Greens & Earth
  "Olive Green": "#3f4f34",
  "Olive": "#4b5320",
  "Emerald Green": "#065f46",
  "Forest Green": "#14532d",
  "Sage Green": "#84a98c",
  "Mint Green": "#34d399",

  // Reds & Pinks
  "Maroon": "#881337",
  "Crimson Red": "#991b1b",
  "Ruby Red": "#be123c",
  "Burgundy": "#4a044e",
  "Coral": "#fb7185",
  "Rose": "#f43f5e",
  "Blush Pink": "#fbcfe8",

  // Browns & Neutrals
  "Tan": "#d4a373",
  "Cognac Brown": "#78350f",
  "Brown": "#713f12",
  "Chocolate": "#451a03",
  "Beige": "#e6ccb2",
  "Camel": "#c19a6b",
  "Khaki": "#c2b280",

  // Golds & Accents
  "Gold": "#d97706",
  "Mustard": "#eab308",
  "Dusty Gold": "#b45309",
  "Royal Plum": "#581c87",
  "Lavender": "#c084fc",
};

// ── Category specific default variants generator ──
export function getDefaultVariantsForCategory(categorySlug?: string, productName?: string): {
  sizes: SizeOption[];
  colors: ColorOption[];
} {
  const cat = (categorySlug ?? "").toLowerCase();
  const name = (productName ?? "").toLowerCase();

  // 1. Mens Clothing
  if (cat.includes("clothing-men") || (cat.includes("men") && !cat.includes("shoe") && !cat.includes("perfume"))) {
    return {
      sizes: APPAREL_SIZES,
      colors: [
        { name: "Black", hex: "#18181b" },
        { name: "Navy Blue", hex: "#1e3a8a" },
        { name: "Olive Green", hex: "#3f4f34" },
        { name: "Maroon", hex: "#881337" },
        { name: "White", hex: "#f8fafc" },
      ],
    };
  }

  // 2. Womens Clothing
  if (cat.includes("clothing-women") || (cat.includes("women") && !cat.includes("shoe") && !cat.includes("perfume") && !cat.includes("bag"))) {
    return {
      sizes: APPAREL_SIZES,
      colors: [
        { name: "Emerald Green", hex: "#065f46" },
        { name: "Royal Plum", hex: "#581c87" },
        { name: "Crimson Red", hex: "#991b1b" },
        { name: "Navy Blue", hex: "#1e3a8a" },
        { name: "Blush Pink", hex: "#fbcfe8" },
      ],
    };
  }

  // 3. Kids Clothing
  if (cat.includes("clothing-kids") || (cat.includes("kids") && !cat.includes("shoe"))) {
    return {
      sizes: KIDS_APPAREL_SIZES,
      colors: [
        { name: "Mustard", hex: "#eab308" },
        { name: "Sky Blue", hex: "#38bdf8" },
        { name: "Mint Green", hex: "#34d399" },
        { name: "Coral", hex: "#fb7185" },
        { name: "Navy Blue", hex: "#1e3a8a" },
      ],
    };
  }

  // 4. Mens Shoes
  if (cat.includes("shoes-men") || (cat.includes("shoe") && cat.includes("men")) || (name.includes("shoe") && name.includes("men")) || name.includes("oxford") || name.includes("sneaker")) {
    return {
      sizes: MENS_SHOE_SIZES,
      colors: [
        { name: "Black", hex: "#18181b" },
        { name: "Cognac Brown", hex: "#78350f" },
        { name: "White", hex: "#f8fafc" },
        { name: "Navy Blue", hex: "#1e3a8a" },
      ],
    };
  }

  // 5. Womens Shoes
  if (cat.includes("shoes-women") || (cat.includes("shoe") && cat.includes("women")) || name.includes("khussa") || name.includes("heel")) {
    return {
      sizes: WOMENS_SHOE_SIZES,
      colors: [
        { name: "Gold", hex: "#d97706" },
        { name: "Maroon", hex: "#881337" },
        { name: "Emerald Green", hex: "#065f46" },
        { name: "Black", hex: "#18181b" },
      ],
    };
  }

  // 6. Kids Shoes
  if (cat.includes("shoes-kids") || (cat.includes("shoe") && cat.includes("kids"))) {
    return {
      sizes: KIDS_SHOE_SIZES,
      colors: [
        { name: "Crimson Red", hex: "#dc2626" },
        { name: "Royal Blue", hex: "#2563eb" },
        { name: "Black", hex: "#18181b" },
        { name: "White", hex: "#f8fafc" },
      ],
    };
  }

  // Generic Shoes
  if (cat.includes("shoe") || name.includes("shoe") || name.includes("sneaker")) {
    return {
      sizes: MENS_SHOE_SIZES,
      colors: [
        { name: "Black", hex: "#18181b" },
        { name: "White", hex: "#f8fafc" },
        { name: "Navy Blue", hex: "#1e3a8a" },
      ],
    };
  }

  // Generic Clothing
  if (cat.includes("cloth") || cat.includes("fashion") || cat.includes("apparel") || name.includes("shirt") || name.includes("suit") || name.includes("kurta")) {
    return {
      sizes: APPAREL_SIZES,
      colors: [
        { name: "Black", hex: "#18181b" },
        { name: "Navy Blue", hex: "#1e3a8a" },
        { name: "Maroon", hex: "#881337" },
        { name: "White", hex: "#f8fafc" },
      ],
    };
  }

  // Default empty for non-sized products (e.g. Bags, Perfumes, Accessories where size is not needed unless specified)
  return {
    sizes: [],
    colors: [],
  };
}

/**
 * Returns available sizes and color options for any given product,
 * giving priority to database variants if present, and falling back
 * gracefully to category-based standard sets.
 */
export function getProductAvailableOptions(product: {
  name: string;
  category?: { slug?: string; name?: string } | null;
  variants?: Array<{ size?: string | null; color?: string | null; colorHex?: string | null }>;
}): {
  sizes: SizeOption[];
  colors: ColorOption[];
  hasSizes: boolean;
  hasColors: boolean;
  sizeType: "apparel" | "shoes" | "kids" | "generic";
} {
  const catSlug = product.category?.slug ?? "";
  const defaultOpts = getDefaultVariantsForCategory(catSlug, product.name);

  // Check if product has explicit variants in DB
  const rawDbSizes = [
    ...new Set(
      (product.variants ?? [])
        .map((v) => v.size)
        .filter((s): s is string => Boolean(s && s.trim()))
    ),
  ];

  const rawDbColors = (product.variants ?? []).filter((v) => Boolean(v.color && v.color.trim()));

  let sizes: SizeOption[] = [];
  if (rawDbSizes.length > 0) {
    // Map raw size strings to SizeOption objects
    sizes = rawDbSizes.map((s) => {
      const match =
        APPAREL_SIZES.find((opt) => opt.id.toLowerCase() === s.toLowerCase() || opt.shortLabel.toLowerCase() === s.toLowerCase()) ||
        MENS_SHOE_SIZES.find((opt) => opt.id === s || opt.shortLabel === s) ||
        WOMENS_SHOE_SIZES.find((opt) => opt.id === s || opt.shortLabel === s) ||
        KIDS_APPAREL_SIZES.find((opt) => opt.id === s || opt.shortLabel === s) ||
        KIDS_SHOE_SIZES.find((opt) => opt.id === s || opt.shortLabel === s);

      return match ?? { id: s, shortLabel: s, label: s };
    });
  } else {
    sizes = defaultOpts.sizes;
  }

  let colors: ColorOption[] = [];
  if (rawDbColors.length > 0) {
    const seen = new Set<string>();
    for (const v of rawDbColors) {
      if (v.color && !seen.has(v.color.toLowerCase())) {
        seen.add(v.color.toLowerCase());
        colors.push({
          name: v.color,
          hex: v.colorHex || COLOR_HEX_MAP[v.color] || "#262626",
        });
      }
    }
  } else {
    colors = defaultOpts.colors;
  }

  const isShoe = catSlug.includes("shoe") || product.name.toLowerCase().includes("shoe") || product.name.toLowerCase().includes("sneaker") || product.name.toLowerCase().includes("khussa");
  const isKids = catSlug.includes("kids");

  const sizeType: "apparel" | "shoes" | "kids" | "generic" = isShoe
    ? "shoes"
    : isKids
    ? "kids"
    : sizes.length > 0
    ? "apparel"
    : "generic";

  return {
    sizes,
    colors,
    hasSizes: sizes.length > 0,
    hasColors: colors.length > 0,
    sizeType,
  };
}

/**
 * Returns the hex code for a color name
 */
export function getColorHex(colorName?: string | null, fallbackHex?: string | null): string {
  if (!colorName) return fallbackHex || "#18181b";
  return fallbackHex || COLOR_HEX_MAP[colorName] || COLOR_HEX_MAP[colorName.trim()] || "#18181b";
}
