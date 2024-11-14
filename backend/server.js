const mysql = require('mysql2');
const fs = require('fs');
const csv = require('csv-parser');

var connection = mysql.createConnection({
    host: '35.226.113.165',
    user: 'dev',
    password: 'hello',
    database: 'lephoningdbtest'
});

connection.connect(err => {
    if (err) throw err;
    // console.log("we in");
});

function insertUsers() {
    fs.createReadStream('data/user.csv')
        .pipe(csv())
        .on('data', (row) => {
            const query = 'INSERT INTO User (Username, Email, MembershipStatus, Location) VALUES (?, ?, ?, ?)';
            const values = [row.Username, row.Email, row.MembershipStatus === 'True', row.Location];
            connection.query(query, values, (err) => {
                if (err) console.error("errors", err);
            });
        })
        .on('end', () => {
            console.log('Users inserted');
        });
}

function insertMessages() {
    fs.createReadStream('data/messages.csv')
        .pipe(csv())
        .on('data', (row) => {
            const query = 'INSERT INTO Messages (MessageID, Username, MemberId, SentBy, Content, Time) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [row.MessageID, row.Username, row.MemberId, row.SentBy === 'True', row.Content, row.Time];
            connection.query(query, values, (err) => {
                if (err) console.error("Error inserting message:", err);
            });
        })
        .on('end', () => {
            console.log('Messages inserted.');
        });
}

function insertShop() {
    fs.createReadStream('data/shop.csv')
        .pipe(csv())
        .on('data', (row) => {
            const query = 'INSERT INTO Shop (ItemID, MerchType, Merchant, Link) VALUES (?, ?, ?, ?)';
            const values = [row.ItemID, row.MerchType, row.Merchant, row.Link];
            connection.query(query, values, (err) => {
                if (err) console.error("Error inserting shop item:", err);
            });
        })
        .on('end', () => {
            console.log('Shop data inserted.');
        });
}

function insertShopPreferences() {
    fs.createReadStream('data/shop_pref.csv')
        .pipe(csv())
        .on('data', (row) => {
            const query = 'INSERT INTO ShopPreferences (Username, ItemID, Bias, EventName) VALUES (?, ?, ?, ?)';
            const values = [row.Username, row.ItemID, row.Bias, row.EventName];
            connection.query(query, values, (err) => {
                if (err) console.error("Error inserting shoppreferences item:", err);
            });
        })
        .on('end', () => {
            console.log('Shop preferences data inserted.');
        });
}

function insertEvents() {
    fs.createReadStream('data/events.csv')
        .pipe(csv())
        .on('data', (row) => {
            const query = 'INSERT INTO Events (EventID, EventName, StartDate, EndDate, Location, MemberId) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [row.EventID, row.EventName, row.StartDate, row.EndDate, row.Location, row.MemberId];
            connection.query(query, values, (err) => {
                if (err) console.error("Error inserting event data:", err);
            });
        })
        .on('end', () => {
            console.log('Event data inserted.');
        });
}

// insertUsers();
// insertMessages();
// insertShop();
// insertShopPreferences();
// insertEvents();

setTimeout(() => connection.end(), 5000);
