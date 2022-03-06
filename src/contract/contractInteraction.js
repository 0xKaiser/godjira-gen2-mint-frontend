import {ethers} from 'ethers'
import abi from './abi.json'


let address
let contractAddress
let contract

export const providerHandler = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const account = await provider.listAccounts();
    address = account[0];
    const signer = provider.getSigner();
    contractAddress =""

    contract = new ethers.Contract(contractAddress, abi, signer);
    
    console.log('contracts init done')
};

