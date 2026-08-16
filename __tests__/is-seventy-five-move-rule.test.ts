import { Chess } from '../src/chess'
import { expect, test } from 'vitest'

test('isSeventyFiveMoveRule', () => {
  const chess = new Chess('8/8/8/2R5/8/7K/8/k2r4 w - - 149 129')
  expect(chess.isSeventyFiveMoveRule()).toBe(false)
  chess.move('Rd5')
  expect(chess.isSeventyFiveMoveRule()).toBe(true)
  chess.move('Rxd5')
  expect(chess.isSeventyFiveMoveRule()).toBe(false)
})

test('isSeventyFiveMoveRule - one hundred fifty half moves', () => {
  const chess = new Chess('8/8/8/2R5/8/7K/8/k2r4 w - - 150 129')
  expect(chess.isSeventyFiveMoveRule()).toBe(true)
})
