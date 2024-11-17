import { NextResponse } from 'next/server';
import { createConnection } from 'mysql2/promise';

export async function GET(request: Request) {
    // Parse the URL and extract the 'query' parameter
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
    }

    const connection = await createConnection({
        host: '35.226.113.165',
        user: 'dev',
        password: 'hello',
        database: 'lephoningdbtest',
    });

    try {
        const [rows] = await connection.execute(query);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Database query error:", error);
        return NextResponse.json({ message: 'Database query error', error }, { status: 500 });
    } finally {
        await connection.end();
    }
}