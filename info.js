document.addEventListener("DOMContentLoaded", () => {
    const rangeInput = document.getElementById("slider");
    const timeDisplay = document.getElementById("time");
   
    chrome.storage.sync.get({ "time": 0 }, (data) => {
        let currTime = data.time;

        rangeInput.value = currTime;
        timeDisplay.innerHTML = currTime + " min";

        chrome.runtime.sendMessage({ type: "fromPopupScript", value: currTime });

        rangeInput.addEventListener("input", () => {
            let sliderValue = rangeInput.value;

            timeDisplay.innerHTML = sliderValue + " min";

            chrome.runtime.sendMessage({ type: "fromPopupScript", value: sliderValue });

            chrome.storage.sync.set({ "time": sliderValue });
        });
    });
});
