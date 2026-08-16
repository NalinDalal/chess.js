import { Chess, BLACK, WHITE } from '../src/chess'
import { expect, test } from 'vitest'

test('resign - white resigns', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.resign(WHITE)

  expect(chess.getHeaders()).toMatchObject({
    Result: '0-1',
    Termination: 'Black won - game abandoned',
  })
  expect(chess.isGameOver()).toEqual(true)
  expect(chess.isGameOver({ strict: true })).toEqual(true)
  expect(chess.pgn()).toContain('[Result "0-1"]')
  expect(chess.pgn()).toContain('e4 0-1')
})

test('resign - black resigns', () => {
  const chess = new Chess()
  chess.resign(BLACK)

  expect(chess.getHeaders()).toMatchObject({
    Result: '1-0',
    Termination: 'White won - game abandoned',
  })
  expect(chess.isGameOver()).toEqual(true)
  expect(chess.pgn()).toContain('[Result "1-0"]')
})

test('resign - game is not over before resigning', () => {
  const chess = new Chess()
  expect(chess.isGameOver()).toEqual(false)
  expect(chess.isGameOver({ strict: true })).toEqual(false)
})

test('resign - does not affect move generation', () => {
  const chess = new Chess()
  const moves = chess.moves()
  chess.resign(WHITE)
  expect(chess.moves()).toHaveLength(moves.length)
})

test('resign - clear() resets the resigned state', () => {
  const chess = new Chess()
  chess.resign(WHITE)
  chess.clear()
  expect(chess.getHeaders().Result).toBe('*')

  const fresh = new Chess()
  fresh.clear()
  expect(chess.isGameOver()).toEqual(fresh.isGameOver())
})

test('resign - load() resets the resigned state', () => {
  const chess = new Chess()
  chess.resign(BLACK)
  expect(chess.isGameOver()).toEqual(true)
  chess.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  expect(chess.isGameOver()).toEqual(false)
})

test('resign - move() still works after resigning', () => {
  const chess = new Chess()
  chess.resign(BLACK)
  expect(chess.move('e4')).toMatchObject({ san: 'e4' })
})
