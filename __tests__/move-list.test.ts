import { Chess } from '../src/chess'
import { expect, test } from 'vitest'

test('moveList - returns move sequence without headers', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.move('e5')
  chess.move('Nf3')
  chess.move('Nc6')
  expect(chess.moveList()).toBe('1. e4 e5 2. Nf3 Nc6 *')
})

test('moveList - supports newline option', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.move('e5')
  chess.move('Nf3')
  chess.move('Nc6')
  expect(chess.moveList({ newline: '\n' })).toBe('1. e4 e5 2. Nf3 Nc6 *')
})

test('moveList - supports maxWidth option', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.move('e5')
  chess.move('Nf3')
  chess.move('Nc6')
  expect(chess.moveList({ maxWidth: 10 })).toBe('1. e4 e5\n2. Nf3 Nc6\n*')
})

test('moveList - empty history returns result only', () => {
  const chess = new Chess()
  expect(chess.moveList()).toBe(' *')
})

test('moveList - includes comments', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.setComment('The most popular opening move')
  chess.move('e5')
  expect(chess.moveList()).toBe('1. e4 {The most popular opening move} e5 *')
})

test('moveList - differs from pgn by omitting headers', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.move('e5')
  chess.setHeader('Event', 'Test')
  chess.setHeader('White', 'Alice')
  chess.setHeader('Black', 'Bob')
  const pgn = chess.pgn()
  const moveList = chess.moveList()
  expect(moveList).not.toContain('[Event')
  expect(moveList).not.toContain('[White')
  expect(moveList).not.toContain('[Black')
  expect(moveList).toBe('1. e4 e5 *')
})
