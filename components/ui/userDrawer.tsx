import { Dispatch, SetStateAction } from "react"
import { signOut } from "next-auth/react"
import { LogOut, Settings, ClipboardList, X, Grid3X3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ScrollArea } from './ScrollArea';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "../../components/ui/drawer"

interface UserDrawerProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
        firstName?: string
        lastName?: string
        isAdmin?: boolean
    }
}

export function UserDrawer({ isOpen, setIsOpen, user }: UserDrawerProps) {
    const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
    }

    const handleItemClick = () => {
        setIsOpen(false)
    }

    return (
        <Drawer>
            <DrawerContent className="bg-orange-50 text-orange-950" direction="right" size="70%" title="User Menu">
                <DrawerHeader className="flex justify-between items-start p-4">
                    <div>
                        <DrawerTitle className="text-2xl font-bold">{(user.firstName, user.lastName)}</DrawerTitle>
                        <DrawerDescription className="text-darkBlue/70">
                            Manage your account and settings
                        </DrawerDescription>
                    </div>
                    {/*<DrawerClose className="absolute right-4 top-4 rounded-full p-2 text-orange-950 transition-colors hover:bg-orange-100">*/}
                    {/*    <X className="h-6 w-6" />*/}
                    {/*    <span className="sr-only">Close</span>*/}
                    {/*</DrawerClose>*/}
                </DrawerHeader>
                <ScrollArea className="flex-grow">
                    <div className="p-4 space-y-6">
                        <div className="flex items-center space-x-4">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    width={60}
                                    height={60}
                                    className="rounded-full w-15 h-15 object-cover"
                                    alt="profile"
                                />
                            ) : (
                                <div className="w-15 h-15 rounded-full bg-orange-200 flex items-center justify-center text-darkBlue text-2xl font-semibold">
                                    {getInitials(user.firstName, user.lastName)}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-lg">{user.name}</p>
                                <p className="text-sm text-darkBlue/70">{user.email}</p>
                            </div>
                        </div>
                        <hr className="border-darkBlue/20" />
                        <Link href="/patient-info/dashboard" className="flex items-center space-x-3 p-2 hover:bg-orange-100 rounded-md" onClick={handleItemClick}>
                            <Grid3X3 size={22} />
                            <span className="text-lg">Patient Dashboard</span>
                        </Link>
                        <Link href="/my-profile" className="flex items-center space-x-3 p-2 hover:bg-orange-100 rounded-md" onClick={handleItemClick}>
                            <Settings size={22} />
                            <span className="text-lg">My Profile</span>
                        </Link>
                        {user.isAdmin && (
                            <Link href="/admin" className="flex items-center space-x-3 p-2 hover:bg-orange-100 rounded-md" onClick={handleItemClick}>
                                <ClipboardList size={22} />
                                <span className="text-lg">Admin Dashboard</span>
                            </Link>
                        )}
                        <button
                            onClick={() => {
                                signOut();
                                handleItemClick();
                            }}
                            className="flex items-center space-x-3 p-2 hover:bg-orange-100 rounded-md text-orange-600 w-full text-left"
                        >
                            <LogOut size={22} />
                            <span className="text-lg">Sign Out</span>
                        </button>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    )
}