// app/patient-info/dashboard/page.jsx
"use client";

import * as React from 'react';
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { UserRoundPlus } from "lucide-react"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import InfoIcon from '@mui/icons-material/Info';

import { Button } from '@/components/ui/button';
import Tooltip from '../../../components/form/Tooltip';
import './dashboard.css';
import TableCellWithTooltip from '@/components/TableCellWithTooltip';
import * as Toast from '@radix-ui/react-toast';
import { Languages } from '@/utils/languages.enum';

import NotesCell from '@/components/NotesCell';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";

import { PRIORITIES, STATUS } from '@/data/data';
import { DoctorSpecialties as DOCTOR_SPECIALTIES } from '@/data/doctorSpecialty.enum';
import Link from 'next/link';

export default function PatientTriage() {
  const { data: session, status } = useSession();
  const [allData, setAllData] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [userSession, setUserSession] = useState(null);
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [specialtyFilter, setSpecialtyFilter] = React.useState("all");

  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userSessionData = {
        id: session.user._id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        accountType: session.user.accountType,
        isAdmin: session.user.isAdmin,
        image: session.user.image,
        doctorSpecialty: session.user.doctorSpecialty,
        languages: session.user.languages,
        token: session.user.token,
        gender: session.user.gender,
        dob: session.user.dob,
        countries: session.user.countries,
      };
      setUserSession(userSessionData);
    }
  }, [session, status]);


  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const triggerToast = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  const [shouldShowClearButton, setShouldShowClearButton] = useState([
    priorityFilter !== "all",
    statusFilter !== "all",
    specialtyFilter !== "all"
  ].filter(Boolean).length >= 2);

  useEffect(() => {
    setShouldShowClearButton([
      priorityFilter !== "all",
      statusFilter !== "all",
      specialtyFilter !== "all"
    ].filter(Boolean).length >= 2);
  }, [priorityFilter, statusFilter, specialtyFilter]);

  useEffect(() => {
    const fetchAndSortRows = async () => {
      try {
        const response = await fetch("/api/patient?status!=Archived"); // Exclude Archived patients
        const data = await response.json();

        // Update the rows with filtered and sorted data
        setAllData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAndSortRows();
  }, []); // Only fetch data on mount


  // Memoize the filtered and sorted rows
  const sortedAndFilteredRows = useMemo(() => {
    if (!session || allData.length === 0) return [];

    let filteredRows = [...allData];

    // Apply filters
    if (priorityFilter !== "all") {
      filteredRows = filteredRows.filter(
          (row) => row.priority === priorityFilter
      );
    }

    if (statusFilter !== "all") {
      filteredRows = filteredRows.filter(
          (row) => row.status === statusFilter
      );
    }

    if (specialtyFilter !== "all") {
      filteredRows = filteredRows.filter(
          (row) => row.specialty === specialtyFilter
      );
    }

    if (session?.user?.accountType === "Doctor") {
      filteredRows = filteredRows.filter(
          (row) =>
              row.triagedBy &&
              Object.keys(row.triagedBy).length !== 0 &&
              (session.user.languages || [Languages.ENGLISH]).includes(row.language) &&  // Default to English
              session.user.doctorSpecialty === row.specialty
      );
    }

    if (statusFilter !== "Archived") {
      filteredRows = filteredRows.filter((row) => row.status !== "Archived");
    }

    return filteredRows.sort((a, b) => b._id.localeCompare(a._id));
  }, [allData, priorityFilter, statusFilter, specialtyFilter, session]);

  // Update state whenever sorted and filtered rows change
  useEffect(() => {
    setRows(sortedAndFilteredRows);
  }, [sortedAndFilteredRows]);

  const handleStatusChange = async (value, row, index) => {
    let triagedBy = row.triagedBy ?? {};
    let doctor = row.doctor ?? {};
    if (value === 'Not Started') {
      doctor = {};
      triagedBy = {};
    } else if (value === 'Triaged') {
      if (session.user.accountType !== 'Triage') {
        triggerToast('You do not have the correct permissions to triage patients');
        return;
      }
      triagedBy = { firstName: session.user?.firstName, lastName: session.user?.lastName, email: session.user?.email };
    }

    try {
      await fetch('/api/patient/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: rows[index]["_id"],
          status: value,
          triagedBy,
          doctor
        }),
      });
      const updatedRows = [...rows];
      updatedRows[index].status = value;
      updatedRows[index].triagedBy = triagedBy;
      updatedRows[index].doctor = doctor;
      setRows(updatedRows);
    } catch (error) {
      console.log(error);
    }
  };

  const formatLocation = (city, country) => {
    if (!city && !country) {
      return "";
    } else if (!city) {
      return country;
    } else if (!country) {
      return city;
    } else {
      return `${city}, ${country}`;
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) {
      return "";
    } else if (!firstName) {
      return lastName[0];
    } else if (!lastName) {
      return firstName[0];
    } else {
      return `${firstName[0]}${lastName[0]}`;
    }
  }

  const handleTakeCase = async (index) => {
    let doctor = { firstName: session.user?.firstName, lastName: session.user?.lastName, email: session.user?.email };

    try {
      await fetch('/api/patient/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: rows[index]["_id"],
          status: "In-Progress",
          doctor: doctor
        }),
      });
      const updatedRows = [...rows];
      updatedRows[index].status = "In-Progress";
      updatedRows[index].doctor = doctor;
      setRows(updatedRows);
    } catch (error) {
      console.log(error);
    }
  }

  const submitForm = async (form) => {
    try {
      const pmhxString = Array.isArray(form.pmhx) ? form.pmhx.join(", ") : form.pmhx || "";
      const pshxString = Array.isArray(form.pshx) ? form.pshx.join(", ") : form.pshx || "";

      const payload = {
        ...form,
        pmhx: pmhxString,
        pshx: pshxString,
      };

      const response = await fetch('/api/patient/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Patient data saved successfully!");

    } catch (error) {
      console.error('Error saving patient data:', error);
    }
  };


// Your handleArchive function
  const handleArchive = async (index) => {
    try {
      const patientData = {
        _id: rows[index]["_id"],
        status: "Archived",
        pmhx: rows[index].pmhx || [], // Ensure PMHx is passed as an array
        pshx: rows[index].pshx || [], // Ensure PSHx is passed as an array
        phone: {
          countryCode: "+963",
          phoneNumber: "1233214321"
        }
      };

      // Call submitForm and pass the patient data
      await submitForm(patientData);

      const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
      setRows(updatedRows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // This ensures the component has mounted before using the router
  }, [router]);

  const handlePatientClick = (patientId) => {
    if (router) {
      router.push(`/patient/${patientId}`);
    }
  };

  return (
      <>
        <div className="w-full relative dashboard-page">
          <div className="flex justify-between items-center py-3">
            {/* New Button to Archived Patients */}
            <Link
                href="/create-patient"
                className="flex items-center justify-center no-underline"
            >
              <div className="relative group ml-4 bg-darkBlue p-2">
                <UserRoundPlus color={"white"} bsize={22} />
                <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-2 py-1 rounded shadow-lg">
                Add New Patient
              </span>
              </div>
            </Link>
            <Link href="/patient-info/archived-patients" className="flex items-center justify-center no-underline">
              <div className="relative group ml-4 bg-darkBlue p-2">
                <span className="text-white">View Archived Patients</span>
              </div>
            </Link>
            <h2
                className="flex-1 text-center font-bold"
                style={{ fontSize: "24px" }}
            >
              <span className="blue_gradient">Patient List</span>
            </h2>
            <div style={{ width: 48 }}>
              {" "}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {priorityFilter !== "all" && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                  <EditIcon className="mr-2 cursor-pointer" />
                  Priority: {priorityFilter}
                  <RemoveCircleIcon
                      className="ml-2 cursor-pointer"
                      onClick={() => setPriorityFilter("all")}
                  />
                </div>
            )}
            {statusFilter !== "all" && (
                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center">
                  <EditIcon className="mr-2 cursor-pointer" />
                  Status: {statusFilter}
                  <RemoveCircleIcon
                      className="ml-2 cursor-pointer"
                      onClick={() => setStatusFilter("all")}
                  />
                </div>
            )}
            {specialtyFilter !== "all" && (
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                  <EditIcon className="mr-2 cursor-pointer" />
                  Specialty: {specialtyFilter}
                  <RemoveCircleIcon
                      className="ml-2 cursor-pointer"
                      onClick={() => setSpecialtyFilter("all")}
                  />
                </div>
            )}
            {shouldShowClearButton && (
                <div
                    className="bg-red-100 text-red-800 px-2 py-1 rounded cursor-pointer"
                    onClick={() => {
                      setPriorityFilter("all");
                      setStatusFilter("all");
                      setSpecialtyFilter("all");
                    }}
                >
                  <DeleteSweepIcon className="mr-2" />
                  Clear all filters
                </div>
            )}
          </div>
          <TableContainer component={Paper} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="MuiTableHead-root">
                <TableRow>
                  <TableCell
                      align="left"
                      className="whitespace-nowrap"
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <span>Patient ID</span>
                      <Tooltip tooltipText="Hover to see full patient ID" showTooltip={true}>
                        <InfoIcon className="ml-2" style={{ height: '1rem', width: '1rem' }} />
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell align="center">Last Name</TableCell>
                  <TableCell align="center">Age</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Language Spoken</TableCell>
                  <TableCell
                      align="left"
                      className="whitespace-nowrap">
                    <div className='flex items-center'>
                      <span>Chief Complaint</span>
                      <Tooltip tooltipText="Hover to see full text" showTooltip={true}>
                        <InfoIcon className="ml-2" style={{ height: '1rem', width: '1rem' }} />
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-full justify-start"
                            style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05rem" }}>
                          STATUS
                          <KeyboardArrowDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          {STATUS.map((status) => (
                              <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell align="center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-full justify-start"
                            style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05rem" }}>
                          PRIORITY
                          <KeyboardArrowDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={priorityFilter} onValueChange={setPriorityFilter}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          {PRIORITIES.map((priority) => (
                              <DropdownMenuRadioItem key={priority} value={priority}>{priority}</DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell align="center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-full justify-start"
                            style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05rem" }}>
                          SPECIALTY
                          <KeyboardArrowDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" style={{ maxWidth: "20rem", maxHeight: "30rem", overflowY: "auto" }}>
                        <DropdownMenuRadioGroup value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          {DOCTOR_SPECIALTIES.map((specialty) => (
                              <DropdownMenuRadioItem key={specialty} value={specialty}>{specialty}</DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell
                      align="left">
                    <span>Additional</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                    }}>
                      <span>Notes</span>
                      <Tooltip tooltipText={`Hover description icon to see full text.\nClick pencil icon to edit.`} showTooltip={true}>
                        <InfoIcon className="ml-2" style={{ height: '1rem', width: '1rem' }}/>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell align="center">Triaged By</TableCell>
                  <TableCell align="center">Dr. Pref</TableCell>
                  <TableCell align="center">Doctor</TableCell>
                  <TableCell align="center">Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                    <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCellWithTooltip tooltipText={row._id} maxWidth="100px">
                        <div
                            onClick={() => handlePatientClick(row._id)}
                            className="block overflow-hidden text-ellipsis text-sm cursor-pointer"
                            style={{ maxWidth: '100px', whiteSpace: 'nowrap' }}
                        >
                          {row._id}
                        </div>
                      </TableCellWithTooltip>
                      <TableCell align="center" style={{ minWidth: '150px' }}>{row.lastName}</TableCell>
                      <TableCell align="center">{row.age || ''}</TableCell>
                      <TableCell align="center" style={{ minWidth: '150px' }}>{formatLocation(row.city, row.country)}</TableCell>
                      <TableCell align="center">{row.language}</TableCell>
                      <TableCellWithTooltip tooltipText={row.chiefComplaint} maxWidth='175px'>
                        <div className="block overflow-hidden text-ellipsis text-sm">
                          {row.chiefComplaint}
                        </div>
                      </TableCellWithTooltip>
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">{row.status ?? 'Not Started'}</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-46">
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={row.status} onValueChange={(value) => handleStatusChange(value, row, index)}>
                              {STATUS.map((status) => status !== 'Archived' && (
                                  <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">{row.priority}</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-46">
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={row.priority} onValueChange={async (value) => {
                              try {
                                await fetch('/api/patient/', {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    _id: rows[index]["_id"],
                                    status: "In-Progress",
                                    priority: value, // New priority value
                                  }),
                                });
                                const updatedRows = [...rows];
                                updatedRows[index].priority = value;
                                setRows(updatedRows);
                              } catch (error) {
                                console.log(error);
                              }
                            }}>
                              {PRIORITIES.map((priority) => (
                                  <DropdownMenuRadioItem key={priority} value={priority}>{priority}</DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">{row.specialty}</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent style={{ maxWidth: "20rem", maxHeight: "25rem", overflowY: "auto" }}>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={row.specialty}
                                onValueChange={async (value) => {
                                  try {
                                    await fetch(`/api/patient/`, {
                                      method: "PATCH",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        _id: rows[index]._id,
                                        specialty: value,
                                      }),
                                    });
                                    const updatedRows = [...rows];
                                    updatedRows[index].specialty = value;
                                    setRows(updatedRows);
                                  } catch (error) {
                                    console.log(error);
                                  }
                                }}
                            >
                              {DOCTOR_SPECIALTIES.map((specialty) => (
                                  <DropdownMenuRadioItem key={specialty} value={specialty}>
                                    {specialty}
                                  </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <NotesCell
                          notes={row.dashboardNotes}
                          onUpdate={async (newNotes) => {
                            try {
                              await fetch("/api/patient/", {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  _id: rows[index]["_id"],
                                  dashboardNotes: newNotes,
                                }),
                              });
                              const updatedRows = [...rows];
                              updatedRows[index].dashboardNotes = newNotes;
                              setRows(updatedRows);
                            } catch (error) {
                              console.log(error);
                            }
                          }}
                      />
                      <TableCell align="center">
                        {getInitials(row.triagedBy?.firstName, row.triagedBy?.lastName)}
                      </TableCell>
                      <TableCell align="center">
                        {row.genderPreference === 'Male' ? (
                            <span style={{ fontSize: '1.5em'}}>♂</span>
                        ) : row.genderPreference === 'Female' ? (
                            <span style={{ fontSize: '1.5em'}}>♀</span>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        {
                          row.status === 'Not Started'
                              ? ''
                              : row.status === 'In-Progress' || row.status === 'Archived'
                                  ? getInitials(row.doctor?.firstName, row.doctor?.lastName)
                                  : row.status === 'Triaged'
                                      ? session.user.accountType === 'Doctor'
                                          ?  (
                                              <Button onClick={() => handleTakeCase(index)}
                                                      variant="contained"
                                                      color="primary"
                                                      style={{
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        padding: '8px 16px',
                                                        fontSize: '14px',
                                                        textTransform: 'none',
                                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                                                      }}>
                                                Take Case
                                              </Button>
                                          )
                                          : ''
                                      : (
                                          <Button onClick={() => handleArchive(index)}>
                                            Archive
                                          </Button>
                                      )}
                      </TableCell>
                      <TableCell align="center">
                        {row.createdAt ? new Date(row.createdAt).toLocaleString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {rows.length === 0 && (
              <div className="text-center text-gray-500 my-6">

                <p>No patient data found matching your expertise.</p>
              </div>
          )}
        </div>
        <Toast.Provider>
          <Toast.Root
              className="bg-black text-white p-3 rounded-lg shadow-lg"
              open={open}
              onOpenChange={setOpen}
              duration={3000}
          >
            <Toast.Title>{message}</Toast.Title>
          </Toast.Root>
          <Toast.Viewport className="fixed bottom-5 left-1/2 transform -translate-x-1/2" />
        </Toast.Provider>
      </>
  );
}
