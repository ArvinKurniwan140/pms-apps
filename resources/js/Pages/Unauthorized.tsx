// resources/js/Pages/Unauthorized.tsx
export default function Unauthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
                <p className="text-gray-600">You don't have permission to access this resource.</p>
            </div>
        </div>
    );
}