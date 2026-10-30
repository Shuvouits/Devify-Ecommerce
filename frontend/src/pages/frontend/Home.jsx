import HomepageSlider from "../../components/frontend/home/HomepageSlider";
import FeaturedCategories from "../../components/frontend/home/FeaturedCategories";

const Home = () => {
    return (
        <main className="mx-auto min-h-screen w-full max-w-[1300px] bg-white">

            {/* Section 1: Homepage Hero Slider */}
            <HomepageSlider />

            {/* Section 2: Featured Categories */}
            <FeaturedCategories />

            {/* Section 3: Products on Sale */}
            {/* <ProductsOnSale /> */}

            {/* Section 4: Featured Products */}
            {/* <FeaturedProducts /> */}

            {/* Section 5: New Arrivals */}
            {/* <NewArrivals /> */}

        </main>
    );
};

export default Home;