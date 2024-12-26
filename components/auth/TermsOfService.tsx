import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const TermsOfService: React.FC = () => {
    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-orange-500">Terms of Service</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[70vh] pr-4">
                        <div className="space-y-6">
                            <p className="text-sm text-gray-500 text-center">Last updated: December 25, 2024</p>

                            <p className="text-gray-700">
                                Welcome to MedFlow! By using our services, you agree to the following terms and
                                conditions.
                            </p>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">1. Acceptance of Terms</h3>
                                <p className="text-gray-700">
                                    By accessing or using MedFlow, you agree to comply with and be bound by these Terms
                                    of Service. If you do not agree, please do not use our services.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">2. Service Description</h3>
                                <p className="text-gray-700">
                                    MedFlow provides tools for healthcare professionals to manage patient interactions.
                                    Access is granted only for approved use cases.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">3. User Obligations</h3>
                                <p className="text-gray-700">
                                    Users are responsible for providing accurate information and maintaining the
                                    security of their accounts. Misuse of services is prohibited.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">4. Access to Your Email</h3>
                                <p className="text-gray-700">
                                    By using Google login, you consent to us accessing your email address solely for
                                    account identification and communication purposes.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">5. Termination</h3>
                                <p className="text-gray-700">
                                    We reserve the right to suspend or terminate access for users violating these terms.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-semibold text-orange-500 mb-2">6. Changes to Terms</h3>
                                <p className="text-gray-700">
                                    We may update these Terms of Service from time to time. Continued use indicates
                                    acceptance of the updated terms.
                                </p>
                            </section>

                            <p className="text-gray-700 mt-8">
                                If you have any questions, please contact us at{' '}
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

export default TermsOfService

