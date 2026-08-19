import { db } from "../lib/db";

async function main() {
  console.log("Reorganizing categories...");

  // 1. Create Top Level Categories
  const men = await db.category.upsert({
    where: { slug: "men" },
    update: { name: "Men", parentId: null },
    create: { name: "Men", slug: "men", description: "Modern Elite" }
  });
  const women = await db.category.upsert({
    where: { slug: "women" },
    update: { name: "Women", parentId: null },
    create: { name: "Women", slug: "women", description: "Daily Ease" }
  });
  const kids = await db.category.upsert({
    where: { slug: "kids" },
    update: { name: "Kids", parentId: null },
    create: { name: "Kids", slug: "kids", description: "Daily Fun" }
  });
  const bags = await db.category.upsert({
    where: { slug: "bags" },
    update: { name: "Bags", parentId: null },
    create: { name: "Bags", slug: "bags", description: "Premium Bags" }
  });

  console.log("Top level categories ensured.");

  // Mapping old slugs to new parent & new details
  const mapping = [
    { oldSlug: "clothing-men", newSlug: "men-clothing", name: "Clothing", parentId: men.id },
    { oldSlug: "shoes-men", newSlug: "men-shoes", name: "Shoes", parentId: men.id },
    { oldSlug: "perfumes-men", newSlug: "men-perfumes", name: "Perfumes", parentId: men.id },
    
    { oldSlug: "clothing-women", newSlug: "women-clothing", name: "Clothing", parentId: women.id },
    { oldSlug: "shoes-women", newSlug: "women-shoes", name: "Shoes", parentId: women.id },
    { oldSlug: "perfumes-women", newSlug: "women-perfumes", name: "Perfumes", parentId: women.id },

    { oldSlug: "clothing-kids", newSlug: "kids-clothing", name: "Clothing", parentId: kids.id },
    { oldSlug: "shoes-kids", newSlug: "kids-shoes", name: "Shoes", parentId: kids.id },
    
    // Bags children
    { oldSlug: "bags-handbags", newSlug: "bags-handbags", name: "Handbags", parentId: bags.id },
    { oldSlug: "bags-backpacks", newSlug: "bags-backpacks", name: "Backpacks", parentId: bags.id },
    { oldSlug: "bags-wallets", newSlug: "bags-wallets", name: "Wallets", parentId: bags.id },
  ];

  for (const m of mapping) {
    const existing = await db.category.findUnique({ where: { slug: m.oldSlug } });
    if (existing) {
      await db.category.update({
        where: { id: existing.id },
        data: { slug: m.newSlug, name: m.name, parentId: m.parentId }
      });
      console.log(`Updated ${m.oldSlug} -> ${m.newSlug}`);
    } else {
      const newCat = await db.category.findUnique({ where: { slug: m.newSlug } });
      if (!newCat) {
        await db.category.create({
          data: { slug: m.newSlug, name: m.name, parentId: m.parentId }
        });
        console.log(`Created ${m.newSlug}`);
      }
    }
  }

  // Handle old parent categories (clothing, shoes, perfumes, accessories)
  // We re-assign any orphan products in old categories to the new ones just in case.
  const orphans = await db.product.findMany({
    where: { category: { slug: { in: ["clothing", "shoes", "perfumes", "accessories"] } } },
    include: { category: true }
  });
  
  if (orphans.length > 0) {
    console.log(`Found ${orphans.length} orphan products. Re-assigning...`);
    for (const p of orphans) {
        // Just arbitrarily assigning to Men for safety, user can change in admin
        await db.product.update({ where: { id: p.id }, data: { categoryId: men.id } });
    }
  }

  // Delete old unused top-level categories now that they are empty
  const oldParents = ["clothing", "shoes", "perfumes", "accessories", "accessories-sunglasses", "accessories-belts", "accessories-caps", "accessories-jewelry"];
  for (const slug of oldParents) {
     try {
         const cat = await db.category.findUnique({ where: { slug } });
         if (cat) {
            // Re-assign products if any exist
            await db.product.updateMany({ where: { categoryId: cat.id }, data: { categoryId: men.id } });
            await db.category.delete({ where: { slug } });
            console.log(`Deleted obsolete category: ${slug}`);
         }
     } catch(e) {
         console.log(`Could not delete old category ${slug}`);
     }
  }

  console.log("Done reorganizing categories!");
}

main().catch(console.error).finally(() => process.exit(0));
