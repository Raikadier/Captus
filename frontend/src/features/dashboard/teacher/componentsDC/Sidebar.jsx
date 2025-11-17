import { ChevronFirst } from "lucide-react";
import { Children } from "react";
export default function Sidebar({ }) {
    return ( 
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
            <div className="p-4 pb-2 flex justify-between items-cener">
                <img src="frontend/public/Logo_Captus.png" 
                className="w-32" 
                alt="" 
                />
                <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                    <ChevronFirst size={18} />
                </button>
            </div>

            <ul className="flex-1 px-3">{ children }</ul>

            <div className="border-t flex p-3">
                <img></img>
            </div>
            </nav>
        </aside>
    )
}