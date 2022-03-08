import React, { useState } from "react";
import { providerHandler, getAddress, isWhiteListed, isPrivateListed,  isGenesisHolder, privateSale, whitelistSale, genesisSale, privateBought, whitelistBought, genesisBought} from "./../contract/contractInteraction";

const TextComponent = (props) => {
  const connectWalletHandler = async () => {
    console.log("Inside it")
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (result) => {
          await providerHandler();
          setConnected(true);
          const addr = getAddress()
          let strFirstThree = addr.substring(0, 5);
          let strLastThree = addr.substr(addr.length - 5);
          let address = `${strFirstThree}...${strLastThree}`;
          setWalletAddress(address);

          let isPrivateListedRes = await isPrivateListed(addr)
          let privateBoughtRes = await privateBought(privateListed)
          
          let isWhiteListedRes = await isWhiteListed(addr)
          let whitelistBoughtRes = await whitelistBought(whiteListed)

          let isGenesisHolderRes = await isGenesisHolder(addr)
          let genesisBoughtres = await genesisBought(genesisHolder)

          // let genesisClaimed = await genesisClaimed(genesisHolder)
          // let gen2Claimed = await gen2Claimed(genesisHolder)

          setPrivateListed(isPrivateListedRes)
          setWhiteListed(isWhiteListedRes)
          setGenesisHolder(isGenesisHolderRes)
          setPrivateBought(privateBoughtRes)
          setWhitelistBoughtRes(whitelistBoughtRes)
          setGenesisBoughtres(genesisBoughtres)
        })
    }
  };

  //privateSale(walletAddress, privateListed)
  //genesisBought(genesisHolder)

  const [privateListed, setPrivateListed] = useState(false);
  const [whiteListed, setWhiteListed] = useState(false);
  const [genesisHolder, setGenesisHolder] = useState(false);

  const [privateBoughtInitiated, setPrivateBought] = useState(false);
  const [whitelistBoughtInitiated, setWhitelistBoughtRes] = useState(false);
  const [genesisBoughtInitiated, setGenesisBoughtres] = useState(false);

  const [connected, setConnected] = useState(false);

  const [minted, setMinted] = useState(false);


  const [walletAddress, setWalletAddress] = useState("")

  const mintToken = () => {
    console.log("YES.....", privateListed, whiteListed, genesisHolder, privateBoughtInitiated, whitelistBoughtInitiated, genesisBoughtInitiated)
    if (privateListed && !privateBoughtInitiated) {
      privateSale(walletAddress, privateListed)
      alert("Minted Successfully");
    } 
    if (whiteListed && !whitelistBoughtInitiated) {
      privateSale(walletAddress, whiteListed)
      alert("Minted Successfully");
    } 
    if (genesisHolder && !genesisBoughtInitiated) {
      privateSale(walletAddress, genesisHolder)
      alert("Minted Successfully");
    } 
  };

  return (
    <div className="textContainer">
      <div className="gen-2-logo">
        {!connected? <img
          style={{ width: "450px", height: "200px", marginTop: "12%" }}
          src={require("../assets/Group 13081@2x.png")}
        />: <img
        style={minted ? { width: "450px", height: "200px", marginLeft: "6%", marginTop: "auto" } : { width: "450px", height: "200px",marginLeft: "29%", marginTop: "12%" }}
        src={require("../assets/Group 13081@2x.png")}
      />}
      </div>
      <div className="connect-mint-button">
        {connected ? (
          minted ? (
            <div className="message">
              SORRY ONLY ONE MINT PER WALLET...
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
                  WELCOME PRIVATE LIST MEMBER. YOU CAN MINT A GEN2 GODJIRA NOW!
                  HOLD YOUR JIRA TO CLAIM A FREE JIRA AFTER 12 MARCH
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
            onClick={connectWalletHandler}
          >
            <span>
              <img style={{ marginRight: "12px", width: "30px", height: "30px" }} src={require("../assets/wallet.png")} />
            </span>
            CONNECT
          </button>
        )}
      </div>
    </div>
  );
};

export default TextComponent;
