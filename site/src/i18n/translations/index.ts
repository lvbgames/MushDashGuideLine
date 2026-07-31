import { en, type Translation } from './en';
import { ja } from './ja';
import { ko } from './ko';
import { zhCn } from './zh-cn';
import type { Locale } from '../config';

const translations: Partial<Record<Locale, Translation>> = {
  en,
  ko,
  ja,
  'zh-cn': zhCn
};

export function getTranslation(locale: Locale): Translation {
  return translations[locale] ?? en;
}
