# KDN-Cloud / linktree

A self-hosted Linktree alternative built on plain HTML and CSS, deployed free via GitHub Pages with a custom domain through Cloudflare. No framework, no build step, no platform dependency.

**Live:** [links.aklein.pro](https://links.aklein.pro) · **Canonical:** [linktree.aklein.pro](https://linktree.aklein.pro)

Forked from [johnggli/linktree](https://github.com/johnggli/linktree).

![screenshot](screenshot.png)

---

## What's in this repo

| File | Purpose |
|---|---|
| `index.html` | The links page — profile, categories, and all link entries |
| `style.css` | All styling including the animated starfield background |
| `generator.html` | Local link generator tool — open in any browser, no server needed |
| `CNAME` | Custom domain for GitHub Pages (`linktree.aklein.pro`) |

---

## Using the generator

`generator.html` is a local tool for building link snippets without hand-editing HTML. Open it directly in your browser.

**Three template styles:**
- **AK / Terminal** — dark mono card with Font Awesome icon and optional `//` suffix label
- **Minimal** — clean white card with arrow prefix, no icons
- **Bold Dark** — uppercase black button with optional symbol prefix

**Four UI themes:** Light, GitHub Dark, Navy, Dark Purple — switchable from the topbar.

Fill in your label, URL, icon class, and category, then copy the generated snippet and paste it into `index.html`. Use the history panel to save links mid-session.

Font Awesome icon classes: [fontawesome.com/icons](https://fontawesome.com/icons) (free tier only)

---

## Deploying your own

1. **Fork this repo** to your GitHub account or organization
2. Edit `index.html` — swap in your name, photo URL, and links
3. Edit `CNAME` — replace `linktree.aklein.pro` with your domain
4. Enable **GitHub Pages** in repo Settings → Pages → set source branch to `master`, root directory
5. Add a DNS record in Cloudflare:
   ```
   Type:    CNAME
   Name:    linktree   (or whatever subdomain you want)
   Target:  <your-org-or-username>.github.io
   Proxy:   DNS only (gray cloud — NOT orange)
   ```
6. Back in GitHub Pages settings, confirm your custom domain and enable **Enforce HTTPS**

DNS propagation typically takes 2–10 minutes. GitHub will show a warning until verification completes — that's normal.

> **Why gray cloud?** GitHub Pages verifies DNS by checking that your domain resolves to their servers. Cloudflare's proxy intercepts that check and breaks certificate provisioning. Gray cloud = DNS passthrough = works correctly.

---

## Customizing

**Profile image:** Use any publicly accessible URL. GitHub avatars work well:
```
https://avatars.githubusercontent.com/u/YOUR_NUMERIC_USER_ID
```

**Adding a link (AK Terminal style):**
```html
<a class="link" href="https://github.com/you" target="_blank" rel="noopener noreferrer">
  <i class="fa-brands fa-github"></i> GITHUB
  <span class="divider">//</span> CODE_REPOSITORY
</a>
```

The `//` is a hardcoded visual divider built into the template style. What comes after it — the suffix label — is entirely up to you: `CODE_REPOSITORY`, `PERSONAL_BLOG`, `RADIO_STATION`, anything. Leave out the `<span class="divider">` line entirely if you don't want a suffix on that link.

**Adding a category label:**
```html
<div class="category-label">The Command Center</div>
```

**Alias/redirect domain:** GitHub Pages serves one domain per repo. For a second URL pointing to the same page, set up a Cloudflare Redirect Rule: `links.yourdomain.com/*` → `https://linktree.yourdomain.com/$1` (301).

**Open Graph tags:** The template includes basic meta tags. For proper link previews in Slack, Discord, etc., add full OG tags with `og:image`, dimensions, and `application/ld+json` structured data.

---

## Alias domains in use

| Domain | Type | Notes |
|---|---|---|
| `linktree.aklein.pro` | GitHub Pages (CNAME) | Canonical, served by Pages |
| `links.aklein.pro` | Cloudflare redirect (301) | Shorter URL, redirects to canonical |

---

## Full writeup

Step-by-step guide including the Cloudflare DNS gotcha, OG tags, category labels, and generator walkthrough:

[b.aklein.me — Ditching Linktree: Host Your Own Link Hub on GitHub Pages](https://b.aklein.me/2026/06/07/self-hosted-linktree-on-github-pages.html)

---

## License

MIT — see [LICENSE.md](LICENSE.md)

Original project by [John Emerson / johnggli](https://github.com/johnggli/linktree). Forked and extended by [Anthony Klein / KDN-Cloud](https://github.com/KDN-Cloud).

---

Made with ❤️ by Anthony Klein 👋 [Get in touch](https://links.aklein.pro)

