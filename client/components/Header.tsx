import {
  FaHeart,
  FaRegCommentDots,
  FaBell,
  FaUser,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import { MdOutlineSearch } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";

export default function Topbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight select-none">
          trendies
        </h1>

        <div className="flex items-center gap-6">
          <button className="bg-black text-white px-4 py-2 text-sm font-medium uppercase">
            Become a seller
          </button>

          <div className="flex items-center gap-1 cursor-pointer">
            <span>IN</span>
            <FiChevronDown />
          </div>

          <div className="flex items-center gap-5 text-lg">
            <Icon icon={FaHeart} label="Wishlist" />
            <Icon icon={FaRegCommentDots} label="Messages" />
            <Icon icon={FaBell} label="Notifications" />
            <Icon icon={FaBell} label="Cart" />
            <Icon icon={FaUser} label="Profile" />
            <Icon
              icon={FaArrowRightFromBracket}
              label="Logout"
              className="text-red-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-700">
          {["All", "Watches", "Jewellery", "Bags", "Shoes", "Accessories"].map(
            (cat) => (
              <Link href="/" key={cat} className="hover:text-black">
                {cat}
              </Link>
            )
          )}
        </div>

        <div className="relative">
          <MdOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search.."
            className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>
    </header>
  );
}

function Icon({
  icon: IconComp,
  label,
  className = "",
}: {
  icon: React.ComponentType;
  label: string;
  className?: string;
}) {
  return (
    <button
      className={`hover:text-black transition-colors ${className || ""}`}
      aria-label={label}
    >
      <IconComp />
    </button>
  );
}
