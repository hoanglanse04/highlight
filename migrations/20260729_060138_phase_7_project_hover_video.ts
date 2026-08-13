import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "hover_preview_video_u_r_l" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_hover_preview_video_u_r_l" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP COLUMN "hover_preview_video_u_r_l";
  ALTER TABLE "_projects_v" DROP COLUMN "version_hover_preview_video_u_r_l";`)
}
