import fetch from 'node-fetch';
async function test() {
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification", {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream"
            },
            body: Buffer.from("fake image data")
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
