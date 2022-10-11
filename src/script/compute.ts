import { initialize } from 'zokrates-js'

const run = async (inputs: Array<string>) => {
    console.log('init...')
    const zokratesProvider = await initialize()

    // recompiling
    const source = await remix.call('fileManager', 'readFile', './src/zokrates/main.zok')

    // compilation
    const artifacts = zokratesProvider.compile(source);

    console.log('compute program...')
    // computation
    const { witness } = zokratesProvider.computeWitness(artifacts, inputs);

    // retrieve the verification key
    const keypair = JSON.parse(await remix.call('fileManager', 'readFile', './generated/keypair.json'))

    console.log('generate proof...')
    // generate proof
    let result = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk)
    let params = zokratesProvider.utils.formatProof(result)

    console.log('proof', params.map((p) => JSON.stringify(p)).join(","))    
}

const inputs: Array<string> = ["1", "2", "3", "4"]

run(inputs)
.then((e: any) => console.log(e))
.catch((e: any) => console.error(e))