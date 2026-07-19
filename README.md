PROJECT CONTEXT — WEBSITE PORTFOLIO PRODUCTION HOUSE

1. Tổng quan dự án

Xây dựng website portfolio cho một cá nhân hoặc công ty hoạt động trong lĩnh vực quay phim, chụp ảnh và sản xuất nội dung truyền thông.

Website tập trung vào các mảng:

TVC doanh nghiệp.
Sự kiện.
Sự kiện âm nhạc.
MV ca nhạc.
Focuscam ca sĩ/nghệ sĩ.
Sports.
Viral content.
Automotive/quay xe.
Travel & Tour.
Beauty/thẩm mỹ.
TikTok, Reels và short-form content.
Behind the Scenes.

Website phải có:

Trang public dành cho khách truy cập.
Backend/API.
Trang quản trị nội dung.
Hỗ trợ song ngữ Tiếng Việt và English.
Người dùng sau khi bàn giao có thể tự sửa nội dung mà không cần thay đổi source code.
Tối ưu SEO, tốc độ tải ảnh, responsive và trải nghiệm thị giác. 2. Phạm vi triển khai hiện tại

Giai đoạn đầu chỉ tập trung hoàn thiện:

Trang chủ public

- Trang quản trị nội dung trang chủ
- Hệ thống song ngữ
- Quản lý media/ảnh
- Cấu hình website cơ bản

Chưa cần triển khai đầy đủ:

Project listing.
Project categories.
Project detail.
Blog/news đầy đủ.
Client portal.
CRM.
Báo giá.
Hợp đồng.
Thanh toán.

Tuy nhiên kiến trúc cần chuẩn bị sẵn để sau này bổ sung module Project mà không phải viết lại trang chủ.

3. Tech stack đã chốt
   Core
   Language: TypeScript
   Framework: Next.js App Router
   CMS/Backend/Admin: Payload CMS
   Database: PostgreSQL
   Styling: Tailwind CSS
   Animation: Motion
   Validation: Zod
   Forms: React Hook Form
   Localization UI: next-intl
   Localization CMS: Payload localized fields
   Deploy
   VPS Ubuntu
   Docker Compose
   Caddy reverse proxy
   PostgreSQL
   Next.js + Payload CMS
   Cloudflare DNS/CDN
   Media
   Ảnh lưu trực tiếp trên VPS
   Không dùng Cloudflare R2
   Không lưu ảnh dạng binary trong PostgreSQL
   Database chỉ lưu metadata và đường dẫn

Video giai đoạn đầu sử dụng:

YouTube
Vimeo
hoặc video URL bên ngoài

Không upload video TVC/MV dung lượng lớn trực tiếp vào VPS trong giai đoạn đầu.

4. Kiến trúc ứng dụng

Dùng một repository chứa cả frontend và backend:

project-root/
├── src/
│ ├── app/
│ │ ├── (payload)/
│ │ │ ├── admin/
│ │ │ └── api/
│ │ └── (frontend)/
│ │ └── [locale]/
│ │ ├── page.tsx
│ │ ├── layout.tsx
│ │ └── ...
│ ├── collections/
│ ├── globals/
│ ├── blocks/
│ ├── components/
│ ├── features/
│ ├── lib/
│ ├── i18n/
│ ├── hooks/
│ ├── styles/
│ └── types/
├── messages/
│ ├── vi.json
│ └── en.json
├── public/
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── AGENTS.md
└── README.md

Public routes:

/vi
/en

Admin:

/admin

Payload API:

/api 5. Màu sắc và design system

Màu thương hiệu chính:

rgb(255, 92, 0)

HEX:

#FF5C00

Thiết lập biến CSS:

:root {
--brand: 255 92 0;
--background: 10 10 10;
--surface: 20 20 20;
--surface-elevated: 28 28 28;
--foreground: 255 255 255;
--muted-foreground: 160 160 160;
--border: 42 42 42;
}

Bảng màu:

Brand: #FF5C00
Brand hover: #FF7433
Background: #0A0A0A
Surface: #141414
Elevated surface:#1C1C1C
Border: #2A2A2A
Foreground: #FFFFFF
Muted text: #A0A0A0

Màu cam chỉ dùng làm điểm nhấn:

CTA.
Hover.
Underline.
Border.
Con số thống kê.
Icon hoặc label nhỏ.

Không dùng màu cam cho toàn bộ phần nội dung dài.

6. Typography

Đề xuất:

Heading: Space Grotesk
Body: Inter

Dùng next/font.

Nguyên tắc:

Heading mạnh, hiện đại, phù hợp production house.
Tiêu đề lớn có thể viết uppercase.
Body dễ đọc.
Không sử dụng quá hai font chính.
Tránh layout shift khi font tải. 7. Ngôn ngữ

Website hỗ trợ hai ngôn ngữ:

vi — Tiếng Việt
en — English
Route
/vi
/en

Sau này:

/vi/du-an
/en/projects
Nội dung cố định của UI

Dùng next-intl:

Menu.
View more.
Back.
Submit.
Validation messages.
Form labels.
Footer labels.
System notifications.

Ví dụ:

{
"navigation": {
"home": "Trang chủ",
"projects": "Dự án",
"about": "Giới thiệu",
"contact": "Liên hệ"
}
}
Nội dung quản trị

Dùng Payload localized fields:

{
name: 'title',
type: 'text',
localized: true,
}

Các nội dung localized:

Tiêu đề.
Mô tả.
Nút CTA.
Nội dung giới thiệu.
Alt text.
Caption.
SEO title.
SEO description.
Nội dung contact.
Statistics label.

Không cần localized:

Email.
Số điện thoại.
URL.
Ảnh.
Video.
Tên thương hiệu.
Tên khách hàng.
Năm.
Social links.

Fallback:

Nếu locale en chưa có dữ liệu
→ fallback về vi

Trong admin cần cảnh báo khi bản dịch tiếng Anh chưa hoàn thiện.

8. Cấu trúc trang chủ

Trang chủ gồm các section cố định:

1. Header
2. Hero / Showreel
3. About / Introduction
4. Featured Projects
5. Project Categories / Fields
6. Services
7. Statistics
8. Clients
9. Stories / Behind the Scenes
10. Contact CTA
11. Footer

Người quản trị chỉ chỉnh nội dung, không được tự do phá cấu trúc layout.

Các yếu tố cố định trong source code:

Layout.
Grid.
Typography.
Khoảng cách.
Responsive.
Animation.
Hover.
Màu thương hiệu.
Vị trí section.

Các yếu tố được chỉnh trong admin:

Text.
Ảnh.
Video URL.
CTA label.
CTA URL.
Danh sách item.
Thứ tự item.
Bật/tắt section.
Nội dung SEO. 9. Payload Globals

Tạo các Globals:

Homepage
SiteSettings
Header
Footer

Có thể gộp Header và Footer vào SiteSettings nếu muốn đơn giản.

Homepage

Schema tổng quát:

Homepage {
seo
hero
about
featuredProjects
categories
services
statistics
clients
stories
contact
}

Mỗi section nên có:

{
enabled: boolean
eyebrow?: localized string
title?: localized string
description?: localized rich text
} 10. Homepage fields
SEO
SEO title VI/EN
SEO description VI/EN
Open Graph title VI/EN
Open Graph description VI/EN
Open Graph image
Index/no-index
Canonical URL
Hero
enabled
eyebrow VI/EN
title VI/EN
description VI/EN
background type: image | external-video
background image
poster image
video URL
primary CTA label VI/EN
primary CTA URL
secondary CTA label VI/EN
secondary CTA URL
show scroll indicator

Không upload video lớn trực tiếp vào VPS.

About
enabled
eyebrow VI/EN
title VI/EN
description VI/EN
highlight text VI/EN
main image
gallery images
CTA label VI/EN
CTA URL
Featured Projects

Giai đoạn đầu chưa có Project module đầy đủ.

Tạm dùng embedded array:

enabled
title VI/EN
description VI/EN
items[]

Mỗi item:

title VI/EN
subtitle VI/EN
cover image
video preview URL optional
link
category label VI/EN
client name
year
display order
enabled

Sau khi Project module hoàn thành, thay embedded items bằng relationship tới collection Projects.

Frontend component phải được thiết kế để dễ đổi nguồn dữ liệu mà không thay đổi giao diện.

Project Categories / Fields

Các nhóm ban đầu:

Events
TVC & Corporate
Sports
Social & Viral
Artist Focuscam
Automotive
Travel & Tour
Beauty
Behind the Scenes

Mỗi item:

title VI/EN
description VI/EN
cover image
link
display order
enabled

Giai đoạn đầu link có thể nhập thủ công.

Sau này liên kết tới Project Category collection.

Services

Các dịch vụ có thể gồm:

Video Production
Photography
Post-production
Drone Filming
Event Coverage
Creative Concept
TikTok Production
Livestream

Mỗi service:

title VI/EN
description VI/EN
icon optional
image optional
link optional
display order
enabled
Statistics

Mỗi item:

value
prefix optional
suffix optional
label VI/EN
display order
enabled

Ví dụ:

10 | + | Years of Experience
200 | + | Projects Delivered
80 | + | Clients
Clients

Mỗi item:

name
logo
website URL optional
display order
enabled

Logo nên có alt text.

Stories / Behind the Scenes

Giai đoạn đầu có thể dùng embedded list:

title VI/EN
description VI/EN
thumbnail
date
link
display order
enabled

Sau này thay bằng collection Posts hoặc Stories.

Contact CTA
enabled
eyebrow VI/EN
title VI/EN
description VI/EN
background image
CTA label VI/EN
CTA URL
email
phone
address VI/EN
social links 11. Header

Header fields:

logo dark
logo light
navigation items
language switcher
CTA button
sticky mode
transparent on hero

Navigation item:

label VI/EN
URL
open in new tab
display order
enabled

Header phải:

Transparent trên Hero.
Chuyển nền tối khi scroll.
Responsive mobile.
Có switch VI | EN.
Có menu mobile. 12. Footer

Footer fields:

logo
short description VI/EN
email
phone
address VI/EN
social links
navigation columns
copyright VI/EN
background image optional 13. Media Collection

Tạo Payload collection:

Media

Fields:

alt VI/EN
caption VI/EN
credit
tags
folder/category
upload metadata

Cho phép:

image/jpeg
image/png
image/webp
image/avif
image/svg+xml

SVG cần được kiểm tra an toàn hoặc giới hạn chỉ cho admin tin cậy.

Không cho upload:

.exe
.php
.js
.sh
.bat
.cmd

Giới hạn dung lượng ảnh khoảng:

10–15 MB/file 14. Lưu ảnh trên VPS

Ảnh phải được lưu ngoài container bằng bind mount.

Thư mục trên VPS:

/var/www/highlight-media/uploads

Mount vào app:

services:
app:
volumes: - /var/www/highlight-media/uploads:/app/public/uploads

Không được lưu ảnh chỉ bên trong filesystem của container.

Cấu trúc URL:

/uploads/homepage/...
/uploads/projects/...
/uploads/clients/...
/uploads/stories/...

Ví dụ:

https://domain.vn/uploads/homepage/hero.webp

Database chỉ lưu:

filename
url
alt
caption
width
height
mimeType
filesize
createdAt 15. Xử lý ảnh

Khi upload:

1. Kiểm tra MIME type
2. Kiểm tra dung lượng
3. Chuẩn hóa tên file
4. Tạo tên file unique
5. Lưu ảnh gốc nếu cần
6. Tạo thumbnail
7. Tạo các kích thước responsive
8. Tạo WebP
9. Lưu metadata

Các kích thước đề xuất:

thumbnail: 400px
small: 768px
medium: 1280px
large: 1920px

Không upscale ảnh nhỏ.

Tên file:

project-slug-cover-uuid.webp

Không dùng:

IMG_0001.JPG
ảnh mới nhất cuối cùng.jpg 16. SEO

Trang chủ phải có:

Server-rendered HTML.
Metadata theo locale.
Canonical.
hreflang cho vi và en.
Open Graph.
Twitter Card.
Semantic HTML.
sitemap.xml.
robots.txt.
Structured data Organization.
Alt text cho ảnh.
Width/height cho ảnh.
Lazy loading cho ảnh ngoài viewport.
Priority cho Hero image.
URL ổn định.

Ví dụ hreflang:

<link rel="alternate" hreflang="vi" href="https://domain.vn/vi" />
<link rel="alternate" hreflang="en" href="https://domain.vn/en" />
<link rel="alternate" hreflang="x-default" href="https://domain.vn/vi" />

Không dùng client-side-only rendering cho nội dung SEO chính.

17. Performance

Yêu cầu:

Dùng Server Components mặc định.
Chỉ dùng Client Components khi thực sự cần.
Lazy load animation nặng.
Lazy load video iframe.
Hero có poster image.
Không autoplay video có âm thanh.
Video autoplay phải muted.
Tối ưu font bằng next/font.
Tránh bundle animation quá lớn.
Tránh layout shift.
Dùng next/image.
Cache ảnh tĩnh.
Cache Payload query hợp lý.
Revalidate khi admin publish nội dung.

Mục tiêu:

Lighthouse Performance >= 85
SEO >= 95
Accessibility >= 90
Best Practices >= 90 18. Animation

Dùng Motion cho:

Fade/slide reveal.
Hover card.
Menu transition.
Header state.
Image reveal.
Counter animation.
Page transition nhẹ.

Không dùng animation quá nhiều.

Tôn trọng:

@media (prefers-reduced-motion: reduce)

Không để animation làm nội dung biến mất nếu JavaScript lỗi.

19. Admin UX

Admin Homepage nên chia thành tab hoặc accordion:

SEO
Hero
About
Featured Projects
Categories
Services
Statistics
Clients
Stories
Contact

Mỗi phần có:

Bật/tắt section
Tab VI
Tab EN
Media picker
Preview
Save draft
Publish

Admin không được chỉnh:

Font.
Màu.
Margin.
Grid.
Animation.
CSS.
HTML tùy ý.

Admin chỉ quản lý dữ liệu theo schema.

20. Authentication và roles

Giai đoạn đầu tạo collection:

Users

Roles:

super-admin
editor
viewer

Quyền:

Super Admin
Toàn quyền.
Quản lý user.
Quản lý cấu hình.
Xóa media.
Publish.
Editor
Sửa nội dung.
Upload media.
Save draft.
Publish.
Không quản lý user hệ thống.
Viewer
Chỉ xem admin.
Không được sửa. 21. Draft, version và publish

Bật Payload Versions cho Homepage và các collection nội dung.

Hỗ trợ:

Draft
Published
Version history
Restore version
Preview

Không hiển thị nội dung draft trên website public.

Khi publish:

Invalidate cache
Revalidate homepage locale tương ứng 22. Contact Requests

Có thể tạo collection:

ContactRequests

Fields:

name
company
email
phone
project type
budget
timeline
message
locale
status
createdAt

Status:

new
contacted
in-progress
closed
spam

Public form cần:

Zod validation.
Server-side validation.
Rate limiting.
Honeypot.
Không để lộ API secret.
Thông báo lỗi song ngữ. 23. Docker Compose

Docker Compose tối thiểu:

app
postgres
caddy

Yêu cầu:

PostgreSQL dùng persistent volume.
Uploads dùng bind mount ngoài container.
.env không commit.
Có healthcheck.
Có restart policy.
App không chạy bằng root nếu có thể.
Caddy cấp HTTPS tự động. 24. Backup

Phải backup:

PostgreSQL

- /var/www/highlight-media/uploads

Gợi ý:

7 bản hằng ngày
4 bản hằng tuần
3 bản hằng tháng

Không được chỉ backup database vì database không chứa file ảnh.

25. Coding conventions
    TypeScript strict mode.
    Không dùng any nếu không cần thiết.
    Tách component theo trách nhiệm.
    Component homepage không chứa hardcoded content.
    Nội dung luôn lấy từ Payload hoặc file dịch.
    Validation dùng Zod.
    Dùng absolute import alias.
    Có error boundary.
    Có empty state.
    Có loading state.
    Có fallback image.
    Có fallback locale.
    Không để secret ở client.
    Không query database trực tiếp trong client component.
    Ưu tiên Payload Local API ở server-side.
    Tránh duplicate type.
    Generate Payload types.
    Chạy lint và type-check trước khi hoàn thành.
26. Quy tắc triển khai theo giai đoạn
    Phase 1 — Foundation
    Initialize Next.js + Payload
    Configure PostgreSQL
    Configure TypeScript
    Configure Tailwind
    Configure next-intl
    Configure Payload localization
    Configure authentication
    Configure Docker
    Configure Caddy
    Phase 2 — Media
    Create Media collection
    Configure local VPS upload
    Configure image sizes
    Configure alt/caption localized fields
    Configure upload validation
    Phase 3 — Homepage CMS
    Create Homepage Global
    Create Header Global
    Create Footer Global
    Create SiteSettings Global
    Configure draft/version
    Configure preview
    Phase 4 — Homepage Frontend
    Header
    Hero
    About
    Featured Projects
    Categories
    Services
    Statistics
    Clients
    Stories
    Contact
    Footer
    Phase 5 — SEO and Performance
    Metadata
    hreflang
    sitemap
    robots
    structured data
    responsive images
    lazy loading
    cache/revalidation
    accessibility
    Phase 6 — Deployment
    Docker image
    Docker Compose
    Persistent PostgreSQL
    Persistent uploads
    Caddy HTTPS
    Environment variables
    Backup scripts
    Production README
27. Definition of Done

Giai đoạn trang chủ được coi là hoàn thành khi:

/vi hiển thị đúng nội dung tiếng Việt.
/en hiển thị đúng nội dung English.
Người quản trị đăng nhập được tại /admin.
Admin sửa được toàn bộ text trang chủ.
Admin thay được ảnh Hero, About, Clients và các card.
Admin bật/tắt từng section.
Admin sắp xếp được item.
Có Draft và Publish.
Publish xong frontend cập nhật.
Ảnh được lưu bền vững trên VPS.
Rebuild container không mất ảnh.
PostgreSQL có persistent volume.
Header responsive.
Website hoạt động tốt trên desktop, tablet và mobile.
Metadata thay đổi theo locale.
Có sitemap và robots.
Có alt text ảnh.
Không có lỗi TypeScript.
Không có lỗi lint nghiêm trọng.
Có .env.example.
Có hướng dẫn deploy.
Có hướng dẫn backup và restore. 28. Việc chưa làm trong giai đoạn này

Không tự triển khai thêm nếu chưa được yêu cầu:

Full Projects module
Project category pages
Project detail builder
Blog system hoàn chỉnh
CRM
Payment
Client account
Private gallery
Advanced analytics
AI generation
Automatic translation

Chỉ chuẩn bị kiến trúc để bổ sung sau.

29. Yêu cầu dành cho Codex

Thực hiện theo nguyên tắc:

1. Đọc toàn bộ context trước khi code.
2. Không tự ý thay đổi tech stack.
3. Không dùng Cloudflare R2.
4. Ảnh phải lưu trên VPS bằng persistent bind mount.
5. Không hardcode nội dung homepage.
6. Mọi nội dung thay đổi phải quản lý được từ Payload Admin.
7. Hỗ trợ vi/en ngay từ schema đầu tiên.
8. Ưu tiên Server Components.
9. Tạo code production-ready, không chỉ demo.
10. Mỗi phase hoàn thành phải chạy lint, type-check và build.

Trước khi triển khai, hãy:

- Đề xuất file/folder structure.
- Liệt kê package cần cài.
- Liệt kê biến môi trường.
- Liệt kê Payload Globals và Collections.
- Liệt kê homepage sections.
- Sau đó mới bắt đầu code theo từng phase.

Không viết toàn bộ dự án trong một bước. Triển khai tuần tự, mỗi bước phải giữ project ở trạng thái chạy được.

## Implementation documentation

- [Phase 1 — Foundation](docs/PHASE_1.md)
- [Phase 2 — Media Management](docs/PHASE_2_MEDIA.md)
- [Phase 3 — Homepage CMS, Header, Footer, and Site Settings](docs/PHASE_3_HOMEPAGE_CMS.md)
