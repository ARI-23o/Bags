import React from 'react';
import { Instagram, Heart } from 'lucide-react';
import { InstagramPost } from '../../types';
import { useSettings } from '../../context/SettingsContext';

interface InstagramGridProps {
  posts: InstagramPost[];
}

export const InstagramGrid: React.FC<InstagramGridProps> = ({ posts }) => {
  const { settings } = useSettings();

  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-2">
            SOSYAL MEDYA
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary">
            Instagram'da Bizi Takip Edin
          </h2>
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-taupe hover:text-brand-primary mt-2 transition-colors"
          >
            <Instagram className="w-4 h-4 text-brand-gold" />
            @nehircanta2016
          </a>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {posts.slice(0, 6).map((post) => (
            <a
              key={post._id}
              href={post.permalink || settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-brand-cream rounded-sm border border-brand-border/60 block"
            >
              <img
                src={post.mediaUrl}
                alt={post.caption || 'Instagram gönderisi'}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-brand-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-brand-white">
                <Instagram className="w-6 h-6 mb-2 text-brand-gold" />
                {post.likes !== undefined && post.likes > 0 && (
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
                    <span>{post.likes}</span>
                  </div>
                )}
                {post.caption && (
                  <p className="text-[10px] text-brand-cream/90 line-clamp-2 mt-1">
                    {post.caption}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="luxury-btn-outline inline-flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            Instagram'da Keşfet
          </a>
        </div>
      </div>
    </section>
  );
};
