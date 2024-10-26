import { Admin } from '~/server/db/databaseClasses/Admin';
import {OrgRequest} from '~/server/db/databaseClasses/OrgRequest';
import sgMail from '@sendgrid/mail';
import { ApprovalStatus, AdminType } from '~/server/db/interfaces/enums';

const sendGridApiKey = process.env.SENDGRID_API_KEY;
if (!sendGridApiKey) {
    throw new Error('SENDGRID_API_KEY is not defined');
}
sgMail.setApiKey(sendGridApiKey);

async function sendPendingRequestsEmail(){
    try{
        const pendingRequests = await OrgRequest.fetchByApprovalStatus(ApprovalStatus.Pending);

        if(!pendingRequests || pendingRequests.length === 0){
            console.log('No pending requests found');
            return;
        }

        //Fetch superadmin email
        const superAdmins = await Admin.fetchAdminsByType(AdminType.SuperAdmin);
        if(!superAdmins || superAdmins.length === 0){
            console.log('No superadmins found');
            return;
        }
        const superAdmin = superAdmins?.[0];
        const superAdminEmail = superAdmin?.email;

        if (!superAdminEmail) {
            console.log('Superadmin email not found');
            return;
        }

        //Prepare email content
        //Add link to vercel
        const requestList = pendingRequests.map(request => `Organisation: ${request.name}, Email: ${request.email}, Phone Number: ${request.phoneNo}`).join('\n');
        const emailContent = `
        <h1>Pending Requests</h1>
        <p>The following organisations have requested to join the platform:</p>
        <ul>${requestList}</ul>
        <p>Please review and approve these requests.</p>
        `;

        // Send email
        const msg ={
            to: superAdminEmail,
            from: 'peeper.tracking@gmail.com',
            subject: 'Pending Organisation Requests',
            text: emailContent,
        }

        await sgMail.send(msg);
        console.log('Email sent successully to superadmin');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

void sendPendingRequestsEmail();

/**
 * TODO:
 * Add your SendGrid API key to your GitHub repository secrets:
 * Go to your repository on GitHub.
 * Click on "Settings" > "Secrets and variables" > "Actions".
 * Click "New repository secret".
 * Name it SENDGRID_API_KEY and paste your SendGrid API key.
 */