import { Chess } from '../src/chess'
import { expect, test } from 'vitest'

test('premoves - all opponent moves survive in the start position', () => {
  const chess = new Chess()
  const premoves = chess.premoves()
  expect(premoves).toHaveLength(20)
  expect(premoves).toContain('e5')
  expect(premoves).toContain('a6')
  expect(premoves).toContain('Nf6')
  expect(premoves).not.toContain('Ke2')
})

test('premoves - defaults to the side not to move', () => {
  const chess = new Chess()
  const premoves = chess.premoves()
  expect(premoves).toHaveLength(20)
})

test('premoves - kings only', () => {
  const chess = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
  expect(chess.premoves().sort()).toEqual(['Kd7', 'Kd8', 'Ke7', 'Kf7', 'Kf8'])
})

test('premoves - excludes moves that a checking reply kills', () => {
  const chess = new Chess('4k3/2p5/8/8/8/8/2B5/4K3 w - - 0 1')
  const premoves = chess.premoves()
  expect(premoves.sort()).toEqual(['Kd8', 'Ke7', 'Kf8'])
})

test('premoves - needs to be legal after every active-side move', () => {
  const chess = new Chess('4k3/8/8/8/8/8/2B5/4K3 w - - 0 1')
  expect(chess.premoves().sort()).toEqual(['Kd8', 'Ke7', 'Kf8'])
})

test('premoves - verbose returns Move objects', () => {
  const chess = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
  const premoves = chess.premoves({ verbose: true })
  const sans = premoves.map((move) => move.san).sort()
  expect(sans).toEqual(['Kd7', 'Kd8', 'Ke7', 'Kf7', 'Kf8'])
  for (const move of premoves) {
    expect(move.color).toBe('b')
    expect(move.piece).toBe('k')
  }
})

test('premoves - verbose false returns strings', () => {
  const chess = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
  const premoves = chess.premoves({ verbose: false })
  expect(premoves.sort()).toEqual(['Kd7', 'Kd8', 'Ke7', 'Kf7', 'Kf8'])
})

test('premoves - empty when the game is over', () => {
  const chess = new Chess('8/8/8/8/8/1k6/2q5/K7 w - - 0 1')
  expect(chess.isGameOver()).toBe(true)
  expect(chess.premoves()).toEqual([])
  expect(chess.premoves({ verbose: true })).toEqual([])
})

test('premoves - responds to captures by the active side', () => {
  const chess = new Chess('4k3/8/8/8/8/8/4p3/2B1K3 w - - 0 1')
  const premoves = chess.premoves()
  expect(premoves.sort()).toEqual(['Kd7', 'Kf7'])
})

test('premoves - does not disturb the game state', () => {
  const chess = new Chess()
  chess.move('Nf3')
  chess.premoves('b')
  const fen = chess.fen()
  chess.premoves({ verbose: true })
  expect(chess.fen()).toBe(fen)
})