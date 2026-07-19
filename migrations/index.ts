import * as migration_20260719_075226_phase_1_foundation from './20260719_075226_phase_1_foundation';
import * as migration_20260719_081840_phase_2_media from './20260719_081840_phase_2_media';
import * as migration_20260719_110501_phase_3_homepage_cms from './20260719_110501_phase_3_homepage_cms';

export const migrations = [
  {
    up: migration_20260719_075226_phase_1_foundation.up,
    down: migration_20260719_075226_phase_1_foundation.down,
    name: '20260719_075226_phase_1_foundation',
  },
  {
    up: migration_20260719_081840_phase_2_media.up,
    down: migration_20260719_081840_phase_2_media.down,
    name: '20260719_081840_phase_2_media',
  },
  {
    up: migration_20260719_110501_phase_3_homepage_cms.up,
    down: migration_20260719_110501_phase_3_homepage_cms.down,
    name: '20260719_110501_phase_3_homepage_cms'
  },
];
