CREATE TABLE IF NOT EXISTS User (
    Username VARCHAR(25) PRIMARY KEY,
    Email VARCHAR(100),
    MembershipStatus BOOLEAN,
    Location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Member (
    MemberId INT PRIMARY KEY,
    Username VARCHAR(25)
);

CREATE TABLE IF NOT EXISTS Events (
    EventID INT PRIMARY KEY,
    EventName VARCHAR(100),
    StartDate DATETIME,
    EndDate DATETIME,
    Location VARCHAR(100),
    MemberId INT,
    FOREIGN KEY (MemberId) REFERENCES Member(MemberId)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Messages (
    MessageID INT PRIMARY KEY,
    Username VARCHAR(25),
    MemberId INT,
    SentBy BOOL,
    Content VARCHAR(250),
    Time DATETIME,
    FOREIGN KEY (Username) REFERENCES User(Username)
    ON DELETE CASCADE,
    FOREIGN KEY (MemberId) REFERENCES Member(MemberId)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Media (
    MediaID INT PRIMARY KEY,
    EventName VARCHAR(300),
    Media LONGBLOB,
    MediaType BOOLEAN,
    Date DATETIME,
    EventId INT,
    MemberId INT,
    FOREIGN KEY (EventId) REFERENCES Events(EventId)
    ON DELETE SET NULL,
    FOREIGN KEY (MemberId) REFERENCES Member(MemberId)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Shop (
    ItemID INT PRIMARY KEY,
    MerchType VARCHAR(25),
    Merchant VARCHAR(50),
    Link VARCHAR(250)
);

CREATE TABLE IF NOT EXISTS Register (
    Username VARCHAR(25),
    EventID INT,
    RegistrationTime DATETIME,
    PRIMARY KEY (Username, EventID),
    FOREIGN KEY (Username) REFERENCES User(Username),
    FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

CREATE TABLE IF NOT EXISTS ContentPreferences (
    Username VARCHAR(25),
    MediaID INT,
    Bias VARCHAR(25),
    EventName VARCHAR(300),
    PRIMARY KEY (Username, MediaID),
    FOREIGN KEY (Username) REFERENCES User(Username),
    FOREIGN KEY (MediaID) REFERENCES Media(MediaID)
);

CREATE TABLE IF NOT EXISTS ShopPreferences (
    Username VARCHAR(25),
    ItemID INT,
    Bias VARCHAR(25),
    EventName VARCHAR(300), 
    PRIMARY KEY (Username, ItemID),
    FOREIGN KEY (Username) REFERENCES User(Username),
    FOREIGN KEY (ItemID) REFERENCES Shop(ItemID)
);

INSERT INTO Member (MemberId, Username) VALUES 
(1, 'Sakura'),
(2, 'Chaewon'),
(3, 'Yunjin'),
(4, 'Kazuha'),
(5, 'Eunchae');