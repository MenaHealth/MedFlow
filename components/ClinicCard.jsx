"use client";

import { useRouter } from "next/navigation";

const ClinicCard = ({ key, clinic, count }) => {;
  const router = useRouter();

  const handleClinicClick = () => {
    router.push(`/patient/clinic?clinic=${clinic.name}`);
  };

  if (!clinic) return (<h1>Loading...</h1>);
  return (
    <div className='prompt_card'>
      <div className='flex justify-between items-start gap-5'>
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
          onClick={handleClinicClick}
        >
          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {clinic.name}
            </h3>
            <p className='font-inter text-sm text-gray-500'>
              {count} patients unattended!
            </p>
          </div>
        </div>
      </div>

      <p className='my-4 font-satoshi text-sm text-gray-700'></p>
    </div>
  );
};

export default ClinicCard;
