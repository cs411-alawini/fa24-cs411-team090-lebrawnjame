import { NextResponse } from 'next/server';
import { createConnection } from 'mysql2/promise';

export async function GET() {
    const connection = await createConnection({
        host: '35.226.113.165',
        user: 'dev',
        password: 'hello',
        database: 'lephoningdbtest',
    });

    try {
        const [rows] = await connection.execute('SELECT * FROM Messages WHERE Username = "bruceconner"');
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Database query error:", error);
        return NextResponse.json({ message: 'Database query error', error }, { status: 500 });
    } finally {
        await connection.end();
    }
}