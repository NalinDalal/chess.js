import { Chess } from '../src/chess'
import { expect, test } from 'vitest'

test('pinnedPieces - empty in the start position', () => {
  const chess = new Chess()
  expect(chess.pinnedPieces('w')).toEqual([])
  expect(chess.pinnedPieces('b')).toEqual([])
})

test('pinnedPieces - orthogonal pin by rook', () => {
  const chess = new Chess('4k3/8/4n3/8/8/8/8/4R1K1 w - - 0 1')
  expect(chess.pinnedPieces('b')).toEqual([
    {
      square: 'e6',
      piece: 'n',
      color: 'b',
      pinnedBy: 'e1',
      pinnedByPiece: 'r',
    },
  ])
})

test('pinnedPieces - diagonal pin by bishop', () => {
  const chess = new Chess('4k3/3p4/8/8/B7/8/8/4K3 w - - 0 1')
  expect(chess.pinnedPieces('b')).toEqual([
    {
      square: 'd7',
      piece: 'p',
      color: 'b',
      pinnedBy: 'a4',
      pinnedByPiece: 'b',
    },
  ])
})

test('pinnedPieces - orthogonal pin by queen', () => {
  const chess = new Chess('4k3/4p3/8/8/8/8/8/4Q1K1 w - - 0 1')
  expect(chess.pinnedPieces('b')).toEqual([
    {
      square: 'e7',
      piece: 'p',
      color: 'b',
      pinnedBy: 'e1',
      pinnedByPiece: 'q',
    },
  ])
})

test('pinnedPieces - knight can never pin', () => {
  const chess = new Chess('4k3/3p1n2/8/8/8/8/8/4K3 w - - 0 1')
  expect(chess.pinnedPieces('b')).toEqual([])
})

test('pinnedPieces - two blockers: neither is pinned', () => {
  const chess = new Chess('4k3/8/4n3/4n3/8/8/8/4R1K1 w - - 0 1')
  expect(chess.pinnedPieces('b')).toEqual([])
})

test('pinnedPieces - only the blocker closest to the king is pinned', () => {
  const chess = new Chess('4k3/8/4n3/8/8/8/8/4R1K1 w - - 0 1')
  expect(chess.pinnedPieces('b')).toEqual([
    {
      square: 'e6',
      piece: 'n',
      color: 'b',
      pinnedBy: 'e1',
      pinnedByPiece: 'r',
    },
  ])
})

test('pinnedPieces - defaults to the side to move', () => {
  const chess = new Chess('4rk2/8/8/8/8/8/4N3/4K3 w - - 0 1')
  expect(chess.pinnedPieces()).toEqual([
    {
      square: 'e2',
      piece: 'n',
      color: 'w',
      pinnedBy: 'e8',
      pinnedByPiece: 'r',
    },
  ])
  expect(chess.pinnedPieces('b')).toEqual([])
})

test('pinnedPieces - only pieces aligned with king and pinner are reported', () => {
  const chess = new Chess('4k3/3r4/8/8/8/8/8/3R2K1 w - - 0 1')
  expect(chess.pinnedPieces('b')).toEqual([])
  chess.clear()
  chess.load('4k3/4r1r1/8/8/8/8/8/4R1K1 w - - 0 1')
  expect(chess.pinnedPieces('b')).toEqual([
    {
      square: 'e7',
      piece: 'r',
      color: 'b',
      pinnedBy: 'e1',
      pinnedByPiece: 'r',
    },
  ])
})