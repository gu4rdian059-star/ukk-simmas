import fs from 'fs';

async function inspectAdminDashboard() {
  console.log('Fetching live dashboard chunks & data...');
  const res = await fetch('https://simmas.bagus-hidayat.my.id/admin/dashboard');
  const text = await res.text();
  
  // Search for chunks
  const jsChunks = text.match(/\/static\/chunks\/[a-zA-Z0-9_\-\.]+\.js/g) || [];
  console.log(`Checking ${jsChunks.length} chunks...`);

  for (const chunk of jsChunks) {
    const chunkRes = await fetch('https://simmas.bagus-hidayat.my.id/_next' + chunk);
    const chunkText = await chunkRes.text();
    if (chunkText.includes('Tren Pengajuan') || chunkText.includes('Aktivitas Sistem Terakhir') || chunkText.includes('pengajuan magang')) {
      console.log('FOUND Dashboard content in chunk:', chunk);
      fs.writeFileSync('dashboard_chunk.js', chunkText);
      console.log('Saved dashboard_chunk.js (' + chunkText.length + ' chars)');
      break;
    }
  }
}

inspectAdminDashboard();

