
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

// Bidder
async function bidContract() {
  const bidHexAddress = await createBidContract();
  
  const BIDDERADDRESS = await newAddress()
  const aKey = await newKey()

  // bidder bid 2 minima
  createBidTransaction(3, bidHexAddress, BIDDERADDRESS, aKey, TOKENID);

}


function createBidTransaction(amount, scriptAddress, myAddress, myPubKey, tokenIdIWant) {
  console.log('bidder address', myAddress)
  const minimaTokenId = '0x00'
  const sendTransaction = `send ${amount} ${scriptAddress} ${minimaTokenId} 0:${myPubKey}#1:${myAddress}#2:${tokenIdIWant}`
  Minima.cmd(sendTransaction, console.log)
}




// 0x0E787705A1AC6795A5F2958269EF6EDBB3699A5AC74DC2DA9443186DC225BD9F240A7E9833DB4CE68CB38FB11EC51FFD543F986AB404EDF68F9A27DD8773766B'
// acceptBid(TOKENID, '0x9B5AD40C46D0F21EB996A1059A4676D3BD7A4D80', 44)
// The Host accepts bid of bidder
async function acceptBid(zTokenID, zAddress, scale) {
  let minimaAmount = 1 / Math.pow(10, scale)
  const coinId = await getCoinId(zTokenID)
  let command = `txncreate 10;
      txninput 10 ${coinId};
      txnoutput 10 ${minimaAmount} ${zAddress} ${zTokenID};
      txnpost 10;
      txndelete 10`
  Minima.cmd(command, console.log)

}
// Bidder cancels his bid if blkDiff gte 100 and signed by bidder
function cancelMyBid() {

}