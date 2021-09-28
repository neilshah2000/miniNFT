var mPUBLICKEY = ''; 
var uNFTCOINID = '';
var mADDRESS = '';
var sADDRESS = '';



/**
 * Automates the sellers actions
 */
 async function setAll() {
    
    mPUBLICKEY = await newKey();
    mADDRESS = await newAddress();
    console.log('Seller address is ' + mADDRESS + '. Will need this to accept bid')
    
    await createAuction(AUCTION_SCRIPT_ADDRESS, TOKENID, mPUBLICKEY);
}





/////// helpers /////////



/**
 * Seller Create Auction
 * @param {*} scriptAddress 
 * @param {*} myNftTokenId 
 * @param {*} publicKey 
 * @returns Promise<boolean>
 */
function createAuction(auctionScriptAddress, myTokenId, publicKey) {
    return new Promise((resolve, reject) => {
        let command = `send 1 ${auctionScriptAddress} ${myTokenId} 23:${publicKey}`
        Minima.cmd(command, (res) => {
            console.log(res)
            resolve(true)
        })
    })
}

/**
 * Cancel Auction
 * @param {*} nftCoinId 
 * @param {*} selfAddress 
 * @param {*} nftTokenId 
 * @param {*} pubKeyUsedInScript 
 * @param {*} scale
 * Remove token from auction smart contract 
 */
 function cancelAuction(nftCoinId, selfAddress, nftTokenId, pubKeyUsedInScript, scale) {
    let minimaAmount = 1 / Math.pow(10, scale)
    let command = `txncreate 10;
        txninput 10 ${nftCoinId};
        txnoutput 10 ${minimaAmount} ${selfAddress} ${nftTokenId};
        txnsign 10 ${pubKeyUsedInScript};
        txnpost 10;
        txndelete 10`
    Minima.cmd(command, console.log)
}

/**
 * Get Updated CoinId
 * @param {*} zTokenId 
 * @returns Promise<String>
 */
function getCoinId(zTokenId) {
    return new Promise((resolve, reject) => {
        let command = `coins tokenid:${zTokenId} relevant:true`
        Minima.cmd(command, (res) => {
            console.log(res)
            mCoinId = res.response.coins[0].data.coin.coinid
            resolve(mCoinId)
        })
    })
}




// The Host accepts bid of bidder
// bidderAddress = 0xA2DCA23AD5FE657D1EB177A7AB896F7E8EF888CF
async function acceptBid(bidContract, nftTokenId, buyerAddress, minimaAmountBid, sellerAddress, scale) {
    let minimaAmountNFT = 1 / Math.pow(10, scale)
    let minimaTokenId = '0x00'
    const nftCoinId = await getCoinId(nftTokenId)
    const bidContractCoinId = await getCoinIdFromBidContract(bidContract, buyerAddress)

    // 1st input is the bid contract (Minima).. 1st output is the NFT sent to the bidder
    // 2nd input is the NFT token..  2nd output is the Minima sent to the seller
    let command = `txncreate 10;
        txninput 10 ${bidContractCoinId} 0;
        txninput 10 ${nftCoinId} 1;
        txnoutput 10 ${minimaAmountNFT} ${buyerAddress} ${nftTokenId} 0;
        txnoutput 10 ${minimaAmountBid} ${sellerAddress} ${minimaTokenId} 1;
        txnpost 10;
        txndelete 10`
    Minima.cmd(command, console.log)
  
}








async function getCoinIdFromBidContract(bidContract, buyerAddress) {
    const bidContractCoin = await getCoinFromBidContract(bidContract, buyerAddress)
    return bidContractCoin.data.coin.coinid
}

// gets the coinId of the minima tokens the bidder has
// locked up in the bid contract
// We need a way to identify this particular bid
// from all the different bids in the bid contract (buyerAddress)
// TODO: Buyer address may not be unique in the bid contract
// if they have sent multiple bids from the same address
function getCoinFromBidContract(bidContractAddress, buyerAddress) {
    return new Promise((resolve, reject) => {
        getCoinsFromAddress(bidContractAddress).then((coins) => {
            const foundBidCoin = coins.find(coin => coin.data.prevstate[1].data === buyerAddress) // TODO: will prevstate[1] always be port 1 ????
            if (typeof foundBidCoin !== 'undefined') {
                resolve(foundBidCoin)
            } else {
                reject(`Error: ${buyerAddress} wallet does not exist in contract ${bidContractAddress}` )
            }
        })
    })
}


// Use this to get the coins in a smart contract
function getCoinsFromAddress(address) {
    return new Promise((resolve, reject) => {
        command = `coins address:${address}`
        Minima.cmd(command, (res) => {
            if (res.status && res.response && res.response.coins) {
                resolve(res.response.coins)
            } else {
                reject(res)
            }
        })
    })
}



