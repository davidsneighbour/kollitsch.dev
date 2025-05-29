// glob all pages (*.md, *.astro) and content entries (*.md, *.mdx)
const pageModules = import.meta.glob("../pages/**/*.{md,astro}", {
	eager: true,
}) as Record<string, { url: string }>;
const contentModules = import.meta.glob("../content/**/*.{md,mdx}", {
	eager: true,
}) as Record<string, { url: string }>;

// build a map of “slug” → URL
const permalinkMap = new Map<string, string>();

/**
 * Normalize a file path into a slug key, or return null if it doesn't match.
 * @param filePath – the raw import path e.g. '../pages/blog/my-post.md'
 * @param prefix – either 'pages' or 'content'
 * @returns slug string (no leading slash or extension) or null
 */
function slugFromPath(
	filePath: string,
	prefix: "pages" | "content",
): string | null {
	const re =
		prefix === "pages"
			? /\/pages\/(.+?)\.(?:md|astro)$/
			: /\/content\/(.+?)\.(?:md|mdx)$/;
	const m = filePath.match(re);
	if (!m || !m[1]) {
		return null;
	}

	let slug = m[1]; // now guaranteed to be a string
	// strip trailing /index
	if (prefix === "pages" && slug.endsWith("/index")) {
		slug = slug.replace(/\/index$/, "");
	}
	return slug;
}

// populate map
for (const [file, mod] of Object.entries(pageModules)) {
	const slug = slugFromPath(file, "pages");
	if (slug) {
		permalinkMap.set(slug, mod.url);
	}
}
for (const [file, mod] of Object.entries(contentModules)) {
	const slug = slugFromPath(file, "content");
	if (slug) {
		permalinkMap.set(slug, mod.url);
	}
}

/**
 * Get the permalink for any page or content entry.
 * @param id – markdown path without leading slash or extension (e.g. "blog/my-post" or "about")
 * @returns URL with trailing slash (e.g. "/blog/my-post/")
 *
 * Usage:
 * ---
 * import { getPermalink } from '../utils/getPermalink';
 * const homeUrl = getPermalink('index');
 * const projectUrl = getPermalink('projects/cool-widget');
 * ---
 * <a href={homeUrl}>Home</a>
 * <a href={getPermalink('blog/my-post')}>Sample Post</a>
 * <a class="btn" href={projectUrl}>View project</a>
 */
export function getPermalink(id: string): string {
	const key = id.replace(/^\/|\.mdx?$/g, "");
	const url = permalinkMap.get(key);
	if (!url) {
		console.warn(
			`[getPermalink] no entry for "${id}", falling back to "/${key}/"`,
		);
		return `/${key}/`;
	}
	return url;
}
