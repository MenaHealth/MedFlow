import { Dispatch, SetStateAction, useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Settings, ClipboardList, Grid3X3, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from './ScrollArea';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import ChangeAccountTypeView from "./../adminDashboard/sections/ChangeAccountTypeView"; // Ensure this path is correct
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface UserDrawerProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    user: {
        name?: string | null;
        email?: string | null;
        accountType?: string | null;
        image?: string | null;
        firstName?: string;
        lastName?: string;
        isAdmin?: boolean;
    };
}

export function UserDrawer({ isOpen, setIsOpen, user }: UserDrawerProps) {
    const [isCardVisible, setIsCardVisible] = useState(false); // State to toggle card visibility

    const getInitials = (firstName: string | undefined, lastName: string | undefined) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
    };

    const handleItemClick = () => {
        setIsOpen(false);
    };

    return (
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <DrawerContent className="bg-orange-50 text-orange-950 fixed right-0 top-0 bottom-0 w-70 z-40" direction="right" size="70%">
                <DrawerHeader className="flex justify-between items-start p-4">
                    {user.isAdmin && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsCardVisible(!isCardVisible)}
                            className="absolute top-4 left-4"
                        >
                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                            Change Account Type
                        </Button>
                    )}
                    <div className="flex flex-col items-start">
                        <DrawerTitle className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</DrawerTitle>
                        <DrawerDescription className="text-darkBlue/70">
                            Manage your account and settings
                        </DrawerDescription>
                    </div>
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
                                <p className="text-sm text-darkBlue/70">{user.accountType}</p>
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

                {/* Card for Changing Account Type */}
                {isCardVisible && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/30">
                        <Card className="w-96 max-w-full border border-gray-200 shadow-lg bg-white">
                            <CardHeader>
                                <CardTitle>Change Account Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChangeAccountTypeView />
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsCardVisible(false)}
                                >
                                    Close
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    );
}