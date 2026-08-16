import { Chess } from '../src/chess'
import { expect, test } from 'vitest'

test('isDraw - default - threefold repetition', () => {
  const moves = 'Nf3 Nf6 Ng1 Ng8 Nf3 Nf6 Ng1 Ng8'.split(/\s+/)
  const chess = new Chess()

  moves.forEach((move) => {
    expect(chess.isDraw({ strict: true })).toBe(false)
    chess.move(move)
  })
  expect(chess.isDraw()).toBe(true)
  expect(chess.isDraw({ strict: true })).toBe(false)
})

test('isDraw - strict - fivefold repetition', () => {
  const moves =
    'Nf3 Nf6 Ng1 Ng8 Nf3 Nf6 Ng1 Ng8 Nf3 Nf6 Ng1 Ng8 Nf3 Nf6 Ng1 Ng8'.split(
      /\s+/,
    )
  const chess = new Chess()

  moves.forEach((move) => {
    expect(chess.isDraw({ strict: true })).toBe(false)
    chess.move(move)
  })
  expect(chess.isDraw()).toBe(true)
  expect(chess.isDraw({ strict: true })).toBe(true)
})

test('isDraw - strict - seventy five move rule', () => {
  const chess = new Chess('8/8/8/2R5/8/7K/8/k2r4 w - - 149 129')
  expect(chess.isDraw()).toBe(true)
  expect(chess.isDraw({ strict: true })).toBe(false)
  chess.move('Rd5')
  expect(chess.isDraw()).toBe(true)
  expect(chess.isDraw({ strict: true })).toBe(true)
  chess.move('Rxd5')
  expect(chess.isDraw()).toBe(false)
  expect(chess.isDraw({ strict: true })).toBe(false)
})

test('isDraw - automatic draws apply in both modes', () => {
  // stalemate
  const stalemate = new Chess('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78')
  expect(stalemate.isDraw()).toBe(true)
  expect(stalemate.isDraw({ strict: true })).toBe(true)

  // insufficient material
  const insufficient = new Chess('k7/8/8/8/8/8/8/7K w - - 0 1')
  expect(insufficient.isDraw()).toBe(true)
  expect(insufficient.isDraw({ strict: true })).toBe(true)
})

test('isDraw - fifty move rule is claimable but not strict', () => {
  const chess = new Chess('8/2R5/5K2/1k6/8/8/8/4r3 w - - 100 104')
  expect(chess.isDraw()).toBe(true)
  expect(chess.isDraw({ strict: true })).toBe(false)
})
