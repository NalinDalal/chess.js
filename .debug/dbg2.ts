import { Chess } from '../src/chess'

const c = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
c.move('Kd2')
const bm: any[] = (c as any)._moves({ legal: true })
c.undo()

for (const m of bm) {
  const before = (c as any)._turn
  ;(c as any)._makeMove(m)
  const after = (c as any)._turn
  const mk = (c as any)._makeMove.toString()
  console.log('make K to', m.to, 'turn before:', before, 'after:', after)
  const wm: any[] = (c as any)._moves()
  console.log('  white moves (turn', (c as any)._turn + '):', wm.length, JSON.stringify(wm.map((x: any) => x.from + '->' + x.to + 'flags' + x.flags)))
  console.log('  isCheck:', c.isCheck(), 'isCheckmate:', c.isCheckmate())
  ;(c as any)._undoMove()
}
