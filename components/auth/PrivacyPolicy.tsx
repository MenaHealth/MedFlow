import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-orange-500">Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[70vh] pr-4">
                        <div className="space-y-6">
                            <p className="text-sm text-gray-500 text-center">Last updated: December 25, 2024</p>

                            <p className="text-gray-700">
                                Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use MedFlow.
                            </p>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">1. Information We Collect</h3>
                                <p className="text-gray-700">
                                    When you sign up or log in using Google, we collect your email address. This is used solely for account identification and communication.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">2. How We Use Your Information</h3>
                                <p className="text-gray-700">
                                    We use your email to:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 ml-4 mt-2 space-y-1">
                                    <li>Identify your account.</li>
                                    <li>Send important notifications or updates about your account.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">3. Information Sharing</h3>
                                <p className="text-gray-700">
                                    We do not sell or share your email address with third parties, except as required by law or to maintain the functionality of our services.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">4. Data Security</h3>
                                <p className="text-gray-700">
                                    We implement appropriate technical and organizational measures to protect your information from unauthorized access, use, or disclosure.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">5. Updates to Privacy Policy</h3>
                                <p className="text-gray-700">
                                    We may update this Privacy Policy periodically. Changes will be posted on this page with a revised effective date.
                                </p>
                            </section>

                            <p className="text-gray-700 mt-8">
                                If you have any questions or concerns, please contact us at{' '}
                                <a href="mailto:support@menahealth.org" className="text-orange-500 hover:underline">
                                    support@menahealth.org
                                </a>.
                            </p>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

export default PrivacyPolicy

