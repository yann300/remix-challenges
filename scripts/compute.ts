import { initialize } from 'zokrates-js'
import { normalize, pack } from './utils'

const run = async (inputs: Array<string>) => {
    console.log('init...')
    const zokratesProvider = await initialize()

    // recompiling
    const source = await remix.call('fileManager', 'readFile', './zokrates/main.zok')

    // compilation
    const artifacts = zokratesProvider.compile(source);

    console.log('compute program... this might take some time.')
    // computation

    let witness
    try {
        let compute  = zokratesProvider.computeWitness(artifacts, inputs);
        witness = compute.witness
    } catch (e) {
        console.log(e)
        console.log("assertion failed, hashes don't correspond. One or more of the answers were not correct.")
        return
    }
    

    // retrieve the verification key
    const keypair = JSON.parse(await remix.call('fileManager', 'readFile', './generated/keypair.json'))

    console.log('generate proof...')
    // generate proof
    let result = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk)
    let params = zokratesProvider.utils.formatProof(result)

    params = '[' + params.map((p) => JSON.stringify(p)).join(",") + ']'
    console.log('proof:', params)
    console.log('You succesfully responded to all questions. Please go to publish-solution.ts in order to send the proof to the remix rewards contract.')
    remix.call('fileManager', 'writeFile', './generated/proof.json', params)
}

/*
 nullifier is a ramdom value. Please put in any number. It is used to avoid double spending the proof.
 hash_a and hasb_b are provided during the game session.
 question_1 to question_4 are the solution to the game.
*/
const nullifier = "42" // random, please update this value.

// the hashes a & b are the split hashes of the correct answers
const hash_a = "153698106647855235837040889108518086801"
const hash_b = "273799279973476634723824292833734726069"

const question_1 = normalize("")
const question_2 = normalize("")
const question_3 = normalize("")
const question_4 = normalize("")
const input = pack(question_1 + question_2 + question_3 + question_4)
const inputs: Array<string> = input.concat([hash_a, hash_b, nullifier])

run(inputs)
.catch((e: any) => console.error(e.message))
