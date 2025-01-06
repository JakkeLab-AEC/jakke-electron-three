import './sidebarstyle.css';
import Button from "./iconButton";
import { useSidebarStore } from "./sidebarStore";
import { useEffect, useRef, useState } from 'react';
import { useHomeStore } from '../../homescreenitems/homeStatusModel';
import {SidebarSamplePage} from './pages/SamplePage/sidebarSamplePage';


interface SidebarProps {
    menuName:string, 
    menuPage: JSX.Element, 
    displayHeader: string, 
    menuClickHandler: (index: number) => void
}

export const Sidebar = () => {
    const siderbarRef = useRef<HTMLDivElement>(null);

    const {
        currentHomeId,
        updateSidebarHeight
    } = useHomeStore();

    const [homeId, setHomeId] = useState<string>(currentHomeId);
    
    const {
        navigationIndex,
        setNaviationIndex
    } = useSidebarStore();

    const navigateMenu = (index: number) => {
        setNaviationIndex(index);
    };

    const menuNavigations: Array<SidebarProps> = [{
            menuName: "Sample", 
            menuPage: (<SidebarSamplePage />), 
            displayHeader: "Test",
            menuClickHandler: navigateMenu
        }, 
    ];

    useEffect(() => {
        setHomeId(homeId);
    
        const updateSidebarHeightWrapper = () => {
            if (siderbarRef.current) {
                updateSidebarHeight(siderbarRef.current.clientHeight);
            }
        };
    
        window.addEventListener('resize', updateSidebarHeightWrapper);
    
        // 초기 높이 설정
        if (siderbarRef.current) {
            updateSidebarHeight(siderbarRef.current.clientHeight);
        }
    
        return () => {
            window.removeEventListener('resize', updateSidebarHeightWrapper);
        };
    }, [currentHomeId]);
    
    return (
        <div className="w-[334px] h-full flex flex-row" style={{borderWidth: 1, borderColor: 'silver', borderTopRightRadius: 8, borderBottomRightRadius: 8}} ref={siderbarRef}>
            <div className="h-full w-12 flex flex-col" style={{backgroundColor: "#ECECEC"}}>
                {menuNavigations.map((item, index) => {
                    const isEnabled = index == navigationIndex ? true : false;
                    if(item.menuName != null || item.menuName == '' && item.menuPage != null || item.menuClickHandler != null)
                        return <Button key={index} menuName={item.menuName} isEnabled={isEnabled} navigateHandler={item.menuClickHandler} index={index}/>
                })}
            </div>
            <div className="flex-grow flex flex-col gap-1 pb-8" style={{backgroundColor: 'white', borderTopRightRadius: 8, borderBottomRightRadius: 8, padding: 8}}>
                <div style={{fontWeight: 700, fontSize: 20}}>
                    {menuNavigations[navigationIndex].displayHeader}
                </div>
                <hr style={{borderBottomWidth: 0.25, borderColor: 'silver'}}/>
                <div className="mt-1 h-full overflow-y-auto sidebar-area">
                    {/* Menu Page */}
                    {menuNavigations[navigationIndex].menuPage}
                </div>
            </div>
        </div>
    )
}