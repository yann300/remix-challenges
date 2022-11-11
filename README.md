  ## Introduction

 The goal is to propose a challenge, to submit this challeng onchain without actually revealing the solution of the challenge.

  - why not just code the challenge in solidity?
  
 All the datas in the ethereum blockchain are public and visible. This means that if the challenge is coded in solidity, the first user who find the solution will post that solution in a transaction and thus the solution will be visible by everyone.

 Using zk proof we only require the user to post a proof that the challenge is successfully completed.

  - is it possible to double post the same proof?
  
 There is a special parameter named `nullifier`.
 If user A complete the challenge with the nullifier being "142" and a certain proof 1, the smart contract will remember that the nullifier `142` has been consumed.
 So even when the actual proof becomes public, it won't be possible to repost again that proof. 
 If another user want to post the proof 1 with another nullifier (let's say 143), this won't work because the proof 1 is intrinsincly associated with the nullifier "142".
 This other user needs then to recompute a proof and specify 143 for the nullifier.

  - if an user knows how to complete a challenge he can compute with another salt and win the game again?

 For fixing this issue, we need, in the contract, to keep a mapping of all the users that completed the challenge (using `msg.sender`), it is also possible to ask for a signed nullifier instead of directly using `msg.sender`
 
 ## Trusted Setup
 
 TODO
 
 ## Completing the challenge

 - clone the following repository: `git clone https://github.com/yann300/remix-challenges`
 - open the file './src/script/compute.ts'
 - choose value for inputs and run the script
 - if the program execute correctly this means that you successfully found the 4 messages.
 - this will also log a proof in the terminal.
 - this proof can be used in a verifier to prove that you found the 4 values. By doing so, only the proof needs to be shared, you then don't need to share the 4 values, but everyone can be certain that you know these values.

 ## Mint a remixer using the generated proof

 - switch to the Optimism network
 - open the file scripts/publish-solution.ts
 - this call use the proof generated in the previous step `proof.json` for calling the function `publishChallenge` from the remix rewards contract.
 - run the transaction for publishing the solution.






