import { Chess } from '../src/chess'
import { split } from './utils'
import { expect, test } from 'vitest'

test('canClaimDraw - threefold repetition', () => {
  /* Fischer - Petrosian, Buenos Aires, 1971 */
  const fen = '8/pp3p1k/2p2q1p/3r1P2/5R2/7P/P1P1QP2/7K b - - 2 30'
  const moves = split('Qe5 Qh5 Qf6 Qe2 Re5 Qd3 Rd5 Qe2')

  const chess = new Chess(fen)
  moves.forEach((move) => {
    expect(chess.canClaimDraw()).toBe(false)
    chess.move(move)
  })
  expect(chess.canClaimDraw()).toBe(true)
})

test('canClaimDraw - fifty move rule', () => {
  const chess = new Chess('8/2R5/5K2/1k6/8/8/8/4r3 w - - 100 104')
  expect(chess.canClaimDraw()).toBe(true)
})

test('canClaimDraw - stalemate is not claimable', () => {
  const chess = new Chess('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78')
  expect(chess.isStalemate()).toBe(true)
  expect(chess.canClaimDraw()).toBe(false)
})

test('canClaimDraw - insufficient material is not claimable', () => {
  const chess = new Chess('k7/8/8/8/8/8/8/7K w - - 0 1')
  expect(chess.isInsufficientMaterial()).toBe(true)
  expect(chess.canClaimDraw()).toBe(false)
})
