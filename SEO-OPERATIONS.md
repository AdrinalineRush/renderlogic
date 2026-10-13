# RenderLogic SEO and visibility operations

The site code now provides canonical topic pages, structured data, descriptive metadata, crawlable internal links, an XML sitemap, image dimensions and alt text, analytics events, and a real 404 page. Search visibility still depends on deployment, indexing, content quality, reputation, and ongoing measurement.

## 1. Deploy and verify the production host

- Keep `https://www.renderlogic.in/` as the only preferred host.
- Preserve the existing permanent redirect from `https://renderlogic.in/` to `https://www.renderlogic.in/` and confirm it returns HTTP `301` or `308`, not `200` on both hosts.
- Make sure every URL in `sitemap.xml` returns HTTP `200` with its matching canonical tag.
- Make sure missing URLs return a real HTTP `404` and render `404.html`; do not rewrite every unknown path to the home page.
- Keep HTTPS enabled and redirect HTTP requests to HTTPS.
- Configure long-lived caching for versioned or stable images, CSS, and JavaScript while keeping HTML and `sitemap.xml` revalidatable.

## 2. Google Search Console

1. Verify a Domain property for `renderlogic.in` so both host variants are covered.
2. Submit `https://www.renderlogic.in/sitemap.xml` in the Sitemaps report.
3. Inspect the home page and each new canonical page with URL Inspection after deployment.
4. Request indexing for the core pages first: home, Film Making, Software Lab, Parayu, About, Blog, and Contact.
5. Review Pages, Core Web Vitals, HTTPS, structured-data enhancements, and manual actions weekly for the first month.
6. Compare the submitted sitemap URL count with indexed canonical URLs; investigate redirects, soft 404s, duplicates, and “crawled—currently not indexed” pages.

Google treats a sitemap as a discovery hint rather than an indexing guarantee. It recommends absolute canonical URLs and accurate `lastmod` values, and ignores `priority` and `changefreq`: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## 3. Google Analytics 4

The site records the existing GA4 property `G-XNH281S53R` and adds these useful events:

- `view_section` for home-page SPA sections
- `generate_lead` when an email inquiry is prepared
- `contact_click` for email and phone intent
- `contact_copy` when the address is copied
- `outbound_click` for external destinations
- `cta_click` for important landing-page calls to action

In GA4, open **Admin → Data Streams → Web → Enhanced measurement → Page views** and enable page changes based on browser history. Then use DebugView to verify each home-page tab produces one page view—not zero and not two. Google recommends browser-history measurement for SPAs: [GA4 SPA measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications).

Create conversions/key events for qualified `generate_lead` activity only after verifying the mail-client workflow. Do not count every navigation click as a lead.

## 4. Bing and other search surfaces

- Add the domain to Bing Webmaster Tools and import the verified Google Search Console property when convenient.
- Submit the same canonical sitemap URL.
- Confirm that Bing sees the permanent host redirect and the same canonical URLs as Google.
- Keep RenderLogic's name, legal name, location, website, email, phone, and social-profile links consistent across owned profiles.

## 5. Local and entity visibility

- If RenderLogic is eligible for a Google Business Profile, use the accurate customer-facing address or service area and the same name, phone, site, and category everywhere. Do not create a location that customers cannot actually visit.
- Link the RenderLogic site from Achu Vijayan's owned LinkedIn and Instagram profiles, and link those profiles back to the About page.
- Add the canonical Film Making or About URL to accurate film-credit, festival, guild, production-company, interview, and press profiles that RenderLogic or Achu controls.
- Cross-link `heylipi.com` and the RenderLogic software lab page with descriptive anchor text.

## 6. Content program

Publish only material with first-hand experience or clear subject expertise. A practical cadence is one substantial page or article every two to four weeks.

High-value future topics:

- individual film case studies with verified role, production context, and original stills or behind-the-scenes material
- a dedicated DaVinci Resolve color-grading service page with workflow, deliverables, and an approved reel
- AI filmmaking campaign case studies with client permission and measurable production outcomes
- Lipi platform-specific setup, troubleshooting, privacy, and comparison pages
- RenderMagic Director product documentation once the feature set and availability are public

Every new indexable page should have one clear search intent, unique title and description, useful original text, internal links, a self-referencing canonical, accurate structured data, and an entry in `sitemap.xml` with a truthful `lastmod`.

## 7. Monthly measurement

Track outcomes, not just impressions:

- non-branded clicks and queries by landing page
- indexed canonical pages versus submitted sitemap pages
- click-through rate for pages with stable rankings
- film, software, and Lipi inquiries by landing page
- branded searches for RenderLogic, Achu Vijayan, and Lipi
- referring domains from relevant film, technology, press, guild, and partner sites
- Core Web Vitals and mobile usability

SEO cannot guarantee first position or immediate indexing. Google's own starter guide emphasizes people-first content, crawlable links, descriptive URLs, unique titles, useful snippets, and ongoing iteration: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
