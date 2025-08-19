import path from 'path';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import dayjs from 'dayjs';
import { fileURLToPath } from 'url';
import {
  ensureStorageInitialized,
  getAllApartments,
  getApartmentById,
  addApartment,
  getBookingsForApartment,
  createBooking,
  isApartmentAvailable
} from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Views setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Locals for templates
app.use((req, res, next) => {
  res.locals.appName = 'عالم الضيافة';
  res.locals.currentPath = req.path;
  next();
});

// Home
app.get('/', (req, res) => {
  const apartments = getAllApartments();
  res.render('home', { title: 'الرئيسية', apartments });
});

// List apartments
app.get('/apartments', (req, res) => {
  const apartments = getAllApartments();
  res.render('apartments', { title: 'الشقق المتاحة', apartments });
});

// Apartment details
app.get('/apartments/:id', (req, res) => {
  const apartmentId = Number(req.params.id);
  const apartment = getApartmentById(apartmentId);
  if (!apartment) {
    return res.status(404).send('الشقة غير موجودة');
  }
  const bookings = getBookingsForApartment(apartmentId);
  res.render('apartment', {
    title: apartment.name,
    apartment,
    bookings
  });
});

// Booking endpoint
app.post('/apartments/:id/book', (req, res) => {
  const apartmentId = Number(req.params.id);
  const apartment = getApartmentById(apartmentId);
  if (!apartment) {
    return res.status(404).send('الشقة غير موجودة');
  }

  const { fullName, phone, email, checkIn, checkOut } = req.body;

  if (!fullName || !phone || !checkIn || !checkOut) {
    return res.status(400).send('الرجاء تعبئة جميع الحقول المطلوبة');
  }

  const checkInDate = dayjs(checkIn);
  const checkOutDate = dayjs(checkOut);

  if (!checkInDate.isValid() || !checkOutDate.isValid()) {
    return res.status(400).send('تواريخ غير صحيحة');
  }
  if (!checkOutDate.isAfter(checkInDate)) {
    return res.status(400).send('تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول');
  }

  if (!isApartmentAvailable(apartmentId, checkInDate.toDate(), checkOutDate.toDate())) {
    return res.status(400).send('عذراً، الشقة غير متاحة في هذه التواريخ');
  }

  const nights = checkOutDate.diff(checkInDate, 'day');
  const totalPrice = nights * apartment.pricePerNight;

  const booking = createBooking({
    apartmentId,
    fullName,
    phone,
    email: email || '',
    checkIn: checkInDate.toISOString(),
    checkOut: checkOutDate.toISOString(),
    totalPrice
  });

  return res.redirect(`/success?bookingId=${booking.id}`);
});

// Success page
app.get('/success', (req, res) => {
  const bookingId = Number(req.query.bookingId);
  if (!bookingId) {
    return res.redirect('/');
  }
  res.render('booking_success', { title: 'تم تأكيد الحجز', bookingId });
});

// Admin: list apartments
app.get('/admin/apartments', (req, res) => {
  const apartments = getAllApartments();
  res.render('admin_apartments', { title: 'لوحة التحكم - الشقق', apartments });
});

// Admin: new apartment form
app.get('/admin/apartments/new', (req, res) => {
  res.render('admin_new_apartment', { title: 'إضافة شقة جديدة' });
});

// Admin: create apartment
app.post('/admin/apartments', (req, res) => {
  const {
    name,
    location,
    description,
    bedrooms,
    pricePerNight,
    amenities,
    images
  } = req.body;

  if (!name || !location || !pricePerNight) {
    return res.status(400).send('الاسم والموقع والسعر مطلوبة');
  }

  const apartment = addApartment({
    name,
    location,
    description: description || '',
    bedrooms: Number(bedrooms || 1),
    pricePerNight: Number(pricePerNight),
    amenities: (amenities || '').split(',').map(a => a.trim()).filter(Boolean),
    images: (images || '').split(',').map(a => a.trim()).filter(Boolean)
  });

  res.redirect('/admin/apartments');
});

// Initialize storage and start server
ensureStorageInitialized();

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Alam Al-Diyafa running on http://localhost:${PORT}`);
});

