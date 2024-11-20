// components/auth/adminDashboard/sections/ForgotPasswordView.tsx

'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useForgotPasswordViewModel } from './ForgotPasswordViewModel'
import { Search, Loader2, Key } from 'lucide-react'

export default function ForgotPasswordView() {
    const {
        searchQuery,
        setSearchQuery,
        selectedUser,
        handleSearch,
        generateResetLink,
        loading,
    } = useForgotPasswordViewModel()

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <Card backgroundColor="bg-orange-800" borderColor="border-white">
                <CardHeader>
                    <CardTitle className="text-white">Admin pw reset</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="search-email" className="text-white">Search by email</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="search-email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-grow bg-white"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="text-white bg-orange-600"
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Search className="mr-2 h-4 w-4" />
                                    )}
                                    Search
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {loading && (
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="w-full h-4 mb-4" />
                        <Skeleton className="w-3/4 h-4 mb-4" />
                        <Skeleton className="w-1/2 h-4" />
                    </CardContent>
                </Card>
            )}

            {selectedUser && !loading && (
                <Card>
                    <CardHeader>
                        <CardTitle>User Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                            {[
                                { label: "Name", value: `${selectedUser.firstName} ${selectedUser.lastName}` },
                                { label: "Email", value: selectedUser.email },
                                { label: "Account Type", value: selectedUser.accountType },
                                { label: "Country", value: selectedUser.country },
                                { label: "Language", value: selectedUser.language },
                                { label: "Doctor Specialty", value: selectedUser.doctorSpecialty || 'N/A' },
                                { label: "Approval Date", value: selectedUser.approvalDate ? new Date(selectedUser.approvalDate).toLocaleDateString() : 'N/A' },
                                { label: "# of Password Resets", value: (selectedUser.passwordResetCount ?? 0).toString() },
                            ].map((item, index) => (
                                <div key={index} className="space-y-1">
                                    <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                                    <dd className="text-sm text-gray-900">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start space-y-4">
                        {selectedUser.resetLink ? (
                            <>
                                <div className="text-sm">
                                    <span className="font-medium">Reset Link:</span>{' '}
                                    <a href={selectedUser.resetLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                        {selectedUser.resetLink}
                                    </a>
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Expires on:</span>{' '}
                                    {new Date(selectedUser.resetLinkExpiration!).toLocaleString()}
                                </div>
                            </>
                        ) : (
                            <Button
                                onClick={generateResetLink}
                                disabled={loading}
                                className="text-white bg-orange-700 hover:bg-orange-600"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Key className="mr-2 h-4 w-4" />
                                )}
                                Generate Reset Link
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}