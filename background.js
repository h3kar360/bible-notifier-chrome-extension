let bookNameCount = [];
let time = 0;

// chrome.windows.onCreated.addListener(() => {
//     chrome.tabs.create({url:"https://pastpapers.papacambridge.com/viewer/caie/as-and-a-level-physics-9702-topical-questions-with-answers-physics-9702-paper-1-answers-all-topics-pdf"});
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "fromPopupScript") {
        const value = message.value;

        time = parseInt(value, 10);

        chrome.alarms.create("notifTime", {
            periodInMinutes: time
        });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if(alarm.name === "notifTime"){
        generateVerse();
    }
});

const notif = (data) => {
    const { bookname, chapter, verse, text } = data[0];   

    chrome.notifications.create({
        title: bookname + " " + chapter + ":" + verse,
        message: text,
        iconUrl: "assets/bible_icon.png",
        type: "basic"
    }, (notifId) => {
        chrome.notifications.onClicked.addListener((clicked) => {
            bookNameCount = bookname.split(" ");

            if(clicked === notifId && bookNameCount.length === 1){
                chrome.tabs.create({ 
                    url:"https://biblegateway.com/passage/?search=" + bookname + "+" + chapter + "%3A" + verse +"&version=NET"
                });
            }else if(clicked === notifId && bookNameCount.length === 2){
                chrome.tabs.create({ 
                    url:"https://biblegateway.com/passage/?search=" + bookNameCount[0] + "+" + bookNameCount[1] + "+" + chapter + "%3A" + verse +"&version=NET"
                });
            }
        });
    });
}

const generateVerse = async () => {
    const res = await fetch("https://labs.bible.org/api/?passage=random&type=json");
    const data = await res.json();

    notif(data);    
}


