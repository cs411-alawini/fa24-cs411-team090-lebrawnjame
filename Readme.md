# Team090-lebrawnjame
# Team090-lebrawnjame

Here is the code for the triggers and stored procedure we used: 


Trigger for setting user's bias (favorite member):

    CREATE TRIGGER UpdateUserBiasContent
    AFTER INSERT ON Messages
    FOR EACH ROW
    BEGIN
        DECLARE MostMessagedMember INT;
        DECLARE MemberName VARCHAR(255);

        SELECT Messages.MemberID INTO MostMessagedMember
        FROM Messages
        WHERE Username = NEW.Username
        GROUP BY MemberID
        ORDER BY COUNT(*) DESC
        LIMIT 1;

        CASE MostMessagedMember
            WHEN 1 THEN SET MemberName = 'Sakura';
            WHEN 2 THEN SET MemberName = 'Chaewon';
            WHEN 3 THEN SET MemberName = 'Yunjin';
            WHEN 4 THEN SET MemberName = 'Kazuha';
            WHEN 5 THEN SET MemberName = 'Eunchae';
            ELSE SET MemberName = NULL;
        END CASE;

        UPDATE ShopPreferences
        SET ShopPreferences.Bias = MemberName
        WHERE ShopPreferences.Username = NEW.Username;

        UPDATE ContentPreferences
        SET ContentPreferences.Bias = MemberName
        WHERE ContentPreferences.Username = NEW.Username;
    END;


Trigger for defaulting user's ShopPreferences Table when they sign up:

    CREATE TRIGGER AddPrefs
    AFTER INSERT ON User
    FOR EACH ROW
    BEGIN
        INSERT INTO ShopPreferences VALUES (NEW.Username, 1, "Sakura", "Tour");
    END;


Stored Procedure for Limiting Messages in Chat/Messages Table:

    CREATE PROCEDURE LimitMessages (
        IN Username VARCHAR(255), 
        IN MemberId INT
    )
    BEGIN
        DELETE FROM Messages
        WHERE Username = UserName
        AND MemberID = MemberId
        AND MessageID NOT IN (
            SELECT MessageID
            FROM (
                SELECT MessageID
                FROM Messages
                WHERE Username = UserName
                    AND MemberID = MemberId
                ORDER BY Time DESC
                LIMIT 10
            ) AS TempTable
        );
    END;

