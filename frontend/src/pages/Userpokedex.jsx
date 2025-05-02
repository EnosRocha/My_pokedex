function Userpokedex({ token }) {
  return (
    <div className="flex items-center bg-amber-600 h-screen w-screen">
      <div className="relative bg-red-600 h-220 w-155 rounded-[20px] shadow-2xl border-2 left-110">
        <div className="relative bg-red-600 h-218 w-155 rounded-[20px] shadow-2xl border-2 left-2"></div>
        <div className=" absolute bg-gray-200 w-30 h-30 rounded-full left-19 top-10 shadow-md border-2"></div>
        <div className=" absolute bg-blue-400 w-25 h-25 rounded-full top-13 left-22 border-2"></div>
        <div
          className=" absolute bg-blue-500
         w-20 h-20 rounded-full top-17 left-26"
        ></div>
        <div className=" absolute bg-blue-400 w-12 h-12 rounded-full top-18  left-26"></div>
        <div className=" absolute bg-white w-6 h-6 rounded-full top-20  left-28"></div>
        <div className=" absolute bg-red-500 w-6 h-6 rounded-full top-15  left-60 border-2"></div>
        <div className=" absolute bg-white w-2 h-2 rounded-full top-16  left-61 border-2"></div>
        <div className=" absolute bg-yellow-300 w-6 h-6 rounded-full top-15  left-75 border-2"></div>
        <div className=" absolute bg-white w-2 h-2 rounded-full top-16  left-76 border-2"></div>
        <div className=" absolute bg-green-500 w-6 h-6 rounded-full top-15  left-90 border-2"></div>
        <div className=" absolute bg-white w-2 h-2 rounded-full top-16  left-91 border-2"></div>

        {/*tela da pokedex */}
        <div className="absolute bg-neutral-500 h-100 w-100 top-60 left-20 shadow-md rounded-bl-[50px] rounded-[15px] border-2">
          <div className=" absolute bg-red-500 w-4 h-4 rounded-full top-4  left-35 border-3"></div>
          <div className=" absolute bg-red-500 w-4 h-4 rounded-full top-4  left-55 border-3"></div>
          <div className="absolute bg-white h-70 w-80 top-10 left-10 shadow-md rounded-[30px] border-2"></div>
          <div>
            <div className=" absolute bg-red-500 w-10 h-10 shadown-md rounded-full top-85  left-7 border-2"></div>

            <div className="screen botons and speakers">
              <div className=" absolute bg-gray-500 w-10 h-2 rounded-full top-85  left-70 border-3"></div>
              <div className=" absolute bg-gray-500 w-10 h-2 rounded-full top-88  left-70 border-3"></div>
              <div className=" absolute bg-gray-500 w-10 h-2 rounded-full top-91  left-70 border-3"></div>
              <div className=" absolute bg-gray-500 w-10 h-2 rounded-full top-94  left-70 border-3"></div>
            </div>
          </div>
        </div>
        <div className=" bottom nob">
          <div
            className=" absolute bg-green-950
             w-20 h-20 shadown-md rounded-full top-170  left-15 border-2"
          ></div>
          <div
            className=" absolute bg-green-950
             w-20 h-20 shadown-md rounded-full top-169  left-16 border-2"
          ></div>
        </div>
        <div
          className=" absolute bg-red-700
             w-20 h-3 shadown-md rounded-full top-170  left-47 border-2 shadow-2xl"
        ></div>
        <div
          className=" absolute bg-blue-700
             w-20 h-3 shadown-md rounded-full top-170  left-75 border-2 shadow-2xl"
        ></div>
        <div
          className=" absolute bg-green-400
             w-48 h-20 shadown-md top-180 rounded-[10px]  left-47 border-2"
        ></div>
        <div
          className=" absolute bg-green-950
             w-10 h-15 shadown-md top-170 rounded-[5px]  left-122 border-2"
        ></div>
        <div
          className=" absolute bg-green-950
             w-10 h-15 shadown-md top-195 rounded-[5px]  left-122 border-2"
        ></div>
        <div
          className=" absolute bg-green-950
             w-15 h-10 shadown-md top-185 rounded-[5px]  left-107 border-2"
        ></div>
        <div
          className=" absolute bg-green-950
             w-15 h-10 shadown-md top-185 rounded-[5px]  left-132 border-2"
        ></div>
        <div className="absolute bg-black w-85 h-1 top-45 left-2"></div>
        <div className="absolute bg-black w-87 h-0.5 top-48 left-2"></div>
        <div className="absolute bg-black w-59 h-1 top-31 left-98"></div>
        <div className="absolute bg-black w-18 h-1 top-38 left-84 rotate-130"></div>
        <div className="absolute bg-black w-21 h-0.5 top-40 left-85 rotate-130"></div>

        <div className="absolute w-18 h-185 bg-red-500 top-32 left-157 border-1"></div>
        <div className="absolute w-5 h-185 bg-red-300 top-32 left-160"></div>

        <div className="absolute w-18 h-2 bg-black top-32 left-157"></div>
        <div className="absolute w-18 h-2 bg-black top-215 left-157"></div>
        <div className="absolute w-18 h-2 bg-red-900 border-2 top-180 left-157"></div>
        <div className="absolute w-18 h-2 bg-red-900 border-2 top-75 left-157"></div>
        <div className="absolute bg-red-600 h-170 w-155 rounded-[20px] shadow-2xl border border-t-0 border-black left-175 top-50 rounded-t-none"></div>
        <div className="absolute bg-red-600 h-17 w-90 border border-b-0 border-black left-175 top-34 rounded-t-none "></div>
      
      </div>
    </div>
  );
}
export default Userpokedex;
