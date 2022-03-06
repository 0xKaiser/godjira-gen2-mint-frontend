import {ethers} from 'ethers'
import abi from './abi.json'
import axios from "axios"

let address
let contractAddress
let contract

const value =0.099
const backend_url = 'https://godjira-backend.herokuapp.com/'
export const providerHandler = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const account = await provider.listAccounts();
    address = account[0];
    const signer = provider.getSigner();
    contractAddress = "0x0F71f3cC4643cAC976916A48cf98CA096D48B7D2"

    contract = new ethers.Contract(contractAddress, abi, signer);
    
    console.log('contracts init done')
};

//wallet address 
export const getAddress = ()=>{
    return address;
}

//sale functions

// sale function for private list account
export const privateSale = async(privateListedAddress,signature)=> {
    const n = await contract.privateSale([privateListedAddress, true, signature], {
        value:ethers.utils.parseEther(`${value}`).toString()
    })
    await n.wait()
}

// sale function for white list account
export const whitelistSale = async(whitelistedAddress,signature)=> {
    const n = await contract.whitelistSale([whitelistedAddress, false, signature], {
        value:ethers.utils.parseEther(`${value}`).toString()
    })
    await n.wait()
}

// sale function for genesis holders (pass array of tokenIds)
export const genesisSale = async(tokenIds)=> {
    const n = await contract.genesisSale(tokenIds, {
        value:ethers.utils.parseEther(`${value * tokenIds.length}`).toString()
    })
    await n.wait()
}

//claim functions

//claim function for private sales buyers (pass array of tokenIds)
export const privateSalesClaim = async(tokenIds)=> {
    const n = await contract.privateSale(tokenIds)
    await n.wait()
}

//claim function for genesis holders (pass array of tokenIds)
export const genesisClaim = async(tokenIds)=> {
    const n = await contract.genesisClaim(tokenIds)
    await n.wait()
}

//mapping functions

//sale mapping
// wallet already bought from private sale? return bool
export const privateBought = async(walletAddress) => {
    const n = await contract.privateBought(walletAddress)
    return n;
}

// wallet already bought from genesis sale? return bool
export const genesisBought = async(tokenId) => {
    const n = await contract.genesisBought(tokenId)
    return n;
}

// wallet already bought from whitelistBought sale? return bool
export const whitelistBought = async(walletAddress) => {
    const n = await contract.whitelistBought(walletAddress)
    return n;
}

//claim mapping
//wallet already claimed genesis? return bool
export const genesisClaimed = async(tokenId) => {
    const n = await contract.genesisClaimed(tokenId)
    return n;
}

//wallet already claimed gen2? return bool
export const gen2Claimed = async(tokenId) => {
    const n = await contract.gen2Claimed(tokenId)
    return n;
}

//is in list checker functions
// is in whitelist?

export const isWhiteListed = async(walletAddress) => {
    try{
        const {data} = await axios.post(backend_url+"whitelist", {
            address: walletAddress
        })
        return data.signature
    
    }
    catch(err) {
        console.log(err)
        return false
    }

}

// is in privatelist?
export const isPrivateListed = async(walletAddress) => {
    try{
        const {data} = await axios.post(backend_url+"privatelist", {
            address: walletAddress
        })
        return data.signature
    
    }
    catch(err) {
        console.log(err)
        return false
    }

}
