import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_blocks_rich_text_max_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum_projects_blocks_rich_text_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_projects_blocks_full_width_image_aspect_ratio" AS ENUM('original', 'landscape', 'cinematic', 'portrait');
  CREATE TYPE "public"."enum_projects_blocks_full_width_image_contain_or_cover" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum_projects_blocks_two_column_images_ratio" AS ENUM('equal', 'left-large', 'right-large');
  CREATE TYPE "public"."enum_projects_blocks_two_column_images_mobile_order" AS ENUM('left-first', 'right-first');
  CREATE TYPE "public"."enum_projects_blocks_image_gallery_layout" AS ENUM('grid', 'masonry', 'filmstrip');
  CREATE TYPE "public"."enum_projects_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_projects_blocks_external_video_aspect_ratio" AS ENUM('16:9', '9:16', '1:1', 'cinematic');
  CREATE TYPE "public"."enum_projects_blocks_project_facts_source" AS ENUM('useProjectFacts', 'custom');
  CREATE TYPE "public"."enum_projects_blocks_statistics_source" AS ENUM('useProjectStatistics', 'custom');
  CREATE TYPE "public"."enum_projects_blocks_text_image_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_projects_blocks_text_image_vertical_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_projects_blocks_text_image_background_style" AS ENUM('default', 'surface', 'brand-accent');
  CREATE TYPE "public"."enum_projects_blocks_related_projects_mode" AS ENUM('automatic', 'manual');
  CREATE TYPE "public"."enum_projects_blocks_related_projects_automatic_strategy" AS ENUM('samePrimaryCategory', 'sharedCategories', 'featured');
  CREATE TYPE "public"."enum_projects_hero_media_type" AS ENUM('image', 'externalVideo');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_blocks_rich_text_max_width" AS ENUM('narrow', 'normal', 'wide');
  CREATE TYPE "public"."enum__projects_v_blocks_rich_text_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__projects_v_blocks_full_width_image_aspect_ratio" AS ENUM('original', 'landscape', 'cinematic', 'portrait');
  CREATE TYPE "public"."enum__projects_v_blocks_full_width_image_contain_or_cover" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum__projects_v_blocks_two_column_images_ratio" AS ENUM('equal', 'left-large', 'right-large');
  CREATE TYPE "public"."enum__projects_v_blocks_two_column_images_mobile_order" AS ENUM('left-first', 'right-first');
  CREATE TYPE "public"."enum__projects_v_blocks_image_gallery_layout" AS ENUM('grid', 'masonry', 'filmstrip');
  CREATE TYPE "public"."enum__projects_v_blocks_image_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__projects_v_blocks_external_video_aspect_ratio" AS ENUM('16:9', '9:16', '1:1', 'cinematic');
  CREATE TYPE "public"."enum__projects_v_blocks_project_facts_source" AS ENUM('useProjectFacts', 'custom');
  CREATE TYPE "public"."enum__projects_v_blocks_statistics_source" AS ENUM('useProjectStatistics', 'custom');
  CREATE TYPE "public"."enum__projects_v_blocks_text_image_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__projects_v_blocks_text_image_vertical_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__projects_v_blocks_text_image_background_style" AS ENUM('default', 'surface', 'brand-accent');
  CREATE TYPE "public"."enum__projects_v_blocks_related_projects_mode" AS ENUM('automatic', 'manual');
  CREATE TYPE "public"."enum__projects_v_blocks_related_projects_automatic_strategy" AS ENUM('samePrimaryCategory', 'sharedCategories', 'featured');
  CREATE TYPE "public"."enum__projects_v_version_hero_media_type" AS ENUM('image', 'externalVideo');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_project_categories_icon_key" AS ENUM('event', 'corporate', 'sports', 'social', 'artist', 'automotive', 'travel', 'beauty', 'behind-the-scenes');
  CREATE TYPE "public"."enum_project_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__project_categories_v_version_icon_key" AS ENUM('event', 'corporate', 'sports', 'social', 'artist', 'automotive', 'travel', 'beauty', 'behind-the-scenes');
  CREATE TYPE "public"."enum__project_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__project_categories_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_homepage_featured_projects_source_mode" AS ENUM('manualEmbedded', 'projectCollection');
  CREATE TYPE "public"."enum_homepage_project_categories_source_mode" AS ENUM('manualEmbedded', 'categoryCollection');
  CREATE TYPE "public"."enum__homepage_v_version_featured_projects_source_mode" AS ENUM('manualEmbedded', 'projectCollection');
  CREATE TYPE "public"."enum__homepage_v_version_project_categories_source_mode" AS ENUM('manualEmbedded', 'categoryCollection');
  CREATE TABLE "projects_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"internal_name" varchar
  );
  
  CREATE TABLE "projects_services_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"display_order" numeric DEFAULT 0,
  	"credit" varchar
  );
  
  CREATE TABLE "projects_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_project_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "projects_project_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "projects_statistics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"max_width" "enum_projects_blocks_rich_text_max_width" DEFAULT 'normal',
  	"text_align" "enum_projects_blocks_rich_text_text_align" DEFAULT 'left',
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_full_width_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"credit" varchar,
  	"aspect_ratio" "enum_projects_blocks_full_width_image_aspect_ratio" DEFAULT 'original',
  	"contain_or_cover" "enum_projects_blocks_full_width_image_contain_or_cover" DEFAULT 'cover',
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_full_width_image_locales" (
  	"alt_override" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_two_column_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_image_id" integer,
  	"right_image_id" integer,
  	"ratio" "enum_projects_blocks_two_column_images_ratio" DEFAULT 'equal',
  	"mobile_order" "enum_projects_blocks_two_column_images_mobile_order" DEFAULT 'left-first',
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_two_column_images_locales" (
  	"left_caption" varchar,
  	"right_caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "projects_blocks_image_gallery_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_projects_blocks_image_gallery_layout" DEFAULT 'grid',
  	"columns" "enum_projects_blocks_image_gallery_columns" DEFAULT '3',
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_image_gallery_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_external_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_u_r_l" varchar,
  	"poster_image_id" integer,
  	"autoplay" boolean DEFAULT false,
  	"muted" boolean DEFAULT true,
  	"loop" boolean DEFAULT false,
  	"controls" boolean DEFAULT true,
  	"aspect_ratio" "enum_projects_blocks_external_video_aspect_ratio" DEFAULT '16:9',
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_external_video_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author" varchar,
  	"portrait_id" integer,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_quote_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_project_facts_custom_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "projects_blocks_project_facts_custom_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_project_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_projects_blocks_project_facts_source" DEFAULT 'useProjectFacts',
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_statistics_custom_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "projects_blocks_statistics_custom_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_projects_blocks_statistics_source" DEFAULT 'useProjectStatistics',
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_text_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_projects_blocks_text_image_image_position" DEFAULT 'right',
  	"vertical_alignment" "enum_projects_blocks_text_image_vertical_alignment" DEFAULT 'center',
  	"background_style" "enum_projects_blocks_text_image_background_style" DEFAULT 'default',
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_text_image_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_related_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mode" "enum_projects_blocks_related_projects_mode" DEFAULT 'automatic',
  	"max_items" numeric DEFAULT 4,
  	"automatic_strategy" "enum_projects_blocks_related_projects_automatic_strategy" DEFAULT 'samePrimaryCategory',
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_related_projects_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"slug" varchar,
  	"client_name" varchar,
  	"artist_name" varchar,
  	"year" numeric,
  	"project_date" timestamp(3) with time zone,
  	"primary_category_id" integer,
  	"cover_image_id" integer,
  	"poster_image_id" integer,
  	"hero_media_type" "enum_projects_hero_media_type" DEFAULT 'image',
  	"hero_image_id" integer,
  	"external_video_u_r_l" varchar,
  	"video_poster_id" integer,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_canonical_u_r_l" varchar,
  	"featured" boolean DEFAULT false,
  	"featured_order" numeric,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"admin_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"short_description" varchar,
  	"introduction" jsonb,
  	"location" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"project_categories_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "_projects_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_services_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"display_order" numeric DEFAULT 0,
  	"credit" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_project_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_project_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_statistics_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"max_width" "enum__projects_v_blocks_rich_text_max_width" DEFAULT 'normal',
  	"text_align" "enum__projects_v_blocks_rich_text_text_align" DEFAULT 'left',
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_rich_text_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_full_width_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"credit" varchar,
  	"aspect_ratio" "enum__projects_v_blocks_full_width_image_aspect_ratio" DEFAULT 'original',
  	"contain_or_cover" "enum__projects_v_blocks_full_width_image_contain_or_cover" DEFAULT 'cover',
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_full_width_image_locales" (
  	"alt_override" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_two_column_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_image_id" integer,
  	"right_image_id" integer,
  	"ratio" "enum__projects_v_blocks_two_column_images_ratio" DEFAULT 'equal',
  	"mobile_order" "enum__projects_v_blocks_two_column_images_mobile_order" DEFAULT 'left-first',
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_two_column_images_locales" (
  	"left_caption" varchar,
  	"right_caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_image_gallery_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__projects_v_blocks_image_gallery_layout" DEFAULT 'grid',
  	"columns" "enum__projects_v_blocks_image_gallery_columns" DEFAULT '3',
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_image_gallery_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_external_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_u_r_l" varchar,
  	"poster_image_id" integer,
  	"autoplay" boolean DEFAULT false,
  	"muted" boolean DEFAULT true,
  	"loop" boolean DEFAULT false,
  	"controls" boolean DEFAULT true,
  	"aspect_ratio" "enum__projects_v_blocks_external_video_aspect_ratio" DEFAULT '16:9',
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_external_video_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar,
  	"portrait_id" integer,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_quote_locales" (
  	"quote" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_project_facts_custom_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_project_facts_custom_facts_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_project_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__projects_v_blocks_project_facts_source" DEFAULT 'useProjectFacts',
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_statistics_custom_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_statistics_custom_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__projects_v_blocks_statistics_source" DEFAULT 'useProjectStatistics',
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_text_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum__projects_v_blocks_text_image_image_position" DEFAULT 'right',
  	"vertical_alignment" "enum__projects_v_blocks_text_image_vertical_alignment" DEFAULT 'center',
  	"background_style" "enum__projects_v_blocks_text_image_background_style" DEFAULT 'default',
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_text_image_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_blocks_related_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mode" "enum__projects_v_blocks_related_projects_mode" DEFAULT 'automatic',
  	"max_items" numeric DEFAULT 4,
  	"automatic_strategy" "enum__projects_v_blocks_related_projects_automatic_strategy" DEFAULT 'samePrimaryCategory',
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_related_projects_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_name" varchar,
  	"version_slug" varchar,
  	"version_client_name" varchar,
  	"version_artist_name" varchar,
  	"version_year" numeric,
  	"version_project_date" timestamp(3) with time zone,
  	"version_primary_category_id" integer,
  	"version_cover_image_id" integer,
  	"version_poster_image_id" integer,
  	"version_hero_media_type" "enum__projects_v_version_hero_media_type" DEFAULT 'image',
  	"version_hero_image_id" integer,
  	"version_external_video_u_r_l" varchar,
  	"version_video_poster_id" integer,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_featured_order" numeric,
  	"version_enabled" boolean DEFAULT true,
  	"version_display_order" numeric DEFAULT 0,
  	"version_admin_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_short_description" varchar,
  	"version_introduction" jsonb,
  	"version_location" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_title" varchar,
  	"version_seo_og_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"project_categories_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "project_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"slug" varchar,
  	"icon_key" "enum_project_categories_icon_key",
  	"cover_image_id" integer,
  	"hero_image_id" integer,
  	"hero_video_u_r_l" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_canonical_u_r_l" varchar,
  	"enabled" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"display_order" numeric DEFAULT 0,
  	"admin_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_project_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "project_categories_locales" (
  	"title" varchar,
  	"short_description" varchar,
  	"full_description" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_project_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_internal_name" varchar,
  	"version_slug" varchar,
  	"version_icon_key" "enum__project_categories_v_version_icon_key",
  	"version_cover_image_id" integer,
  	"version_hero_image_id" integer,
  	"version_hero_video_u_r_l" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_enabled" boolean DEFAULT true,
  	"version_featured" boolean DEFAULT false,
  	"version_display_order" numeric DEFAULT 0,
  	"version_admin_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__project_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__project_categories_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_project_categories_v_locales" (
  	"version_title" varchar,
  	"version_short_description" varchar,
  	"version_full_description" jsonb,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_title" varchar,
  	"version_seo_og_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"project_categories_id" integer
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"project_categories_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "project_categories_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "featured_projects_source_mode" "enum_homepage_featured_projects_source_mode" DEFAULT 'manualEmbedded';
  ALTER TABLE "homepage" ADD COLUMN "featured_projects_collection_limit" numeric DEFAULT 8;
  ALTER TABLE "homepage" ADD COLUMN "featured_projects_collection_filter_featured" boolean DEFAULT true;
  ALTER TABLE "homepage" ADD COLUMN "project_categories_source_mode" "enum_homepage_project_categories_source_mode" DEFAULT 'manualEmbedded';
  ALTER TABLE "homepage" ADD COLUMN "project_categories_collection_limit" numeric DEFAULT 9;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_featured_projects_source_mode" "enum__homepage_v_version_featured_projects_source_mode" DEFAULT 'manualEmbedded';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_featured_projects_collection_limit" numeric DEFAULT 8;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_featured_projects_collection_filter_featured" boolean DEFAULT true;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_project_categories_source_mode" "enum__homepage_v_version_project_categories_source_mode" DEFAULT 'manualEmbedded';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_project_categories_collection_limit" numeric DEFAULT 9;
  ALTER TABLE "projects_services" ADD CONSTRAINT "projects_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_services_locales" ADD CONSTRAINT "projects_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery_locales" ADD CONSTRAINT "projects_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_project_facts" ADD CONSTRAINT "projects_project_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_project_facts_locales" ADD CONSTRAINT "projects_project_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_project_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_statistics" ADD CONSTRAINT "projects_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_statistics_locales" ADD CONSTRAINT "projects_statistics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_rich_text" ADD CONSTRAINT "projects_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_rich_text_locales" ADD CONSTRAINT "projects_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_full_width_image" ADD CONSTRAINT "projects_blocks_full_width_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_full_width_image" ADD CONSTRAINT "projects_blocks_full_width_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_full_width_image_locales" ADD CONSTRAINT "projects_blocks_full_width_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_full_width_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_two_column_images" ADD CONSTRAINT "projects_blocks_two_column_images_left_image_id_media_id_fk" FOREIGN KEY ("left_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_two_column_images" ADD CONSTRAINT "projects_blocks_two_column_images_right_image_id_media_id_fk" FOREIGN KEY ("right_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_two_column_images" ADD CONSTRAINT "projects_blocks_two_column_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_two_column_images_locales" ADD CONSTRAINT "projects_blocks_two_column_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_two_column_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_image_gallery_images" ADD CONSTRAINT "projects_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_image_gallery_images" ADD CONSTRAINT "projects_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_image_gallery_images_locales" ADD CONSTRAINT "projects_blocks_image_gallery_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_image_gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_image_gallery" ADD CONSTRAINT "projects_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_image_gallery_locales" ADD CONSTRAINT "projects_blocks_image_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_external_video" ADD CONSTRAINT "projects_blocks_external_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_external_video" ADD CONSTRAINT "projects_blocks_external_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_external_video_locales" ADD CONSTRAINT "projects_blocks_external_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_external_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_quote" ADD CONSTRAINT "projects_blocks_quote_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_quote" ADD CONSTRAINT "projects_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_quote_locales" ADD CONSTRAINT "projects_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_project_facts_custom_facts" ADD CONSTRAINT "projects_blocks_project_facts_custom_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_project_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_project_facts_custom_facts_locales" ADD CONSTRAINT "projects_blocks_project_facts_custom_facts_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_project_facts_custom_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_project_facts" ADD CONSTRAINT "projects_blocks_project_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_statistics_custom_items" ADD CONSTRAINT "projects_blocks_statistics_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_statistics_custom_items_locales" ADD CONSTRAINT "projects_blocks_statistics_custom_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_statistics_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_statistics" ADD CONSTRAINT "projects_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_text_image" ADD CONSTRAINT "projects_blocks_text_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_text_image" ADD CONSTRAINT "projects_blocks_text_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_text_image_locales" ADD CONSTRAINT "projects_blocks_text_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_text_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_related_projects" ADD CONSTRAINT "projects_blocks_related_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_related_projects_locales" ADD CONSTRAINT "projects_blocks_related_projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_related_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_primary_category_id_project_categories_id_fk" FOREIGN KEY ("primary_category_id") REFERENCES "public"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_project_categories_fk" FOREIGN KEY ("project_categories_id") REFERENCES "public"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_services" ADD CONSTRAINT "_projects_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_services_locales" ADD CONSTRAINT "_projects_v_version_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery_locales" ADD CONSTRAINT "_projects_v_version_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_project_facts" ADD CONSTRAINT "_projects_v_version_project_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_project_facts_locales" ADD CONSTRAINT "_projects_v_version_project_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_project_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_statistics" ADD CONSTRAINT "_projects_v_version_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_statistics_locales" ADD CONSTRAINT "_projects_v_version_statistics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_rich_text" ADD CONSTRAINT "_projects_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_rich_text_locales" ADD CONSTRAINT "_projects_v_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_full_width_image" ADD CONSTRAINT "_projects_v_blocks_full_width_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_full_width_image" ADD CONSTRAINT "_projects_v_blocks_full_width_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_full_width_image_locales" ADD CONSTRAINT "_projects_v_blocks_full_width_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_full_width_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_two_column_images" ADD CONSTRAINT "_projects_v_blocks_two_column_images_left_image_id_media_id_fk" FOREIGN KEY ("left_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_two_column_images" ADD CONSTRAINT "_projects_v_blocks_two_column_images_right_image_id_media_id_fk" FOREIGN KEY ("right_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_two_column_images" ADD CONSTRAINT "_projects_v_blocks_two_column_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_two_column_images_locales" ADD CONSTRAINT "_projects_v_blocks_two_column_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_two_column_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_image_gallery_images" ADD CONSTRAINT "_projects_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_image_gallery_images" ADD CONSTRAINT "_projects_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_image_gallery_images_locales" ADD CONSTRAINT "_projects_v_blocks_image_gallery_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_image_gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_image_gallery" ADD CONSTRAINT "_projects_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_image_gallery_locales" ADD CONSTRAINT "_projects_v_blocks_image_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_external_video" ADD CONSTRAINT "_projects_v_blocks_external_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_external_video" ADD CONSTRAINT "_projects_v_blocks_external_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_external_video_locales" ADD CONSTRAINT "_projects_v_blocks_external_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_external_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_quote" ADD CONSTRAINT "_projects_v_blocks_quote_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_quote" ADD CONSTRAINT "_projects_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_quote_locales" ADD CONSTRAINT "_projects_v_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_project_facts_custom_facts" ADD CONSTRAINT "_projects_v_blocks_project_facts_custom_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_project_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_project_facts_custom_facts_locales" ADD CONSTRAINT "_projects_v_blocks_project_facts_custom_facts_locales_par_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_project_facts_custom_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_project_facts" ADD CONSTRAINT "_projects_v_blocks_project_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_statistics_custom_items" ADD CONSTRAINT "_projects_v_blocks_statistics_custom_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_statistics_custom_items_locales" ADD CONSTRAINT "_projects_v_blocks_statistics_custom_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_statistics_custom_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_statistics" ADD CONSTRAINT "_projects_v_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_text_image" ADD CONSTRAINT "_projects_v_blocks_text_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_text_image" ADD CONSTRAINT "_projects_v_blocks_text_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_text_image_locales" ADD CONSTRAINT "_projects_v_blocks_text_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_text_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_related_projects" ADD CONSTRAINT "_projects_v_blocks_related_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_related_projects_locales" ADD CONSTRAINT "_projects_v_blocks_related_projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_related_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_primary_category_id_project_categories_id_fk" FOREIGN KEY ("version_primary_category_id") REFERENCES "public"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_poster_image_id_media_id_fk" FOREIGN KEY ("version_poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_video_poster_id_media_id_fk" FOREIGN KEY ("version_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_project_categories_fk" FOREIGN KEY ("project_categories_id") REFERENCES "public"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_categories_locales" ADD CONSTRAINT "project_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_project_categories_v" ADD CONSTRAINT "_project_categories_v_parent_id_project_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."project_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_project_categories_v" ADD CONSTRAINT "_project_categories_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_project_categories_v" ADD CONSTRAINT "_project_categories_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_project_categories_v" ADD CONSTRAINT "_project_categories_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_project_categories_v_locales" ADD CONSTRAINT "_project_categories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_project_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_project_categories_fk" FOREIGN KEY ("project_categories_id") REFERENCES "public"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_project_categories_fk" FOREIGN KEY ("project_categories_id") REFERENCES "public"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_services_order_idx" ON "projects_services" USING btree ("_order");
  CREATE INDEX "projects_services_parent_id_idx" ON "projects_services" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_services_locales_locale_parent_id_unique" ON "projects_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_gallery_locales_locale_parent_id_unique" ON "projects_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_project_facts_order_idx" ON "projects_project_facts" USING btree ("_order");
  CREATE INDEX "projects_project_facts_parent_id_idx" ON "projects_project_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_project_facts_locales_locale_parent_id_unique" ON "projects_project_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_statistics_order_idx" ON "projects_statistics" USING btree ("_order");
  CREATE INDEX "projects_statistics_parent_id_idx" ON "projects_statistics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_statistics_locales_locale_parent_id_unique" ON "projects_statistics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_rich_text_order_idx" ON "projects_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "projects_blocks_rich_text_parent_id_idx" ON "projects_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_rich_text_path_idx" ON "projects_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "projects_blocks_rich_text_locales_locale_parent_id_unique" ON "projects_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_full_width_image_order_idx" ON "projects_blocks_full_width_image" USING btree ("_order");
  CREATE INDEX "projects_blocks_full_width_image_parent_id_idx" ON "projects_blocks_full_width_image" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_full_width_image_path_idx" ON "projects_blocks_full_width_image" USING btree ("_path");
  CREATE INDEX "projects_blocks_full_width_image_image_idx" ON "projects_blocks_full_width_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_blocks_full_width_image_locales_locale_parent_id_un" ON "projects_blocks_full_width_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_two_column_images_order_idx" ON "projects_blocks_two_column_images" USING btree ("_order");
  CREATE INDEX "projects_blocks_two_column_images_parent_id_idx" ON "projects_blocks_two_column_images" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_two_column_images_path_idx" ON "projects_blocks_two_column_images" USING btree ("_path");
  CREATE INDEX "projects_blocks_two_column_images_left_image_idx" ON "projects_blocks_two_column_images" USING btree ("left_image_id");
  CREATE INDEX "projects_blocks_two_column_images_right_image_idx" ON "projects_blocks_two_column_images" USING btree ("right_image_id");
  CREATE UNIQUE INDEX "projects_blocks_two_column_images_locales_locale_parent_id_u" ON "projects_blocks_two_column_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_image_gallery_images_order_idx" ON "projects_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "projects_blocks_image_gallery_images_parent_id_idx" ON "projects_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_image_gallery_images_image_idx" ON "projects_blocks_image_gallery_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_blocks_image_gallery_images_locales_locale_parent_i" ON "projects_blocks_image_gallery_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_image_gallery_order_idx" ON "projects_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "projects_blocks_image_gallery_parent_id_idx" ON "projects_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_image_gallery_path_idx" ON "projects_blocks_image_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "projects_blocks_image_gallery_locales_locale_parent_id_uniqu" ON "projects_blocks_image_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_external_video_order_idx" ON "projects_blocks_external_video" USING btree ("_order");
  CREATE INDEX "projects_blocks_external_video_parent_id_idx" ON "projects_blocks_external_video" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_external_video_path_idx" ON "projects_blocks_external_video" USING btree ("_path");
  CREATE INDEX "projects_blocks_external_video_poster_image_idx" ON "projects_blocks_external_video" USING btree ("poster_image_id");
  CREATE UNIQUE INDEX "projects_blocks_external_video_locales_locale_parent_id_uniq" ON "projects_blocks_external_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_quote_order_idx" ON "projects_blocks_quote" USING btree ("_order");
  CREATE INDEX "projects_blocks_quote_parent_id_idx" ON "projects_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_quote_path_idx" ON "projects_blocks_quote" USING btree ("_path");
  CREATE INDEX "projects_blocks_quote_portrait_idx" ON "projects_blocks_quote" USING btree ("portrait_id");
  CREATE UNIQUE INDEX "projects_blocks_quote_locales_locale_parent_id_unique" ON "projects_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_project_facts_custom_facts_order_idx" ON "projects_blocks_project_facts_custom_facts" USING btree ("_order");
  CREATE INDEX "projects_blocks_project_facts_custom_facts_parent_id_idx" ON "projects_blocks_project_facts_custom_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_project_facts_custom_facts_locales_locale_pa" ON "projects_blocks_project_facts_custom_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_project_facts_order_idx" ON "projects_blocks_project_facts" USING btree ("_order");
  CREATE INDEX "projects_blocks_project_facts_parent_id_idx" ON "projects_blocks_project_facts" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_project_facts_path_idx" ON "projects_blocks_project_facts" USING btree ("_path");
  CREATE INDEX "projects_blocks_statistics_custom_items_order_idx" ON "projects_blocks_statistics_custom_items" USING btree ("_order");
  CREATE INDEX "projects_blocks_statistics_custom_items_parent_id_idx" ON "projects_blocks_statistics_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_statistics_custom_items_locales_locale_paren" ON "projects_blocks_statistics_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_statistics_order_idx" ON "projects_blocks_statistics" USING btree ("_order");
  CREATE INDEX "projects_blocks_statistics_parent_id_idx" ON "projects_blocks_statistics" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_statistics_path_idx" ON "projects_blocks_statistics" USING btree ("_path");
  CREATE INDEX "projects_blocks_text_image_order_idx" ON "projects_blocks_text_image" USING btree ("_order");
  CREATE INDEX "projects_blocks_text_image_parent_id_idx" ON "projects_blocks_text_image" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_text_image_path_idx" ON "projects_blocks_text_image" USING btree ("_path");
  CREATE INDEX "projects_blocks_text_image_image_idx" ON "projects_blocks_text_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_blocks_text_image_locales_locale_parent_id_unique" ON "projects_blocks_text_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_blocks_related_projects_order_idx" ON "projects_blocks_related_projects" USING btree ("_order");
  CREATE INDEX "projects_blocks_related_projects_parent_id_idx" ON "projects_blocks_related_projects" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_related_projects_path_idx" ON "projects_blocks_related_projects" USING btree ("_path");
  CREATE UNIQUE INDEX "projects_blocks_related_projects_locales_locale_parent_id_un" ON "projects_blocks_related_projects_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_primary_category_idx" ON "projects" USING btree ("primary_category_id");
  CREATE INDEX "projects_cover_image_idx" ON "projects" USING btree ("cover_image_id");
  CREATE INDEX "projects_poster_image_idx" ON "projects" USING btree ("poster_image_id");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_video_poster_idx" ON "projects" USING btree ("video_poster_id");
  CREATE INDEX "projects_seo_seo_og_image_idx" ON "projects" USING btree ("seo_og_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_project_categories_id_idx" ON "projects_rels" USING btree ("project_categories_id");
  CREATE INDEX "projects_rels_projects_id_idx" ON "projects_rels" USING btree ("projects_id");
  CREATE INDEX "_projects_v_version_services_order_idx" ON "_projects_v_version_services" USING btree ("_order");
  CREATE INDEX "_projects_v_version_services_parent_id_idx" ON "_projects_v_version_services" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_services_locales_locale_parent_id_unique" ON "_projects_v_version_services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_image_idx" ON "_projects_v_version_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "_projects_v_version_gallery_locales_locale_parent_id_unique" ON "_projects_v_version_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_project_facts_order_idx" ON "_projects_v_version_project_facts" USING btree ("_order");
  CREATE INDEX "_projects_v_version_project_facts_parent_id_idx" ON "_projects_v_version_project_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_project_facts_locales_locale_parent_id_u" ON "_projects_v_version_project_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_version_statistics_order_idx" ON "_projects_v_version_statistics" USING btree ("_order");
  CREATE INDEX "_projects_v_version_statistics_parent_id_idx" ON "_projects_v_version_statistics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_statistics_locales_locale_parent_id_uniq" ON "_projects_v_version_statistics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_rich_text_order_idx" ON "_projects_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_rich_text_parent_id_idx" ON "_projects_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_rich_text_path_idx" ON "_projects_v_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "_projects_v_blocks_rich_text_locales_locale_parent_id_unique" ON "_projects_v_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_full_width_image_order_idx" ON "_projects_v_blocks_full_width_image" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_full_width_image_parent_id_idx" ON "_projects_v_blocks_full_width_image" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_full_width_image_path_idx" ON "_projects_v_blocks_full_width_image" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_full_width_image_image_idx" ON "_projects_v_blocks_full_width_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_full_width_image_locales_locale_parent_id" ON "_projects_v_blocks_full_width_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_two_column_images_order_idx" ON "_projects_v_blocks_two_column_images" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_two_column_images_parent_id_idx" ON "_projects_v_blocks_two_column_images" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_two_column_images_path_idx" ON "_projects_v_blocks_two_column_images" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_two_column_images_left_image_idx" ON "_projects_v_blocks_two_column_images" USING btree ("left_image_id");
  CREATE INDEX "_projects_v_blocks_two_column_images_right_image_idx" ON "_projects_v_blocks_two_column_images" USING btree ("right_image_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_two_column_images_locales_locale_parent_i" ON "_projects_v_blocks_two_column_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_image_gallery_images_order_idx" ON "_projects_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_image_gallery_images_parent_id_idx" ON "_projects_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_image_gallery_images_image_idx" ON "_projects_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_image_gallery_images_locales_locale_paren" ON "_projects_v_blocks_image_gallery_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_image_gallery_order_idx" ON "_projects_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_image_gallery_parent_id_idx" ON "_projects_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_image_gallery_path_idx" ON "_projects_v_blocks_image_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "_projects_v_blocks_image_gallery_locales_locale_parent_id_un" ON "_projects_v_blocks_image_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_external_video_order_idx" ON "_projects_v_blocks_external_video" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_external_video_parent_id_idx" ON "_projects_v_blocks_external_video" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_external_video_path_idx" ON "_projects_v_blocks_external_video" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_external_video_poster_image_idx" ON "_projects_v_blocks_external_video" USING btree ("poster_image_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_external_video_locales_locale_parent_id_u" ON "_projects_v_blocks_external_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_quote_order_idx" ON "_projects_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_quote_parent_id_idx" ON "_projects_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_quote_path_idx" ON "_projects_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_quote_portrait_idx" ON "_projects_v_blocks_quote" USING btree ("portrait_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_quote_locales_locale_parent_id_unique" ON "_projects_v_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_project_facts_custom_facts_order_idx" ON "_projects_v_blocks_project_facts_custom_facts" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_project_facts_custom_facts_parent_id_idx" ON "_projects_v_blocks_project_facts_custom_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_project_facts_custom_facts_locales_locale" ON "_projects_v_blocks_project_facts_custom_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_project_facts_order_idx" ON "_projects_v_blocks_project_facts" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_project_facts_parent_id_idx" ON "_projects_v_blocks_project_facts" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_project_facts_path_idx" ON "_projects_v_blocks_project_facts" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_statistics_custom_items_order_idx" ON "_projects_v_blocks_statistics_custom_items" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_statistics_custom_items_parent_id_idx" ON "_projects_v_blocks_statistics_custom_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_statistics_custom_items_locales_locale_pa" ON "_projects_v_blocks_statistics_custom_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_statistics_order_idx" ON "_projects_v_blocks_statistics" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_statistics_parent_id_idx" ON "_projects_v_blocks_statistics" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_statistics_path_idx" ON "_projects_v_blocks_statistics" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_text_image_order_idx" ON "_projects_v_blocks_text_image" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_text_image_parent_id_idx" ON "_projects_v_blocks_text_image" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_text_image_path_idx" ON "_projects_v_blocks_text_image" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_text_image_image_idx" ON "_projects_v_blocks_text_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "_projects_v_blocks_text_image_locales_locale_parent_id_uniqu" ON "_projects_v_blocks_text_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_blocks_related_projects_order_idx" ON "_projects_v_blocks_related_projects" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_related_projects_parent_id_idx" ON "_projects_v_blocks_related_projects" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_related_projects_path_idx" ON "_projects_v_blocks_related_projects" USING btree ("_path");
  CREATE UNIQUE INDEX "_projects_v_blocks_related_projects_locales_locale_parent_id" ON "_projects_v_blocks_related_projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_primary_category_idx" ON "_projects_v" USING btree ("version_primary_category_id");
  CREATE INDEX "_projects_v_version_version_cover_image_idx" ON "_projects_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_projects_v_version_version_poster_image_idx" ON "_projects_v" USING btree ("version_poster_image_id");
  CREATE INDEX "_projects_v_version_version_hero_image_idx" ON "_projects_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_projects_v_version_version_video_poster_idx" ON "_projects_v" USING btree ("version_video_poster_id");
  CREATE INDEX "_projects_v_version_seo_version_seo_og_image_idx" ON "_projects_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_project_categories_id_idx" ON "_projects_v_rels" USING btree ("project_categories_id");
  CREATE INDEX "_projects_v_rels_projects_id_idx" ON "_projects_v_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "project_categories_slug_idx" ON "project_categories" USING btree ("slug");
  CREATE INDEX "project_categories_cover_image_idx" ON "project_categories" USING btree ("cover_image_id");
  CREATE INDEX "project_categories_hero_image_idx" ON "project_categories" USING btree ("hero_image_id");
  CREATE INDEX "project_categories_seo_seo_og_image_idx" ON "project_categories" USING btree ("seo_og_image_id");
  CREATE INDEX "project_categories_updated_at_idx" ON "project_categories" USING btree ("updated_at");
  CREATE INDEX "project_categories_created_at_idx" ON "project_categories" USING btree ("created_at");
  CREATE INDEX "project_categories__status_idx" ON "project_categories" USING btree ("_status");
  CREATE UNIQUE INDEX "project_categories_locales_locale_parent_id_unique" ON "project_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_project_categories_v_parent_idx" ON "_project_categories_v" USING btree ("parent_id");
  CREATE INDEX "_project_categories_v_version_version_slug_idx" ON "_project_categories_v" USING btree ("version_slug");
  CREATE INDEX "_project_categories_v_version_version_cover_image_idx" ON "_project_categories_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_project_categories_v_version_version_hero_image_idx" ON "_project_categories_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_project_categories_v_version_seo_version_seo_og_image_idx" ON "_project_categories_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_project_categories_v_version_version_updated_at_idx" ON "_project_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_project_categories_v_version_version_created_at_idx" ON "_project_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_project_categories_v_version_version__status_idx" ON "_project_categories_v" USING btree ("version__status");
  CREATE INDEX "_project_categories_v_created_at_idx" ON "_project_categories_v" USING btree ("created_at");
  CREATE INDEX "_project_categories_v_updated_at_idx" ON "_project_categories_v" USING btree ("updated_at");
  CREATE INDEX "_project_categories_v_snapshot_idx" ON "_project_categories_v" USING btree ("snapshot");
  CREATE INDEX "_project_categories_v_published_locale_idx" ON "_project_categories_v" USING btree ("published_locale");
  CREATE INDEX "_project_categories_v_latest_idx" ON "_project_categories_v" USING btree ("latest");
  CREATE INDEX "_project_categories_v_autosave_idx" ON "_project_categories_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_project_categories_v_locales_locale_parent_id_unique" ON "_project_categories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_projects_id_idx" ON "homepage_rels" USING btree ("projects_id");
  CREATE INDEX "homepage_rels_project_categories_id_idx" ON "homepage_rels" USING btree ("project_categories_id");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_projects_id_idx" ON "_homepage_v_rels" USING btree ("projects_id");
  CREATE INDEX "_homepage_v_rels_project_categories_id_idx" ON "_homepage_v_rels" USING btree ("project_categories_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_categories_fk" FOREIGN KEY ("project_categories_id") REFERENCES "public"."project_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_project_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("project_categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_project_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_project_facts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_statistics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_rich_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_full_width_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_full_width_image_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_two_column_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_two_column_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_image_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_image_gallery_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_image_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_image_gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_external_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_external_video_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_quote_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_project_facts_custom_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_project_facts_custom_facts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_project_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_statistics_custom_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_statistics_custom_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_text_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_text_image_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_related_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_related_projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_project_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_project_facts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_statistics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_rich_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_full_width_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_full_width_image_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_two_column_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_two_column_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_image_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_image_gallery_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_image_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_image_gallery_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_external_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_external_video_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_quote_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_project_facts_custom_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_project_facts_custom_facts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_project_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_statistics_custom_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_statistics_custom_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_statistics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_text_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_text_image_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_related_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_related_projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_project_categories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_project_categories_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_services" CASCADE;
  DROP TABLE "projects_services_locales" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects_gallery_locales" CASCADE;
  DROP TABLE "projects_project_facts" CASCADE;
  DROP TABLE "projects_project_facts_locales" CASCADE;
  DROP TABLE "projects_statistics" CASCADE;
  DROP TABLE "projects_statistics_locales" CASCADE;
  DROP TABLE "projects_blocks_rich_text" CASCADE;
  DROP TABLE "projects_blocks_rich_text_locales" CASCADE;
  DROP TABLE "projects_blocks_full_width_image" CASCADE;
  DROP TABLE "projects_blocks_full_width_image_locales" CASCADE;
  DROP TABLE "projects_blocks_two_column_images" CASCADE;
  DROP TABLE "projects_blocks_two_column_images_locales" CASCADE;
  DROP TABLE "projects_blocks_image_gallery_images" CASCADE;
  DROP TABLE "projects_blocks_image_gallery_images_locales" CASCADE;
  DROP TABLE "projects_blocks_image_gallery" CASCADE;
  DROP TABLE "projects_blocks_image_gallery_locales" CASCADE;
  DROP TABLE "projects_blocks_external_video" CASCADE;
  DROP TABLE "projects_blocks_external_video_locales" CASCADE;
  DROP TABLE "projects_blocks_quote" CASCADE;
  DROP TABLE "projects_blocks_quote_locales" CASCADE;
  DROP TABLE "projects_blocks_project_facts_custom_facts" CASCADE;
  DROP TABLE "projects_blocks_project_facts_custom_facts_locales" CASCADE;
  DROP TABLE "projects_blocks_project_facts" CASCADE;
  DROP TABLE "projects_blocks_statistics_custom_items" CASCADE;
  DROP TABLE "projects_blocks_statistics_custom_items_locales" CASCADE;
  DROP TABLE "projects_blocks_statistics" CASCADE;
  DROP TABLE "projects_blocks_text_image" CASCADE;
  DROP TABLE "projects_blocks_text_image_locales" CASCADE;
  DROP TABLE "projects_blocks_related_projects" CASCADE;
  DROP TABLE "projects_blocks_related_projects_locales" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_services" CASCADE;
  DROP TABLE "_projects_v_version_services_locales" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v_version_gallery_locales" CASCADE;
  DROP TABLE "_projects_v_version_project_facts" CASCADE;
  DROP TABLE "_projects_v_version_project_facts_locales" CASCADE;
  DROP TABLE "_projects_v_version_statistics" CASCADE;
  DROP TABLE "_projects_v_version_statistics_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_rich_text" CASCADE;
  DROP TABLE "_projects_v_blocks_rich_text_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_full_width_image" CASCADE;
  DROP TABLE "_projects_v_blocks_full_width_image_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_two_column_images" CASCADE;
  DROP TABLE "_projects_v_blocks_two_column_images_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE "_projects_v_blocks_image_gallery_images_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_projects_v_blocks_image_gallery_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_external_video" CASCADE;
  DROP TABLE "_projects_v_blocks_external_video_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_quote" CASCADE;
  DROP TABLE "_projects_v_blocks_quote_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_project_facts_custom_facts" CASCADE;
  DROP TABLE "_projects_v_blocks_project_facts_custom_facts_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_project_facts" CASCADE;
  DROP TABLE "_projects_v_blocks_statistics_custom_items" CASCADE;
  DROP TABLE "_projects_v_blocks_statistics_custom_items_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_statistics" CASCADE;
  DROP TABLE "_projects_v_blocks_text_image" CASCADE;
  DROP TABLE "_projects_v_blocks_text_image_locales" CASCADE;
  DROP TABLE "_projects_v_blocks_related_projects" CASCADE;
  DROP TABLE "_projects_v_blocks_related_projects_locales" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "project_categories" CASCADE;
  DROP TABLE "project_categories_locales" CASCADE;
  DROP TABLE "_project_categories_v" CASCADE;
  DROP TABLE "_project_categories_v_locales" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_project_categories_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_project_categories_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "project_categories_id";
  ALTER TABLE "homepage" DROP COLUMN "featured_projects_source_mode";
  ALTER TABLE "homepage" DROP COLUMN "featured_projects_collection_limit";
  ALTER TABLE "homepage" DROP COLUMN "featured_projects_collection_filter_featured";
  ALTER TABLE "homepage" DROP COLUMN "project_categories_source_mode";
  ALTER TABLE "homepage" DROP COLUMN "project_categories_collection_limit";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_featured_projects_source_mode";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_featured_projects_collection_limit";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_featured_projects_collection_filter_featured";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_project_categories_source_mode";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_project_categories_collection_limit";
  DROP TYPE "public"."enum_projects_blocks_rich_text_max_width";
  DROP TYPE "public"."enum_projects_blocks_rich_text_text_align";
  DROP TYPE "public"."enum_projects_blocks_full_width_image_aspect_ratio";
  DROP TYPE "public"."enum_projects_blocks_full_width_image_contain_or_cover";
  DROP TYPE "public"."enum_projects_blocks_two_column_images_ratio";
  DROP TYPE "public"."enum_projects_blocks_two_column_images_mobile_order";
  DROP TYPE "public"."enum_projects_blocks_image_gallery_layout";
  DROP TYPE "public"."enum_projects_blocks_image_gallery_columns";
  DROP TYPE "public"."enum_projects_blocks_external_video_aspect_ratio";
  DROP TYPE "public"."enum_projects_blocks_project_facts_source";
  DROP TYPE "public"."enum_projects_blocks_statistics_source";
  DROP TYPE "public"."enum_projects_blocks_text_image_image_position";
  DROP TYPE "public"."enum_projects_blocks_text_image_vertical_alignment";
  DROP TYPE "public"."enum_projects_blocks_text_image_background_style";
  DROP TYPE "public"."enum_projects_blocks_related_projects_mode";
  DROP TYPE "public"."enum_projects_blocks_related_projects_automatic_strategy";
  DROP TYPE "public"."enum_projects_hero_media_type";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_blocks_rich_text_max_width";
  DROP TYPE "public"."enum__projects_v_blocks_rich_text_text_align";
  DROP TYPE "public"."enum__projects_v_blocks_full_width_image_aspect_ratio";
  DROP TYPE "public"."enum__projects_v_blocks_full_width_image_contain_or_cover";
  DROP TYPE "public"."enum__projects_v_blocks_two_column_images_ratio";
  DROP TYPE "public"."enum__projects_v_blocks_two_column_images_mobile_order";
  DROP TYPE "public"."enum__projects_v_blocks_image_gallery_layout";
  DROP TYPE "public"."enum__projects_v_blocks_image_gallery_columns";
  DROP TYPE "public"."enum__projects_v_blocks_external_video_aspect_ratio";
  DROP TYPE "public"."enum__projects_v_blocks_project_facts_source";
  DROP TYPE "public"."enum__projects_v_blocks_statistics_source";
  DROP TYPE "public"."enum__projects_v_blocks_text_image_image_position";
  DROP TYPE "public"."enum__projects_v_blocks_text_image_vertical_alignment";
  DROP TYPE "public"."enum__projects_v_blocks_text_image_background_style";
  DROP TYPE "public"."enum__projects_v_blocks_related_projects_mode";
  DROP TYPE "public"."enum__projects_v_blocks_related_projects_automatic_strategy";
  DROP TYPE "public"."enum__projects_v_version_hero_media_type";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_project_categories_icon_key";
  DROP TYPE "public"."enum_project_categories_status";
  DROP TYPE "public"."enum__project_categories_v_version_icon_key";
  DROP TYPE "public"."enum__project_categories_v_version_status";
  DROP TYPE "public"."enum__project_categories_v_published_locale";
  DROP TYPE "public"."enum_homepage_featured_projects_source_mode";
  DROP TYPE "public"."enum_homepage_project_categories_source_mode";
  DROP TYPE "public"."enum__homepage_v_version_featured_projects_source_mode";
  DROP TYPE "public"."enum__homepage_v_version_project_categories_source_mode";`)
}
