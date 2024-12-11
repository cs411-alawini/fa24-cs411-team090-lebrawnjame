// import { NextResponse } from 'next/server';
// import { createConnection } from 'mysql2/promise';

// export async function GET() {
//     const connection = await createConnection({
//         host: '35.226.113.165',
//         user: 'dev',
//         password: 'hello',
//         database: 'lephoningdbtest',
//     });

//     try {
//         // Query to select media items from the Media table
//         const [rows] = await connection.execute('SELECT MediaID as id, MediaType as type, Media as src, EventName as alt FROM Media') as [any[], any];
        
//         // Transform the data, converting BLOB to base64 string
//         const mediaItems = rows.map((row) => ({
//             id: row.id,
//             type: row.type === 1 ? 'image' : 'video',
//             src: `data:${row.type === 1 ? 'image' : 'video'};base64,${row.src.toString('base64')}`, // Convert BLOB to base64
//             alt: row.alt,
//         }));

//         return NextResponse.json(mediaItems);
//     } catch (error) {
//         console.error("Database query error:", error);
//         return NextResponse.json({ message: 'Database query error', error }, { status: 500 });
//     } finally {
//         await connection.end();
//     }
// }

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  const mediaDirectory = path.join(process.cwd(), 'media')
  
  try {
    const fileNames = await fs.readdir(mediaDirectory)
    const mediaItems = fileNames.map((fileName, index) => {
      const filePath = `/media/${fileName}`
      const fileExtension = path.extname(fileName).toLowerCase()
      const isVideo = ['.mp4', '.webm', '.ogg'].includes(fileExtension)

      return {
        id: index + 1,
        type: isVideo ? 'video' : 'image',
        src: filePath,
        alt: `LE SSERAFIM ${isVideo ? 'video' : 'photo'} ${index + 1}`,
      }
    })

    return NextResponse.json(mediaItems)
  } catch (error) {
    console.error('Error reading media directory:', error)
    return NextResponse.json({ error: 'Failed to load media items' }, { status: 500 })
  }
}