# ownkey site

Marketing site for [Ownkey](https://ownkey.bvdm.ai) — private AI input for Android and Windows.

Static HTML/CSS/JS, no build step.

## Develop

```bash
python -m http.server 4173
# open http://localhost:4173
```

## Deploy

Hosted on Netlify (site `ownkey`, team `majesteitbart`) at https://ownkey.bvdm.ai.
DNS: Cloudflare CNAME `ownkey.bvdm.ai` → `ownkey.netlify.app` (DNS-only, not proxied,
so Netlify manages the TLS certificate).

```bash
netlify deploy --prod --dir .
```

## Related

- [ownkey-keyboard](https://github.com/MajesteitBart/ownkey-keyboard) — Ownkey Keyboard for Android
- [ownkey-windows](https://github.com/MajesteitBart/ownkey-windows) — Ownkey for Windows
