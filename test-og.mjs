// test-og.mjs

async function test() {
  console.log("🚀 Test üretimi başlıyor...");
  try {
    // Dinamik import kullanarak tüm dosyayı bir obje olarak alıyoruz
    const OG = await import('./src/lib/og-generator.ts');
    
    // OG objesi içindeki fonksiyonu çağırıyoruz
    await OG.generateStaticOG(
      "Isı Pompası Sistemleri ve Verimlilik",
      "Hizmetler",
      null,
      "test-gorsel"
    );
    
    console.log("✅ Başarılı! public/og/test-gorsel.png dosyasını kontrol et.");
  } catch (error) {
    console.error("❌ Hata oluştu:", error);
  }
}

test();