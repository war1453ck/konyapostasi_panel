import { db } from "../server/db";
import { cities } from "../shared/schema";
import { generateSlug } from "../server/utils";

const turkishCities = [
  { name: "Adana", code: "01" },
  { name: "Adıyaman", code: "02" },
  { name: "Afyonkarahisar", code: "03" },
  { name: "Ağrı", code: "04" },
  { name: "Amasya", code: "05" },
  { name: "Ankara", code: "06" },
  { name: "Antalya", code: "07" },
  { name: "Artvin", code: "08" },
  { name: "Aydın", code: "09" },
  { name: "Balıkesir", code: "10" },
  { name: "Bilecik", code: "11" },
  { name: "Bingöl", code: "12" },
  { name: "Bitlis", code: "13" },
  { name: "Bolu", code: "14" },
  { name: "Burdur", code: "15" },
  { name: "Bursa", code: "16" },
  { name: "Çanakkale", code: "17" },
  { name: "Çankırı", code: "18" },
  { name: "Çorum", code: "19" },
  { name: "Denizli", code: "20" },
  { name: "Diyarbakır", code: "21" },
  { name: "Edirne", code: "22" },
  { name: "Elazığ", code: "23" },
  { name: "Erzincan", code: "24" },
  { name: "Erzurum", code: "25" },
  { name: "Eskişehir", code: "26" },
  { name: "Gaziantep", code: "27" },
  { name: "Giresun", code: "28" },
  { name: "Gümüşhane", code: "29" },
  { name: "Hakkari", code: "30" },
  { name: "Hatay", code: "31" },
  { name: "Isparta", code: "32" },
  { name: "Mersin", code: "33" },
  { name: "İstanbul", code: "34" },
  { name: "İzmir", code: "35" },
  { name: "Kars", code: "36" },
  { name: "Kastamonu", code: "37" },
  { name: "Kayseri", code: "38" },
  { name: "Kırklareli", code: "39" },
  { name: "Kırşehir", code: "40" },
  { name: "Kocaeli", code: "41" },
  { name: "Konya", code: "42" },
  { name: "Kütahya", code: "43" },
  { name: "Malatya", code: "44" },
  { name: "Manisa", code: "45" },
  { name: "Kahramanmaraş", code: "46" },
  { name: "Mardin", code: "47" },
  { name: "Muğla", code: "48" },
  { name: "Muş", code: "49" },
  { name: "Nevşehir", code: "50" },
  { name: "Niğde", code: "51" },
  { name: "Ordu", code: "52" },
  { name: "Rize", code: "53" },
  { name: "Sakarya", code: "54" },
  { name: "Samsun", code: "55" },
  { name: "Siirt", code: "56" },
  { name: "Sinop", code: "57" },
  { name: "Sivas", code: "58" },
  { name: "Tekirdağ", code: "59" },
  { name: "Tokat", code: "60" },
  { name: "Trabzon", code: "61" },
  { name: "Tunceli", code: "62" },
  { name: "Şanlıurfa", code: "63" },
  { name: "Uşak", code: "64" },
  { name: "Van", code: "65" },
  { name: "Yozgat", code: "66" },
  { name: "Zonguldak", code: "67" },
  { name: "Aksaray", code: "68" },
  { name: "Bayburt", code: "69" },
  { name: "Karaman", code: "70" },
  { name: "Kırıkkale", code: "71" },
  { name: "Batman", code: "72" },
  { name: "Şırnak", code: "73" },
  { name: "Bartın", code: "74" },
  { name: "Ardahan", code: "75" },
  { name: "Iğdır", code: "76" },
  { name: "Yalova", code: "77" },
  { name: "Karabük", code: "78" },
  { name: "Kilis", code: "79" },
  { name: "Osmaniye", code: "80" },
  { name: "Düzce", code: "81" }
];

async function seedCities() {
  console.log("Şehirler ekleniyor...");
  
  try {
    // Önce mevcut şehirleri kontrol edelim
    const existingCities = await db.select().from(cities);
    
    if (existingCities.length > 0) {
      console.log(`${existingCities.length} şehir zaten veritabanında mevcut.`);
      
      // Hangi şehirlerin eksik olduğunu kontrol edelim
      const existingCityCodes = existingCities.map(city => city.code);
      const missingCities = turkishCities.filter(city => !existingCityCodes.includes(city.code));
      
      if (missingCities.length === 0) {
        console.log("Tüm şehirler zaten eklenmiş.");
        return;
      }
      
      console.log(`${missingCities.length} şehir eklenecek.`);
      
      // Eksik şehirleri ekleyelim
      for (const city of missingCities) {
        const slug = generateSlug(city.name);
        await db.insert(cities).values({
          name: city.name,
          slug: slug,
          code: city.code
        });
      }
      
      console.log(`${missingCities.length} şehir başarıyla eklendi.`);
    } else {
      // Hiç şehir yoksa tümünü ekleyelim
      for (const city of turkishCities) {
        const slug = generateSlug(city.name);
        await db.insert(cities).values({
          name: city.name,
          slug: slug,
          code: city.code
        });
      }
      
      console.log(`${turkishCities.length} şehir başarıyla eklendi.`);
    }
  } catch (error) {
    console.error("Şehir ekleme işlemi başarısız:", error);
  } finally {
    process.exit(0);
  }
}

seedCities(); 