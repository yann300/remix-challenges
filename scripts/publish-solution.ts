import { ethers } from 'ethers'

async function main() {
    try {        
        // rewards contract on Optimism.
        const address = "0x5d470270e889b61c08C51784cDC73442c4554011"

        // "signer" represents the current selected account and provider.
        const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()

        const abi = await remix.call('fileManager', 'readFile', 'scripts/contract-rewards.abi')
        
        // we finally use the address, the contract interfact and the current context (provider and account)
        // to instantiate an ethers.Contract object.
        let contract = new ethers.Contract(address, JSON.parse(abi), signer);

        const proof = JSON.parse(await remix.call('fileManager', 'readFile', './generated/proof.json'))
        console.log("oo")
        console.log(proof)
        const txSafeMint = await contract.publishChallenge(proof[0], proof[1])
        
        // this wait for the transaction to be mined.
        const result = await txSafeMint.wait()

        console.log(result)
    } catch (e) {
        console.error(e.message)
    }    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error.message)
});