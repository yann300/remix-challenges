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

export const pack = (value: string) => {
    const hex = ethers.utils.sha256(ethers.utils.toUtf8Bytes(value))
    let num = ethers.BigNumber.from(hex)
    num = num.toString()
    console.log(num)
    const length = num.length / 4
    return [num.substr(0, length), num.substr(length, length), num.substr(2 * length - 1, length), num.substr(3 * length - 1)]
}

