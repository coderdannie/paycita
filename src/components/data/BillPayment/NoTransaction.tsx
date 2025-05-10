import Image from 'next/image';

interface OpenProp {
  setIsOpen: () => void;
}

const NoTransaction: React.FC<OpenProp> = ({ setIsOpen }) => {
  return (
    <div className="min-h-[80vh] grid place-items-center">
      <div className="max-w-[500px] text-center ">
        <Image
          src="/assets/card-remove.svg"
          alt="card remove icon"
          className="mx-auto"
          width={100}
          height={100}
        />
        <h2 className="font-bold text-[#171717] text-2xl">
          No Transactions Yet
        </h2>
        <p className="mt-4">
          Your transaction history will appear here once you make a purchase.
          Start by buying airtime or an internet subscription
        </p>
        <button
          className="bg-primary text-white h-[40px] rounded-md px-12 mt-8 "
          onClick={setIsOpen}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
export default NoTransaction;
