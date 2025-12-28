/**
 * Email templates for referral program notifications
 */

export function getReferralSignupEmail(referrerName: string, friendName: string): { subject: string; html: string } {
  return {
    subject: "🎉 Your friend just signed up with your referral code!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Friend Signed Up!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f4ef;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f4ef; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1E3A5F 0%, #C9A961 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Great News, ${referrerName}!</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <div style="display: inline-block; width: 80px; height: 80px; background-color: #C9A961; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px;">🎉</span>
                      </div>
                    </div>
                    
                    <h2 style="color: #1E3A5F; font-size: 24px; margin: 0 0 20px 0; text-align: center;">Your Friend Just Signed Up!</h2>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      <strong>${friendName}</strong> just used your referral code to create an OptiBio account. You're one step closer to earning your $10 credit!
                    </p>
                    
                    <div style="background-color: #f7f4ef; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <h3 style="color: #1E3A5F; font-size: 18px; margin: 0 0 10px 0;">What happens next?</h3>
                      <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">
                        When ${friendName} completes their first purchase, you'll automatically receive <strong style="color: #C9A961;">$10 in referral credits</strong> to use on your next order. We'll send you another email as soon as that happens!
                      </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                      Keep sharing your referral code to earn more credits. There's no limit!
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                      OptiBio - Premium KSM-66® Ashwagandha<br>
                      Science-Backed Wellness
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
}

export function getReferralEarnedEmail(referrerName: string, friendName: string, creditAmount: number): { subject: string; html: string } {
  return {
    subject: "💰 You earned $10 in referral credits!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You Earned Credits!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f4ef;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f4ef; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #C9A961 0%, #1E3A5F 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Congratulations!</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <div style="display: inline-block; width: 100px; height: 100px; background-color: #C9A961; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 50px;">💰</span>
                      </div>
                    </div>
                    
                    <h2 style="color: #1E3A5F; font-size: 28px; margin: 0 0 20px 0; text-align: center;">You Earned $${(creditAmount / 100).toFixed(2)}!</h2>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                      <strong>${friendName}</strong> just completed their first purchase using your referral code. Your $${(creditAmount / 100).toFixed(2)} credit has been added to your account!
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #f7f4ef 0%, #ffffff 100%); border: 2px solid #C9A961; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">Your Available Credits</p>
                      <p style="color: #C9A961; font-size: 42px; font-weight: bold; margin: 0;">$${(creditAmount / 100).toFixed(2)}</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.VITE_FRONTEND_FORGE_API_URL || 'http://localhost:3000'}/shop" style="display: inline-block; background: linear-gradient(135deg, #1E3A5F 0%, #C9A961 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Shop Now & Use Your Credits
                      </a>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                      Your credits never expire and can be used on any future order. Keep referring friends to earn even more!
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                      OptiBio - Premium KSM-66® Ashwagandha<br>
                      Science-Backed Wellness
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
}

export function getReferralReminderEmail(referrerName: string, referralCode: string, availableCredits: number): { subject: string; html: string } {
  return {
    subject: "💎 Don't forget your referral credits!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Referral Reminder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f4ef;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f4ef; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1E3A5F 0%, #C9A961 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Share & Earn More!</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hi ${referrerName},
                    </p>
                    
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      We noticed you haven't shared your referral code in a while. You're missing out on free OptiBio!
                    </p>
                    
                    ${availableCredits > 0 ? `
                    <div style="background: linear-gradient(135deg, #f7f4ef 0%, #ffffff 100%); border: 2px solid #C9A961; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">You currently have</p>
                      <p style="color: #C9A961; font-size: 32px; font-weight: bold; margin: 0;">$${(availableCredits / 100).toFixed(2)}</p>
                      <p style="color: #64748b; font-size: 14px; margin: 10px 0 0 0;">in unused credits!</p>
                    </div>
                    ` : ''}
                    
                    <div style="background-color: #f7f4ef; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <h3 style="color: #1E3A5F; font-size: 18px; margin: 0 0 15px 0; text-align: center;">Your Referral Code</h3>
                      <div style="background-color: #ffffff; border: 2px dashed #C9A961; border-radius: 8px; padding: 15px; text-align: center;">
                        <code style="color: #1E3A5F; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${referralCode}</code>
                      </div>
                    </div>
                    
                    <div style="background-color: #f8fafc; border-left: 4px solid #C9A961; padding: 20px; margin: 30px 0;">
                      <h4 style="color: #1E3A5F; font-size: 16px; margin: 0 0 10px 0;">How it works:</h4>
                      <ul style="color: #64748b; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                        <li>Share your code with friends & family</li>
                        <li>They get 10% off their first order</li>
                        <li>You get $10 credit when they purchase</li>
                        <li>No limit on how much you can earn!</li>
                      </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.VITE_FRONTEND_FORGE_API_URL || 'http://localhost:3000'}/referral" style="display: inline-block; background: linear-gradient(135deg, #1E3A5F 0%, #C9A961 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        View Referral Dashboard
                      </a>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                      OptiBio - Premium KSM-66® Ashwagandha<br>
                      Science-Backed Wellness
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
}
