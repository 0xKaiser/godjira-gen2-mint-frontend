import { ethers } from 'ethers'
import abi from './abi.json'
import axios from "axios"
import genesisabi from './genesisabi.json'

const PRIVATE_TIME = 1646718358
const WHITE_TIME = 1646718358
const GENESIS_TIME = 1646718358


let address
let contractAddress
let contract
let genesisContract
let genesisContractAddress

const value = 0.099
const backend_url = 'https://godjira-backend.herokuapp.com/'
export const providerHandler = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const account = await provider.listAccounts();
    address = account[0];
    const signer = provider.getSigner();
    contractAddress = "0xD16652fFfFc0717bDa8F02e0e1456526d820afc6"
    genesisContractAddress = "0x2286F6EF1DcD3365a9598fbD6786abD799fE3d96"
    contract = new ethers.Contract(contractAddress, abi, signer);
    genesisContract = new ethers.Contract(genesisContractAddress, genesisabi, signer);
    console.log('contracts init done')
};

//wallet address 
export const getAddress = () => {
    return address;
}

//sale functions

// sale function for private list account
export const privateSale = async (privateListedAddress, signature) => {
    const n = await contract.privateSale([privateListedAddress, true, signature], {
        value: ethers.utils.parseEther(`${value}`).toString()
    })
    await n.wait()
}

// sale function for white list account
export const whitelistSale = async (whitelistedAddress, signature) => {
    const n = await contract.whitelistSale([whitelistedAddress, false, signature], {
        value: ethers.utils.parseEther(`${value}`).toString()
    })
    await n.wait()
}

// sale function for genesis holders (pass array of tokenIds)
export const genesisSale = async (tokenIds) => {
    const n = await contract.genesisSale(tokenIds, {
        value: ethers.utils.parseEther(`${value * tokenIds.length}`).toString()
    })
    await n.wait()
}

//claim functions

//claim function for private sales buyers (pass array of tokenIds)
export const privateSalesClaim = async (tokenIds) => {
    const n = await contract.privateSale(tokenIds)
    await n.wait()
}

//claim function for genesis holders (pass array of tokenIds)
export const genesisClaim = async (tokenIds) => {
    const n = await contract.genesisClaim(tokenIds)
    await n.wait()
}

//mapping functions

//sale mapping
// wallet already bought from private sale? return bool
export const privateBought = async (walletAddress) => {
    const n = await contract.privateBought(walletAddress)
    return n;
}

// wallet already bought from genesis sale? return bool
export const genesisBought = async (tokenIds) => {
    
    let unclaimed = []
    for (let i in tokenIds) {   
        const n = await contract.genesisBought(tokenIds[i])
        if(!n){
            unclaimed.push(tokenIds[i])
        }
    }
    console.log(unclaimed)
    return unclaimed
    
    
}

// wallet already bought from whitelistBought sale? return bool
export const whitelistBought = async (walletAddress) => {
    const n = await contract.whitelistBought(walletAddress)
    return n;
}

//claim mapping
//wallet already claimed genesis? return bool
export const genesisClaimed = async (tokenId) => {
    const n = await contract.genesisClaimed(tokenId)
    return n;
}

//wallet already claimed gen2? return bool
export const gen2Claimed = async (tokenId) => {
    const n = await contract.gen2Claimed(tokenId)
    return n;
}

//is in list checker functions
// is in whitelist?

export const isWhiteListed = async (walletAddress) => {
    try {
        const { data } = await axios.post(backend_url + "whitelist", {
            address: walletAddress
        })
        return data.signature

    }
    catch (err) {
        console.log(err)
        return false
    }

}

// is in privatelist?
export const isPrivateListed = async (walletAddress) => {
    console.log('calling isPrivateListed', walletAddress)
    try {
        const { data } = await axios.post(backend_url + "privatelist", {
            address: walletAddress
        })
        //console.log(data.signature)
        return data.signature

    }
    catch (err) {
        console.log(err)
        return false
    }

}

export const isGenesisHolder = async (walletAddress) => {
    const nftCount = await genesisContract.balanceOf(walletAddress)
    console.log(nftCount.toNumber())
    if (nftCount.toNumber() === 0) {
        return false
    }
    else {
        let nft_list = []
        for (let i = 0; i < nftCount.toNumber(); i++) {
            const n = await genesisContract.tokenOfOwnerByIndex(walletAddress, i)
            nft_list.push(n.toNumber())
        }
        console.log(nft_list)
        return nft_list
    }
}

export const isPrivateTime = () => {
    if (Math.floor(Date.now() / 1000) >= PRIVATE_TIME) {
        return true
    }
    else {
        return false
    }
}

export const isWhiteTime = () => {
    if (Math.floor(Date.now() / 1000) >= WHITE_TIME) {
        return true
    }
    else {
        return false
    }
}

export const isGenesisTime = () => {
    if (Math.floor(Date.now() / 1000) >= GENESIS_TIME) {
        return true
    }
    else {
        return false
    }
}

export const connectWalletHandler = async (setLoader, setConnected, setWalletAddress, setExactAddress) => {
    setLoader(true);
    if (window.ethereum) {
        window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then(async (result) => {
                await providerHandler();
                const addr = getAddress()
                setExactAddress(addr)
                console.log(addr)
                let strFirstThree = addr.substring(0, 5);
                let strLastThree = addr.substr(addr.length - 5);
                let address = `${strFirstThree}...${strLastThree}`;
                setWalletAddress(address);
                setConnected(true);
                setLoader(false)
            })
    }
};