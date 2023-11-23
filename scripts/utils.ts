import { ethers } from 'ethers'

export const normalize = (value: any) => {
    if (typeof value === 'string') {
        value = value.replace(/\s/g,'').toLowerCase()
        const hex = ethers.utils.sha256(ethers.utils.toUtf8Bytes(value))
        const num = ethers.BigNumber.from(hex)
        return num.toString()
    }
    if (typeof value === 'number') {
        const num = ethers.BigNumber.from(value)
        return num.toString()
    }
    throw new Error("can't handle the input " + value)
}