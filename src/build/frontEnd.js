// /////////////////
// "publickey": "0x9E2C4D16466D57A45D3EF9B42A84A424B7B175DF"
// hexaddress: "0xFE03136653EA81F993A1C55CC24A00E788AEE0C5"
// side eye chloe
// tokenid: "0x58CA2E50302556E91E25878934726D87AE1FB51BAD66D70E62B68ED6328766D3DD3560F98AFA6B8CDABA4BAD9746C6FCDDAF600BAB717F0B84558FE7C33CE3D5"
// coinid: "0xE19F61D56CE0D260A7C3744FA47E24194DFD137B560170BA712DA2A3ECDFCA7CA589E6344A27D1E26B165E1659F2485FBBB359EF49A7E6D273E7DD2513BF969F"

// sendNFT('0xFE03136653EA81F993A1C55CC24A00E788AEE0C5', '0x58CA2E50302556E91E25878934726D87AE1FB51BAD66D70E62B68ED6328766D3DD3560F98AFA6B8CDABA4BAD9746C6FCDDAF600BAB717F0B84558FE7C33CE3D5', '0x9E2C4D16466D57A45D3EF9B42A84A424B7B175DF')


// checkNFTSpendable(nftCoinId, selfAddress, nftTokenId, pubKeyUsedInScript, scale)

// "miniaddress": "MxFHDJ5HIIECUJZ4E5F6CQTS5RHDTDPGGB"

// /// 

// NFT coin id is now different because we moved it into the auction contract
// "coinid": "0xE19F61D56CE0D260A7C3744FA47E24194DFD137B560170BA712DA2A3ECDFCA7CA589E6344A27D1E26B165E1659F2485FBBB359EF49A7E6D273E7DD2513BF969F",



// checkNFTSpendable(0xE19F61D56CE0D260A7C3744FA47E24194DFD137B560170BA712DA2A3ECDFCA7CA589E6344A27D1E26B165E1659F2485FBBB359EF49A7E6D273E7DD2513BF969F, MxFHDJ5HIIECUJZ4E5F6CQTS5RHDTDPGGB, 0x58CA2E50302556E91E25878934726D87AE1FB51BAD66D70E62B68ED6328766D3DD3560F98AFA6B8CDABA4BAD9746C6FCDDAF600BAB717F0B84558FE7C33CE3D5, 0x9E2C4D16466D57A45D3EF9B42A84A424B7B175DF, 36)

// error: "Invalid MMR Proof"

// Therefore we need the new coinid for the NFT after its sent to contract
// "coinid": "0xE19F61D56CE0D260A7C3744FA47E24194DFD137B560170BA712DA2A3ECDFCA7CA589E6344A27D1E26B165E1659F2485FBBB359EF49A7E6D273E7DD2513BF969F"

var mPUBLICKEY = ''; 
var uNFTCOINID = '';
var mADDRESS = '';
var sADDRESS = '';

var TOKENID = ''; // manual
var SCALE = 0; // manual

console.log('Manually set SCALE, TOKENID');


function showAllMyCoins() {
    let command = 'balance'
    Minima.cmd(command, console.log)
}

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


// create contract
// LET key = PREVSTATE (23)
// RETURN SIGNEDBY ( key )
// part of extra script

/**
 * Register script as auction address
 * @returns Hexaddress of script
 */
function createContract() {
    return new Promise((resolve, reject) => {
        // auctionAddressString = `extrascript "LET key = PREVSTATE ( 23 ) RETURN SIGNEDBY ( key )"`
        auctionAddressString = `extrascript "LET pkey = PREVSTATE ( 23 ) RETURN SIGNEDBY ( pkey )"`
        Minima.cmd(auctionAddressString, (res) => {
            console.log(res)
            let hex = res.response.address.hexaddress
            resolve(hex)
        })
    })
    
}

// send NFT to contract
function sendNFT(hexAddress, myNftTokenId, publicKey) {
    return new Promise((resolve, reject) => {
        let command = `send 1 ${hexAddress} ${myNftTokenId} 23:${publicKey}`
        Minima.cmd(command, (res) => {
            // do nothing, we dont need any data right now
            resolve()
        })
    })
    
}


function getCoinId(TOKENID) {
    return new Promise((resolve, reject) => {
        let command = `coins tokenid:${TOKENID} relevant:true`
        Minima.cmd(command, (res) => {
            console.log(res)
            mCoinId = res.response.coins[0].data.coin.coinid
            resolve(mCoinId)
        })
    })
}




// check the nft is still spendable by me
// *********** this cancels the auction *********
function checkNFTSpendable(nftCoinId, selfAddress, nftTokenId, pubKeyUsedInScript, scale) {
    let minimaAmount = 1 / Math.pow(10, scale)
    let command = `txncreate 10;
        txninput 10 ${nftCoinId};
        txnoutput 10 ${minimaAmount} ${selfAddress} ${nftTokenId};
        txnsign 10 ${pubKeyUsedInScript};
        txnpost 10;
        txndelete 10`
    Minima.cmd(command, console.log)
}


async function setAll() {
    
    mPUBLICKEY = await newKey();
    mADDRESS = await newAddress();
    sADDRESS = await createContract(); // script address
    
    // dont get it when we send the transacrion
    // maybe get it from balance
    // or somewhere else
    // we need coinid from output
    // we need subsequent transaction to get the coinid

    // use original coin id instead everywhere
    await sendNFT(sADDRESS, TOKENID, mPUBLICKEY);

    // manually get new coinid after sendind to contract
    uNFTCOINID = await getCoinId(TOKENID)

    // now do self send
    checkNFTSpendable(uNFTCOINID, mADDRESS, TOKENID, mPUBLICKEY, SCALE);


    // before we do this, check that confirmed = 1 for that NFT coin
    // get coin id with 
    // coins tokenid:0x21D3088DA0D8B26FBF2E07773CDEADFB45DE1D4F478C9DC135A2DBFB6A6B38C76E26944EFE53E13DC98510EF6B3B0141B3797639CCB068790267B3EA46D09CE1 relevant:true
    // use address: instead relevent true (my coins). This will get for all your coins

    // address of auction smart contract
    // coins address:0xBA968F4DEA64F55B0A48A6B090BCA3EC16E5BD17. all auctions from any user
    // coins address:0xBA968F4DEA64F55B0A48A6B090BCA3EC16E5BD17 relevent:true (all your own auctions)

    // address of bid contract


    // res.response.coins[0].data.coin.coinid


    // coin id of my coin
    // not static
    // "coinid": "0x7EE9281629294564F32CF6AEBC9401C608F9495C3770D1AD80A1000314546855941F9756178B6DD5DC183069B24DCCA98BE6E69FC10390FEF090A6EBF896F838",
    // checkNFTSpendable(oNFTCOINID, mADDRESS, TOKENID, mPUBLICKEY, SCALE);


}