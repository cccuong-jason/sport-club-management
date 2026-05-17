import { render, screen } from '@testing-library/react'

const mockGetAuthUser = jest.fn()
const mockConnectDB = jest.fn()
const mockGetTranslations = jest.fn()
const mockRedirect = jest.fn((path: string) => {
  throw new Error(`redirect:${path}`)
})
const mockNotFound = jest.fn(() => {
  throw new Error('not-found')
})
const mockCommunityPostFind = jest.fn()
const mockClubFindById = jest.fn()
const mockClubMemberCountDocuments = jest.fn()
const mockUserFindById = jest.fn()

jest.mock('@/lib/auth-user', () => ({
  getAuthUser: mockGetAuthUser,
}))

jest.mock('@/lib/db', () => ({
  connectDB: mockConnectDB,
}))

jest.mock('next-intl/server', () => ({
  getTranslations: mockGetTranslations,
}))

jest.mock('next/navigation', () => ({
  redirect: mockRedirect,
  notFound: mockNotFound,
}))

jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 hours ago'),
}))

jest.mock('@/models/CommunityPost', () => ({
  CommunityPost: {
    find: mockCommunityPostFind,
  },
}))

jest.mock('@/models/Club', () => ({
  Club: {
    findById: mockClubFindById,
  },
}))

jest.mock('@/models/ClubMember', () => ({
  ClubMember: {
    countDocuments: mockClubMemberCountDocuments,
  },
}))

jest.mock('@/models/User', () => ({
  User: {
    findById: mockUserFindById,
  },
}))

jest.mock('@/app/[locale]/onboarding/actions', () => ({
  joinClubAction: jest.fn(),
}))

const freeAgentUser = {
  clerkId: 'clerk-1',
  email: 'player@example.com',
  mongoId: 'user-1',
  name: 'Player One',
  memberships: [],
  role: 'member',
  status: 'free_agent',
}

function postFindResult(posts: unknown[]) {
  const query = {
    populate: jest.fn(),
    sort: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockResolvedValue(posts),
  }
  query.populate.mockReturnValue(query)
  query.sort.mockReturnValue(query)
  query.limit.mockReturnValue(query)
  return query
}

function modelFindByIdResult(record: unknown) {
  return {
    lean: jest.fn().mockResolvedValue(record),
  }
}

function ignoreServerActionFormWarning() {
  const originalError = console.error
  return jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
    const formattedMessage = [message, ...args].map(String).join(' ')
    if (
      formattedMessage.includes('Invalid value for prop') &&
      formattedMessage.includes('action') &&
      formattedMessage.includes('form')
    ) {
      return
    }

    originalError(message, ...args)
  })
}

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
  mockGetAuthUser.mockResolvedValue(freeAgentUser)
  mockConnectDB.mockResolvedValue(undefined)
  mockGetTranslations.mockResolvedValue((key: string) => {
    const messages: Record<string, string> = {
      feedTitle: 'Community Feed',
      feedDescription: 'Find clubs and players',
    }
    return messages[key] ?? key
  })
  mockCommunityPostFind.mockReturnValue(postFindResult([]))
  mockClubFindById.mockReturnValue(
    modelFindByIdResult({
      _id: 'club-1',
      name: 'Goalz FC',
      sport: 'football',
      location: { city: 'Ho Chi Minh City', country: 'Vietnam' },
    })
  )
  mockClubMemberCountDocuments.mockResolvedValue(3)
  mockUserFindById.mockReturnValue(
    modelFindByIdResult({
      _id: 'player-1',
      name: 'Alex Nguyen',
      position: 'Forward',
      photoUrl: '/avatar.png',
      onboardingCompleted: true,
      publicLocation: { city: 'Da Nang', country: 'Vietnam' },
    })
  )
})

test('community feed renders translated empty state and uses the public posts query', async () => {
  const CommunityFeedPage = (await import('@/app/[locale]/(community)/community/page')).default

  render(await CommunityFeedPage())

  expect(screen.getByRole('heading', { name: 'Community Feed' })).toBeInTheDocument()
  expect(screen.getByText('Find clubs and players')).toBeInTheDocument()
  expect(screen.getByText('No posts to show yet')).toBeInTheDocument()
  expect(mockCommunityPostFind).toHaveBeenCalledWith({ scope: 'public' })
})

test('community feed renders populated posts with author, club, location, and media', async () => {
  const CommunityFeedPage = (await import('@/app/[locale]/(community)/community/page')).default

  mockCommunityPostFind.mockReturnValueOnce(
    postFindResult([
      {
        _id: 'post-1',
        type: 'RECRUITMENT',
        content: 'Looking for a keeper this weekend.',
        createdAt: new Date('2026-05-01T10:00:00.000Z'),
        authorId: { name: 'Coach Minh', photoUrl: '/coach.png' },
        clubId: { name: 'Goalz FC' },
        mediaUrls: ['/post.png'],
        location: { city: 'Hanoi', country: 'Vietnam' },
      },
    ])
  )

  render(await CommunityFeedPage())

  expect(screen.getByText('Coach Minh')).toBeInTheDocument()
  expect(screen.getByText('Goalz FC')).toBeInTheDocument()
  expect(screen.getByText('Looking for a keeper this weekend.')).toBeInTheDocument()
  expect(screen.getByText('Hanoi, Vietnam')).toBeInTheDocument()
  expect(screen.getByAltText('Post Attachment')).toHaveAttribute('src', '/post.png')
})

test('club profile redirects anonymous users and returns notFound for missing clubs', async () => {
  const ClubProfilePage = (await import('@/app/[locale]/(community)/club/[id]/page')).default

  mockGetAuthUser.mockResolvedValueOnce(null)
  await expect(
    ClubProfilePage({ params: Promise.resolve({ locale: 'en', id: 'club-1' }) })
  ).rejects.toThrow('redirect:/')

  mockClubFindById.mockReturnValueOnce(modelFindByIdResult(null))
  await expect(
    ClubProfilePage({ params: Promise.resolve({ locale: 'en', id: 'missing-club' }) })
  ).rejects.toThrow('not-found')
})

test('club profile renders membership state for free agents and existing members', async () => {
  const ClubProfilePage = (await import('@/app/[locale]/(community)/club/[id]/page')).default
  const consoleSpy = ignoreServerActionFormWarning()

  try {
    const { rerender } = render(
      await ClubProfilePage({ params: Promise.resolve({ locale: 'en', id: 'club-1' }) })
    )

    expect(screen.getByRole('heading', { name: 'Goalz FC' })).toBeInTheDocument()
    expect(screen.getByText('Ho Chi Minh City, Vietnam')).toBeInTheDocument()
    expect(screen.getByText('3 members')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Request to Join' })).toBeInTheDocument()

    mockGetAuthUser.mockResolvedValueOnce({
      ...freeAgentUser,
      memberships: [{ clubId: 'club-1' }],
    })
    rerender(await ClubProfilePage({ params: Promise.resolve({ locale: 'en', id: 'club-1' }) }))
    expect(screen.getByRole('button', { name: 'Already a Member' })).toBeDisabled()
  } finally {
    consoleSpy.mockRestore()
  }
})

test('club profile disables join actions for users who are not free agents', async () => {
  const ClubProfilePage = (await import('@/app/[locale]/(community)/club/[id]/page')).default

  mockGetAuthUser.mockResolvedValueOnce({
    ...freeAgentUser,
    status: 'active',
  })

  render(await ClubProfilePage({ params: Promise.resolve({ locale: 'en', id: 'club-1' }) }))

  expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
})

test('player profile redirects anonymous users, returns notFound, and renders public player details', async () => {
  const PlayerProfilePage = (await import('@/app/[locale]/(community)/player/[id]/page')).default

  mockGetAuthUser.mockResolvedValueOnce(null)
  await expect(
    PlayerProfilePage({ params: Promise.resolve({ locale: 'en', id: 'player-1' }) })
  ).rejects.toThrow('redirect:/')

  mockUserFindById.mockReturnValueOnce(modelFindByIdResult(null))
  await expect(
    PlayerProfilePage({ params: Promise.resolve({ locale: 'en', id: 'missing-player' }) })
  ).rejects.toThrow('not-found')

  render(await PlayerProfilePage({ params: Promise.resolve({ locale: 'en', id: 'player-1' }) }))

  expect(screen.getByRole('heading', { name: 'Alex Nguyen' })).toBeInTheDocument()
  expect(screen.getByText('Free Agent')).toBeInTheDocument()
  expect(screen.getByText('Da Nang, Vietnam')).toBeInTheDocument()
  expect(screen.getByText('Forward')).toBeInTheDocument()
  expect(screen.getByAltText('Alex Nguyen')).toHaveAttribute('src', '/avatar.png')
})

test('player profile falls back when public location and optional fields are absent', async () => {
  const PlayerProfilePage = (await import('@/app/[locale]/(community)/player/[id]/page')).default

  mockUserFindById.mockReturnValueOnce(
    modelFindByIdResult({
      _id: 'player-2',
      name: 'Sam Tran',
      onboardingCompleted: false,
    })
  )

  render(await PlayerProfilePage({ params: Promise.resolve({ locale: 'en', id: 'player-2' }) }))

  expect(screen.getByRole('heading', { name: 'Sam Tran' })).toBeInTheDocument()
  expect(screen.getByText('Registered Free Agent')).toBeInTheDocument()
  expect(screen.queryByText('Free Agent')).not.toBeInTheDocument()
})
