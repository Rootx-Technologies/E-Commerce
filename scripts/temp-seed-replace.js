const fs = require('fs'); 
let data = fs.readFileSync('prisma/seed.ts', 'utf8'); 
const repl = [
  ['clothing-men', 'men-clothing'], 
  ['clothing-women', 'women-clothing'], 
  ['clothing-kids', 'kids-clothing'], 
  ['shoes-men', 'men-shoes'], 
  ['shoes-women', 'women-shoes'], 
  ['shoes-kids', 'kids-shoes'], 
  ['perfumes-men', 'men-perfumes'], 
  ['perfumes-women', 'women-perfumes']
]; 
repl.forEach(([o, n]) => { 
  data = data.split('"' + o + '"').join('"' + n + '"'); 
}); 
fs.writeFileSync('prisma/seed.ts', data);
