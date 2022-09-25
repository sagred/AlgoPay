import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import "./App.css";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";

const Container = styled.div`
  z-index: 2;
  margin:10px;
  position: fixed;
  bottom: 30px;
  right: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const StyledButton = styled.button`
  height: 40px;
  width: 200px;
  border-radius:5px;
  border: none;
  color: white;
  background-color:black;
  font-size: medium;
  font-weight: 600;
  cursor: pointer;
`;


const StickyNotes = () => {
  const wurl = window.location.href;
  const [isAmazon, setIsAmazon] = useState(false)
  const [acc, setAcc] = useState([])
  const [wall, setWall] = useState(false)
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (wurl.includes("https://www.amazon.in/gp/buy/")) {
      setIsAmazon(true)
    }
  }, [wurl]);


  const connector = useMemo(() => {
    return new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
  }, [])

  useEffect(() => {
    if (wall) {

      if (!connector.connected) {
        connector.createSession();
      } else {
        const { accounts } = connector;
        setAcc(accounts)
        console.log(accounts)
      }

      connector.on("connect", (error, payload) => {
        if (error) {
          throw error;
        }

        const { accounts } = payload.params[0];
        console.log(accounts)
        setAcc(accounts)
      });

      connector.on("session_update", (error, payload) => {
        if (error) {
          throw error;
        }

        const { accounts } = payload.params[0];
        console.log("hello", accounts)
      });

      connector.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }
      });
    }

  }, [wall, connector])

  const makeTrans = async () => {
    setLoading(true)
    if (acc.length > 0 && connector.connected) {

      console.log("325235436234")
      const suggestedParams = await new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "").getTransactionParams().do();
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: acc[0],
        to: "3NOXG4F3X6JC7EZDU7WNII437AGE6EEFOYCGCHXOB2VURBMQFD6EMWV2SA",
        amount: 2000000,
        suggestedParams,

      });
      const txns = [txn]
      const txnsToSign = txns.map((txn) => {
        const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
        return {
          txn: encodedTxn,
          message: 'Description of transaction being signed',
        };
      });

      const requestParams = [txnsToSign];

      const request = formatJsonRpcRequest("algo_signTxn", requestParams);
      const result = await connector.sendCustomRequest(request);
      const decodedResult = result.map(element => {
        return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
      });
      console.log(decodedResult)

      const { txId } = await new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "")
        .sendRawTransaction(decodedResult)
        .do();
      const client = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "")
      let lastStatus = await client.status().do();
      let lastRound = lastStatus["last-round"];
      while (true) {
        const status = await client.pendingTransactionInformation(txId).do();
        if (status["pool-error"]) {
          throw new Error(`Transaction Pool Error: ${status["pool-error"]}`);
        }
        if (status["confirmed-round"]) {
          const inp = document.getElementsByClassName("pmts-claim-code")
          const input = inp[0]
          input.setAttribute('value', 'JKR7-VF67MF-6UDV');
          setTimeout(() => {
            const coup = document.getElementsByName("ppw-claimCodeApplyPressed")
            coup[0].click()
          }, 500)
          setLoading(true)
          return status["confirmed-round"];
        }
        lastStatus = await client.statusAfterBlock(lastRound + 1).do();
        lastRound = lastStatus["last-round"];
      }
    }
  }

  const handleConnectToWallet = () => {
    setWall(true)
    const pay = document.getElementsByClassName("grand-total-price")[0]?.textContent
    if (pay) {
      const inr = pay.split(".")[0]
      const amt = inr.slice(1, inr.length)
      setAmount(Number(amt))
    } else {
      setAmount(24 / 27)
    }
  }

  return (
    <>
      {!isAmazon &&
        <Container>
          {acc.length > 0 ? <StyledButton onClick={makeTrans}>{loading ? "Processing..." : "Pay with ALGO"} </StyledButton> : <StyledButton onClick={handleConnectToWallet}>Connect To Wallet</StyledButton>}
        </Container>
      }
    </>
  );
};

export default StickyNotes;