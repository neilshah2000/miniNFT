/** 
 * 
 * Backend worker for Minima
 * created on 02/06/2021
 * 
 */

/**
 * TEST STRING FOR MXSQL
 * CREATE TABLE IF NOT EXISTS MESSAGE (ID INT NOT NULL AUTO_INCREMENT, PUBLICKEY VARCHAR(255), NAME VARCHAR(255), TIMESTAMP VARCHAR(255), PRIMARY KEY(ID))
 */

const cryptocurrency = 'Minima';
const app = 'BANTER';
const createUserTable =
"CREATE TABLE IF NOT EXISTS USERLIST" +
 "(ID VARCHAR(255) NOT NULL," +
 "STATUS VARCHAR(8)," +
 "PRIMARY KEY(ID)" +
 ")";
 const createMessageTable =
 "CREATE TABLE IF NOT EXISTS MESSAGE" +
 "(ID int NOT NULL AUTO_INCREMENT," +
 "PUBLICKEY VARCHAR(255)," +
 "POST VARCHAR(255)," +
 "REPLYID VARCHAR(255)," +
 "HASHBANTERID VARCHAR(255)," +
 "TOPBANTERID VARCHAR(255)," +
 "NAME VARCHAR(255)," +
 "ICON VARCHAR(255)," +
 "DESCRIPTION VARCHAR(255)," +
 "TIMESTAMP VARCHAR(255)," +
 "TXPOWTIMEMILLI VARCHAR(255)," +
//  "FOREIGN KEY (PUBLICKEY) REFERENCES USERLIST(PUBLICKEY)," +
 "PRIMARY KEY(ID)" +
 ")";
function initSQL() {
  Minima.sql(createUserTable+';'+createMessageTable, function(res) {
    if (Minima.util.checkAllResponses(res)) {
      Minima.log(cryptocurrency + ': created SQL Tables');
      Minima.log(JSON.stringify(res));
    }
  });
}

function insertBanter(txpow) {
  try {
    Minima.log(txpow);
    var state = txpow.txpow.body.txn.state;
    var timeNow = new Date().getTime();
    var timeMilli = txpow.txpow.header.timemilli;

    var pubKey = state[2].data;
    var signature = state[7].data;
    var data = state[9].data;

    Minima.sql('SELECT * FROM USERLIST', function(res) {
      // Minima.log(res);
      if (res.status) {
        if (res.response.status && res.response.rows) {
          const blockList = res.response.rows;
          var isBlocked = false;
          for (i = 0; i < blockList.length; i++) {
            const blocked = 'unfollow';
            if (blockList[i].ID === pubKey && blockList[i].STATUS == blocked) {
              isBlocked = true;
              Minima.log('User blocked.. do not add to SQL.');
            }
          }
          if (!isBlocked) {
            Minima.cmd('verify ' + data + ' ' + pubKey + ' ' + signature, function(res) {
              // Minima.log(res);
              if (res.status) {
        
                Minima.sql("INSERT INTO USERLIST VALUES (" +
                "\'" + pubKey + "\'," +
                  "\'" + 'normal' + "\'" +
                  ")",
                  function (res) {
                    // Minima.log(JSON.stringify(res));
                  }
                );
                
                const RemoveSingleQuotesPost = state[6].data.replace(/'/g, '%27');

                Minima.sql("INSERT INTO MESSAGE(PUBLICKEY, POST, REPLYID, HASHBANTERID, TOPBANTERID, NAME, ICON, DESCRIPTION, TIMESTAMP, TXPOWTIMEMILLI) VALUES (" +
                // '' + null + ',' +
                "'" + state[2].data + "'," +
                "'" + RemoveSingleQuotesPost + "'," +
                "'" + state[8].data + "'," +
                "'" + state[9].data + "'," +
                "'" + state[10].data + "'," +
                "'" + state[3].data + "'," +
                "'" + state[5].data + "'," +
                "'" + state[4].data + "'," +
                "'" + timeNow + "'," +
                "'" + timeMilli + "'" +
                ")", function(res) {
                  if (res.status) {
                    pingFrontEnd();
                    Minima.log(cryptocurrency + ': inserted a new message to the messages table');
                  } else {
                    throw new Error('Failed to insert banter to messageTable');
                  }
                  // Minima.log(JSON.stringify(res));
                  }
                );
              } else {
                throw new Error('Transaction invalid');
              }
            });
          }
        } else {
          Minima.log('No users blocked.');
        }
      }
    });
  } catch (err) {
    Minima.log(err);
  }
}

function pingFrontEnd() {
  try {
    Minima.minidapps.list(function(res) {
      if (res.status) {
        for (var i = 0; i < res.response.minidapps.length; i++) {
          if (res.response.minidapps[i].name == 'Banter') {
            var uid = res.response.minidapps[i].uid;
            Minima.minidapps.send(uid, 'insertSQL', function(res) {
              
            });
          }
        }
      }
    });
  } catch (err) {
    Minima.log(err);
  }
}

function deleteBanter(banter) {

}

function queryBlockList() {

}

function validateTransaction(data, pubkey, signature) {
  try {
    Minima.cmd('verify ' + data + ' ' + pubkey + ' ' + signature, function(res) {
      if (res.status) {
        return true;
      } else {
        throw new Error('Transaction invalid');
      }
    });
  } catch (err) {
    Minima.log(err);
    return false;
  }
}

Minima.init(function(msg) {
  if (msg.event == 'connected') {
    Minima.log(cryptocurrency + ': banter backend service.js file initialised!');
    Minima.minidapps.listen(function(msg) {
      Minima.log(JSON.stringify(msg));
    });
    initSQL();
  } else if (msg.event == 'newtxpow') {
    var state = msg.info.txpow.body.txn.state;
    if (state.length > 0 && state[0].data == '[' + app + ']') {
      Minima.log(app + ': Found Banter Message');
      insertBanter(msg.info);
    }
  }
});

  // state[0] - appName
  // state[1] - versionNumber
  // state[2] - userPublicKey
  // state[3] - userName
  // state[4] - userDescription
  // state[5] - userIcon
  // state[6] - banterMessage
  // state[7] - signature
  // state[8] - replyID
  // state[9] - hashBanterID
  // state[10] - topBanterID