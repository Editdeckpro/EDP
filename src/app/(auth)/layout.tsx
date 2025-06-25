import Image from "next/image";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Background Image Section */}
      <section className="w-full min-h-72 md:h-auto md:w-2/3 relative">
        <Image
          src="/images/auth/login-bg.jpg"
          alt="Cybernetic tiger in a field of red flowers"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Login Form Section */}
      <section className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 md:relative">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/images/logo.jpg"
              alt="edit deck pro logo.png"
              className="object-cover"
              priority
              width={150}
              height={150}
            />
          </div>

          {children}
        </div>
      </section>
    </main>
  );
};
export default Layout;
