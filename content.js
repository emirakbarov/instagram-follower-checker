document.getElementById("username-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputtedUsername = document.getElementById("username").value;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // returns first tab in array and names it tab

    const removeVerifiedAccounts = document.getElementById("verified-bool").checked;
    const removalRange = parseInt(document.getElementById("removal-range").value) || 0;
    console.log(removalRange);

    chrome.storage.local.clear()

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async (inputtedUsername, removeVerifiedAccounts, removalRange) => {
            const username = inputtedUsername;
            let followers = [], followings = [], dontFollowMeBack = [], iDontFollowBack = [];

            const shouldInclude = async (user) => {
                if (removeVerifiedAccounts && user.is_verified) return false;

                if (removalRange > 0) {
                    try {
                        const html = await res.text();
                        const json = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)?.[1] ?? "{}");
                        const count = json?.mainEntityofPage?.interactionStatistic?.userInteractionCount;

                        if (count && count > removalRange) return false;
                    } catch (err) {
                        console.log(err)
                        alert("Failed to fetch follower count for", user.username)
                    }
                }
                return true;
            }

            try {
                console.log("Process has started!");
            
                const userQueryRes = await fetch(
                    `https://www.instagram.com/web/search/topsearch/?query=${username}`, { credentials: "include" }
                );
                const userQueryJson = await userQueryRes.json();
                const userId = userQueryJson.users.map(u => u.user)
                                                .filter(
                                                    u => u.username === username
                                                )[0].pk;
            
                let after = null, has_next = true;
            
                // Get followers: 

                while (has_next) {
                    const res = await fetch(
                        `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
                        encodeURIComponent(
                            JSON.stringify({
                            id: userId,
                            include_reel: true,
                            fetch_mutual: true,
                            first: 50,
                            after: after,
                            })
                        ), { credentials: "include" }
                    );
                    const json = await res.json();
                    has_next = json.data.user.edge_followed_by.page_info.has_next_page;
                    after = json.data.user.edge_followed_by.page_info.end_cursor;
                    followers = followers.concat(
                        json.data.user.edge_followed_by.edges
                            .map(({ node }) => node)
                            .filter(shouldInclude)
                            .map((node) => ({
                                username: node.username,
                                full_name: node.full_name,
                        }))
                    );
                }
            
                console.log({ followers });
            
                after = null, has_next = true;
            
                while (has_next) {
                    const res = await fetch(
                        `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
                        encodeURIComponent(
                            JSON.stringify({
                            id: userId,
                            include_reel: true,
                            fetch_mutual: true,
                            first: 50,
                            after: after,
                            })
                        ), { credentials: "include" }
                    );
                    const json = await res.json();
                    has_next = json.data.user.edge_follow.page_info.has_next_page;
                    after = json.data.user.edge_follow.page_info.end_cursor;
                    followings = followings.concat(
                        json.data.user.edge_follow.edges
                            .map(({ node }) => node)
                            .filter(shouldInclude)
                            .map((node) => ({
                                username: node.username,
                                full_name: node.full_name,
                        }))
                    );
                }
            
                console.log({ followings });
            
                dontFollowMeBack = followings.filter((following) => {
                    return !followers.find(
                        (follower) => follower.username === following.username
                    );
                });
            
                console.log({ dontFollowMeBack });
            
                iDontFollowBack = followers.filter((follower) => {
                return !followings.find(
                    (following) => following.username === follower.username
                );
                });
            
                console.log({ iDontFollowBack });
                
                await chrome.storage.local.set({"followers": JSON.stringify(followers)});
                await chrome.storage.local.set({"followings": JSON.stringify(followings)});
                await chrome.storage.local.set({"dontFollowMeBack": JSON.stringify(dontFollowMeBack)});
                await chrome.storage.local.set({"iDontFollowBack": JSON.stringify(iDontFollowBack)});
            
                console.log("Process is done!");
            } catch (err) {
                console.log("Something went wrong:", err);
            }
        }, args: [inputtedUsername, removeVerifiedAccounts, removalRange]
    }).then(() => {
        chrome.tabs.create({ url: chrome.runtime.getURL("results.html") });
    }).catch(err => console.log(err));
});