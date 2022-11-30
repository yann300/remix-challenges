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

// the hashes a & b are the split hashes of the correct answers
const hash_a = "116575509912205036097134680835176937883"
const hash_b = "58593660297307654186580201841686965660"

////////////////////////////////// Remix Challenge ///////////////////////////////

/*
 nullifier is a random value. Please put in any number. It is used to avoid double spending the proof.
 answer_1 to answer_4 are the solution to the game.
*/
const nullifier = "42" // Please update this to any random value

const answer_1 = normalize("") // Put the answer within quotes e.g; normalize("answer_1")
const answer_2 = normalize("")
const answer_3 = normalize("")
const answer_4 = normalize("")

//////////////////////////////////////////////////////////////////////////////////

const input = pack(answer_1 + answer_2 + answer_3 + answer_4)
const inputs: Array<string> = input.concat([hash_a, hash_b, nullifier])

run(inputs)
.catch((e: any) => console.error(e.message))
