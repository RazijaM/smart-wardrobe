export function matchesSearch(cloth, searchText) {
  const words = searchText.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const fields = [cloth.name, cloth.color, cloth.category, cloth.season].map((s) => (s || '').toLowerCase());
  return words.every((word) => fields.some((f) => f.includes(word)));
}
