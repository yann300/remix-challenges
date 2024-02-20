import { ethers } from 'ethers'
import { challenges } from '../challenges'
import { getRewardAddress } from './contract_addresses'

async function main() {
    try {        
        // rewards contract
        const address = await getRewardAddress()

        // "signer" represents the current selected account and provider.
        const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()

        const abi = await remix.call('fileManager', 'readFile', 'abi/contract-rewards.abi')
        
        // we finally use the address, the contract interfact and the current context (provider and account)
        // to instantiate an ethers.Contract object.
        let contract = new ethers.Contract(address, JSON.parse(abi), signer);

        const proof = JSON.parse(await remix.call('fileManager', 'readFile', 'zk/proof_calldata.json'))
        
        console.log(proof)
        console.log('publishing the solution...')
        let proofStruct = {
            a: proof[0],
            b: proof[1],
            c: proof[2]
        }
        const txSafeMint = await contract.publishChallenge(proofStruct, proof[3])
        
        // this wait for the transaction to be mined.
        const result = await txSafeMint.wait()

        console.log(result)

        console.log('the solution has been published. Please head to https://rewards.remix.ethereum.eth.limo to see the newly created badge.')
    } catch (e) {
        console.error(e.message)
    }    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error.message)
});
