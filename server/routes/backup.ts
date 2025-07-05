import { Router } from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { db } from '../db';
import multer from 'multer';

const router = Router();
const backupDir = path.join(process.cwd(), 'backups');

// Klasörü oluştur (yoksa)
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Backup ayarları için şema
const backupSettingsSchema = z.object({
  autoBackup: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
});

// Yükleme için multer konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, backupDir);
  },
  filename: (req, file, cb) => {
    cb(null, `restore-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Sadece .sql dosyalarını kabul et
    if (path.extname(file.originalname).toLowerCase() === '.sql') {
      cb(null, true);
    } else {
      cb(new Error('Sadece SQL dosyaları yüklenebilir'));
    }
  }
});

// Yedekleme ayarlarını al
router.get('/settings', async (req, res) => {
  try {
    // Gerçek uygulamada bu ayarlar veritabanından alınır
    const settings = {
      autoBackup: true,
      frequency: 'daily'
    };
    
    res.json(settings);
  } catch (error) {
    console.error('Yedekleme ayarları alınırken hata:', error);
    res.status(500).json({ error: 'Yedekleme ayarları alınamadı' });
  }
});

// Yedekleme ayarlarını güncelle
router.post('/settings', async (req, res) => {
  try {
    const settings = backupSettingsSchema.parse(req.body);
    
    // Gerçek uygulamada bu ayarlar veritabanına kaydedilir
    
    res.json({ success: true, message: 'Yedekleme ayarları güncellendi', settings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Geçersiz yedekleme ayarları', details: error.errors });
    }
    console.error('Yedekleme ayarları güncellenirken hata:', error);
    res.status(500).json({ error: 'Yedekleme ayarları güncellenemedi' });
  }
});

// Manuel yedekleme oluştur
router.post('/create', async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.sql`;
    const backupFilePath = path.join(backupDir, backupFileName);
    
    // PostgreSQL veritabanı bilgileri
    const dbName = process.env.DB_NAME || 'konyapostasi_panel';
    const dbUser = process.env.DB_USER || 'postgres';
    const dbPassword = process.env.DB_PASSWORD || '8587';
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || '5432';
    
    // Windows için pg_dump komutu
    const command = `"C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe" -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} -f "${backupFilePath}" -w`;
    
    console.log('Executing backup command:', command);
    
    // Çevresel değişkenleri ayarla
    const env = {
      ...process.env,
      PGPASSWORD: dbPassword
    };
    
    exec(command, { env }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Yedekleme hatası: ${error.message}`);
        return res.status(500).json({ error: 'Yedekleme oluşturulamadı', details: error.message });
      }
      
      if (stderr) {
        console.warn(`Yedekleme uyarısı: ${stderr}`);
      }
      
      console.log('Backup stdout:', stdout);
      
      // Dosya varlığını kontrol et
      if (!fs.existsSync(backupFilePath)) {
        console.error('Backup file was not created:', backupFilePath);
        return res.status(500).json({ error: 'Yedekleme dosyası oluşturulamadı' });
      }
      
      // Dosya boyutunu al
      const stats = fs.statSync(backupFilePath);
      const fileSizeInBytes = stats.size;
      const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
      
      res.json({ 
        success: true, 
        message: 'Yedekleme başarıyla oluşturuldu', 
        backup: {
          filename: backupFileName,
          path: backupFilePath,
          size: `${fileSizeInMB} MB`,
          date: new Date().toISOString(),
          type: 'Manuel'
        }
      });
    });
  } catch (error) {
    console.error('Yedekleme oluşturulurken hata:', error);
    res.status(500).json({ error: 'Yedekleme oluşturulamadı' });
  }
});

// Yedekleme dosyasını indir
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(backupDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Yedekleme dosyası bulunamadı' });
    }
    
    res.download(filePath);
  } catch (error) {
    console.error('Yedekleme dosyası indirilirken hata:', error);
    res.status(500).json({ error: 'Yedekleme dosyası indirilemedi' });
  }
});

// Yedekleme geri yükle
router.post('/restore', upload.single('backupFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Yedekleme dosyası yüklenmedi' });
    }
    
    const uploadedFilePath = req.file.path;
    
    // PostgreSQL veritabanı bilgileri
    const dbName = process.env.DB_NAME || 'konyapostasi_panel';
    const dbUser = process.env.DB_USER || 'postgres';
    const dbPassword = process.env.DB_PASSWORD || '8587';
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || '5432';
    
    // Windows için psql komutu
    const command = `"C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe" -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} -f "${uploadedFilePath}" -w`;
    
    console.log('Executing restore command:', command);
    
    // Çevresel değişkenleri ayarla
    const env = {
      ...process.env,
      PGPASSWORD: dbPassword
    };
    
    exec(command, { env }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Geri yükleme hatası: ${error.message}`);
        return res.status(500).json({ error: 'Yedekleme geri yüklenemedi', details: error.message });
      }
      
      if (stderr) {
        console.warn(`Geri yükleme uyarısı: ${stderr}`);
      }
      
      console.log('Restore stdout:', stdout);
      
      res.json({ 
        success: true, 
        message: 'Yedekleme başarıyla geri yüklendi'
      });
    });
  } catch (error) {
    console.error('Yedekleme geri yüklenirken hata:', error);
    res.status(500).json({ error: 'Yedekleme geri yüklenemedi' });
  }
});

// Yedekleme listesini al
router.get('/list', (req, res) => {
  try {
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
        
        // Dosya adından tarih ve tip bilgisini çıkar
        const isAutomatic = file.includes('auto');
        
        return {
          filename: file,
          date: new Date(stats.mtime).toISOString(),
          size: `${fileSizeInMB} MB`,
          type: isAutomatic ? 'Otomatik' : 'Manuel'
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // En yeni en üstte
    
    res.json(backupFiles);
  } catch (error) {
    console.error('Yedekleme listesi alınırken hata:', error);
    res.status(500).json({ error: 'Yedekleme listesi alınamadı' });
  }
});

// Yedekleme dosyasını sil
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(backupDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Yedekleme dosyası bulunamadı' });
    }
    
    fs.unlinkSync(filePath);
    
    res.json({ success: true, message: 'Yedekleme dosyası silindi' });
  } catch (error) {
    console.error('Yedekleme dosyası silinirken hata:', error);
    res.status(500).json({ error: 'Yedekleme dosyası silinemedi' });
  }
});

export default router; 