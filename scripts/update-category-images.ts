import { db } from "../lib/db";

async function main() {
  console.log("Updating category images...");
  
  await db.category.updateMany({ 
    where: { slug: "men" }, 
    data: { image: "https://www.exportleftovers.com/cdn/shop/files/anime_5.jpg?v=1784118174&width=720" } 
  });
  
  await db.category.updateMany({ 
    where: { slug: "women" }, 
    data: { image: "https://www.exportleftovers.com/cdn/shop/files/white_2_03a9b9bb-d15a-4809-b5b3-ca5be0dab7c4.jpg?v=1784377234&width=720" } 
  });
  
  await db.category.updateMany({ 
    where: { slug: "kids" }, 
    data: { image: "https://www.exportleftovers.com/cdn/shop/files/5_86f257cf-9ae5-4e00-aa6a-5136cd85cdb4.jpg?v=1785424365&width=720" } 
  });
  
  await db.category.updateMany({ 
    where: { slug: "bags" }, 
    data: { image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80" } 
  });

  console.log("Done!");
}

main().catch(console.error).finally(() => process.exit(0));
