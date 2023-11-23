import { poseidon } from "circomlibjs" // v0.0.8
import { normalize } from "./utils"

(async () => {
  try {
    const value1 = normalize('answer 1')
    const value2 = normalize('answer 2')
    const value3 = normalize('answer 3')
    const value4 = normalize('answer 4')
    console.log(poseidon([value1, value2, value3, value4]))
  } catch (e) {
    console.error(e.message)
  }
})()