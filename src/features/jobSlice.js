import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async ({ offset, filters }, { getState }) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const body = JSON.stringify({
            "limit": 10,
            "offset": offset,
            ...filters
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body
        };

        const apiUrl = process.env.REACT_APP_API_BASE;
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();
        return data.jdList;
    }
);

const initialState = {
    allJobs: [],
    visibleJobs: [],
    isLoading: false,
    hasMore: true,
    filter: {
        numberOfEmployees: null,
        jobRole: '',
        minExp: null,
        minJdSalary: null,
        workType: '',
        companyName: ''
    }
};

const applyFilters = (jobs, filter) => {
    const { numberOfEmployees, jobRole, minExp, minJdSalary, workType, companyName } = filter;
    return jobs.filter(job => {
        const numberOfEmployeesMatches = numberOfEmployees ? job.numberOfEmployees === numberOfEmployees : true;
        const jobRoleMatches = job.jobRole.toLowerCase().includes(jobRole.toLowerCase());
        const minExpMatches = minExp ? job.minExp >= minExp : true;
        const minSalaryMatches = minJdSalary ? job.minJdSalary >= minJdSalary : true;
        const nameOfCompanyMatches = job.companyName.toLowerCase().includes(companyName.toLowerCase());
        let workTypeMatches = true;
        if (workType === 'remote') {
            workTypeMatches = job.location.toLowerCase() === 'remote';
        } else if (workType === 'onsite') {
            workTypeMatches = job.location.toLowerCase() !== 'remote';
        }
        return numberOfEmployeesMatches && jobRoleMatches && minExpMatches && minSalaryMatches && workTypeMatches && nameOfCompanyMatches;
    });
};

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setFilteredJobs: (state, action) => {
            state.filter = { ...action.payload };
            state.visibleJobs = applyFilters(state.allJobs, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.allJobs = [...state.allJobs, ...action.payload];
                state.visibleJobs = applyFilters(state.allJobs, state.filter);
                state.hasMore = action.payload.length > 0;
                state.isLoading = false;
            })
            .addCase(fetchJobs.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setFilteredJobs } = jobsSlice.actions;
export default jobsSlice.reducer;

