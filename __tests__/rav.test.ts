import { Chess } from '../src/chess'
import { describe, expect, it } from 'vitest'

const arts =
  '1. e4 e5 2. Nf3 Nc6 (2... Nf6 3. Nxe5 {main line of the variation} d6) ' +
  '3. Bb5 {Ruy Lopez} (3. Bc4 (3. d3 d6) 3... Nf6) 3... a6 *'

const ART_FINAL =
  'r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4'

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

describe('Recursive Annotation Variations', () => {
  it('loadPgn ends on the main line and builds the variation tree', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    expect(chess.fen()).toEqual(ART_FINAL)
    expect(chess.variations()).toBe(0)
  })

  it('variations() reports the number of variations at each position', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    chess.start()
    // at the root a single (main) line continues
    expect(chess.variations()).toBe(1)
    expect(chess.next()?.san).toBe('e4')
    expect(chess.variations()).toBe(1)
    expect(chess.next()?.san).toBe('e5')
    expect(chess.next()?.san).toBe('Nf3')
    // 2... Nf6 is a variation of 2... Nc6
    expect(chess.variations()).toBe(2)
    expect(chess.next()?.san).toBe('Nc6')
    // 3. Bc4 is a variation of 3. Bb5
    expect(chess.variations()).toBe(2)
    expect(chess.next()?.san).toBe('Bb5')
    expect(chess.variations()).toBe(1)
    expect(chess.next()?.san).toBe('a6')
    expect(chess.variations()).toBe(0)
    expect(chess.next()).toBeNull()
  })

  it('next() follows the main line by default and variations by index', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    chess.start()

    chess.next() // e4
    chess.next() // e5
    chess.next() // Nf3

    // variation 0 is the main line, variation 1 is 2... Nf6
    const mainLine = chess.next()
    expect(mainLine?.san).toBe('Nc6')
    chess.undo()

    const variation = chess.next(1)
    expect(variation?.san).toBe('Nf6')
    chess.next() // 3. Nxe5
    expect(chess.getComment()).toBe('main line of the variation')
    expect(chess.get('e5')?.type).toBe('n')
  })

  it('peek() returns the variation move without executing it', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    chess.start()
    for (let i = 0; i < 3; i++) {
      chess.next()
    }
    const before = chess.fen()

    const peeked = chess.peek(1)
    expect(peeked?.san).toBe('Nf6')
    expect(peeked?.to).toBe('f6')
    expect(chess.fen()).toEqual(before)
    expect(chess.peek(0)?.san).toBe('Nc6')
    expect(chess.peek(2)).toBeNull()
    expect(chess.peek(-1)).toBeNull()
  })

  it('start() returns to the initial position of the game', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    chess.start()
    expect(chess.fen()).toBe(START)
    expect(chess.history()).toHaveLength(0)
    expect(chess.variations()).toBe(1)
  })

  it('undo() steps the game tree pointer back when undoing tree moves', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    chess.start()
    chess.next() // e4

    expect(chess.variations()).toBe(1)
    chess.undo()
    expect(chess.fen()).toBe(START)
    expect(chess.variations()).toBe(1)
    chess.next() // e4 again
    chess.next() // e5
    chess.undo()
    expect(chess.variations()).toBe(1)
  })

  it('nested variations can be navigated', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    chess.start()
    chess.next() // e4
    chess.next() // e5
    chess.next() // Nf3
    chess.next(1) // 2... Nf6
    chess.next() // 3. Nxe5
    expect(chess.getComment()).toBe('main line of the variation')
    expect(chess.variations()).toBe(1) // ... d6
    chess.next() // d6
    expect(chess.fen()).toBe(
      'rnbqkb1r/ppp2ppp/3p1n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4',
    )
  })

  it('deep variations - 4. d3 inside the 3. Bc4 variation', () => {
    const chess = new Chess()
    chess.loadPgn(
      '1. e4 e5 2. Nf3 Nc6 3. Bb5 (3. Bc4 3... Nf6 (4. d3 d6)) 3... a6 *',
    )
    chess.start()
    chess.next() // e4
    chess.next() // e5
    chess.next() // Nf3
    chess.next() // Nc6
    chess.next(1) // 3. Bc4
    expect(chess.variations()).toBe(1) // only 3... Nf6 continues here
    expect(chess.peek(0)?.san).toBe('Nf6')
    expect(chess.peek(1)).toBeNull() // 4. d3 is a white move, not playable yet
    chess.next() // 3... Nf6
    // the nested 4. d3 variation is revealed at this position
    expect(chess.variations()).toBe(1)
    expect(chess.peek()?.san).toBe('d3')
    chess.next() // 4. d3
    expect(chess.get('d3')?.type).toBe('p')
    expect(chess.variations()).toBe(1)
    chess.next() // d6
    expect(chess.get('d6')?.type).toBe('p')
    expect(chess.history().join(' ')).toBe('e4 e5 Nf3 Nc6 Bc4 Nf6 d3 d6')
  })

  it('comments on main line positions are attached as before', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    chess.start()
    chess.next() // e4
    chess.next() // e5
    chess.next() // Nf3
    chess.next() // Nc6
    const mainMove = chess.next() // 3. Bb5
    expect(mainMove?.san).toBe('Bb5')
    expect(chess.getComment()).toBe('Ruy Lopez')
  })

  it('next() returns null when the move is not playable from the current position', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    chess.start()
    chess.move('e4')
    chess.undo()
    expect(chess.next()?.san).toBe('e4')

    // deviate from the tree: play 2. Nf3 with move(), 2... Nc6 is no longer
    // playable so the tree's next() returns null
    const chess2 = new Chess()
    chess2.loadPgn(arts)
    chess2.start()
    chess2.next() // e4
    chess2.next() // e5
    chess2.move('Nf3') // 2. Nf3, custom
    expect(chess2.peek()).toBeNull() // the tree's next move Nf3 was just played
    expect(chess2.next()).toBeNull()

    // after undoing the deviation, the tree is navigable again
    chess2.undo()
    expect(chess2.next()?.san).toBe('Nf3')
  })

  it('variations(), peek(), next(), start() without a loaded game tree', () => {
    const chess = new Chess()
    chess.move('e4')
    expect(chess.variations()).toBe(0)
    expect(chess.peek()).toBeNull()
    expect(chess.next()).toBeNull()
    chess.start()
    expect(chess.fen()).toBe(START)
  })

  it('deleteVariation() and reorderVariation() modify the tree', () => {
    const chess = new Chess()
    chess.loadPgn(arts)
    chess.start()
    chess.next() // e4
    chess.next() // e5
    chess.next() // Nf3

    expect(chess.variations()).toBe(2)
    expect(chess.reorderVariation(1, 0)).toBe(true)
    expect(chess.peek(0)?.san).toBe('Nf6')

    expect(chess.deleteVariation(1)).toBe(true) // remove the main line Nc6
    expect(chess.variations()).toBe(1)
    expect(chess.peek(0)?.san).toBe('Nf6')

    expect(chess.deleteVariation(1)).toBe(false) // out of bounds
    expect(chess.deleteVariation(-1)).toBe(false)
    expect(chess.reorderVariation(0, 2)).toBe(false)
  })

  it('deleteVariation() and reorderVariation() without a game tree', () => {
    const chess = new Chess()
    expect(chess.deleteVariation(0)).toBe(false)
    expect(chess.reorderVariation(0, 0)).toBe(false)
  })

  it('loadPgn then navigation preserves headers and pgn() of the main line', () => {
    const chess = new Chess()
    chess.loadPgn(`[White "Anderssen"]\n\n${arts}`)
    chess.start()
    chess.next()
    chess.next()
    chess.next()
    chess.next()
    chess.next()
    chess.next() // a6
    const pgn = chess.pgn()
    expect(pgn).toContain('3. Bb5 {Ruy Lopez} a6')
    expect(pgn).toContain('[White "Anderssen"]')
    expect(chess.history().join(' ')).toBe('e4 e5 Nf3 Nc6 Bb5 a6')
    expect(chess.getHeaders()['White']).toBe('Anderssen')
  })
})
