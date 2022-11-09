import { initialize } from 'zokrates-js'
import { normalize, pack } from './utils'

const run = async (inputs: Array<string>) => {
    console.log('init...')
    const zokratesProvider = await initialize()

    // recompiling
    const source = await remix.call('fileManager', 'readFile', './zokrates/hash.zok')

    // compilation
    const artifacts = zokratesProvider.compile(source);

    console.log('compute program...')
    // computation
    const { output } = zokratesProvider.computeWitness(artifacts, inputs);
    console.log(output)    
}

const message_1 = normalize(0)
const message_2 = normalize("0x33624883795aacf3edd460c4ab80f147011266f6c0eabd9d8c6144d2ccf241d0")
const message_3 = normalize("maurice")
const message_4 = normalize("mve")

run(pack(message_1 + message_2 + message_3 + message_4))
.catch((e: any) => console.log(e.message))

