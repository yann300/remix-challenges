import { ethers } from 'ethers'

export const normalize = (value: string) => {
    value = value.replace(/\s/g,'').toLowerCase()
    const hex = ethers.utils.sha256(ethers.utils.toUtf8Bytes(value))
    const num = ethers.BigNumber.from(hex)
    return num.toString()
}