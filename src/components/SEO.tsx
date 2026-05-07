import React from 'react';
import { Helmet } from 'react-helmet-async';
import { usePortfolio } from '../context/PortfolioContext';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const SEO: React.FC<SEOProps> = ({ title, description, image, url, type = 'website' }) => {
  const { content } = usePortfolio();
  
  const seoConfig = content.seoConfig || {};
  
  const siteTitle = title ? `${title} | ${seoConfig.siteTitle || content.userName}` : (seoConfig.siteTitle || `${content.userName} | Portfolio`);
  const siteDescription = description || seoConfig.siteDescription || content.githubConfig?.description || `Portfolio of ${content.userName}, a multidisciplinary professional.`;
  const siteImage = image || seoConfig.ogImage || '/profile.png';
  const siteUrl = url || seoConfig.canonicalUrl || window.location.href;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={siteDescription} />
      {seoConfig.keywords && <meta name="keywords" content={seoConfig.keywords} />}
      {seoConfig.canonicalUrl && <link rel="canonical" href={seoConfig.canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={siteImage} />
      {seoConfig.twitterHandle && <meta property="twitter:creator" content={seoConfig.twitterHandle} />}
    </Helmet>
  );
};

export default SEO;
