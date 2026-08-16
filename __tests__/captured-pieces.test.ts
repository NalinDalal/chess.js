import { Chess } from '../src/chess'
import { expect, test } from 'vitest'

test('capturedPieces - empty at the start', () => {
  const chess = new Chess()
  expect(chess.capturedPieces('w')).toEqual([])
  expect(chess.capturedPieces('b')).toEqual([])
})

test('capturedPieces - tracks captures in order', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.move('d5')
  expect(chess.capturedPieces('w')).toEqual([])
  chess.move('exd5')
  expect(chess.capturedPieces('w')).toEqual(['p'])
  chess.move('Qxd5')
  chess.move('Bc4')
  chess.move('Qd8')
  chess.move('Bxf7+')
  expect(chess.capturedPieces('w')).toEqual(['p', 'p'])
  chess.move('Kxf7')
  expect(chess.capturedPieces('b')).toEqual(['p', 'b'])
})

test('capturedPieces - en passant capture', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.move('c5')
  chess.move('e5')
  chess.move('d5')
  const move = chess.move('exd6')
  expect(chess.capturedPieces('w')).toEqual(['p'])
  expect(move.captured).toBe('p')
})

test('capturedPieces - undo restores the lists', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.move('d5')
  chess.move('exd5')
  expect(chess.capturedPieces('w')).toEqual(['p'])
  chess.undo()
  expect(chess.capturedPieces('w')).toEqual([])
  chess.undo()
  chess.undo()
  expect(chess.capturedPieces('w')).toEqual([])
})

test('capturedPieces - populated by loadPgn', () => {
  const chess = new Chess()
  chess.loadPgn('1. e4 d5 2. exd5 Qxd5 3. Nc3 Qd8')
  expect(chess.capturedPieces('w')).toEqual(['p'])
  expect(chess.capturedPieces('b')).toEqual(['p'])
})

test('capturedPieces - cleared by reset and clear', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.move('d5')
  chess.move('exd5')
  chess.reset()
  expect(chess.capturedPieces('w')).toEqual([])
  chess.move('e4')
  chess.move('d5')
  chess.move('exd5')
  chess.clear()
  expect(chess.capturedPieces('w')).toEqual([])
})

test('capturedPieces - returns a copy', () => {
  const chess = new Chess()
  chess.move('e4')
  chess.move('d5')
  chess.move('exd5')
  const captured = chess.capturedPieces('w')
  captured.push('q')
  expect(chess.capturedPieces('w')).toEqual(['p'])
})

test('capturedPieces - intact after history()', () => {
  const chess = new Chess()
  chess.loadPgn('1. e4 d5 2. exd5 Qxd5 3. Nc3 Qd8')
  chess.history()
  expect(chess.capturedPieces('w')).toEqual(['p'])
  expect(chess.capturedPieces('b')).toEqual(['p'])
})