import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  schema?: Record<string, any>;
}

export const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  schema
}) => {
  const { settings } = useSettings();

  const defaultTitle = 'NEHİR ÇANTA | Kadın Çanta & Aksesuar Koleksiyonu';
  const defaultDesc = 'Nehir Çanta - Yeni sezon kadın omuz çantası, çapraz çanta, el çantası ve trend modelleri keşfedin. Kaliteli ve şık tasarımlar.';
  
  const siteTitle = title ? `${title} | ${settings.brandName || 'Nehir Çanta'}` : defaultTitle;
  const metaDescription = description || defaultDesc;
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Default Organization & LocalBusiness JSON-LD Schema
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'FashionStore',
    'name': settings.brandName || 'Nehir Çanta',
    'description': metaDescription,
    'url': currentUrl,
    'telephone': settings.phone,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': settings.address,
      'addressCountry': 'TR'
    },
    'priceRange': '₺₺',
    'sameAs': [
      settings.instagramUrl
    ].filter(Boolean)
  };

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Canonical */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={settings.brandName || 'Nehir Çanta'} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};
