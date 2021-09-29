

var TOKENID = ''; // manual
var SCALE = 0; // manual

var AUCTION_SCRIPT_ADDRESS = ''
var BIDDER_SCRIPT_ADDRESS = ''
var AUCTIONED_TOKENS = [];
var BIDS = [];


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

function listBids() {
  return new Promise((resolve, reject) => {

    Minima.cmd('coins relevant address:' + BIDDER_SCRIPT_ADDRESS + ' tokenid:0x00', (res) => {

      console.log(res)

      BIDS = []

      res.response.coins.forEach((c) => {

        const coin = {
          coin: c.data.coin.coinid,
          tokenid: c.data.coin.tokenid
        }

        BIDS.push(coin)

      })

      console.log(BIDS)


    });

  })
}


function listAuctions() {
  return new Promise((resolve, reject) => {

    Minima.cmd('coins relevant address:' + AUCTION_SCRIPT_ADDRESS, (res) => {

      console.log(res);

      AUCTIONED_TOKENS = []

      // Here are all current auctions

      res.response.coins.forEach((c) => {

        const coin = {
          coin: c.data.coin.coinid,
          tokenid: c.data.coin.tokenid
        }
          

        AUCTIONED_TOKENS.push(coin);


      });

      console.log('Latest tokens on auction:' , AUCTIONED_TOKENS)

    });

  });
}