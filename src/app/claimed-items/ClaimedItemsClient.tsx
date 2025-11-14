'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ClaimedItem {
  id: string;
  name: string;
  notes?: string;
  price?: number;
  product_url?: string;
  product_title?: string;
  product_image_url?: string;
}

interface ClaimedItemsClientProps {
  claimedItems: ClaimedItem[];
}

export default function ClaimedItemsClient({ claimedItems: initialClaimedItems }: ClaimedItemsClientProps) {
  const [claimedItems, setClaimedItems] = useState<ClaimedItem[]>(initialClaimedItems);
  const [copyMessage, setCopyMessage] = useState('');

  const handleShareToClipboard = () => {
    let todoList = "My Claimed Christmas Gifts:\n\n";
    claimedItems.forEach((item, index) => {
      todoList += `${index + 1}. ${item.name}\n`;
      if (item.notes) todoList += `   Notes: ${item.notes}\n`;
      if (item.price) todoList += `   Price: $${item.price.toFixed(2)}\n`;
      if (item.product_url) todoList += `   Link: ${item.product_url}\n`;
      todoList += "\n";
    });

    navigator.clipboard.writeText(todoList)
      .then(() => {
        setCopyMessage('Copied to clipboard!');
        setTimeout(() => setCopyMessage(''), 3000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setCopyMessage('Failed to copy!');
      });
  };

  return (
    <div className="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <div className="max-w-screen-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">My Claimed Gifts</h1>
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">← Back to Home</Link>

        {copyMessage && <p className="text-green-500 mb-4">{copyMessage}</p>}

        {claimedItems.length === 0 ? (
          <p className="text-center text-gray-600">You haven&apos;t claimed any gifts yet.</p>
        ) : (
          <>
            <button
              onClick={handleShareToClipboard}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm mb-6"
            >
              Share as To-Do List
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {claimedItems.map(item => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm p-4 flex flex-col justify-between">
                  {item.product_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product_image_url} alt={item.product_title || item.name} className="w-full h-32 object-cover rounded-md mb-2" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold line-clamp-2">{item.name}</h3>
                    {item.notes && <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{item.notes}</p>}
                    {item.price !== undefined && item.price !== null && (
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    {item.product_url && (
                      <a
                        href={item.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-500 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center"
                        aria-label="Open Link"
                      >
                        <Image src="/link.svg" alt="Open Link" width={16} height={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}