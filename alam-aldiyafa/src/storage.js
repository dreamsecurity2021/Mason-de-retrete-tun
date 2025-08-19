import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export function ensureStorageInitialized() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const seed = {
      lastIds: { apartment: 3, booking: 0 },
      apartments: [
        {
          id: 1,
          name: 'جناح ديلوكس - البحر',
          location: 'كورنيش جدة',
          description: 'إطلالة بحرية رائعة مع صالة واسعة ومطبخ مجهز بالكامل.',
          bedrooms: 2,
          pricePerNight: 480,
          amenities: ['واي فاي', 'موقف سيارات', 'مسبح', 'مطبخ'],
          images: ['/public/img/apt1.jpg']
        },
        {
          id: 2,
          name: 'شقة عائلية - المدينة',
          location: 'الرياض - العليا',
          description: 'خيار ممتاز للعوائل بالقرب من المولات والمطاعم.',
          bedrooms: 3,
          pricePerNight: 620,
          amenities: ['واي فاي', 'تلفاز', 'مطبخ', 'خدمة تنظيف'],
          images: ['/public/img/apt2.jpg']
        },
        {
          id: 3,
          name: 'استوديو أنيق',
          location: 'الخبر - الواجهة البحرية',
          description: 'استوديو مريح لرحلات العمل القصيرة.',
          bedrooms: 1,
          pricePerNight: 300,
          amenities: ['واي فاي', 'موقف سيارات'],
          images: ['/public/img/apt3.jpg']
        }
      ],
      bookings: []
    };
    writeJsonFile(DATA_FILE, seed);
  }
}

function loadDb() {
  const db = readJsonFile(DATA_FILE);
  if (!db) {
    throw new Error('تعذر قراءة قاعدة البيانات المحلية');
  }
  return db;
}

function saveDb(db) {
  writeJsonFile(DATA_FILE, db);
}

export function getAllApartments() {
  const db = loadDb();
  return db.apartments;
}

export function getApartmentById(apartmentId) {
  const db = loadDb();
  return db.apartments.find(a => a.id === apartmentId) || null;
}

export function addApartment(apartmentInput) {
  const db = loadDb();
  db.lastIds.apartment += 1;
  const newApartment = {
    id: db.lastIds.apartment,
    name: apartmentInput.name,
    location: apartmentInput.location,
    description: apartmentInput.description || '',
    bedrooms: Number(apartmentInput.bedrooms || 1),
    pricePerNight: Number(apartmentInput.pricePerNight || 0),
    amenities: Array.isArray(apartmentInput.amenities) ? apartmentInput.amenities : [],
    images: Array.isArray(apartmentInput.images) ? apartmentInput.images : []
  };
  db.apartments.push(newApartment);
  saveDb(db);
  return newApartment;
}

export function getBookingsForApartment(apartmentId) {
  const db = loadDb();
  return db.bookings.filter(b => b.apartmentId === apartmentId);
}

export function isApartmentAvailable(apartmentId, checkInDate, checkOutDate) {
  const bookings = getBookingsForApartment(apartmentId);
  const newStart = new Date(checkInDate);
  const newEnd = new Date(checkOutDate);
  for (const booking of bookings) {
    const existingStart = new Date(booking.checkIn);
    const existingEnd = new Date(booking.checkOut);
    // overlap if start < existingEnd && end > existingStart
    const overlaps = newStart < existingEnd && newEnd > existingStart;
    if (overlaps) return false;
  }
  return true;
}

export function createBooking(bookingInput) {
  const db = loadDb();
  db.lastIds.booking += 1;
  const newBooking = {
    id: db.lastIds.booking,
    apartmentId: Number(bookingInput.apartmentId),
    fullName: bookingInput.fullName,
    phone: bookingInput.phone,
    email: bookingInput.email || '',
    checkIn: bookingInput.checkIn,
    checkOut: bookingInput.checkOut,
    totalPrice: Number(bookingInput.totalPrice || 0),
    createdAt: new Date().toISOString()
  };
  db.bookings.push(newBooking);
  saveDb(db);
  return newBooking;
}

