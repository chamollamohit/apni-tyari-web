import Image from "next/image";
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto ">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="relative h-20 w-35">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <p className="text-sm text-slate-400 max-w-xs">
                        Empowering students with affordable, high-quality
                        education across India.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li>About Us</li>
                        <li>Careers</li>
                        <li>Blog</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li>Help Center</li>
                        <li>Terms of Service</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
