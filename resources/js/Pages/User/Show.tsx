import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Role } from '@/types';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        roles: string[];
        created_at: string;
    };
    can: {
        edit: boolean;
        delete: boolean;
    };
    auth: {
        user: {
            name: string;
            email: string;
            roles: Role[] | string[];
        };
    };
}

const UserShow = ({ user, can, auth }: Props) => {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                User Details
            </h2>} user={{
                name: auth.user.name,
                email: auth.user.email,
                roles: Array.isArray(auth.user.roles)
                    ? auth.user.roles.map(role => typeof role === 'string' ? role : role.name)
                    : []
            }}      >
            <Head title={user.name} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                                    <p className="text-gray-600 mt-2">{user.email}</p>
                                </div>
                                <div className="flex space-x-2">
                                    {can.edit && (
                                        <Link
                                            href={`/users/${user.id}/edit`} // ✅ fixed template literal
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit User
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium text-gray-700">Created At</h3>
                                        <span className="text-sm text-gray-600">{user.created_at}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Roles</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.map((role) => (
                                            <span
                                                key={role}
                                                className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                                            >
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Optional delete button if you want to add */}
                            {can.delete && (
                                <div className="text-right">
                                    <Link
                                        href={`/users/${user.id}`}
                                        method="delete"
                                        as="button"
                                        className="text-red-600 hover:underline text-sm"
                                    >
                                        Delete User
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UserShow;
