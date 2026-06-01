// Vercel Serverless Function — anahtar burada GİZLİ kalır, tarayıcıya sızmaz.
// İstek: POST /api/generate  body: { niche, outName }
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API anahtarı sunucuda tanımlı değil." });
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

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      apiKey;

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
      return res.status(502).json({ error: "Gemini hatası", detail: data });
    }

    let txt =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    txt = txt.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(txt);
    } catch {
      return res.status(502).json({ error: "Yanıt çözümlenemedi", raw: txt });
    }

    // 1 saat cache (aynı niş+dil tekrar gelirse Gemini'yi yormaz, kotanı korur)
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: "Sunucu hatası", detail: String(e) });
  }
}
