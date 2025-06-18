import CreateShoe from "@components/shoes/CreateShoe";
import ShoesList from "@components/shoes/ShoesList";

export default function NewShoePage() {
  return (
    <div className="page-container p-4">
      <h1 className="text-2xl font-bold mb-4">Add a Shoe</h1>
      <CreateShoe />
      <h2 className="text-xl font-semibold mt-8 mb-4">Your Shoes</h2>
      <ShoesList />
    </div>
  );
}
