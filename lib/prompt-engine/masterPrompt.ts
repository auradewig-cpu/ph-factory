export function compileMasterPrompt(params: {
  niche: string;
  platform: string;
  ratio: string;
  sceneCount: number;
  hasCharacter: boolean;
  personaDescription?: string;
  voiceMode: 'voiceover_only' | 'on_camera_dialogue' | 'none';
  language: 'id' | 'en';
}): string {
  const lang = params.language === 'id' ? 'Bahasa Indonesia' : 'English';
  const langInstruction = params.language === 'id'
    ? 'Semua scriptNarration dalam Bahasa Indonesia.'
    : 'All scriptNarration in English.';

  let characterBlock = '';
  if (params.hasCharacter && params.personaDescription) {
    characterBlock = `\nKarakter yang tampil: ${params.personaDescription}\nDeskripsi karakter ini WAJIB disertakan verbatim di imagePrompt DAN videoPrompt setiap scene yang menampilkan karakter.`;
  }

  let voiceBlock: string;
  const audioTagsInstruction = `\nAudio tag (sisipkan ke scriptNarration maksimal 1-2 tag per scene, hanya kalau konteks kalimat mendukung, jangan dipaksakan):
  [laughs] — tertawa, [sighs] — menghela napas, [excited] — bersemangat, [whispers] — berbisik, [gasps] — terkejut/kaget.
  Contoh: "Ini lucu sekali! [laughs] Tapi jujur, kadang aku juga sedih. [sighs]"
  Gunakan [excited]/[gasps] untuk hook/cta energi tinggi. Gunakan [sighs]/[laughs] untuk body naratif/personal.`;

  if (params.voiceMode === 'voiceover_only') {
    voiceBlock = 'Tidak ada karakter yang tampil di kamera. Semua narasi adalah voiceover. scriptNarration adalah naskah voiceover.' + audioTagsInstruction;
  } else if (params.voiceMode === 'on_camera_dialogue') {
    voiceBlock = 'Karakter berbicara langsung di depan kamera. scriptNarration adalah dialog yang diucapkan karakter.' + audioTagsInstruction;
  } else {
    voiceBlock = 'Tidak ada suara/narasi. scriptNarration boleh null. Konten mengandalkan teks on-screen dan visual saja.';
  }

  const cameraGuidelines = params.hasCharacter
    ? 'Gunakan berbagai teknik kamera sesuai mood tiap scene (drone untuk establishing, steadicam untuk walkthrough, dll).'
    : 'Condongkan ke teknik kamera yang menyorot produk/subjek tanpa karakter: pov_handheld_product, static_wide_establish, drone aerial, rack_focus_detail.';

  return `Anda adalah sutradara video profesional. Buatkan skenario ${params.sceneCount} scene untuk konten ${params.platform} dengan rasio ${params.ratio}.

${voiceBlock}
${characterBlock}

Untuk setiap scene, tentukan:
- sceneType: hook (pembuka, grab attention), body (isi konten), cta (ajakan bertindak/penutup)
- cameraTechnique: sesuai konteks visual scene. ${cameraGuidelines}
- continuityType: hubungan transisi antar scene. Scene yang melanjutkan momen yang sama → 'continuous'. Ganti sudut kamera di momen yang masih terkait → 'match_cut'. Lompat ke adegan/waktu/lokasi baru → 'hard_cut'.
- imagePrompt: prompt detail untuk generate GAMBAR diam scene ini (deskripsi visual frame, komposisi, pencahayaan, warna).
- videoPrompt: prompt detail untuk generate VIDEO, WAJIB sertakan KOMBINASI elemen sinematografi berikut dalam satu deskripsi mengalir (bukan daftar terpisah, gabungkan jadi kalimat profesional):
    1. Shot size (extreme wide/wide/full/medium/medium close-up/close-up/extreme close-up)
    2. Camera angle (eye level/low angle/high angle/bird eye/dutch angle) — pilih sesuai mood scene
    3. Camera movement spesifik (dolly in/out, pan, tilt, tracking, handheld, static, orbit, crane, push in, pull out) — SESUAI cameraTechnique yang sudah ditentukan
    4. Lens (sebutkan mm — 24mm untuk wide/landscape, 35-50mm untuk natural, 85mm untuk portrait dengan background blur, 135mm+ untuk compression/aksi)
    5. Focus technique kalau relevan (shallow depth of field, rack focus, deep focus)
    6. Lighting & mood (golden hour, soft backlight, dramatic shadow, natural light, dll — SESUAI konteks niche dan sceneType)
    Contoh kualitas yang diharapkan: "Slow cinematic dolly-in, medium close-up, 85mm lens, shallow depth of field, warm golden-hour lighting, subtle handheld breathing motion, emotional atmosphere" — BUKAN sekadar "kamera mendekat ke wajah karakter".
- scriptNarration: naskah narasi/dialog untuk scene ini${params.voiceMode === 'none' ? ' (null kalau tidak ada suara)' : ''}.
- durationSeconds: durasi scene dalam detik (5-120).
- maxWords: jumlah maksimum kata untuk narasi scene ini.
- speechPace: kecepatan bicara (lambat/normal/cepat).

Aturan tambahan:
- Scene 1 HARUS hook, scene terakhir HARUS cta. Scene di antaranya adalah body.
- sceneNumber harus urut dari 1 sampai ${params.sceneCount}.
- ${langInstruction}
- imagePrompt dan videoPrompt harus panjang dan deskriptif (minimal 50 karakter), bukan kalimat pendek.
- cameraTechnique scene pertama sebaiknya yang establishing/wide untuk mengenalkan setting.
  - Variasikan shot size dan lens antar scene — jangan pakai kombinasi yang sama persis di 2+ scene berturut-turut, supaya ritme visual terasa dinamis seperti editing film sungguhan.`;
}
