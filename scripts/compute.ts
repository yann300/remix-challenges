import { initialize } from 'zokrates-js'
import { normalize, pack } from './utils'

const run = async (inputs: Array<string>) => {
    console.log('init...')
    const zokratesProvider = await initialize()

    // recompiling
    const source = await remix.call('fileManager', 'readFile', './zokrates/main.zok')

    // compilation
    const artifacts = zokratesProvider.compile(source);

    console.log('compute program...')
    // computation

    let witness
    try {
        let compute  = zokratesProvider.computeWitness(artifacts, inputs);
        witness = compute.witness
    } catch (e) {
        console.log(e)
        console.log("assertion failed, hashes don't correspond")
        return
    }
    

    // retrieve the verification key
    const keypair = JSON.parse(await remix.call('fileManager', 'readFile', './generated/keypair.json'))

    console.log('generate proof...')
    // generate proof
    let result = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk)
    let params = zokratesProvider.utils.formatProof(result)

    params = params.map((p) => JSON.stringify(p)).join(",")
    console.log('proof', params)
    remix.call('fileManager', 'writeFile', './generated/proof.json', JSON.stringify(params))
}

/*
 nullifier is a ramdom value. Please put in any number. It is used to avoid double spending the proof.
 hash_a and hasb_b are provided during the game session.
 the first 4 parameters are used to verify the hash
 message_1 to message_4 are the solution of the game.
*/
const nullifier = "42" // random, please update this value.

// please use the value provided be the challenge
const hash_a = ""
const hash_b = ""

const message_1 = normalize("")
const message_2 = normalize("")
const message_3 = normalize("")
const message_4 = normalize("")
const input = pack(message_1 + message_2 + message_3 + message_4)
const inputs: Array<string> = input.concat([hash_a, hash_b, nullifier])

run(inputs)
.catch((e: any) => console.error(e.message))
