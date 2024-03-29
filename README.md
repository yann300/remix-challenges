## Introduction

 Remix Challenges is an onchain quiz that uses a zk proof.  People submitting answers won't reveal their solutions.

  - Why not just code the challenge in Solidity?
  
 All the data in the Ethereum blockchain is public and visible. This means that if the challenge is coded in Solidity, the first user who finds the solution will submit that solution in **a transaction** and thus the solution will be visible by everyone.

 Using zk proof, we only require the user post a **proof** that the challenge has been successfully completed.

  - Is it possible to double post the same proof?

There are 2 parts to this question - can the same person (address) post the same proof?  And can a different address post the same proof?

Incorporated in the proof is a special parameter named `externalNullifier` - a number generated from a timestamp. 
If a different value is used in the nullifier, then a different proof will be generated, but it will still show that the questions were correctly answered. 

The smart contract used for verifying the proof will remember the nullifier.  

An address (a user) can only submit a single proof - even if another `nullifier` is used.  And a `nullifier` can only be used once.

So even when the actual proof becomes public, it won't be possible to re-post that specific proof.  

  - If a user knows how to complete a challenge, can he compute with another salt and win the game again?

The contract keeps a mapping of all the users that completed the challenge (using `msg.sender`), it is also possible to ask for a signed nullifier instead of directly using `msg.sender`
 
 ## Completing the challenge
 ### Setup

 - Clone the following repository in Remix `https://github.com/yann300/remix-challenges`.
 
   - In Remix, to find the **clone** option, go to the hamburger menu at the top of the File Explorer.
   
 - Once the cloned repo has been retrieved, open the file, **verify-solution.ts**, which is in the **scripts** folder.
 
  ### Answering the questions
 - Starting on line 76 of **verify-solution.ts**, input the answers to the questions.
 - Run the script by either right-clicking on the script in the File Explorer or clicking on the green play button.
 - If the program executes correctly, you have successfully answered the 4 questions.

 - In Remix's terminal, you'll see a log of the proof. The script will save this proof in the file named **zk/proof_calldata.json**.
 
 - **If you have not answered the questions correctly**, the proof will NOT be generated and the file **zk/proof_calldata.json** will not be created.
 - This proof can be used in a **verifier** to prove that you found the 4 values. By doing so, only the proof needs to be shared, you don't need to share the 4 values, but everyone can be certain that you know these values.
 - Go to the next steps.

 ## Mint a Remixer Badge using the generated proof

 - Now that you have a proof, you can publish the proof onchain and mint a remixer badge.
 - Switch to the Optimism network. Make sure that in the Deploy & Run plugin, you are connected to Optimism and that your browser wallet (often MetaMask) is also connected there and that you have enough ETH to pay for the minting (usually about 40 cents).
 - Open the file scripts/publish-solution.ts.
 - This script will use the proof generated in the previous section **zk/proof_calldata.json** for calling the function `publishChallenge` in the Remix Rewards contract.
 - Run the transaction for publishing the solution.
 - Once the solution has been published head to https://rewards.remix.ethereum.eth.limo to see the newly created badge.






