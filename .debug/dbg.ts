import { Chess } from '../src/chess'

const pm0 = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
const r = pm0.premoves('b')
console.log('premoves:', JSON.stringify(r))
