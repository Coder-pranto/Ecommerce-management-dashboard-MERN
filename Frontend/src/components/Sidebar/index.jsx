import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserTag, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { GiClothes } from 'react-icons/gi';
import { TbBrandCtemplar } from 'react-icons/tb';
import { MdOutlineCategory, MdShoppingCartCheckout } from 'react-icons/md';
import { BiCategoryAlt } from 'react-icons/bi';
import { SiTheboringcompany } from 'react-icons/si';
import { BiLandscape } from 'react-icons/bi';
import { FaBuildingUser } from 'react-icons/fa6';

const SideBar = () => {
  const [userSubMenuOpen, setUserSubMenuOpen] = useState(false);

  return (
    <aside className="bg-gray-800 h-screen p-5 flex flex-col">
      <div className="flex items-center mb-8">
        <SiTheboringcompany className="text-white text-4xl mr-3" />
        <span className="text-white text-2xl font-bold">Ecommerce</span>
      </div>
      <ul className="text-white overflow-y-auto space-y-4">
        <li>
          <Link to="/dashboard" className="flex items-center text-xl hover:bg-gray-700 p-2 rounded">
            <FaHome className="mr-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/product" className="flex items-center text-xl hover:bg-gray-700 p-2 rounded">
            <GiClothes className="mr-2" />
            Product
          </Link>
        </li>
        <li>
          <Link to="/category" className="flex items-center text-xl hover:bg-gray-700 p-2 rounded">
            <MdOutlineCategory className="mr-2" />
            Category
          </Link>
        </li>
        <li>
          <Link to="/subcategory" className="flex items-center text-xl hover:bg-gray-700 p-2 rounded">
            <BiCategoryAlt className="mr-2" />
            Subcategory
          </Link>
        </li>
        <li>
          <Link to="/brands" className="flex items-center text-xl hover:bg-gray-700 p-2 rounded">
            <TbBrandCtemplar className="mr-2" />
            Brand
          </Link>
        </li>
        <li>
          <Link to="/banner" className="flex items-center text-xl hover:bg-gray-700 p-2 rounded">
            <BiLandscape className="mr-2" />
            Banner
          </Link>
        </li>
        <li>
          <Link to="/vendor" className="flex items-center text-xl hover:bg-gray-700 p-2 rounded">
            <FaBuildingUser className="mr-2" />
            Vendor
          </Link>
        </li>
        <li>
          <Link to="/customer" className="flex items-center text-xl hover:bg-gray-700 p-2 rounded">
            <FaUserTag className="mr-2" />
            Customer
          </Link>
        </li>
        <li>
          <Link to="/order" className="flex items-center text-xl hover:bg-gray-700 p-2 rounded">
            <MdShoppingCartCheckout className="mr-2" />
            Order 
          </Link>
        </li>
        <li>
          <button onClick={() => setUserSubMenuOpen(!userSubMenuOpen)} className="flex items-center text-xl hover:bg-gray-700 p-2 rounded w-full text-left focus:outline-none">
            <FaUsers className="mr-2" />
            User
            {userSubMenuOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
          </button>
          {userSubMenuOpen && (
            <ul className="pl-6 mt-2 space-y-2">
              <li>
                <Link to="/users/register" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded">
                  User Registration
                </Link>
              </li>
              <li>
                <Link to="/users/all-users" className="flex items-center text-lg hover:bg-gray-700 p-2 rounded">
                  All Users
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
