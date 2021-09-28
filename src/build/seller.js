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
/**
 * Create User HexAddress
 * @returns Promise<string>
 */
function newAddress() {
    return new Promise(function(resolve) {
        Minima.cmd('newaddress', function(res) {
            if (res.status) {
             let addr = res.response.address.hexaddress;
             resolve(addr);   
            }
        })
    });
}
/**
 * Create User Public Key
 * @returns Promise<string>
 */
function newKey() {
    return new Promise(function(resolve) {
        Minima.cmd('keys new', function(res) {
            if (res.status) {
             let key = res.response.key.publickey;
             resolve(key);   
            }
        })
    });
}
/**
 * Automates the sellers actions
 */
async function setAll() {
    
    mPUBLICKEY = await newKey();
    mADDRESS = await newAddress();
    sADDRESS = await createContract(); // follow this script address
    await createAuction(AUCTIONSCRIPT, TOKENID, mPUBLICKEY);
}