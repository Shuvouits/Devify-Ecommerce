<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset your Devify password</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7fb; font-family:Inter, Arial, Helvetica, sans-serif; color:#1f2937;">

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f7fb; margin:0; padding:32px 0;">
        <tr>
            <td align="center">

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e5e7eb;">

                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%); padding:28px 32px;">

                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="left" style="vertical-align:middle;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="width:42px; height:42px; background:#ffffff; border-radius:12px; text-align:center; font-size:22px; font-weight:800; color:#2563eb;">
                                                    D
                                                </td>

                                                <td style="padding-left:12px; vertical-align:middle;">
                                                    <div style="font-size:24px; line-height:28px; font-weight:800; color:#ffffff;">
                                                        Devify
                                                    </div>

                                                    <div style="font-size:12px; line-height:16px; color:rgba(255,255,255,0.82); margin-top:2px;">
                                                        E-commerce Platform
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:36px 32px 28px 32px;">

                            <div style="font-size:28px; line-height:34px; font-weight:800; color:#111827; margin-bottom:12px;">
                                Reset your password
                            </div>

                            <div style="font-size:15px; line-height:24px; color:#4b5563; margin-bottom:22px;">
                                Hello {{ $name ?: 'there' }},
                            </div>

                            <div style="font-size:15px; line-height:24px; color:#4b5563; margin-bottom:22px;">
                                We received a request to reset the password for your <strong>Devify</strong> account linked to:
                            </div>

                            <div style="display:inline-block; padding:10px 14px; background:#f3f6fb; border:1px solid #e5e7eb; border-radius:10px; font-size:14px; line-height:20px; color:#111827; margin-bottom:24px;">
                                {{ $email }}
                            </div>

                            <div style="font-size:15px; line-height:24px; color:#4b5563; margin-bottom:28px;">
                                Click the button below to create a new password. For security reasons, this link will expire automatically after a limited time.
                            </div>

                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                                <tr>
                                    <td align="center" bgcolor="#2563eb" style="border-radius:10px;">
                                        <a href="{{ $resetUrl }}"
                                           style="display:inline-block; padding:14px 26px; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:10px;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <div style="font-size:14px; line-height:22px; color:#6b7280; margin-bottom:14px;">
                                If the button above does not work, copy and paste this link into your browser:
                            </div>

                            <div style="word-break:break-all; font-size:13px; line-height:22px; color:#2563eb; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; padding:12px 14px; margin-bottom:24px;">
                                <a href="{{ $resetUrl }}" style="color:#2563eb; text-decoration:none;">
                                    {{ $resetUrl }}
                                </a>
                            </div>

                            <div style="border-top:1px solid #e5e7eb; margin:8px 0 22px 0;"></div>

                            <div style="font-size:14px; line-height:22px; color:#4b5563; margin-bottom:12px;">
                                If you did not request a password reset, you can safely ignore this email. Your account will remain secure.
                            </div>

                            <div style="font-size:14px; line-height:22px; color:#4b5563;">
                                Need help? Contact us at
                                <a href="mailto:{{ $supportEmail }}" style="color:#2563eb; text-decoration:none;">
                                    {{ $supportEmail }}
                                </a>.
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f9fafb; border-top:1px solid #e5e7eb; padding:22px 32px;">
                            <div style="font-size:12px; line-height:18px; color:#6b7280; text-align:center;">
                                © {{ date('Y') }} Devify. All rights reserved.
                            </div>

                            <div style="font-size:12px; line-height:18px; color:#9ca3af; text-align:center; margin-top:6px;">
                                This email was sent automatically from the Devify platform.
                            </div>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
