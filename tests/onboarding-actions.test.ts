const mockGetAuthUser = jest.fn()
const mockConnectDB = jest.fn()
const mockRevalidatePath = jest.fn()
const mockRedirect = jest.fn((path: string) => {
  throw new Error(`redirect:${path}`)
})
const mockClubCreate = jest.fn()
const mockClubFind = jest.fn()
const mockClubFindById = jest.fn()
const mockClubFindByIdAndDelete = jest.fn()
const mockClubMemberFind = jest.fn()
const mockClubMemberCreate = jest.fn()
const mockUserFindByIdAndUpdate = jest.fn()

jest.mock('@/lib/auth-user', () => ({
  getAuthUser: mockGetAuthUser,
}))

jest.mock('@/lib/db', () => ({
  connectDB: mockConnectDB,
}))

jest.mock('@/models/Club', () => ({
  Club: {
    create: mockClubCreate,
    find: mockClubFind,
    findById: mockClubFindById,
    findByIdAndDelete: mockClubFindByIdAndDelete,
  },
}))

jest.mock('@/models/ClubMember', () => ({
  ClubMember: {
    find: mockClubMemberFind,
    create: mockClubMemberCreate,
  },
}))

jest.mock('@/models/User', () => ({
  User: {
    findByIdAndUpdate: mockUserFindByIdAndUpdate,
  },
}))

jest.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}))

jest.mock('next/navigation', () => ({
  redirect: mockRedirect,
}))

const authUser = {
  clerkId: 'clerk-1',
  email: 'player@example.com',
  mongoId: 'user-1',
  name: 'Player One',
  memberships: [],
  role: 'member',
  status: 'onboarding',
}

function membershipFindResult(memberships: unknown[]) {
  return {
    populate: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(memberships),
    }),
  }
}

function findQueryResult(records: unknown[]) {
  const query = {
    sort: jest.fn(),
    limit: jest.fn(),
    lean: jest.fn().mockResolvedValue(records),
  }
  query.sort.mockReturnValue(query)
  query.limit.mockReturnValue(query)
  return query
}

function clubByIdResult(club: unknown) {
  return {
    lean: jest.fn().mockResolvedValue(club),
  }
}

function clubForm(name: string, sport: string) {
  const formData = new FormData()
  formData.set('name', name)
  formData.set('sport', sport)
  return formData
}

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
  mockGetAuthUser.mockResolvedValue(authUser)
  mockConnectDB.mockResolvedValue(undefined)
  mockClubMemberFind.mockReturnValue(membershipFindResult([]))
  mockClubCreate.mockResolvedValue({ _id: 'club-1' })
  mockClubMemberCreate.mockResolvedValue({})
  mockClubFindByIdAndDelete.mockResolvedValue({})
  mockUserFindByIdAndUpdate.mockResolvedValue({})
})

test('createClubAction rejects unauthorized and invalid requests before touching the database', async () => {
  const { createClubAction } = await import('@/app/[locale]/onboarding/actions')

  mockGetAuthUser.mockResolvedValueOnce(null)
  await expect(createClubAction(clubForm('Goalz FC', 'football'))).resolves.toEqual({
    success: false,
    message: 'Unauthorized',
  })

  await expect(createClubAction(clubForm('FC', 'football'))).resolves.toEqual({
    success: false,
    message: 'Club name must be at least 3 characters.',
  })

  await expect(createClubAction(clubForm('Goalz FC', ''))).resolves.toEqual({
    success: false,
    message: 'Please select a sport.',
  })

  expect(mockConnectDB).not.toHaveBeenCalled()
})

test('createClubAction blocks duplicate active or pending sport memberships', async () => {
  const { createClubAction } = await import('@/app/[locale]/onboarding/actions')

  mockClubMemberFind.mockReturnValueOnce(
    membershipFindResult([{ clubId: { sport: 'football', name: 'Existing FC' } }])
  )

  await expect(createClubAction(clubForm('Goalz FC', 'football'))).resolves.toEqual({
    success: false,
    message: 'You are already part of a football club. You cannot manage multiple clubs of the same sport.',
  })
  expect(mockClubCreate).not.toHaveBeenCalled()
})

test('createClubAction creates the club, creates an active admin membership, and redirects', async () => {
  const { createClubAction } = await import('@/app/[locale]/onboarding/actions')

  await expect(createClubAction(clubForm('  Goalz FC  ', 'football'))).rejects.toThrow(
    'redirect:/dashboard'
  )

  expect(mockClubCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'Goalz FC',
      sport: 'football',
      adminId: authUser.mongoId,
      isPublic: true,
    })
  )
  expect(mockClubMemberCreate).toHaveBeenCalledWith({
    userId: authUser.mongoId,
    clubId: 'club-1',
    role: 'admin',
    status: 'active',
  })
  expect(mockRevalidatePath).toHaveBeenCalledWith('/dashboard')
})

test('createClubAction rolls back a newly created club when membership creation fails', async () => {
  const { createClubAction } = await import('@/app/[locale]/onboarding/actions')
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)

  mockClubMemberCreate.mockRejectedValueOnce(new Error('membership failed'))

  await expect(createClubAction(clubForm('Goalz FC', 'football'))).resolves.toEqual({
    success: false,
    message: 'Failed to create club. Please try again.',
  })
  expect(mockClubFindByIdAndDelete).toHaveBeenCalledWith('club-1')
  consoleSpy.mockRestore()
})

test('searchClubsAction builds text and sport filters and normalizes club records', async () => {
  const { searchClubsAction } = await import('@/app/[locale]/onboarding/actions')

  mockClubFind.mockReturnValueOnce(
    findQueryResult([{ _id: 'club-1', name: 'Goalz FC', sport: 'football' }])
  )

  await expect(searchClubsAction('goalz', 'football')).resolves.toEqual({
    success: true,
    clubs: [{ id: 'club-1', name: 'Goalz FC', sport: 'football' }],
  })

  expect(mockClubFind).toHaveBeenCalledWith(
    {
      isPublic: true,
      sport: 'football',
      $text: { $search: 'goalz' },
    },
    { score: { $meta: 'textScore' } }
  )
})

test('searchClubsAction lists recent public clubs when the query is too short', async () => {
  const { searchClubsAction } = await import('@/app/[locale]/onboarding/actions')

  mockClubFind.mockReturnValueOnce(
    findQueryResult([{ _id: 'club-2', name: 'New Club', sport: 'tennis' }])
  )

  await expect(searchClubsAction('g', 'all')).resolves.toEqual({
    success: true,
    clubs: [{ id: 'club-2', name: 'New Club', sport: 'tennis' }],
  })
  expect(mockClubFind).toHaveBeenCalledWith({ isPublic: true })
})

test('joinClubAction handles authorization, missing clubs, duplicates, and success redirects', async () => {
  const { joinClubAction } = await import('@/app/[locale]/onboarding/actions')

  mockGetAuthUser.mockResolvedValueOnce(null)
  await expect(joinClubAction('club-1')).resolves.toEqual({
    success: false,
    message: 'Unauthorized',
  })

  mockClubFindById.mockReturnValueOnce(clubByIdResult(null))
  await expect(joinClubAction('missing-club')).resolves.toEqual({
    success: false,
    message: 'Club not found.',
  })

  mockClubFindById.mockReturnValueOnce(clubByIdResult({ _id: 'club-1', sport: 'football' }))
  mockClubMemberFind.mockReturnValueOnce(
    membershipFindResult([{ clubId: { sport: 'football', name: 'Existing FC' } }])
  )
  await expect(joinClubAction('club-1')).resolves.toEqual({
    success: false,
    message: 'You are already in a football club (Existing FC). You must leave it before joining another.',
  })

  mockClubFindById.mockReturnValueOnce(clubByIdResult({ _id: 'club-1', sport: 'football' }))
  mockClubMemberFind.mockReturnValueOnce(membershipFindResult([]))
  await expect(joinClubAction('club-1')).rejects.toThrow('redirect:/onboarding/pending')
  expect(mockClubMemberCreate).toHaveBeenCalledWith({
    userId: authUser.mongoId,
    clubId: 'club-1',
    role: 'member',
    status: 'pending_approval',
  })
})

test('joinClubAction returns specific errors for duplicate and generic membership failures', async () => {
  const { joinClubAction } = await import('@/app/[locale]/onboarding/actions')

  mockClubFindById.mockReturnValue(clubByIdResult({ _id: 'club-1', sport: 'football' }))
  mockClubMemberFind.mockReturnValue(membershipFindResult([]))
  mockClubMemberCreate.mockRejectedValueOnce({ code: 11000 })

  await expect(joinClubAction('club-1')).resolves.toEqual({
    success: false,
    message: 'You have already requested to join this club.',
  })

  mockClubMemberCreate.mockRejectedValueOnce(new Error('db failed'))
  await expect(joinClubAction('club-1')).resolves.toEqual({
    success: false,
    message: 'Failed to send join request.',
  })
})

test('exploreCommunityAction marks onboarding complete and redirects to the community', async () => {
  const { exploreCommunityAction } = await import('@/app/[locale]/onboarding/actions')

  await expect(exploreCommunityAction()).rejects.toThrow('redirect:/community')

  expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(authUser.mongoId, {
    onboardingCompleted: true,
  })
  expect(mockRevalidatePath).toHaveBeenCalledWith('/onboarding')
})

test('exploreCommunityAction reports unauthorized and persistence failures', async () => {
  const { exploreCommunityAction } = await import('@/app/[locale]/onboarding/actions')
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)

  mockGetAuthUser.mockResolvedValueOnce(null)
  await expect(exploreCommunityAction()).resolves.toEqual({
    success: false,
    message: 'Unauthorized',
  })

  mockUserFindByIdAndUpdate.mockRejectedValueOnce(new Error('db failed'))
  await expect(exploreCommunityAction()).resolves.toEqual({
    success: false,
    message: 'Failed to update profile.',
  })
  consoleSpy.mockRestore()
})
