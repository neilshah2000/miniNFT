console.log(JSON.stringify(Minima))

Minima.init((res) => {
    if (res.event === 'connected') {
        console.log('Minima successfully loaded')
    }
})


// Get all the NFTs that are in my wallet
function getAllMyNFTs() {

}


function transferToNeil() {
    transfer(5, '0x00', 'Mx46W4SRJMFOYU7HRNSTMCTN56DYA23EFQ')
}

// "send            ": "[amount] [address] (tokenid|tokenid statevars) - Send Minima or Tokens to a certain address.",
function transfer(amount, coin, toWalletAddress) {
    const command = `send ${amount} ${toWalletAddress} ${coin}`
    Minima.cmd(command, (res) => {
        console.log('TRANSFER')
        console.log(JSON.stringify(res))
    })
}

transferToNeil()