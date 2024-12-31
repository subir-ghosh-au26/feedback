import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
 const [feedbackData, setFeedbackData] = useState([]);
 const [filteredFeedback, setFilteredFeedback] = useState([]);
 const [filterOptions, setFilterOptions] = useState({
   batch: "",
   overallFeedback: "",
   startDate: "",
   endDate: "",
 });
 const navigate = useNavigate();
 const [chartData, setChartData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
   if (!token) {
    navigate("/admin/login");
   }else{
    fetchFeedbackData();
   }
  },[navigate, token]);


  const handleLogout = () => {
   localStorage.removeItem('token');
    navigate("/admin/login");
  }


 const fetchFeedbackData = async () => {
   try {
     const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/feedback`);
     setFeedbackData(response.data);
     setFilteredFeedback(response.data);
   } catch (error) {
     console.error("Error fetching feedback data:", error);
   }
 };

 const handleFilterChange = (e) => {
   const { name, value } = e.target;
   setFilterOptions({ ...filterOptions, [name]: value });
 };

 const applyFilters = () => {
   let filteredData = [...feedbackData];

   if (filterOptions.batch) {
     filteredData = filteredData.filter(
       (item) => item.batch === filterOptions.batch
     );
   }

   if (filterOptions.overallFeedback) {
     filteredData = filteredData.filter(
       (item) => item.overallFeedback === filterOptions.overallFeedback
     );
   }
   if (filterOptions.startDate && filterOptions.endDate) {
       const startDate = new Date(filterOptions.startDate).getTime();
       const endDate = new Date(filterOptions.endDate).getTime();
       filteredData = filteredData.filter((item) => {
         const feedbackDate = new Date(item.createdAt).getTime();
         return feedbackDate >= startDate && feedbackDate <= endDate;
       });
     }else if(filterOptions.startDate){
        const startDate = new Date(filterOptions.startDate).getTime();
        filteredData = filteredData.filter((item) => {
          const feedbackDate = new Date(item.createdAt).getTime();
         return feedbackDate >= startDate;
        });
     }else if(filterOptions.endDate){
      const endDate = new Date(filterOptions.endDate).getTime();
        filteredData = filteredData.filter((item) => {
          const feedbackDate = new Date(item.createdAt).getTime();
          return feedbackDate <= endDate;
        });
     }
   setFilteredFeedback(filteredData);
    generateChart(filteredData);
 };

   const generateChart = (data) => {
   const feedbackCounts = {
     Excellent: 0,
     Good: 0,
     Average: 0,
     Bad: 0,
   };
   data.forEach((item) => {
     feedbackCounts[item.overallFeedback]++;
   });

   const chart = {
       labels: Object.keys(feedbackCounts),
       datasets: [
         {
           label: 'Feedback Distribution',
           data: Object.values(feedbackCounts),
           backgroundColor: [
             'rgba(75, 192, 192, 0.6)',
             'rgba(54, 162, 235, 0.6)',
             'rgba(255, 206, 86, 0.6)',
             'rgba(255, 99, 132, 0.6)',
           ],
           borderColor: [
             'rgba(75, 192, 192, 1)',
             'rgba(54, 162, 235, 1)',
             'rgba(255, 206, 86, 1)',
             'rgba(255, 99, 132, 1)',
           ],
           borderWidth: 1,
         },
       ],
    }
    setChartData(chart)
  }

  const handleDownloadReport = () => {
   const csvData = [
     ["Name", "Mobile Number", "Batch", "Overall Feedback", "Comments", "Date"],
     ...filteredFeedback.map((item) => [
       item.name,
       item.mobileNumber,
       item.batch,
       item.overallFeedback,
       item.comments,
        new Date(item.createdAt).toLocaleString()
     ]),
   ];
   const csvString = csvData.map((row) => row.join(",")).join("\n");
   const blob = new Blob([csvString], { type: "text/csv" });
   const url = URL.createObjectURL(blob);
   const link = document.createElement("a");
   link.href = url;
   link.download = "feedback_report.csv";
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
   URL.revokeObjectURL(url);
};

useEffect(() => {
  if (feedbackData && feedbackData.length > 0) {
       generateChart(feedbackData);
     }
   },[feedbackData]);

 return (
   <div className="admin-panel-container">
     <h2>Admin Panel</h2>
     <button onClick={handleLogout} >Logout</button>
      <div className="filter-section">
       <h3>Filter Feedback</h3>
         <div>
         <label>Batch:</label>
           <select
             name="batch"
             value={filterOptions.batch}
             onChange={handleFilterChange}
           >
             <option value="">All</option>
             <option value="Batch A">Batch A</option>
             <option value="Batch B">Batch B</option>
             <option value="Batch C">Batch C</option>
             <option value="Batch D">Batch D</option>
             <option value="Batch E">Batch E</option>
             <option value="Batch F">Batch F</option>
            </select>
         </div>
        <div>
           <label>Overall Feedback:</label>
           <select
             name="overallFeedback"
             value={filterOptions.overallFeedback}
             onChange={handleFilterChange}
           >
             <option value="">All</option>
             <option value="Excellent">Excellent</option>
             <option value="Good">Good</option>
             <option value="Average">Average</option>
             <option value="Bad">Bad</option>
           </select>
         </div>
        <div>
         <label>Start Date:</label>
         <input
          type="date"
          name="startDate"
          value={filterOptions.startDate}
          onChange={handleFilterChange}
         />
        </div>
       <div>
         <label>End Date:</label>
         <input
          type="date"
          name="endDate"
          value={filterOptions.endDate}
          onChange={handleFilterChange}
         />
        </div>
       <button onClick={applyFilters}>Apply Filters</button>
     </div>
       {chartData && (
        <div className="chart-container">
           <Bar data={chartData} />
        </div>
     )}
     <div className="table-section">
       <h3>Feedback Report</h3>
       <table>
         <thead>
           <tr>
             <th>Name</th>
             <th>Mobile Number</th>
             <th>Batch</th>
             <th>Overall Feedback</th>
             <th>Comments</th>
             <th>Image</th>
             <th>Date</th>
           </tr>
         </thead>
         <tbody>
           {filteredFeedback.map((item) => (
             <tr key={item._id}>
               <td>{item.name}</td>
               <td>{item.mobileNumber}</td>
               <td>{item.batch}</td>
               <td>{item.overallFeedback}</td>
               <td>{item.comments}</td>
               <td>
                {item.imageURL && (
                <img
                    src={item.imageURL}
                    alt="feedback"
                    style={{ width: "50px", height: "50px" }}
                  />
                 )}
              </td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
             </tr>
           ))}
         </tbody>
       </table>
      </div>
      <button onClick={handleDownloadReport}>Download Report</button>
   </div>
 );
};
export default AdminPanel;
