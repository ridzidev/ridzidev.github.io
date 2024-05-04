<!DOCTYPE html>
<html>
<head>
    <title>Generate Digits of Pi</title>
    <style>
        div {
            word-wrap: break-word;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div id="output"></div>
    <button onclick="start()">Start</button>
    <button onclick="stop()">Stop</button>
    <button onclick="continueGenerating()">Continue</button>

    <script>
        let iter;
        let output = document.getElementById('output');
        let running = false;

        function* generateDigitsOfPi() {
            let q = 1n;
            let r = 180n;
            let t = 60n;
            let i = 2n;
            while (true) {
                let digit = ((i * 27n - 12n) * q + r * 5n) / (t * 5n);
                yield Number(digit);
                let u = i * 3n;
                u = (u + 1n) * 3n * (u + 2n);
                r = u * 10n * (q * (i * 5n - 2n) + r - t * digit);
                q *= 10n * i * (i++ * 2n - 1n);
                t *= u;
            }
        }

        function start() {
            if (!running) {
                iter = generateDigitsOfPi();
                running = true;
                displayTenNextDigits();
            }
        }

        function stop() {
            running = false;
        }

        function continueGenerating() {
            if (!running) {
                running = true;
                displayTenNextDigits();
            }
        }

        function displayTenNextDigits() {
            if (!running) {
                return;
            }

            let digits = "";
            for (let i = 0; i < 10; i++) {
                digits += iter.next().value;
            }
            output.insertAdjacentHTML("beforeend", digits);
            scrollTo(0, document.body.scrollHeight);
            requestAnimationFrame(displayTenNextDigits);
        }
    </script>
</body>
</html>