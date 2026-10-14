import PublicNavbar from "@/components/layout/public-navbar/PublicNavbar";
import Footer from "@/components/shared/Footer";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <PublicNavbar />
      {children}
      <Footer />
    </div>
  );
};

export default CommonLayout;
