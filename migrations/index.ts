import * as migration_20260719_075226_phase_1_foundation from './20260719_075226_phase_1_foundation';
import * as migration_20260719_081840_phase_2_media from './20260719_081840_phase_2_media';
import * as migration_20260719_110501_phase_3_homepage_cms from './20260719_110501_phase_3_homepage_cms';
import * as migration_20260722_085138_phase_5_projects_cms from './20260722_085138_phase_5_projects_cms';
import * as migration_20260729_060138_phase_7_project_hover_video from './20260729_060138_phase_7_project_hover_video';

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
    name: '20260719_110501_phase_3_homepage_cms',
  },
  {
    up: migration_20260722_085138_phase_5_projects_cms.up,
    down: migration_20260722_085138_phase_5_projects_cms.down,
    name: '20260722_085138_phase_5_projects_cms',
  },
  {
    up: migration_20260729_060138_phase_7_project_hover_video.up,
    down: migration_20260729_060138_phase_7_project_hover_video.down,
    name: '20260729_060138_phase_7_project_hover_video'
  },
];
