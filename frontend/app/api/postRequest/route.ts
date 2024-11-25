import { NextResponse } from 'next/server';
import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }

    const { query, values } = body;
    if (!query || !Array.isArray(values)) {
        return NextResponse.json({ message: 'Query and values are required' }, { status: 400 });
    }

    const transformedValues = await Promise.all(
        values.map(async (value) => {
            if (typeof value === 'string') {
                if (value.trim().toLowerCase() === 'premium') return '1';
                if (value.trim().toLowerCase() === 'basic') return '0';
            }
            return value;
        })
    );

    const connection = await createConnection({
        host: '35.226.113.165',
        user: 'dev',
        password: 'hello',
        database: 'lephoningdbtest',
    });

    try {
        const [result] = await connection.query(query, transformedValues);
        return NextResponse.json({ message: 'Success', result });
    } catch (error) {
        console.error("Database query error:", error);
        return NextResponse.json({ message: 'Database query error', error }, { status: 500 });
    } finally {
        await connection.end();
    }
}
