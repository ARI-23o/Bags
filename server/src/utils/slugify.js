/**
 * Turkish-aware slugify utility
 * Converts Turkish characters to Latin equivalents and creates clean URLs
 */
export const slugifyTurkish = (text) => {
  if (!text) return '';
  
  const charMap = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u'
  };

  let str = text.toString().trim();

  // Replace Turkish characters
  for (const [key, value] of Object.entries(charMap)) {
    str = str.split(key).join(value);
  }

  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric chars
    .replace(/\s+/g, '-')     // replace spaces with hyphens
    .replace(/-+/g, '-')      // remove multiple consecutive hyphens
    .replace(/^-+/, '')       // trim hyphens from start
    .replace(/-+$/, '');      // trim hyphens from end
};

export const slugify = slugifyTurkish;
