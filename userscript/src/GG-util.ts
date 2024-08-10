
// https://stackoverflow.com/a/61511955
function waitForElm(selector: string): Promise<HTMLElement> {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector) as HTMLElement);
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector) as HTMLElement);
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const sleep = (ms: number = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}