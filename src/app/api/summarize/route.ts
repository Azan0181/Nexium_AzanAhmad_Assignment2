import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 });
    }

    // Fetch the HTML
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const paragraphs: string[] = [];
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 50) paragraphs.push(text);
    });

    if (!paragraphs.length) {
      return NextResponse.json({ error: 'No content found.' }, { status: 400 });
    }

    // take more paragraphs
    const summary = paragraphs.slice(0, 30).join('\n\n');

    return NextResponse.json({ summary });
  } catch (err) {
    console.error('[SUMMARY_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to extract summary.' },
      { status: 500 }
    );
  }
}
