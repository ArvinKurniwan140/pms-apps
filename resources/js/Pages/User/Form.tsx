import React from 'react';
import { useForm, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Role } from '@/types';

interface Props {
    user?: {
        id?: number;
        name: string;
        email: string;
        roles: string[];
    };
    roles: string[];
    auth: {
        user: {
            name: string;
            email: string;
            roles: Role[] | string[];
        };
    };
}

const UserForm = ({ user, roles, auth }: Props) => {
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        roles: user?.roles || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user?.id) {
            put(`/users/${user.id}`);
        } else {
            post('/users');
        }
    };

    const handleCancel = () => {
        router.visit('/users');
    };

    const handleRoleChange = (role: string) => {
        setData(
            'roles',
            data.roles.includes(role)
                ? data.roles.filter((r) => r !== role)
                : [...data.roles, role]
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                {user?.id ? 'Edit User' : 'Create User'}
            </h2>} user={{
                name: auth.user.name,
                email: auth.user.email,
                roles: Array.isArray(auth.user.roles)
                    ? auth.user.roles.map(role => typeof role === 'string' ? role : role.name)
                    : []
            }}    >
            <Head title={user?.id ? 'Edit User' : 'Create User'} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {user?.id ? 'Edit User' : 'Create New User'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        {user?.id ? 'New Password (Leave blank to keep current)' : 'Password'}
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required={!user?.id}
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required={!user?.id}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Roles
                                    </label>
                                    <div className="space-y-2">
                                        {roles.map((role) => (
                                            <div key={role} className="flex items-center">
                                                <input
                                                    id={`role-${role}`}
                                                    type="checkbox"
                                                    checked={data.roles.includes(role)}
                                                    onChange={() => handleRoleChange(role)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`role-${role}`} className="ml-2 block text-sm text-gray-700">
                                                    {role}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.roles && (
                                        <p className="mt-2 text-sm text-red-600">{errors.roles}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UserForm;
