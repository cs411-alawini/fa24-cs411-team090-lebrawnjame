// const mysql = require('mysql2');
// const fs = require('fs');
// const csv = require('csv-parser');

// var connection = mysql.createConnection({
//     host: '35.226.113.165',
//     user: 'dev',
//     password: 'hello',
//     database: 'lephoningdbtest'
// });

// connection.connect(err => {
//     if (err) throw err;
//     console.log("we in");
// });

// function insertUsers() {
//     fs.createReadStream('data/users (3).csv')
//         .pipe(csv())
//         .on('data', (row) => {
//             const query = 'INSERT INTO User (Username, Email, MembershipStatus, Location) VALUES (?, ?, ?, ?)';
//             const values = [row.Username, row.Email, row.MembershipStatus === 'True', row.Location];
//             connection.query(query, values, (err) => {
//                 if (err) console.error("errors", err);
//             });
//         })
//         .on('end', () => {
//             console.log('users inserted');
//         });
// }

// function insertMessages() {
//   fs.createReadStream('member_messages.csv')
//       .pipe(csv())
//       .on('data', (row) => {
//           const cleanedContent = row.Content.replace(/\*\*.*?\*\*/g, '').trim();

//           const truncatedContent = cleanedContent.length > 250 ? cleanedContent.substring(0, 250) : cleanedContent;

//           const query = 'INSERT INTO Messages (MessageID, Username, MemberId, SentBy, Content, Time) VALUES (?, ?, ?, ?, ?, ?)';
//           const values = [row.MessageID, row.Username, row.MemberId, row.SentBy === 'True', truncatedContent, row.Time];

//           connection.query(query, values, (err) => {
//               if (err) console.error("Error inserting message:", err);
//           });
//       })
//       .on('end', () => {
//           console.log('Messages data inserted.');
//       });
// }


// function insertShopItems() {
//     fs.createReadStream('data/shop.csv')
//         .pipe(csv())
//         .on('data', (row) => {
//             const query = 'INSERT INTO Shop (ItemID, MerchType, Merchant, Link) VALUES (?, ?, ?, ?)';
//             const values = [row.ItemID, row.MerchType, row.Merchant, row.Link];
//             connection.query(query, values, (err) => {
//                 if (err) console.error("Error inserting shop item:", err);
//             });
//         })
//         .on('end', () => {
//             console.log('Shop items data inserted.');
//         });
// }

// insertMessages();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Import the auth routes

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

