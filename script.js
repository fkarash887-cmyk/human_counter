const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
    });
    video.srcObject = stream;
    return new Promise(resolve => {
        video.onloadedmetadata = () => resolve(video);
    });
}

async function run() {
    await setupCamera();
    video.play();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const model = await cocoSsd.load();

    async function detect() {
        const predictions = await model.detect(video);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        predictions.forEach(pred => {
            if (pred.class === "person") {
                const [x, y, w, h] = pred.bbox;

                ctx.strokeStyle = "lime";
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, w, h);

                ctx.fillStyle = "lime";
                ctx.fillText(
                    `Человек (${Math.round(pred.score * 100)}%)`,
                    x,
                    y > 10 ? y - 5 : 10
                );
            }
        });

        requestAnimationFrame(detect);
    }

    detect();
}

run();
