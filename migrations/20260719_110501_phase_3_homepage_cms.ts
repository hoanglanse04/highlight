import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_homepage_services_items_icon_key" AS ENUM('video', 'camera', 'editing', 'drone', 'event', 'creative', 'social', 'livestream');
  CREATE TYPE "public"."enum_homepage_hero_media_type" AS ENUM('image', 'externalVideo');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_services_items_icon_key" AS ENUM('video', 'camera', 'editing', 'drone', 'event', 'creative', 'social', 'livestream');
  CREATE TYPE "public"."enum__homepage_v_version_hero_media_type" AS ENUM('image', 'externalVideo');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_header_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__header_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__header_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_site_settings_social_social_links_platform" AS ENUM('facebook', 'instagram', 'tiktok', 'youtube', 'vimeo', 'linkedin', 'behance', 'other');
  CREATE TYPE "public"."enum_site_settings_brand_default_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_site_settings_brand_fallback_locale" AS ENUM('vi');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_social_social_links_platform" AS ENUM('facebook', 'instagram', 'tiktok', 'youtube', 'vimeo', 'linkedin', 'behance', 'other');
  CREATE TYPE "public"."enum__site_settings_v_version_brand_default_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum__site_settings_v_version_brand_fallback_locale" AS ENUM('vi');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_published_locale" AS ENUM('vi', 'en');
  CREATE TABLE "homepage_about_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_featured_projects_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"client_name" varchar,
  	"year" numeric,
  	"cover_image_id" integer,
  	"preview_image_id" integer,
  	"external_video_u_r_l" varchar,
  	"link" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "homepage_featured_projects_items_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"category_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_project_categories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"cover_image_id" integer,
  	"link" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "homepage_project_categories_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"icon_key" "enum_homepage_services_items_icon_key",
  	"image_id" integer,
  	"link" varchar,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "homepage_services_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_statistics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "homepage_statistics_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_clients_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"website_u_r_l" varchar,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "homepage_stories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"thumbnail_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"link" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "homepage_stories_items_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_canonical_u_r_l" varchar,
  	"hero_enabled" boolean DEFAULT true,
  	"hero_media_type" "enum_homepage_hero_media_type" DEFAULT 'image',
  	"hero_background_image_id" integer,
  	"hero_poster_image_id" integer,
  	"hero_external_video_u_r_l" varchar,
  	"hero_primary_c_t_a_url" varchar,
  	"hero_primary_c_t_a_open_in_new_tab" boolean DEFAULT false,
  	"hero_secondary_c_t_a_url" varchar,
  	"hero_secondary_c_t_a_open_in_new_tab" boolean DEFAULT false,
  	"hero_show_scroll_indicator" boolean DEFAULT true,
  	"about_enabled" boolean DEFAULT true,
  	"about_main_image_id" integer,
  	"about_cta_url" varchar,
  	"about_cta_open_in_new_tab" boolean DEFAULT false,
  	"featured_projects_enabled" boolean DEFAULT true,
  	"project_categories_enabled" boolean DEFAULT true,
  	"services_enabled" boolean DEFAULT true,
  	"statistics_enabled" boolean DEFAULT true,
  	"clients_enabled" boolean DEFAULT true,
  	"stories_enabled" boolean DEFAULT true,
  	"contact_c_t_a_enabled" boolean DEFAULT true,
  	"contact_c_t_a_background_image_id" integer,
  	"contact_c_t_a_cta_url" varchar,
  	"contact_c_t_a_cta_open_in_new_tab" boolean DEFAULT false,
  	"contact_c_t_a_email" varchar,
  	"contact_c_t_a_phone" varchar,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_locales" (
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_title" varchar,
  	"seo_og_description" varchar,
  	"hero_eyebrow" varchar,
  	"hero_title" varchar,
  	"hero_description" varchar,
  	"hero_primary_c_t_a_label" varchar,
  	"hero_secondary_c_t_a_label" varchar,
  	"about_eyebrow" varchar,
  	"about_title" varchar,
  	"about_description" varchar,
  	"about_highlight_text" varchar,
  	"about_cta_label" varchar,
  	"featured_projects_eyebrow" varchar,
  	"featured_projects_title" varchar,
  	"featured_projects_description" varchar,
  	"project_categories_eyebrow" varchar,
  	"project_categories_title" varchar,
  	"project_categories_description" varchar,
  	"services_eyebrow" varchar,
  	"services_title" varchar,
  	"services_description" varchar,
  	"statistics_eyebrow" varchar,
  	"statistics_title" varchar,
  	"statistics_description" varchar,
  	"clients_eyebrow" varchar,
  	"clients_title" varchar,
  	"clients_description" varchar,
  	"stories_eyebrow" varchar,
  	"stories_title" varchar,
  	"stories_description" varchar,
  	"contact_c_t_a_eyebrow" varchar,
  	"contact_c_t_a_title" varchar,
  	"contact_c_t_a_description" varchar,
  	"contact_c_t_a_cta_label" varchar,
  	"contact_c_t_a_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_version_about_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_featured_projects_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"client_name" varchar,
  	"year" numeric,
  	"cover_image_id" integer,
  	"preview_image_id" integer,
  	"external_video_u_r_l" varchar,
  	"link" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_featured_projects_items_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"category_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_version_project_categories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"cover_image_id" integer,
  	"link" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_project_categories_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_version_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"icon_key" "enum__homepage_v_version_services_items_icon_key",
  	"image_id" integer,
  	"link" varchar,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_services_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_version_statistics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_statistics_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v_version_clients_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"website_u_r_l" varchar,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_stories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"thumbnail_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"link" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_stories_items_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_canonical_u_r_l" varchar,
  	"version_hero_enabled" boolean DEFAULT true,
  	"version_hero_media_type" "enum__homepage_v_version_hero_media_type" DEFAULT 'image',
  	"version_hero_background_image_id" integer,
  	"version_hero_poster_image_id" integer,
  	"version_hero_external_video_u_r_l" varchar,
  	"version_hero_primary_c_t_a_url" varchar,
  	"version_hero_primary_c_t_a_open_in_new_tab" boolean DEFAULT false,
  	"version_hero_secondary_c_t_a_url" varchar,
  	"version_hero_secondary_c_t_a_open_in_new_tab" boolean DEFAULT false,
  	"version_hero_show_scroll_indicator" boolean DEFAULT true,
  	"version_about_enabled" boolean DEFAULT true,
  	"version_about_main_image_id" integer,
  	"version_about_cta_url" varchar,
  	"version_about_cta_open_in_new_tab" boolean DEFAULT false,
  	"version_featured_projects_enabled" boolean DEFAULT true,
  	"version_project_categories_enabled" boolean DEFAULT true,
  	"version_services_enabled" boolean DEFAULT true,
  	"version_statistics_enabled" boolean DEFAULT true,
  	"version_clients_enabled" boolean DEFAULT true,
  	"version_stories_enabled" boolean DEFAULT true,
  	"version_contact_c_t_a_enabled" boolean DEFAULT true,
  	"version_contact_c_t_a_background_image_id" integer,
  	"version_contact_c_t_a_cta_url" varchar,
  	"version_contact_c_t_a_cta_open_in_new_tab" boolean DEFAULT false,
  	"version_contact_c_t_a_email" varchar,
  	"version_contact_c_t_a_phone" varchar,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__homepage_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_homepage_v_locales" (
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_title" varchar,
  	"version_seo_og_description" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_title" varchar,
  	"version_hero_description" varchar,
  	"version_hero_primary_c_t_a_label" varchar,
  	"version_hero_secondary_c_t_a_label" varchar,
  	"version_about_eyebrow" varchar,
  	"version_about_title" varchar,
  	"version_about_description" varchar,
  	"version_about_highlight_text" varchar,
  	"version_about_cta_label" varchar,
  	"version_featured_projects_eyebrow" varchar,
  	"version_featured_projects_title" varchar,
  	"version_featured_projects_description" varchar,
  	"version_project_categories_eyebrow" varchar,
  	"version_project_categories_title" varchar,
  	"version_project_categories_description" varchar,
  	"version_services_eyebrow" varchar,
  	"version_services_title" varchar,
  	"version_services_description" varchar,
  	"version_statistics_eyebrow" varchar,
  	"version_statistics_title" varchar,
  	"version_statistics_description" varchar,
  	"version_clients_eyebrow" varchar,
  	"version_clients_title" varchar,
  	"version_clients_description" varchar,
  	"version_stories_eyebrow" varchar,
  	"version_stories_title" varchar,
  	"version_stories_description" varchar,
  	"version_contact_c_t_a_eyebrow" varchar,
  	"version_contact_c_t_a_title" varchar,
  	"version_contact_c_t_a_description" varchar,
  	"version_contact_c_t_a_cta_label" varchar,
  	"version_contact_c_t_a_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "header_navigation_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"branding_logo_light_id" integer,
  	"branding_logo_dark_id" integer,
  	"branding_sticky" boolean DEFAULT true,
  	"branding_transparent_on_hero" boolean DEFAULT true,
  	"branding_show_language_switcher" boolean DEFAULT true,
  	"cta_button_enabled" boolean DEFAULT false,
  	"cta_button_url" varchar,
  	"cta_button_open_in_new_tab" boolean DEFAULT false,
  	"_status" "enum_header_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_locales" (
  	"cta_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_header_v_version_navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"internal_name" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_header_v_version_navigation_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_header_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_branding_logo_light_id" integer,
  	"version_branding_logo_dark_id" integer,
  	"version_branding_sticky" boolean DEFAULT true,
  	"version_branding_transparent_on_hero" boolean DEFAULT true,
  	"version_branding_show_language_switcher" boolean DEFAULT true,
  	"version_cta_button_enabled" boolean DEFAULT false,
  	"version_cta_button_url" varchar,
  	"version_cta_button_open_in_new_tab" boolean DEFAULT false,
  	"version__status" "enum__header_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__header_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_header_v_locales" (
  	"version_cta_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_navigation_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "footer_navigation_columns_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_navigation_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_navigation_columns_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"branding_logo_id" integer,
  	"branding_background_image_id" integer,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"_status" "enum_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"branding_short_description" varchar,
  	"contact_address" varchar,
  	"legal_copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v_version_navigation_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_navigation_columns_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v_version_navigation_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_navigation_columns_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_branding_logo_id" integer,
  	"version_branding_background_image_id" integer,
  	"version_contact_email" varchar,
  	"version_contact_phone" varchar,
  	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__footer_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_footer_v_locales" (
  	"version_branding_short_description" varchar,
  	"version_contact_address" varchar,
  	"version_legal_copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_social_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_social_links_platform",
  	"label" varchar,
  	"url" varchar,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_site_name" varchar,
  	"brand_legal_name" varchar,
  	"brand_default_locale" "enum_site_settings_brand_default_locale" DEFAULT 'vi',
  	"brand_fallback_locale" "enum_site_settings_brand_fallback_locale" DEFAULT 'vi',
  	"brand_favicon_id" integer,
  	"brand_default_o_g_image_id" integer,
  	"brand_logo_mark_id" integer,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"system_maintenance_mode" boolean DEFAULT false,
  	"system_default_contact_c_t_a_u_r_l" varchar,
  	"_status" "enum_site_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"contact_address" varchar,
  	"seo_defaults_default_meta_title" varchar,
  	"seo_defaults_default_meta_description" varchar,
  	"system_maintenance_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_settings_v_version_social_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__site_settings_v_version_social_social_links_platform",
  	"label" varchar,
  	"url" varchar,
  	"enabled" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_brand_site_name" varchar,
  	"version_brand_legal_name" varchar,
  	"version_brand_default_locale" "enum__site_settings_v_version_brand_default_locale" DEFAULT 'vi',
  	"version_brand_fallback_locale" "enum__site_settings_v_version_brand_fallback_locale" DEFAULT 'vi',
  	"version_brand_favicon_id" integer,
  	"version_brand_default_o_g_image_id" integer,
  	"version_brand_logo_mark_id" integer,
  	"version_contact_email" varchar,
  	"version_contact_phone" varchar,
  	"version_system_maintenance_mode" boolean DEFAULT false,
  	"version_system_default_contact_c_t_a_u_r_l" varchar,
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_settings_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_site_settings_v_locales" (
  	"version_contact_address" varchar,
  	"version_seo_defaults_default_meta_title" varchar,
  	"version_seo_defaults_default_meta_description" varchar,
  	"version_system_maintenance_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "homepage_about_gallery" ADD CONSTRAINT "homepage_about_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_about_gallery" ADD CONSTRAINT "homepage_about_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_featured_projects_items" ADD CONSTRAINT "homepage_featured_projects_items_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_featured_projects_items" ADD CONSTRAINT "homepage_featured_projects_items_preview_image_id_media_id_fk" FOREIGN KEY ("preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_featured_projects_items" ADD CONSTRAINT "homepage_featured_projects_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_featured_projects_items_locales" ADD CONSTRAINT "homepage_featured_projects_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_featured_projects_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_project_categories_items" ADD CONSTRAINT "homepage_project_categories_items_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_project_categories_items" ADD CONSTRAINT "homepage_project_categories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_project_categories_items_locales" ADD CONSTRAINT "homepage_project_categories_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_project_categories_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_services_items" ADD CONSTRAINT "homepage_services_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_services_items" ADD CONSTRAINT "homepage_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_services_items_locales" ADD CONSTRAINT "homepage_services_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_services_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_statistics_items" ADD CONSTRAINT "homepage_statistics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_statistics_items_locales" ADD CONSTRAINT "homepage_statistics_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_statistics_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_clients_items" ADD CONSTRAINT "homepage_clients_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_clients_items" ADD CONSTRAINT "homepage_clients_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_stories_items" ADD CONSTRAINT "homepage_stories_items_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_stories_items" ADD CONSTRAINT "homepage_stories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_stories_items_locales" ADD CONSTRAINT "homepage_stories_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_stories_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_background_image_id_media_id_fk" FOREIGN KEY ("hero_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_poster_image_id_media_id_fk" FOREIGN KEY ("hero_poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_about_main_image_id_media_id_fk" FOREIGN KEY ("about_main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_contact_c_t_a_background_image_id_media_id_fk" FOREIGN KEY ("contact_c_t_a_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_about_gallery" ADD CONSTRAINT "_homepage_v_version_about_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_about_gallery" ADD CONSTRAINT "_homepage_v_version_about_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_featured_projects_items" ADD CONSTRAINT "_homepage_v_version_featured_projects_items_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_featured_projects_items" ADD CONSTRAINT "_homepage_v_version_featured_projects_items_preview_image_id_media_id_fk" FOREIGN KEY ("preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_featured_projects_items" ADD CONSTRAINT "_homepage_v_version_featured_projects_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_featured_projects_items_locales" ADD CONSTRAINT "_homepage_v_version_featured_projects_items_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_featured_projects_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_project_categories_items" ADD CONSTRAINT "_homepage_v_version_project_categories_items_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_project_categories_items" ADD CONSTRAINT "_homepage_v_version_project_categories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_project_categories_items_locales" ADD CONSTRAINT "_homepage_v_version_project_categories_items_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_project_categories_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_services_items" ADD CONSTRAINT "_homepage_v_version_services_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_services_items" ADD CONSTRAINT "_homepage_v_version_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_services_items_locales" ADD CONSTRAINT "_homepage_v_version_services_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_services_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_statistics_items" ADD CONSTRAINT "_homepage_v_version_statistics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_statistics_items_locales" ADD CONSTRAINT "_homepage_v_version_statistics_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_statistics_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_clients_items" ADD CONSTRAINT "_homepage_v_version_clients_items_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_clients_items" ADD CONSTRAINT "_homepage_v_version_clients_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_stories_items" ADD CONSTRAINT "_homepage_v_version_stories_items_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_stories_items" ADD CONSTRAINT "_homepage_v_version_stories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_stories_items_locales" ADD CONSTRAINT "_homepage_v_version_stories_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_stories_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_background_image_id_media_id_fk" FOREIGN KEY ("version_hero_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_poster_image_id_media_id_fk" FOREIGN KEY ("version_hero_poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_about_main_image_id_media_id_fk" FOREIGN KEY ("version_about_main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_contact_c_t_a_background_image_id_media_id_fk" FOREIGN KEY ("version_contact_c_t_a_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_locales" ADD CONSTRAINT "_homepage_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation_items" ADD CONSTRAINT "header_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_navigation_items_locales" ADD CONSTRAINT "header_navigation_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_branding_logo_light_id_media_id_fk" FOREIGN KEY ("branding_logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_branding_logo_dark_id_media_id_fk" FOREIGN KEY ("branding_logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_navigation_items" ADD CONSTRAINT "_header_v_version_navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v_version_navigation_items_locales" ADD CONSTRAINT "_header_v_version_navigation_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v_version_navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v" ADD CONSTRAINT "_header_v_version_branding_logo_light_id_media_id_fk" FOREIGN KEY ("version_branding_logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v" ADD CONSTRAINT "_header_v_version_branding_logo_dark_id_media_id_fk" FOREIGN KEY ("version_branding_logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v_locales" ADD CONSTRAINT "_header_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_columns_links" ADD CONSTRAINT "footer_navigation_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_navigation_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_columns_links_locales" ADD CONSTRAINT "footer_navigation_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_navigation_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_columns" ADD CONSTRAINT "footer_navigation_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_navigation_columns_locales" ADD CONSTRAINT "footer_navigation_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_navigation_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_branding_logo_id_media_id_fk" FOREIGN KEY ("branding_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_branding_background_image_id_media_id_fk" FOREIGN KEY ("branding_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_navigation_columns_links" ADD CONSTRAINT "_footer_v_version_navigation_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_navigation_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_navigation_columns_links_locales" ADD CONSTRAINT "_footer_v_version_navigation_columns_links_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_navigation_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_navigation_columns" ADD CONSTRAINT "_footer_v_version_navigation_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_navigation_columns_locales" ADD CONSTRAINT "_footer_v_version_navigation_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_navigation_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v" ADD CONSTRAINT "_footer_v_version_branding_logo_id_media_id_fk" FOREIGN KEY ("version_branding_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v" ADD CONSTRAINT "_footer_v_version_branding_background_image_id_media_id_fk" FOREIGN KEY ("version_branding_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_footer_v_locales" ADD CONSTRAINT "_footer_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_social_links" ADD CONSTRAINT "site_settings_social_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brand_favicon_id_media_id_fk" FOREIGN KEY ("brand_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brand_default_o_g_image_id_media_id_fk" FOREIGN KEY ("brand_default_o_g_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brand_logo_mark_id_media_id_fk" FOREIGN KEY ("brand_logo_mark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_social_social_links" ADD CONSTRAINT "_site_settings_v_version_social_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_brand_favicon_id_media_id_fk" FOREIGN KEY ("version_brand_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_brand_default_o_g_image_id_media_id_fk" FOREIGN KEY ("version_brand_default_o_g_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_brand_logo_mark_id_media_id_fk" FOREIGN KEY ("version_brand_logo_mark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_locales" ADD CONSTRAINT "_site_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_about_gallery_order_idx" ON "homepage_about_gallery" USING btree ("_order");
  CREATE INDEX "homepage_about_gallery_parent_id_idx" ON "homepage_about_gallery" USING btree ("_parent_id");
  CREATE INDEX "homepage_about_gallery_image_idx" ON "homepage_about_gallery" USING btree ("image_id");
  CREATE INDEX "homepage_featured_projects_items_order_idx" ON "homepage_featured_projects_items" USING btree ("_order");
  CREATE INDEX "homepage_featured_projects_items_parent_id_idx" ON "homepage_featured_projects_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_featured_projects_items_cover_image_idx" ON "homepage_featured_projects_items" USING btree ("cover_image_id");
  CREATE INDEX "homepage_featured_projects_items_preview_image_idx" ON "homepage_featured_projects_items" USING btree ("preview_image_id");
  CREATE UNIQUE INDEX "homepage_featured_projects_items_locales_locale_parent_id_un" ON "homepage_featured_projects_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_project_categories_items_order_idx" ON "homepage_project_categories_items" USING btree ("_order");
  CREATE INDEX "homepage_project_categories_items_parent_id_idx" ON "homepage_project_categories_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_project_categories_items_cover_image_idx" ON "homepage_project_categories_items" USING btree ("cover_image_id");
  CREATE UNIQUE INDEX "homepage_project_categories_items_locales_locale_parent_id_u" ON "homepage_project_categories_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_services_items_order_idx" ON "homepage_services_items" USING btree ("_order");
  CREATE INDEX "homepage_services_items_parent_id_idx" ON "homepage_services_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_services_items_image_idx" ON "homepage_services_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_services_items_locales_locale_parent_id_unique" ON "homepage_services_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_statistics_items_order_idx" ON "homepage_statistics_items" USING btree ("_order");
  CREATE INDEX "homepage_statistics_items_parent_id_idx" ON "homepage_statistics_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_statistics_items_locales_locale_parent_id_unique" ON "homepage_statistics_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_clients_items_order_idx" ON "homepage_clients_items" USING btree ("_order");
  CREATE INDEX "homepage_clients_items_parent_id_idx" ON "homepage_clients_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_clients_items_logo_idx" ON "homepage_clients_items" USING btree ("logo_id");
  CREATE INDEX "homepage_stories_items_order_idx" ON "homepage_stories_items" USING btree ("_order");
  CREATE INDEX "homepage_stories_items_parent_id_idx" ON "homepage_stories_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_stories_items_thumbnail_idx" ON "homepage_stories_items" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "homepage_stories_items_locales_locale_parent_id_unique" ON "homepage_stories_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_seo_seo_og_image_idx" ON "homepage" USING btree ("seo_og_image_id");
  CREATE INDEX "homepage_hero_hero_background_image_idx" ON "homepage" USING btree ("hero_background_image_id");
  CREATE INDEX "homepage_hero_hero_poster_image_idx" ON "homepage" USING btree ("hero_poster_image_id");
  CREATE INDEX "homepage_about_about_main_image_idx" ON "homepage" USING btree ("about_main_image_id");
  CREATE INDEX "homepage_contact_c_t_a_contact_c_t_a_background_image_idx" ON "homepage" USING btree ("contact_c_t_a_background_image_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "homepage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_about_gallery_order_idx" ON "_homepage_v_version_about_gallery" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_about_gallery_parent_id_idx" ON "_homepage_v_version_about_gallery" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_about_gallery_image_idx" ON "_homepage_v_version_about_gallery" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_featured_projects_items_order_idx" ON "_homepage_v_version_featured_projects_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_featured_projects_items_parent_id_idx" ON "_homepage_v_version_featured_projects_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_featured_projects_items_cover_image_idx" ON "_homepage_v_version_featured_projects_items" USING btree ("cover_image_id");
  CREATE INDEX "_homepage_v_version_featured_projects_items_preview_imag_idx" ON "_homepage_v_version_featured_projects_items" USING btree ("preview_image_id");
  CREATE UNIQUE INDEX "_homepage_v_version_featured_projects_items_locales_locale_p" ON "_homepage_v_version_featured_projects_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_project_categories_items_order_idx" ON "_homepage_v_version_project_categories_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_project_categories_items_parent_id_idx" ON "_homepage_v_version_project_categories_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_project_categories_items_cover_image_idx" ON "_homepage_v_version_project_categories_items" USING btree ("cover_image_id");
  CREATE UNIQUE INDEX "_homepage_v_version_project_categories_items_locales_locale_" ON "_homepage_v_version_project_categories_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_services_items_order_idx" ON "_homepage_v_version_services_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_services_items_parent_id_idx" ON "_homepage_v_version_services_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_services_items_image_idx" ON "_homepage_v_version_services_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_homepage_v_version_services_items_locales_locale_parent_id_" ON "_homepage_v_version_services_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_statistics_items_order_idx" ON "_homepage_v_version_statistics_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_statistics_items_parent_id_idx" ON "_homepage_v_version_statistics_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_homepage_v_version_statistics_items_locales_locale_parent_i" ON "_homepage_v_version_statistics_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_clients_items_order_idx" ON "_homepage_v_version_clients_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_clients_items_parent_id_idx" ON "_homepage_v_version_clients_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_clients_items_logo_idx" ON "_homepage_v_version_clients_items" USING btree ("logo_id");
  CREATE INDEX "_homepage_v_version_stories_items_order_idx" ON "_homepage_v_version_stories_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_stories_items_parent_id_idx" ON "_homepage_v_version_stories_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_stories_items_thumbnail_idx" ON "_homepage_v_version_stories_items" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "_homepage_v_version_stories_items_locales_locale_parent_id_u" ON "_homepage_v_version_stories_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_seo_version_seo_og_image_idx" ON "_homepage_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_background_image_idx" ON "_homepage_v" USING btree ("version_hero_background_image_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_poster_image_idx" ON "_homepage_v" USING btree ("version_hero_poster_image_id");
  CREATE INDEX "_homepage_v_version_about_version_about_main_image_idx" ON "_homepage_v" USING btree ("version_about_main_image_id");
  CREATE INDEX "_homepage_v_version_contact_c_t_a_version_contact_c_t_a__idx" ON "_homepage_v" USING btree ("version_contact_c_t_a_background_image_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_snapshot_idx" ON "_homepage_v" USING btree ("snapshot");
  CREATE INDEX "_homepage_v_published_locale_idx" ON "_homepage_v" USING btree ("published_locale");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "_homepage_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_homepage_v_locales_locale_parent_id_unique" ON "_homepage_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_navigation_items_order_idx" ON "header_navigation_items" USING btree ("_order");
  CREATE INDEX "header_navigation_items_parent_id_idx" ON "header_navigation_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_navigation_items_locales_locale_parent_id_unique" ON "header_navigation_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_branding_branding_logo_light_idx" ON "header" USING btree ("branding_logo_light_id");
  CREATE INDEX "header_branding_branding_logo_dark_idx" ON "header" USING btree ("branding_logo_dark_id");
  CREATE INDEX "header__status_idx" ON "header" USING btree ("_status");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_header_v_version_navigation_items_order_idx" ON "_header_v_version_navigation_items" USING btree ("_order");
  CREATE INDEX "_header_v_version_navigation_items_parent_id_idx" ON "_header_v_version_navigation_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_header_v_version_navigation_items_locales_locale_parent_id_" ON "_header_v_version_navigation_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_header_v_version_branding_version_branding_logo_light_idx" ON "_header_v" USING btree ("version_branding_logo_light_id");
  CREATE INDEX "_header_v_version_branding_version_branding_logo_dark_idx" ON "_header_v" USING btree ("version_branding_logo_dark_id");
  CREATE INDEX "_header_v_version_version__status_idx" ON "_header_v" USING btree ("version__status");
  CREATE INDEX "_header_v_created_at_idx" ON "_header_v" USING btree ("created_at");
  CREATE INDEX "_header_v_updated_at_idx" ON "_header_v" USING btree ("updated_at");
  CREATE INDEX "_header_v_snapshot_idx" ON "_header_v" USING btree ("snapshot");
  CREATE INDEX "_header_v_published_locale_idx" ON "_header_v" USING btree ("published_locale");
  CREATE INDEX "_header_v_latest_idx" ON "_header_v" USING btree ("latest");
  CREATE INDEX "_header_v_autosave_idx" ON "_header_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_header_v_locales_locale_parent_id_unique" ON "_header_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_navigation_columns_links_order_idx" ON "footer_navigation_columns_links" USING btree ("_order");
  CREATE INDEX "footer_navigation_columns_links_parent_id_idx" ON "footer_navigation_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_navigation_columns_links_locales_locale_parent_id_uni" ON "footer_navigation_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_navigation_columns_order_idx" ON "footer_navigation_columns" USING btree ("_order");
  CREATE INDEX "footer_navigation_columns_parent_id_idx" ON "footer_navigation_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_navigation_columns_locales_locale_parent_id_unique" ON "footer_navigation_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_branding_branding_logo_idx" ON "footer" USING btree ("branding_logo_id");
  CREATE INDEX "footer_branding_branding_background_image_idx" ON "footer" USING btree ("branding_background_image_id");
  CREATE INDEX "footer__status_idx" ON "footer" USING btree ("_status");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_navigation_columns_links_order_idx" ON "_footer_v_version_navigation_columns_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_navigation_columns_links_parent_id_idx" ON "_footer_v_version_navigation_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_navigation_columns_links_locales_locale_pa" ON "_footer_v_version_navigation_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_navigation_columns_order_idx" ON "_footer_v_version_navigation_columns" USING btree ("_order");
  CREATE INDEX "_footer_v_version_navigation_columns_parent_id_idx" ON "_footer_v_version_navigation_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_navigation_columns_locales_locale_parent_i" ON "_footer_v_version_navigation_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_branding_version_branding_logo_idx" ON "_footer_v" USING btree ("version_branding_logo_id");
  CREATE INDEX "_footer_v_version_branding_version_branding_background_i_idx" ON "_footer_v" USING btree ("version_branding_background_image_id");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_snapshot_idx" ON "_footer_v" USING btree ("snapshot");
  CREATE INDEX "_footer_v_published_locale_idx" ON "_footer_v" USING btree ("published_locale");
  CREATE INDEX "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  CREATE INDEX "_footer_v_autosave_idx" ON "_footer_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_footer_v_locales_locale_parent_id_unique" ON "_footer_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_social_social_links_order_idx" ON "site_settings_social_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_social_links_parent_id_idx" ON "site_settings_social_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_brand_brand_favicon_idx" ON "site_settings" USING btree ("brand_favicon_id");
  CREATE INDEX "site_settings_brand_brand_default_o_g_image_idx" ON "site_settings" USING btree ("brand_default_o_g_image_id");
  CREATE INDEX "site_settings_brand_brand_logo_mark_idx" ON "site_settings" USING btree ("brand_logo_mark_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_version_social_social_links_order_idx" ON "_site_settings_v_version_social_social_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_social_social_links_parent_id_idx" ON "_site_settings_v_version_social_social_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_brand_version_brand_favicon_idx" ON "_site_settings_v" USING btree ("version_brand_favicon_id");
  CREATE INDEX "_site_settings_v_version_brand_version_brand_default_o_g_idx" ON "_site_settings_v" USING btree ("version_brand_default_o_g_image_id");
  CREATE INDEX "_site_settings_v_version_brand_version_brand_logo_mark_idx" ON "_site_settings_v" USING btree ("version_brand_logo_mark_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_snapshot_idx" ON "_site_settings_v" USING btree ("snapshot");
  CREATE INDEX "_site_settings_v_published_locale_idx" ON "_site_settings_v" USING btree ("published_locale");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE INDEX "_site_settings_v_autosave_idx" ON "_site_settings_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_site_settings_v_locales_locale_parent_id_unique" ON "_site_settings_v_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "homepage_about_gallery" CASCADE;
  DROP TABLE "homepage_featured_projects_items" CASCADE;
  DROP TABLE "homepage_featured_projects_items_locales" CASCADE;
  DROP TABLE "homepage_project_categories_items" CASCADE;
  DROP TABLE "homepage_project_categories_items_locales" CASCADE;
  DROP TABLE "homepage_services_items" CASCADE;
  DROP TABLE "homepage_services_items_locales" CASCADE;
  DROP TABLE "homepage_statistics_items" CASCADE;
  DROP TABLE "homepage_statistics_items_locales" CASCADE;
  DROP TABLE "homepage_clients_items" CASCADE;
  DROP TABLE "homepage_stories_items" CASCADE;
  DROP TABLE "homepage_stories_items_locales" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_locales" CASCADE;
  DROP TABLE "_homepage_v_version_about_gallery" CASCADE;
  DROP TABLE "_homepage_v_version_featured_projects_items" CASCADE;
  DROP TABLE "_homepage_v_version_featured_projects_items_locales" CASCADE;
  DROP TABLE "_homepage_v_version_project_categories_items" CASCADE;
  DROP TABLE "_homepage_v_version_project_categories_items_locales" CASCADE;
  DROP TABLE "_homepage_v_version_services_items" CASCADE;
  DROP TABLE "_homepage_v_version_services_items_locales" CASCADE;
  DROP TABLE "_homepage_v_version_statistics_items" CASCADE;
  DROP TABLE "_homepage_v_version_statistics_items_locales" CASCADE;
  DROP TABLE "_homepage_v_version_clients_items" CASCADE;
  DROP TABLE "_homepage_v_version_stories_items" CASCADE;
  DROP TABLE "_homepage_v_version_stories_items_locales" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_locales" CASCADE;
  DROP TABLE "header_navigation_items" CASCADE;
  DROP TABLE "header_navigation_items_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "_header_v_version_navigation_items" CASCADE;
  DROP TABLE "_header_v_version_navigation_items_locales" CASCADE;
  DROP TABLE "_header_v" CASCADE;
  DROP TABLE "_header_v_locales" CASCADE;
  DROP TABLE "footer_navigation_columns_links" CASCADE;
  DROP TABLE "footer_navigation_columns_links_locales" CASCADE;
  DROP TABLE "footer_navigation_columns" CASCADE;
  DROP TABLE "footer_navigation_columns_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "_footer_v_version_navigation_columns_links" CASCADE;
  DROP TABLE "_footer_v_version_navigation_columns_links_locales" CASCADE;
  DROP TABLE "_footer_v_version_navigation_columns" CASCADE;
  DROP TABLE "_footer_v_version_navigation_columns_locales" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "_footer_v_locales" CASCADE;
  DROP TABLE "site_settings_social_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "_site_settings_v_version_social_social_links" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_locales" CASCADE;
  DROP TYPE "public"."enum_homepage_services_items_icon_key";
  DROP TYPE "public"."enum_homepage_hero_media_type";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_services_items_icon_key";
  DROP TYPE "public"."enum__homepage_v_version_hero_media_type";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum__homepage_v_published_locale";
  DROP TYPE "public"."enum_header_status";
  DROP TYPE "public"."enum__header_v_version_status";
  DROP TYPE "public"."enum__header_v_published_locale";
  DROP TYPE "public"."enum_footer_status";
  DROP TYPE "public"."enum__footer_v_version_status";
  DROP TYPE "public"."enum__footer_v_published_locale";
  DROP TYPE "public"."enum_site_settings_social_social_links_platform";
  DROP TYPE "public"."enum_site_settings_brand_default_locale";
  DROP TYPE "public"."enum_site_settings_brand_fallback_locale";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_social_social_links_platform";
  DROP TYPE "public"."enum__site_settings_v_version_brand_default_locale";
  DROP TYPE "public"."enum__site_settings_v_version_brand_fallback_locale";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum__site_settings_v_published_locale";`)
}
