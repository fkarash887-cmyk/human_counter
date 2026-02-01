const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const counter = document.getElementById("counter");

async function main() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    await new Promise(r => video.onloadedmetadata = r);
    video.play();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const model = await cocoSsd.load();
    console.log("MODEL OK");

    async function detect() {
        const predictions = await model.detect(video);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // считаем людей
        const people = predictions.filter(
            p => p.class === "person" && p.score > 0.5
        );

        counter.textContent = `Людей: ${people.length}`;

        people.forEach(p => {
            const [x, y, w, h] = p.bbox;

            ctx.strokeStyle = "lime";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, w, h);

            ctx.fillStyle = "lime";
            ctx.fillText(
                `${Math.round(p.score * 100)}%`,
                x,
                y > 10 ? y - 5 : 10
            );
        });

        setTimeout(detect, 200);
    }

    detect();
}

main();
