var mPUBLICKEY = ''; 
var uNFTCOINID = '';
var mADDRESS = '';
var sADDRESS = '';

var TOKENID = ''; // manual
var SCALE = 0; // manual

var AUCTIONSCRIPT = ''
var BIDDERSCRIPT = ''



console.log('Manually set SCALE, TOKENID, ');

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

async function setScripts() {
  console.log('Setting scripts...');
  AUCTIONSCRIPT = await createAuctionContract()
  
  BIDDERSCRIPT = await createBidContract()

}
// SET EM ALL
setScripts()