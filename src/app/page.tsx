import { Header } from "@/components/layout/Header";
import { TodayView } from "@/components/calendar/TodayView";
import { CTABanner } from "@/components/layout/CTABanner";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="px-3 sm:px-6 lg:px-10 flex-1 flex flex-col">
        <TodayView />
      </div>
      <CTABanner />
      <Footer />
    </main>
  );
}
