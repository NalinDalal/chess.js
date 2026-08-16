import { Chess } from '../src/chess'
import { expect, test } from 'vitest'

const knightMoves = ['Nf3', 'Ngf3', 'Ng1f3', 'Ng1-f3', 'g1f3', 'g1-f3']

const pawnPushes = [
  'e4',
  'e2e4',
  'e2-e4',
  'ee4',
  '2e4',
  'Pe4',
  'Pe2-e4',
  'Pe2e4',
  'P2e4',
  'P2-e4',
]

const pawnCaptures = [
  'exd5',
  'e4xd5',
  'e4-d5',
  'xd5',
  'Pexd5',
  'Pe4xd5',
  'P4xd5',
  'P4-d5',
  'd5',
]

test('move - permissive parser - knight moves', () => {
  for (const san of knightMoves) {
    const chess = new Chess()
    const move = chess.move(san)
    expect(move.san, san).toEqual('Nf3')
    expect(move.from).toEqual('g1')
    expect(move.to).toEqual('f3')
  }
})

test('move - permissive parser - pawn pushes', () => {
  for (const san of pawnPushes) {
    const chess = new Chess()
    const move = chess.move(san)
    expect(move.san, san).toEqual('e4')
    expect(move.from).toEqual('e2')
    expect(move.to).toEqual('e4')
  }
})

test('move - permissive parser - pawn captures', () => {
  for (const san of pawnCaptures) {
    const chess = new Chess(
      'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3',
    )
    const move = chess.move(san)
    expect(move.san, san).toEqual('exd5')
    expect(move.from).toEqual('e4')
    expect(move.to).toEqual('d5')
  }
})

test('move - permissive parser - long algebraic notation (from-square origin)', () => {
  /*
   * When the origin is a complete square, it is read strictly as the
   * from-square and never as a piece letter, so long algebraic notation is
   * unambiguous even when a bishop from the same rank/file could also reach
   * the target square.
   */
  const knightToC6 = new Chess(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1',
  )
  const b8c6 = knightToC6.move('b8c6')
  expect(b8c6.san).toEqual('Nc6')
  expect(b8c6.from).toEqual('b8')

  const chess = new Chess('6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1')
  const b1c3 = chess.move('b1c3')
  expect(b1c3.san).toEqual('Nc3')
})

test('move - permissive parser - rejects ambiguous notation', () => {
  /*
   * When the target square can be reached by several moves and the notation
   * doesn't disambiguate between them, the move is rejected.
   */
  const chess = new Chess('4k3/8/8/3p4/2P1P3/8/8/4K3 w - - 0 1')
  expect(() => chess.move('d5')).toThrow('Invalid move: d5')
})

test('move - permissive parser - rejects non-existent moves', () => {
  const chess = new Chess()
  expect(() => chess.move('g8f6')).toThrow('Invalid move: g8f6')
  expect(() => chess.move('e2e5')).toThrow('Invalid move: e2e5')
})

test('move - permissive parser - short pawn moves', () => {
  const chess = new Chess('8/8/8/4p3/3P4/8/8/4k1K1 w - - 0 1')
  const move = chess.move('de')
  expect(move.san).toEqual('dxe5')
  expect(move.from).toEqual('d4')
  expect(move.to).toEqual('e5')
})
