import Navbar from "./pages/navbar";
import Carousel from "./pages/Carousel";
import ExploreMenu from "./pages/ExploreMenu";
import FoodDisplay from "./pages/Fooddisplay"; // ✅ use consistent spelling!
import ExploreAndFood from "./pages/ExploreAndFood";

function Homepage() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero Carousel */}
        <section>
          <Carousel />
        </section>

        {/* Explore Categories */}
        <section className="container py-5">
          <h2 className="mb-4 text-center">Browse Our Categories</h2>
          <ExploreAndFood/>
        </section>
      </main>
    </>
  );
}

export default Homepage;
