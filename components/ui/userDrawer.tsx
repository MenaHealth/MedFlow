// components/ui/userDrawer.tsx
'use client'

import { Dispatch, SetStateAction, useState } from "react"
import { signOut } from "next-auth/react"
import { LogOut, Settings, ClipboardList, Grid3X3, ArrowRightLeft } from 'lucide-react'
import Link from "next/link"
import { ScrollArea } from "@/components/ui/ScrollArea"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import ChangeAccountTypeView from "@/components/adminDashboard/sections/ChangeAccountTypeView"

interface UserDrawerProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    user: {
        name?: string | null
        email?: string | null
        accountType?: string | null
        languages?: string[] | null
        countries?: string[] | null
        image?: string | null
        firstName?: string
        lastName?: string
        isAdmin?: boolean
    }
}

export function UserDrawer({ isOpen, setIsOpen, user }: UserDrawerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleItemClick = () => {
        setIsOpen(false)
    }

    const menuItems = [
        { href: "/patient-info/dashboard", icon: Grid3X3, label: "Patient Dashboard" },
        { href: "/my-profile", icon: Settings, label: "My Profile" },
        ...(user.isAdmin ? [{ href: "/admin", icon: ClipboardList, label: "Admin Dashboard" }] : []),
    ]

    const formatName = (firstName: string = '', lastName: string = '') => {
        const fullName = `${firstName} ${lastName}`.trim()
        if (fullName.length <= 20) return fullName
        return (
            <>
                {firstName}
                {lastName && (
                    <>
                        <wbr />-<br />
                        {lastName}
                    </>
                )}
            </>
        )
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="sm:max-w-md">
                <ScrollArea className="h-full pr-4">
                    <Card className="mb-4">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-4 mb-4">
                                <Avatar user={user} className="w-12 h-12" />
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h2 className="text-sm font-semibold truncate">
                                        {formatName(user.firstName, user.lastName)}
                                    </h2>
                                    <p className="text-xs text-orange-500 truncate">{user.email}</p>
                                    <p className="text-xs text-orange-500">{user.accountType}</p>
                                </div>
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="languages">
                                    <AccordionTrigger>Languages</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-wrap gap-2">
                                            {user.languages?.map((language, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-white text-orange-800 px-2 py-1 rounded-full text-xs"
                                                >
                                                    {language}
                                                </span>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="countries">
                                    <AccordionTrigger>Countries</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-wrap gap-2">
                                            {user.countries?.map((country, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-white text-orange-800 px-2 py-1 rounded-full text-xs"
                                                >
                                                    {country}
                                                </span>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <nav className="space-y-2 mb-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleItemClick}
                                className="w-full flex items-center p-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {user.isAdmin && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-sm mb-4"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                            Change Account Type
                        </Button>
                    )}

                    <Button
                        variant="orange"
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => {
                            signOut()
                            handleItemClick()
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </ScrollArea>
            </SheetContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Account Type</DialogTitle>
                        <DialogDescription>
                            Update the account type for this user.
                        </DialogDescription>
                    </DialogHeader>
                    <ChangeAccountTypeView />
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </Sheet>
    )
}



