import { Dispatch, SetStateAction } from "react"
import { signOut } from "next-auth/react"
import { LogOut, Settings, ClipboardList, X, Grid3X3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent className="bg-orange-50 text-darkBlue">
                <DrawerHeader className="flex justify-between items-start p-4">
                    <div>
                        <DrawerTitle className="text-2xl font-bold">User Menu</DrawerTitle>
                        <DrawerDescription className="text-darkBlue/70">
                            Manage your account and settings
                        </DrawerDescription>
                    </div>
                    <DrawerClose className="rounded-full hover:bg-orange-100 p-2 absolute top-4 right-4">
                        <X size={24} />
                    </DrawerClose>
                </DrawerHeader>
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
                            signOut()
                            handleItemClick()
                        }}
                        className="flex items-center space-x-3 p-2 hover:bg-orange-100 rounded-md text-orange-600 w-full text-left"
                    >
                        <LogOut size={22} />
                        <span className="text-lg">Sign Out</span>
                    </button>
                </div>
            </DrawerContent>
        </Drawer>
    )
}