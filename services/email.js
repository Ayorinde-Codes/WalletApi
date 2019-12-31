require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SendGridApiKey); 
sgMail.setSubstitutionWrappers("{{", "}}");
function sendEmail(data) {

    const msg = {
    to: data.receiver,
    from: 'noreply@transroute.co',
    reply_to: 'noreply@transroute.co',
    subject: data.subject,
    templateId: data.template_Id,
    dynamic_template_data: 
    {
        firstname: data.name,
        otp: data.token,
        lastname:data.lastname,
        email:data.email,
        amount:data.amount,
        bank:data.bank,
        account_name:data.account_name,
        account_number:data.account_number,
        transaction_id:data.reference,
        date_initiated:data.date_initiated,
        remarks:data.remarks
    }
    };
   
     sgMail.send(msg, (error, result) => {
         
       if (error) {
           console.log(error);
       } else {
           console.log("Email sent!");
       }
     });
 }
 exports.sendEmail = sendEmail;