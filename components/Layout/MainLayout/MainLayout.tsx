import { PropsWithChildren } from "react";
import AppBar from "../Menu/AppBar/AppBar";
import SideBar from "../Menu/SideBar/SideBar";

interface MainLayoutProps extends PropsWithChildren{}

export default function MainLayout({children}: MainLayoutProps) {
	return (
        <div style={{display:'flex', flexDirection: 'column', flex: 1}}>
            <AppBar />
            <div style={{display:'flex', flexDirection: 'row', flex: 1}}>
                <SideBar />
                <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1
                }}
                >
                    {children}
                </div>
            </div>
            
        </div>
		
	);
};
