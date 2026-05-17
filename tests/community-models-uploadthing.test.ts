const mockGetAuthUser = jest.fn()
const mockCreateRouteHandler = jest.fn(() => ({
  GET: 'GET_HANDLER',
  POST: 'POST_HANDLER',
}))
const mockRouteBuilder = {
  middleware: jest.fn(),
  onUploadComplete: jest.fn(),
}
const mockCreateUploadthing = jest.fn(() =>
  jest.fn(() => {
    mockRouteBuilder.middleware.mockImplementation((middlewareFn) => {
      mockCapturedMiddleware = middlewareFn
      return mockRouteBuilder
    })
    mockRouteBuilder.onUploadComplete.mockImplementation((uploadCompleteFn) => {
      mockCapturedUploadComplete = uploadCompleteFn
      return { route: 'imageUploader' }
    })
    return mockRouteBuilder
  })
)
let mockCapturedMiddleware: ((args: { req: Request }) => Promise<{ userId: string }>) | undefined
let mockCapturedUploadComplete:
  | ((args: { metadata: { userId: string }; file: { url: string } }) => Promise<{ uploadedBy: string }>)
  | undefined

class MockSchema {
  static Types = {
    ObjectId: 'ObjectId',
    Mixed: 'Mixed',
  }

  private definition: Record<string, any>
  private schemaIndexes: Array<[Record<string, unknown>, Record<string, unknown>]> = []

  constructor(definition: Record<string, any>) {
    this.definition = definition
  }

  index(fields: Record<string, unknown>, options: Record<string, unknown> = {}) {
    this.schemaIndexes.push([fields, options])
  }

  indexes() {
    return this.schemaIndexes
  }

  path(pathName: string) {
    const value = pathName.split('.').reduce<any>((current, part) => current?.[part], this.definition)
    if (!value) return undefined
    if (value.enum) return { enumValues: value.enum }
    return value
  }
}

const mockModel = jest.fn((name: string, schema: MockSchema) => ({
  modelName: name,
  schema,
}))

jest.mock('@/lib/auth-user', () => ({
  getAuthUser: mockGetAuthUser,
}))

jest.mock('mongoose', () => ({
  __esModule: true,
  default: {
    models: {},
  },
  Schema: MockSchema,
  model: mockModel,
}))

jest.mock('uploadthing/next', () => ({
  createUploadthing: mockCreateUploadthing,
  createRouteHandler: mockCreateRouteHandler,
}))

jest.mock('uploadthing/server', () => ({
  UploadThingError: class UploadThingError extends Error {},
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockCapturedMiddleware = undefined
  mockCapturedUploadComplete = undefined
})

test('User model exposes onboarding and public location fields required by community profiles', async () => {
  const { User } = await import('@/models/User')

  expect(User.schema.path('onboardingCompleted')).toBeDefined()
  expect(User.schema.path('publicLocation.city')).toBeDefined()
  expect(User.schema.path('publicLocation.country')).toBeDefined()
  expect(User.schema.path('publicLocation.coordinates.lat')).toBeDefined()
  expect(User.schema.path('publicLocation.coordinates.lng')).toBeDefined()
})

test('CommunityPost model constrains post types and indexes public feed lookups', async () => {
  const { CommunityPost } = await import('@/models/CommunityPost')

  expect(CommunityPost.schema.path('authorId')).toBeDefined()
  expect(CommunityPost.schema.path('content')).toBeDefined()
  expect(CommunityPost.schema.path('type').enumValues).toEqual(
    expect.arrayContaining([
      'ANNOUNCEMENT',
      'MATCH_REPORT',
      'PLAYER_SPOTLIGHT',
      'RECRUITMENT',
      'PLAYER_LISTING',
      'POLL',
      'DISCUSSION',
    ])
  )
  expect(CommunityPost.schema.indexes()).toEqual(
    expect.arrayContaining([
      [{ createdAt: -1, scope: 1 }, {}],
      [{ 'location.city': 1, 'location.country': 1 }, {}],
    ])
  )
})

test('UploadThing router authorizes users and returns upload metadata', async () => {
  await import('@/app/api/uploadthing/core')

  expect(mockCreateUploadthing).toHaveBeenCalled()
  expect(mockRouteBuilder.middleware).toHaveBeenCalled()
  expect(mockRouteBuilder.onUploadComplete).toHaveBeenCalled()
  expect(mockCapturedMiddleware).toBeDefined()
  expect(mockCapturedUploadComplete).toBeDefined()

  mockGetAuthUser.mockResolvedValueOnce({ mongoId: 'user-1' })
  await expect(mockCapturedMiddleware!({ req: {} as Request })).resolves.toEqual({
    userId: 'user-1',
  })

  mockGetAuthUser.mockResolvedValueOnce(null)
  await expect(mockCapturedMiddleware!({ req: {} as Request })).rejects.toThrow(
    'Unauthorized'
  )

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined)
  await expect(
    mockCapturedUploadComplete!({
      metadata: { userId: 'user-1' },
      file: { url: 'https://files.example.test/image.png' },
    })
  ).resolves.toEqual({ uploadedBy: 'user-1' })
  consoleSpy.mockRestore()
})

test('UploadThing route exports GET and POST handlers from the configured router', async () => {
  const core = await import('@/app/api/uploadthing/core')
  const route = await import('@/app/api/uploadthing/route')

  expect(mockCreateRouteHandler).toHaveBeenCalledWith({ router: core.ourFileRouter })
  expect(route.GET).toBe('GET_HANDLER')
  expect(route.POST).toBe('POST_HANDLER')
})
