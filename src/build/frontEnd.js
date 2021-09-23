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
             let addr = res.response.hexaddress;
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
        auctionAddressString = `extrascript "LET key = PREVSTATE ( 23 ) RETURN SIGNEDBY ( key )"`
        Minima.cmd(auctionAddressString, (res) => {
            console.log(res)
            let hex = res.response.hexaddress
            resolve(hex)
        })
    })
    
}

// send NFT to contract
function sendNFT(hexAddress, myNftTokenId, publicKey) {
    return new Promise((resolve, reject) => {
        let command = `send 1 ${hexAddress} ${myNftTokenId} 23:${publicKey}`
        Minima.cmd(command, (res) => {
            console.log(res)
            if (res.status) {
                if (res.response && res.response.txpow) {
                    let coinid = res.response.txpow.body.inputs[0].coinid
                    resolve(coinid)
                }
            }
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
    
    uNFTCOINID = await sendNFT(sADDRESS, TOKENID, mPUBLICKEY);

    checkNFTSpendable(uNFTCOINID, mADDRESS, TOKENID, mPUBLICKEY, SCALE);


}