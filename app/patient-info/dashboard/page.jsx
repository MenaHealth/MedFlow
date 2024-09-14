// app/patient-info/dashboard/page.jsx
"use client";

import * as React from 'react';
import { useEffect, useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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

import { Button } from '@/components/ui/button';
import Tooltip from '../../../components/form/Tooltip';
import './dashboard.css';
import InfoIcon from '@mui/icons-material/Info';
import TableCellWithTooltip from '@/components/TableCellWithTooltip';
import * as Toast from '@radix-ui/react-toast';
import { useSession } from 'next-auth/react';
import NotesCell from '@/components/NotesCell';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";


import { PRIORITIES, SPECIALTIES, STATUS } from '@/data/data';
import Link from 'next/link';

export default function PatientTriage() {
  const [rows, setRows] = React.useState([]);
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [specialtyFilter, setSpecialtyFilter] = React.useState("all");

  const { data: session } = useSession();

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

  const sortAndFilterRows = (
      rows,
      priorityFilter,
      statusFilter,
      specialtyFilter
  ) => {
    let filteredRows = rows;

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

    let sortedRows = [...filteredRows].sort((a, b) => {
      const dateA = new Date(a.surgeryDate);
      const dateB = new Date(b.surgeryDate);
      return dateB - dateA;
    });

    return sortedRows;
  };

  useEffect(() => {
    const fetchAndSortRows = async () => {
      try {
        const response = await fetch("/api/patient/");
        const data = await response.json();
        console.log(data)
        const sortedAndFilteredData = sortAndFilterRows(
            data,
            priorityFilter,
            statusFilter,
            specialtyFilter
        );
        setRows(sortedAndFilteredData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAndSortRows();
  }, [priorityFilter, statusFilter, specialtyFilter]);

  return (
      <>
        <div className="w-full relative dashboard-page">
          <div className="flex justify-between items-center py-3">
            {/* Update the href to point to /create-patient */}
            <Link
                href="/create-patient"
                className="flex items-center justify-center no-underline"
            >
              <div className="relative group">
                <PersonAddIcon
                    className="text-5xl rounded-full shadow bg-white group-hover:shadow-lg transition-all duration-300"
                    style={{
                      color: "currentColor",
                      transition: "color 0.15s ease-in-out",
                      padding: "0.75rem"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#FF5722")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "currentColor")}
                />
                <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-2 py-1 rounded shadow-lg">
                Add New Patient
              </span>
              </div>
            </Link>
            <h2
                className="flex-1 text-center font-bold"
                style={{ fontSize: "24px" }}
            >
              {/* Adjusted font size and added bold */}
              <span className="blue_gradient">Patient List</span>
            </h2>
            <div style={{ width: 48 }}>
              {" "}
              {/* Placeholder to balance the header visually */}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {priorityFilter !== "all" && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                  <EditIcon
                      className="mr-2 cursor-pointer"
                  />
                  Priority: {priorityFilter}
                  <RemoveCircleIcon
                      className="ml-2 cursor-pointer"
                      onClick={() => setPriorityFilter("all")}
                  />
                </div>
            )}
            {statusFilter !== "all" && (
                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center">
                  <EditIcon
                      className="mr-2 cursor-pointer"
                  />
                  Status: {statusFilter}
                  <RemoveCircleIcon
                      className="ml-2 cursor-pointer"
                      onClick={() => setStatusFilter("all")}
                  />
                </div>
            )}
            {specialtyFilter !== "all" && (
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                  <EditIcon
                      className="mr-2 cursor-pointer"
                  />
                  Specialty: {specialtyFilter}
                  <RemoveCircleIcon
                      className="ml-2 cursor-pointer"
                      onClick={() => setSpecialtyFilter("all")}
                  />
                </div>
            )}
            {shouldShowClearButton &&
                (
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
                )
            }
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
                        <InfoIcon className="ml-2" style={{ height: '1rem', width: '1rem' }}/>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell align="center">Last Name</TableCell>
                  <TableCell align="center">Age</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Language Spoken</TableCell>
                  <TableCell
                    align="left"
                    className="whitespace-nowrap"
                  >
                    <div className='flex items-center'>
                      <span>Chief Complaint</span>
                      <Tooltip tooltipText="Hover to see full text" showTooltip={true}>
                        <InfoIcon className="ml-2" style={{ height: '1rem', width: '1rem' }}/>
                      </Tooltip>
                    </div>
                  </TableCell>

                  <TableCell align="center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-full justify-start"
                            style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05rem" }}
                        >
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
                            style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05rem" }}
                        >
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
                            style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05rem" }}
                        >
                          SPECIALTY
                          <KeyboardArrowDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          {SPECIALTIES.map((specialty) => (
                              <DropdownMenuRadioItem key={specialty} value={specialty}>{specialty}</DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell
                    align="left"
                    // className="whitespace-nowrap"
                    >
                    <span>Additional</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                    }}>
                      <span>Notes</span>
                      <Tooltip tooltipText={`Hover to see full text.\nClick text box to edit.`} showTooltip={true}>
                        <InfoIcon className="ml-2" style={{ height: '1rem', width: '1rem' }}/>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell align="center">Triaged By</TableCell>
                  <TableCell align="center">Doctor Assigned</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                    <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >

                      <TableCellWithTooltip tooltipText={row.patientId} maxWidth='100px'>
                          <a href={`/patient-overview/${row._id}`} className="block overflow-hidden text-ellipsis text-sm" style={{
                            maxWidth: '100px',
                            whiteSpace: 'nowrap',
                          }}>
                            {row.patientId}
                          </a>
                      </TableCellWithTooltip>

                      <TableCell align="center" style={{ minWidth: '150px' }}>{row.lastName}</TableCell>
                      <TableCell align="center">{row.age || ''}</TableCell>
                      <TableCell align="center" style={{ minWidth: '150px' }}>{row.location}</TableCell>
                      <TableCell align="center">{row.language}</TableCell>
                      <TableCellWithTooltip tooltipText={row.chiefComplaint} maxWidth='200px'>
                      <div className="block overflow-hidden text-ellipsis text-sm">
                            {row.chiefComplaint}
                          </div>
                      </TableCellWithTooltip>

                      {/* Status */}
                      <TableCell align="center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">{row.status ?? 'Not Started'}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-46">
                              <DropdownMenuSeparator />
                              <DropdownMenuRadioGroup value={row.status} onValueChange={async (value) => {
                                let triagedBy = {};
                                if (value === 'Triaged') {
                                  if (session.user.accountType !== 'Triage') {
                                    triggerToast('You do not have the correct permissions to triage patients');
                                    return;
                                  }
                                  triagedBy = { name: session.user?.name, email: session.user?.email };
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
                                      triagedBy
                                    }),
                                  });
                                  const updatedRows = [...rows];
                                  updatedRows[index].status = value;
                                  if (value === 'Triaged') {
                                    updatedRows[index].triagedBy = triagedBy;
                                  }
                                  setRows(updatedRows);
                                } catch (error) {
                                  console.log(error);
                                }
                              }}>
                                {STATUS.map((status) => (
                                    <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>

                      {/* priority */}
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
                                    priority: value,
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

                      {/* specialty */}
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">{row.specialty}</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-46">
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={row.specialty} onValueChange={async (value) => {
                              try {
                                await fetch('/api/patient/', {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    _id: rows[index]["_id"],
                                    specialty: value,
                                  }),
                                });
                                const updatedRows = [...rows];
                                updatedRows[index].specialty = value;
                                setRows(updatedRows);
                              } catch (error) {
                                console.log(error);
                              }
                            }}>
                              {SPECIALTIES.map((specialty) => (
                                  <DropdownMenuRadioItem key={specialty} value={specialty}>{specialty}</DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <NotesCell
                        notes={row.notes}
                        onUpdate={async (newNotes) => {
                          try {
                            await fetch('/api/patient/', {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                _id: rows[index]["_id"],
                                notes: newNotes,
                              }),
                            });
                            const updatedRows = [...rows];
                            updatedRows[index].notes = newNotes;
                            setRows(updatedRows);
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      />
                      <TableCell align="center">
                        {
                          row.triagedBy?.name ? 
                            row.triagedBy?.name.indexOf(' ') === -1 ? 
                              row.triagedBy?.name[0] : 
                                `${row.triagedBy.name?.split(' ')[0][0]}${row.triagedBy.name?.split(' ')[1][0]}`
                            : ''
                        }
                      </TableCell>
                      <TableCell align="center">{row.doctor}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
