import React, { useEffect, useState } from "react";
import TabsSections from "@/components/TabsSections";
import CardProfileAbout from "./CardProfileAbout";
import CardProfileSetting from "./CardProfileSetting";
import ChangePasswordCard from "./ChangePasswordCard";
import { useLocation } from "react-router";

const ProfileMainContent: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("profile");

    const tabObjects = [
        {
            trigger: "profile",
            content: <CardProfileSetting />
        },
        {
            trigger: "change-password",
            content: <ChangePasswordCard />
        }
    ];

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (lastSegment === "change-password") {
            setActiveTab("change-password");
        } else {
            setActiveTab("profile");
        }
    }, [location.pathname]);

    return (
        <div className="p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
                {/* Sidebar */}
                <div>
                    {/* <CardProfileImage /> */}
                    <CardProfileAbout />
                </div>

                {/* Main Content */}
                <div>
                    <TabsSections 
                        tabObjects={tabObjects} 
                        value={activeTab}
                        onValueChange={setActiveTab}
                        contentStyles="mx-4 my-4"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProfileMainContent;
