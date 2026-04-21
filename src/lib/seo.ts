interface SeoMetaInput {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
}

const upsertMetaTag = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertLinkTag = (selector: string, rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

export const setSeoMeta = ({ title, description, canonicalUrl, imageUrl }: SeoMetaInput) => {
  document.title = title;

  upsertMetaTag('meta[name="description"]', 'name', 'description', description);
  upsertMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
  upsertMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
  upsertMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  upsertMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', title);
  upsertMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', description);
  upsertMetaTag('meta[property="twitter:url"]', 'property', 'twitter:url', canonicalUrl);

  if (imageUrl) {
    upsertMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    upsertMetaTag('meta[property="twitter:image"]', 'property', 'twitter:image', imageUrl);
  }

  upsertLinkTag('link[rel="canonical"]', 'canonical', canonicalUrl);
};

export const setJsonLd = (id: string, data: Record<string, unknown>) => {
  let element = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.setAttribute('data-seo-id', id);
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
};

export const removeJsonLd = (id: string) => {
  const element = document.head.querySelector(`script[data-seo-id="${id}"]`);
  if (element) element.remove();
};
