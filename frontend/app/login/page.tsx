import react from "react"
import { FaUserTie } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import Button from "../components/buttons";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-[#FAEFE9] flex flex-col">
      <Navbar />
      <HeaderWhite />
      <div className="flex flex-row flex-1">
        <section className="flex-1 flex items-center justify-center border-r">
          <div>
            <div className="flex justify-center mb-4">
              <FaUserTie className="text-4xl text-gray-700" />
            </div>
            <p className="text-gray-700 text-lg max-w-lg font-bold text-center mb-10">
              For Employers
            </p>
            <p className="text-gray-700 text-lg max-w-lg font-bold text-center">
              companies willing to put up internship information for the public click on the busineess login below
            </p>
            <div className="mt-6 flex justify-center">
              <Button>Business Login</Button>
            </div>
          </div>
          
        </section>
        <section className="flex-1 flex items-center justify-center">
          <div>
            <div className="flex justify-center mb-4">
              <FaBook className="text-4xl text-gray-700" />
            </div>
            <div className="text-gray-700 text-lg max-w-lg font-bold text-center mb-10">
                For candidate
            </div>
            <div className="text-gray-700 text-lg max-w-lg font-bold text-center ">
                Candidates intrested in applying for interships click on the apply button.
            </div>
            <div className="mt-6 flex justify-center">
              <Button>candidate login</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;