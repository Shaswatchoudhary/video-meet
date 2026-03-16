import PaytmChecksum from 'paytmchecksum';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const mkey = process.env.PAYTM_MERCHANT_KEY?.trim();

async function test(mid, website, channel, industry) {
    const orderId = "ORD" + Date.now();
    const bodyObj = {
        requestType: "Payment",
        mid: mid,
        websiteName: website,
        orderId: orderId,
        callbackUrl: `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`,
        txnAmount: {
            value: "1.00",
            currency: "INR",
        },
        userInfo: {
            custId: "CUST123",
        },
        channelId: channel,
        industryTypeId: industry
    };

    const bodyString = JSON.stringify(bodyObj);
    const checksum = await PaytmChecksum.generateSignature(bodyString, mkey);

    const payload = {
        body: bodyObj,
        head: {
            signature: checksum
        }
    };

    console.log(`Testing MID: ${mid}`);
    try {
        const response = await axios.post(
            `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Result:', response.data.body.resultInfo.resultCode, response.data.body.resultInfo.resultMsg);
    } catch (e) {
        console.log('Error:', e.message);
    }
}

async function runAll() {
    const originalMid = process.env.PAYTM_MID?.trim();
    // Test Original
    await test(originalMid, "WEBSTAGING", "WEB", "Retail");
    // Test Uppercase
    await test(originalMid.toUpperCase(), "WEBSTAGING", "WEB", "Retail");
}

runAll();
