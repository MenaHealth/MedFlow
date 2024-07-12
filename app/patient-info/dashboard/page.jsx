// app/patient-info/dashboard/page.jsx
"use client";

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect } from "react";
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

  useEffect(() => {
    fetchRows();
    fetchUsers();
  }, []);

  return (
    <>
    <div className="w-full">
      <h2 className='head_text_2 text-center py-3'>
        <span className='blue_gradient'>Patient List</span>
      </h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Patient ID</TableCell>
              <TableCell align="center">Laterality</TableCell>
              <TableCell align="center">Diagnosis</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Hospital</TableCell>
              <TableCell align="center">Specialty</TableCell>
              <TableCell align="center">Surgery Date</TableCell>
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
