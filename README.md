# Getting Started with ALGO-PAY

Welcome to the future of payments

## USE CASE

We all know how hard it is use crypto wallet to purchase any stuff on amazon.
We are introducing a chrome extension which enables users to use their crypto wallets to pay for their amazon orders


## Tech Stack

We are using React, Walletconnect/client, algorand-walletconnect-qrcode-modal, algosdk, Amazon API's for placing orders

## How it works

* Once the user reaches the order summary page to place the order, Our chrome extension will automatically detect the browser urls and prompts the user to "choose to pay in crypto".
* We initiate the wallet connection process using algorand sdk's in order to securely connect the website to algorand's pera wallet 
* Once the user initiates the payment, after we receive the success payment message from their algorand wallet, we process the order to amazon using amazon's gift cards. 
* Order will be placed at amazon's website and supply chain process will be completed. 


