// src/app/api/scrape-pricespy/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  console.log(`Scraping PriceSpy for query: ${query}`);

  try {
    // Step 1: Search PriceSpy
    // REPLACE SPACES WITH + FOR URL ENCODING
    console.log(query.replace(/ /g, '+'))
    const searchUrl = `https://pricespy.co.nz/search?query=${query.replace(/ /g, '+')}`;
    const { data: searchHtml } = await axios.get(searchUrl);
    const $search = cheerio.load(searchHtml);

    // Assuming the first product link is within an anchor tag that links to a product page
    const firstProductLinkElement = $search('a.productName').first(); // Refined selector based on provided HTML
    const firstProductRelativeLink = firstProductLinkElement.attr('href');

    if (!firstProductRelativeLink) {
      return NextResponse.json({ imageUrl: null, message: 'No product link found on search page' }, { status: 200 });
    }

    // Step 2: Go to the product page
    const { data: productHtml } = await axios.get(searchUrl);
    const $product = cheerio.load(productHtml);

    // Assuming the main product image is within an img tag with the class 'object-contain'
    const mainImageElement = $product('div img.object-contain').first(); // Refined selector based on provided HTML
    const imageUrl = mainImageElement.attr('src');

    if (!imageUrl) {
      return NextResponse.json({ imageUrl: null, message: 'No main image found on product page' }, { status: 200 });
    }

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('Error scraping PriceSpy:', error);
    return NextResponse.json({ error: 'Failed to scrape PriceSpy' }, { status: 500 });
  }
}
