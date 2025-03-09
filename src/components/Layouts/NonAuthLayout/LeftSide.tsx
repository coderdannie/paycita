import Image from 'next/image';
import React from 'react';
import { TbLogin2 } from 'react-icons/tb';

const LeftSide = () => {
  return (
    <div className="w-full flex flex-col bg-[#551A8B] text-white h-full">
      <div>
        <Image
          src="/assets/Ellipse-2.png"
          alt="map"
          width={300}
          height={300}
          className="relative  w-[40rem]"
        />
      </div>
      <div className="flex flex-col px-5 py-[2rem] space-y-2">
        <div className="bg-[#FFFFFF1C] text-white w-[32px] aspect-square rounded-full text-xl grid place-items-center">
          <TbLogin2 />
        </div>

        <div className="px-3">
          <h2>
            Welcome Back to <span className="font-bold">BizShift</span>
          </h2>
          <p className="text-xs max-w-[18rem]">
            Log in to manage your business effortlessly.
          </p>
        </div>
        <Image
          src={'/assets/map.png'}
          alt="map"
          width={330}
          height={200}
          className="pt-7"
          style={{ animation: 'spin 10s linear infinite' }} // 10 seconds spin
        />
      </div>
      <div className="flex flex-1" />
      <div>
        <Image
          src="/assets/Ellipse-1.png"
          alt="map"
          width={300}
          height={300}
          className="relative left-[-2rem] right-14 w-[40rem]"
        />
      </div>
    </div>
  );
};

export default LeftSide;
