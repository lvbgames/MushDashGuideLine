const homeResponsiveImages = {
  '/press/assets/mushhero/mushhero-01.jpg': '/home/assets/mushhero-01',
  '/press/assets/mushhero/mushhero-02.jpg': '/home/assets/mushhero-02',
  '/press/assets/mushhero/mushhero-03.jpg': '/home/assets/mushhero-03',
  '/press/assets/mushdash/mushdash-01.jpg': '/home/assets/mushdash-01',
  '/press/assets/mushdash/mushdash-02.jpg': '/home/assets/mushdash-02'
} as const;

export const getHomeImageSrcSet = (source: string): string | undefined => {
  const basePath = homeResponsiveImages[source as keyof typeof homeResponsiveImages];
  return basePath
    ? `${basePath}-640.webp 640w, ${basePath}-1280.webp 1280w`
    : undefined;
};
