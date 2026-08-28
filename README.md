# Base React Project

Base React Project adalah template dan boilerplate arsitektur *enterprise-grade* untuk pengembangan aplikasi web menggunakan ekosistem React modern. Template ini mengedepankan pemisahan tanggung jawab (Separation of Concerns) yang tegas antara *UI/Presentation Layer* dan *Data/Service Layer*.

## 🚀 Teknologi Utama

- **Framework & Build Tool:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management & Data Fetching:** [TanStack Query v5](https://tanstack.com/query/v5)
- **Form & Validasi:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)

## 🏗️ Arsitektur Direktori

Proyek ini menggunakan struktur modular berbasis fitur (*Feature-Sliced Design* yang disederhanakan):

```text
src/
├── api/             # Konfigurasi instance Axios (interceptor, auth token)
├── assets/          # File statis, gambar, font
├── components/      # Komponen UI global (Shadcn UI, generic button, input, dll)
├── features/        # UI Layer: Komponen spesifik domain, Pages, form UI
├── layouts/         # Layout utama aplikasi (AdminLayout, AuthLayout)
├── router/          # Konfigurasi routing (AppRouter.tsx)
├── services/        # Data Layer: Hooks (TanStack Query), Schema (Zod), Payload & Response Type
└── shared/          # Utilities, konstanta, komponen yang bisa dipakai ulang antar fitur
```

### Konvensi Lapisan (Layering)

1. **`src/services/` (Data Layer)**
   Bertanggung jawab penuh atas komunikasi ke backend. File di dalam sini tidak boleh memiliki dependensi ke komponen UI.
   - **`hooks/`**: *Custom hooks* berbasis TanStack Query (`useQuery`, `useMutation`). Semua API call (CRUD) dilakukan di sini dengan memanfaatkan `useBaseIndex`, `useBaseCreate`, `useBaseUpdate`, `useBaseDelete`, dan `useBaseShow`.
   - **`schema/`**: Definisi tipe data payload (*request*) menggunakan Zod (misal: `UserCreatePayloadSchema`).
   - **`response/`**: Definisi tipe balasan API (*response*) menggunakan tipe TypeScript dan Zod.

2. **`src/features/` (UI/Presentation Layer)**
   Bertanggung jawab untuk merender antarmuka pengguna.
   - **`pages/`**: Komponen root untuk suatu route.
   - **`components/`**: Komponen-komponen UI yang spesifik untuk fitur tersebut (misal: `UserTable`, `UserMutationForm`).
   - Fitur **hanya** boleh memanggil *hooks* dari `services` untuk mengambil/menyimpan data, memastikan UI bebas dari logika manipulasi REST API.

## 🛠️ Base React CLI

Untuk mempermudah dan mempercepat pengembangan, arsitektur ini didukung oleh **Base React CLI** (`gotra`). 
CLI ini berfungsi sebagai *scaffolding tool* yang dapat membuat struktur modul, komponen, *service*, dan otomatis menginjeksi rute ke dalam proyek.

### Cara Penggunaan CLI (Contoh):
```bash
# Men-generate modul lengkap (UI dan Service) beserta injeksi routing
gotra make:module nama-modul

# Men-generate spesifik komponen atau service
gotra make:service nama-service
gotra make:page nama-page --module nama-modul
```
*(Lihat repositori CLI untuk panduan instalasi dan penggunaan lebih lengkap).*

## 📦 Memulai Proyek

1. **Instalasi Dependensi**
   ```bash
   npm install
   ```

2. **Menjalankan Development Server**
   ```bash
   npm run dev
   ```

3. **Build untuk Produksi**
   Sebelum melakukan *build*, proyek akan selalu memastikan tidak ada *error* TypeScript (`tsc -b`).
   ```bash
   npm run build
   ```

4. **Linting**
   ```bash
   npm run lint
   ```

## 🔒 Variabel Lingkungan (.env)

Gunakan file `.env` untuk menyimpan konfigurasi *endpoint* API atau *key* pihak ketiga (misal: WhatsApp API). Contoh:
```env
VITE_API_URL=http://localhost:8000/api
VITE_WA_API_URL=https://wa.example.com
VITE_WA_API_KEY=your_api_key
VITE_WA_USER=your_user_id
```
