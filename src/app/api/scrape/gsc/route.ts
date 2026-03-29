import { NextRequest, NextResponse } from 'next/server';
import { scrapeGscRegister } from '@/lib/scrapers/gsc-scraper';

export async function GET(request: NextRequest) {
  // Require a secret token to prevent unauthorised triggering
  const token = request.nextUrl.searchParams.get('token');
  if (!process.env.SCRAPE_SECRET || token !== process.env.SCRAPE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await scrapeGscRegister();
    return NextResponse.json({
      success: true,
      scrapedAt: result.scrapedAt,
      totalCount: result.totalCount,
      errors: result.errors,
      sample: result.licensees.slice(0, 3),
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: String(err),
      },
      { status: 500 },
    );
  }
}
