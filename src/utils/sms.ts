
export const sendOTP = async (phone: string, code: string) => {
    const response = await fetch(process.env.HTTP_SMS_API_URL as string, {
      method: "POST",
      headers: {
        "x-api-Key": process.env.HTTP_SMS_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `Your Jibli verification code is ${code}. It will expire in 5 minutes. Please do not share this code with anyone.`,
        encrypted: false,
        from: process.env.HTTP_SMS_PHONE_NUMBER as string,
        request_id: crypto.randomUUID(),
        send_at: new Date(),
        to: phone,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to send SMS");
    }
    console.log("OTP sent successfully:", data);

};