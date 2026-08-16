import { Chess, IllegalMoveError } from '../src/chess'
import { expect, test } from 'vitest'

test('move - works - standard algebraic notation', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const next = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
  const chess = new Chess(fen)
  const move = chess.move('e4')
  expect(move.isBigPawn()).toEqual(true)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isCheck()).toEqual(false)
  expect(move.after).toEqual(chess.fen())
  expect(chess.fen()).toEqual(next)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - standard algebraic notation (mates)', () => {
  const fen = '7k/3R4/3p2Q1/6Q1/2N1N3/8/8/3R3K w - - 0 1'
  const next = '3R3k/8/3p2Q1/6Q1/2N1N3/8/8/3R3K b - - 1 1'
  const chess = new Chess(fen)
  const move = chess.move('Rd8#')
  expect(chess.fen()).toEqual(next)
  expect(move.after).toEqual(chess.fen())
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(true)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - standard algebraic notation (white en passant)', () => {
  const fen = 'rnbqkbnr/pp3ppp/2pp4/4pP2/4P3/8/PPPP2PP/RNBQKBNR w KQkq e6 0 1'
  const next = 'rnbqkbnr/pp3ppp/2ppP3/8/4P3/8/PPPP2PP/RNBQKBNR b KQkq - 0 1'
  const chess = new Chess(fen)
  const move = chess.move('fxe6')

  expect(move).toMatchObject({
    from: 'f5',
    to: 'e6',
    captured: 'p',
    flags: 'e',
  })
  expect(chess.fen()).toEqual(move.after)
  expect(move.after).toEqual(next)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(true)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - standard algebraic notation (black en passant)', () => {
  const fen = 'rnbqkbnr/pppp2pp/8/4p3/4Pp2/2PP4/PP3PPP/RNBQKBNR b KQkq e3 0 1'
  const next = 'rnbqkbnr/pppp2pp/8/4p3/8/2PPp3/PP3PPP/RNBQKBNR w KQkq - 0 2'
  const chess = new Chess(fen)
  const move = chess.move('fxe3')
  expect(move).toMatchObject({
    from: 'f4',
    to: 'e3',
    captured: 'p',
    flags: 'e',
  })
  expect(chess.fen()).toEqual(move.after)
  expect(move.after).toEqual(next)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(true)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - standard algebraic notation (pin disambiguates piece)', () => {
  const fen = 'r2qkbnr/ppp2ppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R b KQkq - 3 7'
  const next = 'r2qkb1r/ppp1nppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R w KQkq - 4 8'
  const chess = new Chess(fen)
  const move = chess.move('Ne7')

  expect(move).toMatchObject({
    from: 'g8',
    to: 'e7',
    flags: 'n',
  })
  expect(move.after).toEqual(next)
  expect(chess.fen()).toEqual(move.after)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - permissive parser (accepts overly disambiguated piece)', () => {
  const fen = 'r2qkbnr/ppp2ppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R b KQkq - 3 7'
  const next = 'r2qkb1r/ppp1nppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R w KQkq - 4 8'
  const chess = new Chess(fen)
  const move = chess.move('Nge7')
  expect(move).toMatchObject({
    to: 'e7',
    from: 'g8',
    piece: 'n',
  })
  expect(chess.fen()).toBe(next)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - permissive parser (accepts correctly disambiguated piece)', () => {
  const fen = 'r2qkbnr/ppp2ppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R b KQkq - 3 7'
  const next = 'r2qkb1r/ppp1nppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R w KQkq - 4 8'
  const chess = new Chess(fen)
  const move = chess.move('Ne7')
  expect(move).toMatchObject({
    to: 'e7',
    from: 'g8',
    piece: 'n',
  })
  expect(chess.fen()).toBe(next)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - strict - throws Error - overly disambiguated piece', () => {
  const fen = 'r2qkbnr/ppp2ppp/2n5/1B2pQ2/4P3/8/PPP2PPP/RNB1K2R b KQkq - 3 7'
  const chess = new Chess(fen)
  expect(() => chess.move('Nge7', { strict: true })).toThrowError()
})

test('move - throws Error - illegal move', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const chess = new Chess(fen)
  expect(() => chess.move('e5')).toThrowError()
})

test('move - works - verbose', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const next = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
  const chess = new Chess(fen)
  const move = chess.move({ from: 'e2', to: 'e4' })
  expect(chess.fen()).toEqual(next)
  expect(move.after).toEqual(next)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(true)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - verbose - promotion field ignored if not promoting', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const next = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
  const chess = new Chess(fen)
  const move = chess.move({ from: 'e2', to: 'e4', promotion: 'q' })
  expect(chess.fen()).toBe(next)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(true)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - verbose - under promotion', () => {
  const fen = '8/1k5P/8/8/8/8/8/1K6 w - - 0 1'
  const next = '7N/1k6/8/8/8/8/8/1K6 b - - 0 1'
  const chess = new Chess(fen)
  const move = chess.move({ from: 'h7', to: 'h8', promotion: 'n' })
  expect(chess.fen()).toEqual(next)
  expect(move.after).toEqual(next)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(true)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - throws Error - verbose (illegal move)', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const chess = new Chess(fen)
  expect(() => chess.move({ from: 'e2', to: 'e5' })).toThrowError()
})

test('move - works - permissive parser (piece capture without x)', () => {
  const fen =
    'r1bqk2r/p1p2pp1/2n1pn2/1p5p/2pP4/bPNB1PN1/PB1Q2PP/R3K2R w KQkq - 0 12'
  const next =
    'r1bqk2r/p1p2pp1/2n1pn2/1p5p/2pP4/BPNB1PN1/P2Q2PP/R3K2R b KQkq - 0 12'
  const chess = new Chess(fen)
  const move = chess.move('Ba3')
  expect(move).toMatchObject({
    to: 'a3',
    from: 'b2',
    piece: 'b',
  })
  expect(chess.fen()).toEqual(next)
  expect(move.after).toEqual(next)
  expect(move.isCapture()).toEqual(true)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - permissive parser (pawn capture without x)', () => {
  const fen = 'rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2'
  const next = 'rnbqkbnr/pppp1ppp/8/8/4Pp2/8/PPPP2PP/RNBQKBNR w KQkq - 0 3'
  const chess = new Chess(fen)
  const move = chess.move('ef4')
  expect(move).toMatchObject({
    to: 'f4',
    from: 'e5',
    piece: 'p',
  })
  expect(chess.fen()).toEqual(next)
  expect(move.after).toEqual(next)
  expect(move.isCapture()).toEqual(true)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(false)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - permissive parser (en passant capture without x)', () => {
  const fen = 'rnbqkbnr/pppp1ppp/8/8/4PpP1/8/PPPP3P/RNBQKBNR b KQkq g3 0 3'
  const next = 'rnbqkbnr/pppp1ppp/8/8/4P3/6p1/PPPP3P/RNBQKBNR w KQkq - 0 4'
  const chess = new Chess(fen)
  const move = chess.move('fg3')
  expect(move).toMatchObject({
    to: 'g3',
    from: 'f4',
    piece: 'p',
  })
  expect(chess.fen()).toEqual(next)
  expect(move.after).toEqual(next)
  expect(move.isCapture()).toEqual(false)
  expect(move.isPromotion()).toEqual(false)
  expect(move.isEnPassant()).toEqual(true)
  expect(move.isKingsideCastle()).toEqual(false)
  expect(move.isQueensideCastle()).toEqual(false)
  expect(move.isBigPawn()).toEqual(false)
  expect(move.isCheck()).toEqual(false)

  expect(chess.hash()).toEqual(new Chess(next).hash())
  chess.undo()
  expect(chess.hash()).toEqual(new Chess(fen).hash())
})

test('move - works - kingside castling', () => {
  const fen =
    'r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'
  const next =
    'r1bqkbnr/ppp2ppp/2np4/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 1 1'
  const moves = ['O-O', 'e1g1']
  for (const theMove of moves) {
    const chess = new Chess(fen)
    const move = chess.move(theMove)
    expect(move.isBigPawn()).toEqual(false)
    expect(move.isCapture()).toEqual(false)
    expect(move.isPromotion()).toEqual(false)
    expect(move.isEnPassant()).toEqual(false)
    expect(move.isKingsideCastle()).toEqual(true)
    expect(move.isQueensideCastle()).toEqual(false)
    expect(move.isCheck()).toEqual(false)
    expect(move.after).toEqual(chess.fen())
    expect(chess.fen()).toEqual(next)

    expect(chess.hash()).toEqual(new Chess(next).hash())
    chess.undo()
    expect(chess.hash()).toEqual(new Chess(fen).hash())
  }
})

test('move - works - queenside castling', () => {
  const fen =
    'r3kb1r/pppbqppp/2np1n2/4p3/4P3/2NP1N2/PPPBBPPP/R2Q1RK1 b kq - 5 7'
  const next =
    '2kr1b1r/pppbqppp/2np1n2/4p3/4P3/2NP1N2/PPPBBPPP/R2Q1RK1 w - - 6 8'
  const moves = ['O-O-O', 'e8c8']
  for (const theMove of moves) {
    const chess = new Chess(fen)
    const move = chess.move(theMove)
    expect(move.isBigPawn()).toEqual(false)
    expect(move.isCapture()).toEqual(false)
    expect(move.isPromotion()).toEqual(false)
    expect(move.isEnPassant()).toEqual(false)
    expect(move.isKingsideCastle()).toEqual(false)
    expect(move.isQueensideCastle()).toEqual(true)
    expect(move.isCheck()).toEqual(false)
    expect(move.after).toEqual(chess.fen())
    expect(chess.fen()).toEqual(next)

    expect(chess.hash()).toEqual(new Chess(next).hash())
    chess.undo()
    expect(chess.hash()).toEqual(new Chess(fen).hash())
  }
})

test('move - works - ambiguous capitalization in move notation', () => {
  /*
   * Some positions and moves may be ambiguous when using the permissive
   * parser. For example, in this position: ,
   * the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated bishop
   * move). In these cases, the permissive parser will default to the most
   * basic interpretation (which is b1c3 parsing to Nc3).
   */
  const chess = new Chess('6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1')
  const move = chess.move('b1c3')
  expect(move.san).not.toEqual('B1c3')
  expect(move.san).toEqual('Nc3')
})

test('move - works - isCheck', () => {
  const chess = new Chess(
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  )
  const nonCheckMove = chess.move('Nf3')
  expect(nonCheckMove.isCheck()).toEqual(false)

  const checkMoveChess = new Chess(
    'rnb1kbnr/pppp1ppp/8/8/4Pp1q/2N5/PPPP2PP/R1BQKBNR w KQkq - 2 4',
  )
  const moves = checkMoveChess.moves({ verbose: true })
  const ke2 = moves.find((m) => m.san === 'Ke2')!
  expect(ke2.isCheck()).toEqual(false)

  const mateChess = new Chess('7k/3R4/3p2Q1/6Q1/2N1N3/8/8/3R3K w - - 0 1')
  const mateMove = mateChess.move('Rd8#')
  expect(mateMove.isCheck()).toEqual(true)

  const checkChess = new Chess(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  )
  checkChess.move('e4')
  checkChess.move('e5')
  const checkMove = checkChess.move('Qh5')
  expect(checkMove.san).toEqual('Qh5')
  expect(checkMove.isCheck()).toEqual(false)
  checkChess.move('g6')
  const checkMove2 = checkChess.move('Qxe5+')
  expect(checkMove2.san).toEqual('Qxe5+')
  expect(checkMove2.isCheck()).toEqual(true)
})

test('move({ legal: false }) - allows pseudo-legal moves that leave the king in check', () => {
  const fen = '4k3/4r3/8/8/8/8/4R3/4K3 w - - 0 1'
  const chess = new Chess(fen)
  const legalMoves = chess.moves()
  expect(legalMoves).not.toContain('Ra2')
  expect(legalMoves).not.toContain('Rb2')
  expect(chess.moves({ legal: false })).toContain('Ra2')
  expect(() => chess.move('Ra2')).toThrow('Invalid move')
  const move = chess.move('Ra2', { legal: false })
  expect(move.san).toEqual('Ra2')
  expect(chess.get('a2')?.type).toEqual('r')
  expect(chess.get('e2')).toBeUndefined()
  expect(chess.history()).toEqual(['Ra2'])
  chess.undo()
  expect(chess.fen()).toEqual(fen)
})

test('move({ legal: false }) - SAN, move object and null move paths', () => {
  const fen = '4k3/4r3/8/8/8/8/8/4K3 w - - 0 1'
  const chess = new Chess(fen)
  expect(chess.isCheck()).toEqual(true)
  expect(chess.moves()).not.toContain('Ke2')
  expect(chess.moves({ legal: false })).toContain('Ke2')

  const sanMove = chess.move('Ke2', { legal: false })
  expect(sanMove.san).toEqual('Ke2')
  expect(chess.get('e2')?.type).toEqual('k')

  chess.undo()
  const objectMove = chess.move({ from: 'e1', to: 'e2' }, { legal: false })
  expect(objectMove.san).toEqual('Ke2')

  chess.undo()
  expect(() => chess.move(null)).toThrow('Null move not allowed when in check')
  const nullMove = chess.move(null, { legal: false })
  expect(nullMove.san).toEqual('--')
  chess.undo()
  expect(chess.fen()).toEqual(fen)
})

test('move({ legal: false }) - allows the king to move adjacent to the enemy king', () => {
  const fen = '8/8/8/8/8/5k2/8/4K3 w - - 0 1'
  const chess = new Chess(fen)
  expect(() => chess.move('Kf2')).toThrow('Invalid move')
  const move = chess.move('Kf2', { legal: false })
  expect(move.san).toEqual('Kf2+')
  expect(chess.get('f2')?.type).toEqual('k')
  expect(chess.get('f3')?.type).toEqual('k')
  chess.undo()
  expect(chess.get('e1')?.type).toEqual('k')
})

test('move({ legal: false }) - does not allow capturing own pieces', () => {
  const chess = new Chess(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  )
  expect(() => chess.move({ from: 'e2', to: 'e1' }, { legal: false })).toThrow(
    'Invalid move',
  )
  expect(chess.fen()).toEqual(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  )
})

test('move({ legal: false }) - pseudo-legal moves generate coherent SAN and PGN', () => {
  const chess = new Chess('4k3/4r3/8/8/8/8/4R3/4K3 w - - 0 1')
  chess.move('Ra2', { legal: false })
  const pgn = chess.pgn()
  expect(pgn).toContain('1. Ra2')
  expect(chess.fen()).toEqual('4k3/4r3/8/8/8/8/R7/4K3 b - - 1 1')
})

test('tryMove - returns null for invalid moves instead of throwing', () => {
  const chess = new Chess()
  const fen = chess.fen()

  expect(chess.tryMove('nope')).toBeNull()
  expect(chess.tryMove('e9')).toBeNull()
  expect(chess.tryMove('Nf6')).toBeNull() // black hasn't moved yet, Nf6 is illegal
  expect(chess.tryMove('e5')).toBeNull()
  expect(chess.tryMove({ from: 'e2', to: 'e5' })).toBeNull()
  expect(chess.tryMove({ from: 'a1', to: 'a2' })).toBeNull()
  expect(chess.tryMove('e2e4', { strict: true })).toBeNull() // strict SAN rejects it

  expect(chess.fen()).toEqual(fen) // board untouched
  expect(chess.history()).toEqual([])

  // valid moves are applied as usual
  const strictE4 = chess.tryMove('e4', { strict: true })
  expect(strictE4).not.toBeNull()
  expect(strictE4?.san).toEqual('e4')
  const nullMove = chess.tryMove(null) // null move while not in check succeeds
  expect(nullMove).not.toBeNull()
  expect(nullMove?.san).toEqual('--')
  chess.undo()
  expect(chess.history()).toEqual(['e4'])
})

test('tryMove - returns the move for valid moves and applies options', () => {
  const chess = new Chess()

  const move = chess.tryMove('e4', { comment: 'good' })
  expect(move?.san).toEqual('e4')
  expect(chess.getComment()).toEqual('good')

  const quack = chess.tryMove({ from: 'e7', to: 'e5' })
  expect(quack?.san).toEqual('e5')
})

test('tryMove - null move while in check returns null', () => {
  const chess = new Chess('4k3/4r3/8/8/8/8/8/4K3 w - - 0 1')
  expect(chess.isCheck()).toEqual(true)
  expect(chess.tryMove(null)).toBeNull()
  // with pseudo-legal moves allowed it succeeds
  expect(chess.tryMove(null, { legal: false })?.san).toEqual('--')
})

test('tryMove - supports legal: false pseudo-legal moves', () => {
  const chess = new Chess('4k3/4r3/8/8/8/8/4R3/4K3 w - - 0 1')
  expect(chess.tryMove('Rg2')).toBeNull() // pinned rook may not leave the e-file
  const move = chess.tryMove('Rg2', { legal: false })
  expect(move?.san).toEqual('Rg2')
  expect(move?.to).toEqual('g2')
})

test('move - throws IllegalMoveError for invalid moves', () => {
  const chess = new Chess()
  expect(() => chess.move('e5')).toThrow(IllegalMoveError)
  expect(() => chess.move('e5')).toThrow('Invalid move: e5')
})

test('move - throws IllegalMoveError for null move in check', () => {
  const chess = new Chess('4k3/4r3/8/8/8/8/8/4K3 w - - 0 1')
  expect(chess.isCheck()).toEqual(true)
  expect(() => chess.move(null)).toThrow(IllegalMoveError)
  expect(() => chess.move(null)).toThrow('Null move not allowed when in check')
})
