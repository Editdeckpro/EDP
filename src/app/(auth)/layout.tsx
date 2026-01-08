import Image from "next/image";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Background Image Section */}
      <section className="w-full h-48 md:h-screen md:w-2/3 relative overflow-hidden">
        <Image
          src="/images/auth/login-bg.jpg"
          alt="Cybernetic tiger in a field of red flowers"
          fill
          className="object-cover w-full h-full"
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
        />
      </section>

      {/* Login Form Section */}
      <section className="w-full md:w-1/3 flex items-center justify-center bg-white p-8 md:relative">
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
