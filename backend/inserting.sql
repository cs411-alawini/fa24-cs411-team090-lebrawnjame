CREATE TABLE IF NOT EXISTS User (
    Username VARCHAR(25) PRIMARY KEY,
    Email VARCHAR(100) NOT NULL,
    MembershipStatus BOOLEAN,
    Location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Messages (
    MessageID INT PRIMARY KEY,
    Username VARCHAR(25),
    MemberId INT,
    SentBy BOOLEAN,
    Content VARCHAR(250),
    Time DATETIME,
    FOREIGN KEY (Username) REFERENCES User(Username),
    FOREIGN KEY (MemberId) REFERENCES Member(MemberID)
);

CREATE TABLE IF NOT EXISTS Shop (
    ItemID INT PRIMARY KEY,
    MerchType VARCHAR(25),
    Merchant VARCHAR(50),
    Link VARCHAR(250)
);

CREATE TABLE IF NOT EXISTS Member (
    MemberID INT PRIMARY KEY,
    Username VARCHAR(25),
    FOREIGN KEY (Username) REFERENCES User(Username)
);

CREATE TABLE IF NOT EXISTS Events (
    EventID INT PRIMARY KEY,
    MemberId INT,
    EventName VARCHAR(100),
    StartDate DATETIME,
    EndDate DATETIME,
    Location VARCHAR(100),
    FOREIGN KEY (MemberId) REFERENCES Member(MemberID)
);

CREATE TABLE IF NOT EXISTS Media (
    MediaID INT PRIMARY KEY,
    MemberId INT,
    EventName VARCHAR(300),
    Media LONGBLOB,
    MediaType BOOLEAN,
    Date DATETIME,
    FOREIGN KEY (MemberId) REFERENCES Member(MemberID)
);

CREATE TABLE IF NOT EXISTS ShopPreferences (
    Username VARCHAR(25),
    ItemID INT,
    PRIMARY KEY (Username, ItemID),
    FOREIGN KEY (Username) REFERENCES User(Username),
    FOREIGN KEY (ItemID) REFERENCES Shop(ItemID)
);

CREATE TABLE IF NOT EXISTS ContentPreferences (
    Username VARCHAR(25),
    Bias VARCHAR(25),
    EventName VARCHAR(300),
    PRIMARY KEY (Username, Bias, EventName),
    FOREIGN KEY (Username) REFERENCES User(Username)
);
