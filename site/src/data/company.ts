export const company = {
  name: 'Lv.B',
  address: '부산광역시 수영강변대로 140, 9층 905호',
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m5!3m3!1m2!1s0x356892c374d9a975%3A0xb04d175ded914cf!2z67aA7IKw6rSR7Jet7IucIO2VtOyatOuMgOq1rCDsiJjsmIHqsJXrs4DrjIDroZwgMTQwIDnsuLUgOTA17Zi4!5e0!3m2!1sko!2skr!4v1785473830568!5m2!1sko!2skr'
} as const;

export function getGoogleMapsSearchUrl() {
  const url = new URL('https://www.google.com/maps/search/');
  url.searchParams.set('api', '1');
  url.searchParams.set('query', company.address);
  return url.href;
}
