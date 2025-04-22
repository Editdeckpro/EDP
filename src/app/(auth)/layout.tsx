import Image from "next/image";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Background Image Section */}
      <div className="w-full min-h-72 md:h-auto md:w-2/3 relative">
        <Image
          src="/images/auth/login-bg.jpg"
          alt="Cybernetic tiger in a field of red flowers"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/images/logo.jpg"
              alt="Cybernetic tiger in a field of red flowers"
              className="object-cover"
              priority
              width={150}
              height={150}
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
export default Layout;
