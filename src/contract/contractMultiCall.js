import { Contract, Provider } from 'ethers-multicall';
import { ethers } from 'ethers';

import gen2abi from './gen2abi.json';




const gen2address = '0xEDc3AD89f7b0963fe23D714B34185713706B815b';

export async function call(address) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const ethcallProvider = new Provider(provider);

  await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor

  const gen2contract = new Contract(gen2address, gen2abi);

  let call_array = []
  for(let i = 340; i <440; i++) {
    const call = gen2contract.ownerOf(i);
    call_array.push(call)
  }

  const rec_call = await ethcallProvider.all(call_array);
  console.log(rec_call)
  let nft_array =[]
  for(let i = 340; i <440; i++) {
    if(call_array[i]==address){
        nft_array.push(i)
        console.log(i)
    }
    
  }
  return nft_array
}

