export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-red-500">Akses Ditolak</h1>
      <p className="text-muted-foreground">
        Kamu tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <a href="/login" className="text-blue-500 underline">
        Kembali ke Login
      </a>
      <p className="text-muted-foreground">atau</p>
      <a href="/" className="text-blue-500 underline">
        Kembali ke Beranda
      </a>
    </div>
  );
}
