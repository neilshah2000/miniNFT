

var TOKENID = ''; // manual
var SCALE = 0; // manual

var AUCTION_SCRIPT_ADDRESS = ''
var BIDDER_SCRIPT_ADDRESS = ''



console.log('Manually set SCALE, TOKENID, ');



// SET EM ALL
createSmartContracts()


// the same string is used the create the smart contract
// so will just grab an existing address
async function createSmartContracts() {
  console.log('Setting smart contract scripts...');
  AUCTION_SCRIPT_ADDRESS = await createAuctionContract()
  
  BIDDER_SCRIPT_ADDRESS = await createBidContract()
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
                              
                              'RETURN VERIFYOUT (@INPUT 1 bidderaddress token ) "';
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


function listAuctions() {
  return new Promise((resolve, reject) => {

    Minima.cmd('coins relevant address:' + AUCTION_SCRIPT_ADDRESS, (res) => {

      console.log(res);

      // Here are all current auctions
      let auctionSpendableCoins = [];

      res.response.coins.forEach((c) => {

        const coin = {
          coin: c.data.coin.coinid,
          tokenid: c.data.coin.tokenid
        }
          

        auctionSpendableCoins.push(coin);


      });

      console.log(auctionSpendableCoins)

    });

  });
}