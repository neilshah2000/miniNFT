# Issues

1) Running 2 local nodes. Wallet lists the coins belonging to each node correctly. Terminal lists each nodes coins correctly. But calling Minima.cmd('balance'), lists the coins from the incorrect node.
2) ```coins address:0x13370615EE5D6D0F5BDC28EF5E34B3FCF4A116B8``` I expect this command to return the same coins for both nodes. Instead it returns 7 coins for one node and 6 coins for the other. This is in terminal.


3) Different number of auctions in the global auction contract for each node. I expect them to be the same

4) TODO cant use globals, because they will get wiped out on reload (eg mTOKENID). Where to save it?



# Workflow

1) getAllMyNFTs().then(console.log)
2) selectNftForAuction(0)

3) Bidder searches auction - listAuctions()
4) Sets TOKENID and SCALE
5) bidContract(TOKENID, 2) to create bid

6) listBids()
7) selectBid(0)


# Create

1) buildNFT() - may have to call twice (TODO: fix this bug)