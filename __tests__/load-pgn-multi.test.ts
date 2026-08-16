import { Chess, indexPgnGames, Cursor } from '../src/chess'
import { describe, expect, it, test } from 'vitest'

describe('indexPgnGames', () => {
  test('single game with headers', () => {
    const pgn = `
[Event "Test"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0
`
    const games = indexPgnGames(pgn)
    expect(games.length).toBe(1)
    expect(games[0].headers).toEqual({
      Event: 'Test',
      White: 'Player1',
      Black: 'Player2',
      Result: '1-0',
    })
    expect(games[0].startOffset).toBeGreaterThanOrEqual(0)
    expect(games[0].endOffset).toBeGreaterThan(games[0].startOffset)
  })

  test('multiple games with headers', () => {
    const pgn =
      '[Event "A"]\n[White "W1"]\n[Black "B1"]\n[Result "1-0"]\n\n1. e4 e5 1-0\n\n' +
      '[Event "B"]\n[White "W2"]\n[Black "B2"]\n[Result "0-1"]\n\n1. d4 d5 2. Nf3 Nf6 0-1\n'

    const games = indexPgnGames(pgn)
    expect(games.length).toBe(2)
    expect(games[0].headers).toEqual({
      Event: 'A',
      White: 'W1',
      Black: 'B1',
      Result: '1-0',
    })
    expect(games[1].headers).toEqual({
      Event: 'B',
      White: 'W2',
      Black: 'B2',
      Result: '0-1',
    })
  })

  test('multiple games with CRLF line endings', () => {
    const pgn =
      '[Event "A"]\r\n[White "W1"]\r\n[Black "B1"]\r\n[Result "1-0"]\r\n\r\n1. e4 e5 1-0\r\n\r\n' +
      '[Event "B"]\r\n[White "W2"]\r\n[Black "B2"]\r\n[Result "0-1"]\r\n\r\n1. d4 d5 0-1\r\n'

    const games = indexPgnGames(pgn)
    expect(games.length).toBe(2)
    expect(games[0].headers.Event).toBe('A')
    expect(games[1].headers.Event).toBe('B')
  })

  test('empty PGN returns empty array', () => {
    expect(indexPgnGames('')).toEqual([])
  })

  test('single game without headers', () => {
    const pgn = '1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0\n'
    const games = indexPgnGames(pgn)
    expect(games.length).toBe(1)
    expect(games[0].headers).toEqual({})
  })

  test('multiple games without headers', () => {
    const pgn = '1. e4 e5 1-0\n\n1. d4 d5 2. Nf3 Nf6 0-1\n'
    const games = indexPgnGames(pgn)
    expect(games.length).toBe(2)
    expect(games[0].headers).toEqual({})
    expect(games[1].headers).toEqual({})
  })
})

describe('Cursor', () => {
  test('iterates over multiple games', () => {
    const pgn =
      '[Event "A"]\n[White "W1"]\n[Black "B1"]\n[Result "1-0"]\n\n1. e4 e5 1-0\n\n' +
      '[Event "B"]\n[White "W2"]\n[Black "B2"]\n[Result "0-1"]\n\n1. d4 d5 2. Nf3 Nf6 0-1\n'

    const games = indexPgnGames(pgn)
    const cursor = new Cursor(pgn, games)
    expect(cursor.totalGames).toBe(2)

    const game1 = cursor.next()
    expect(game1).not.toBeNull()
    expect(game1?.header()['Event']).toBe('A')
    expect(game1?.header()['White']).toBe('W1')
    expect(game1?.fen()).toBe(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    )

    const game2 = cursor.next()
    expect(game2).not.toBeNull()
    expect(game2?.header()['Event']).toBe('B')
    expect(game2?.header()['White']).toBe('W2')
    expect(game2?.fen()).toBe(
      'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3',
    )
  })

  test('respects start and length options', () => {
    const pgn =
      '[Event "A"]\n[White "W1"]\n[Result "1-0"]\n\n1. e4 e5 1-0\n\n' +
      '[Event "B"]\n[White "W2"]\n[Result "0-1"]\n\n1. d4 d5 0-1\n\n' +
      '[Event "C"]\n[White "W3"]\n[Result "1-0"]\n\n1. Nf3 Nf6 1-0\n'

    const games = indexPgnGames(pgn)
    const cursor = new Cursor(pgn, games, { start: 1, length: 1 })
    expect(cursor.totalGames).toBe(3)

    const game = cursor.next()
    expect(game?.header()['Event']).toBe('B')
    expect(cursor.hasNext()).toBe(false)
  })

  test('collects errors when onError is provided', () => {
    const pgn =
      '[Event "A"]\n[Result "1-0"]\n\n1. e4 e5 1-0\n\n' +
      '[Event "B"]\n[Result "0-1"]\n\n1. e4 Qxd7 1/2-1/2\n'

    const games = indexPgnGames(pgn)
    const errors: Array<{ index: number; error: Error }> = []
    const cursor = new Cursor(pgn, games, {
      onError: (error, index) => {
        errors.push({ index, error })
      },
    })

    cursor.next()
    cursor.next()
    expect(errors.length).toBe(1)
    expect(errors[0].index).toBe(1)
  })
})
