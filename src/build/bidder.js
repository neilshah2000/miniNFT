
/**
 * 
 * LET bidderpubkey  = PREVSTATE(0)
    LET bidderaddress = PREVSTATE(1)
    LET token = PREVSTATE(2)

IF SIGNEDBY ( bidderpubkey ) AND @BLKDIFF GT 100
        THEN RETURN TRUE 
ENDIF

RETURN VERIFYOUT (@INPUT 1 bidderaddress token )
 */

/**
 * Automates the bidders actions
 */
async function bidContract() {
  const bidder_my_address = await newAddress()
  const aKey = await newKey()

  // bidder bid 2 minima
  createBidTransaction(2, BIDDER_SCRIPT_ADDRESS, bidder_my_address, aKey, TOKENID);

}


function createBidTransaction(amount, scriptAddress, myAddress, myPubKey, tokenIdIWant) {
  console.log('bidder address', myAddress)
  const minimaTokenId = '0x00'
  const sendTransaction = `send ${amount} ${scriptAddress} ${minimaTokenId} 0:${myPubKey}#1:${myAddress}#2:${tokenIdIWant}`
  Minima.cmd(sendTransaction, console.log)
}



// Bidder cancels his bid if blkDiff gte 100 and signed by bidder
function cancelMyBid() {

}