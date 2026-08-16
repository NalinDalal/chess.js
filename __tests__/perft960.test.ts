import { Chess, KING, validateFen } from '../src/chess'
import { expect, test } from 'vitest'

/*
 * reference positions and counts from
 * https://www.chessprogramming.org/Chess960_Perft_Results
 * (Andrew Grant's perft suite for the Chess960 variant)
 */
const chess960 = [
  {
    fen: 'bqnb1rkr/pp3ppp/3ppn2/2p5/5P2/P2P4/NPP1P1PP/BQ1BNRKR w HFhf - 2 9',
    nodes: [21, 528, 12189, 326672, 8146062],
  },
  {
    fen: '2nnrbkr/p1qppppp/8/1ppb4/6PP/3PP3/PPP2P2/BQNNRBKR w HEhe - 1 9',
    nodes: [21, 807, 18002, 667366, 16253601],
  },
  {
    // castling with king on f1 and rooks on e1/g1: the king and rook swap
    // squares when castling kingside
    fen: 'b1q1rrkb/pppppppp/3nn3/8/P7/1PPP4/4PPPP/BQNNRKRB w GE - 1 9',
    nodes: [20, 479, 10471, 273318, 6417013],
  },
  {
    fen: 'qbbnnrkr/2pp2pp/p7/1p2pp2/8/P3PP2/1PPP1KPP/QBBNNR1R w hf - 0 9',
    nodes: [22, 593, 13440, 382958, 9183776],
  },
  {
    // castling with the king already on its destination square (g1)
    fen: 'n1bb1rkr/qpnppppp/2p5/p7/P1P5/5P2/1P1PPRPP/NQBBN1KR w Hhf - 1 9',
    nodes: [27, 697, 18724, 505089, 14226907],
  },
  {
    // position without castling rights
    fen: '1nqr1rbb/pppkp1pp/1n3p2/3p4/1P6/5P1P/P1PPPKP1/NNQR1RBB w - - 1 9',
    nodes: [24, 623, 15921, 429446, 11594634],
  },
]

test('chess960 perft', { timeout: 30000 }, () => {
  for (const { fen, nodes } of chess960) {
    const chess = new Chess(fen)
    for (let depth = 1; depth <= 4; depth++) {
      expect(chess.perft(depth), `${fen} depth ${depth}`).toBe(nodes[depth - 1])
    }
  }
})

test('chess960 perft is non-destructive', () => {
  const { fen } = chess960[0]
  const chess = new Chess(fen)
  chess.perft(4)
  chess.perft(2)
  expect(chess.fen()).toBe(fen)
})

test('chess960 castling - king on destination square', () => {
  const chess = new Chess(chess960[4].fen)
  expect(chess.moves()).toContain('O-O')
  const move = chess.move('O-O')
  expect(move.flags).toContain('k')
  // the king doesn't move, but the h1 rook slides over to f1
  expect(chess.get('f1')?.type).toBe('r')
  expect(chess.get('h1')).toBeUndefined()
  expect(chess.getCastlingRights('w')[KING]).toBe(false)
})

test('chess960 castling - king swaps with its rook', () => {
  const chess = new Chess(chess960[2].fen)
  expect(chess.moves()).toContain('O-O')
  chess.move('O-O')
  expect(chess.get('f1')?.type).toBe('r')
  expect(chess.get('g1')?.type).toBe('k')
})

test('validateFen accepts chess960 (Shredder-FEN) castling notation', () => {
  expect(
    validateFen('bqnb1rkr/pppppppp/8/8/8/8/PPPPPPPP/BQNB1RKR w HFhf - 0 1').ok,
  ).toBe(true)
  expect(validateFen('r3k2r/8/8/8/8/8/8/R3K2R w - - 0 1').ok).toBe(true)
  expect(validateFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1').ok).toBe(true)
  expect(validateFen('r3k2r/8/8/8/8/8/8/R3K2R w Hj - 0 1').ok).toBe(false)
})

test('fen() round-trips chess960 castling notation', () => {
  for (const { fen } of chess960) {
    expect(new Chess(fen).fen()).toBe(fen)
  }
})
