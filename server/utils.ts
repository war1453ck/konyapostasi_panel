/**
 * Türkçe karakterleri içeren metinleri URL-dostu slug formatına dönüştürür
 * @param text Dönüştürülecek metin
 * @returns URL-dostu slug formatında metin
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Verilen bir string'i ilk harfi büyük diğerleri küçük olacak şekilde dönüştürür
 * @param text Dönüştürülecek metin
 * @returns İlk harfi büyük metin
 */
export function capitalizeFirstLetter(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Verilen bir tarihi gün.ay.yıl formatında döndürür
 * @param date Tarih nesnesi
 * @returns Formatlanmış tarih string'i
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Verilen bir metni belirli bir uzunluğa kısaltır
 * @param text Kısaltılacak metin
 * @param maxLength Maksimum uzunluk
 * @returns Kısaltılmış metin
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
} 