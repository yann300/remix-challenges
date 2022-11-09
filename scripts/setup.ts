import { initialize } from 'zokrates-js'

const run = async () => {
    console.log('init...')
    const zokratesProvider = await initialize()

    // recompiling
    const source = await remix.call('fileManager', 'readFile', './zokrates/main.zok')

    // compilation
    const artifacts = zokratesProvider.compile(source);

    // run setup
    console.log('setup...')
    const keypair = zokratesProvider.setup(artifacts.program);

    // save the verification and proof key
    await remix.call('fileManager', 'writeFile', './generated/keypair.json', JSON.stringify(keypair))

    console.log('verification and proof key generated.')

    // export solidity verifier
    const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk);

    await remix.call('fileManager', 'writeFile', './contracts/verifier.sol', verifier)
    console.log('verifier contract updated.')
}

run()
.catch((e: any) => console.error(e.message))