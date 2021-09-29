
/**
 * Automates the bidders actions
 */
async function bidContract(coinid, tokenid) {
  const bidder_my_address = await newAddress()
  console.log('Bidder address is ' + bidder_my_address + '. Seller will need this to accept bid')

  const aKey = await newKey()

  // bidder bid 2 minima
  createBidTransaction(2, BIDDER_SCRIPT_ADDRESS, bidder_my_address, aKey, TOKENID);

}


function createBidTransaction(amount, scriptAddress, myAddress, myPubKey, tokenIdIWant) {
  const minimaTokenId = '0x00'
  const sendTransaction = `send ${amount} ${scriptAddress} ${minimaTokenId} 0:${myPubKey}#1:${myAddress}#2:${tokenIdIWant}`
  Minima.cmd(sendTransaction, console.log)
}



// Bidder cancels his bid if blkDiff gte 100 and signed by bidder
function cancelMyBid() {

}


// coins address:0xBA968F4DEA64F55B0A48A6B090BCA3EC16E5BD17. all auctions from any user
function viewAllAuctions(auctionContractAddress) {
	const command = `coins address:${auctionContractAddress}`
	Minima.cmd(command, console.log)
}


// coins address:0xBA968F4DEA64F55B0A48A6B090BCA3EC16E5BD17 relevent:true (all your own auctions)
function viewAllMyAuctions(auctionContractAddress) {
	const command = `coins address:${auctionContractAddress} relevent:true`
	Minima.cmd(command, console.log)
}



function getCurrentHighestBid(auction) {

}


function getTimeLeftOnAuction(auction) {

}