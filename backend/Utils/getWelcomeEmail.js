const getWelcomeEmail = (name) => {
  return `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; background-color: #f8f9fa; padding: 30px;">
    
    <!-- Email Container -->
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #d32f2f; padding: 30px; text-align: center; color: #fff;">
        <img src="cid:bloodDropImage" alt="Blood Drop" style="width:80px; height:auto; margin-bottom: 15px;"/>
        <h1 style="margin: 0; font-size: 28px;">Welcome to BloodCare, ${name}!</h1>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px; line-height: 1.6; font-size: 16px;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for registering on <strong>BloodCare</strong>! We’re thrilled to have you join our community of lifesavers.</p>
        <p>With BloodCare, you can easily <strong>donate, receive, and track blood donations</strong> across your province and city.</p>
        
        <!-- Call-to-Action Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://your-bloodcare-app.com" 
             style="background-color: #d32f2f; color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: bold; display: inline-block;">
            Visit BloodCare
          </a>
        </div>

        <p>Stay healthy and continue saving lives!</p>
        <p>❤️ The BloodCare Team</p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} BloodCare. All rights reserved.
      </div>

    </div>
  </div>
  `;
};

export default getWelcomeEmail;