"use client"
import { signOut } from '@/features/auth/actions/auth-actions';

export function DangerZone() {
    return (
        <div className="bg-red-50/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm p-8 border border-red-100 rounded-4xl">
            <h2 className="mb-2 font-bold text-red-900 text-xl">Danger Zone</h2>
            <p className="mb-6 text-red-800 text-sm">
                Once you sign out, you'll need to log in again to access your
                account.
            </p>
            <form action={async () => {
                await signOut();
            }}>
                <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl px-6 py-3 rounded-full font-semibold text-white text-sm transition-all"
                >
                    Sign Out
                </button>
            </form>
        </div>
    )
}
