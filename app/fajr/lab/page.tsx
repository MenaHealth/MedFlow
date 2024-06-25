import { DataGrid, GridRowsProp, GridColDef, GridRowModel } from '@mui/x-data-grid';
import React from 'react';



const rows: GridRowsProp = [
  { id: 'date', 'Lab': 'date', '1': '6/11' },
  { id: 'temp', 'Lab': 'temp', '1': '98.6' },
  { id: 'bloodPressure', 'Lab': 'bloodPressure', '1': '120/80' },
  { id: 'hba1c', 'Lab': 'hba1c', '1': '5.7' },
  { id: 'albumin', 'Lab': 'albumin', '1': '4.0' },
  { id: 'sProtein', 'Lab': 'sProtein', '1': '7.0' },
  { id: 'crp', 'Lab': 'crp', '1': '0.5' },
  { id: 'esr', 'Lab': 'esr', '1': '10' },
  { id: 'hgbHct', 'Lab': 'hgbHct', '1': '14/42' },
  { id: 'wbc', 'Lab': 'wbc', '1': '5.0' },
  { id: 'platelets', 'Lab': 'platelets', '1': '150' },
  { id: 'pt', 'Lab': 'pt', '1': '12' },
  { id: 'ptt', 'Lab': 'ptt', '1': '30' },
  { id: 'inr', 'Lab': 'inr', '1': '1.0' },
  { id: 'alkPhos', 'Lab': 'alkPhos', '1': '100' },
  { id: 'ast', 'Lab': 'ast', '1': '20' },
  { id: 'alt', 'Lab': 'alt', '1': '15' },
  { id: 'typeScreen', 'Lab': 'typeScreen', '1': 'Negative' },
  { id: 'covidTest', 'Lab': 'covidTest', '1': 'Negative' },
  ];
  const columns: GridColDef[] = [
  { field: 'Lab', headerName: 'Lab', width: 300 },
  { field: 'Ref', headerName: 'Ref', width: 300 },
  { field: '1', headerName: 'Visit 1', width: 100, editable: true},
  { field: '2', headerName: 'Visit 2', width: 100, editable: true },
  { field: '3', headerName: 'Visit 3', width: 100, editable: true },
  { field: '4', headerName: 'Visit 4', width: 100, editable: true },
  { field: '5', headerName: 'Visit 5', width: 100, editable: true },
  ];

  // add unit dropdown
  // add reference range
  // formatting 


export default function App() {

  const processRowUpdate =  async (newRow: GridRowModel, oldRow: GridRowModel) => {
      'use server'
      console.log(JSON.stringify(oldRow));
      console.log(JSON.stringify(newRow));
      return
    };

  return (
    <div style={{ width: '100%' }} className='bg-white'>
      <DataGrid rows={rows} columns={columns} processRowUpdate={processRowUpdate} 
      initialState={{
    density: 'compact',
      }}
      disableColumnSorting={true}
      disableColumnMenu={true}
      // autosizeOnMount={true}
      // hide footer
      hideFooter={true}
      rowCount={100}
      />
    </div>
  );
}