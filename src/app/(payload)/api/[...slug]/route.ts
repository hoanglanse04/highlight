/* THIS FILE FOLLOWS THE PAYLOAD-GENERATED APP ROUTER CONTRACT. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)

const payloadPOST = REST_POST(config)

type RouteArguments = {
  params: Promise<{
    slug?: string[]
  }>
}

export async function POST(
  request: Request,
  arguments_: RouteArguments,
): Promise<Response> {
  const params = await arguments_.params

  if (
    params.slug?.[0] === 'users' &&
    params.slug?.[1] === 'first-register'
  ) {
    return Response.json(
      {
        errors: [
          {
            message:
              'Đăng ký tài khoản đã bị tắt. Tài khoản quản trị chỉ được tạo bằng seeder trên máy chủ.',
          },
        ],
      },
      { status: 403 },
    )
  }

  return payloadPOST(request, {
    params: Promise.resolve(params),
  })
}
