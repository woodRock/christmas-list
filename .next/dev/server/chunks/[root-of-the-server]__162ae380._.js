module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/supabase-server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://oqwypdzkqnkptdotjyrv.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xd3lwZHprcW5rcHRkb3RqeXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MzQ4NzAsImV4cCI6MjA3ODQxMDg3MH0.LbS3xijP7ZzYdt2nAmtNodB2NnHeGlE7DgDCF_mVx_I"), {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    cookieStore.set({
                        name,
                        value,
                        ...options
                    });
                } catch (error) {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            },
            remove (name, options) {
                try {
                    cookieStore.set({
                        name,
                        value: '',
                        ...options
                    });
                } catch (error) {
                // The `delete` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/src/app/api/lists/[familyId]/members/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase-server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function POST(request, context) {
    console.log("POST /api/family/[familyId]/members reached!");
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.log("Returning Unauthorized: No user session.");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
    }
    const { familyId } = context.params;
    const { memberName, memberEmail } = await request.json();
    console.log("Request body:", {
        familyId,
        memberName,
        memberEmail
    });
    if (!memberName || !memberEmail) {
        console.log("Validation error: Member name and email are required.");
        console.log("Returning Invalid request body.");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Member name and email are required'
        }, {
            status: 400
        });
    }
    // Verify that the current user is the owner of the list
    const { data: list, error: listError } = await supabase.from('lists').select('user_id').eq('id', familyId).single();
    if (listError || !list) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'List not found'
        }, {
            status: 404
        });
    }
    if (list.user_id !== user.id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Only the list owner can add members'
        }, {
            status: 403
        });
    }
    // Find the user ID for the given email
    const { data: existingProfile, error: existingProfileError } = await supabase.from('profiles').select('id, full_name') // Select full_name to use for profile creation if needed
    .eq('full_name', memberName).single();
    console.log("Existing profile found by name:", existingProfile, existingProfileError);
    let newMemberProfileId = existingProfile?.id;
    let newMemberFullName = existingProfile?.full_name;
    if (existingProfileError || !newMemberProfileId) {
        console.log("Profile not found by name, trying by email in auth.users.");
        // If profile not found by name, try to find by email in auth.users (if they have signed up)
        const { data: authUser, error: authUserError } = await supabase.auth.admin.inviteUserByEmail(memberEmail);
        console.log("Auth user found by email:", authUser, authUserError);
        if (authUserError || !authUser?.user) {
            console.log("Could not find a registered user with that email.");
            console.log("Returning User not found.");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Could not find a registered user with that email. Please ensure they have signed up.'
            }, {
                status: 404
            });
        }
        newMemberProfileId = authUser.user.id;
        newMemberFullName = authUser.user.user_metadata.full_name || memberName; // Use full_name from auth or provided name
        // If the profile doesn't exist in our 'profiles' table, create it.
        const { error: createProfileError } = await supabase.from('profiles').insert([
            {
                id: newMemberProfileId,
                full_name: newMemberFullName
            }
        ]);
        console.log("Profile creation result:", createProfileError);
        if (createProfileError) {
            console.log("Returning Failed to create profile.");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Failed to create profile: ${createProfileError.message}`
            }, {
                status: 500
            });
        }
    }
    // Check if the member is already in the list_members table
    const { data: existingListMember, error: existingListMemberError } = await supabase.from('list_members').select('list_id, profile_id').eq('list_id', familyId).eq('profile_id', newMemberProfileId).single();
    console.log("Existing list member check:", existingListMember, existingListMemberError);
    if (existingListMember && !existingListMemberError) {
        console.log("Member already in list_members table.");
        console.log("Returning Member already in list.");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: `Member "${memberName}" is already a member of this list.`
        }, {
            status: 200
        });
    }
    // Add the new member to the list_members table
    const { error: addMemberError } = await supabase.from('list_members').insert([
        {
            list_id: familyId,
            profile_id: newMemberProfileId,
            role: 'member'
        }
    ]);
    console.log("Add member to list_members result:", addMemberError);
    if (addMemberError) {
        console.log("Returning Failed to add member to list.");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Failed to add member to list: ${addMemberError.message}`
        }, {
            status: 500
        });
    }
    console.log("Returning Member added successfully.");
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        message: `Member "${memberName}" added successfully!`
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__162ae380._.js.map