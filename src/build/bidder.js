
function selectAuctionToBidOn(bidIndex, amount) {
    listAllBids(bidsContractAddress).then(() => {
        
    })
    bidContract(TOKENID, 2)
}





/**
 * Automates the bidders actions
 */
async function bidContract(tokenid, amount) {
    const bidder_my_address = await newAddress()
    console.log('Bidder address is ' + bidder_my_address + '. Seller will need this to accept bid')

    const aKey = await newKey()
    console.log('Bidder public key is ' + aKey + '. Seller will need this to accept bid')

    // bidder bid 2 minima
    return createBidTransaction(amount, BIDDER_SCRIPT_ADDRESS, bidder_my_address, aKey, tokenid);

}


function createBidTransaction(amount, scriptAddress, myAddress, myPubKey, tokenIdIWant) {
    return new Promise((resolve, reject) => {
        const minimaTokenId = '0x00'
        const sendTransaction = `send ${amount} ${scriptAddress} ${minimaTokenId} 0:${myPubKey}#1:${myAddress}#2:${tokenIdIWant}`
        Minima.cmd(sendTransaction, (res) => {
            if(res.status && res.message === 'Send Success') {
                resolve(res)
            } else {
                reject(res)
            }
        })
    })
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

function getAuctionByNFTTokenName() {

}

// list all auctions by name and image
function seeAuctionsWithNameAndImage() {

}