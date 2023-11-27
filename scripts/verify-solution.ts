import { poseidon } from "circomlibjs" // v0.0.8
import { normalize } from "./utils"
import { challenges } from '../challenges'
import { ZqField } from 'ffjavascript'
const SNARK_FIELD_SIZE = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617')

// Creates the finite field
const Fq = new ZqField(SNARK_FIELD_SIZE)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const snarkjs = require('snarkjs');

const logger = {
  info: (...args) => console.log(...args),
  debug: (...args) => console.log(...args),
  error: (...args) => console.error(...args),
}

const main = async (value1, value2, value3, value4) => {
  try {
    // @ts-ignore
    const r1csBuffer = await remix.call('fileManager', 'readFile', 'circuits/.bin/calculate_hash.r1cs', true);
    // @ts-ignore
    const r1cs = new Uint8Array(r1csBuffer);
    // @ts-ignore
    const wasmBuffer = await remix.call('fileManager', 'readFile', 'circuits/.bin/calculate_hash.wasm', true);
    // @ts-ignore
    const wasm = new Uint8Array(wasmBuffer);   
     
    const zkey_final = {
      type: "mem",
      data: new Uint8Array(JSON.parse(await remix.call('fileManager', 'readFile', './zk/build/zk_setup.txt')))
    }
    const wtns = { type: "mem" };   

    const vKey = JSON.parse(await remix.call('fileManager', 'readFile', './zk/build/verification_key.json'))  
    
    const signals = {
      value1,
      value2,
      value3,
      value4,
      hash: challenges[0].hash,
      externalNullifier: Date.now()
    }
    
    console.log('calculate')
    await snarkjs.wtns.calculate(signals, wasm, wtns);
    
    console.log('check')
    await snarkjs.wtns.check(r1cs, wtns, logger);
    

    console.log('prove')
    const { proof, publicSignals } = await snarkjs.groth16.prove(zkey_final, wtns);
    
    console.log('out - nullifier hash:', publicSignals[0])
    console.log('in - challenge hash:', publicSignals[1])
    console.log('in - nullifier:', publicSignals[2])
    const verified = await snarkjs.groth16.verify(vKey, publicSignals, proof, logger);

    const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals)
    console.log('calldata', calldata)
    remix.call('fileManager', 'writeFile', 'zk/proof.json', JSON.stringify(proof, null, '\t'))    
    remix.call('fileManager', 'writeFile', 'zk/proof_calldata.json', JSON.stringify(JSON.parse('[' + calldata + ']'), null, '\t'))

    console.log('zk proof validity', verified)
    console.warn('A proof has been generated! You may use it to publish your solution onchain. Please now run the publish-solution.ts .')
    
  } catch (e) {
    console.error(e.message)
    if (e.message.indexOf('Assert Failed') !== -1) console.error(`The hash doesn't match with the provided answers`)    
  }
}

const value1 = normalize('answer 1')
const value2 = normalize('answer 2')
const value3 = normalize('answer 3')
const value4 = normalize('answer 4')    

main(value1, value2, value3, value4)