/** Cinematic scene asset paths under /public/zorpians/scenes/ */

export const SCENE_ASSETS = {
  ufoTransport: "/zorpians/scenes/ufo-transport.png",
  abductionBeam: "/zorpians/scenes/abduction-beam.png",
  scannerDevice: "/zorpians/scenes/scanner-device.png",
  corporateTerminal: "/zorpians/scenes/corporate-terminal.png",
  abductionRecordFrame: "/zorpians/scenes/abduction-record-frame.png",
  planetZorp: "/zorpians/scenes/planet-zorp.png",
  shipViewport: "/zorpians/scenes/ship-viewport.png",
} as const;

export type SceneAssetKey = keyof typeof SCENE_ASSETS;

/** Earliest scenes — preload at app start */
export const EARLY_SCENE_ASSETS: SceneAssetKey[] = [
  "ufoTransport",
  "abductionBeam",
];

/** Preload before human scan */
export const SCAN_SCENE_ASSETS: SceneAssetKey[] = ["scannerDevice"];

/** Preload before company assignment */
export const COMPANY_SCENE_ASSETS: SceneAssetKey[] = ["corporateTerminal"];

/** Preload before abduction record */
export const RECORD_SCENE_ASSETS: SceneAssetKey[] = ["abductionRecordFrame"];

/** Preload before arrival */
export const ARRIVAL_SCENE_ASSETS: SceneAssetKey[] = [
  "planetZorp",
  "shipViewport",
];

export const ALL_SCENE_ASSETS: SceneAssetKey[] = [
  ...EARLY_SCENE_ASSETS,
  ...SCAN_SCENE_ASSETS,
  ...COMPANY_SCENE_ASSETS,
  ...RECORD_SCENE_ASSETS,
  ...ARRIVAL_SCENE_ASSETS,
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadSceneAssets(keys: SceneAssetKey[]): Promise<void[]> {
  return Promise.all(keys.map((key) => preloadImage(SCENE_ASSETS[key])));
}

export function preloadAllSceneAssets(): Promise<void[]> {
  return preloadSceneAssets(ALL_SCENE_ASSETS);
}
