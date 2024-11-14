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