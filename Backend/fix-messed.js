const fs = require('fs');
const glob = require('glob');

const dirs = [
  'src/controllers/*.ts',
  'src/routes/admin/*.ts'
];

dirs.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: __dirname, absolute: true });
  files.forEach(fullPath => {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix messed up req.params. as string
    content = content.replace(/req\.params\.\s+as\s+string/g, (match, offset, str) => {
      const before = str.substring(Math.max(0, offset - 50), offset);
      if (before.includes('getBlogPostBySlug(')) return 'req.params.slug as string';
      if (before.includes('updateCartItem(')) return 'req.params.id as string';
      if (before.includes('removeCartItem(')) return 'req.params.id as string';
      if (before.includes('getCollectionBySlug(')) return 'req.params.slug as string';
      if (before.includes('getContentByKey(')) return 'req.params.key as string';
      if (before.includes('getEventBySlug(')) return 'req.params.slug as string';
      if (before.includes('setEventReminder(')) return 'req.params.slug as string';
      if (before.includes('orderId = ')) return 'req.params.id as string';
      if (before.includes('getProductBySlug(')) return 'req.params.slug as string';
      if (before.includes('getProductReviews(')) return 'req.params.slug as string';
      if (before.includes('createReview(')) return 'req.params.slug as string';
      if (before.includes('updateAddress(')) return 'req.params.id as string';
      if (before.includes('deleteAddress(')) return 'req.params.id as string';
      if (before.includes('addToWishlist(')) return 'req.params.productId as string';
      if (before.includes('removeFromWishlist(')) return 'req.params.productId as string';
      
      console.log('UNMATCHED params in', fullPath, ':', before);
      return 'req.params.id as string'; // fallback
    });

    // Fix req.query.
    content = content.replace(/req\.query\.\s+as\s+stringe\s+as\s+string/g, 'req.query.page as string');
    content = content.replace(/req\.query\.\s+as\s+stringt\s+as\s+string/g, 'req.query.limit as string');
    
    content = content.replace(/req\.query\.\s+as\s+string\s+\?\s+parseInt\([^)]+\)/g, (match) => {
      if (match.includes('page')) return 'req.query.page ? parseInt(req.query.page as string, 10)';
      if (match.includes('limit')) return 'req.query.limit ? parseInt(req.query.limit as string, 10)';
      return match;
    });

    content = content.replace(/req\.query\.\s+as\s+string\s+===\s+'true'/g, "req.query.upcoming === 'true'");
    content = content.replace(/req\.query\.\s+as\s+string\s+===\s+'false'/g, "req.query.upcoming === 'false'");
    content = content.replace(/const\s+slugs\s+=\s+req\.query\.\s+as\s+strings\s+as\s+string/g, 'const slugs = req.query.slugs as string');

    fs.writeFileSync(fullPath, content);
  });
});
console.log('Fixed messed up replacements');
