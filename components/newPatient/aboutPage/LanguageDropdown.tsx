import React from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdownMenu";

interface LanguageDropdownProps {
    currentLanguage: "english" | "arabic" | "pashto" | "farsi";
    onLanguageChange: React.Dispatch<
        React.SetStateAction<"english" | "arabic" | "pashto" | "farsi">
    >;
}

const LanguageDropdown = ({
                              currentLanguage,
                              onLanguageChange,
                          }: LanguageDropdownProps) => {
    const handleLanguageSelect = (lang: "english" | "arabic" | "pashto" | "farsi") => {
        onLanguageChange(lang);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 border rounded text-sm">
                    {currentLanguage === "english"
                        ? "English"
                        : currentLanguage === "arabic"
                            ? "عربي"
                            : currentLanguage === "pashto"
                                ? "پښتو"
                                : "فارسی"}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleLanguageSelect("english")}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageSelect("arabic")}>
                    عربي
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageSelect("pashto")}>
                    پښتو
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageSelect("farsi")}>
                    فارسی
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageDropdown;