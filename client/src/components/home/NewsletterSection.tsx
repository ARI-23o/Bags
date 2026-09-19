import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (!consent) {
      setError('Lütfen aydınlatma metnini onaylayınız.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-20 bg-brand-cream/60 border-t border-brand-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-primary text-brand-white flex items-center justify-center mx-auto mb-4">
          <Mail className="w-5 h-5" />
        </div>

        <span className="text-xs uppercase tracking-luxury text-brand-gold font-semibold block mb-2">
          E-BÜLTEN
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary mb-3">
          Yeni Modellerden İlk Siz Haberdar Olun
        </h2>

        <p className="text-sm text-brand-charcoal max-w-md mx-auto mb-8">
          Yeni sezon koleksiyonlarımız, sınırlı sayıda üretilen özel çantalar ve indirim fırsatları için bültenimize abone olun.
        </p>

        {submitted ? (
          <div className="bg-brand-white border border-emerald-300 p-6 rounded-sm max-w-md mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-serif text-xl font-bold text-brand-primary mb-1">
              Aramıza Hoş Geldiniz!
            </h4>
            <p className="text-xs text-brand-taupe">
              E-posta adresiniz başarıyla kaydedildi. Yeni modellerimizden öncelikli olarak haberdar olacaksınız.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi giriniz"
                className="flex-1 bg-brand-white border border-brand-border px-4 py-3 text-sm focus:outline-none focus:border-brand-primary rounded-sm"
              />
              <button
                type="submit"
                className="luxury-btn-primary"
              >
                KAYDOL
              </button>
            </div>

            {/* Consent checkbox */}
            <div className="flex items-start gap-2 text-left pt-1">
              <input
                type="checkbox"
                id="newsletter-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 accent-brand-primary w-4 h-4 cursor-pointer"
              />
              <label htmlFor="newsletter-consent" className="text-[11px] text-brand-taupe leading-tight cursor-pointer">
                Nehir Çanta tarafından sunulan ticari elektronik iletileri almayı ve{' '}
                <Link to="/kvkk-aydinlatma-metni" className="underline text-brand-charcoal hover:text-brand-primary">
                  KVKK Aydınlatma Metnini
                </Link>{' '}
                kabul ediyorum.
              </label>
            </div>

            {error && (
              <p className="text-xs text-red-600 text-left font-medium">{error}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};
