import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSlider />
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;