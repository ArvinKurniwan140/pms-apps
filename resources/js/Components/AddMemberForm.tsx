import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AddMemberFormProps {
    projectId: number;
    availableUsers: User[];
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ projectId, availableUsers = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, post, errors, processing } = useForm({
        user_id: '',
        role: 'member' as 'manager' | 'member',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/projects/${projectId}/members`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                setData({
                    user_id: '',
                    role: 'member',
                });
            },
        });
    };

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
            >
                Add Member
            </button>

            {isOpen && (
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Add New Member</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                            <select
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                required
                            >
                                <option value="">-- Choose User --</option>
                                {availableUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as 'manager' | 'member')}
                                required
                            >
                                <option value="member">Member</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add to Project'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddMemberForm;