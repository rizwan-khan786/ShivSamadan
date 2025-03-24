const complaintSubmittedTemplate = (name, complaintId, problem) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h2 style="color: #007bff;">Complaint Submitted Successfully</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your complaint has been submitted successfully.</p>

        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
                <th>Complaint ID</th>
                <th>Issue</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>${complaintId}</td>
                <td>${problem}</td>
                <td style="color: red;"><b>Pending</b></td>
            </tr>
        </table>

        <p>We will update you as soon as there is progress on your complaint.</p>
        <br/>
        <p>Thank you,<br/><strong>Support Team</strong></p>
    </div>
`;

module.exports = complaintSubmittedTemplate;
