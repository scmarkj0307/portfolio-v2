export type SkeletonCardVariant = 'image' | 'image-only' | 'badges';

export interface SkeletonCardConfig {
  full?: boolean;
  variant?: SkeletonCardVariant;
  showTitle?: boolean;
  imageHeight?: number;
  badgeCount?: number;
  cssClass?: string;
  lineWidths?: string[];
}

function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });
}

function preloadImage(source: string): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    const image = new Image();
    image.onload = finish;
    image.onerror = finish;
    image.src = source;

    if (image.complete) {
      finish();
    }
  });
}

export async function preloadCardAssets(
  imageSources: string[],
  minimumDelayMs = 180
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  const uniqueSources = [...new Set(imageSources.filter(Boolean))];

  await Promise.all([
    uniqueSources.length
      ? Promise.all(uniqueSources.map((source) => preloadImage(source)))
      : Promise.resolve(),
    wait(minimumDelayMs)
  ]);
}
