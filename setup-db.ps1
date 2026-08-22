# ============================================================
#  Setup otomatis tabel Supabase — ciremai-cashier
#  Jalankan di PowerShell (di folder ini):  .\setup-db.ps1
#  Saat diminta, tempel Supabase Management API token (sbp_...).
#  Token didapat dari: https://supabase.com/dashboard/account/tokens
#  (bukan anon key — anon key TIDAK bisa buat tabel)
# ============================================================

$ref   = "lnxprlvmyhqxkzarrzac"
$token = Read-Host -Prompt "Tempel Supabase Management API token (sbp_...)"

$sql = @"
create table if not exists transaksi (
  id text primary key,
  ts timestamptz not null,
  items jsonb not null,
  subtotal int not null,
  diskon int default 0,
  total int not null,
  bayar int not null,
  kembalian int not null
);
"@

$body = @{ query = $sql } | ConvertTo-Json -Compress

try {
  $r = Invoke-RestMethod `
    -Uri "https://api.supabase.com/v1/projects/$ref/database/query" `
    -Method Post `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $body
  Write-Host "✅ Sukses! Tabel 'transaksi' sudah siap di Supabase." -ForegroundColor Green
  Write-Host "Sekarang coba 1 transaksi di kasir.html, lalu cek Table Editor." -ForegroundColor Cyan
}
catch {
  Write-Host "❌ Gagal: $_" -ForegroundColor Red
  Write-Host "Pastikan token benar (sbp_...) dan project ref = $ref" -ForegroundColor Yellow
}
