  ## Why using this methods?

 The goal is to allow learner to mint a badge when a step is achieved (workshop done, new skill leaner, ...).
 There are a few obvious possibilities:

  - let the administrator of the contract to mint all the badges.
  - white list the addresses which will have the abilities to mint such a badge. each participant needs then to call the contract in order to claim its badge.

 Both solutions are incomplete mainly because one would need to know the list of addresses beforehand. Also the list can change, and could need to be updated, which would give a lot of overhead for the contract administrator.

 The solution below is a way more flexible because it only requires the user to complete a challenge. Addresses will be automatically "white listed" once the challenge is completed and it doesn't require any action for the contract administrator.

 One question remains: why not just code the challenge in solidity?
 All the datas in the ethereum blockchain are public and visible. This means that if the challenge is coded in solidity, the first user who find the solution will post that solution in a transaction and thus the solution will be visible by everyone.

 Using zk proof we only require the user to post a proof that the challenge is successfully completed.

 Another question arise: it is then still possible double post the same proof isn't it?
 The zk program has 4 parameters: the first 4 params are used to complete the challenge, the 5th param is a salt, e.g any possible value that will alter the proof it self.
 For instance if user A complete the challenge with the salt being "142" and a certain proof 1, the smart contract should keep a mapping which allows to remember that the salt "142" was consumed.
 So even if the actual proof becomes public (as any data in the blockchain is public), it won't be possible to repost again that proof. 
 If another user want to post the proof 1 with another salt (let's say 143), this won't work because the proof 1 is intrinsincly associated witht the salt "142".
 This other user needs then to recompute a proof and specify 143 for the salt (or any other value).

 Then well, if an user knows how to complete a challenge he can compute with another salt and win the game again?

 For fixing this issue, we need, in the contract, to keep a mapping of all the users that completed the challenge (using msg.sender), it is also possible to make the salt to be a signature, we then need to verify that a signature has been processed by a given adrdress.


 ## Completing the challenge

 - install remixd by running `npm i @remix-project/remixd` . it allows to share a local folder with remix.
 - clone the following repository: `git clone https://github.com/yann300/remix-challenges`
 - go to that folder and run `remixd`
 - open https://remix.ethereum.org and select "Connect to localhost"
 - open the file './src/script/compute.ts'
 - choose value for inputs and run the script
 - if the program execute correctly this means that you successfully found the 4 values that lead to the hash hardcoded in the program.
 - this will also log a proof in the terminal.
 - this proof can be used in a verifier to prove that you found the 4 values. By doing so, only the proof needs to be shared, you then don't need to share the 4 values, but everyone can be certain that you know these values.

 ## Mint a remixer

 - open Remix, clone https://github.com/yann300/remix-reward
 - compile the contract
 - switch to Optimism
 - see the file scripts/remixerMint.ts
 - in this script set the Proof from the previous step and run the script
 - if the proof is valid, a remixer badge will be minted.
 - the proof is enough, I didn't need to make the 4 values public.






