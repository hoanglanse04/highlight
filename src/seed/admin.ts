import { getPayload } from 'payload'

import configPromise from '@/payload.config'

const DEFAULT_ADMIN_EMAIL = 'admin@highlightmedia.vn'
const DEFAULT_ADMIN_NAME = 'Highlight Admin'

function requiredPassword(): string {
  const password = process.env.ADMIN_PASSWORD

  if (!password || password.length < 8) {
    throw new Error(
      'ADMIN_PASSWORD là bắt buộc và phải có ít nhất 8 ký tự.',
    )
  }

  return password
}

async function seedAdmin(): Promise<void> {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'users',
      limit: 2,
      overrideAccess: true,
      pagination: false,
      sort: 'id',
    })

    if (result.docs.length > 1) {
      throw new Error(
        `Phát hiện ${result.docs.length} tài khoản. Seeder không tự xóa người dùng; hãy kiểm tra dữ liệu trước.`,
      )
    }

    const password = requiredPassword()
    const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const configuredName = process.env.ADMIN_NAME?.trim()
    const existingAdmin = result.docs[0]

    if (existingAdmin) {
      const admin = await payload.update({
        collection: 'users',
        id: existingAdmin.id,
        data: {
          password,
          role: 'super-admin',
          ...(configuredEmail ? { email: configuredEmail } : {}),
          ...(configuredName ? { name: configuredName } : {}),
        },
        overrideAccess: true,
      })

      payload.logger.info(
        `Đã cập nhật tài khoản quản trị duy nhất: ${admin.email}`,
      )
      return
    }

    const admin = await payload.create({
      collection: 'users',
      data: {
        email: configuredEmail || DEFAULT_ADMIN_EMAIL,
        name: configuredName || DEFAULT_ADMIN_NAME,
        password,
        role: 'super-admin',
      },
      overrideAccess: true,
    })

    payload.logger.info(
      `Đã tạo tài khoản quản trị duy nhất: ${admin.email}`,
    )
  } finally {
    await payload.destroy()
  }
}

await seedAdmin()
