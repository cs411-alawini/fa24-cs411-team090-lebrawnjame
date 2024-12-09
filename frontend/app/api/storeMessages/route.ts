import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

type Messages = {
  MessageID: number;
  Username: string;
  MemberId: number;
  SentBy: number;
  Content: string;
  Time: string;
};

export async function POST(req: Request) {
  const connection = await mysql.createConnection({
    host: '35.226.113.165',
    user: 'dev',
    password: 'hello',
    database: 'lephoningdbtest',
  });

  try {
    const { messages }: { messages: Messages[] } = await req.json();
    await connection.beginTransaction();

    // Prepare the values for batch insertion
    const values = messages.map(message => [
      message.Username,
      message.MemberId,
      message.SentBy,
      message.Content,
      message.Time
    ]);

    const limit_values = messages.map(message => [
      message.Username,
      message.MemberId
    ]);

    // Perform a single batch insert
    await connection.query(
      'INSERT INTO Messages (Username, MemberId, SentBy, Content, Time) VALUES ?',
      [values]
    );

    await connection.commit();

    // For each user-member chat log, run stored procedure to limit their messages
    for (const value of limit_values) {
      await connection.query('CALL LimitMessages(?, ?)', value);
    }

    await connection.commit();

    return NextResponse.json({ message: 'Messages stored successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error storing messages:', error);
    return NextResponse.json({ error: 'Failed to store messages' }, { status: 500 });
  } finally {
    await connection.end();
  }
}