import { db } from "../server/db";
import { users } from "../shared/schema";

async function seedUsers() {
  console.log("Test kullanıcıları ekleniyor...");
  
  try {
    // Önce mevcut kullanıcıları kontrol edelim
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length > 0) {
      console.log(`${existingUsers.length} kullanıcı zaten veritabanında mevcut.`);
    }
    
    // Test kullanıcıları
    const testUsers = [
      {
        username: "admin",
        email: "admin@konyapostasi.com",
        password: "admin123",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        isActive: true
      },
      {
        username: "editor1",
        email: "editor1@konyapostasi.com",
        password: "editor123",
        firstName: "Ahmet",
        lastName: "Yılmaz",
        role: "editor",
        isActive: true
      },
      {
        username: "editor2",
        email: "editor2@konyapostasi.com",
        password: "editor123",
        firstName: "Mehmet",
        lastName: "Kaya",
        role: "editor",
        isActive: true
      },
      {
        username: "editor3",
        email: "editor3@konyapostasi.com",
        password: "editor123",
        firstName: "Ali",
        lastName: "Öztürk",
        role: "editor",
        isActive: true
      },
      {
        username: "editor4",
        email: "editor4@konyapostasi.com",
        password: "editor123",
        firstName: "Zeynep",
        lastName: "Şahin",
        role: "editor",
        isActive: true
      },
      {
        username: "writer1",
        email: "writer1@konyapostasi.com",
        password: "writer123",
        firstName: "Ayşe",
        lastName: "Demir",
        role: "writer",
        isActive: true
      },
      {
        username: "writer2",
        email: "writer2@konyapostasi.com",
        password: "writer123",
        firstName: "Fatma",
        lastName: "Çelik",
        role: "writer",
        isActive: true
      }
    ];
    
    // Kullanıcıları ekleyelim
    for (const user of testUsers) {
      // Kullanıcı adı veya e-posta ile kontrol edelim
      const existingUser = existingUsers.find(
        u => u.username === user.username || u.email === user.email
      );
      
      if (!existingUser) {
        await db.insert(users).values(user);
        console.log(`Kullanıcı eklendi: ${user.firstName} ${user.lastName} (${user.role})`);
      } else {
        console.log(`Kullanıcı zaten mevcut: ${user.username}`);
      }
    }
    
    console.log("Kullanıcı ekleme işlemi tamamlandı.");
  } catch (error) {
    console.error("Kullanıcı ekleme işlemi başarısız:", error);
  } finally {
    process.exit(0);
  }
}

seedUsers(); 