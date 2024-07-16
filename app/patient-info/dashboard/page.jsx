// app/patient-info/dashboard/page.jsx
"use client";

import * as React from 'react';
import { useEffect } from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Paper from '@mui/material/Paper';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { CLINICS, PRIORITIES, SPECIALTIES } from '@/data/data';
import Link from 'next/link';

export default function PatientTriage() {

  const [rows, setRows] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [sortOrder, setSortOrder] = React.useState('newest');
  const [prioritySort, setPrioritySort] = React.useState('all');

  const fetchRows = async () => {
    try {
      const response = await fetch('/api/patient/');
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user/');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  const sortAndFilterRows = (rows, dateOrder, priorityFilter) => {
    let sortedRows = [...rows].sort((a, b) => {
      const dateA = new Date(a.surgeryDate);
      const dateB = new Date(b.surgeryDate);
      return dateOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    if (priorityFilter !== 'all') {
      sortedRows = sortedRows.filter(row => row.priority === priorityFilter);
    }

    return sortedRows;
  };

  useEffect(() => {
    const fetchAndSortRows = async () => {
      try {
        const response = await fetch('/api/patient/');
        const data = await response.json();
        const sortedAndFilteredData = sortAndFilterRows(data, sortOrder, prioritySort);
        setRows(sortedAndFilteredData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAndSortRows();
    fetchUsers();
  }, [sortOrder, prioritySort]);

  return (
      <>
        <div className="w-full relative">
          <div className="flex justify-between items-center py-3">
            <Link href="/fajr/patient" className="flex items-center justify-center no-underline">
              <PersonAddIcon
                  className="text-5xl rounded-full shadow p-3 bg-white hover:shadow-lg transition-shadow duration-300"
                  style={{
                    color: 'currentColor',
                    transition: 'color 0.15s ease-in-out',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#FF5722'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'currentColor'}
              />
            </Link>
            <h2 className='flex-1 text-center font-bold' style={{ fontSize: '24px' }}> {/* Adjusted font size and added bold */}
              <span className='blue_gradient'>Patient List</span>
            </h2>
            <div style={{ width: 48 }}> {/* Placeholder to balance the header visually */}</div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {sortOrder !== 'newest' && (
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Date: {sortOrder === 'oldest' ? 'Oldest first' : 'Newest first'}
                </div>
            )}
            {prioritySort !== 'all' && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  Priority: {prioritySort}
                </div>
            )}
          </div>
          <TableContainer component={Paper}>

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Patient ID</TableCell>
              <TableCell align="center">Laterality</TableCell>
              <TableCell align="center">Diagnosis</TableCell>
              <TableCell align="center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-full justify-start">
                      Priority
                      <KeyboardArrowDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={prioritySort} onValueChange={setPrioritySort}>
                      <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                      {PRIORITIES.map((priority) => (
                          <DropdownMenuRadioItem key={priority} value={priority}>{priority}</DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell align="center">Hospital</TableCell>
              <TableCell align="center">Specialty</TableCell>
              <TableCell align="center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-full justify-start">
                      Surgery Date
                      <KeyboardArrowDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                      <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">
                  <Link href={`/patient-overview/${row._id}`}>{row.patientId}</Link>
                </TableCell>
                <TableCell align="center">{row.laterality}</TableCell>
                <TableCell align="center">{row.diagnosis}</TableCell>

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

                <TableCell align="center">{row.hospital}</TableCell>

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
                <TableCell align="center">{new Date(row.surgeryDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    </>
  );
}
