import { Button } from '@/components/ui/button';
import { AlignJustify } from 'lucide-react';
import React, { useRef, useEffect, useCallback } from 'react'
import { OverlayScrollbarsComponent, OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import SidebarItem from './SidebarItem';
import { SidebarUserSection } from './SidebarUserSection';
import HeaderCompany from './HeaderCompany';

interface MenuItem {
    icon: React.ElementType;
    text: string;
    url: string;
};

interface MenuSection {
    label: string;
    items: MenuItem[];
};

interface SidebarContentProps {
    collapsed: boolean,
    toggleSidebar: () => void,
    setCollapsed: (value: boolean) => void,
    menuSections: MenuSection[],
    isDrawer?: boolean,
}

const SidebarContent: React.FC<SidebarContentProps> = ({ collapsed, toggleSidebar, setCollapsed, menuSections, isDrawer }) => {
    const scrollContainerRef = useRef<OverlayScrollbarsComponentRef>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const instance = scrollContainerRef.current?.osInstance();
        if (!instance) return;

        const { viewport } = instance.elements();
        const savedPosition = localStorage.getItem('sidebarScrollPosition');
        if (savedPosition) {
            viewport.scrollTop = parseInt(savedPosition, 10);
        }
    }, []);

    const handleScroll = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            const instance = scrollContainerRef.current?.osInstance();
            if (!instance) return;

            const { viewport } = instance.elements();
            localStorage.setItem('sidebarScrollPosition', viewport.scrollTop.toString());
        }, 300); // 300ms debounce
    }, []);

    return (
        <div className={`flex flex-col ${collapsed ? 'w-full' : isDrawer ? 'w-screen' : 'w-full'} border-r bg-primary relative h-[100dvh]`}>
            <div className={`flex h-12 ${collapsed ? 'flex-col py-2.5' : 'items-center p-2.5'} gap-2 border-b`}>
                {!collapsed && (
                    <HeaderCompany/>
                )}
                {!isDrawer && (
                    <div className={`${collapsed ? 'flex justify-center' : 'ml-auto'}`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 hover:bg-transparent ${collapsed ? 'text-white hover:text-secondary' : 'text-white hover:text-secondary'}`}
                            onClick={toggleSidebar}
                        >
                            <AlignJustify className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
            {/* <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto scrollnbar-gutter-stable custom-scrollbar"
            >
                <SidebarItem collapsed={collapsed} sections={menuSections} />
            </div> */}
            <OverlayScrollbarsComponent
                ref={scrollContainerRef}
                options={{
                    scrollbars: {
                        autoHide: 'leave',
                        autoHideDelay: 200,
                        theme: 'os-theme-custom',
                    },
                }}
                className="flex-1"
                events={{ scroll: handleScroll }}
            >
                <SidebarItem collapsed={collapsed} sections={menuSections} />
            </OverlayScrollbarsComponent>

            <SidebarUserSection collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
    )
}

export default SidebarContent;