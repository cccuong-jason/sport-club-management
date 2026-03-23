import { encryptSelections, decryptSelections } from '@/lib/crypto'

beforeAll(() => {
  process.env.VOTE_ENC_KEY = 'test-key'
})

test('encrypt/decrypt roundtrip', () => {
  const plain = JSON.stringify({ first: 'u1', second: 'u2', third: 'u3' })
  const enc = encryptSelections(plain)
  const dec = decryptSelections(enc)
  expect(dec).toBe(plain)
})

test('throws when vote encryption key is missing', () => {
  const previous = process.env.VOTE_ENC_KEY
  delete process.env.VOTE_ENC_KEY

  expect(() => encryptSelections('payload')).toThrow('VOTE_ENC_KEY not configured')

  process.env.VOTE_ENC_KEY = previous
})

