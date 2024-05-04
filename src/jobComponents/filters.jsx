import React, { useState } from 'react';
import { Box, Container, TextField, MenuItem } from '@mui/material';


const Filters = ({ filters, setFilters }) => {
  // Define available filters here
  const filterOptions = [
    // Predefined filter options for job listings.
    { key: 'jobRole', name: 'Roles' },
    { key: 'location', name: 'Location' },
    { key: 'minExp', name: 'Min Experience' },
    { key: 'workType', name: 'Work Type' },
    { key: 'minJdSalary', name: 'Minimum base Pay' },
    { key: 'companyName', name: 'Company Name' },
    // Add more filters as needed
  ];

  // State to track the currently selected filter
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterTypeChange = (event) => {
    const newFilterType = event.target.value;
    setSelectedFilter(newFilterType);

    // Reset the corresponding filter value when changing the filter type
    setFilters({
      ...filters,
      [newFilterType]: ''
    });
  };

  const handleFilterValueChange = (event) => {
    // Update the value for the currently selected filter
    setFilters({
      ...filters,
      [selectedFilter]: event.target.value
    });
  };

  return (
    <Container sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center', width: '80%' }}>
      {filterOptions.map((option) => (
        <Box key={option.key} sx={{ width: '15%', mr: 1 }}>
          <Box sx={{ mb: 2 }}>
            {option.key === 'companyName' ? (
              <TextField
                fullWidth
                value={filters.companyName || ''}
                onChange={(event) => setFilters({ ...filters, companyName: event.target.value })}
                label={option.name}
                variant="outlined"
              />
            ) : (
              <TextField
                select
                fullWidth
                value={selectedFilter}
                onChange={handleFilterTypeChange}
                label={option.name}
                variant="outlined"
              >
                <MenuItem value={option.key}>{option.name}</MenuItem>
              </TextField>
            )}
          </Box>
        </Box>
      ))}
    </Container>
  );
};

export default Filters;
