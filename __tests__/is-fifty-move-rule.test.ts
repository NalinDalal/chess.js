import { Chess } from '../src/chess'
import { expect, test } from 'vitest'

test('isFiftyMoveRule', () => {
  const chess = new Chess('8/2R5/5K2/1k6/8/8/8/4r3 w - - 99 104')
  expect(chess.isFiftyMoveRule()).toBe(false)
  chess.move('Kf5')
  expect(chess.isFiftyMoveRule()).toBe(true)
  chess.move('Re5')
  expect(chess.isFiftyMoveRule()).toBe(true)
  chess.move('Kxe5')
  expect(chess.isFiftyMoveRule()).toBe(false)
})

test('isFiftyMoveRule - one hundred half moves', () => {
  const chess = new Chess('8/2R5/5K2/1k6/8/8/8/4r3 w - - 100 104')
  expect(chess.isFiftyMoveRule()).toBe(true)
})
