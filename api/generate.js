// Vercel Serverless Function — anahtar burada GİZLİ kalır, tarayıcıya sızmaz.
// İstek: POST /api/generate  body: { niche, outName }
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API anahtarı sunucuda tanımlı değil (GEMINI_API_KEY)." });
  }

  try {
    const { niche, outName } = req.body || {};
    if (!niche || !outName) {
      return res.status(400).json({ error: "Eksik parametre." });
    }

    const prompt = `You are the AI engine of "Dijital Ürün Roketi", a tool that generates ready-to-sell Etsy digital product listings.
The user picked the niche: "${niche}".
Generate a complete Etsy listing in ${outName} language.
Respond ONLY with a valid JSON object, no markdown, no backticks, with EXACTLY these keys:
{
 "product": short product name (3-5 words, in ${outName}),
 "title": an SEO-optimized Etsy title (60-130 chars, keyword-rich, with | separators, in ${outName}),
 "description": a warm, psychologist-informed product description (2-3 sentences, in ${outName}),
 "tags": array of exactly 8 short Etsy SEO tags (lowercase, 1-3 words each, in ${outName}),
 "cover": 2-3 very short words for a cover image, separated by " / "
}`;

    // Bu hesapta MEVCUT olduğu doğrulanmış modeller (models listesinden)
    const models = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.0-flash"];
    let lastErr = null;

    for (const model of models) {
      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/" +
        model + ":generateContent?key=" + apiKey;

      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        lastErr = data?.error?.message || JSON.stringify(data);
        continue;
      }

      let txt =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
      txt = txt.replace(/```json|```/g, "").trim();

      try {
        const parsed = JSON.parse(txt);
        res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
        return res.status(200).json(parsed);
      } catch {
        lastErr = "Yanıt JSON olarak çözümlenemedi: " + txt.slice(0, 200);
        continue;
      }
    }

    return res.status(502).json({ error: "Üretim başarısız", detail: lastErr });
  } catch (e) {
    return res.status(500).json({ error: "Sunucu hatası", detail: String(e) });
  }
}
