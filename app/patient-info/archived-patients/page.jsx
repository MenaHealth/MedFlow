// app/patient-info/archived-patients/page.jsx
"use client";

import * as React from 'react';
import { useEffect, useState, useMemo } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function ArchivedPatients() {
  const { data: session, status } = useSession();
  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    const fetchArchivedPatients = async () => {
      try {
        const response = await fetch("/api/patient?status=Archived"); // Fetch only Archived patients
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.log('Error fetching archived patients:', error);
      }
    };

    fetchArchivedPatients();
  }, []);

  const handlePatientClick = (patientId) => {
    // Add your logic to handle patient click
  };

  return (
    <div className="w-full relative dashboard-page">
      <h2 className="text-center font-bold" style={{ fontSize: "24px" }}>
        <span className="blue_gradient">Archived Patient List</span>
      </h2>

      <TableContainer component={Paper} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="MuiTableHead-root">
            <TableRow>
              <TableCell align="left">Patient ID</TableCell>
              <TableCell align="center">Last Name</TableCell>
              <TableCell align="center">Age</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Language Spoken</TableCell>
              <TableCell align="center">Chief Complaint</TableCell>
              <TableCell align="center">Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row._id}</TableCell>
                <TableCell align="center">{row.lastName}</TableCell>
                <TableCell align="center">{row.age}</TableCell>
                <TableCell align="center">{row.city}, {row.country}</TableCell>
                <TableCell align="center">{row.language}</TableCell>
                <TableCell align="center">{row.chiefComplaint}</TableCell>
                <TableCell align="center">{row.createdAt ? new Date(row.createdAt).toLocaleString() : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
