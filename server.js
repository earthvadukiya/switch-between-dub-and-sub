import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 REDIRECT METHOD (SAFE)
app.get("/api/stream", (req, res) => {
  const { id, lang } = req.query;

  if (!id) {
    return res.status(400).send("Missing episode ID");
  }

  // ✅ FIX: sanitize lang
  let type = "sub";
  if (lang === "dub") type = "dub";

  const embedUrl = `https://megaplay.buzz/stream/s-2/${id}/${type}`;

  res.redirect(embedUrl);
});

// 🔥 PROXY PAGE (SAFE + SUB/DUB SUPPORT)
app.get("/watch/:id", (req, res) => {
  const { id } = req.params;
  const { lang } = req.query;

  if (!id) {
    return res.status(400).send("Missing episode ID");
  }

  // ✅ FIX: sanitize lang
  let type = "sub";
  if (lang === "dub") type = "dub";

  const embedUrl = `https://megaplay.buzz/stream/s-2/${id}/${type}`;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Player</title>
      <style>
        body { margin:0; background:black; }
        iframe { width:100%; height:100vh; border:none; }
      </style>
    </head>
    <body>
      <iframe 
        src="${embedUrl}" 
        allowfullscreen 
        allow="autoplay; encrypted-media"
      ></iframe>
    </body>
    </html>
  `);
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
