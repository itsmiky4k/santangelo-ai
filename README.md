# Angelo — Assistente Virtuale
## Grotta di Sant'Angelo in Criptis · Progetto Sant'Angelo 4.0

Widget AI per il Centro Visite. Costruito con Next.js + API Claude (Anthropic).

---

## Setup locale

```bash
# 1. Installa le dipendenze
npm install

# 2. Crea il file delle variabili d'ambiente
cp .env.example .env.local
# Apri .env.local e inserisci la tua ANTHROPIC_API_KEY

# 3. Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) — vedrai la pagina demo con il widget in basso a destra.

---

## Deploy su Vercel

```bash
# 1. Push su GitHub
git init
git add .
git commit -m "feat: init Angelo chatbot"
git remote add origin https://github.com/TUO-USERNAME/santangelo-ai.git
git push -u origin main

# 2. Importa il progetto su vercel.com
# 3. Aggiungi la variabile d'ambiente ANTHROPIC_API_KEY nelle impostazioni Vercel
# 4. Deploy automatico ad ogni push su main
```

---

## Embed sul sito esistente (grottadisantangelo.it)

Dopo il deploy su Vercel, aggiungi questo snippet prima della chiusura del tag `</body>` nel sito WordPress:

```html
<script>
  (function() {
    var iframe = document.createElement('div');
    iframe.id = 'angelo-widget-container';
    document.body.appendChild(iframe);
    
    var script = document.createElement('script');
    // punta al tuo dominio Vercel
    script.src = 'https://santangelo-ai.vercel.app/widget.js'; 
    document.body.appendChild(script);
  })();
</script>
```

Oppure, più semplicemente, usa un iframe nella sidebar WordPress:
```html
<iframe 
  src="https://santangelo-ai.vercel.app" 
  style="position:fixed;bottom:0;right:0;width:420px;height:620px;border:none;z-index:9999;background:transparent"
  allow="clipboard-write"
></iframe>
```

---

## Aggiornare la knowledge base

Modifica il file `src/lib/system-prompt.ts` e fai push. Vercel rideploya in automatico.

## Aggiungere il Drive (prossimo step)

Vedi branch `feature/drive-rag` — script di sync con Supabase pgvector.

---

## Stack
- **Framework**: Next.js 15 (App Router)
- **AI**: Claude claude-sonnet-4-5 via Anthropic SDK
- **Deploy**: Vercel (gratuito)
- **Prossimamente**: Supabase pgvector per RAG con documenti Drive
