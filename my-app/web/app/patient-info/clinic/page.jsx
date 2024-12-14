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
} from "@/components/ui/dropdownMenu";
import { useSession } from 'next-auth/react';
import { CLINICS, PATIENT_STATUSES } from '@/data/data';

export default function ClinicTable() {

  const { data: session } = useSession();

  const [rows, setRows] = React.useState([]);
  const [currentClinic, setCurrentClinic] = React.useState(CLINICS[0]);
  const [assignedDocId, setAssignedDocId] = React.useState(null);

  const fetchRows = async () => {
    try {
      const response = await fetch('/api/patient/');
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRows();
  }, []);

  useEffect(() => {
    setAssignedDocId(session?.user?.id);
    // set current clinic from url search params
    const urlParams = new URLSearchParams(window.location.search);
    const clinic = urlParams.get('clinic');
    if (clinic) {
      setCurrentClinic(clinic);
    }
  }, [session?.user]);

  return (
    <>
      <h2 className='head_text_2 text-left'>
        <span className='blue_gradient'>Patients in {currentClinic} Clinic</span>
      </h2>
      <div className='my-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="black_btn">{currentClinic}</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={currentClinic} onValueChange={async (value) => {
              setCurrentClinic(value);
              const url = new URL(window.location);
              url.searchParams.set('clinic', value);
              window.history.pushState({}, '', url);
            }
            }>
              {CLINICS.map((clinic) => (
                <DropdownMenuRadioItem key={clinic} value={clinic}>{clinic}</DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TableContainer component={Paper} className="my-2">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Coordinator</TableCell>
              <TableCell align="center">Clinic</TableCell>
              <TableCell align="center">Doctor</TableCell>
              <TableCell align="center">Admitted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.filter((row) => {return row.assignedClinic === currentClinic && row.assignedDocId == null}).map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">{row.status}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={row.status} onValueChange={async (value) => {
                        try {
                          await fetch('/api/patient/', {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              _id: row._id,
                              status: value,
                            }),
                          });
                          const updatedRows = [...rows];
                          const rowIndex = updatedRows.findIndex((r) => r._id === row._id);
                          updatedRows[rowIndex].status = value;
                          setRows(updatedRows);
                        } catch (error) {
                          console.log(error);
                        }
                      }}>
                        {PATIENT_STATUSES.map((status) => (
                          <DropdownMenuRadioItem key={status} value={status}>{status}</DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell align="center">{row.coordinatorId?.name}</TableCell>
                <TableCell align="center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">{row.assignedClinic}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={row.assignedClinic} onValueChange={async (value) => {
                        try {
                          await fetch('/api/patient/', {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              _id: row._id,
                              assignedClinic: value,
                            }),
                          });
                          const updatedRows = [...rows];
                          const rowIndex = updatedRows.findIndex((r) => r._id === row._id);
                          updatedRows[rowIndex].assignedClinic = value;
                          setRows(updatedRows);
                        } catch (error) {
                          console.log(error);
                        }
                      }}>
                        {CLINICS.map((clinic) => (
                          <DropdownMenuRadioItem key={clinic} value={clinic}>{clinic}</DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell align="center">
                  {row.assignedDocId?.name ? row.assignedDocId?.name : (
                    <Button variant="outline" onClick={async () => {
                      try {
                        const response = await fetch('/api/patient/', {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            _id: row._id,
                            assignedDocId: assignedDocId,
                          }),
                        });
                        const docInfo = await response.json();
                        const updatedRows = [...rows];
                        const rowIndex = updatedRows.findIndex((r) => r._id === row._id);
                        updatedRows[rowIndex].assignedDocId = docInfo;
                        setRows(updatedRows);
                      } catch (error) {
                        console.log(error);
                      }
                    }}>Take Case</Button>
                  )}
                </TableCell>
                <TableCell align="center">{new Date(row.admittedDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
