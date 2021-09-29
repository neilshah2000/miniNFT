

var TOKENID = ''; // manual
var SCALE = 0; // manual

var AUCTION_SCRIPT_ADDRESS = ''
var BIDDER_SCRIPT_ADDRESS = ''
var AUCTIONED_TOKENS = [];
var BIDS = [];
var MINIMA = '0x00'


console.log('Manually set SCALE, TOKENID, ');



// SET EM ALL
createSmartContracts()


// the same string is used the create the smart contract
// so will just grab an existing address
async function createSmartContracts() {
  console.log('Setting smart contract scripts...');
  AUCTION_SCRIPT_ADDRESS = await createAuctionContract()
  
  BIDDER_SCRIPT_ADDRESS = await createBidContract()

  listAuctions()
}



/**
 * Register Auction Script
 * @returns Hexaddress of script
 */
 function createAuctionContract() {
  return new Promise((resolve, reject) => {
      auctionAddressString = `extrascript "LET mkey = PREVSTATE ( 23 ) RETURN SIGNEDBY ( mkey )"`
      Minima.cmd(auctionAddressString, (res) => {
          // console.log(res)
          console.log('Set Auction Script!');
          let hex = res.response.address.hexaddress
          resolve(hex)
      })
  })
}

/**
 * Register Bidder Script
 * @returns Hexaddress of script
 */
function createBidContract() {
  return new Promise((resolve, reject) => {
      bidScript = 'extrascript "LET bidderpubkey  = PREVSTATE(0) ' +
                              'LET bidderaddress = PREVSTATE(1) ' +
                              'LET token = PREVSTATE(2) ' +
                              
                              'IF SIGNEDBY ( bidderpubkey ) AND @BLKDIFF GT 100 ' +
                                      'THEN RETURN TRUE ' +
                              'ENDIF ' +
                              
                              'RETURN VERIFYOUT (@INPUT @AMOUNT bidderaddress token ) "';
      Minima.cmd(bidScript, (res) => {
          // console.log(res)
          console.log('Set Bidder Script!');
          let hex = res.response.address.hexaddress
          resolve(hex)
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

function listBids() {
  listAllBids(BIDDER_SCRIPT_ADDRESS).then((bids) => {
    console.log('Global list of all bids', bids)
  }, console.error)
}


function listAuctions() {
  listAllAuctions(AUCTION_SCRIPT_ADDRESS).then((auctions) => {
    console.log('Global list of all auctions', auctions)
  }, console.error)
}


// Gets the list if all auctions.
// Removes the ones the users has created themselves.
// Returns just the ones they can bid on.
// i.e. The auctions created by other users
function listBiddableAuctions() {
  // Get the list of keys this person owns
  getAllYourPublicKeys()

  // Get the list of all auctions
  listAllAuctions(AUCTION_SCRIPT_ADDRESS)

  // Remove from the auction list, auctions signed by any of this users public keys

  // Return the resulting, filtered aution list
}


function getAllYourAddresses() {
  return new Promise((resolve, reject) => {
    const command = 'scripts'
    Minima.cmd(command, (res) => {
      if (res.status && res.response && res.response.addresses) {
        const addresses = res.response.addresses.map(address => address.miniaddress)
        resolve(addresses)
      } else {
        reject(res)
      }
    })
  })
}


function getAllYourPublicKeys() {
  return new Promise((resolve, reject) => {
    const command = 'keys'
    Minima.cmd(command, (res) => {
      if (res.status && res.response && res.response.publickeys) {
        const myKeys = res.response.publickeys.map(key => key.publickey)
        resolve(myKeys)
      } else {
        reject(res)
      }
    })
  })
}


// list all the NFTs (coinid and tokenid), listed in the auction
function listAllAuctions(auctionContractAddress) {
  return new Promise((resolve, reject) => {
    const command = 'coins address:' + auctionContractAddress
    Minima.cmd(command, (res) => {
      if (res.status && res.response && res.response.coins) {
        const nfts = res.response.coins.map(c => {
          return {
            coin: c.data.coin.coinid,
            tokenid: c.data.coin.tokenid
          }
        })
        resolve(nfts)
      } else {
        reject(res)
      }
    })
  })
}


// list all the bids (coinid and tokenid), listed in the bid contract
function listAllBids(bidsContractAddress) {
  const minimaTokenId = '0x00'
  return new Promise((resolve, reject) => {
    const command = `coins address:${bidsContractAddress} tokenid:${minimaTokenId}`
    Minima.cmd(command, (res) => {
      if (res.status && res.response && res.response.coins) {
        const bids = res.response.coins.map(c => {
          return {
            coin: c.data.coin.coinid,
            tokenidIWantToBuy: c.data.prevstate[2].data,
            bidderAddress: c.data.prevstate[1].data,
            bidderPubKey: c.data.prevstate[0].data
          }
        })
        resolve(bids)
      } else {
        reject(res)
      }
    })
  })
}