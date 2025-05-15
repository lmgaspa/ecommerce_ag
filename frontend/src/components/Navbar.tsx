import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-primary text-background py-4 px-8 flex justify-between items-center shadow-md">
      <Link to="/" className="text-3xl font-bold text-background">
        Agenor Gasparetto
      </Link>
      <div className="flex gap-8 items-center">
        <Link to="/" className="text-lg font-semibold text-background hover:text-secondary transition">
          Home
        </Link>
        <Link to="/cart" className="text-lg font-semibold text-background hover:text-secondary transition">
          <FaShoppingCart size={28} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
