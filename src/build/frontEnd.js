

// console.log(JSON.stringify(Minima))

// Minima.init((res) => {
//     if (res.event === 'connected') {
//         console.log('Minima successfully loaded')
//     }
// })


// // Get all the NFTs that are in my wallet
// function getAllMyNFTs() {
//     const command = 'balance'
//     cmd(command).then((res) => {
//         console.log('BALANCE')
//         console.log(JSON.stringify(res))
//     })
// }


// function transferToNeil() {
//     transfer(5, '0x00', 'Mx46W4SRJMFOYU7HRNSTMCTN56DYA23EFQ')
// }

// // "send            ": "[amount] [address] (tokenid|tokenid statevars) - Send Minima or Tokens to a certain address.",
// function transfer(amount, coin, toWalletAddress) {
//     const command = `send ${amount} ${toWalletAddress} ${coin}`
//     cmd(command).then((res) => {
//         console.log('TRANSFER')
//         console.log(JSON.stringify(res))
//     })
// }


function showAllMyCoins() {
    command = 'balance'
    Minima.cmd(command, console.log)
}


let AUCTION_CONTRACT_ADDRESS = ''
let MY_NFT_TOKEN_ID = 'blah bl;ah'

// script to register NFT at auction address

// create contract
// LET key = PREVSTATE (23)
// RETURN SIGNEDBY ( key )
// part of extra script
function createContract() {
    return new Promise((resolve, reject) => {
        auctionAddressString = `extrascript "LET key = PREVSTATE ( 23 ) RETURN SIGNEDBY ( key )"`
        Minima.cmd(auctionAddressString, (res) => {
            console.log(res)
            let hex = res.response.hexaddress
            resolve(hex)
        })
    })
    
}


// send NFT to contract
function sendNFT(hexAddress, myNftTokenId) {
    return new Promise((resolve, reject) => {
        let command = `send 1 ${hexAddress} ${myNftTokenId}`
        Minima.cmd(command, (res) => {
            console.log(res)
            let coinid = res.txpow.body.inputs[0].coinid
            resolve(coinid)
        })
    })
    
}



// check the nft is still spendable by me
// *********** this cancels the auction *********
function checkNFTSpendable(nftCoinId, selfAddress, nftTokenId, pubKeyUsedInScript, scale) {
    minimaAmount = 1 / Math.exp(scale)
    let command = `txncreate 10;
        txninput 10 ${nftCoinId};
        txnoutput 10 ${minimaAmount} ${selfAddress} ${nftTokenId};
        txnsign 10 ${pubKeyUsedInScript};
        txnpost 10;
        txndelete 10`
    Minima.cmd(command, console.log)
     
}












// transferToNeil()
// getAllMyNFTs()