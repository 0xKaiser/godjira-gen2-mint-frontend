import React, { useState, useEffect } from "react";
import {
  connectWalletHandler,
  isPrivateTime,
  isGenesisTime,
  isWhiteTime,
  isWhiteListed,
  isPrivateListed,
  isGenesisHolder,
  privateSale,
  whitelistSale,
  genesisSale,
  privateBought,
  whitelistBought,
  genesisBought,
  genesisClaim,
  gen2Claimed,
  genesisClaimed,
} from "./../contract/contractInteraction";
import {call} from "./../contract/contractMultiCall"

const TextComponent = (props) => {
  const [privateListed, setPrivateListed] = useState(false);
  const [whiteListed, setWhiteListed] = useState(false);
  const [genesisHolder, setGenesisHolder] = useState(false);
  const [privateBoughtInitiated, setPrivateBought] = useState(false);
  const [whitelistBoughtInitiated, setWhitelistBoughtRes] = useState(false);
  const [genesisBoughtInitiated, setGenesisBoughtRes] = useState(null);
  const [connected, setConnected] = useState(false);
  const [minted, setMinted] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [exactAddress, setExactAddress] = useState("hbdcjbdwjbvjb");

  //for Claiming
  const [claimTimeActivated, setClaimTimeActivated] = useState(false);
  const [gen2active, setGen2Active] = useState(false);
  const [genesisActive, seGenesisActive] = useState(false)

  useEffect(() => {
    if (connected === true) {
      check();
      
    }
  }, [connected]);
  console.log(genesisBoughtInitiated, "hgfdsdfghjgyftdrf");

  const check = async () => {
    setLoader(true);
    let isPrivateListedRes = await isPrivateListed(exactAddress);
    setPrivateListed(isPrivateListedRes);
    let privateBoughtRes = await privateBought(exactAddress);
    setPrivateBought(privateBoughtRes);
    let isWhiteListedRes = await isWhiteListed(exactAddress);
    setWhiteListed(isWhiteListedRes);
    let whitelistBoughtRes = await whitelistBought(exactAddress);
    setWhitelistBoughtRes(whitelistBoughtRes);

    let isGenesisHolderRes = await isGenesisHolder(exactAddress);
    if (isGenesisHolderRes) {
      setGenesisHolder(isGenesisHolderRes);
      let genesisBoughtRes = await genesisBought(isGenesisHolderRes);
      console.log(genesisBoughtRes, "initial res");
      setGenesisBoughtRes(genesisBoughtRes);
    }

    //Setting text MESSAGE
    if (isPrivateListedRes) setTextMessage(msg.private);
    if (isWhiteListedRes) setTextMessage(msg.whiteList);
    if (isGenesisHolderRes) setTextMessage(msg.genesis);

    // let genesisClaimed = await genesisClaimed(genesisHolder)
    // let gen2Claimed = await gen2Claimed(genesisHolder)
    call(exactAddress);
    setLoader(false);
  };

  const connectWallet = async () => {
    console.log("CLICKED ON Connect wallet");
    await connectWalletHandler(
      setLoader,
      setConnected,
      setWalletAddress,
      setExactAddress
    );
  };

  const msg = {
    private:
      "WELCOME PRIVATE LIST MEMBER. YOU CAN MINT A GEN2 GODJIRA NOW! HOLD YOUR JIRA TO CLAIM A FREE JIRA AFTER 12 MARCH",
    whiteList: "WELCOME WHITE LIST MEMBER. YOU CAN MINT A GEN2 GODJIRA NOW!",
    genesis: `Welcome HODLer of Genesis Jira ${genesisHolder} . You have already minted gen2 Jiras HOLD your Genesis Jira to claim a free gen2 Jira`,
  };

  //TODO
  const claim = () => {
    if (isGenesis()) {
      let resp = genesisClaimed()
      if (resp) {
        genesisClaim()
      }
    } else if (isGen2Claim) {
      let res = gen2Claimed()
      if (res) {
        gen2Claim()
      }
    }
  }

  const mintToken = async () => {
    setLoader(true)
    console.log(
      "YES.....",
      privateListed,
      whiteListed,
      genesisHolder,
      privateBoughtInitiated,
      whitelistBoughtInitiated,
      genesisBoughtInitiated
    );
    if (privateListed) {
      console.log(privateListed, "privateListed");
      let privateTime = isPrivateTime();
      if (!privateTime) {
        alert("Private sale not started.");
        return;
      }
      if (privateBoughtInitiated) {
        // alert("You have already minted");
        return true;
      } else {
        await privateSale(exactAddress, privateListed);
        //alert("Minted Successfully");
      }
    }
    else if (whiteListed) {
      let whiteListTime = isWhiteTime();
      if (!whiteListTime) {
        alert("WhiteList sale not started.");
        return;
      }
      if (whitelistBoughtInitiated) {
        // alert("You have already minted");
        return true;
      } else {
        await whitelistSale(exactAddress, whiteListed);
        //alert("Minted Successfully");
      }
    }
    else if (genesisHolder) {
      console.log(genesisHolder, "genesisHolder");
      let genesisTime = isGenesisTime();
      if (!genesisTime) {
        alert("Genesis sale not started.");
        return;
      }
      if (!genesisBoughtInitiated) {
        // alert("You have already minted");
        return true;
      } else {
        await genesisSale(genesisBoughtInitiated);
        //alert("Minted Successfully");
      }
    }
    setLoader(false)
  };
  console.log(whiteListed, "whiteListed");

  return (
    <>
      {loader ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="textContainer">
          <div className="gen-2-logo">
            {!connected ? (
              <img
                style={{ width: "450px", height: "200px", marginTop: "12%" }}
                src={require("../assets/Group 13081@2x.png")}
              />
            ) : (
              <img
                style={
                  privateBoughtInitiated ||
                    whitelistBoughtInitiated ||
                    genesisBoughtInitiated
                    ? {
                      width: "450px",
                      height: "200px",
                      marginLeft: "6%",
                      marginTop: "auto",
                    }
                    : {
                      width: "450px",
                      height: "200px",
                      marginLeft: "29%",
                      marginTop: "12%",
                    }
                }
                src={require("../assets/Group 13081@2x.png")}
              />
            )}
          </div>
          <div className="connect-mint-button">
            {connected ? (
              privateListed && privateBoughtInitiated ? (
                <div className="message">YOU HAVE ALREADY MINTED</div>
              ) : whiteListed && whitelistBoughtInitiated ? (
                <div className="message">YOU HAVE ALREADY MINTED</div>
              ) : genesisHolder && !genesisBoughtInitiated ? (
                <div className="message">YOU HAVE ALREADY MINTED</div>
              ) : connected && minted ? (
                <>
                  <div className="wallet-address">{walletAddress}</div>
                  <div className="wallet-address-connected">CONNECTED</div>
                  <div className="wallet-address-text">{textMessage}</div>
                </>
              ) : (
                <>
                  {genesisBoughtInitiated &&
                    genesisBoughtInitiated.length > 0 ? (
                    <>
                      <div className="wallet-address">{walletAddress}</div>
                      <div className="wallet-address-connected">CONNECTED</div>
                      <div className="wallet-address-text">
                        Welcome, holder of Genesis JIRA #
                        {genesisBoughtInitiated.toString()}.
                      </div>
                      {privateListed && !privateBoughtInitiated && (
                        <div className="wallet-address-text">
                          You are also in the private JIRAlist!
                        </div>
                      )}
                      <button
                        className="connect-wallet-button-mint"
                        onClick={() => {
                          mintToken();
                        }}
                      >
                        MINT NOW!
                      </button>
                      {
                        claimTimeActivated && gen2active || genesisActive ? <button
                          className="connect-wallet-button-mint"
                          onClick={() => {
                            claim();
                          }}
                        >
                          CLAIM
                        </button> : ""
                      }
                    </>
                  ) : (
                    <>
                      {whiteListed ? (
                        <>
                          <div className="wallet-address-text">
                            You are in the JIRAlist!
                          </div>
                          <button
                            className="connect-wallet-button-mint"
                            onClick={() => {
                              mintToken();
                            }}
                          >
                            MINT NOW!
                          </button>
                          {
                            claimTimeActivated && gen2active || genesisActive ? <button
                              className="connect-wallet-button-mint"
                              onClick={() => {
                                claim();
                              }}
                            >
                              CLAIM
                            </button> : ""
                          }
                        </>
                      ) : privateListed ? <>
                        <div className="wallet-address-text">
                          You are in the private JIRAlist!
                        </div>
                        <button
                          className="connect-wallet-button-mint"
                          onClick={() => {
                            mintToken();
                          }}
                        >
                          MINT NOW!
                        </button>
                        {
                          claimTimeActivated && gen2active || genesisActive ? <button
                            className="connect-wallet-button-mint"
                            onClick={() => {
                              claim();
                            }}
                          >
                           CLAIM
                          </button> : ""
                        }
                      </> : (
                        <>
                          <div className="wallet-address">{walletAddress}</div>
                          <div className="wallet-address-connected">
                            CONNECTED
                          </div>
                          <div className="wallet-address-text">
                            You are not eligible to mint.
                          </div>
                          {
                            claimTimeActivated && gen2active || genesisActive ? <button
                              className="connect-wallet-button-mint"
                              onClick={() => {
                                claim();
                              }}
                            >
                              CLAIM
                            </button> : ""
                          }
                        </>
                      )}
                    </>
                  )}
                </>
              )
            ) : (
              <button
                className="connect-wallet-button-initial"
                onClick={() => connectWallet()}
              >
                <span>
                  <img
                    style={{
                      marginRight: "12px",
                      width: "30px",
                      height: "30px",
                    }}
                    src={require("../assets/wallet.png")}
                  />
                </span>
                CONNECT
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TextComponent;
