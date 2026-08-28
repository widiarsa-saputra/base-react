import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
    tabObjects: {
        trigger: string,
        content: React.ReactNode
    }[]
    value?: string;
    onValueChange?: (value: string) => void;
    contentStyles?: string
}

const TabsSections = (props: Props) => {
    return (
        <div className="flex flex-col h-full pt-4 px-4 pb-0 children-container relative">
            <Tabs
                defaultValue={props.tabObjects[0].trigger}
                value={props.value}
                onValueChange={props.onValueChange}
                className="w-full h-full flex flex-col"
            >
                <TabsList className="w-full bg-primary/10 relative rounded-md">
                    {
                        props.tabObjects.map(({ trigger }, idx) => {
                            const replacedString = trigger.replace(/-/g, ' ');

                            return (
                                <TabsTrigger key={idx} value={trigger} className="font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground !rounded capitalize">
                                    {replacedString}
                                </TabsTrigger>
                            )
                        })
                    }
                </TabsList>
                <div className="border-b my-4"></div>

                {
                    props.tabObjects.map(({ trigger, content }, idx) => (
                        <TabsContent value={trigger} className={cn(
                            "flex-1 mt-0", props.contentStyles
                        )} key={idx}>
                            <div className="-mx-4 -my-4 h-[calc(100%)] dfdf">
                                {content}
                            </div>
                        </TabsContent>

                    ))
                }

            </Tabs>
        </div>
    )
}

export default TabsSections