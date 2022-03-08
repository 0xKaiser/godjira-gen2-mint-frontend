import React, { useState, useEffect } from "react";
import { connectWalletHandler, isPrivateTime, isGenesisTime ,isWhiteTime, isWhiteListed, isPrivateListed, isGenesisHolder, privateSale, whitelistSale, genesisSale, privateBought, whitelistBought, genesisBought } from "./../contract/contractInteraction";

const TextComponent = (props) => {

  const [privateListed, setPrivateListed] = useState(false);
  const [whiteListed, setWhiteListed] = useState(false);
  const [genesisHolder, setGenesisHolder] = useState(false);

  const [privateBoughtInitiated, setPrivateBought] = useState(false);
  const [whitelistBoughtInitiated, setWhitelistBoughtRes] = useState(false);
  const [genesisBoughtInitiated, setGenesisBoughtRes] = useState(false);

  const [connected, setConnected] = useState(false);

  const [minted, setMinted] = useState(false);

  const [textMessage, setTextMessage] = useState("")

  const [loader, setLoader] = useState(false)

  const [walletAddress, setWalletAddress] = useState("")
  const [exactAddress, setExactAddress] = useState("hbdcjbdwjbvjb")

  useEffect(() => {
    if(connected === true){
      check();
    }
  }, [connected]);

  const check = async () => {
    setLoader(true)
    let genesisBoughtRes = []
    let isPrivateListedRes = await isPrivateListed(exactAddress)
    setPrivateListed(isPrivateListedRes)
    let privateBoughtRes = await privateBought(exactAddress)
    setPrivateBought(privateBoughtRes)
    let isWhiteListedRes = await isWhiteListed(exactAddress)
    setWhiteListed(isWhiteListedRes)
    let whitelistBoughtRes = await whitelistBought(exactAddress)
    setWhitelistBoughtRes(whitelistBoughtRes)
    
    let isGenesisHolderRes = await isGenesisHolder(exactAddress)
    if(isGenesisHolderRes){
      setGenesisHolder(isGenesisHolderRes)
      genesisBoughtRes = await genesisBought(isGenesisHolderRes)
      console.log(genesisBoughtRes, "initial res")
      setGenesisBoughtRes(genesisBoughtRes)
    }


    //Setting text MESSAGE 
    if(isPrivateListedRes)setTextMessage(msg.private)
    if(isWhiteListedRes)setTextMessage(msg.whiteList)
    if(isGenesisHolderRes)setTextMessage(msg.genesis)

    // let genesisClaimed = await genesisClaimed(genesisHolder)
    // let gen2Claimed = await gen2Claimed(genesisHolder)
    
    setLoader(false)
  }

  console.log(genesisBoughtInitiated, "hgfdsdfghjgyftdrf")

  const connectWallet = async () => {
    console.log("CLICKED ON Connect wallet")
    await connectWalletHandler(setLoader, setConnected, setWalletAddress, setExactAddress)
  }

  const msg = {
    private: "WELCOME PRIVATE LIST MEMBER. YOU CAN MINT A GEN2 GODJIRA NOW! HOLD YOUR JIRA TO CLAIM A FREE JIRA AFTER 12 MARCH",
    whiteList: "WELCOME WHITE LIST MEMBER. YOU CAN MINT A GEN2 GODJIRA NOW!",
    genesis: `Welcome HODLer of Genesis Jira ${genesisHolder} . You have already minted gen2 Jiras HOLD your Genesis Jira to claim a free gen2 Jira`
  }

  const mintToken = async () => {
    console.log("YES.....", privateListed, whiteListed, genesisHolder, privateBoughtInitiated, whitelistBoughtInitiated, genesisBoughtInitiated)
    if (privateListed) {
      let privateTime = isPrivateTime()
      if(!privateTime){
        alert("Private sale not started.")
        return 
      }
      if (privateBoughtInitiated) {
        //alert("You have already minted")
      } else {
        await privateSale(exactAddress, privateListed)
        alert("Minted Successfully");
      }
    }
    if (whiteListed) {
      let whiteListTime = isWhiteTime()
      if(!whiteListTime){
        alert("WhiteList sale not started.")
        return 
      }
      if (whitelistBoughtInitiated) {
        //alert("You have already minted")
      } else {
        await whitelistSale(exactAddress, whiteListed)
        alert("Minted Successfully");
      }
    }
    if (genesisHolder) {
      let genesisTime = isGenesisTime()
      if(genesisTime){
        alert("Genesis sale not started.")
        return 
      }
      if (genesisBoughtInitiated) {
        // alert("You have already minted")
      } else {
        await genesisSale(genesisHolder)
        alert("Minted Successfully");
      }
    }
  };

  return (
    <>
      {loader ? <div className="loader">Loading...</div> : <div className="textContainer">
        <div className="gen-2-logo">
          {!connected ? <img
            style={{ width: "450px", height: "200px", marginTop: "12%" }}
            src={require("../assets/Group 13081@2x.png")}
          /> : <img
            style={{ width: "450px", height: "200px", marginLeft: "29%", marginTop: "12%" }}
            src={require("../assets/Group 13081@2x.png")}
          />}
        </div>
        <div className="connect-mint-button">
          {connected ? (
            false ? (
              <div className="message">
                YOU HAVE ALREADY MINTED
              </div>
            ) : (
              <>
                {connected && !minted && <>
                  <div className="wallet-address">
                    {walletAddress}
                  </div>
                  <div className="wallet-address-connected">
                    CONNECTED
                  </div>
                  <div className="wallet-address-text">
                    {textMessage}
                  </div>
                </>}
                <button
                  className="connect-wallet-button-mint"
                  onClick={() => {
                    mintToken();
                  }}
                >
                  MINT NOW!
                </button>
                {/* <div className="number-of-mint">
              <span className="osake-font-apply">2500 </span>LEFT
            </div> */}
              </>
            )
          ) : (
            <button
              className="connect-wallet-button-initial"
              onClick={() => connectWallet()}
            >
              <span>
                <img style={{ marginRight: "12px", width: "30px", height: "30px" }} src={require("../assets/wallet.png")} />
              </span>
              CONNECT
            </button>
          )}
        </div>
      </div>}
    </>
  );
};

export default TextComponent;
