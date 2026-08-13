import type {
  Footer,
  Header,
  Homepage,
  ProjectCategory,
  SiteSetting,
} from '@/payload-types'

import type { SeedConfig } from './env'

export type SeedLocale = 'en' | 'vi'
export type SeedStatus = 'draft' | 'published'

export type HeroMedia =
  | {
      imageID: number
      type: 'image'
    }
  | {
      posterID: number
      type: 'externalVideo'
      videoURL: string
    }
  | null

export type CategorySeedDefinition = {
  displayOrder: number
  iconKey:
    | 'artist'
    | 'automotive'
    | 'beauty'
    | 'behind-the-scenes'
    | 'corporate'
    | 'event'
    | 'social'
    | 'sports'
    | 'travel'
  internalName: string
  shortDescription: Record<SeedLocale, string>
  slug: string
  title: Record<SeedLocale, string>
}

type GlobalSeedData<T extends { id: number }> = Omit<
  T,
  'createdAt' | 'id' | 'updatedAt'
>

const localeCopy = {
  en: {
    about: {
      description:
        'Highlight Media is a visual production team focused on commercials, branded films, events, music, sports and digital content. Every project receives a tailored process that balances creative thinking, visual quality and communication goals.',
      eyebrow: 'About us',
      highlight:
        'We believe effective production should do more than look beautiful—it should express the brand clearly and connect with its audience.',
      title: 'Creative by direction. Crafted with purpose.',
    },
    contact: {
      cta: 'Start a conversation',
      description:
        'Tell Highlight Media about your brand, goals and the story you want to create. We will help shape the right production approach.',
      eyebrow: 'Start a project',
      title: 'Have an idea ready to take shape?',
    },
    featuredProjects: {
      description:
        'Explore selected work produced by Highlight Media across different industries and formats.',
      eyebrow: 'Selected work',
      title: 'Stories shaped through moving images',
    },
    footerDescription:
      'Highlight Media is a creative production house producing films, photography and visual content for brands, events and digital platforms.',
    hero: {
      description:
        'From creative development to production and post-production, Highlight Media works with brands to create focused, cinematic and meaningful visual experiences.',
      primaryCTA: 'Explore our work',
      secondaryCTA: 'Start a conversation',
      title: 'We turn ideas into visual stories that move',
    },
    projectCategories: {
      description:
        'Explore the fields and formats that shape Highlight Media’s visual production work.',
      eyebrow: 'Production fields',
      title: 'Ideas shaped for every screen',
    },
    seo: {
      metaDescription:
        'Highlight Media produces commercials, branded films, events, music videos and digital content through a focused creative process and cinematic execution.',
      metaTitle: 'Highlight Media – Creative Production House',
      ogDescription:
        'Explore films, visual stories and creative content produced by Highlight Media.',
      ogTitle: 'Highlight Media – Bringing Ideas to Life',
    },
    services: {
      description:
        'Flexible production capabilities built around the needs, format and audience of every project.',
      eyebrow: 'What we do',
      title: 'Production from concept to final frame',
    },
    statistics: {
      clients: 'Clients',
      description:
        'Verified milestones from Highlight Media’s production journey.',
      eyebrow: 'Our journey',
      projects: 'Projects delivered',
      title: 'Experience measured through the work',
      years: 'Years of experience',
    },
    stories: {
      description:
        'A closer look at the preparation, production process and moments behind each project.',
      eyebrow: 'Behind the scenes',
      title: 'Stories behind every frame',
    },
  },
  vi: {
    about: {
      description:
        'Highlight Media là đội ngũ sản xuất nội dung hình ảnh tập trung vào TVC, phim thương hiệu, sự kiện, âm nhạc, thể thao và nội dung số. Mỗi dự án được tiếp cận bằng một quy trình riêng, cân bằng giữa ý tưởng, chất lượng hình ảnh và mục tiêu truyền thông.',
      eyebrow: 'Về chúng tôi',
      highlight:
        'Chúng tôi tin rằng một sản phẩm tốt không chỉ đẹp về hình ảnh mà còn phải truyền tải đúng tinh thần của thương hiệu và tạo được kết nối với người xem.',
      title: 'Sáng tạo có định hướng. Sản xuất có chiều sâu.',
    },
    contact: {
      cta: 'Trao đổi cùng chúng tôi',
      description:
        'Hãy chia sẻ với Highlight Media về thương hiệu, mục tiêu và câu chuyện bạn muốn kể. Chúng tôi sẽ cùng bạn tìm ra hướng sản xuất phù hợp.',
      eyebrow: 'Bắt đầu một dự án',
      title: 'Bạn có một ý tưởng cần được hiện thực hóa?',
    },
    featuredProjects: {
      description:
        'Khám phá các dự án được Highlight Media thực hiện qua nhiều lĩnh vực và định dạng khác nhau.',
      eyebrow: 'Dự án tiêu biểu',
      title: 'Những câu chuyện được kể bằng hình ảnh',
    },
    footerDescription:
      'Highlight Media là creative production house chuyên sản xuất phim, hình ảnh và nội dung sáng tạo cho thương hiệu, sự kiện và nền tảng số.',
    hero: {
      description:
        'Từ ý tưởng sáng tạo đến sản xuất và hậu kỳ, Highlight Media đồng hành cùng thương hiệu để tạo nên những câu chuyện hình ảnh rõ nét, giàu cảm xúc và đúng mục tiêu.',
      primaryCTA: 'Xem dự án',
      secondaryCTA: 'Trao đổi cùng chúng tôi',
      title: 'Chúng tôi biến ý tưởng thành những thước phim có sức lan tỏa',
    },
    projectCategories: {
      description:
        'Khám phá những lĩnh vực và định dạng tạo nên năng lực sản xuất hình ảnh của Highlight Media.',
      eyebrow: 'Lĩnh vực sản xuất',
      title: 'Ý tưởng phù hợp cho mọi màn hình',
    },
    seo: {
      metaDescription:
        'Highlight Media sản xuất TVC, video thương hiệu, sự kiện, âm nhạc và nội dung số với quy trình sáng tạo, hình ảnh chỉn chu và giải pháp phù hợp từng dự án.',
      metaTitle: 'Highlight Media – Creative Production House',
      ogDescription:
        'Khám phá các dự án phim, hình ảnh và nội dung sáng tạo được thực hiện bởi Highlight Media.',
      ogTitle: 'Highlight Media – Biến ý tưởng thành hình ảnh',
    },
    services: {
      description:
        'Năng lực sản xuất linh hoạt, được xây dựng theo nhu cầu, định dạng và đối tượng của từng dự án.',
      eyebrow: 'Dịch vụ',
      title: 'Đồng hành từ ý tưởng đến khung hình cuối',
    },
    statistics: {
      clients: 'Khách hàng',
      description:
        'Những dấu mốc đã được xác thực trong hành trình sản xuất của Highlight Media.',
      eyebrow: 'Hành trình',
      projects: 'Dự án đã thực hiện',
      title: 'Kinh nghiệm được đo bằng những sản phẩm thực tế',
      years: 'Năm kinh nghiệm',
    },
    stories: {
      description:
        'Góc nhìn về quá trình chuẩn bị, sản xuất và những khoảnh khắc tạo nên một dự án.',
      eyebrow: 'Hậu trường',
      title: 'Câu chuyện phía sau mỗi khung hình',
    },
  },
} as const

const serviceDefinitions = [
  {
    description: {
      en: 'End-to-end production for commercials, branded films and digital video content.',
      vi: 'Sản xuất TVC, phim thương hiệu và nội dung video từ tiền kỳ đến hậu kỳ.',
    },
    iconKey: 'video',
    internalName: 'video-production',
    title: { en: 'Video Production', vi: 'Sản xuất video' },
  },
  {
    description: {
      en: 'Brand, product, event and campaign photography with a consistent visual direction.',
      vi: 'Hình ảnh thương hiệu, sản phẩm, sự kiện và chiến dịch truyền thông.',
    },
    iconKey: 'camera',
    internalName: 'photography',
    title: { en: 'Photography', vi: 'Nhiếp ảnh' },
  },
  {
    description: {
      en: 'Editing, color grading, sound and finishing shaped around the intended viewing experience.',
      vi: 'Dựng phim, chỉnh màu, âm thanh và hoàn thiện theo trải nghiệm xem mong muốn.',
    },
    iconKey: 'editing',
    internalName: 'post-production',
    title: { en: 'Post-production', vi: 'Hậu kỳ' },
  },
  {
    description: {
      en: 'Aerial imagery designed to add scale, movement and a fresh perspective to each story.',
      vi: 'Hình ảnh trên không giúp mở rộng quy mô, chuyển động và góc nhìn cho câu chuyện.',
    },
    iconKey: 'drone',
    internalName: 'drone-filming',
    title: { en: 'Drone Filming', vi: 'Quay flycam' },
  },
  {
    description: {
      en: 'Agile event crews focused on key moments, atmosphere and fast delivery.',
      vi: 'Đội ngũ sự kiện linh hoạt, tập trung vào khoảnh khắc, không khí và tiến độ bàn giao.',
    },
    iconKey: 'event',
    internalName: 'event-coverage',
    title: { en: 'Event Coverage', vi: 'Ghi hình sự kiện' },
  },
  {
    description: {
      en: 'Creative development that connects the core message with a clear visual direction.',
      vi: 'Phát triển ý tưởng kết nối thông điệp cốt lõi với định hướng hình ảnh rõ ràng.',
    },
    iconKey: 'creative',
    internalName: 'creative-concept',
    title: { en: 'Creative Concept', vi: 'Ý tưởng sáng tạo' },
  },
  {
    description: {
      en: 'Platform-aware short-form content designed for attention, clarity and repeatable production.',
      vi: 'Nội dung ngắn phù hợp nền tảng, tập trung vào khả năng thu hút và sản xuất nhất quán.',
    },
    iconKey: 'social',
    internalName: 'social-content',
    title: { en: 'Social Content', vi: 'Nội dung mạng xã hội' },
  },
  {
    description: {
      en: 'Reliable multi-camera livestream production for events, launches and digital audiences.',
      vi: 'Sản xuất livestream đa máy quay cho sự kiện, ra mắt và khán giả trên nền tảng số.',
    },
    iconKey: 'livestream',
    internalName: 'livestream',
    title: { en: 'Livestream', vi: 'Phát trực tiếp' },
  },
] as const

export const categorySeedDefinitions: CategorySeedDefinition[] = [
  {
    displayOrder: 10,
    iconKey: 'event',
    internalName: 'Events',
    shortDescription: {
      en: 'Event films focused on atmosphere, people and the moments that define the experience.',
      vi: 'Phim sự kiện tập trung vào không khí, con người và những khoảnh khắc tạo nên trải nghiệm.',
    },
    slug: 'events',
    title: { en: 'Events', vi: 'Sự kiện' },
  },
  {
    displayOrder: 20,
    iconKey: 'corporate',
    internalName: 'TVC & Corporate',
    shortDescription: {
      en: 'Commercials and corporate films built around a clear brand message.',
      vi: 'TVC và phim doanh nghiệp được phát triển từ thông điệp thương hiệu rõ ràng.',
    },
    slug: 'tvc-corporate',
    title: { en: 'TVC & Corporate', vi: 'TVC & Doanh nghiệp' },
  },
  {
    displayOrder: 30,
    iconKey: 'sports',
    internalName: 'Sports',
    shortDescription: {
      en: 'Dynamic sports content shaped through movement, energy and human performance.',
      vi: 'Nội dung thể thao giàu chuyển động, năng lượng và tinh thần của con người.',
    },
    slug: 'sports',
    title: { en: 'Sports', vi: 'Thể thao' },
  },
  {
    displayOrder: 40,
    iconKey: 'social',
    internalName: 'Social & Viral',
    shortDescription: {
      en: 'Fast, focused stories designed for social platforms and digital audiences.',
      vi: 'Câu chuyện ngắn gọn, rõ nét dành cho mạng xã hội và khán giả số.',
    },
    slug: 'social-viral',
    title: { en: 'Social & Viral', vi: 'Nội dung mạng xã hội' },
  },
  {
    displayOrder: 50,
    iconKey: 'artist',
    internalName: 'Artist Focuscam',
    shortDescription: {
      en: 'Performance-focused coverage that follows the artist, emotion and stage energy.',
      vi: 'Ghi hình tập trung vào nghệ sĩ, cảm xúc biểu diễn và năng lượng sân khấu.',
    },
    slug: 'artist-focuscam',
    title: { en: 'Artist Focuscam', vi: 'Focuscam nghệ sĩ' },
  },
  {
    displayOrder: 60,
    iconKey: 'automotive',
    internalName: 'Automotive',
    shortDescription: {
      en: 'Automotive imagery crafted around form, motion, engineering and experience.',
      vi: 'Hình ảnh ô tô khai thác thiết kế, chuyển động, công nghệ và trải nghiệm.',
    },
    slug: 'automotive',
    title: { en: 'Automotive', vi: 'Ô tô' },
  },
  {
    displayOrder: 70,
    iconKey: 'travel',
    internalName: 'Travel & Tour',
    shortDescription: {
      en: 'Destination stories that connect place, culture and the feeling of discovery.',
      vi: 'Câu chuyện điểm đến kết nối không gian, văn hóa và cảm giác khám phá.',
    },
    slug: 'travel-tour',
    title: { en: 'Travel & Tour', vi: 'Du lịch' },
  },
  {
    displayOrder: 80,
    iconKey: 'beauty',
    internalName: 'Beauty',
    shortDescription: {
      en: 'Refined beauty visuals with careful lighting, texture and art direction.',
      vi: 'Hình ảnh làm đẹp được xử lý chỉn chu về ánh sáng, chất liệu và mỹ thuật.',
    },
    slug: 'beauty',
    title: { en: 'Beauty', vi: 'Làm đẹp' },
  },
  {
    displayOrder: 90,
    iconKey: 'behind-the-scenes',
    internalName: 'Behind the Scenes',
    shortDescription: {
      en: 'Honest production moments and the collaborative process behind the final frame.',
      vi: 'Những khoảnh khắc chân thực và quá trình cộng tác phía sau khung hình hoàn chỉnh.',
    },
    slug: 'behind-the-scenes',
    title: { en: 'Behind the Scenes', vi: 'Hậu trường' },
  },
]

function rowID(value: unknown): { id: string } | Record<string, never> {
  return typeof value === 'string' && value ? { id: value } : {}
}

function relationshipID(value: unknown): number | null {
  if (typeof value === 'number') return value
  if (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'number'
  ) {
    return value.id
  }
  return null
}

function existingRowByInternalName<T extends { id?: string | null; internalName: string }>(
  rows: T[] | null | undefined,
  internalName: string,
): T | undefined {
  return rows?.find((row) => row.internalName === internalName)
}

export function buildSiteSettingsData(
  locale: SeedLocale,
  config: SeedConfig,
  status: SeedStatus,
  existing?: SiteSetting | null,
): GlobalSeedData<SiteSetting> {
  const socialSources = [
    ['facebook', 'Facebook', config.HIGHLIGHT_FACEBOOK_URL],
    ['instagram', 'Instagram', config.HIGHLIGHT_INSTAGRAM_URL],
    ['tiktok', 'TikTok', config.HIGHLIGHT_TIKTOK_URL],
    ['youtube', 'YouTube', config.HIGHLIGHT_YOUTUBE_URL],
    ['vimeo', 'Vimeo', config.HIGHLIGHT_VIMEO_URL],
    ['linkedin', 'LinkedIn', config.HIGHLIGHT_LINKEDIN_URL],
    ['behance', 'Behance', config.HIGHLIGHT_BEHANCE_URL],
  ] as const
  const socialLinks = socialSources.flatMap(([platform, label, url], index) => {
    if (!url) return []
    const previous = existing?.social?.socialLinks?.find(
      (item) => item.platform === platform,
    )
    return [
      {
        ...rowID(previous?.id),
        displayOrder: (index + 1) * 10,
        enabled: true,
        label,
        platform,
        url,
      },
    ]
  })

  return {
    _status: status,
    brand: {
      defaultLocale: 'vi',
      fallbackLocale: 'vi',
      legalName: config.HIGHLIGHT_LEGAL_NAME,
      siteName: 'Highlight Media',
    },
    contact: {
      address:
        locale === 'vi'
          ? config.HIGHLIGHT_ADDRESS_VI
          : config.HIGHLIGHT_ADDRESS_EN,
      email: config.HIGHLIGHT_EMAIL,
      phone: config.HIGHLIGHT_PHONE,
    },
    seoDefaults: {
      defaultMetaDescription: localeCopy[locale].seo.metaDescription,
      defaultMetaTitle: localeCopy[locale].seo.metaTitle,
    },
    social: {
      socialLinks,
    },
    system: {
      defaultContactCTAURL: '/#contact',
      maintenanceMode: false,
    },
  }
}

export function buildHeaderData(
  locale: SeedLocale,
  status: SeedStatus,
  existing?: Header | null,
): GlobalSeedData<Header> {
  const labels =
    locale === 'vi'
      ? {
          about: 'Giới thiệu',
          contact: 'Liên hệ',
          projects: 'Dự án',
          services: 'Dịch vụ',
          stories: 'Câu chuyện',
        }
      : {
          about: 'About',
          contact: 'Contact',
          projects: 'Work',
          services: 'Services',
          stories: 'Stories',
        }
  const previousRows = existing?.navigation?.items
  const navigationItems = [
    {
      enabled: true,
      internalName: 'about',
      label: labels.about,
      openInNewTab: false,
      url: '/#about',
    },
    {
      enabled: true,
      internalName: 'projects',
      label: labels.projects,
      openInNewTab: false,
      url: '/projects',
    },
    {
      enabled: true,
      internalName: 'services',
      label: labels.services,
      openInNewTab: false,
      url: '/#services',
    },
    {
      enabled: false,
      internalName: 'stories',
      label: labels.stories,
      openInNewTab: false,
      url: '/#stories',
    },
    {
      enabled: true,
      internalName: 'contact',
      label: labels.contact,
      openInNewTab: false,
      url: '/#contact',
    },
  ].map((item, index) => ({
    ...rowID(existingRowByInternalName(previousRows, item.internalName)?.id),
    ...item,
    displayOrder: (index + 1) * 10,
  }))

  return {
    _status: status,
    branding: {
      showLanguageSwitcher: true,
      sticky: true,
      transparentOnHero: true,
    },
    cta: {
      button: {
        enabled: true,
        label: locale === 'vi' ? 'Bắt đầu dự án' : 'Start a project',
        openInNewTab: false,
        url: '/#contact',
      },
    },
    navigation: {
      items: navigationItems,
    },
  }
}

export function buildFooterData(
  locale: SeedLocale,
  config: SeedConfig,
  status: SeedStatus,
  existing?: Footer | null,
): GlobalSeedData<Footer> {
  const existingColumn = existing?.navigation?.columns?.[0]
  const existingLinks = existingColumn?.links
  const linkCopy =
    locale === 'vi'
      ? [
          ['Giới thiệu', '/#about'],
          ['Dự án', '/projects'],
          ['Dịch vụ', '/#services'],
          ['Liên hệ', '/#contact'],
        ]
      : [
          ['About', '/#about'],
          ['Work', '/projects'],
          ['Services', '/#services'],
          ['Contact', '/#contact'],
        ]

  return {
    _status: status,
    branding: {
      shortDescription: localeCopy[locale].footerDescription,
    },
    contact: {
      address:
        locale === 'vi'
          ? config.HIGHLIGHT_ADDRESS_VI
          : config.HIGHLIGHT_ADDRESS_EN,
      email: config.HIGHLIGHT_EMAIL,
      phone: config.HIGHLIGHT_PHONE,
    },
    legal: {
      copyright:
        locale === 'vi'
          ? `© ${new Date().getFullYear()} Highlight Media. Bảo lưu mọi quyền.`
          : `© ${new Date().getFullYear()} Highlight Media. All rights reserved.`,
    },
    navigation: {
      columns: [
        {
          ...rowID(existingColumn?.id),
          links: linkCopy.map(([label, url], index) => ({
            ...rowID(existingLinks?.[index]?.id),
            displayOrder: (index + 1) * 10,
            enabled: true,
            label,
            openInNewTab: false,
            url,
          })),
          title: locale === 'vi' ? 'Khám phá' : 'Explore',
        },
      ],
    },
  }
}

type HomepageDataArgs = {
  aboutMediaIDs: number[]
  categoryIDs: number[]
  config: SeedConfig
  existing?: Homepage | null
  heroMedia: HeroMedia
  locale: SeedLocale
  projectIDs: number[]
  status: SeedStatus
}

export function buildHomepageData({
  aboutMediaIDs,
  categoryIDs,
  config,
  existing,
  heroMedia,
  locale,
  projectIDs,
  status,
}: HomepageDataArgs): GlobalSeedData<Homepage> {
  const copy = localeCopy[locale]
  const existingGallery = existing?.about?.gallery
  const existingServices = existing?.services?.items
  const existingStatistics = existing?.statistics?.items
  const statisticsEnabled = [
    config.HIGHLIGHT_YEARS_EXPERIENCE,
    config.HIGHLIGHT_PROJECTS_DELIVERED,
    config.HIGHLIGHT_CLIENTS_COUNT,
  ].every((value) => value !== undefined)
  const statistics = statisticsEnabled
    ? [
        {
          label: copy.statistics.years,
          suffix: '+',
          value: config.HIGHLIGHT_YEARS_EXPERIENCE ?? 0,
        },
        {
          label: copy.statistics.projects,
          suffix: '+',
          value: config.HIGHLIGHT_PROJECTS_DELIVERED ?? 0,
        },
        {
          label: copy.statistics.clients,
          suffix: '+',
          value: config.HIGHLIGHT_CLIENTS_COUNT ?? 0,
        },
      ].map((item, index) => ({
        ...rowID(existingStatistics?.[index]?.id),
        ...item,
        displayOrder: (index + 1) * 10,
        enabled: true,
      }))
    : []
  const hero =
    heroMedia?.type === 'externalVideo'
      ? {
          externalVideoURL: heroMedia.videoURL,
          mediaType: 'externalVideo' as const,
          posterImage: heroMedia.posterID,
        }
      : {
          backgroundImage:
            heroMedia?.type === 'image' ? heroMedia.imageID : undefined,
          mediaType: 'image' as const,
        }

  return {
    _status: status,
    about: {
      cta: {
        label: locale === 'vi' ? 'Khám phá dịch vụ' : 'Explore our services',
        openInNewTab: false,
        url: '/#services',
      },
      description: copy.about.description,
      enabled: true,
      eyebrow: copy.about.eyebrow,
      gallery: aboutMediaIDs.map((imageID) => {
        const previous = existingGallery?.find(
          (item) => relationshipID(item.image) === imageID,
        )
        return {
          ...rowID(previous?.id),
          image: imageID,
        }
      }),
      highlightText: copy.about.highlight,
      mainImage: aboutMediaIDs[0],
      title: copy.about.title,
    },
    clients: {
      description:
        locale === 'vi'
          ? 'Các thương hiệu đồng hành cùng Highlight Media sẽ được cập nhật sau khi logo và quyền sử dụng được xác nhận.'
          : 'Highlight Media’s client list will be enabled after logos and usage rights are confirmed.',
      enabled: false,
      eyebrow: locale === 'vi' ? 'Khách hàng' : 'Clients',
      items: [],
      title:
        locale === 'vi'
          ? 'Những mối quan hệ được xây dựng qua từng dự án'
          : 'Relationships built through every project',
    },
    contactCTA: {
      address:
        locale === 'vi'
          ? config.HIGHLIGHT_ADDRESS_VI
          : config.HIGHLIGHT_ADDRESS_EN,
      cta: {
        label: copy.contact.cta,
        openInNewTab: false,
        url: '/#contact',
      },
      description: copy.contact.description,
      email: config.HIGHLIGHT_EMAIL,
      enabled: true,
      eyebrow: copy.contact.eyebrow,
      phone: config.HIGHLIGHT_PHONE,
      title: copy.contact.title,
    },
    featuredProjects: {
      collectionFilterFeatured: false,
      collectionLimit: 8,
      description: copy.featuredProjects.description,
      enabled: projectIDs.length > 0,
      eyebrow: copy.featuredProjects.eyebrow,
      items: [],
      selectedProjects: projectIDs,
      sourceMode: 'projectCollection',
      title: copy.featuredProjects.title,
    },
    hero: {
      ...hero,
      description: copy.hero.description,
      enabled: true,
      eyebrow: 'Highlight Media',
      primaryCTA: {
        label: copy.hero.primaryCTA,
        openInNewTab: false,
        url: '/projects',
      },
      secondaryCTA: {
        label: copy.hero.secondaryCTA,
        openInNewTab: false,
        url: '/#contact',
      },
      showScrollIndicator: true,
      title: copy.hero.title,
    },
    projectCategories: {
      collectionLimit: 9,
      description: copy.projectCategories.description,
      enabled: categoryIDs.length > 0,
      eyebrow: copy.projectCategories.eyebrow,
      items: [],
      selectedCategories: categoryIDs,
      sourceMode: 'categoryCollection',
      title: copy.projectCategories.title,
    },
    seo: {
      metaDescription: copy.seo.metaDescription,
      metaTitle: copy.seo.metaTitle,
      noIndex: false,
      ogDescription: copy.seo.ogDescription,
      ogTitle: copy.seo.ogTitle,
    },
    services: {
      description: copy.services.description,
      enabled: true,
      eyebrow: copy.services.eyebrow,
      items: serviceDefinitions.map((service, index) => ({
        ...rowID(
          existingRowByInternalName(
            existingServices,
            service.internalName,
          )?.id,
        ),
        description: service.description[locale],
        displayOrder: (index + 1) * 10,
        enabled: true,
        iconKey: service.iconKey,
        internalName: service.internalName,
        title: service.title[locale],
      })),
      title: copy.services.title,
    },
    statistics: {
      description: copy.statistics.description,
      enabled: statisticsEnabled,
      eyebrow: copy.statistics.eyebrow,
      items: statistics,
      title: copy.statistics.title,
    },
    stories: {
      description: copy.stories.description,
      enabled: false,
      eyebrow: copy.stories.eyebrow,
      items: [],
      title: copy.stories.title,
    },
  }
}

export function buildProjectCategoryData(
  definition: CategorySeedDefinition,
  locale: SeedLocale,
  coverImage: number | undefined,
  status: SeedStatus,
): Omit<
  ProjectCategory,
  'coverImage' | 'createdAt' | 'id' | 'updatedAt'
> & {
  coverImage?: ProjectCategory['coverImage']
} {
  return {
    _status: status,
    adminNotes:
      'Được tạo bởi Highlight content seeder. Kiểm tra Media và cả hai locale trước khi publish.',
    coverImage,
    displayOrder: definition.displayOrder,
    enabled: true,
    featured: definition.displayOrder <= 30,
    iconKey: definition.iconKey,
    internalName: definition.internalName,
    seo: {
      metaDescription: definition.shortDescription[locale],
      metaTitle: definition.title[locale],
      noIndex: false,
    },
    shortDescription: definition.shortDescription[locale],
    slug: definition.slug,
    title: definition.title[locale],
  }
}
