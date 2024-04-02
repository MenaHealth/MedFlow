import Link from "next/link";
import { useSession } from 'next-auth/react';

const PatientForm = ({ patient, setPatient, submitting, handleSubmit }) => {
  const { data: session } = useSession();

  patient.coordinatorId = session?.user?.id;

  return (
    <section className='w-full max-w-full flex-start flex-col mx-auto'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>Add Patient</span>
      </h1>
      <p className='desc text-left max-w-md'>
        Add and manage patients effectively to stay organized and productive.
      </p>

      <form
        onSubmit={handleSubmit}
        className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism backdrop-filter'
      >
        <label>
          <span className=' font-semibold text-base text-gray-700'>
            Patient Name
          </span>
          <input
            value={patient.name}
            onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            type='text'
            placeholder='Enter patient name'
            required
            className='form_input'
          />
        </label>

        <label>
          <span className='font-semibold text-base text-gray-700'>
            Birth Date
          </span>
          <input
            value={patient.birthDate}
            onChange={(e) => setPatient({ ...patient, birthDate: e.target.value })}
            type='date'
            className='form_input'
          />
        </label>

        <label>
          <span className=' font-semibold text-base text-gray-700'>
            Location
          </span>
          <input
            value={patient.location}
            onChange={(e) => setPatient({ ...patient, location: e.target.value })}
            type='text'
            placeholder='Enter patient location'
            className='form_input'
          />
        </label>

        <label>
          <span className=' font-semibold text-base text-gray-700'>
            Govt ID
          </span>
          <input
            value={patient.govtId}
            onChange={(e) => setPatient({ ...patient, govtId: e.target.value })}
            type='text'
            placeholder='Enter patient ID'
            className='form_input'
          />
        </label>

        <label>
          <span className=' font-semibold text-base text-gray-700'>
            Complaint
          </span>
          <input
            value={patient.complaint}
            onChange={(e) => setPatient({ ...patient, complaint: e.target.value })}
            type='text'
            placeholder='Enter patient complaint'
            required
            className='form_input'
          />
        </label>

        <label>
          <span className=' font-semibold text-base text-gray-700'>
            Contact No
          </span>
          <input
            value={patient.contactNo}
            onChange={(e) => setPatient({ ...patient, contactNo: e.target.value })}
            type='text'
            placeholder='Enter patient contact number'
            required
            className='form_input'
          />
        </label>

        <label>
          <span className=' font-semibold text-base text-gray-700'>
            Status
          </span>
          <input
            value={patient.status}
            onChange={(e) => setPatient({ ...patient, status: e.target.value })}
            type='text'
            placeholder='Enter patient status'
            required
            className='form_input'
          />
        </label>

        <label>
          <span className=' font-semibold text-base text-gray-700'>
            CoordinatorId
          </span>
          <input
            value={patient.coordinatorId}
            onChange={(e) => setPatient({ ...patient, coordinatorId: e.target.value })}
            type='text'
            placeholder='Enter patient coordinatorId'
            required
            className='form_input'
          />
        </label>


        <label>
          <span className=' font-semibold text-base text-gray-700'>
            Assigned Clinic
          </span>
          <input
            value={patient.assignedClinic}
            onChange={(e) => setPatient({ ...patient, assignedClinic: e.target.value })}
            type='text'
            placeholder='Enter patient assignedClinic'
            required
            className='form_input'
          />
        </label>

        <label>
          <span className=' font-semibold text-base text-gray-700'>
            Assigned Doc
          </span>
          <input
            value={patient.assignedDocId}
            onChange={(e) => setPatient({ ...patient, assignedDocId: e.target.value })}
            type='text'
            placeholder='Enter patient assignedDocId'
            className='form_input'
          />
        </label>

        <label>
          <span className='font-semibold text-base text-gray-700'>
            Admitted Date
          </span>
          <input
            value={patient.admittedDate}
            onChange={(e) => setPatient({ ...patient, admittedDate: e.target.value })}
            type='date'
            className='form_input'
          />
        </label>

        <div className='flex-end mx-3 mb-5 gap-4'>
          <Link href='/patient/triage' className='text-black text-sm'>
            Cancel
          </Link>

          <button
            type='submit'
            disabled={submitting}
            className='black_btn'
          >
            {submitting ? `Creating...`: 'Create'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PatientForm;
