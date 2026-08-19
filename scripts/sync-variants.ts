import fs from "fs";
import path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { getDefaultVariantsForCategory } from "../lib/product-variants";

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (match) dbUrl = match[1];
  }
}
if (!dbUrl) {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (match) dbUrl = match[1];
  }
}

const adapter = new PrismaPg({ connectionString: dbUrl ?? "" });
const prisma = new PrismaClient({ adapter });

async function syncVariants() {
  console.log("🔄 Syncing product variants across all products in DB...");

  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
  });

  console.log(`Found ${products.length} products.`);

  let totalVariantsCreated = 0;

  for (const product of products) {
    const catSlug = product.category?.slug ?? "";
    const { sizes, colors } = getDefaultVariantsForCategory(catSlug, product.name);

    if (sizes.length === 0 && colors.length === 0) {
      console.log(`- Skipping ${product.name} (${catSlug}): No sizes/colors needed`);
      continue;
    }

    // Delete existing variants for fresh clean state
    await prisma.productVariant.deleteMany({
      where: { productId: product.id },
    });

    const variantsToCreate = [];

    if (sizes.length > 0 && colors.length > 0) {
      for (const size of sizes) {
        for (const color of colors) {
          variantsToCreate.push({
            productId: product.id,
            size: size.shortLabel,
            color: color.name,
            colorHex: color.hex,
            stock: 15,
            price: product.price,
          });
        }
      }
    } else if (sizes.length > 0) {
      for (const size of sizes) {
        variantsToCreate.push({
          productId: product.id,
          size: size.shortLabel,
          stock: 20,
          price: product.price,
        });
      }
    } else if (colors.length > 0) {
      for (const color of colors) {
        variantsToCreate.push({
          productId: product.id,
          color: color.name,
          colorHex: color.hex,
          stock: 20,
          price: product.price,
        });
      }
    }

    if (variantsToCreate.length > 0) {
      await prisma.productVariant.createMany({
        data: variantsToCreate,
      });
      totalVariantsCreated += variantsToCreate.length;
      console.log(
        `✅ Created ${variantsToCreate.length} variants for: ${product.name} (Sizes: ${sizes.map((s) => s.shortLabel).join(", ")})`
      );
    }
  }

  console.log(`\n🎉 Done! Created ${totalVariantsCreated} product variants across products.`);
}

syncVariants()
  .catch((e) => {
    console.error("❌ Error syncing variants:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
