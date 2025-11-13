(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/list/[familyId]/AddGiftForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddGiftForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Debounce function defined outside the component to be stable
const debounce = (func, delay)=>{
    let timeout = null;
    return (...args)=>{
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(()=>{
            func(...args);
        }, delay);
    };
};
function AddGiftForm({ familyId, currentUserId, members, onClose }) {
    _s();
    const [newGiftDescription, setNewGiftDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newGiftNotes, setNewGiftNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newGiftPrice, setNewGiftPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newProductUrl, setNewProductUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [fetchedProductTitle, setFetchedProductTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [fetchedProductImageUrl, setFetchedProductImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [fetchedProductPrice, setFetchedProductPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isFetchingMetadata, setIsFetchingMetadata] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedRecipientId, setSelectedRecipientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(currentUserId) // Default to current user
    ;
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const fetchMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AddGiftForm.useCallback[fetchMetadata]": async (url)=>{
            if (!url || !url.startsWith('http')) {
                setFetchedProductTitle('');
                setFetchedProductImageUrl('');
                setFetchedProductPrice('');
                return;
            }
            setIsFetchingMetadata(true);
            try {
                const res = await fetch('/api/gifts/fetch-metadata', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    setFetchedProductTitle(data.title || '');
                    setFetchedProductImageUrl(data.imageUrl || '');
                    setFetchedProductPrice(data.price ? data.price.toFixed(2) : '');
                    // If price is fetched, pre-fill the gift price field
                    if (data.price) setNewGiftPrice(data.price.toFixed(2));
                } else {
                    setMessage(`Failed to fetch metadata: ${data.error}`);
                    setFetchedProductTitle('');
                    setFetchedProductImageUrl('');
                    setFetchedProductPrice('');
                }
            } catch (error) {
                let errorMessage = 'Error fetching metadata';
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }
                setMessage(`Error fetching metadata: ${errorMessage}`);
                setFetchedProductTitle('');
                setFetchedProductImageUrl('');
                setFetchedProductPrice('');
            } finally{
                setIsFetchingMetadata(false);
            }
        }
    }["AddGiftForm.useCallback[fetchMetadata]"], []);
    const debouncedFetchMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(debounce(fetchMetadata, 700), [
        fetchMetadata
    ]);
    const handleAddGift = async (e)=>{
        e.preventDefault();
        setMessage('');
        if (!newGiftDescription && !fetchedProductTitle) {
            setMessage('Gift description or fetched product title is required.');
            return;
        }
        if (!selectedRecipientId) {
            setMessage('Please select a recipient.');
            return;
        }
        // Get the current max order_index for the list
        const { data: maxOrderData, error: _maxOrderError } = await supabase.from('items').select('order_index').eq('list_id', familyId).order('order_index', {
            ascending: false
        }).limit(1).single();
        const nextOrderIndex = maxOrderData ? maxOrderData.order_index + 1 : 0;
        const { error } = await supabase.from('items').insert([
            {
                list_id: familyId,
                user_id: selectedRecipientId,
                name: newGiftDescription || fetchedProductTitle,
                notes: newGiftNotes || null,
                price: newGiftPrice ? parseFloat(newGiftPrice) : fetchedProductPrice ? parseFloat(fetchedProductPrice) : null,
                order_index: nextOrderIndex,
                product_url: newProductUrl || null,
                product_title: fetchedProductTitle || null,
                product_image_url: fetchedProductImageUrl || null,
                product_price: fetchedProductPrice ? parseFloat(fetchedProductPrice) : null
            }
        ]);
        if (error) {
            setMessage(`Failed to add gift: ${error.message}`);
        } else {
            setMessage(`Gift "${newGiftDescription || fetchedProductTitle}" added successfully!`);
            setNewGiftDescription('');
            setNewGiftNotes('');
            setNewGiftPrice('');
            setNewProductUrl('');
            setFetchedProductTitle('');
            setFetchedProductImageUrl('');
            setFetchedProductPrice('');
            router.refresh(); // Refresh the current page to show the new gift
            onClose(); // Close the modal after adding gift
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                    "aria-label": "Close",
                    children: "×"
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-semibold mb-3",
                    children: "Add a Gift"
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-500 mb-3",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                    lineNumber: 160,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleAddGift,
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "recipient",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Recipient"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "recipient",
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: selectedRecipientId,
                                    onChange: (e)=>setSelectedRecipientId(e.target.value),
                                    required: true,
                                    children: members.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: member.id,
                                            children: [
                                                member.name,
                                                " ",
                                                member.id === currentUserId ? '(You)' : ''
                                            ]
                                        }, member.id, true, {
                                            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                            lineNumber: 172,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "product-url",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Product URL (Optional)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 179,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "url",
                                    id: "product-url",
                                    placeholder: "e.g., https://example.com/product",
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newProductUrl,
                                    onChange: (e)=>{
                                        setNewProductUrl(e.target.value);
                                        debouncedFetchMetadata(e.target.value);
                                    },
                                    onBlur: (e)=>fetchMetadata(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this),
                                isFetchingMetadata && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 mt-1",
                                    children: "Fetching product details..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 194,
                                    columnNumber: 36
                                }, this),
                                fetchedProductTitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md flex items-center space-x-3",
                                    children: [
                                        fetchedProductImageUrl && // eslint-disable-next-line @next/next/no-img-element
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: fetchedProductImageUrl,
                                            alt: fetchedProductTitle,
                                            className: "w-16 h-16 object-cover rounded-md"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                            lineNumber: 199,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-gray-700 dark:text-gray-200",
                                                    children: fetchedProductTitle
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                                    lineNumber: 202,
                                                    columnNumber: 19
                                                }, this),
                                                fetchedProductPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600 dark:text-gray-300",
                                                    children: [
                                                        "$",
                                                        fetchedProductPrice
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                                    lineNumber: 203,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                            lineNumber: 201,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 196,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "gift-desc",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Gift Description (or use fetched title)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 209,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    id: "gift-desc",
                                    placeholder: "Gift description",
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newGiftDescription,
                                    onChange: (e)=>setNewGiftDescription(e.target.value),
                                    required: !fetchedProductTitle
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 212,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "gift-notes",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Notes (Optional)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 223,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    id: "gift-notes",
                                    placeholder: "e.g., Size M, color blue, link to product",
                                    rows: 3,
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newGiftNotes,
                                    onChange: (e)=>setNewGiftNotes(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                            lineNumber: 222,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "gift-price",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Price (Optional)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 236,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    id: "gift-price",
                                    placeholder: "e.g., 25.99",
                                    step: "0.01",
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newGiftPrice,
                                    onChange: (e)=>setNewGiftPrice(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                            lineNumber: 235,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm",
                            children: "Add Gift"
                        }, void 0, false, {
                            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                            lineNumber: 249,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
            lineNumber: 151,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/list/[familyId]/AddGiftForm.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}
_s(AddGiftForm, "1zHNjk0wt2IuIwSJaPuTyeghX48=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AddGiftForm;
var _c;
__turbopack_context__.k.register(_c, "AddGiftForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/list/[familyId]/ClaimUnclaimButtons.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClaimUnclaimButtons
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ClaimUnclaimButtons({ gift, userId }) {
    _s();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleClaimGift = async ()=>{
        setMessage('');
        const res = await fetch(`/api/gifts/${gift.id}/claim`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                claimedByUserId: userId
            })
        });
        if (res.ok) {
            setMessage('Gift claimed successfully!');
            router.refresh();
        } else {
            const errorText = await res.text();
            setMessage(`Failed to claim gift: ${errorText}`);
        }
    };
    const handleUnclaimGift = async ()=>{
        setMessage('');
        const res = await fetch(`/api/gifts/${gift.id}/unclaim`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            setMessage('Gift unclaimed successfully!');
            router.refresh();
        } else {
            const errorText = await res.text();
            setMessage(`Failed to unclaim gift: ${errorText}`);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-500 text-sm mb-2",
                children: message
            }, void 0, false, {
                fileName: "[project]/src/app/list/[familyId]/ClaimUnclaimButtons.tsx",
                lineNumber: 58,
                columnNumber: 19
            }, this),
            !gift.is_purchased && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleClaimGift,
                className: "ml-4 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm",
                children: "Claim"
            }, void 0, false, {
                fileName: "[project]/src/app/list/[familyId]/ClaimUnclaimButtons.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this),
            gift.is_purchased && gift.purchased_by === userId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleUnclaimGift,
                className: "ml-4 px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm",
                children: "Unclaim"
            }, void 0, false, {
                fileName: "[project]/src/app/list/[familyId]/ClaimUnclaimButtons.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/list/[familyId]/ClaimUnclaimButtons.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(ClaimUnclaimButtons, "R0q7tHdChZllRnUPrpAE9Tj9aXw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ClaimUnclaimButtons;
var _c;
__turbopack_context__.k.register(_c, "ClaimUnclaimButtons");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/list/[familyId]/AddMemberForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddMemberForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function AddMemberForm({ familyId, currentUserId, members, onClose }) {
    _s();
    const [newMemberName, setNewMemberName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newMemberEmail, setNewMemberEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('') // Assuming email for finding user ID
    ;
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleAddMember = async (e)=>{
        e.preventDefault();
        setMessage('');
        console.log("Attempting to add member:", {
            newMemberName,
            newMemberEmail,
            familyId,
            currentUserId
        });
        if (!newMemberName || !newMemberEmail) {
            setMessage('Member name and email are required.');
            return;
        }
        // First, check if the current user is part of this family list
        const isCurrentUserMember = members.some((member)=>member.id === currentUserId);
        if (!isCurrentUserMember) {
            setMessage('You must be a member of this list to add new members.');
            return;
        }
        try {
            const res = await fetch(`/api/lists/${familyId}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    memberName: newMemberName,
                    memberEmail: newMemberEmail
                })
            });
            console.log("API response status:", res.status);
            const data = await res.json();
            console.log("API response data:", data);
            if (res.ok) {
                setMessage(data.message);
                setNewMemberName('');
                setNewMemberEmail('');
                router.refresh(); // Refresh the page to show the new member in the dropdowns
                onClose(); // Close the modal after adding member
            } else {
                setMessage(`Failed to add member: ${data.error}`);
            }
        } catch (error) {
            let errorMessage = 'Error adding member';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            setMessage(`Error adding member: ${errorMessage}`);
            console.error("Error during add member fetch:", error);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                    "aria-label": "Close",
                    children: "×"
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-2xl font-semibold mb-4",
                    children: "Add New Family Member"
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-500 mb-4",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                    lineNumber: 80,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleAddMember,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "newMemberName",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Member Name"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    id: "newMemberName",
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newMemberName,
                                    onChange: (e)=>setNewMemberName(e.target.value),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "newMemberEmail",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Member Email"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    id: "newMemberEmail",
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newMemberEmail,
                                    onChange: (e)=>setNewMemberEmail(e.target.value),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm",
                            children: "Add Member"
                        }, void 0, false, {
                            fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/list/[familyId]/AddMemberForm.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(AddMemberForm, "1KyunDc4SeoSgJnC8+BCF8DAaRc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AddMemberForm;
var _c;
__turbopack_context__.k.register(_c, "AddMemberForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/list/[familyId]/EditGiftForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditGiftForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function EditGiftForm({ gift, onClose, onSave }) {
    _s();
    const [newDescription, setNewDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(gift.description);
    const [newNotes, setNewNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(gift.notes || '');
    const [newPrice, setNewPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(gift.price?.toString() || '');
    const [newProductUrl, setNewProductUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(gift.product_url || '');
    const [fetchedProductTitle, setFetchedProductTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(gift.product_title || '');
    const [fetchedProductImageUrl, setFetchedProductImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(gift.product_image_url || '');
    const [fetchedProductPrice, setFetchedProductPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(gift.product_price?.toString() || '');
    const [isFetchingMetadata, setIsFetchingMetadata] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Debounce function defined outside the component to be stable
    const debounce = (func, delay)=>{
        let timeout = null;
        return (...args)=>{
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(()=>{
                func(...args);
            }, delay);
        };
    };
    const fetchMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EditGiftForm.useCallback[fetchMetadata]": async (url)=>{
            if (!url || !url.startsWith('http')) {
                setFetchedProductTitle('');
                setFetchedProductImageUrl('');
                setFetchedProductPrice('');
                return;
            }
            setIsFetchingMetadata(true);
            try {
                const res = await fetch('/api/gifts/fetch-metadata', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    setFetchedProductTitle(data.title || '');
                    setFetchedProductImageUrl(data.imageUrl || '');
                    setFetchedProductPrice(data.price ? data.price.toFixed(2) : '');
                    // If price is fetched, pre-fill the gift price field
                    if (data.price) setNewPrice(data.price.toFixed(2));
                } else {
                    setMessage(`Failed to fetch metadata: ${data.error}`);
                    setFetchedProductTitle('');
                    setFetchedProductImageUrl('');
                    setFetchedProductPrice('');
                }
            } catch (error) {
                let errorMessage = 'Error fetching metadata';
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }
                setMessage(`Error fetching metadata: ${errorMessage}`);
                setFetchedProductTitle('');
                setFetchedProductImageUrl('');
                setFetchedProductPrice('');
            } finally{
                setIsFetchingMetadata(false);
            }
        }
    }["EditGiftForm.useCallback[fetchMetadata]"], []);
    const debouncedFetchMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(debounce(fetchMetadata, 700), [
        fetchMetadata
    ]);
    const handleSave = async (e)=>{
        e.preventDefault();
        setMessage('');
        if (!newDescription) {
            setMessage('Gift description cannot be empty.');
            return;
        }
        const res = await fetch(`/api/gifts/${gift.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: newDescription,
                notes: newNotes,
                price: newPrice ? parseFloat(newPrice) : null,
                product_url: newProductUrl || null,
                product_title: fetchedProductTitle || null,
                product_image_url: fetchedProductImageUrl || null,
                product_price: fetchedProductPrice ? parseFloat(fetchedProductPrice) : null
            })
        });
        if (res.ok) {
            setMessage('Gift updated successfully!');
            onSave();
        } else {
            const errorText = await res.text();
            setMessage(`Failed to update gift: ${errorText}`);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white p-8 rounded-lg shadow-xl max-w-md w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold mb-4",
                    children: "Edit Gift"
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-500 mb-4",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                    lineNumber: 129,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSave,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "gift-description",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Gift Description"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    id: "gift-description",
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newDescription,
                                    onChange: (e)=>setNewDescription(e.target.value),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "product-url",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Product URL (Optional)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "url",
                                    id: "product-url",
                                    placeholder: "e.g., https://example.com/product",
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newProductUrl,
                                    onChange: (e)=>{
                                        setNewProductUrl(e.target.value);
                                        debouncedFetchMetadata(e.target.value);
                                    },
                                    onBlur: (e)=>fetchMetadata(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this),
                                isFetchingMetadata && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 mt-1",
                                    children: "Fetching product details..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 158,
                                    columnNumber: 36
                                }, this),
                                fetchedProductTitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md flex items-center space-x-3",
                                    children: [
                                        fetchedProductImageUrl && // eslint-disable-next-line @next/next/no-img-element
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: fetchedProductImageUrl,
                                            alt: fetchedProductTitle,
                                            className: "w-16 h-16 object-cover rounded-md"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                            lineNumber: 163,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-gray-700 dark:text-gray-200",
                                                    children: fetchedProductTitle
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 19
                                                }, this),
                                                fetchedProductPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600 dark:text-gray-300",
                                                    children: [
                                                        "$",
                                                        fetchedProductPrice
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                            lineNumber: 165,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 160,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "gift-notes",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Notes (Optional)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    id: "gift-notes",
                                    placeholder: "e.g., Size M, color blue, link to product",
                                    rows: 3,
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newNotes,
                                    onChange: (e)=>setNewNotes(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "gift-price",
                                    className: "block text-sm font-medium text-gray-300",
                                    children: "Price (Optional)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    id: "gift-price",
                                    placeholder: "e.g., 25.99",
                                    step: "0.01",
                                    className: "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    value: newPrice,
                                    onChange: (e)=>setNewPrice(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                            lineNumber: 183,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                    children: "Save Changes"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                            lineNumber: 195,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
            lineNumber: 127,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/list/[familyId]/EditGiftForm.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_s(EditGiftForm, "7ZN3JdKYXjujv4f9OsOhjTleU3A=");
_c = EditGiftForm;
var _c;
__turbopack_context__.k.register(_c, "EditGiftForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/list/[familyId]/FamilyListClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FamilyListClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hello-pangea/dnd/dist/dnd.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)"); // Import Image component
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$list$2f5b$familyId$5d2f$AddGiftForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/list/[familyId]/AddGiftForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$list$2f5b$familyId$5d2f$ClaimUnclaimButtons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/list/[familyId]/ClaimUnclaimButtons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$list$2f5b$familyId$5d2f$AddMemberForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/list/[familyId]/AddMemberForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$list$2f5b$familyId$5d2f$EditGiftForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/list/[familyId]/EditGiftForm.tsx [app-client] (ecmascript)"); // New component for editing gifts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$qr$2d$code$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-qr-code/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)"); // Import ReactDOM
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
// Utility function to format notes with clickable links
const formatNotesWithLinks = (notes)=>{
    if (!notes) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return notes.split(urlRegex).map((part, index)=>{
        if (part.match(urlRegex)) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: part,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-blue-500 hover:underline",
                children: part
            }, index, false, {
                fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
        return part;
    });
};
function FamilyListClient({ initialFamily, initialUser, familyId }) {
    _s();
    const [family, setFamily] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFamily);
    const [user] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialUser);
    const [editingGift, setEditingGift] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sortKey, setSortKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('order_index'); // Default sort by order_index
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('asc'); // Default sort order ascending
    const [showQrModal, setShowQrModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAddGiftModal, setShowAddGiftModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false) // New state for AddGiftForm modal
    ;
    const [showAddMemberModal, setShowAddMemberModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false) // New state for AddMemberForm modal
    ;
    const [inviteToken, setInviteToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('list') // New state for view mode
    ;
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // New state to track dragging
    const [sourceDroppableId, setSourceDroppableId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // New state to track the source list of the dragged item
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [portalNode, setPortalNode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FamilyListClient.useEffect": ()=>{
            let element = document.getElementById('drag-portal');
            if (!element) {
                element = document.createElement('div');
                element.id = 'drag-portal';
                document.body.appendChild(element);
            }
            const animationFrame = requestAnimationFrame({
                "FamilyListClient.useEffect.animationFrame": ()=>{
                    setPortalNode(element);
                    setMounted(true);
                }
            }["FamilyListClient.useEffect.animationFrame"]);
            return ({
                "FamilyListClient.useEffect": ()=>cancelAnimationFrame(animationFrame)
            })["FamilyListClient.useEffect"];
        }
    }["FamilyListClient.useEffect"], []);
    const handleDragEnd = async (result)=>{
        console.log('handleDragEnd result:', result);
        // If no destination, or dropped outside any droppable, delete the item
        if (!result.destination) {
            console.log('Dropped outside any droppable. Deleting item:', result.draggableId);
            handleDeleteGift(result.draggableId);
            setIsDragging(false); // End dragging state here if deleted
            setSourceDroppableId(null); // Clear source droppable ID
            return;
        }
        // Check if dropped into a trash bin
        if (result.destination.droppableId === 'trash-bin-global') {
            console.log('Dropped into trash bin:', result.destination.droppableId);
            handleDeleteGift(result.draggableId);
            setIsDragging(false); // End dragging state here if deleted
            setSourceDroppableId(null); // Clear source droppable ID
            return;
        }
        console.log('Dropped into a valid droppable (not trash bin):', result.destination.droppableId);
        const sourceMemberIndex = family.members.findIndex((m)=>m.id === result.source.droppableId);
        const destinationMemberIndex = family.members.findIndex((m)=>m.id === result.destination?.droppableId);
        if (sourceMemberIndex === -1 || destinationMemberIndex === -1) {
            console.error('Source or destination member not found.');
            setIsDragging(false); // End dragging state if members not found
            return;
        }
        const newFamily = {
            ...family
        };
        const sourceMember = {
            ...newFamily.members[sourceMemberIndex]
        };
        const destinationMember = {
            ...newFamily.members[destinationMemberIndex]
        };
        // If dropped in the same list and same position, do nothing
        if (result.source.droppableId === result.destination.droppableId && result.source.index === result.destination.index) {
            setIsDragging(false); // End dragging state if no change
            return;
        }
        const [removed] = sourceMember.gifts.splice(result.source.index, 1);
        destinationMember.gifts.splice(result.destination.index, 0, removed);
        // Re-index gifts in both source and destination members
        sourceMember.gifts = sourceMember.gifts.map((gift, index)=>({
                ...gift,
                order_index: index
            }));
        destinationMember.gifts = destinationMember.gifts.map((gift, index)=>({
                ...gift,
                order_index: index
            }));
        // Optimistically update UI
        newFamily.members[sourceMemberIndex] = sourceMember;
        newFamily.members[destinationMemberIndex] = destinationMember;
        setFamily(newFamily);
        // Store the original family state for potential rollback
        const originalFamily = family;
        // Collect all gifts from the entire family structure that need their order_index updated
        const giftsToUpdate = newFamily.members.flatMap((member)=>member.gifts.map((gift)=>({
                    id: gift.id,
                    order_index: gift.order_index,
                    list_id: family.id
                })));
        // Call API to update order
        const res = await fetch('/api/gifts/reorder', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: giftsToUpdate
            })
        });
        if (!res.ok) {
            const errorText = await res.text();
            alert(`Failed to reorder gifts: ${errorText}`);
            // Revert UI on API failure
            setFamily(originalFamily);
        } else {
            router.refresh(); // Refresh the page to ensure server-side state is consistent
        }
        setIsDragging(false); // End dragging after all logic is complete
    };
    const handleDeleteGift = async (giftId)=>{
        console.log('Attempting to delete gift:', giftId);
        const res = await fetch(`/api/gifts/${giftId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            console.log('Gift deleted successfully from API:', giftId);
            // Update local state to remove the deleted gift
            const newFamily = {
                ...family
            };
            newFamily.members = newFamily.members.map((member)=>({
                    ...member,
                    gifts: member.gifts.filter((gift)=>gift.id !== giftId)
                }));
            setFamily(newFamily);
            console.log('Local state updated for gift:', giftId);
        } else {
            const errorText = await res.text();
            console.error('Failed to delete gift from API:', giftId, errorText);
            alert(`Failed to delete gift: ${errorText}`);
        }
    };
    const handleSort = (key)=>{
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };
    const handleRemoveMember = async (memberId)=>{
        if (!confirm('Are you sure you want to remove this member? This will delete all of their gifts from the list.')) return;
        console.log(`Removing member ${memberId} from family ${family.id}`);
        const res = await fetch(`/api/lists/${family.id}/members/${memberId}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            // Update local state to remove the member and their gifts
            const newFamily = {
                ...family
            };
            newFamily.members = newFamily.members.filter((member)=>member.id !== memberId);
            setFamily(newFamily);
        } else {
            const errorText = await res.text();
            alert(`Failed to remove member: ${errorText}`);
        }
    };
    const generateInvite = async ()=>{
        const res = await fetch(`/api/lists/${familyId}/invites`, {
            method: 'POST'
        });
        if (res.ok) {
            const { token } = await res.json();
            setInviteToken(token);
            setShowQrModal(true);
        } else {
            const { error } = await res.json();
            alert(`Failed to generate invite link: ${error}`);
        }
    };
    const handleLeaveFamily = async ()=>{
        if (!confirm('Are you sure you want to leave this family list? You will lose access to all gifts and members.')) return;
        const res = await fetch(`/api/lists/${family.id}/leave`, {
            method: 'DELETE'
        });
        if (res.ok) {
            alert('You have successfully left the family list.');
            router.push('/'); // Redirect to home page
        } else {
            const errorText = await res.json();
            alert(`Failed to leave family: ${typeof errorText === 'object' && errorText !== null && 'error' in errorText ? errorText.error : 'Unknown error'}`);
        }
    };
    const sortedGifts = (gifts)=>{
        return [
            ...gifts
        ].sort((a, b)=>{
            let valA;
            let valB;
            if (sortKey === 'order_index') {
                valA = a.order_index || 0;
                valB = b.order_index || 0;
            } else if (sortKey === 'price') {
                valA = a.price || 0;
                valB = b.price || 0;
            } else {
                valA = a[sortKey]?.toString().toLowerCase() || '';
                valB = b[sortKey]?.toString().toLowerCase() || '';
            }
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 py-8 mx-auto fresh-gradient min-h-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-screen-lg mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-4xl font-bold mb-4",
                    children: [
                        family.name,
                        " Christmas List"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 284,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "text-blue-500 hover:underline mb-4 block",
                    children: "← Back to Home"
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 285,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end space-x-4 mb-4",
                    children: [
                        user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowAddGiftModal(true),
                            className: "flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition-colors",
                            "aria-label": "Add Gift",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/gift.svg",
                                    alt: "Add Gift",
                                    width: 24,
                                    height: 24
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 295,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs mt-1 dark:hover:text-black",
                                    children: "Add Gift"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 296,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                            lineNumber: 290,
                            columnNumber: 13
                        }, this),
                        user && user.id === family.owner_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowAddMemberModal(true),
                            className: "flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition-colors",
                            "aria-label": "Add Member",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/add-user.svg",
                                    alt: "Add Member",
                                    width: 24,
                                    height: 24
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 305,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs mt-1 dark:hover:text-black",
                                    children: "Add Member"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 306,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                            lineNumber: 300,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: generateInvite,
                            className: "flex flex-col items-center p-2 rounded-lg hover:bg-gray-200 transition-colors",
                            "aria-label": "Invite with QR Code",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/qr_code.svg",
                                    alt: "QR Code",
                                    width: 24,
                                    height: 24
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 314,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs mt-1 dark:hover:text-black",
                                    children: "Invite"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 315,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                            lineNumber: 309,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 288,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-300",
                            children: "Sort by:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                            lineNumber: 320,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: "px-3 py-1 border border-gray-300 rounded-md text-sm",
                            value: sortKey,
                            onChange: (e)=>handleSort(e.target.value),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "order_index",
                                    children: "Default Order"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 326,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "description",
                                    children: "Description"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 327,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "price",
                                    children: "Price"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 328,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                            lineNumber: 321,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'),
                            className: "px-3 py-1 bg-gray-200 rounded-md text-sm",
                            children: sortOrder === 'asc' ? 'Asc' : 'Desc'
                        }, void 0, false, {
                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                            lineNumber: 330,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "ml-auto flex space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setViewMode('list'),
                                    className: `px-3 py-1 rounded-md text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`,
                                    children: "☰ List"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 337,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setViewMode('grid'),
                                    className: `px-3 py-1 rounded-md text-sm ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`,
                                    children: "▦ Grid"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 343,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                            lineNumber: 336,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 319,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DragDropContext"], {
                    onBeforeDragStart: (start)=>{
                        setIsDragging(true);
                        setSourceDroppableId(start.source.droppableId); // Set the ID of the list the item is dragged from
                    },
                    onDragEnd: handleDragEnd,
                    children: [
                        family.members.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-2xl font-semibold mb-4",
                                                children: [
                                                    member.name,
                                                    "'s List"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                lineNumber: 362,
                                                columnNumber: 17
                                            }, this),
                                            user && user.id === family.owner_id && user.id !== member.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleRemoveMember(member.id),
                                                className: "px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs",
                                                children: "Remove"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                lineNumber: 364,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                        lineNumber: 361,
                                        columnNumber: 15
                                    }, this),
                                    member.gifts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "No gifts on ",
                                            member.name,
                                            "'s list yet."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                        lineNumber: 373,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Droppable"], {
                                        droppableId: member.id,
                                        isDropDisabled: isDragging && sourceDroppableId !== member.id,
                                        children: (provided)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: `relative ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'list-disc pl-5 space-y-2'}`,
                                                ...provided.droppableProps,
                                                ref: provided.innerRef,
                                                children: [
                                                    sortedGifts(member.gifts).map((gift, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Draggable"], {
                                                            draggableId: gift.id,
                                                            index: index,
                                                            children: (provided)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    ref: provided.innerRef,
                                                                    ...provided.draggableProps,
                                                                    ...provided.dragHandleProps,
                                                                    onDoubleClick: ()=>{
                                                                        if (user && user.id === gift.user_id) {
                                                                            setEditingGift(gift);
                                                                        }
                                                                    },
                                                                    className: "flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md shadow-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center flex-grow",
                                                                            children: [
                                                                                " ",
                                                                                gift.product_image_url && // eslint-disable-next-line @next/next/no-img-element
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                    src: gift.product_image_url,
                                                                                    alt: gift.product_title || gift.description,
                                                                                    className: "w-16 h-16 object-cover rounded-md mr-3"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                                                    lineNumber: 399,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "flex-grow",
                                                                                    children: [
                                                                                        gift.description,
                                                                                        gift.is_purchased && user?.id !== gift.user_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "ml-2 text-sm text-green-600",
                                                                                            children: [
                                                                                                "(Claimed by ",
                                                                                                family.members.find((m)=>m.id === gift.purchased_by)?.name,
                                                                                                ")"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                                                            lineNumber: 406,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                                                    lineNumber: 401,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                                            lineNumber: 396,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `flex items-center flex-shrink-0 ${viewMode === 'grid' ? 'flex-col space-y-2' : 'space-x-2'}`,
                                                                            children: [
                                                                                " ",
                                                                                gift.product_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                                    href: gift.product_url,
                                                                                    target: "_blank",
                                                                                    rel: "noopener noreferrer",
                                                                                    className: "px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs",
                                                                                    onClick: (e)=>e.stopPropagation(),
                                                                                    children: "Open Link"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                                                    lineNumber: 414,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                user && user.id !== gift.user_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$list$2f5b$familyId$5d2f$ClaimUnclaimButtons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                    gift: gift,
                                                                                    userId: user.id
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                                                    lineNumber: 425,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                                            lineNumber: 412,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                                    lineNumber: 385,
                                                                    columnNumber: 29
                                                                }, this)
                                                        }, gift.id, false, {
                                                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                            lineNumber: 383,
                                                            columnNumber: 25
                                                        }, this)),
                                                    provided.placeholder
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                                lineNumber: 377,
                                                columnNumber: 21
                                            }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                        lineNumber: 375,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, member.id, true, {
                                fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                lineNumber: 360,
                                columnNumber: 13
                            }, this)),
                        mounted && portalNode && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createPortal(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Droppable"], {
                            droppableId: "trash-bin-global",
                            children: (provided)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: provided.innerRef,
                                    ...provided.droppableProps,
                                    className: `fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 border-2 border-dashed rounded-lg text-center transition-all duration-200 z-50
                    border-red-500 bg-red-50 dark:bg-red-900 text-red-500 dark:text-red-200
                    ${isDragging ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
                                    children: [
                                        "Drag here to delete gift 🗑️",
                                        provided.placeholder
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                    lineNumber: 446,
                                    columnNumber: 17
                                }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                            lineNumber: 444,
                            columnNumber: 13
                        }, this), portalNode)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 352,
                    columnNumber: 9
                }, this),
                showAddGiftModal && user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$list$2f5b$familyId$5d2f$AddGiftForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    familyId: family.id,
                    currentUserId: user.id,
                    members: family.members,
                    onClose: ()=>setShowAddGiftModal(false)
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 464,
                    columnNumber: 11
                }, this),
                showAddMemberModal && user && user.id === family.owner_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$list$2f5b$familyId$5d2f$AddMemberForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    familyId: family.id,
                    currentUserId: user.id,
                    members: family.members,
                    onClose: ()=>setShowAddMemberModal(false)
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 473,
                    columnNumber: 11
                }, this),
                user && user.id !== family.owner_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleLeaveFamily,
                        className: "w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600",
                        children: "Leave Family List"
                    }, void 0, false, {
                        fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                        lineNumber: 483,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 482,
                    columnNumber: 11
                }, this),
                editingGift && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$list$2f5b$familyId$5d2f$EditGiftForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    gift: editingGift,
                    onClose: ()=>setEditingGift(null),
                    onSave: ()=>{
                        setEditingGift(null);
                    // Instead of router.refresh(), update local state
                    // This would involve refetching the family data or updating the specific gift in the family state
                    // For now, we'll just close the form. A full re-fetch might be needed for complex updates.
                    // router.refresh()
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 493,
                    columnNumber: 11
                }, this),
                showQrModal && inviteToken && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-8 rounded-lg shadow-lg text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold mb-4",
                                children: "Scan to Join!"
                            }, void 0, false, {
                                fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                lineNumber: 509,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$qr$2d$code$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                value: `${window.location.origin}/invite?token=${inviteToken}`
                            }, void 0, false, {
                                fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                lineNumber: 510,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowQrModal(false),
                                className: "mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                                lineNumber: 511,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                        lineNumber: 508,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
                    lineNumber: 507,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
            lineNumber: 283,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/list/[familyId]/FamilyListClient.tsx",
        lineNumber: 282,
        columnNumber: 5
    }, this);
}
_s(FamilyListClient, "8xt+p2JbIkHXFYIxCvgW0Dpw/QM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = FamilyListClient;
var _c;
__turbopack_context__.k.register(_c, "FamilyListClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_list_%5BfamilyId%5D_7d2c016c._.js.map