// module.exports = (departmentName, complaintId, problem) => {
//     return `
//         <h2>New Complaint Assigned</h2>
//         <p>Dear ${departmentName},</p>
//         <p>A new complaint has been assigned to your department.</p>
//         <p><strong>Complaint ID:</strong> ${complaintId}</p>
//         <p><strong>Problem:</strong> ${problem}</p>
//         <p>Please take necessary action.</p>
//         <br>
//         <p>Thank you.</p>
//     `;
// };

module.exports = (departmentName, complaintId, problem, name, mobileNo, emailid, address, village, taluka, district) => {
    return `
        <h2>New Complaint Assigned</h2>
        <p>Dear ${departmentName},</p>
        <p>A new complaint has been assigned to your department. Please find the details below:</p>

        <h3>Complaint Details:</h3>
        <p><strong>Complaint ID:</strong> ${complaintId}</p>
        <p><strong>Problem:</strong> ${problem}</p>
        <p><strong>Complainant:</strong> ${name}</p>
        <p><strong>Contact:</strong> ${mobileNo}, ${emailid}</p>
        <p><strong>Address:</strong> ${address}, ${village}, ${taluka}, ${district}</p>

        <h3>Complaint Summary</h3>
        <table border="1" cellspacing="0" cellpadding="10" style="border-collapse: collapse; width: 100%;">
            <tr>
                <th style="background-color: #f2f2f2; text-align: left;">Complaint ID</th>
                <td>${complaintId}</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2; text-align: left;">Problem</th>
                <td>${problem}</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2; text-align: left;">Complainant</th>
                <td>${name}</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2; text-align: left;">Mobile No</th>
                <td>${mobileNo}</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2; text-align: left;">Email</th>
                <td>${emailid}</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2; text-align: left;">Address</th>
                <td>${address}, ${village}, ${taluka}, ${district}</td>
            </tr>
        </table>

        <p>Please take necessary action at the earliest.</p>
        <br>
        <p>Thank you.</p>
    `;
};

