import PublicNavbar from "@/components/layout/public-navbar/PublicNavbar";
import Footer from "@/components/shared/Footer";
import { getMe } from "@/services/user/getMe";

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();

  return (
    <div>
      <PublicNavbar user={user} />
      {children}
      <Footer />
    </div>
  );
};

export default CommonLayout;
