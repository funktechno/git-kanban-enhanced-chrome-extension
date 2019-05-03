(function () {
    "use strict";
    let repoMetaHtml = "";
    let metaStatus = "wait";
    /* Fetch meta for the page ASAP and get it ready for it to be available when window loads.
     * Callback is optional, it'll passed when window loads, before meta is ready.
     */
    const getRepoMetaHtml = function (callback) {
        var url = window.location.pathname.split("/"),
            user = url[1],
            repo = url[2],
            data = user + "/" + repo;
        if (!repo) {
            metaStatus = "na";
            return;
        }

        var issueRequest = JSON.stringify({ data, location: window.location })

        chrome.runtime.sendMessage({ "getIssues": issueRequest }, function (htmlResponse) {
            console.log(data)
            console.log(htmlResponse)
            repoMetaHtml = htmlResponse;
            metaStatus = "ready";
            if (callback) {
                callback();
            }
        });
        chrome.runtime.sendMessage({ "getRepoMeta": data }, function (htmlResponse) {
            console.log(data)
            console.log(htmlResponse)
            repoMetaHtml = htmlResponse;
            metaStatus = "ready";
            if (callback) {
                callback();
            }
        });
    };

    function getKanbanDetails() {
        var url = window.location.pathname.split("/"),
            user = url[1],
            repo = url[2],
            data = user + "/" + repo;
        if (!repo) {
            metaStatus = "na";
            return;
        }

        var issueRequest = JSON.stringify({ data, location: window.location })

        // add kanban on left if in a group or repo view
        switch (window.location.host) {
            case "github.com":

                break;
            case "bitbucket.org":

                break;
            case "gitlab.com":
                gitlab.render();
                break;

            default:
                // get project type from options
                break;
        }

        // chrome.runtime.sendMessage({"getIssues" : issueRequest}, function (htmlResponse) {
        //     console.log(data)
        //     console.log(htmlResponse)
        //     repoMetaHtml = htmlResponse;
        //     metaStatus = "ready";
        //     if (callback) {
        //         callback();
        //     }
        // });
    }

    /* Inject the html into page pseudo*/
    const insertMetaInPage = function () {
        var targetEl = document.getElementsByClassName("pagehead")[0].getElementsByClassName("container")[1];
        targetEl.insertAdjacentHTML('beforeend', repoMetaHtml);
    };

    /* Inject the html into page safely*/
    const inject = function () {
        if (metaStatus === "na") {
            return;
        }
        /* If meta is still not ready, try fetching it again, this time pass the callback to care of the rest */
        if (metaStatus === "wait") {
            // getRepoMetaHtml(insertMetaInPage);
            getKanbanDetails()
        } else {
            // insertMetaInPage();
        }
    };

    window.onload = function () {
        inject();
    };

    // getKanbanDetails()
    // getRepoMetaHtml();
})();
