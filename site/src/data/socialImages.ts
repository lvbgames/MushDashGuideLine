import type { Locale } from '../i18n/config';

export type SocialImageId = 'lvb' | 'mushhero' | 'mushdash';

export interface SocialImage {
  path: string;
  width: 1200;
  height: 630;
  type: 'image/png' | 'image/jpeg';
  alt: Readonly<Record<Locale, string>>;
}

export const socialImages: Readonly<Record<SocialImageId, SocialImage>> = {
  lvb: {
    path: '/og/lvb-og-primary.png',
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: {
      en: 'Lv.B indie game studio',
      ko: 'Lv.B 인디 게임 스튜디오',
      ja: 'インディーゲームスタジオ Lv.B',
      'zh-cn': 'Lv.B 独立游戏工作室'
    }
  },
  mushhero: {
    path: '/og/mushhero-og-primary.jpg',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: {
      en: 'Official MushHero image',
      ko: 'MushHero 공식 이미지',
      ja: 'MushHero 公式画像',
      'zh-cn': 'MushHero 官方图片'
    }
  },
  mushdash: {
    path: '/og/mushdash-og-primary.jpg',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: {
      en: 'Official MushDash image',
      ko: 'MushDash 공식 이미지',
      ja: 'MushDash 公式画像',
      'zh-cn': 'MushDash 官方图片'
    }
  }
};

export const getSocialImage = (id: SocialImageId, locale: Locale) => ({
  ...socialImages[id],
  alt: socialImages[id].alt[locale]
});
