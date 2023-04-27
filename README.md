## Introduction

 Remix Challenges is an onchain quiz that uses a zk proof.  People submitting answers won't reveal their solutions.

  - Why not just code the challenge in Solidity?
  
 All the data in the Ethereum blockchain is public and visible. This means that if the challenge is coded in Solidity, the first user who finds the solution will submit that solution in **a transaction** and thus the solution will be visible by everyone.

 Using zk proof, we only require the user post a **proof** that the challenge has been successfully completed.

  - Is it possible to double post the same proof?

There are 2 parts to this question - can the same person (address) post the same proof?  And can a different address post the same proof?

Incorporated in the proof is a special parameter named `nullifier` - a number that a user chooses and inputs when generating the proof. Inputting a different nullifier with the correct answers will generate a different proof.

If a user correctly answers the questions and uses "142 as the nullifier when generating the proof, the smart contract will remember that the nullifier `142` has been used.  If another number is used, the proof will be different but will still show that the questions were correctly answered.

 So even when the actual proof becomes public, it won't be possible to re-post that specific proof.  

 An address (a user) can only submit a single proof - even if another `nullifier` is used.  And a `nullifier` can only be used once.

  - If a user knows how to complete a challenge, can he compute with another salt and win the game again?

The contract keeps a mapping of all the users that completed the challenge (using `msg.sender`), it is also possible to ask for a signed nullifier instead of directly using `msg.sender`
 
 ## Completing the challenge
 ### Setup

 - Clone the following repository in Remix `https://github.com/yann300/remix-challenges` .
 - Open the file './src/script/compute.ts'.
 - On line 54 of compute.ts, choose at random a new nullifier.
  ### Answering the questions
 - Starting on line 56 of compute.ts, input the answers to the questions.
 - Run the script by either Rt-clicking on the script in the File Explorer or clicking on the green play button.
 - If the program executes correctly, you have successfully found the 4 answers.
 - In Remix's terminal, you'll see a log of the proof.  The script will save this proof in a file in the folder named **generated**.
 - **If you have not answered the questions correctly**, the proof will NOT be generated and the file `generated/proof.json` will not be created.
 - This proof can be used in a **verifier** to prove that you found the 4 values. By doing so, only the proof needs to be shared, you don't need to share the 4 values, but everyone can be certain that you know these values.
 - Go to the next steps.

 ## Mint a Remixer Badge using the generated proof

 - Switch to the Optimism network. Make sure that in the Deploy & Run plugin, you are connected to Optimism and that your browser wallet (often MetaMask) is also connected there and that you have enough ETH to pay for the minting (usually about 40 cents).
 - Open the file scripts/publish-solution.ts.
 - This script will use the proof generated in the previous section `generated/proof.json` for calling the function `publishChallenge` in the Remix Rewards contract.
 - Run the transaction for publishing the solution.
 - Once the solution has been published head to https://rewards.remix.ethereum.eth.limo to see the newly created badge.






