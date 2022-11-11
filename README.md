## Introduction

 Remix Challenges is an onchain quiz that uses a zk proof.  People submitting their answers won't reveal their solutions.

  - Why not just code the challenge in Solidity?
  
 All the data in the Ethereum blockchain is public and visible. This means that if the challenge is coded in Solidity, the first user who finds the solution will submit that solution in **a transaction** and thus the solution will be visible by everyone.

 Using zk proof, we only require the user post a proof that the challenge has been successfully completed.

  - Is it possible to double post the same proof?

There are 2 parts to this question - can the same person (address) post the same proof?  And can a different address post the same proof?

Incorporated in the proof is a special parameter named `nullifier` - a number that a user chooses and inputs when generating the proof. Inputting a different nullifier with the correct answers will generate a different proof.

If a user correctly answers the questions and uses "142 as the nullifier when generating the proof, the smart contract will remember that the nullifier `142` has been used.  If another number is used, the proof will be different but will still show that the questions were correctly answered.

 So even when the actual proof becomes public, it won't be possible to re-post that specific proof.  

 An address (a user) can only submit a single proof - even if another `nullifier` is used.  And a `nullifier` can only be used once.

  - If a user knows how to complete a challenge, can he compute with another salt and win the game again?

The contract keeps a mapping of all the users that completed the challenge (using `msg.sender`), it is also possible to ask for a signed nullifier instead of directly using `msg.sender`
 
 ## Completing the challenge

 - clone the following repository in remix `https://github.com/yann300/remix-challenges` .
 - open the file './src/script/compute.ts'.
 - choose value for the inputs and run the script.
 - if the program execute correctly this means that you successfully found the 4 answers.
 - this will also log a proof in the terminal and will save it in a file in the folder named **generated**.
 - this proof can be used in a verifier to prove that you found the 4 values. By doing so, only the proof needs to be shared, you then don't need to share the 4 values, but everyone can be certain that you know these values.
 - go to the next steps.

 ## Mint a remixer using the generated proof

 - switch to the Optimism network.
 - open the file scripts/publish-solution.ts.
 - this call use the proof generated in the previous step `proof.json` for calling the function `publishChallenge` from the remix rewards contract.
 - run the transaction for publishing the solution.
 - once the solution has been published head to https://rewards.remix.ethereum.eth.limo to see the newly created badge.






