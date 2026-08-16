import { BLACK, Chess, KING, QUEEN, WHITE } from '../src/chess'
import { expect, test } from 'vitest'

test('setCastlingRights - clear white kingside', () => {
  const chess = new Chess()

  expect(chess.setCastlingRights(WHITE, { [KING]: false })).toEqual(true)
  expect(chess.getCastlingRights(WHITE)[KING]).toEqual(false)
})

test('setCastlingRights - clear white queenside', () => {
  const chess = new Chess()

  expect(chess.setCastlingRights(WHITE, { [QUEEN]: false })).toEqual(true)
  expect(chess.getCastlingRights(WHITE)[QUEEN]).toEqual(false)
})

test('setCastlingRights - clear black kingside', () => {
  const chess = new Chess()

  expect(chess.setCastlingRights(BLACK, { [KING]: false })).toEqual(true)
  expect(chess.getCastlingRights(BLACK)[KING]).toEqual(false)
})

test('setCastlingRights - clear black queenside', () => {
  const chess = new Chess()

  expect(chess.setCastlingRights(BLACK, { [QUEEN]: false })).toEqual(true)
  expect(chess.getCastlingRights(BLACK)[QUEEN]).toEqual(false)
})

test('setCastlingRights - set white kingside', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w - - 0 1')

  expect(chess.setCastlingRights(WHITE, { [KING]: true })).toEqual(true)
  expect(chess.getCastlingRights(WHITE)[KING]).toEqual(true)
})

test('setCastlingRights - set white queenside', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w - - 0 1')

  expect(chess.setCastlingRights(WHITE, { [QUEEN]: true })).toEqual(true)
  expect(chess.getCastlingRights(WHITE)[QUEEN]).toEqual(true)
})

test('setCastlingRights - set black kingside', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w - - 0 1')

  expect(chess.setCastlingRights(BLACK, { [KING]: true })).toEqual(true)
  expect(chess.getCastlingRights(BLACK)[KING]).toEqual(true)
})

test('setCastlingRights - set black queenside', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w - - 0 1')

  expect(chess.setCastlingRights(BLACK, { [QUEEN]: true })).toEqual(true)
  expect(chess.getCastlingRights(BLACK)[QUEEN]).toEqual(true)
})

test('setCastlingRights - fail to set white kingside', () => {
  const chess = new Chess()
  chess.clear()

  expect(chess.setCastlingRights(WHITE, { [KING]: true })).toEqual(false)
  expect(chess.getCastlingRights(WHITE)[KING]).toEqual(false)
})

test('setCastlingRights - fail to set white queenside', () => {
  const chess = new Chess()
  chess.clear()

  expect(chess.setCastlingRights(WHITE, { [QUEEN]: true })).toEqual(false)
  expect(chess.getCastlingRights(WHITE)[QUEEN]).toEqual(false)
})

test('setCastlingRights - fail to set black kingside', () => {
  const chess = new Chess()
  chess.clear()

  expect(chess.setCastlingRights(BLACK, { [KING]: true })).toEqual(false)
  expect(chess.getCastlingRights(BLACK)[KING]).toEqual(false)
})

test('setCastlingRights - fail to set black queenside', () => {
  const chess = new Chess()
  chess.clear()

  expect(chess.setCastlingRights(BLACK, { [QUEEN]: true })).toEqual(false)
  expect(chess.getCastlingRights(BLACK)[QUEEN]).toEqual(false)
})

test('move - chess960 castling notation - white kingside', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
  expect(chess.move({ from: 'e1', to: 'h1' })).toMatchObject({ san: 'O-O' })
  expect(chess.fen()).toBe('r3k2r/8/8/8/8/8/8/R4RK1 b kq - 1 1')
})

test('move - chess960 castling notation - white queenside', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
  expect(chess.move({ from: 'e1', to: 'a1' })).toMatchObject({
    san: 'O-O-O',
  })
  expect(chess.fen()).toBe('r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1')
})

test('move - chess960 castling notation - black kingside', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R b kq - 0 1')
  expect(chess.move({ from: 'e8', to: 'h8' })).toMatchObject({ san: 'O-O' })
  expect(chess.fen()).toBe('r4rk1/8/8/8/8/8/8/R3K2R w - - 1 2')
})

test('move - chess960 castling notation - black queenside', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R b kq - 0 1')
  expect(chess.move({ from: 'e8', to: 'a8' })).toMatchObject({
    san: 'O-O-O',
  })
  expect(chess.fen()).toBe('2kr3r/8/8/8/8/8/8/R3K2R w - - 1 2')
})

test('move - chess960 castling notation - rejected when no castling rights', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w - - 0 1')
  expect(() => chess.move({ from: 'e1', to: 'h1' })).toThrow('Invalid move')
})

test('move - chess960 castling notation - rejected when king is not on e1', () => {
  const chess = new Chess('r3k2r/8/8/8/8/8/8/R2K3R w kq - 0 1')
  expect(() => chess.move({ from: 'e1', to: 'h1' })).toThrow('Invalid move')
})

test('move - chess960 castling notation - does not interfere with regular moves', () => {
  const chess = new Chess()
  expect(chess.move({ from: 'g1', to: 'f3' })).toMatchObject({ san: 'Nf3' })
  expect(chess.move({ from: 'g8', to: 'f6' })).toMatchObject({ san: 'Nf6' })
  expect(chess.move({ from: 'e2', to: 'e4' })).toMatchObject({ san: 'e4' })
})
