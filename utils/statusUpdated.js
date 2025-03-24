const statusUpdatedTemplate = (name, complaintId, problem, status) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h2 style="color: #28a745;">Complaint Status Updated</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your complaint status has been updated.</p>

        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
                <th>Complaint ID</th>
                <th>Issue</th>
                <th>New Status</th>
            </tr>
            <tr>
                <td>${complaintId}</td>
                <td>${problem}</td>
                <td style="color: green;"><b>${status}</b></td>
            </tr>
        </table>

        <p>Thank you for your patience.</p>
        <br/>
        <p>Best regards,<br/><strong>Support Team</strong></p>
    </div>
`;

module.exports = statusUpdatedTemplate;
