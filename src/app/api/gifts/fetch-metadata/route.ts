import { NextResponse, NextRequest } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const response = await fetch(url)
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: response.status })
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
    const imageUrl = $('meta[property="og:image"]').attr('content') || ''

    // Attempt to extract price from Schema.org JSON-LD or other common meta tags
    let price: number | null = null
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const jsonLd = JSON.parse($(elem).html() || '')
        if (jsonLd && (jsonLd['@type'] === 'Product' || jsonLd['@type'] === 'Offer') && jsonLd.offers) {
          const offer = Array.isArray(jsonLd.offers) ? jsonLd.offers[0] : jsonLd.offers
          if (offer && offer.price) {
            price = parseFloat(offer.price)
            return false // Break out of .each loop
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    })

    // Fallback for price from meta tags (less reliable)
    if (price === null) {
      const priceMeta = $('meta[property="product:price:amount"]').attr('content') ||
                        $('meta[itemprop="price"]').attr('content') ||
                        $('meta[name="price"]').attr('content')
      if (priceMeta) {
        price = parseFloat(priceMeta)
      }
    }

    return NextResponse.json({ title, description, imageUrl, price }, { status: 200 })

  } catch (error: unknown) {
    console.error('Error fetching metadata:', error)
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
