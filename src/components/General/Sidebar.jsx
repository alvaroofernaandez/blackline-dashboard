import { useState } from "react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState("main");

    const goBack = () => setCurrentMenu("main");

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                type="button"
                aria-label="Toggle sidebar"
                className="lg:hidden fixed top-7 left-4 z-50 bg-neutral-900 text-white p-2 rounded-md"
                onClick={toggleSidebar}
            >
                {isOpen 
                    ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x-icon lucide-circle-x w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu-icon lucide-menu w-4 h-4"><path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/></svg>    
                }
            </button>

            <nav
                className={`fixed lg:static top-0 left-0 h-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-800 dark:bg-neutral-900 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] border-r border-neutral-700 text-white w-64 min-h-screen flex flex-col py-8 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 transition-transform duration-300 z-40`}
                
            >
                <div className="text-2xl font-bold text-center mb-10 tracking-wide">
                    <a href="/">
                        <img src="/logo.avif" alt="Logo" className="w-40 mx-auto animate-blurred-fade-in" loading="eager" />
                    </a>
                </div>

                <hr className="dark:border-neutral-700 border-neutral-500 mb-6" />

                <ul className="animate-fade-in-up">
                    <li>
                        <a
                            href="/"
                            className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-icon lucide-house w-4 h-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                            Inicio
                        </a>
                    </li>
                </ul>

                <hr className="dark:border-neutral-700 border-neutral-500 mb-6 mt-6" />
                {currentMenu == "main" ? (
                    <ul className="flex flex-col gap-2 animate-fade-in-up">
                        <li>
                            <a
                                href="/noticias"
                                className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-newspaper-icon lucide-newspaper w-4 h-4"><path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="10" y="6" rx="1"/></svg>
                                Noticias
                            </a>
                        </li>
                        <li>
                            <a
                                href="/sorteos"
                                className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gift-icon lucide-gift w-4 h-4"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
                                Sorteos
                            </a>
                        </li>
                        <li>
                            <a
                                href="/diseños"
                                className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-images-icon lucide-images w-4 h-4"><path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/></svg>
                                Diseños
                            </a>
                        </li>
                        <li>
                            <a
                                href="/usuarios"
                                className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
                                Usuarios
                            </a>
                        </li>
                        <li>
                            <button
                                type="button"
                                aria-label="Correo"
                                onClick={() => setCurrentMenu("mail")}
                                className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md w-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send w-4 h-4"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
                                Correo
                            </button>
                        </li>
                        <li>
                            <a
                                href="/citas"
                                className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check2-icon lucide-calendar-check-2 w-4 h-4"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18"/><path d="m16 20 2 2 4-4"/></svg>
                                Citas
                            </a>
                        </li>
                        <li>
                            <a
                                href="/facturas"
                                className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text w-4 h-4"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                                Facturas
                            </a>
                        </li>
                    </ul>
                )
                :
                currentMenu == "mail" ? (
                    <ul className="flex flex-col gap-2">
                        <li>
                            <button
                                type="button"
                                aria-label="Volver"
                                onClick={goBack}
                                className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md w-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-left-icon lucide-move-left w-4 h-4"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg>
                                Volver
                            </button>
                        </li>
                        <li>
                            <a
                            href="/correo-individual"
                            className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Usuario individual
                            </a>
                        </li>
                        <li>
                            <a
                            href="/correo-masivo"
                            className="flex items-center gap-3 p-3 pl-10 hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-all duration-200 font-normal text-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-round-icon lucide-users-round h-4 w-4"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
                                Todos los usuarios
                            </a>
                        </li>
                    </ul>
                ):null}

                <div className="mt-auto font-thin pt-6 text-xs text-neutral-400 text-center border-t dark:border-neutral-700 border-neutral-500">
                    TATTOO STUDIO © 2025
                </div>
            </nav>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
